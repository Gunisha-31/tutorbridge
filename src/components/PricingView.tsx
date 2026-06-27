import React, { useState } from 'react';
import { Tutor } from '../types';
import { 
  Check, 
  Sparkles, 
  Crown, 
  Trophy, 
  Clock, 
  HelpCircle, 
  Info, 
  X,
  CreditCard,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface PricingViewProps {
  tutor: Tutor;
  onUpdatePlan: (plan: string) => void;
}

interface ToastState {
  show: boolean;
  planName: string;
}

export default function PricingView({ tutor, onUpdatePlan }: PricingViewProps) {
  const [toast, setToast] = useState<ToastState>({ show: false, planName: '' });

  const plans = [
    {
      id: '30-Day Plan',
      name: '30-Day Plan',
      price: '₹2,999',
      originalPrice: null,
      savings: null,
      pauseDays: 'Up to 5 pause days included.',
      desc: 'Ideal for individual tutors and small batches looking for high flexibility.',
      features: [
        'AI Curriculum Suite (Worksheets, Quizzes, Lesson Plans)',
        'Full AI Mentor Coaching Assistant',
        'Active Student Dossiers with diagnostic timelines',
        'Standard Performance Analytics Logs',
        '5 Session Pause Days (flexible scheduling)',
        'Email & Chat Support'
      ],
      icon: Trophy,
      iconColor: 'text-indigo-500 bg-indigo-50',
      highlight: false
    },
    {
      id: '90-Day Plan',
      name: '90-Day Plan',
      price: '₹7,287',
      originalPrice: '₹8,097',
      savings: 'Save 10%',
      pauseDays: 'Up to 20 pause days included.',
      desc: 'Best for an academic term. Keeps your student roster highly engaged.',
      features: [
        'Everything in 30-Day Plan',
        'High-Fidelity Parent Progress Letter Generator (Gemini-powered)',
        'Comprehensive Academic Analytics & Student Trend Analysis',
        '20 Session Pause Days (ideal for long vacation terms)',
        'Priority diagnostic generation queues',
        'Direct parent email dispatch simulation'
      ],
      icon: Sparkles,
      iconColor: 'text-amber-500 bg-amber-50',
      highlight: true
    },
    {
      id: '180-Day Plan',
      name: '180-Day Plan',
      price: '₹12,596',
      originalPrice: '₹17,994',
      savings: 'Save 30%',
      pauseDays: 'Up to 45 pause days included.',
      desc: 'Ideal for coaching centers, elite multi-subject tutors, and long-term users.',
      features: [
        'Everything in 90-Day Plan',
        'Custom branding & letterheads for student progress PDF exports',
        '45 Session Pause Days (ultimate long-term flexibility)',
        'Institute session logging and multi-grade cohort charts',
        'Dedicated TutorBridge diagnostic coordinator access',
        'Premium 2-Hour SLA priority response'
      ],
      icon: Crown,
      iconColor: 'text-emerald-500 bg-emerald-50',
      highlight: false
    }
  ];

  const handleSelectPlan = (planId: string, planName: string) => {
    onUpdatePlan(planId);
    setToast({ show: true, planName });
    setTimeout(() => {
      setToast({ show: false, planName: '' });
    }, 4500);
  };

  return (
    <div className="space-y-10 animate-fade-in relative select-none">
      
      {/* Dynamic Animated Toast Notification */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-800 p-4 flex items-start gap-3.5 animate-slide-in select-text">
          <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-xl border border-emerald-500/20 shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-100 uppercase tracking-widest">Plan Selected</span>
              <button 
                onClick={() => setToast({ show: false, planName: '' })}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-1 leading-normal">
              Success! You have switched to the <span className="font-bold text-teal-400">{toast.planName}</span>. Your tutoring features and pause day settings have been refreshed.
            </p>
          </div>
        </div>
      )}

      {/* Hero Header Area */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
          <CreditCard className="w-3.5 h-3.5" /> Flexible Term Subscriptions
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
          Simple, Value-First Term Pricing
        </h2>
        <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
          Unlock top-tier Gemini pedagogic tools, automated parent communication briefs, and dedicated session pause allowances to fit your term schedule perfectly.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto pt-4 items-stretch">
        {plans.map((plan) => {
          const isCurrent = tutor.plan === plan.id;
          const IconComponent = plan.icon;

          return (
            <div 
              key={plan.id}
              className={`rounded-3xl p-6 md:p-8 flex flex-col justify-between border transition-all relative ${
                plan.highlight 
                  ? 'border-2 border-indigo-600 bg-white shadow-xl shadow-indigo-100/60 lg:scale-[1.03] z-10' 
                  : 'border-slate-150 bg-white shadow-sm hover:border-slate-300 hover:shadow-md'
              }`}
            >
              
              {/* Popular Ribbon / Current Badge on 90-Day */}
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-extrabold tracking-widest uppercase py-1 px-4 rounded-full flex items-center gap-1 shadow-md shadow-indigo-200">
                  <Sparkles className="w-3 h-3 text-yellow-300 fill-yellow-300 animate-pulse" /> Most Popular
                </div>
              )}

              {/* Current Plan Indicator for the 180-Day plan specifically, or whatever plan is selected */}
              {isCurrent && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[9px] font-extrabold tracking-widest uppercase py-0.5 px-3 rounded-full flex items-center gap-1 shadow-md">
                  <Check className="w-3 h-3 text-white" /> Active Current Plan
                </div>
              )}

              <div>
                
                {/* Plan Metadata */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Term Level</span>
                    <h3 className="text-lg font-extrabold text-slate-900 font-sans">{plan.name}</h3>
                  </div>
                  <div className={`p-2.5 rounded-2xl ${plan.iconColor}`}>
                    <IconComponent className="w-5 h-5 shrink-0" />
                  </div>
                </div>

                {/* Price Labeling */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-slate-900 tracking-tight font-sans">{plan.price}</span>
                    <span className="text-xs text-slate-400 font-semibold">/ term flat</span>
                  </div>

                  {plan.originalPrice && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 line-through font-medium">{plan.originalPrice}</span>
                      <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {plan.savings}
                      </span>
                    </div>
                  )}
                </div>

                {/* Pause Days Callout */}
                <div className="mt-5 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-start gap-2.5">
                  <Clock className="w-4.5 h-4.5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Pause Allowance</span>
                    <p className="text-xs font-bold text-indigo-900 mt-0.5">{plan.pauseDays}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">Allows you to freeze operations when traveling or in recess.</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 mt-4 leading-relaxed font-light">
                  {plan.desc}
                </p>

                {/* Features List */}
                <div className="mt-6 border-t border-slate-50 pt-6 space-y-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Workspace Inclusions</span>
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Action Trigger Button */}
              <button
                onClick={() => handleSelectPlan(plan.id, plan.name)}
                disabled={isCurrent}
                className={`w-full text-xs font-bold py-4 rounded-2xl transition-all mt-8 cursor-pointer ${
                  isCurrent 
                    ? 'bg-emerald-50 border border-emerald-100 text-emerald-700 cursor-default flex items-center justify-center gap-1.5' 
                    : plan.highlight 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 hover:shadow-xl hover:-translate-y-0.5'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:-translate-y-0.5'
                }`}
              >
                {isCurrent ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 animate-pulse" />
                    <span>Current Active Term</span>
                  </>
                ) : (
                  <span>Choose {plan.name}</span>
                )}
              </button>

            </div>
          );
        })}
      </div>

      {/* Informative Disclaimer footer */}
      <div className="max-w-xl mx-auto bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-start gap-3 justify-center text-xs text-slate-400 leading-normal select-text">
        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-slate-600">Secure Billing and Refund Policy</p>
          <p className="mt-0.5 text-[11px] leading-relaxed">
            All prices listed are flat one-time payments in Indian Rupees (INR) for the duration of the chosen term. Tutors can request plan changes and pause adjustments at any point. Up to 100% money-back guarantee within the first 7 days of activation.
          </p>
        </div>
      </div>

    </div>
  );
}
