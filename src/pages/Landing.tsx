import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Star,
  CheckCircle,
  BarChart3,
  MessageCircle,
  TrendingUp,
  Zap,
  Plug,
  Shield,
  Mail,
  Link2,
  Search,
  Smartphone,
  Check,
  Plane,
  Package,
  User,
  Briefcase,
  Zap as ZapIcon,
  Menu,
  X,
} from "lucide-react";
import dashboardBg from "@/assets/bg.png";

const features = [
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    desc: "Track reviews, ratings, and sentiment across all platforms in one dashboard.",
  },
  {
    icon: MessageCircle,
    title: "Smart Response Assistant",
    desc: "AI-powered suggestions to respond to reviews professionally and quickly.",
  },
  {
    icon: Shield,
    title: "Reputation Protection",
    desc: "Monitor brand mentions and get alerts for negative feedback instantly.",
  },
  {
    icon: Zap,
    title: "Auto-Review Collection",
    desc: "Automated feedback collection via QR codes, emails, and links.",
  },
  {
    icon: TrendingUp,
    title: "SEO Boost",
    desc: "Improve local search rankings with authentic reviews and ratings.",
  },
  {
    icon: Plug,
    title: "Multi-Platform Integration",
    desc: "Connect Google, Yelp, Facebook, Trustpilot, and 50+ platforms.",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Restaurant Owner",
    icon: Briefcase,
    text: "FeedbackView helped us increase Google rating from 3.2 to 4.8 in 3 months!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "E-commerce Manager",
    icon: Package,
    text: "The automated review requests are a game-changer. We get 5x more reviews now.",
    rating: 5,
  },
  {
    name: "Emma Williams",
    role: "Marketing Director",
    icon: BarChart3,
    text: "Best investment we made this year. The analytics alone are worth it.",
    rating: 5,
  },
  {
    name: "David Patel",
    role: "Clinic Manager",
    icon: Shield,
    text: "Negative feedback alerts helped our team resolve issues before they escalated.",
    rating: 5,
  },
  {
    name: "Olivia Brown",
    role: "Salon Founder",
    icon: User,
    text: "Customers love scanning our QR at checkout. Reviews started coming in daily.",
    rating: 5,
  },
  {
    name: "Noah Garcia",
    role: "Hotel Operations Lead",
    icon: Search,
    text: "We used insights to improve weak areas and saw measurable growth in bookings.",
    rating: 5,
  },
  {
    name: "Ava Thompson",
    role: "Retail Owner",
    icon: Check,
    text: "Setup was easy and the team adopted it in one day. Highly recommended.",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Multi-Location Director",
    icon: Plane,
    text: "Managing reviews across branches is finally simple and consistent.",
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "29",
    desc: "Perfect for small businesses",
    features: [
      "Up to 10 locations",
      "Basic analytics",
      "Email support",
      "100 review requests/month",
    ],
  },
  {
    name: "Professional",
    price: "79",
    desc: "For growing businesses",
    features: [
      "Unlimited locations",
      "Advanced analytics",
      "Priority support",
      "Unlimited review requests",
      "AI Response Assistant",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For large organizations",
    features: [
      "All Professional features",
      "Dedicated account manager",
      "Custom integrations",
      "API access",
      "White-label options",
    ],
  },
];

const playbooks = [
  {
    icon: Mail,
    title: "First 50 Reviews Sprint",
    desc: "A 14-day launch sequence to collect high-quality feedback from your happiest customers.",
    points: [
      "Day-by-day outreach schedule",
      "Ready-to-send email and WhatsApp copy",
      "Smart follow-up cadence after no response",
    ],
  },
  {
    icon: Link2,
    title: "Multi-Channel Capture Flow",
    desc: "Distribute review requests through links, QR, and checkout touchpoints without overwhelming customers.",
    points: [
      "Best placement for review links",
      "QR prompts for in-store teams",
      "Channel mix based on business type",
    ],
  },
  {
    icon: MessageCircle,
    title: "Negative Feedback Recovery",
    desc: "Turn low ratings into resolved conversations with a clear triage and response framework.",
    points: [
      "1-hour response template for urgent issues",
      "Escalation matrix for support teams",
      "Resolution playbook before public follow-up",
    ],
  },
];

const faqs = [
  {
    q: "How long does setup take?",
    a: "Setup takes less than 5 minutes. Just connect your review platforms and start collecting feedback.",
  },
  {
    q: "How do customers submit feedback with QR code?",
    a: "After signup, you get a unique QR code for your business. Customers scan it and submit feedback instantly from their phone.",
  },
  {
    q: "Can I collect both private feedback and public reviews?",
    a: "Yes. You can collect private sentiment first, then direct happy customers to public review platforms to boost your rating.",
  },
  {
    q: "How does FeedbackView help with business growth?",
    a: "Our insights show patterns in customer sentiment, service gaps, and strengths so you can improve operations and increase repeat business.",
  },
  {
    q: "Can I manage multiple business locations?",
    a: "Absolutely. Professional and Enterprise plans support multiple locations with centralized reporting and tracking.",
  },
  {
    q: "Is there a contract or hidden fees?",
    a: "No contracts and no hidden fees. You can upgrade, downgrade, or cancel anytime.",
  },
  {
    q: "Do you offer onboarding support?",
    a: "Yes. We provide setup guidance, best-practice templates, and support to help your team launch quickly.",
  },
  {
    q: "How do I choose the right plan?",
    a: "Start with the plan that matches your current volume and team size. You can upgrade anytime as your business grows.",
  },
];

const feedbackPlanItems = [
  {
    title: "Follow-up with recent 3-star customers",
    detail: "Send recovery message template and offer support callback.",
    status: "done",
  },
  {
    title: "Publish top testimonial to homepage",
    detail: "Highlight highest sentiment feedback in hero social proof block.",
    status: "done",
  },
  {
    title: "Route low-rating alerts to support",
    detail: "Trigger instant notification to support lead for ratings <= 2.",
    status: "done",
  },
  {
    title: "Launch weekend review reminder",
    detail: "Schedule WhatsApp and email reminders for inactive customers.",
    status: "done",
  },
  {
    title: "Tag feedback by location cluster",
    detail: "Separate reviews by branch to spot location-level issues quickly.",
    status: "next",
  },
  {
    title: "A/B test response templates",
    detail: "Compare concise vs empathetic tone across negative feedback.",
    status: "next",
  },
] as const;

const featureFlowLaneStyles = [
  { bar: "bg-[#f5d9be]", dot: "bg-[#c3895d]" },
  { bar: "bg-[#d8c5f4]", dot: "bg-[#8065ba]" },
  { bar: "bg-[#bbcff8]", dot: "bg-[#5f7bc8]" },
];

export default function Landing() {
  const [isNavCompact, setIsNavCompact] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const totalFeedbackTasks = feedbackPlanItems.length;
  const completedFeedbackTasks = feedbackPlanItems.filter(
    (item) => item.status === "done",
  ).length;
  const nextFeedbackTasks = totalFeedbackTasks - completedFeedbackTasks;
  const feedbackExecutionProgress = Math.round(
    (completedFeedbackTasks / totalFeedbackTasks) * 100,
  );

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsNavCompact((prev) => {
        if (y > 80) return true;
        if (y < 20) return false;
        return prev;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealElements.forEach((element) => element.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const delay = Number(element.dataset.delay || 0);

            window.setTimeout(() => {
              element.classList.add("is-revealed");
            }, delay);

            observer.unobserve(element);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-fixed bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(248, 250, 252, 0.42), rgba(248, 250, 252, 0.56)), url(${dashboardBg})`,
      }}
    >
      {/* Navigation */}
      <nav className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
        <div
          className={`mx-auto rounded-[2.2rem] border border-slate-300/80 bg-slate-100/90 px-4 shadow-sm backdrop-blur-md transition-[max-width,padding] duration-300 ease-out sm:px-6 ${
            isNavCompact ? "max-w-5xl py-2.5" : "max-w-7xl py-3"
          }`}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5 shrink-0">
              <BookmarkIcon className="h-6 w-6 text-slate-900" />
              <span className="text-xl font-bold text-slate-900 sm:text-2xl">
                FeedbackView
              </span>
            </div>

            <button
              type="button"
              className="ml-auto inline-flex items-center justify-center rounded-xl border border-slate-300/80 bg-white/80 p-2 text-slate-700 md:hidden"
              onClick={() => setIsMobileNavOpen((prev) => !prev)}
              aria-label="Toggle navigation"
              aria-expanded={isMobileNavOpen}
            >
              {isMobileNavOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
              <a
                href="#features"
                className="text-base font-semibold text-slate-700 transition-colors hover:text-slate-950"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-base font-semibold text-slate-700 transition-colors hover:text-slate-950"
              >
                Pricing
              </a>
              <a
                href="#stories"
                className="text-base font-semibold text-slate-700 transition-colors hover:text-slate-950"
              >
                Success
              </a>
              <a
                href="#playbooks"
                className="text-base font-semibold text-slate-700 transition-colors hover:text-slate-950"
              >
                Playbooks
              </a>
            </div>

            <div className="ml-auto hidden items-center gap-2 sm:gap-3 md:flex">
              <Link
                to="/auth"
                className="hidden text-base font-semibold text-slate-700 transition-colors hover:text-slate-950 sm:inline"
              >
                Login
              </Link>
              <Link to="/auth">
                <Button
                  size="sm"
                  className="rounded-2xl border-2 border-white bg-[#238f93] px-7 py-2 text-sm font-bold text-white shadow-[0_8px_20px_-10px_rgba(15,23,42,0.55)] transition-all hover:bg-[#1e7e82] sm:px-9"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>

          {isMobileNavOpen && (
            <div className="mt-3 space-y-3 border-t border-slate-300/80 pt-3 md:hidden">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="#features"
                  className="rounded-lg border border-slate-300/80 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="rounded-lg border border-slate-300/80 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Pricing
                </a>
                <a
                  href="#stories"
                  className="rounded-lg border border-slate-300/80 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Success
                </a>
                <a
                  href="#playbooks"
                  className="rounded-lg border border-slate-300/80 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Playbooks
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/auth"
                  className="flex-1"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-xl border-slate-300 bg-white/85"
                  >
                    Login
                  </Button>
                </Link>
                <Link
                  to="/auth"
                  className="flex-1"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Button
                    size="sm"
                    className="w-full rounded-xl bg-[#238f93] text-white hover:bg-[#1e7e82]"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 pb-12 pt-28 sm:px-6 lg:px-8 md:pb-20 md:pt-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div
            className="space-y-8 reveal-on-scroll"
            data-reveal
            data-delay="60"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
                Master Your Business Reputation. Turn Customer{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">
                  Feedback into Growth.
                </span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                The centralized platform to collect, analyze, and showcase
                reviews across all platforms. Boost trust, improve local SEO,
                and drive more sales.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 text-base transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Boost Your Growth
                </Button>
              </Link>
            </div>

            {/* Trust Badge */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">
                Trusted by 10,000+ businesses globally
              </p>
              <div className="flex items-center gap-4">
                <Search className="w-5 h-5 text-teal-600" />
                <Star className="w-5 h-5 text-teal-600" />
                <Briefcase className="w-5 h-5 text-teal-600" />
                <Smartphone className="w-5 h-5 text-teal-600" />
              </div>
            </div>
          </div>

          {/* Right - Dashboard Mockup with Custom Illustration */}
          <div
            className="relative reveal-on-scroll motion-float-soft"
            data-reveal
            data-delay="180"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Window Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-xs text-gray-500 ml-4">
                  Review Overview Dashboard
                </span>
              </div>

              {/* Dashboard Content */}
              <div className="p-8 space-y-6">
                {/* Top Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Rating Circle */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24 mb-3">
                      <svg
                        className="w-full h-full transform -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          strokeDasharray="212"
                          strokeDashoffset="32"
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient
                            id="gradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#14b8a6" />
                            <stop offset="100%" stopColor="#0284c7" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-teal-600">
                          4.7
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 font-semibold">
                      Overall Rating
                    </p>
                  </div>

                  {/* Reviews Growth */}
                  <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg p-4">
                    <div className="text-3xl font-bold text-teal-600 mb-1">
                      +28%
                    </div>
                    <p className="text-xs text-gray-600 font-semibold text-center">
                      Reviews Growth
                    </p>
                    <p className="text-xs text-gray-500 mt-2">This month</p>
                  </div>

                  {/* Sentiment Gauge */}
                  <div className="flex flex-col items-center">
                    <div className="flex gap-1 mb-4">
                      <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                      <div className="w-2 h-6 bg-yellow-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <p className="text-xs text-gray-600 font-semibold">
                      Sentiment Mix
                    </p>
                  </div>
                </div>

                {/* Reviews Feed */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <p className="text-xs font-bold text-gray-900 uppercase">
                    Recent Reviews
                  </p>

                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">
                        Excellent service & quick response
                      </p>
                      <p className="text-xs text-gray-600">
                        Google My Business • 2 hours ago
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">
                        Amazing experience, highly recommend
                      </p>
                      <p className="text-xs text-gray-600">
                        Facebook • 5 hours ago
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  to="/auth"
                  className="block w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white text-xs font-bold py-3 rounded-lg hover:shadow-lg transition-all text-center"
                >
                  → View Full Dashboard
                </Link>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-teal-200 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-200 rounded-full opacity-50 blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 reveal-on-scroll" data-reveal>
            <p className="text-teal-600 font-semibold text-sm uppercase mb-2 tracking-wide">
              Powerful Features
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything you need to dominate reviews
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools designed to help you collect, manage, and
              leverage customer reviews.
            </p>
          </div>
          <div
            className="relative hidden lg:block reveal-on-scroll"
            data-reveal
            data-delay="80"
          >
            <div className="relative overflow-hidden rounded-[2.1rem] border border-slate-200/80 bg-gradient-to-br from-[#eff7f5] via-[#edf4fb] to-[#eef7ff] p-8 shadow-[0_24px_65px_rgba(15,23,42,0.08)]">
              <div className="pointer-events-none absolute -left-16 top-10 h-52 w-52 rounded-full bg-[#b6e7df]/40 blur-3xl" />
              <div className="pointer-events-none absolute -right-12 bottom-8 h-48 w-48 rounded-full bg-[#c7dafd]/40 blur-3xl" />
              <div className="pointer-events-none absolute inset-6 rounded-[1.5rem] border border-white/80" />
              <div className="pointer-events-none absolute inset-y-10 left-[24%] border-l border-dashed border-slate-300/80" />
              <div className="pointer-events-none absolute inset-y-10 left-[32%] border-l border-dashed border-slate-300/80" />
              <div className="pointer-events-none absolute inset-y-10 left-[40%] border-l border-dashed border-slate-300/80" />

              <div className="relative min-h-[370px]">
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  viewBox="0 0 1200 370"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M 666 94 C 732 92, 760 120, 794 146 C 826 169, 845 176, 888 172"
                    stroke="#98a2b3"
                    strokeWidth="2"
                    strokeDasharray="3 7"
                  />
                  <path
                    d="M 666 174 C 732 172, 760 187, 794 197 C 826 206, 845 205, 888 200"
                    stroke="#98a2b3"
                    strokeWidth="2"
                    strokeDasharray="3 7"
                  />
                  <path
                    d="M 666 254 C 732 255, 760 246, 794 226 C 826 207, 845 201, 888 204"
                    stroke="#98a2b3"
                    strokeWidth="2"
                    strokeDasharray="3 7"
                  />
                </svg>

                {features.slice(0, 3).map((feature, index) => {
                  const laneStyle =
                    featureFlowLaneStyles[index] || featureFlowLaneStyles[0];
                  const topPosition = 88 + index * 80;

                  return (
                    <div
                      key={feature.title}
                      className={`absolute left-5 flex h-[44px] w-[57%] -translate-y-1/2 items-center justify-between rounded-full ${laneStyle.bar} px-4 shadow-sm ring-1 ring-black/5`}
                      style={{ top: `${topPosition}px` }}
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span
                          className={`h-5 w-5 shrink-0 rounded-full ${laneStyle.dot} border border-white/80`}
                        />
                        <span className="truncate text-sm font-medium text-slate-800">
                          {feature.title}
                        </span>
                      </div>
                      <span className="pl-4 text-sm font-semibold text-slate-500">
                        +
                      </span>
                    </div>
                  );
                })}

                <article className="absolute right-5 top-1/2 flex min-h-[360px] w-[36%] -translate-y-1/2 flex-col rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-[0_18px_36px_rgba(15,23,42,0.12)] backdrop-blur-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Project
                    </h3>
                    <span className="text-[11px] text-slate-400">03</span>
                  </div>

                  <div className="mb-3 flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white">
                      FV
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">
                        Feature Sprint
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {totalFeedbackTasks} tasks planned
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {feedbackPlanItems.map((item, index) => (
                      <div key={item.title} className="flex items-start gap-2">
                        <span className="mt-[5px] inline-block h-1.5 w-1.5 rounded-full bg-slate-400" />
                        <p className="line-clamp-1 text-[11px] text-slate-600">
                          <span className="font-semibold text-slate-800">
                            {index + 1}. {item.title}
                          </span>{" "}
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 border-t border-slate-200 pt-3">
                    <div className="mb-2.5 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                      <span>Execution Progress</span>
                      <span>{feedbackExecutionProgress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-200">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-teal-500 to-blue-600"
                        style={{ width: `${feedbackExecutionProgress}%` }}
                      />
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
                      <div className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5">
                        <p className="font-bold text-slate-900">
                          {totalFeedbackTasks}
                        </p>
                        <p className="text-slate-500">Tasks</p>
                      </div>
                      <div className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5">
                        <p className="font-bold text-slate-900">
                          {completedFeedbackTasks}
                        </p>
                        <p className="text-slate-500">Done</p>
                      </div>
                      <div className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5">
                        <p className="font-bold text-slate-900">
                          {nextFeedbackTasks}
                        </p>
                        <p className="text-slate-500">Next</p>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button className="rounded-md bg-slate-900 px-2.5 py-1.5 text-[11px] font-semibold text-white">
                        Review Plan
                      </button>
                      <button className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700">
                        Assign Team
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>

          <div
            className="grid gap-4 sm:grid-cols-2 lg:hidden reveal-on-scroll"
            data-reveal
            data-delay="80"
          >
            {features.map((f, i) => (
              <article
                key={i}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="inline-flex rounded-xl bg-gradient-to-br from-teal-100 to-blue-100 p-3 ring-1 ring-teal-200/70">
                    <f.icon className="h-5 w-5 text-teal-600" />
                  </div>
                  <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-bold tracking-[0.08em] text-gray-400">
                    {`0${i + 1}`}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {f.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t border-gray-200/70 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-100 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-100 rounded-full opacity-10 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 reveal-on-scroll" data-reveal>
            <p className="text-teal-600 font-semibold text-sm uppercase mb-2 tracking-wide">
              Simple Process
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get started in 4 easy steps
            </h2>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent"></div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  num: "1",
                  icon: User,
                  title: "Create Account",
                  desc: "Set up your business profile in minutes.",
                },
                {
                  num: "2",
                  icon: Link2,
                  title: "Get QR Code",
                  desc: "Generate a custom QR code for customer reviews.",
                },
                {
                  num: "3",
                  icon: Smartphone,
                  title: "Scan For Review",
                  desc: "Let customers scan and submit feedback instantly.",
                },
                {
                  num: "4",
                  icon: TrendingUp,
                  title: "Grow With Feedback",
                  desc: "Use insights to improve service and drive growth.",
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="relative group reveal-on-scroll"
                  data-reveal
                  data-delay={100 + i * 80}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="w-28 h-28 bg-gradient-to-br from-white/45 to-white/20 backdrop-blur-sm border-3 border-teal-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                        <step.icon className="w-12 h-12 text-teal-600" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white/80 backdrop-blur-sm border-3 border-teal-600 rounded-full flex items-center justify-center font-bold text-teal-600 shadow-md">
                        {step.num}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="stories"
        className="border-t border-gray-200/70 bg-white py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal-on-scroll" data-reveal>
            <p className="text-teal-600 font-semibold text-sm uppercase mb-2 tracking-wide">
              Success Stories
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trusted by thousands of businesses
            </h2>
          </div>
          <div
            className="relative overflow-hidden reveal-on-scroll"
            data-reveal
            data-delay="70"
          >
            <div className="testimonial-marquee-track">
              {[...testimonials, ...testimonials].map((testimonial, i) => (
                <article
                  key={`${testimonial.name}-${i}`}
                  className="w-full max-w-[340px] shrink-0 rounded-2xl border border-white/60 bg-white/60 p-7 shadow-md backdrop-blur-sm"
                >
                  <div className="mb-5 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-teal-200 to-blue-200 shadow-md">
                      <testimonial.icon className="h-7 w-7 text-teal-700" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <div className="mb-3 flex gap-1">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-gray-200/70 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal-on-scroll" data-reveal>
            <p className="text-teal-600 font-semibold text-sm uppercase mb-2">
              Simple Pricing
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Plans that grow with you
            </h2>
            <p className="text-gray-600 text-lg">
              Flexible monthly plans with transparent pricing and no hidden
              fees.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, i) => (
              <div
                key={i}
                className={`rounded-xl overflow-hidden transition-all reveal-on-scroll ${plan.popular ? "ring-2 ring-teal-600 md:scale-105 md:shadow-2xl" : "border border-gray-200 shadow-md"} ${plan.popular ? "bg-gradient-to-br from-teal-50 to-blue-50" : "bg-white"}`}
                data-reveal
                data-delay={90 + i * 90}
              >
                {plan.popular && (
                  <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white text-xs font-bold px-4 py-2 text-center">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">{plan.desc}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    {plan.price !== "Custom" && (
                      <span className="text-gray-600 text-sm">/month</span>
                    )}
                  </div>
                  <Link to="/auth" className="block mb-8">
                    <Button
                      className={`w-full ${plan.popular ? "bg-teal-600 hover:bg-teal-700" : "border border-gray-300"}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </Link>
                  <div className="space-y-4">
                    {plan.features.map((feature, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Playbooks */}
      <section
        id="playbooks"
        className="border-t border-gray-200/70 bg-gradient-to-b from-white to-teal-50/50 py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center reveal-on-scroll" data-reveal>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-teal-600">
              Practical Playbooks
            </p>
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
              Copy, launch, and scale your review engine
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              Plug-and-play frameworks your team can execute this week to
              increase review volume, protect brand trust, and improve local
              rankings.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {playbooks.map((playbook, i) => (
              <article
                key={playbook.title}
                className="rounded-2xl border border-teal-100 bg-white p-7 shadow-sm transition-all reveal-on-scroll hover:-translate-y-1 hover:shadow-xl"
                data-reveal
                data-delay={80 + i * 70}
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-100 to-blue-100">
                  <playbook.icon className="h-6 w-6 text-teal-700" />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                  {playbook.title}
                </h3>
                <p className="mb-5 text-sm leading-relaxed text-gray-600">
                  {playbook.desc}
                </p>
                <ul className="space-y-3">
                  {playbook.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-200/70 bg-white py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal-on-scroll" data-reveal>
            <p className="text-teal-600 font-semibold text-sm uppercase mb-2">
              Have Questions?
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group border border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer reveal-on-scroll"
                data-reveal
                data-delay={70 + i * 55}
              >
                <summary className="flex justify-between items-center font-semibold text-gray-900 list-none">
                  {faq.q}
                  <span className="transition group-open:rotate-180">▼</span>
                </summary>
                <p className="text-gray-600 mt-4">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-14 sm:py-20 reveal-on-scroll" data-reveal>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight font-bold text-gray-900 mb-4 sm:mb-6">
            Ready to master your reputation?
          </h2>
          <p className="text-base sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto">
            Join thousands of successful businesses using FeedbackView to grow
            their online reputation.
          </p>
          <div className="flex justify-center">
            <Link to="/auth" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-teal-600 text-white hover:bg-teal-700 px-8 text-base font-semibold"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/70 bg-slate-200/70 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-300/70 bg-slate-100/95 px-6 py-8 shadow-sm sm:px-10 sm:py-10">
            <div className="grid gap-10 md:grid-cols-[1.3fr_0.9fr_0.9fr]">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <BookmarkIcon className="h-7 w-7 text-slate-900" />
                  <span className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    FeedbackView
                  </span>
                </div>
                <p className="max-w-sm text-xl leading-relaxed text-slate-700 sm:text-2xl">
                  Manage your online reputation with ease.
                </p>
              </div>

              <div>
                <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-900">
                  Product
                </h4>
                <ul className="space-y-3 text-2xl text-slate-700 sm:text-[2rem]">
                  <li>
                    <Link
                      to="/features"
                      className="transition-colors hover:text-slate-950"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/pricing"
                      className="transition-colors hover:text-slate-950"
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/success-stories"
                      className="transition-colors hover:text-slate-950"
                    >
                      Success Stories
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/blog"
                      className="transition-colors hover:text-slate-950"
                    >
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-900">
                  Information
                </h4>
                <ul className="space-y-3 text-2xl text-slate-700 sm:text-[2rem]">
                  <li>
                    <Link
                      to="/contact"
                      className="transition-colors hover:text-slate-950"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/privacy"
                      className="transition-colors hover:text-slate-950"
                    >
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terms"
                      className="transition-colors hover:text-slate-950"
                    >
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/security"
                      className="transition-colors hover:text-slate-950"
                    >
                      Security
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="my-8 border-t border-slate-300/80" />

            <div className="flex flex-col gap-3 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between">
              <p>
                © {new Date().getFullYear()} FeedbackView. All rights reserved.
              </p>
              <p>Built for modern businesses.</p>
            </div>
          </div>
        </div>
      </footer>
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
