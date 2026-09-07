import React, { useState } from 'react';
import {
  Sparkles,
  Languages,
  ShieldCheck,
  Check,
  Compass,
  FileSearch,
  MessageSquare,
} from 'lucide-react';

export const AiSection: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<'urdu' | 'roman' | 'en'>('urdu');

  const chatExamples = {
    urdu: {
      user: 'مجھے پچھلے دو دنوں سے سر درد اور ہلکا بخار محسوس ہو رہا ہے، مجھے کیا کرنا چاہیے؟',
      aiResponse:
        'یہ علامات وائرل انفیکشن، پانی کی کمی یا تناؤ کی وجہ سے ہو سکتی ہیں۔ براہ کرم وافر مقدار میں پانی پیئیں اور آرام کریں۔ اگر بخار 101°F سے زیادہ ہو جائے یا سر میں شدید درد برقرار رہے تو قریبی جنرل فزیشن سے رجوع کریں۔',
      triageTag: 'غیر ہنگامی — عام دیکھ بھال کی سفارش',
      direction: 'rtl' as const,
      fontFamily: 'font-urdu',
    },
    roman: {
      user: 'Mujhe 2 din se sar dard aur halka bukhar feel ho raha hai, mujhe kya karna chahiye?',
      aiResponse:
        'Yeh alamaat aam taur par viral infection, dehydration ya thakawat ki wajah se ho sakti hain. Khoob paani piyein aur aaram karein. Agar bukhar 101°F se barh jaye ya 3 din se zyada rahe to foran General Physician se consult karein.',
      triageTag: 'Non-Emergency — General Physician Consultation Advised',
      direction: 'ltr' as const,
      fontFamily: 'font-sans',
    },
    en: {
      user: 'I have had a mild headache and low-grade fever for the last 2 days. What should I do next?',
      aiResponse:
        'These symptoms are commonly associated with mild viral illnesses, dehydration, or fatigue. Stay hydrated and rest. If your fever surpasses 101°F or severe symptoms develop, schedule a consultation with a primary care doctor.',
      triageTag: 'Low Urgency — Outpatient Guidance Recommended',
      direction: 'ltr' as const,
      fontFamily: 'font-sans',
    },
  };

  const currentChat = chatExamples[selectedLang];

  return (
    <section
      id="ai"
      className="py-20 md:py-28 bg-white dark:bg-darkbg-900 border-t border-slate-200/80 dark:border-darkbg-border overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Context & Core AI Value */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>AI-Powered Healthcare Assistance</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              AI Assistance That Helps You Understand What Comes Next
            </h2>

            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Navigating healthcare shouldn&apos;t feel overwhelming. Sehat Sahara&apos;s intelligent assistance layer translates clinical jargon, triages symptom urgency, and guides patients toward verified care without diagnostic guesswork.
            </p>

            {/* Core Capability Checklist */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Triage & Navigation Support
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Determines whether you need immediate emergency care, an OPD appointment, or home observation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <FileSearch className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Demystifying Health Records
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Simplifies laboratory reports and medical instructions into plain, understandable everyday terms.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Languages className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Native Multilingual Accessibility
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Fully conversant in Urdu script, Roman Urdu transliteration, and English for broad societal reach.
                  </p>
                </div>
              </div>
            </div>

            {/* Mandatory Safety Notice */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-darkbg-card border border-slate-200 dark:border-darkbg-border flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900 dark:text-white">Crucial Clinical Boundary:</strong> AI guidance supports users with informational direction and does not formulate medical diagnoses or replace consultations with licensed healthcare professionals.
              </span>
            </div>
          </div>

          {/* Right Column: Conversational AI Mockup with Language Tabs */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-slate-200/80 dark:border-darkbg-border bg-slate-50 dark:bg-darkbg-card shadow-xl overflow-hidden">
              {/* Top Interactive Language Selector */}
              <div className="p-4 bg-white dark:bg-darkbg-800 border-b border-slate-200 dark:border-darkbg-border flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Sehat Sahara Assistant
                    </h4>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      ● Active Healthcare Navigator
                    </span>
                  </div>
                </div>

                {/* Switcher Buttons */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-darkbg-900 rounded-lg">
                  <button
                    onClick={() => setSelectedLang('urdu')}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      selectedLang === 'urdu'
                        ? 'bg-white dark:bg-darkbg-card text-brand-700 dark:text-emerald-400 shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    اردو
                  </button>
                  <button
                    onClick={() => setSelectedLang('roman')}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      selectedLang === 'roman'
                        ? 'bg-white dark:bg-darkbg-card text-brand-700 dark:text-emerald-400 shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Roman Urdu
                  </button>
                  <button
                    onClick={() => setSelectedLang('en')}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      selectedLang === 'en'
                        ? 'bg-white dark:bg-darkbg-card text-brand-700 dark:text-emerald-400 shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* Chat Simulation Area */}
              <div className="p-6 space-y-4 min-h-[300px] flex flex-col justify-center">
                {/* User message */}
                <div
                  className={`flex items-start gap-2.5 ${
                    currentChat.direction === 'rtl' ? 'flex-row-reverse text-right' : 'text-left'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold shrink-0 text-slate-700 dark:text-slate-200">
                    You
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-tr-xs p-3.5 bg-brand-600 text-white text-xs sm:text-sm leading-relaxed shadow-xs">
                    {currentChat.user}
                  </div>
                </div>

                {/* Assistant response */}
                <div
                  className={`flex items-start gap-2.5 ${
                    currentChat.direction === 'rtl' ? 'flex-row-reverse text-right' : 'text-left'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-brand-900/60 text-brand-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="max-w-[88%] rounded-2xl rounded-tl-xs p-4 bg-white dark:bg-darkbg-800 border border-slate-200/80 dark:border-darkbg-border text-xs sm:text-sm leading-relaxed shadow-xs space-y-2.5">
                    <div className="text-slate-800 dark:text-slate-100">
                      {currentChat.aiResponse}
                    </div>
                    {/* Triage Tag */}
                    <div className="pt-2 border-t border-slate-100 dark:border-darkbg-border flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                      <Check className="w-3.5 h-3.5" />
                      <span>{currentChat.triageTag}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="px-5 py-3 bg-white dark:bg-darkbg-800 border-t border-slate-200 dark:border-darkbg-border flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  Interactive conversational triage preview
                </span>
                <span className="font-mono text-[10px]">No medical claims</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiSection;
