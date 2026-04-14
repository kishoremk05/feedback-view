declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type TurnstileVerifyResponse = {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const secret = Deno.env.get("TURNSTILE_SECRET_KEY");

    if (!secret) {
      return Response.json(
        { success: false, error: "Missing TURNSTILE_SECRET_KEY" },
        { status: 500, headers: corsHeaders },
      );
    }

    const { token, action } = (await req.json()) as {
      token?: string;
      action?: string;
    };

    if (!token) {
      return Response.json(
        { success: false, error: "Missing token" },
        { status: 400, headers: corsHeaders },
      );
    }

    const remoteIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const verifyPayload = new URLSearchParams();
    verifyPayload.set("secret", secret);
    verifyPayload.set("response", token);
    if (remoteIp) {
      verifyPayload.set("remoteip", remoteIp);
    }

    const verifyResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: verifyPayload.toString(),
      },
    );

    const verifyData = (await verifyResponse.json()) as TurnstileVerifyResponse;

    if (!verifyData.success) {
      return Response.json(
        {
          success: false,
          error: "Captcha verification failed",
          codes: verifyData["error-codes"] ?? [],
        },
        { status: 401, headers: corsHeaders },
      );
    }

    if (action && verifyData.action && action !== verifyData.action) {
      return Response.json(
        {
          success: false,
          error: "Captcha action mismatch",
        },
        { status: 401, headers: corsHeaders },
      );
    }

    return Response.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { success: false, error: message },
      { status: 500, headers: corsHeaders },
    );
  }
});
