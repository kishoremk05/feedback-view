import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Star, Zap, CheckCircle } from "lucide-react";

export default function ReviewPage() {
  const { businessId } = useParams<{ businessId: string }>();
  const [businessName, setBusinessName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [reviewLinks, setReviewLinks] = useState<
    { platform_name: string; url: string }[]
  >([]);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState<"rate" | "positive" | "negative">("rate");
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!businessId) return;
    const load = async () => {
      const { data: biz } = await supabase
        .from("businesses")
        .select("name")
        .eq("id", businessId)
        .maybeSingle();

      if (!biz) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setBusinessName(biz.name);

      const { data: links } = await supabase
        .from("review_links")
        .select("platform_name, url")
        .eq("business_id", businessId);

      setReviewLinks(links || []);
      setLoading(false);
    };
    load();
  }, [businessId]);

  const handleRate = (r: number) => {
    setRating(r);
    if (r >= 4) {
      setStep("positive");
      const firstPlatformUrl = reviewLinks[0]?.url;
      if (firstPlatformUrl) {
        setRedirectUrl(firstPlatformUrl);
      } else {
        toast.error("No review platform configured for this business yet.");
      }
    } else {
      setStep("negative");
    }
  };

  useEffect(() => {
    if (!redirectUrl) return;

    const timer = window.setTimeout(() => {
      window.location.href = redirectUrl;
    }, 900);

    return () => window.clearTimeout(timer);
  }, [redirectUrl]);

  const submitFeedback = async () => {
    if (!message.trim()) {
      toast.error("Please enter your feedback");
      return;
    }
    const { error } = await supabase
      .from("feedback")
      .insert({ business_id: businessId!, rating, message: message.trim() });

    if (error) {
      toast.error("Failed to submit feedback");
    } else {
      setSubmitted(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="py-12">
            <p className="text-muted-foreground">Business not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl">{businessName}</CardTitle>
        </CardHeader>
        <CardContent>
          {step === "rate" && (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">How was your experience?</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleRate(s)}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-10 w-10 ${
                        s <= (hoverRating || rating)
                          ? "text-warning fill-warning"
                          : "text-muted"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "positive" && (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-success mx-auto" />
              <p className="text-foreground font-medium">
                Thank you! Please leave us a review
              </p>
              <p className="text-sm text-muted-foreground">
                {redirectUrl
                  ? "Redirecting you to the review platform..."
                  : "No review platform configured yet."}
              </p>
              <div className="space-y-2">
                {redirectUrl && (
                  <Button
                    className="w-full"
                    onClick={() => window.location.assign(redirectUrl)}
                  >
                    Continue Now
                  </Button>
                )}
              </div>
            </div>
          )}

          {step === "negative" && !submitted && (
            <div className="space-y-4">
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-5 w-5 ${s <= rating ? "text-warning fill-warning" : "text-muted"}`}
                  />
                ))}
              </div>
              <p className="text-center text-muted-foreground text-sm">
                We'd love to hear how we can improve.
              </p>
              <Textarea
                placeholder="Tell us about your experience..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
              <Button className="w-full" onClick={submitFeedback}>
                Submit Feedback
              </Button>
            </div>
          )}

          {submitted && (
            <div className="text-center space-y-2 py-4">
              <CheckCircle className="h-12 w-12 text-success mx-auto" />
              <p className="font-medium text-foreground">
                Thank you for your feedback!
              </p>
              <p className="text-sm text-muted-foreground">
                We appreciate you taking the time to help us improve.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
