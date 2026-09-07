import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { MobileAppShell } from '../../../components';
import { ChevronLeft, Send } from 'lucide-react';

import { PrototypeStore } from '../../../services/PrototypeStore';
import { useAppBack } from '../../../utils/navigation';

export const DonorChat: React.FC = () => {
  const goBack = useAppBack();
  const { donorId } = useParams<{ donorId: string }>();
  
  const store = PrototypeStore.getSnapshot();
  const conversation = store.conversations.find(c => c.referenceId === donorId) || { messages: [] };
  const messages = conversation.messages.length > 0 ? conversation.messages : [
    { id: '1', text: 'Hi! I saw your request.', sender: 'donor', time: '10:00 AM' }
  ];

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsg = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    // Auto create conversation if it doesn't exist
    if (!store.conversations.find(c => c.referenceId === donorId)) {
      PrototypeStore.addConversation({ id: `CONV-${donorId}`, referenceId: donorId || '', messages: [newMsg] });
    } else {
      const convId = store.conversations.find(c => c.referenceId === donorId)?.id;
      if (convId) PrototypeStore.addMessageToConversation(convId, newMsg);
    }
    
    setInput('');
    setIsTyping(true);

    // Auto-reply after 3 seconds
    setTimeout(() => {
      setIsTyping(false);
      const replyMsg = {
        id: Date.now().toString(),
        text: 'Great, I will be there soon.',
        sender: 'donor',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const convId = PrototypeStore.getSnapshot().conversations.find(c => c.referenceId === donorId)?.id;
      if (convId) PrototypeStore.addMessageToConversation(convId, replyMsg);
    }, 3000);
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-slate-50 relative">
        <header className="px-4 py-4 flex items-center bg-white border-b border-slate-200 shrink-0 sticky top-0 z-10">
          <button onClick={() => goBack()} className="p-1 -ml-1 active:bg-slate-100 rounded-full">
            <ChevronLeft className="w-7 h-7 text-slate-900" />
          </button>
          <div className="flex items-center gap-3 ml-2">
            <img 
              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&auto=format&fit=crop" 
              alt="Donor" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h1 className="text-[16px] font-bold text-slate-900 leading-tight">Raza Ali</h1>
              <span className="text-[12px] text-emerald-600 font-medium">Online</span>
            </div>
          </div>
        </header>

        <div ref={scrollRef} className="app-scroll flex-1 px-4 py-6 overflow-y-auto bg-slate-50">
          <div className="flex flex-col gap-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
                <div className={`px-4 py-2.5 rounded-2xl ${msg.sender === 'user' ? 'bg-[#1B7F4C] text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-900 rounded-bl-sm'}`}>
                  <p className="text-[15px]">{msg.text}</p>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
            {isTyping && (
              <div className="flex self-start px-4 py-3 bg-white border border-slate-200 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-3 bg-white border-t border-slate-200 pb-safe shrink-0">
          <div className="flex items-end gap-2 bg-slate-100 rounded-3xl p-1 border border-slate-200">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-[15px]"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#1B7F4C] rounded-full text-white disabled:opacity-50 disabled:bg-slate-300 transition-colors"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </MobileAppShell>
  );
};
