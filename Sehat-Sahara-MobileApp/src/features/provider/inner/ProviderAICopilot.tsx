import React, { useState } from 'react';
import { ProviderInnerLayout } from '../components/ProviderInnerLayout';
import { ProviderStore } from '../../../services/ProviderStore';
import { Sparkles, AlertTriangle, Send } from 'lucide-react';

export const ProviderAICopilot: React.FC = () => {
  const { journey } = ProviderStore.getSnapshot();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([]);

  const isStudent = journey === 'medical_student';

  const suggestedPrompts = isStudent ? [
    "Explain the pathophysiology of asthma",
    "List common OSCE stations for general surgery",
    "How to take a complete pediatric history"
  ] : [
    "Draft a referral letter for cardiology",
    "Differential diagnosis for chronic cough in adults",
    "Summarize latest guidelines for hypertension"
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');

    // Mock deterministic response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: "This is a deterministic AI draft response based on your role. Please note that this is for demonstration purposes only and must be clinically verified." 
      }]);
    }, 1000);
  };

  return (
    <ProviderInnerLayout title="AI Copilot" subtitle="Clinical Assistant">
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        
        {/* Disclaimer */}
        <div className="bg-amber-50 px-4 py-3 border-b border-amber-100 flex items-start gap-3 shrink-0">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <h4 className="text-[13px] font-bold text-amber-900 mb-0.5">Professional Tool Disclaimer</h4>
            <p className="text-xs text-amber-800">
              AI outputs are for reference and drafting only. You must review, verify, and take clinical responsibility for all decisions.
            </p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto opacity-70 mt-10">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">How can I assist you?</h3>
              <p className="text-sm text-slate-500 mb-8">
                I can help you draft notes, recall guidelines, or explore differential diagnoses.
              </p>
              
              <div className="w-full space-y-2">
                {suggestedPrompts.map((prompt, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="w-full p-3 text-sm text-left bg-white border border-slate-200 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-[15px] ${
                  msg.role === 'user' 
                    ? 'bg-brand-600 text-white rounded-tr-sm' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                }`}>
                  {msg.role === 'ai' && (
                    <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-slate-100">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Draft — Review Required</span>
                    </div>
                  )}
                  {msg.content}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Ask for clinical reference or drafting..."
              className="w-full pl-4 pr-12 py-3.5 bg-slate-100 border-none rounded-2xl text-[14px] focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim()}
              className="absolute right-2 w-10 h-10 flex items-center justify-center bg-brand-600 text-white rounded-xl disabled:opacity-50 disabled:bg-slate-300"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </ProviderInnerLayout>
  );
};
