import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  BarChart3,
  CheckCircle2,
  Copy,
  Download,
  LayoutDashboard,
  Link,
  LogOut,
  Plus,
  Settings,
  Star,
  Trash2,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Business = {
  id: string;
  name: string;
  user_id: string;
  subscription_active: boolean;
};

type Feedback = {
  id: string;
  business_id: string;
  rating: number;
  message: string | null;
  created_at: string;
};

type ReviewLink = {
  id: string;
  business_id: string;
  platform_name: string;
  url: string;
};

export default function Dashboard() {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [business, setBusiness] = useState<Business | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [reviewLinks, setReviewLinks] = useState<ReviewLink[]>([]);
  const [newPlatform, setNewPlatform] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "analytics" | "configuration"
  >("dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, navigate, user]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const { data: biz } = await supabase
      .from("businesses")
      .select("*")
      .eq("user_id", user!.id)
      .maybeSingle();

    if (biz) {
      setBusiness(biz as Business);
      setBusinessName((biz as Business).name);

      const [{ data: fb }, { data: links }] = await Promise.all([
        supabase
          .from("feedback")
          .select("*")
          .eq("business_id", biz.id)
          .order("created_at", { ascending: false }),
        supabase.from("review_links").select("*").eq("business_id", biz.id),
      ]);

      setFeedbacks((fb as Feedback[]) || []);
      setReviewLinks((links as ReviewLink[]) || []);
    }
    setLoading(false);
  };

  const reviewUrl = business
    ? `${window.location.origin}/review/${business.id}`
    : "";
  const totalFeedback = feedbacks.length;
  const averageRating = totalFeedback
    ? feedbacks.reduce((sum, item) => sum + item.rating, 0) / totalFeedback
    : 0;
  const averageRatingText = totalFeedback ? averageRating.toFixed(1) : "--";
  const feedbackThisMonth = feedbacks.filter((item) => {
    const date = new Date(item.created_at);
    const now = new Date();
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }).length;
  const activeLinks = reviewLinks.length;
  const latestFeedback = feedbacks.slice(0, 8);

  const pageTitle =
    activeTab === "dashboard"
      ? "Dashboard"
      : activeTab === "analytics"
        ? "Analytics"
        : "Configuration";

  const pageDescription =
    activeTab === "dashboard"
      ? `Growth overview for ${business?.name || "your business"}`
      : activeTab === "analytics"
        ? "Usage and engagement data from your current account"
        : "Manage business profile, links, and review collection assets";

  const trendData = Array.from({ length: 4 }, (_, weekIdx) => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - (3 - weekIdx) * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const weekCount = feedbacks.filter((fb) => {
      const fbDate = new Date(fb.created_at);
      return fbDate >= weekStart && fbDate < weekEnd;
    }).length;

    return {
      week: `Week ${weekIdx + 1}`,
      count: weekCount,
    };
  });

  const copyLink = () => {
    navigator.clipboard.writeText(reviewUrl);
    toast.success("Link copied!");
  };

  const downloadQR = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, 300, 300);
      ctx.drawImage(img, 0, 0, 300, 300);
      const link = document.createElement("a");
      link.download = "review-qr-code.png";
      link.href = canvas.toDataURL();
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const updateBusinessName = async () => {
    if (!business || !businessName.trim()) return;
    await supabase
      .from("businesses")
      .update({ name: businessName.trim() })
      .eq("id", business.id);
    setBusiness({ ...business, name: businessName.trim() });
    toast.success("Business name updated!");
  };

  const addReviewLink = async () => {
    if (!business || !newPlatform.trim() || !newUrl.trim()) return;
    const { data } = await supabase
      .from("review_links")
      .insert({
        business_id: business.id,
        platform_name: newPlatform.trim(),
        url: newUrl.trim(),
      })
      .select()
      .single();

    if (data) {
      setReviewLinks([...reviewLinks, data as ReviewLink]);
      setNewPlatform("");
      setNewUrl("");
      toast.success("Review link added!");
    }
  };

  const deleteReviewLink = async (id: string) => {
    await supabase.from("review_links").delete().eq("id", id);
    setReviewLinks(reviewLinks.filter((l) => l.id !== id));
    toast.success("Link removed");
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (business && !business.subscription_active) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Subscription Inactive</CardTitle>
            <CardDescription>
              Please activate your subscription to access the dashboard.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <header className="sticky top-0 z-30 bg-transparent px-4 pt-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-slate-300 bg-white px-4 py-3 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-lg font-bold text-white shadow-sm">
                GP
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  GrowthPilot
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  Growth Command Center
                </p>
              </div>
            </div>

            <nav className="flex items-center gap-1 rounded-xl border border-slate-300 bg-slate-100 p-1">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                  activeTab === "dashboard"
                    ? "bg-slate-950 text-white shadow-sm"
                    : "text-slate-700 hover:bg-white hover:text-blue-900"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </span>
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                  activeTab === "analytics"
                    ? "bg-slate-950 text-white shadow-sm"
                    : "text-slate-700 hover:bg-white hover:text-blue-900"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" /> Analytics
                </span>
              </button>
              <button
                onClick={() => setActiveTab("configuration")}
                className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                  activeTab === "configuration"
                    ? "bg-slate-950 text-white shadow-sm"
                    : "text-slate-700 hover:bg-white hover:text-blue-900"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Settings className="h-4 w-4" /> Configuration
                </span>
              </button>
            </nav>

            <div className="ml-auto flex items-center gap-3">
              <div className="hidden rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500 shadow-sm lg:block">
                {user?.email || "Signed in"}
              </div>
              <Button
                variant="outline"
                className="border-slate-300 bg-white px-3 text-slate-900 hover:bg-slate-100"
                onClick={() => {
                  signOut();
                  navigate("/auth");
                }}
              >
                <LogOut className="mr-1 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 pb-10 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-7">
          <section className="relative overflow-hidden rounded-3xl border border-blue-200 bg-white px-6 py-6 shadow-sm sm:px-8">
            <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-blue-700">
                  GrowthPilot
                </p>
                <h1 className="mt-2 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
                  {pageTitle}
                </h1>
                <p className="mt-3 max-w-xl text-lg text-slate-600">
                  {pageDescription}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-900">
                  <span className="h-2 w-2 rounded-full bg-blue-700" />
                  24 Feb - 12 Mar, 2026
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Total
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {totalFeedback}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-900 bg-slate-900 p-4 text-center text-white shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                    This Month
                  </p>
                  <p className="mt-2 text-3xl font-bold">{feedbackThisMonth}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Platforms
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {activeLinks}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {activeTab === "dashboard" && (
            <>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.7fr]">
                <Card className="glass-card glass-card-hover">
                  <CardHeader>
                    <CardTitle className="text-lg">Overall Rating</CardTitle>
                    <CardDescription>
                      Your average private feedback score
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-7">
                    <div className="relative h-36 w-36">
                      <svg
                        className="h-full w-full -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#E2E8F0"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#1D4ED8"
                          strokeWidth="8"
                          strokeDasharray={`${(averageRating / 5) * 251.2} 251.2`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-slate-900">
                          {averageRatingText}
                        </span>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-slate-600">
                      Based on {totalFeedback} submitted responses
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-card glass-card-hover">
                  <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-lg">Feedback Trend</CardTitle>
                      <CardDescription>
                        Weekly movement across your feedback pipeline
                      </CardDescription>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-lg border border-slate-200 bg-white px-2 py-2">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
                          Total
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          {totalFeedback}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-white px-2 py-2">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
                          Month
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          {feedbackThisMonth}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-white px-2 py-2">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
                          Links
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          {activeLinks}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={230}>
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis
                          dataKey="week"
                          stroke="#334155"
                          style={{ fontSize: "12px" }}
                        />
                        <YAxis stroke="#334155" style={{ fontSize: "12px" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #CBD5E1",
                            borderRadius: "12px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#1D4ED8"
                          strokeWidth={3}
                          dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <Card className="glass-card glass-card-hover">
                  <CardHeader>
                    <CardTitle className="text-lg">Latest Feedback</CardTitle>
                    <CardDescription>
                      Most recent responses from your customers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="max-h-[34rem] space-y-3 overflow-y-auto pr-1">
                    {latestFeedback.length === 0 ? (
                      <div className="py-8 text-center text-slate-500">
                        <p>No feedback yet</p>
                      </div>
                    ) : (
                      latestFeedback.map((fb) => (
                        <div
                          key={fb.id}
                          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((value) => (
                                <Star
                                  key={value}
                                  className={`h-4 w-4 ${
                                    value <= fb.rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-xs text-slate-500">
                              {new Date(fb.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-sm leading-relaxed text-slate-700">
                            {fb.message || "No message"}
                          </p>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="glass-card glass-card-hover">
                  <CardHeader>
                    <CardTitle className="text-lg">Business Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                        Business Name
                      </p>
                      <p className="mt-1 text-xl font-bold text-gray-900">
                        {business?.name || "Not Set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                        Status
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        {business?.subscription_active ? (
                          <>
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <span className="text-sm font-semibold text-green-600">
                              Active
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="h-5 w-5 text-red-500">X</span>
                            <span className="text-sm font-semibold text-red-600">
                              Inactive
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card glass-card-hover lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Link className="h-5 w-5 text-blue-600" />
                      Review Platform Links
                    </CardTitle>
                    <CardDescription>
                      Manage your review destinations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {reviewLinks.length === 0 ? (
                      <div className="py-6 text-center text-gray-500">
                        <p className="text-sm">
                          No review links configured yet
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {reviewLinks.map((link) => (
                          <div
                            key={link.id}
                            className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 transition hover:bg-gray-100"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-gray-900">
                                {link.platform_name}
                              </p>
                              <p className="mt-1 truncate text-xs text-gray-500">
                                {link.url}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteReviewLink(link.id)}
                              className="ml-2"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {activeTab === "analytics" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Card className="glass-card glass-card-hover">
                <CardHeader>
                  <CardTitle className="text-base">Team Members</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <p className="text-5xl font-bold text-blue-700">1</p>
                    <p className="text-lg text-gray-400">/ 10</p>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                        Usage
                      </span>
                      <span className="rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-sm font-bold text-blue-700">
                        10%
                      </span>
                    </div>
                    <div className="metric-track">
                      <div
                        className="metric-fill bg-blue-600"
                        style={{ width: "10%" }}
                      >
                        <span className="metric-knob" />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-gray-600">
                    Seats currently used
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card glass-card-hover">
                <CardHeader>
                  <CardTitle className="text-base">Active Channels</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-5xl font-bold text-blue-700">
                    {activeLinks}
                  </p>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                        Platforms
                      </span>
                      <span className="rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-sm font-bold text-blue-700">
                        {Math.min(100, activeLinks * 20)}%
                      </span>
                    </div>
                    <div className="metric-track">
                      <div
                        className="metric-fill bg-blue-600"
                        style={{ width: `${Math.min(100, activeLinks * 20)}%` }}
                      >
                        <span className="metric-knob" />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-gray-600">
                    Connected review platforms
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card glass-card-hover">
                <CardHeader>
                  <CardTitle className="text-base">Reviews Collected</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-5xl font-bold text-blue-700">
                    {totalFeedback}
                  </p>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                        Progress
                      </span>
                      <span className="rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-sm font-bold text-blue-700">
                        {Math.min(100, totalFeedback * 10)}%
                      </span>
                    </div>
                    <div className="metric-track">
                      <div
                        className="metric-fill bg-blue-600"
                        style={{
                          width: `${Math.min(100, totalFeedback * 10)}%`,
                        }}
                      >
                        <span className="metric-knob" />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-gray-600">
                    Total feedback entries
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card glass-card-hover lg:col-span-3">
                <CardHeader>
                  <CardTitle>Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                      Team
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      1 Member
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      Scale to 10 seats on current plan
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                      Integrations
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      {activeLinks} Active
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      Review platforms connected
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                      Feedback
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      {feedbackThisMonth} This Month
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      Private review activity
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "configuration" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="glass-card glass-card-hover">
                <CardHeader>
                  <CardTitle>Business Configuration</CardTitle>
                  <CardDescription>
                    Update your profile and settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Business Name</Label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Input
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Your Business Name"
                        className="bg-white"
                      />
                      <Button
                        onClick={updateBusinessName}
                        className="whitespace-nowrap"
                      >
                        Save Name
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Review Link</Label>
                    <div className="flex gap-2">
                      <Input value={reviewUrl} readOnly className="bg-white" />
                      <Button variant="outline" size="icon" onClick={copyLink}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm font-semibold text-gray-700">
                      Download QR Code
                    </p>
                    {reviewUrl && (
                      <QRCodeSVG id="qr-code" value={reviewUrl} size={150} />
                    )}
                    <Button variant="outline" size="sm" onClick={downloadQR}>
                      <Download className="mr-1 h-4 w-4" /> Download QR
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card glass-card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="h-5 w-5 text-blue-600" />
                    Review Platforms
                  </CardTitle>
                  <CardDescription>
                    Manage destinations for positive reviews
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="max-h-64 space-y-2 overflow-y-auto pr-2">
                    {reviewLinks.length === 0 && (
                      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-500">
                        No platform links yet
                      </div>
                    )}
                    {reviewLinks.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 transition hover:bg-gray-100"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {item.platform_name}
                          </p>
                          <p className="truncate text-xs text-gray-500">
                            {item.url}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteReviewLink(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 border-t border-gray-200 pt-4">
                    <Label>Add New Platform</Label>
                    <div className="grid gap-2 md:grid-cols-[1fr_1.4fr_auto]">
                      <Input
                        placeholder="Platform name"
                        value={newPlatform}
                        onChange={(e) => setNewPlatform(e.target.value)}
                        className="bg-white"
                      />
                      <Input
                        placeholder="Platform URL"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        className="bg-white"
                      />
                      <Button
                        onClick={addReviewLink}
                        className="whitespace-nowrap"
                      >
                        <Plus className="mr-1 h-4 w-4" /> Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
