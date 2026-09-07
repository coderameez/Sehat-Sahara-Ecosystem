import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MobileAppShell, Button } from '../../../components';
import { PATIENT_ROUTES } from '../../../constants/routes';
import { 
  Mic, 
  ArrowUp, 
  Bot, 
  ShieldAlert, 
  ChevronLeft, 
  RotateCcw,
  Sparkles,
  Stethoscope,
  Calendar,
  Pill,
  FileText,
  Compass,
  ClipboardCheck,
  HeartHandshake,
  BookOpen,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

interface MessageAction {
  label: string;
  route?: string;
  onClick?: () => void;
  variant?: 'primary' | 'emergency' | 'outline';
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  options?: string[];
  action?: MessageAction;
  urduText?: string;
  capabilityTag?: string;
}

type AICapabilityId = 
  | 'triage'
  | 'appointments'
  | 'medicines'
  | 'records'
  | 'navigator'
  | 'prep'
  | 'community'
  | 'literacy';

interface CapabilityItem {
  id: AICapabilityId;
  label: string;
  urduLabel: string;
  icon: React.ReactNode;
  prompt: string;
}

const CAPABILITIES: CapabilityItem[] = [
  {
    id: 'triage',
    label: 'Health & Triage',
    urduLabel: 'علامات و جانچ',
    icon: <Stethoscope className="w-4 h-4" />,
    prompt: 'I want to assess my symptoms'
  },
  {
    id: 'appointments',
    label: 'Doctor & Booking',
    urduLabel: 'ڈاکٹر و بکنگ',
    icon: <Calendar className="w-4 h-4" />,
    prompt: 'Help me find and book the right doctor'
  },
  {
    id: 'medicines',
    label: 'Medicine Safety',
    urduLabel: 'ادویات و خوراک',
    icon: <Pill className="w-4 h-4" />,
    prompt: 'I have a question about my medication dosage and timing'
  },
  {
    id: 'records',
    label: 'Lab Translator',
    urduLabel: 'ٹیسٹ رپورٹ تشریح',
    icon: <FileText className="w-4 h-4" />,
    prompt: 'Explain my lab report and medical test values'
  },
  {
    id: 'navigator',
    label: 'App Navigator',
    urduLabel: 'ایپ گائیڈ',
    icon: <Compass className="w-4 h-4" />,
    prompt: 'How do I use live tokens, home visits and care features?'
  },
  {
    id: 'prep',
    label: 'Visit Prep',
    urduLabel: 'ڈاکٹر ملاقات کی تیاری',
    icon: <ClipboardCheck className="w-4 h-4" />,
    prompt: 'Help me prepare questions and notes for my doctor consultation'
  },
  {
    id: 'community',
    label: 'Blood & Equipment',
    urduLabel: 'خون و طبی آلات',
    icon: <HeartHandshake className="w-4 h-4" />,
    prompt: 'How to request blood donors or borrow medical equipment?'
  },
  {
    id: 'literacy',
    label: 'Health & Wellness',
    urduLabel: 'صحت مند زندگی',
    icon: <BookOpen className="w-4 h-4" />,
    prompt: 'Give me preventive health tips for hypertension and diabetes'
  }
];

export const PatientTriage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialIntent = (location.state as any)?.intent;

  const [activeLang, setActiveLang] = useState<'EN' | 'UR'>('EN');
  const [activeCapability, setActiveCapability] = useState<AICapabilityId | null>(null);
  const [isListening, setIsListening] = useState(false);

  const initialWelcomeMsg: Message = {
    id: 'welcome-1',
    sender: 'ai',
    text: "Salam! I am your Sehat Sahara AI Healthcare Assistant. I can help evaluate symptoms, guide appointments, explain medications, decode lab tests, or connect with community blood donors. How may I assist you today?",
    urduText: "سلام! میں صحت سہارا کا اے آئی طبی اسسٹنٹ ہوں۔ میں آپ کی علامات کی جانچ، ڈاکٹر کی تلاش، ادویات کی معلومات اور ٹیسٹ رپورٹ سمجھانے میں مدد کر سکتا ہوں۔",
    options: [
      'Assess my headache or fever',
      'Find a clinic or video doctor',
      'How to take Panadol safely?',
      'Explain a CBC blood test'
    ]
  };

  const [messages, setMessages] = useState<Message[]>([initialWelcomeMsg]);
  const [input, setInput] = useState('');
  const [triageStep, setTriageStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialIntent === 'symptoms') {
      handleUserMessage('I want to assess my symptoms');
    }
  }, [initialIntent]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCapabilitySelect = (cap: CapabilityItem) => {
    setActiveCapability(cap.id);
    handleUserMessage(cap.prompt);
  };

  const handleUserMessage = (text: string) => {
    const newMsg: Message = { id: Date.now().toString(), sender: 'user', text };
    setMessages(prev => [...prev.map(m => ({ ...m, options: undefined })), newMsg]);

    setTimeout(() => {
      processAIMessage(text);
    }, 500);
  };

  const resetChat = () => {
    setTriageStep(0);
    setActiveCapability(null);
    setMessages([initialWelcomeMsg]);
  };

  const toggleMic = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      const simulatedVoicePrompt = activeLang === 'UR' 
        ? "مجھے شدید سر درد اور بخار ہے" 
        : "I have had a throbbing headache and mild fever since yesterday";
      handleUserMessage(simulatedVoicePrompt);
    }, 2000);
  };

  const processAIMessage = (text: string) => {
    const t = text.toLowerCase();

    // 1. EMERGENCY RED FLAGS
    if (
      t.includes('chest pain') || 
      t.includes('heart attack') || 
      t.includes('difficulty breathing') || 
      t.includes('cannot breathe') || 
      t.includes('unconscious') || 
      t.includes('stroke') || 
      t.includes('severe bleeding') ||
      t.includes('emergency')
    ) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'ai',
          capabilityTag: 'Emergency Urgent Care',
          text: "⚠️ CRITICAL MEDICAL ALERT: The symptoms you described could indicate an acute emergency requiring immediate intervention. Do not wait for an online consultation.",
          urduText: "⚠️ فوری طبی تنبیہ: یہ علامات فوری ایمرجنسی کی طرف اشارہ کر سکتی ہیں۔ براہِ کرم تاخیر نہ کریں اور فوری ایمرجنسی ایس او ایس ایکٹیویٹ کریں۔",
          action: {
            label: 'Activate Emergency SOS (Now)',
            route: '/patient/sos',
            onClick: () => navigate('/patient/sos'),
            variant: 'emergency'
          },
          options: [
            'Find Nearest 24/7 Emergency Hospital',
            'I am in a safe place now'
          ]
        }
      ]);
      return;
    }

    // 2. HEALTH & TRIAGE
    if (t.includes('headache') || t.includes('fever') || t.includes('symptom') || t.includes('cough') || t.includes('assess my symptom')) {
      if (triageStep === 0) {
        setTriageStep(1);
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'ai',
            capabilityTag: 'Smart Symptom Triage',
            text: "I can help you assess your condition. How long have you been experiencing these symptoms?",
            urduText: "میں آپ کی علامات کی جانچ میں مدد کروں گا۔ آپ کو یہ علامات کتنے عرصے سے محسوس ہو رہی ہیں؟",
            options: ['Just started today', '2 to 3 days', 'More than a week']
          }
        ]);
      } else if (triageStep === 1) {
        setTriageStep(2);
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'ai',
            capabilityTag: 'Smart Symptom Triage',
            text: "Understood. Are you experiencing any accompanying symptoms such as high fever, nausea, light sensitivity, or neck stiffness?",
            urduText: "کیا ساتھ میں تیز بخار، الٹی یا متلی، یا روشنی کی چبھن محسوس ہو رہی ہے؟",
            options: ['Mild fever & fatigue', 'Nausea & light sensitivity', 'None of these']
          }
        ]);
      } else if (triageStep === 2) {
        setTriageStep(3);
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'ai',
            capabilityTag: 'Smart Symptom Triage',
            text: "On a scale of 1 to 10, how severe would you rate the pain and discomfort?",
            urduText: "درد کی شدت 1 سے 10 کے پیمانے پر کتنی ہے؟",
            options: ['Mild (1-3) — Manageable', 'Moderate (4-6) — Bothersome', 'Severe (7-10) — Hard to function']
          }
        ]);
      } else {
        setTriageStep(0);
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'ai',
            capabilityTag: 'Triage Summary Complete',
            text: "Based on your responses, your symptoms align with a tension-type headache or seasonal viral illness. Rest, hydration, and monitoring are advised, but a clinical consultation will give you confirmed diagnosis.",
            urduText: "آپ کے جوابات کے مطابق، یہ موسمی وائرل یا تناؤ کے سبب ہو سکتا ہے۔ باقاعدہ معائنے کے لیے ڈاکٹر سے مشورہ لیں۔",
            action: {
              label: 'View Detailed Triage Report',
              route: PATIENT_ROUTES.TRIAGE_RESULT,
              onClick: () => navigate(PATIENT_ROUTES.TRIAGE_RESULT, { state: { symptom: 'Headache & Fever', answers: {} } }),
              variant: 'primary'
            },
            options: [
              'Book In-Clinic Doctor',
              'Talk to Video GP Now',
              'Medication Guidance'
            ]
          }
        ]);
      }
      return;
    }

    // 3. DOCTOR & APPOINTMENT NAVIGATOR
    if (t.includes('doctor') || t.includes('book') || t.includes('clinic') || t.includes('appointment') || t.includes('consult')) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'ai',
          capabilityTag: 'Care Navigator',
          text: "Sehat Sahara gives you 4 flexible ways to consult verified providers: In-Clinic visits, Online Video calls, Live Walk-in Queue tokens, and Direct Home Visits.",
          urduText: "صحت سہارا پر آپ کلینک، آن لائن ویڈیو، واک ان ٹوکن یا گھریلو معائنے کے ذریعے بااعتماد ڈاکٹرز سے رجوع کر سکتے ہیں۔",
          action: {
            label: 'Explore Doctors & Clinics',
            route: '/patient/care',
            onClick: () => navigate('/patient/care'),
            variant: 'primary'
          },
          options: [
            'Book Online Video Doctor (Rs. 1,500)',
            'In-Clinic General Physician',
            'Get Live Walk-in Token'
          ]
        }
      ]);
      return;
    }

    // 4. MEDICINE SAFETY & EXPLANATIONS
    if (t.includes('medicine') || t.includes('panadol') || t.includes('amoxicillin') || t.includes('dose') || t.includes('dosage') || t.includes('prescription')) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'ai',
          capabilityTag: 'Pharmacology Safety Advisor',
          text: "Panadol (Paracetamol 500mg) is used for mild-to-moderate fever and pain. For adults, typical dosage is 1–2 tablets every 4–6 hours (maximum 4,000mg per 24 hours). Always take with plenty of water and avoid taking multiple paracetamol-containing products together.",
          urduText: "پیناڈول 500 ملی گرام بخار اور ہلکے درد کے لیے ہے۔ بالغوں کے لیے عمومی خوراک 4 سے 6 گھنٹے بعد 1 تا 2 گولیاں ہیں۔ 24 گھنٹوں میں 4 گرام سے زیادہ نہ لیں۔",
          action: {
            label: 'Manage My Medicine Schedule',
            route: '/patient/medicines',
            onClick: () => navigate('/patient/medicines'),
            variant: 'primary'
          },
          options: [
            'What if I missed a dose?',
            'Can I take Panadol on an empty stomach?',
            'Amoxicillin Antibiotic rules'
          ]
        }
      ]);
      return;
    }

    // 5. HEALTH RECORDS & LAB TRANSLATOR
    if (t.includes('record') || t.includes('lab') || t.includes('cbc') || t.includes('blood test') || t.includes('report') || t.includes('hba1c')) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'ai',
          capabilityTag: 'Lab Report Translator',
          text: "A Complete Blood Count (CBC) examines 3 main components:\n• Hemoglobin (Hb): Normal 13.5–17.5 g/dL (men), 12.0–15.5 g/dL (women). Low Hb suggests anemia.\n• White Blood Cells (WBC): Normal 4,000–11,000 /mcL. Elevated WBC suggests active infection or inflammation.\n• Platelets: Normal 150,000–450,000 /mcL. Essential for healthy blood clotting.",
          urduText: "سی بی سی (CBC) رپورٹ میں ہیموگلوبن، خون کے سفید خلیات (WBC) اور پلیٹلٹس کا جائزہ لیا جاتا ہے جو انفیکشن یا اینیمیا ظاہر کرتے ہیں۔",
          action: {
            label: 'Upload or View Medical Records',
            route: '/patient/records',
            onClick: () => navigate('/patient/records'),
            variant: 'primary'
          },
          options: [
            'What does high HbA1c mean?',
            'Normal lipid / cholesterol range',
            'Share record with doctor via PIN'
          ]
        }
      ]);
      return;
    }

    // 6. SYSTEM NAVIGATOR
    if (t.includes('token') || t.includes('how to') || t.includes('navigate') || t.includes('app navigator') || t.includes('feature')) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'ai',
          capabilityTag: 'App Feature Navigator',
          text: "Here is a quick overview of Sehat Sahara's unique features:\n1. Live Queue Token: Get an automated digital token before reaching the clinic to skip physical waiting lines.\n2. Home Visits: Certified nurses and doctors visit elderly or recovering patients at home.\n3. Community Blood Hub: Request urgent matched blood donors in your city.\n4. Things Sharing: Borrow wheelchairs, nebulizers and oxygen concentrators from community donors.",
          urduText: "صحت سہارا لائیو کیو ٹوکن، گھریلو وزٹ، مفت خون کے عطیات اور ویل چیئر/آکسیجن مشین کی فراہمی میں آپ کا معاون ہے۔",
          action: {
            label: 'View Live Clinic Queue',
            route: '/patient/care',
            onClick: () => navigate('/patient/care'),
            variant: 'primary'
          },
          options: [
            'How to issue a digital token',
            'How to borrow a wheelchair',
            'Emergency SOS setup'
          ]
        }
      ]);
      return;
    }

    // 7. PRE-CONSULTATION PREPARATION
    if (t.includes('prepare') || t.includes('prep') || t.includes('questions') || t.includes('checklist') || t.includes('what to ask')) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'ai',
          capabilityTag: 'Clinical Consultation Prep',
          text: "To get the highest value from your doctor visit, here is your 4-step checklist:\n1. Timing: Note when symptoms began and what triggers or relieves them.\n2. Medications: List all vitamins, supplements and current drugs.\n3. Records: Have your past lab slips or prescription photos ready in My Records.\n4. Key Questions:\n  • What is causing my condition?\n  • Are there side effects with this prescription?\n  • When should I see improvement or schedule follow-up?",
          urduText: "ڈاکٹر سے ملاقات کے لیے علامات کا وقت، جاری ادویات کی فہرست، اور پرانی رپورٹس ساتھ رکھیں۔",
          action: {
            label: 'Open Medical Records to Share',
            route: '/patient/records',
            onClick: () => navigate('/patient/records'),
            variant: 'primary'
          },
          options: [
            'Cardiologist question checklist',
            'Diabetes specialist question checklist',
            'Book upcoming consultation'
          ]
        }
      ]);
      return;
    }

    // 8. COMMUNITY GUIDANCE (BLOOD & EQUIPMENT)
    if (t.includes('blood') || t.includes('donor') || t.includes('wheelchair') || t.includes('borrow') || t.includes('community')) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'ai',
          capabilityTag: 'Community Care Network',
          text: "Our community network connects you directly with verified local lifesavers:\n• Emergency Blood: Post a blood request for hospital patients; matched donors are notified immediately.\n• Equipment Lending: Request to borrow wheelchairs, crutches, walkers, or nebulizers at zero commercial markup.",
          urduText: "صحت سہارا کمیونٹی نیٹ ورک کے ذریعے خون کے عطیات اور طبی آلات جیسے ویل چیئر حاصل کر سکتے ہیں۔",
          action: {
            label: 'Open Blood Requests Network',
            route: '/patient/community/blood',
            onClick: () => navigate('/patient/community/blood'),
            variant: 'primary'
          },
          options: [
            'Request Emergency Blood (A+, B+, O-)',
            'Pledge as a Voluntary Blood Donor',
            'Borrow Medical Wheelchair'
          ]
        }
      ]);
      return;
    }

    // 9. HEALTH LITERACY & WELLNESS
    if (t.includes('literacy') || t.includes('wellness') || t.includes('diabetes') || t.includes('hypertension') || t.includes('prevention') || t.includes('dengue')) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'ai',
          capabilityTag: 'Preventive Health Literacy',
          text: "Pakistani Wellness Insights:\n• Blood Pressure: Keep sodium below 2,000mg/day. Limit excessive fried parathas and salty chaat.\n• Diabetes Management: Swap white rice with brown or portion-controlled whole wheat rotis; aim for 30 minutes brisk daily walking.\n• Dengue & Heatwave Prevention: Drink 3+ liters of boiled/filtered water daily, use mosquito screens at dusk, and keep ORS packets at home.",
          urduText: "بلڈ پریشر اور شوگر کے کنٹرول کے لیے نمک اور چینی کا کم استعمال، روزانہ 30 منٹ چہل قدمی اور ڈینگی سے بچاؤ کے لیے مچھر دانی استعمال کریں۔",
          action: {
            label: 'Find a Nutrition & Lifestyle Specialist',
            route: '/patient/care',
            onClick: () => navigate('/patient/care'),
            variant: 'primary'
          },
          options: [
            'Dengue fever warning signs',
            'Normal blood pressure guidelines',
            'Symptom assessment triage'
          ]
        }
      ]);
      return;
    }

    // DEFAULT FALLBACK
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'ai',
        capabilityTag: 'General Health Assistant',
        text: `I understand you are asking about "${text}". I can help assess symptoms, find doctors, explain lab results, or provide medication guidelines. Which would you like to explore?`,
        urduText: `میں علامات کی جانچ، ڈاکٹر کی بکنگ، اور ادویات کی معلومات میں آپ کی رہنمائی کر سکتا ہوں۔`,
        options: [
          'Assess my symptoms',
          'Find a doctor or clinic',
          'Explain a medicine or dosage',
          'Decode a lab test report'
        ]
      }
    ]);
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-slate-50 relative">
        {/* Header */}
        <header className="px-4 py-3 pt-safe flex items-center justify-between bg-white border-b border-slate-200 shrink-0 sticky top-0 z-10 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => navigate((location.state as any)?.from || '/patient', { replace: true })} 
              className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 active:bg-slate-200 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-[17px] font-bold text-slate-900 leading-tight">Sehat Sahara AI</h1>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-[#166B32] flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> 24/7 Care
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Bilingual Clinical & Navigation Assistant</p>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5">
            {/* Lang switcher */}
            <button
              onClick={() => setActiveLang(prev => prev === 'EN' ? 'UR' : 'EN')}
              className="px-2.5 py-1 rounded-full text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 active:scale-95 transition-all"
              title="Toggle English / Urdu"
            >
              {activeLang === 'EN' ? 'اردو' : 'English'}
            </button>

            {/* Reset */}
            <button
              onClick={resetChat}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center active:scale-95 transition-all"
              title="Reset Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Safety Disclaimer Banner */}
        <div className="px-3.5 py-2 bg-amber-50/90 border-b border-amber-200/80 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-[11px] text-amber-900 font-medium leading-tight truncate">
              {activeLang === 'UR'
                ? 'اے آئی مشورہ صرف رہنمائی کے لیے ہے۔ ایمرجنسی میں 1122 ملائیں۔'
                : 'AI guidance is for informational support. In emergencies, use SOS or call 1122.'}
            </p>
          </div>
          <button 
            onClick={() => navigate('/patient/sos')}
            className="px-2 py-0.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-wider shrink-0 shadow-2xs"
          >
            SOS
          </button>
        </div>

        {/* 8 Core Capability Quick Select Pills */}
        <div className="px-3 py-2 bg-white border-b border-slate-200 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
          {CAPABILITIES.map(cap => {
            const isSelected = activeCapability === cap.id;
            return (
              <button
                key={cap.id}
                onClick={() => handleCapabilitySelect(cap)}
                className={`px-2.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-[#166B32] border-[#166B32] text-white shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-emerald-50/50 hover:border-emerald-200'
                }`}
              >
                <span className={isSelected ? 'text-white' : 'text-[#166B32]'}>{cap.icon}</span>
                <span>{activeLang === 'UR' ? cap.urduLabel : cap.label}</span>
              </button>
            );
          })}
        </div>

        {/* Chat Messages */}
        <div ref={scrollRef} className="app-scroll flex-1 p-4 flex flex-col gap-3.5 pb-4 overflow-y-auto">
          {messages.map(msg => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`flex gap-2.5 max-w-[88%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#166B32] to-emerald-500 flex items-center justify-center shrink-0 mt-0.5 text-white shadow-2xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`
                  p-3.5 rounded-2xl text-[14px] leading-relaxed shadow-2xs
                  ${msg.sender === 'user' 
                    ? 'bg-[#166B32] text-white rounded-tr-xs' 
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                  }
                `}>
                  {/* Capability Badge if available */}
                  {msg.capabilityTag && (
                    <div className="mb-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-[#166B32] border border-emerald-200/60 inline-block">
                        {msg.capabilityTag}
                      </span>
                    </div>
                  )}

                  <div className="whitespace-pre-line">
                    {msg.text}
                  </div>

                  {/* Urdu Translation if present */}
                  {msg.urduText && activeLang === 'UR' && (
                    <div className="mt-2 pt-2 border-t border-slate-100 text-[13px] text-emerald-950 font-medium leading-relaxed font-arabic" dir="rtl">
                      {msg.urduText}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {msg.action && (
                <div className="mt-2.5 ml-10 max-w-xs w-full">
                  <Button
                    fullWidth
                    size="md"
                    variant={msg.action.variant === 'emergency' ? 'danger' : 'primary'}
                    onClick={() => {
                      if (msg.action?.onClick) msg.action.onClick();
                      else if (msg.action?.route) navigate(msg.action.route);
                    }}
                    className={
                      msg.action.variant === 'emergency' 
                        ? 'bg-rose-600 hover:bg-rose-700 text-white font-bold animate-pulse'
                        : 'bg-[#166B32] hover:bg-[#125828] text-white font-bold'
                    }
                    icon={msg.action.variant === 'emergency' ? <AlertTriangle className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  >
                    {msg.action.label}
                  </Button>
                </div>
              )}

              {/* Quick Select Options */}
              {msg.options && msg.options.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2.5 ml-10">
                  {msg.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleUserMessage(opt)}
                      className="px-3.5 py-1.5 rounded-full border border-emerald-300 bg-white hover:bg-emerald-50 text-[#166B32] text-[12px] font-bold active:scale-95 transition-all shadow-2xs flex items-center gap-1 text-left"
                    >
                      <span>{opt}</span>
                      <ChevronRight className="w-3 h-3 shrink-0 opacity-70" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Listening Indicator */}
          {isListening && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 animate-pulse">
              <div className="w-3 h-3 rounded-full bg-emerald-600 animate-ping" />
              <p className="text-xs font-bold text-[#166B32]">
                {activeLang === 'UR' ? 'آواز سنی جا رہی ہے (اردو / انگریزی)...' : 'Listening for clinical prompt (English / Urdu)...'}
              </p>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 pb-safe shrink-0">
          <div className="flex gap-2 items-center">
            <button 
              onClick={toggleMic}
              className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-colors shadow-2xs ${
                isListening 
                  ? 'bg-rose-500 text-white animate-bounce' 
                  : 'bg-slate-100 active:bg-slate-200 text-slate-700'
              }`}
              title="Voice Input (English / Urdu)"
            >
              <Mic className="w-5 h-5" />
            </button>
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={activeLang === 'UR' ? "طبی سوال یا علامات لکھیں..." : "Ask symptoms, medicines, lab tests, booking..."}
                onKeyDown={e => {
                  if (e.key === 'Enter' && input.trim()) {
                    handleUserMessage(input);
                    setInput('');
                  }
                }}
                className="w-full py-2.5 pl-4 pr-11 rounded-full border border-slate-200 bg-slate-50 text-[14px] text-slate-900 outline-none focus:border-[#166B32] focus:bg-white transition-colors"
              />
              <button 
                onClick={() => { if(input.trim()) { handleUserMessage(input); setInput(''); } }}
                disabled={!input.trim()}
                className={`absolute right-1 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  input.trim() ? 'bg-[#166B32] text-white shadow-2xs' : 'bg-slate-200 text-slate-400'
                }`}
                aria-label="Send message"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </MobileAppShell>
  );
};
