import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Bot, 
  X, 
  Paperclip, 
  Send, 
  AlertTriangle, 
  Sparkles, 
  FileText, 
  ShieldAlert, 
  RotateCcw,
  CheckCircle2,
  Stethoscope,
  HelpCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  isDraft?: boolean;
  isEmergency?: boolean;
  attachmentName?: string;
  timestamp: string;
}

interface ContextDefinition {
  title: string;
  subtitle: string;
  isProvider: boolean;
  welcome: string;
  chips: string[];
}

export const AICopilotGlobal: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // 1. Exclusion Rules
  // Splash & Onboarding
  const isSplashOrAuth = pathname === '/' || pathname === '/welcome' || pathname.startsWith('/onboarding') || pathname.startsWith('/auth');
  // Doctor Auth/Verification
  const isDoctorAuth = pathname === '/doctor/signin' || pathname === '/doctor/verification-status';
  // Full-screen dedicated AI triage & notes
  const isDedicatedAi = 
    pathname === '/patient/triage' ||
    pathname === '/patient/triage/result' ||
    pathname === '/doctor/ai-copilot' ||
    pathname.includes('/ai-note');
  // Patient root screens that already feature the central AI tab
  const patientRootScreensWithAiNav = [
    '/patient',
    '/patient/care',
    '/patient/community',
    '/patient/profile',
    '/patient/profile/settings'
  ];
  const isPatientRootWithAiNav = patientRootScreensWithAiNav.includes(pathname);
  // Inner Blood screens with bottom action CTAs (form/details/pledge)
  const isInnerBloodScreen = pathname.includes('/community/blood/');
  const isExcluded = isSplashOrAuth || isDoctorAuth || isDedicatedAi || isPatientRootWithAiNav || isInnerBloodScreen;

  // 2. Position Offset based on Screen Layout
  const providerRootScreens = [
    '/doctor/home',
    '/doctor/appointments',
    '/doctor/opportunities',
    '/doctor/community',
    '/doctor/profile'
  ];
  const hasBottomNav = providerRootScreens.includes(pathname);
  const hasActionBar = 
    pathname.startsWith('/patient/book') ||
    pathname === '/patient/checkout' ||
    pathname.startsWith('/patient/care/in-clinic') ||
    pathname.startsWith('/patient/care/online') ||
    pathname.startsWith('/patient/care/home-visit') ||
    pathname.startsWith('/patient/care/token') ||
    pathname.startsWith('/patient/care/home-support');

  const bottomOffset = hasBottomNav
    ? 'calc(76px + env(safe-area-inset-bottom, 0px))'
    : hasActionBar
    ? 'calc(88px + env(safe-area-inset-bottom, 0px))'
    : 'calc(20px + env(safe-area-inset-bottom, 0px))';

  // 3. Resolve Active Context
  const getContext = (): ContextDefinition => {
    // Provider Contexts
    if (pathname.startsWith('/doctor/consultation')) {
      return {
        title: 'Clinical Encounter AI',
        subtitle: 'Provider Consultation Assistant',
        isProvider: true,
        welcome: 'Doctor, I can draft your clinical SOAP note, verify drug interactions, or suggest Urdu patient instructions.',
        chips: [
          'Draft SOAP Note',
          'Check Drug Interactions',
          'Differential Diagnosis',
          'Urdu Home Care Advice'
        ]
      };
    }
    if (pathname === '/doctor/queue' || pathname.startsWith('/doctor/appointments')) {
      return {
        title: 'Queue & Triage Copilot',
        subtitle: 'Provider Patient Flow',
        isProvider: true,
        welcome: 'Doctor, I can summarize waiting patients, prioritize urgent symptoms, or draft a delay announcement.',
        chips: [
          'Summarize waiting patients',
          'Prioritize urgent walk-ins',
          'Draft clinic delay notice'
        ]
      };
    }
    if (pathname.startsWith('/doctor')) {
      return {
        title: 'Provider Clinical Copilot',
        subtitle: 'Sehat Sahara Medical AI',
        isProvider: true,
        welcome: 'Welcome Doctor. I can assist with PMDC verification guidance, clinical literature, or referral documentation.',
        chips: [
          'Draft Referral Letter',
          'Check PMDC Guidelines',
          'Standard Dosage Lookup'
        ]
      };
    }

    // Care Seeker Contexts
    if (pathname.startsWith('/patient/medicines') || pathname.startsWith('/patient/prescriptions')) {
      return {
        title: 'Medicine & Dosage Assistant',
        subtitle: 'Safe Medication Guide',
        isProvider: false,
        welcome: 'Hello! I can explain your prescribed medicines, safe dosages, food timings, and common side effects.',
        chips: [
          'Panadol: safe daily limit',
          'Amoxicillin with or without food?',
          'What if I miss a scheduled dose?'
        ]
      };
    }
    if (pathname.startsWith('/patient/records')) {
      return {
        title: 'Health Records Explainer',
        subtitle: 'Lab Reports & History',
        isProvider: false,
        welcome: 'I can help you understand your lab reports, CBC blood tests, and doctor notes in simple everyday language.',
        chips: [
          'Explain CBC blood test results',
          'What is normal blood pressure?',
          'How do I securely share records?'
        ]
      };
    }
    if (pathname.startsWith('/patient/community/blood')) {
      return {
        title: 'Blood Donation Advisor',
        subtitle: 'Eligibility & Guidelines',
        isProvider: false,
        welcome: 'Looking to request or donate blood? I can check donor eligibility criteria and pre-donation nutrition rules.',
        chips: [
          'Am I eligible to donate blood?',
          'What should I eat before donating?',
          'How often can someone donate?'
        ]
      };
    }
    if (pathname.startsWith('/patient/queue') || pathname === '/patient/care/my-care') {
      return {
        title: 'Visit & Queue Assistant',
        subtitle: 'Live Appointment Guide',
        isProvider: false,
        welcome: 'I am here to guide your visit today! Ask me what questions to prepare for your doctor or how the queue works.',
        chips: [
          'Questions to ask my doctor',
          'How does live queue tracking work?',
          'Where will my prescription appear?'
        ]
      };
    }
    if (pathname.startsWith('/patient/book') || pathname.startsWith('/patient/doctors')) {
      return {
        title: 'Appointment Assistant',
        subtitle: 'Doctor Selection & Booking',
        isProvider: false,
        welcome: 'Need help choosing between in-clinic, video, or a walk-in token? Ask me about specialty guidance.',
        chips: [
          'Should I book clinic or video?',
          'What documents should I bring?',
          'Walk-in token vs Fixed-time appointment'
        ]
      };
    }

    // Default Patient Context
    return {
      title: 'Medical AI Companion',
      subtitle: 'Sehat Sahara Contextual Assistant',
      isProvider: false,
      welcome: 'Hello! I am your Sehat Sahara AI health guide. How can I help you today?',
      chips: [
        'Explain my symptoms',
        'Find the right specialist',
        'Emergency warning signs'
      ]
    };
  };

  const context = getContext();

  const [chat, setChat] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'ai',
      text: context.welcome,
      isDraft: context.isProvider,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Reset welcome when context majorly changes
  useEffect(() => {
    setChat([
      {
        id: `welcome-${pathname}`,
        sender: 'ai',
        text: context.welcome,
        isDraft: context.isProvider,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [pathname, context.welcome, context.isProvider]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat, isOpen, isTyping]);

  // Red-Flag Emergency Words
  const checkEmergency = (text: string): boolean => {
    const lower = text.toLowerCase();
    const emergencyTerms = [
      'chest pain',
      'heart attack',
      'can\'t breathe',
      'cannot breathe',
      'shortness of breath',
      'unconscious',
      'heavy bleeding',
      'severe trauma',
      'stroke',
      'paralysis',
      'fainted',
      'poison'
    ];
    return emergencyTerms.some(term => lower.includes(term));
  };

  // Generate Contextual Response
  const generateAIResponse = (query: string, attachment?: string | null): { text: string; isDraft: boolean; isEmergency: boolean } => {
    const isEmergency = checkEmergency(query);
    if (isEmergency) {
      return {
        text: `⚠️ MEDICAL ALERT: The symptoms you described may indicate a life-threatening medical emergency. \n\nPlease do not rely on an AI consultation. Immediately call 1122 (Ambulance), press the Emergency SOS button, or proceed to the nearest emergency department right away.`,
        isDraft: false,
        isEmergency: true
      };
    }

    const lower = query.toLowerCase();

    // Provider Specific Logic
    if (context.isProvider) {
      if (lower.includes('soap') || lower.includes('note')) {
        return {
          text: `**SUBJECTIVE:** Patient presents with 3-day history of productive cough, mild fever (38.2°C), and retrosternal soreness.\n**OBJECTIVE:** Chest auscultation reveals mild bilateral vesicular rhonchi, no stridor. Spo2: 98% on room air.\n**ASSESSMENT:** Acute bronchitis with upper respiratory viral prodrome. Low suspicion for pneumonia.\n**PLAN:** Symptomatic relief, Paracetamol 500mg TDS, hydration, steam inhalation. Review in 5 days if persistent.`,
          isDraft: true,
          isEmergency: false
        };
      }
      if (lower.includes('interaction') || lower.includes('drug')) {
        return {
          text: `**Drug Interaction Screen:**\n• **Amoxicillin + Paracetamol:** No significant adverse interaction detected. Safe for co-prescription.\n• **Ciprofloxacin + Multivitamins/Antacids:** Chelation warning — space by at least 2 hours to avoid reduced fluoroquinolone absorption.\n• Recommendation: Instruct patient to take antibiotics with plenty of water.`,
          isDraft: true,
          isEmergency: false
        };
      }
      if (lower.includes('differential') || lower.includes('diagnosis')) {
        return {
          text: `**Differential Diagnosis Considerations:**\n1. Viral Upper Respiratory Tract Infection (Common cold) - High probability\n2. Acute Bronchitis - Moderate probability\n3. Allergic Rhinosinusitis - Moderate probability\n4. Community-Acquired Pneumonia - Low probability (absence of localized crepitations or high-grade spiking fevers).`,
          isDraft: true,
          isEmergency: false
        };
      }
      if (lower.includes('urdu') || lower.includes('instruction')) {
        return {
          text: `**Patient Instructions (Roman Urdu):**\n"Yeh dawai din mein do martaba khana khane ke baad lein. Paani ka istemal zyada karein. Agar bukhar 3 din se zyada rahe toh foran clinic tashreef layein."`,
          isDraft: true,
          isEmergency: false
        };
      }
      if (lower.includes('queue') || lower.includes('waiting')) {
        return {
          text: `**Queue Status Summary:**\n• Active Walk-ins: 3 patients\n• Average wait time: ~18 mins per consultation\n• 1 patient flagged for elevated temperature — recommended to prioritize consultation.`,
          isDraft: true,
          isEmergency: false
        };
      }
      return {
        text: `Based on current clinical guidelines and PMDC standards: The recommended initial approach is conservative supportive therapy accompanied by vital signs monitoring. Ensure any formal diagnosis or prescription modifications are reviewed by the lead physician.`,
        isDraft: true,
        isEmergency: false
      };
    }

    // Care Seeker Attachment Handling
    if (attachment) {
      return {
        text: `I analyzed your uploaded document **${attachment}**:\n\n• **Medication Identified:** Panadol (Paracetamol) 500mg, Amoxicillin 500mg.\n• **Dosage Schedule:** 1 tablet twice daily after meals for 5 days.\n• **Caution:** Avoid taking alongside other paracetamol-containing cough syrups to prevent accidental overdose.\n\nWould you like me to automatically add these reminder times to your **Medicine Reminders** tab?`,
        isDraft: false,
        isEmergency: false
      };
    }

    // Care Seeker Query Logic
    if (lower.includes('panadol') || lower.includes('dosage')) {
      return {
        text: `**Panadol (Paracetamol 500mg):**\n• **Adult safe limit:** Maximum 4,000mg (8 tablets of 500mg) within 24 hours.\n• **Timing:** Can be taken with or after food, spaced at least 4 to 6 hours apart.\n• **Caution:** Do not combine with other cold/flu remedies that also contain paracetamol.`,
        isDraft: false,
        isEmergency: false
      };
    }
    if (lower.includes('amoxicillin') || lower.includes('antibiotic') || lower.includes('food')) {
      return {
        text: `**Antibiotic Guidance (Amoxicillin):**\n• It is best taken at the start of a meal or light snack to reduce stomach discomfort.\n• Complete the entire prescribed course even if symptoms resolve earlier to prevent bacterial resistance.\n• Drink plenty of water throughout the day.`,
        isDraft: false,
        isEmergency: false
      };
    }
    if (lower.includes('cbc') || lower.includes('blood test') || lower.includes('report')) {
      return {
        text: `**Understanding CBC Test Results:**\n• **Hemoglobin (Hb):** Normal is 12–15 g/dL (females) or 13.5–17.5 g/dL (males). Lower values may indicate anemia.\n• **WBC (White Blood Cells):** Normal 4,000–11,000 /mcL. Elevated levels often signify an active immune response or infection.\n• **Platelets:** Normal 150,000–450,000 /mcL. Crucial for blood clotting.`,
        isDraft: false,
        isEmergency: false
      };
    }
    if (lower.includes('donate') || lower.includes('blood') || lower.includes('eligible')) {
      return {
        text: `**Blood Donation Eligibility in Pakistan:**\n• **Age:** 18 to 65 years\n• **Weight:** At least 50 kg\n• **Interval:** 3 months since your last whole blood donation\n• **Pre-donation tip:** Drink 500ml of water and eat a healthy iron-rich meal 2 hours before donating. Avoid heavy caffeine.`,
        isDraft: false,
        isEmergency: false
      };
    }
    if (lower.includes('walk-in') || lower.includes('token') || lower.includes('fixed')) {
      return {
        text: `**Booking Modes Explained:**\n• **Fixed-Time Appointment:** Ideal when you want to pick an exact day and time slot in advance.\n• **Walk-in Queue Token:** Ideal for visiting the clinic today! You get a live token number (e.g. #45) and can track the live queue right on your phone without standing in line.`,
        isDraft: false,
        isEmergency: false
      };
    }
    if (lower.includes('question') || lower.includes('ask doctor')) {
      return {
        text: `**3 Helpful Questions to Ask Your Doctor:**\n1. *"What is the most likely cause of my symptoms?"*\n2. *"Are there any specific warning signs that should prompt an immediate return?"*\n3. *"Do any of these new medications interfere with my current daily routine?"*`,
        isDraft: false,
        isEmergency: false
      };
    }

    // Default Fallback
    return {
      text: `Thank you for sharing. Based on typical health guidelines, this condition is best managed with adequate rest, hydration, and monitoring. If symptoms worsen, please use the **Find Care** tab to consult a verified physician or consult our emergency team.`,
      isDraft: false,
      isEmergency: false
    };
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() && !attachedFile) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query || (attachedFile ? `Uploaded attachment: ${attachedFile}` : ''),
      attachmentName: attachedFile || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChat(prev => [...prev, userMsg]);
    setInputMessage('');
    const currentAttachment = attachedFile;
    setAttachedFile(null);
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateAIResponse(query, currentAttachment);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        isDraft: response.isDraft,
        isEmergency: response.isEmergency,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChat(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleAttachMockFile = () => {
    if (attachedFile) {
      setAttachedFile(null);
    } else {
      setAttachedFile('Prescription_Scan_Aug2026.jpg');
    }
  };

  if (isExcluded) return null;

  return (
    <>
      {/* ── Floating Action Button ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{ bottom: bottomOffset }}
          className="absolute right-4 w-12 h-12 sm:w-14 sm:h-14 bg-[#1B7F4C] text-white rounded-full shadow-xl flex items-center justify-center hover:bg-emerald-800 active:scale-95 transition-all z-40 border-2 border-white focus:outline-none"
          aria-label="Open Contextual Medical AI"
        >
          <Bot className="w-6 h-6 sm:w-7 sm:h-7" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-white" />
        </button>
      )}

      {/* ── Contextual Medical AI Modal ── */}
      {isOpen && (
        <div className="absolute inset-0 z-50 flex flex-col bg-slate-900/50 animate-in fade-in duration-200">
          <div className="flex-1" onClick={() => setIsOpen(false)} />
          
          <div className="bg-white rounded-t-3xl shadow-2xl flex flex-col h-[75vh] max-h-[620px] animate-in slide-in-from-bottom duration-300 overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  context.isProvider ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-[#1B7F4C]'
                }`}>
                  {context.isProvider ? <Stethoscope className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-slate-900 text-[15px] truncate">{context.title}</h3>
                    {context.isProvider && (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase tracking-wide">
                        Clinical
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{context.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button 
                  onClick={() => {
                    setChat([{
                      id: 'reset',
                      sender: 'ai',
                      text: context.welcome,
                      isDraft: context.isProvider,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }]);
                  }}
                  title="Reset conversation"
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full active:bg-slate-100"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-full active:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Emergency Ribbon if Red-Flag Triggered */}
            {chat.some(m => m.isEmergency) && (
              <div className="bg-rose-600 text-white px-4 py-2 flex items-center justify-between text-xs font-semibold animate-pulse shrink-0">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>EMERGENCY SUSPECTED: CALL 1122</span>
                </div>
                <button 
                  onClick={() => { setIsOpen(false); navigate('/patient/sos'); }} 
                  className="px-2 py-0.5 bg-white text-rose-700 rounded font-black text-[11px]"
                >
                  OPEN SOS
                </button>
              </div>
            )}

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
              {chat.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {/* Message Bubble */}
                  <div className={`max-w-[88%] rounded-2xl p-3.5 shadow-sm text-[13.5px] leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-[#1B7F4C] text-white rounded-tr-none' 
                      : msg.isEmergency
                      ? 'bg-rose-50 border-2 border-rose-300 text-rose-950 rounded-tl-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                  }`}>
                    {/* Attachment pill if attached */}
                    {msg.attachmentName && (
                      <div className="flex items-center gap-1.5 text-xs bg-white/20 px-2 py-1 rounded-lg mb-2 font-medium">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="truncate">{msg.attachmentName}</span>
                      </div>
                    )}

                    {/* AI Draft Badge (Critical Clinical Requirement) */}
                    {msg.isDraft && (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md mb-2 border border-amber-200/80 uppercase tracking-wider">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        AI Draft — Review Required
                      </div>
                    )}

                    {/* Message text formatted */}
                    <div className="whitespace-pre-line">
                      {msg.text}
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-tl-none px-3.5 py-2.5 w-fit shadow-sm text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                  <span>Thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion Chips */}
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
              {context.chips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 active:scale-95 transition-all shrink-0 border border-slate-200"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200 shrink-0 pb-safe">
              {attachedFile && (
                <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 text-xs px-3 py-1.5 rounded-xl mb-2 border border-emerald-200">
                  <div className="flex items-center gap-1.5 truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="truncate font-semibold">{attachedFile}</span>
                  </div>
                  <button onClick={() => setAttachedFile(null)} className="text-slate-400 hover:text-slate-600 ml-2">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2 bg-slate-50 rounded-2xl border border-slate-200 px-3 py-1.5 focus-within:border-[#1B7F4C] focus-within:bg-white transition-all">
                <button 
                  type="button"
                  onClick={handleAttachMockFile}
                  title="Attach Prescription or Lab Document"
                  className={`p-1.5 rounded-xl transition-colors ${
                    attachedFile ? 'bg-emerald-100 text-[#1B7F4C]' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                  placeholder={
                    context.isProvider 
                      ? 'Ask clinical question or draft note...' 
                      : 'Ask medical question or upload report...'
                  }
                  className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-slate-400 text-slate-900 py-1"
                />

                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!inputMessage.trim() && !attachedFile}
                  className="w-8 h-8 rounded-xl bg-[#1B7F4C] disabled:bg-slate-300 text-white flex items-center justify-center transition-all shrink-0 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mt-2">
                <HelpCircle className="w-3 h-3" />
                <span>AI guidance only. Verify with licensed healthcare professionals.</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
