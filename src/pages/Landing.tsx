import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Star,
  ArrowRight,
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
} from "lucide-react";

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

const integrations = [
  { name: "Google", icon: Search },
  { name: "Facebook", icon: Smartphone },
  { name: "Yelp", icon: Star },
  { name: "Trustpilot", icon: Check },
  { name: "TripAdvisor", icon: Plane },
  { name: "Amazon", icon: Package },
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

const faqs = [
  {
    q: "How long does setup take?",
    a: "Setup takes less than 5 minutes. Just connect your review platforms and start collecting feedback.",
  },
  {
    q: "Can I import existing reviews?",
    a: "Yes! We can import your existing reviews from Google, Yelp, Facebook, and other platforms.",
  },
  {
    q: "Is there a contract or hidden fees?",
    a: "No contracts, no hidden fees. Cancel anytime. We believe in transparency.",
  },
  {
    q: "What's included in the free trial?",
    a: "Full access to all Professional features for 14 days. No credit card required.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-to-br from-teal-600 to-blue-600 rounded-lg flex items-center justify-center">
              <BookmarkIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              ReviewMaster
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Pricing
            </a>
            <a
              href="#integrations"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Integrations
            </a>
            <a
              href="#resources"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Resources
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="outline" size="sm" className="border-gray-300">
                Login
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
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
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 text-base"
                >
                  Start Your Free 14-Day Trial
                </Button>
              </Link>
              <Link to="/auth">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-300 px-8 text-base"
                >
                  Schedule a Demo
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
          <div className="relative">
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
                <button className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white text-xs font-bold py-3 rounded-lg hover:shadow-lg transition-all">
                  → View Full Dashboard
                </button>
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
          <div className="text-center mb-20">
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                <div className="relative h-full p-8 bg-white border border-gray-200 rounded-2xl hover:border-teal-300 transition-all duration-300 hover:shadow-xl">
                  <div className="mb-6 inline-flex p-3 bg-gradient-to-br from-teal-100 to-blue-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <f.icon className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {f.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm mb-4">
                    {f.desc}
                  </p>
                  <div className="flex items-center text-teal-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Learn more <ArrowRight className="h-4 w-4 ml-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 border-t border-gray-200 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-100 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-100 rounded-full opacity-10 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
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
                  icon: Link2,
                  title: "Connect",
                  desc: "Link your review platforms",
                },
                {
                  num: "2",
                  icon: Mail,
                  title: "Collect",
                  desc: "Automatically request reviews",
                },
                {
                  num: "3",
                  icon: BarChart3,
                  title: "Analyze",
                  desc: "View detailed insights",
                },
                {
                  num: "4",
                  icon: MessageCircle,
                  title: "Respond",
                  desc: "Manage all reviews in one place",
                },
              ].map((step, i) => (
                <div key={i} className="relative group">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="w-28 h-28 bg-gradient-to-br from-teal-50 to-blue-50 border-3 border-teal-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                        <step.icon className="w-12 h-12 text-teal-600" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border-3 border-teal-600 rounded-full flex items-center justify-center font-bold text-teal-600 shadow-md">
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

      {/* Integrations */}
      <section
        id="integrations"
        className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 border-t border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-teal-600 font-semibold text-sm uppercase mb-2 tracking-wide">
              Integrations
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Works with your favorite platforms
            </h2>
            <p className="text-gray-600 text-lg">
              Connect with 50+ review platforms and business tools.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            {integrations.map((platform, i) => (
              <div key={i} className="group relative h-32">
                <div className="absolute inset-0 bg-white border-2 border-gray-200 rounded-2xl group-hover:border-teal-500 group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1"></div>

                <div className="relative h-full flex flex-col items-center justify-center p-4">
                  <div className="mb-2 group-hover:scale-125 transition-transform duration-300">
                    <platform.icon className="w-8 h-8 text-teal-600" />
                  </div>
                  <p className="font-semibold text-gray-900 text-xs text-center leading-tight group-hover:text-teal-600 transition-colors duration-300">
                    {platform.name}
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-600 to-blue-600 rounded-b-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <p className="text-gray-600 mb-6">
              Need a different integration? We support custom connections too!
            </p>
            <Link to="/auth">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8">
                View All Integrations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-teal-600 font-semibold text-sm uppercase mb-2 tracking-wide">
              Success Stories
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trusted by thousands of businesses
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Restaurant Owner",
                icon: Briefcase,
                text: "ReviewMaster helped us increase Google rating from 3.2 to 4.8 in 3 months!",
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
            ].map((testimonial, i) => (
              <div
                key={i}
                className="p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-200 to-blue-200 flex items-center justify-center shadow-md">
                    <testimonial.icon className="h-8 w-8 text-teal-700" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-teal-600 font-semibold text-sm uppercase mb-2">
              Simple Pricing
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Plans that grow with you
            </h2>
            <p className="text-gray-600 text-lg">
              All plans include a 14-day free trial. No credit card required.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, i) => (
              <div
                key={i}
                className={`rounded-xl overflow-hidden transition-all ${plan.popular ? "ring-2 ring-teal-600 md:scale-105 md:shadow-2xl" : "border border-gray-200 shadow-md"} ${plan.popular ? "bg-gradient-to-br from-teal-50 to-blue-50" : "bg-white"}`}
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

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
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
                className="group border border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer"
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
      <section className="py-20 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to master your reputation?
          </h2>
          <p className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto">
            Join thousands of successful businesses using ReviewMaster to grow
            their online reputation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button
                size="lg"
                className="bg-white text-teal-600 hover:bg-gray-100 px-8 text-base font-semibold"
              >
                Start Your Free Trial
              </Button>
            </Link>
            <Link to="/auth">
              <Button
                size="lg"
                className="border-2 border-white text-white hover:bg-white/10 px-8 text-base font-semibold"
              >
                Schedule a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 bg-gradient-to-br from-teal-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <BookmarkIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">
                  ReviewMaster
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                Manage your online reputation with ease.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#features" className="hover:text-teal-600">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-teal-600">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#integrations" className="hover:text-teal-600">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-teal-600">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-600">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-600">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-teal-600">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-600">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-600">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            © {new Date().getFullYear()} ReviewMaster. All rights reserved.
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
