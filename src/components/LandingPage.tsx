import React from 'react';
import { 
  Sparkles, 
  LineChart, 
  FileText, 
  Users, 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  Trophy, 
  MessageSquare,
  TrendingUp,
  ShieldCheck,
  Zap,
  Calendar
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export default function LandingPage({ onGetStarted, onSignIn }: LandingPageProps) {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans flex flex-col selection:bg-indigo-100">
      
      {/* Navigation Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-teal-500 p-2.5 rounded-xl text-white shadow-md shadow-indigo-100">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 font-display">Tutor<span className="text-indigo-600">Bridge</span></span>
              <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Education & AI</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={onSignIn}
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors px-4 py-2"
              id="btn-nav-signin"
            >
              Sign In
            </button>
            <button 
              onClick={onGetStarted}
              className="bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              id="btn-nav-getstarted"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:py-24 px-6 overflow-hidden bg-gradient-to-b from-indigo-50/40 via-teal-50/20 to-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-40">
          <div className="absolute top-[-10%] left-[5%] w-[400px] h-[400px] rounded-full bg-indigo-200 blur-[120px]" />
          <div className="absolute top-[20%] right-[5%] w-[500px] h-[500px] rounded-full bg-teal-100 blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 text-left space-y-8">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full text-xs font-semibold text-indigo-700 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Powered by Gemini AI Studio Models
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight font-display">
              Start Teaching Smarter, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">Not Harder.</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed font-normal">
              TutorBridge is the AI-powered operating system for private tutors — manage students, analyze performance, generate personalized material, and keep parents informed, all in one place.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto bg-indigo-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
                id="btn-hero-getstarted"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={onSignIn}
                className="w-full sm:w-auto border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-8 py-4 rounded-xl transition-all flex items-center justify-center text-sm shadow-sm"
                id="btn-hero-signin"
              >
                Sign In
              </button>
            </div>

            {/* Seed Account Quick Link */}
            <div className="text-xs text-slate-400 bg-white/60 border border-slate-100 rounded-xl py-3 px-4 inline-block max-w-md shadow-sm">
              <span className="font-semibold text-slate-600">Demo Account Credentials:</span> Sign in with Username <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-mono font-semibold">user</code> and Password <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-mono font-semibold">user</code>.
            </div>
          </div>

          {/* Hero Right Mockup / Illustration */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900 rounded-3xl p-5 md:p-6 shadow-2xl border border-slate-800 relative overflow-hidden text-left select-none text-white max-w-lg mx-auto transform hover:scale-[1.01] transition-transform">
              
              {/* Window Controls */}
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="text-[10px] text-slate-400 font-mono font-bold tracking-wider">TUTORBRIDGE_OS v1.0.3</div>
              </div>

              <div className="space-y-4">
                {/* Seed Student Badges */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/50">
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Aarav Mehta</p>
                    <p className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> IMPROVING
                    </p>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-400 h-full w-[92%]" />
                    </div>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/50">
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Diya Patel</p>
                    <p className="text-xs font-bold text-rose-400 mt-1">⚠️ AT RISK</p>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-rose-400 h-full w-[71%]" />
                    </div>
                  </div>
                </div>

                {/* Gemini AI Actionable Suggestion */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-indigo-600/20 text-indigo-400 text-[8px] font-bold uppercase px-2 py-0.5 rounded-bl">
                    Gemini Insight
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-slate-200">Personalized Plan Drafted</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-light">
                    "Diya's performance on Quadratic Equations dropped to 51%. Generative revision schedule scheduled with mother Meera Patel (+91 98450 22222)."
                  </p>
                </div>

                {/* Status Indicator Bar */}
                <div className="flex items-center justify-between bg-slate-800/40 px-3.5 py-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
                    <span className="text-[10px] font-mono text-indigo-300 font-semibold uppercase">Roster Status Updated</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">15s ago</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-24 px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16 font-display">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">Core Capabilities</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">Designed to help educators scale their impact</h3>
            <p className="text-slate-500 mt-4 leading-relaxed">
              TutorBridge puts professional student diagnostics, customized test generators, and beautiful, smart progress frameworks into a unified operating dashboard.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-slate-50/50 p-8 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-white hover:shadow-md transition-all duration-300">
              <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 w-12 h-12 flex items-center justify-center mb-6 shadow-sm">
                <LineChart className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Student Performance Tracking</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Monitor marks and performance trends over time. Instantly see who's improving, who's struggling, and where to step in.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50/50 p-8 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-white hover:shadow-md transition-all duration-300">
              <div className="bg-teal-50 p-3 rounded-xl text-teal-600 w-12 h-12 flex items-center justify-center mb-6 shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Automated Weakness Analysis</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Upload assessments and let TutorBridge identify topic-wise strengths and weaknesses for every student.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50/50 p-8 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-white hover:shadow-md transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-4 right-4 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Premium
              </div>
              <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 w-12 h-12 flex items-center justify-center mb-6 shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Personalized Test Generation</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Generate customized practice tests focused on the exact concepts each student needs to improve.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-50/50 p-8 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-white hover:shadow-md transition-all duration-300">
              <div className="bg-teal-50 p-3 rounded-xl text-teal-600 w-12 h-12 flex items-center justify-center mb-6 shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Attendance Management</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Track attendance seamlessly and keep accurate records with zero extra admin.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-50/50 p-8 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-white hover:shadow-md transition-all duration-300 relative group overflow-hidden lg:col-span-1">
              <div className="absolute top-4 right-4 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Premium
              </div>
              <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 w-12 h-12 flex items-center justify-center mb-6 shadow-sm">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">AI Parent Progress Reports</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Generate professional, personalized parent reports every quarter in seconds — student progress, strengths, improvement areas, performance comparisons, and recommendations.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing Teaser Section */}
      <section id="pricing" className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 font-display">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">Simple Pricing</h2>
            <h3 className="text-3xl font-extrabold text-slate-900">Affordable plans for independent educators</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Plan 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-md">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">30-Day Pass</span>
                <div className="flex items-baseline mt-2">
                  <span className="text-2xl font-bold text-slate-900">₹2,999</span>
                  <span className="text-[10px] text-slate-400 ml-1">/ single month</span>
                </div>
                <p className="text-slate-500 text-xs mt-3 leading-relaxed">
                  Perfect for trial support periods or quick mid-term exam crunch assistance.
                </p>
                <div className="mt-5 pt-5 border-t border-slate-50 space-y-2.5 text-xs text-slate-600">
                  <p className="flex items-center gap-2">✓ Full AI Assistance features</p>
                  <p className="flex items-center gap-2">✓ Performance Analytics suite</p>
                </div>
              </div>
              <button onClick={onGetStarted} className="mt-6 w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-3 rounded-xl transition-all">
                Select 30-Day
              </button>
            </div>

            {/* Plan 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-md">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">90-Day Pass</span>
                <div className="flex items-baseline mt-2">
                  <span className="text-2xl font-bold text-slate-900">₹7,287</span>
                  <span className="text-[10px] text-slate-400 ml-1">/ 3 months</span>
                </div>
                <p className="text-slate-500 text-xs mt-3 leading-relaxed">
                  Our recommended quarterly baseline for full support and standard revision tracking.
                </p>
                <div className="mt-5 pt-5 border-t border-slate-50 space-y-2.5 text-xs text-slate-600">
                  <p className="flex items-center gap-2">✓ Full AI Assistance features</p>
                  <p className="flex items-center gap-2">✓ Diagnostic Quiz Builders</p>
                  <p className="flex items-center gap-2">✓ Empathetic Parent Progress Reports</p>
                </div>
              </div>
              <button onClick={onGetStarted} className="mt-6 w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-3 rounded-xl transition-all">
                Select 90-Day
              </button>
            </div>

            {/* Plan 3 - Highlighted */}
            <div className="bg-white p-6 rounded-2xl border-2 border-indigo-600 shadow-lg shadow-indigo-100/50 relative flex flex-col justify-between transition-all hover:-translate-y-1">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[9px] font-extrabold tracking-widest uppercase py-0.5 px-3.5 rounded-full">
                Best Value
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">180-Day Pass</span>
                <div className="flex items-baseline mt-2">
                  <span className="text-2xl font-bold text-slate-900">₹12,596</span>
                  <span className="text-[10px] text-slate-400 ml-1">/ 6 months</span>
                </div>
                <p className="text-slate-500 text-xs mt-3 leading-relaxed">
                  Empower long-term academic growth, fully continuous diagnostic audits, and report archives.
                </p>
                <div className="mt-5 pt-5 border-t border-slate-50 space-y-2.5 text-xs text-slate-600">
                  <p className="flex items-center gap-2 font-semibold text-indigo-600">★ Full Multi-Subject Analytics</p>
                  <p className="flex items-center gap-2">✓ Standard Parent Dashboard</p>
                  <p className="flex items-center gap-2">✓ Continuous AI Mentor Chats</p>
                </div>
              </div>
              <button onClick={onGetStarted} className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-3 rounded-xl transition-all shadow-md shadow-indigo-150">
                Select 180-Day
              </button>
            </div>

          </div>

          <div className="text-center mt-10">
            <button 
              onClick={onGetStarted}
              className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm inline-flex items-center gap-1 hover:underline"
              id="link-pricing-details"
            >
              See full pricing <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 text-left">
            <div className="bg-gradient-to-tr from-indigo-600 to-teal-500 p-2 rounded-xl text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 font-display">TutorBridge</span>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">Bridging Education and AI</p>
            </div>
          </div>

          {/* Simple Footer Links */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-semibold text-slate-500">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Product</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
            <button onClick={onSignIn} className="hover:text-indigo-600 transition-colors">Contact</button>
          </div>

          {/* Copyright notice */}
          <p className="text-slate-400 text-xs text-center md:text-right">
            &copy; 2026 TutorBridge Inc. All rights reserved. Powered by Google Gemini.
          </p>
        </div>
      </footer>
    </div>
  );
}
