import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MobileAppShell } from '../../../components';
import { ArrowUp, Bot, ShieldAlert, ChevronLeft } from 'lucide-react';
import { OnboardingStore } from '../../../services/OnboardingStore';
import { PATIENT_ROUTES } from '../../../constants/routes';

type Message = {
  id: string;
  sender: 'user' | 'other' | 'ai';
  text: string;
  time?: string;
  options?: string[];
  action?: { label: string; onClick: () => void };
};

export const ContextualChat: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = location.state as any;

  const isDoctor = location.pathname.startsWith('/doctor') || OnboardingStore.getSnapshot().role === 'Doctor';
  const parentPath = isDoctor ? '/doctor/community' : PATIENT_ROUTES.COMMUNITY;

  const isContextual = Boolean(navState?.otherPartyName || navState?.contextTitle);
  const title = navState?.otherPartyName || (isDoctor ? 'Community Network' : 'Health Assistant');
  const subtitle = navState?.contextTitle || (isDoctor ? 'Peer Coordination' : 'Community AI');

  const initialMessages: Message[] = isContextual ? [
    { 
      id: '1', 
      sender: 'other', 
      text: `Hello! Regarding "${navState?.contextTitle || 'Community Request'}", please let me know details on timing and location.`,
      time: '10:00 AM'
    }
  ] : [
    { 
      id: '1', 
      sender: 'ai', 
      text: 'Hello! I am your Community Health AI. Ask me general health questions, clarify medical terms, or get guidance on daily wellness.', 
      options: ['What is hypertension?', 'Tips for better sleep', 'Is fasting healthy?'] 
    }
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleUserMessage = (text: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: Message = { id: Date.now().toString(), sender: 'user', text, time: timeStr };
    setMessages(prev => [...prev.map(m => ({ ...m, options: undefined })), newMsg]);
    
    setTimeout(() => {
      if (isContextual) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'other',
          text: `Thank you! I received your message: "${text}". I will update you promptly.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        processAIMessage(text);
      }
    }, 800);
  };

  const processAIMessage = (text: string) => {
    const t = text.toLowerCase();
    let reply = "Always consult with a licensed healthcare professional for individual diagnosis and prescriptions.";
    let options = ['Ask another question', 'Find a doctor instead'];

    if (t.includes('hypertension')) {
      reply = "Hypertension (high blood pressure) is consistently elevated pressure against blood vessel walls. Regular physical activity, low-sodium diet, and prescribed antihypertensives keep it controlled.";
    } else if (t.includes('sleep')) {
      reply = "For healthy sleep hygiene: maintain steady bedtimes, keep the bedroom dark and cool, and avoid blue light or caffeine 3 hours before sleep.";
    } else if (t.includes('fasting')) {
      reply = "Intermittent fasting can improve insulin sensitivity and weight management. Ensure adequate hydration with electrolytes during fasting windows.";
    }

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'ai',
      text: reply,
      options
    }]);
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-slate-50 relative">
        {/* Header */}
        <header className="px-4 py-4 pt-safe flex items-center bg-white border-b border-slate-200 shrink-0 sticky top-0 z-10">
          <button 
            onClick={() => navigate(parentPath, { replace: true })} 
            className="p-1 -ml-1 active:bg-slate-100 rounded-full text-slate-800"
            aria-label="Go back"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <div className="ml-2 flex flex-col">
            <h1 className="text-[17px] font-bold text-slate-900 leading-none mb-1">{title}</h1>
            <span className="text-[11px] font-medium text-slate-500">{subtitle}</span>
          </div>
        </header>
        
        {!isContextual && (
          <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-[11px] text-amber-800 leading-tight">
              AI guidance is educational. In case of acute symptoms, consult a verified physician immediately.
            </p>
          </div>
        )}

        {/* Message Stream */}
        <div ref={scrollRef} className="app-scroll flex-1 p-4 flex flex-col gap-4 pb-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-[#166B32] flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                {msg.sender === 'other' && (
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                    {title.charAt(0)}
                  </div>
                )}

                <div className={`
                  p-3 rounded-2xl text-[14px] leading-relaxed
                  ${msg.sender === 'user' 
                    ? 'bg-[#166B32] text-white rounded-tr-xs' 
                    : 'bg-white text-slate-900 border border-slate-200 rounded-tl-xs shadow-2xs'
                  }
                `}>
                  {msg.text}
                </div>
              </div>

              {msg.options && (
                <div className="flex flex-wrap gap-1.5 mt-2 ml-9">
                  {msg.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleUserMessage(opt)}
                      className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 pb-safe shrink-0">
          <div className="flex gap-2 items-center">
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={isContextual ? "Type your coordination message..." : "Ask a health question..."}
                onKeyDown={e => {
                  if (e.key === 'Enter' && input.trim()) {
                    handleUserMessage(input);
                    setInput('');
                  }
                }}
                className="w-full py-3 pl-4 pr-12 rounded-full border border-slate-200 bg-slate-50 text-[14px] outline-none focus:border-[#166B32] focus:bg-white transition-colors"
              />
              <button 
                onClick={() => { if(input.trim()) { handleUserMessage(input); setInput(''); } }}
                disabled={!input.trim()}
                className={`absolute right-1.5 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  input.trim() ? 'bg-[#166B32] text-white' : 'bg-slate-200 text-slate-400'
                }`}
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
