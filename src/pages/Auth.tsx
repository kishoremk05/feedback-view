import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Turnstile } from "@marsidev/react-turnstile";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, Zap } from "lucide-react";
import dashboardBg from "@/assets/bg.png";
export default function Auth() {
  const [searchParams] = useSearchParams();
  const authMode = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(() => authMode !== "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [turnstileRenderKey, setTurnstileRenderKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  const resetCaptcha = () => {
    setCaptchaToken(null);
    setTurnstileRenderKey((prev) => prev + 1);
  };
  useEffect(() => {
    if (authMode === "signup") {
      setIsLogin(false);
      return;
    }

    if (authMode === "signin") {
      setIsLogin(true);
    }
  }, [authMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!turnstileSiteKey) {
      toast.error("Captcha is not configured. Add VITE_TURNSTILE_SITE_KEY.");
      return;
    }

    if (!captchaToken) {
      toast.error("Please complete the captcha challenge.");
      return;
    }

    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password, captchaToken);
      if (error) {
        toast.error(error.message);
      } else {
        navigate("/dashboard");
      }
    } else {
      const { error } = await signUp(email, password, captchaToken);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(
          "Account created! Check your email to confirm, or sign in directly.",
        );
        setIsLogin(true);
      }
    }

    resetCaptcha();
    setLoading(false);
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-fixed bg-cover bg-center bg-no-repeat px-4 py-16"
      style={{
        backgroundImage: `linear-gradient(rgba(248, 250, 252, 0.45), rgba(248, 250, 252, 0.62)), url(${dashboardBg})`,
      }}
    >
      <Link
        to="/"
        className="absolute left-4 top-5 inline-flex items-center gap-2 rounded-xl border border-white/80 bg-white/85 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white sm:left-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <Card className="w-full max-w-md border border-white/90 bg-white/88 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.5)] backdrop-blur-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">
              FeedbackView
            </span>
          </div>
          <CardTitle className="text-xl">
            {isLogin ? "Welcome back" : "Create your account"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Sign in to manage your reviews"
              : "Start collecting customer feedback"}
          </CardDescription>
          <p className="mt-2 text-xs text-slate-500">
            {
              "Create account -> get QR code -> collect feedback -> grow faster."
            }
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-2 inline-flex items-center text-slate-500 transition-colors hover:text-slate-800"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Security Check</Label>
              {turnstileSiteKey ? (
                <Turnstile
                  key={turnstileRenderKey}
                  siteKey={turnstileSiteKey}
                  onSuccess={(token) => {
                    setCaptchaToken(token);
                  }}
                  onExpire={() => {
                    setCaptchaToken(null);
                  }}
                  onError={() => {
                    setCaptchaToken(null);
                    toast.error(
                      "Captcha verification failed. Please try again.",
                    );
                  }}
                  options={{
                    theme: "light",
                    size: "normal",
                    appearance: "always",
                    retry: "auto",
                    execution: "render",
                    action: isLogin ? "signin" : "signup",
                  }}
                />
              ) : (
                <p className="text-sm text-red-600">
                  Captcha not configured. Set VITE_TURNSTILE_SITE_KEY to enable
                  authentication.
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full rounded-xl bg-teal-600 text-white hover:bg-teal-700"
              disabled={loading || !captchaToken || !turnstileSiteKey}
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                resetCaptcha();
              }}
              className="text-primary font-medium hover:underline"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
