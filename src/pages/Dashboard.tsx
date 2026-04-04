import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  BarChart3,
  Copy,
  Download,
  LayoutDashboard,
  Link,
  LogOut,
  Plus,
  Settings,
  Star,
  Trash2,
  User,
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
import dashboardBg from "@/assets/bg.png";

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
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showBusinessQr, setShowBusinessQr] = useState(false);
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [selectedFeedbackIds, setSelectedFeedbackIds] = useState<string[]>([]);
  const [isDeletingFeedback, setIsDeletingFeedback] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [feedbackDeleteDialogOpen, setFeedbackDeleteDialogOpen] =
    useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, navigate, user]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!profileMenuRef.current) return;
      if (!profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

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
  const latestFeedback = useMemo(() => feedbacks.slice(0, 8), [feedbacks]);
  const feedbackPerPage = 2;
  const feedbackPageCount = Math.max(
    1,
    Math.ceil(latestFeedback.length / feedbackPerPage),
  );
  const paginatedFeedback = latestFeedback.slice(
    (feedbackPage - 1) * feedbackPerPage,
    feedbackPage * feedbackPerPage,
  );

  useEffect(() => {
    setFeedbackPage(1);
  }, [latestFeedback.length]);

  useEffect(() => {
    if (feedbackPage > feedbackPageCount) {
      setFeedbackPage(feedbackPageCount);
    }
  }, [feedbackPage, feedbackPageCount]);

  useEffect(() => {
    setSelectedFeedbackIds((prev) =>
      prev.filter((id) =>
        latestFeedback.some((feedback) => feedback.id === id),
      ),
    );
  }, [latestFeedback]);

  const selectedOnCurrentPageCount = paginatedFeedback.filter((feedback) =>
    selectedFeedbackIds.includes(feedback.id),
  ).length;
  const allCurrentPageSelected =
    paginatedFeedback.length > 0 &&
    paginatedFeedback.every((feedback) =>
      selectedFeedbackIds.includes(feedback.id),
    );

  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59,
    999,
  );

  const previousMonthFeedback = feedbacks.filter((item) => {
    const date = new Date(item.created_at);
    return date >= previousMonthStart && date <= previousMonthEnd;
  }).length;

  const feedbackDeltaPercent =
    previousMonthFeedback === 0
      ? feedbackThisMonth > 0
        ? 100
        : 0
      : Math.round(
          ((feedbackThisMonth - previousMonthFeedback) /
            previousMonthFeedback) *
            100,
        );

  const monthlyGoal = Math.max(15, activeLinks * 10 || 15);
  const monthlyProgress = Math.min(
    100,
    Math.round((feedbackThisMonth / monthlyGoal) * 100),
  );

  const dateRangeLabel = `${currentMonthStart.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  })} - ${now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  })}, ${now.getFullYear()}`;

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

  const deleteFeedback = async (ids: string[]) => {
    if (!business || ids.length === 0) return;

    setIsDeletingFeedback(true);
    const { error } = await supabase
      .from("feedback")
      .delete()
      .eq("business_id", business.id)
      .in("id", ids);

    if (error) {
      toast.error("Failed to delete feedback");
      setIsDeletingFeedback(false);
      return;
    }

    setFeedbacks((prev) =>
      prev.filter((feedback) => !ids.includes(feedback.id)),
    );
    setSelectedFeedbackIds((prev) => prev.filter((id) => !ids.includes(id)));
    toast.success(ids.length === 1 ? "Comment deleted" : "Comments deleted");
    setIsDeletingFeedback(false);
  };

  const toggleFeedbackSelection = (feedbackId: string, checked: boolean) => {
    setSelectedFeedbackIds((prev) => {
      if (checked) {
        return prev.includes(feedbackId) ? prev : [...prev, feedbackId];
      }

      return prev.filter((id) => id !== feedbackId);
    });
  };

  const toggleCurrentPageSelection = (checked: boolean) => {
    const pageIds = paginatedFeedback.map((feedback) => feedback.id);

    if (checked) {
      setSelectedFeedbackIds((prev) => [
        ...prev,
        ...pageIds.filter((id) => !prev.includes(id)),
      ]);
      return;
    }

    setSelectedFeedbackIds((prev) =>
      prev.filter((id) => !pageIds.includes(id)),
    );
  };

  const requestFeedbackDelete = (ids: string[]) => {
    if (ids.length === 0 || isDeletingFeedback) return;
    setPendingDeleteIds(ids);
    setFeedbackDeleteDialogOpen(true);
  };

  const confirmFeedbackDelete = async () => {
    if (pendingDeleteIds.length === 0) return;
    await deleteFeedback(pendingDeleteIds);
    setFeedbackDeleteDialogOpen(false);
    setPendingDeleteIds([]);
  };

  if (authLoading || loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-fixed bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(248, 250, 252, 0.45), rgba(248, 250, 252, 0.62)), url(${dashboardBg})`,
        }}
      >
        <div className="rounded-2xl border border-white/85 bg-white/80 px-5 py-4 text-slate-600 shadow-sm backdrop-blur-md">
          <div className="animate-pulse">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (business && !business.subscription_active) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-fixed bg-cover bg-center bg-no-repeat px-4"
        style={{
          backgroundImage: `linear-gradient(rgba(248, 250, 252, 0.45), rgba(248, 250, 252, 0.62)), url(${dashboardBg})`,
        }}
      >
        <Card className="w-full max-w-md border border-white/90 bg-white/85 text-center shadow-xl backdrop-blur-md">
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
    <div
      className="min-h-screen bg-fixed bg-cover bg-center bg-no-repeat text-slate-950"
      style={{
        backgroundImage: `linear-gradient(rgba(248, 250, 252, 0.42), rgba(248, 250, 252, 0.56)), url(${dashboardBg})`,
      }}
    >
      <header className="sticky top-0 z-30 bg-transparent px-4 pt-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-300/80 bg-slate-100/90 px-4 py-3 shadow-sm backdrop-blur-md">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex items-center gap-3">
              <BookmarkIcon className="h-7 w-7 text-slate-900" />
              <p className="text-base font-bold tracking-tight text-slate-900 sm:text-2xl">
                FeedbackView
              </p>
            </div>

            <div className="ml-auto flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <nav className="flex w-full items-center gap-1 overflow-x-auto rounded-xl border border-slate-300/80 bg-white/75 p-1 backdrop-blur-sm sm:w-auto">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition sm:px-3.5 ${
                    activeTab === "dashboard"
                      ? "bg-teal-600 text-white shadow-sm"
                      : "text-slate-700 hover:bg-white hover:text-teal-700"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition sm:px-3.5 ${
                    activeTab === "analytics"
                      ? "bg-teal-600 text-white shadow-sm"
                      : "text-slate-700 hover:bg-white hover:text-teal-700"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Analytics</span>
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("configuration")}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition sm:px-3.5 ${
                    activeTab === "configuration"
                      ? "bg-teal-600 text-white shadow-sm"
                      : "text-slate-700 hover:bg-white hover:text-teal-700"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Configuration</span>
                  </span>
                </button>
              </nav>

              <div
                className="relative self-end sm:self-auto"
                ref={profileMenuRef}
              >
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-300 bg-white/90 text-slate-700 shadow-sm backdrop-blur-sm transition hover:bg-white"
                  aria-label="Open profile menu"
                >
                  <User className="h-5 w-5" />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-xl border border-slate-300/90 bg-white/95 p-3 shadow-lg backdrop-blur-sm">
                    <div className="mb-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
                      {user?.email || "Signed in"}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-slate-300 bg-white px-3 text-slate-900 hover:bg-slate-100"
                      onClick={() => {
                        signOut();
                        navigate("/auth");
                      }}
                    >
                      <LogOut className="mr-1 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 pb-10 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-7">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_1fr]">
            <section className="relative overflow-hidden rounded-3xl border-2 border-slate-400/80 bg-gradient-to-br from-white/90 to-slate-50/80 px-6 py-6 shadow-sm backdrop-blur-md sm:px-8">
              <div className="relative grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.34em] text-blue-700">
                    FeedbackView
                  </p>
                  <h1 className="mt-2 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
                    {pageTitle}
                  </h1>
                  <p className="mt-3 max-w-xl text-lg text-slate-600">
                    {pageDescription}
                  </p>
                  <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-teal-300 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-800">
                    <span className="h-2 w-2 rounded-full bg-teal-600" />
                    {dateRangeLabel}
                  </div>

                  <div className="mt-4 max-w-xl rounded-xl border border-slate-300/80 bg-white/75 px-4 py-3 shadow-sm backdrop-blur-sm">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                      <span>Monthly Goal</span>
                      <span>
                        {feedbackThisMonth} / {monthlyGoal}
                      </span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-teal-600 to-blue-600"
                        style={{ width: `${monthlyProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full space-y-3 lg:self-start">
                  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex min-h-[164px] w-full flex-col items-center justify-center rounded-2xl border-2 border-slate-300 bg-white/90 p-4 text-center shadow-sm backdrop-blur-sm">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                        Total
                      </p>
                      <p className="mt-2 text-3xl font-bold text-slate-900">
                        {totalFeedback}
                      </p>
                    </div>
                    <div className="flex min-h-[164px] w-full flex-col items-center justify-center rounded-2xl border-2 border-slate-800 bg-gradient-to-br from-teal-600 to-blue-600 p-4 text-center text-white shadow-sm">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-100">
                        This Month
                      </p>
                      <p className="mt-2 text-3xl font-bold">
                        {feedbackThisMonth}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-300/80 bg-white/75 px-4 py-3 shadow-sm backdrop-blur-sm">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Average Rating
                      </p>
                      <p className="mt-1 text-xl font-bold text-slate-900">
                        {averageRatingText}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-300/80 bg-white/75 px-4 py-3 shadow-sm backdrop-blur-sm">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Monthly Trend
                      </p>
                      <p className="mt-1 text-xl font-bold text-slate-900">
                        {feedbackDeltaPercent > 0 ? "+" : ""}
                        {feedbackDeltaPercent}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <Card className="glass-card glass-card-hover h-full border-2 border-slate-400/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {showBusinessQr ? "Business QR" : "Business Info"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!showBusinessQr && (
                  <>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Name
                      </p>
                      <p className="truncate text-base font-bold text-slate-900">
                        {business?.name || "Not Set"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Status
                      </p>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          business?.subscription_active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {business?.subscription_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Links
                      </p>
                      <p className="text-base font-bold text-slate-900">
                        {activeLinks}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Feedback
                      </p>
                      <p className="text-base font-bold text-slate-900">
                        {totalFeedback}
                      </p>
                    </div>
                  </>
                )}

                {!showBusinessQr && (
                  <div className="pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-300 bg-white/85 text-slate-800 hover:bg-white"
                      onClick={() => setShowBusinessQr(true)}
                    >
                      Show QR
                    </Button>
                  </div>
                )}

                {showBusinessQr && (
                  <div className="space-y-3">
                    <div className="flex justify-center rounded-xl border border-slate-200 bg-white/85 p-3">
                      {reviewUrl ? (
                        <QRCodeSVG id="qr-code" value={reviewUrl} size={112} />
                      ) : (
                        <p className="text-xs font-medium text-slate-500">
                          No review link yet
                        </p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-300 bg-white/85 text-slate-800 hover:bg-white"
                      onClick={downloadQR}
                      disabled={!reviewUrl}
                    >
                      <Download className="mr-1 h-4 w-4" /> Download QR
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-300 bg-white/85 text-slate-800 hover:bg-white"
                      onClick={() => setShowBusinessQr(false)}
                    >
                      Show Info
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

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
                      <div className="rounded-lg border border-teal-200 bg-teal-50 px-2 py-2">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
                          Month
                        </p>
                        <p className="text-sm font-bold text-teal-700">
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
                <Card className="glass-card glass-card-hover border-2 border-slate-400/80">
                  <CardHeader>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Latest Feedback
                        </CardTitle>
                        <CardDescription>
                          Most recent responses from your customers
                        </CardDescription>
                      </div>

                      {latestFeedback.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 self-start">
                          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                            <Checkbox
                              id="select-page-feedback"
                              checked={
                                allCurrentPageSelected
                                  ? true
                                  : selectedOnCurrentPageCount > 0
                                    ? "indeterminate"
                                    : false
                              }
                              onCheckedChange={(checked) =>
                                toggleCurrentPageSelection(checked === true)
                              }
                              disabled={isDeletingFeedback}
                            />
                            <Label
                              htmlFor="select-page-feedback"
                              className="text-xs font-medium text-slate-600"
                            >
                              Select page
                            </Label>
                          </div>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              requestFeedbackDelete(selectedFeedbackIds)
                            }
                            disabled={
                              selectedFeedbackIds.length === 0 ||
                              isDeletingFeedback
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete selected ({selectedFeedbackIds.length})
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {latestFeedback.length === 0 ? (
                      <div className="py-8 text-center text-slate-500">
                        <p>No feedback yet</p>
                      </div>
                    ) : (
                      <>
                        {paginatedFeedback.map((fb) => (
                          <article
                            key={fb.id}
                            className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                          >
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={selectedFeedbackIds.includes(fb.id)}
                                  onCheckedChange={(checked) =>
                                    toggleFeedbackSelection(
                                      fb.id,
                                      checked === true,
                                    )
                                  }
                                  disabled={isDeletingFeedback}
                                  aria-label="Select comment"
                                />
                                <div className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1">
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
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="shrink-0 text-xs font-medium text-slate-500">
                                  {new Date(fb.created_at).toLocaleDateString()}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                                  onClick={() => requestFeedbackDelete([fb.id])}
                                  disabled={isDeletingFeedback}
                                  aria-label="Delete comment"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="line-clamp-4 text-sm leading-relaxed text-slate-700">
                              {fb.message || "No message"}
                            </p>
                          </article>
                        ))}

                        {feedbackPageCount > 1 && (
                          <div className="pt-1">
                            <Pagination>
                              <PaginationContent>
                                <PaginationItem>
                                  <PaginationPrevious
                                    href="#"
                                    onClick={(event) => {
                                      event.preventDefault();
                                      setFeedbackPage((prev) =>
                                        Math.max(1, prev - 1),
                                      );
                                    }}
                                    className={
                                      feedbackPage === 1
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                    }
                                  />
                                </PaginationItem>

                                {Array.from(
                                  { length: feedbackPageCount },
                                  (_, idx) => {
                                    const page = idx + 1;
                                    return (
                                      <PaginationItem key={page}>
                                        <PaginationLink
                                          href="#"
                                          isActive={page === feedbackPage}
                                          onClick={(event) => {
                                            event.preventDefault();
                                            setFeedbackPage(page);
                                          }}
                                        >
                                          {page}
                                        </PaginationLink>
                                      </PaginationItem>
                                    );
                                  },
                                )}

                                <PaginationItem>
                                  <PaginationNext
                                    href="#"
                                    onClick={(event) => {
                                      event.preventDefault();
                                      setFeedbackPage((prev) =>
                                        Math.min(feedbackPageCount, prev + 1),
                                      );
                                    }}
                                    className={
                                      feedbackPage === feedbackPageCount
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                    }
                                  />
                                </PaginationItem>
                              </PaginationContent>
                            </Pagination>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <Card className="glass-card glass-card-hover">
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
                            className="flex items-center justify-between rounded-lg border border-slate-200/90 bg-white/75 p-3 transition hover:bg-white"
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
                    <p className="text-4xl font-bold text-blue-700 sm:text-5xl">
                      1
                    </p>
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
                  <p className="text-4xl font-bold text-blue-700 sm:text-5xl">
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
                  <p className="text-4xl font-bold text-blue-700 sm:text-5xl">
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
                  <div className="rounded-lg border border-slate-200/90 bg-white/75 p-4">
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
                  <div className="rounded-lg border border-slate-200/90 bg-white/75 p-4">
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
                  <div className="rounded-lg border border-slate-200/90 bg-white/75 p-4">
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
                        className="border-slate-200 bg-white/85"
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
                      <Input
                        value={reviewUrl}
                        readOnly
                        className="border-slate-200 bg-white/85"
                      />
                      <Button variant="outline" size="icon" onClick={copyLink}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
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
                        className="flex items-center justify-between rounded-lg border border-slate-200/90 bg-white/75 px-3 py-2 transition hover:bg-white"
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
                        className="border-slate-200 bg-white/85"
                      />
                      <Input
                        placeholder="Platform URL"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        className="border-slate-200 bg-white/85"
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

      <AlertDialog
        open={feedbackDeleteDialogOpen}
        onOpenChange={(open) => {
          setFeedbackDeleteDialogOpen(open);
          if (!open) {
            setPendingDeleteIds([]);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingDeleteIds.length > 1
                ? "Delete selected comments?"
                : "Delete this comment?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDeleteIds.length > 1
                ? `This will permanently remove ${pendingDeleteIds.length} comments from Latest Feedback.`
                : "This will permanently remove the selected comment from Latest Feedback."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingFeedback}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmFeedbackDelete}
              disabled={isDeletingFeedback}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isDeletingFeedback ? "Deleting..." : "Yes, delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function BookmarkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M5 2h14a1 1 0 0 1 1 1v19l-8-5-8 5V3a1 1 0 0 1 1-1z" />
    </svg>
  );
}
