import React, { useState } from 'react';
import { Phone, MessageCircle, MessageSquare } from 'lucide-react';

interface ContactActionsProps {
  name: string;
  onInAppChat: () => void;
  allowSim?: boolean;
  allowWhatsApp?: boolean;
}

export const ContactActions: React.FC<ContactActionsProps> = ({ 
  name, 
  onInAppChat, 
  allowSim = true, 
  allowWhatsApp = true 
}) => {
  const [modalState, setModalState] = useState<{ isOpen: boolean; type: 'Call' | 'WhatsApp' | null }>({ isOpen: false, type: null });

  const handleAction = (type: 'Call' | 'WhatsApp') => {
    setModalState({ isOpen: true, type });
  };

  const confirmAction = () => {
    // Simulate external app launch with a toast or just close
    alert(`Success: Launching ${modalState.type} to contact ${name}`);
    setModalState({ isOpen: false, type: null });
  };

  return (
    <>
      <div className="flex gap-2">
        {allowSim && (
          <button 
            onClick={() => handleAction('Call')}
            className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" /> Call
          </button>
        )}
        {allowWhatsApp && (
          <button 
            onClick={() => handleAction('WhatsApp')}
            className="flex-1 bg-[#25D366]/10 text-[#25D366] py-3 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </button>
        )}
        <button 
          onClick={onInAppChat}
          className="flex-[2] bg-brand-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4" /> In-App Chat
        </button>
      </div>

      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setModalState({ isOpen: false, type: null })} />
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 relative z-10 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Leave Sehat Sahara?</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              You are leaving Sehat Sahara to contact <strong className="text-slate-900">{name}</strong> via {modalState.type}. Continue?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setModalState({ isOpen: false, type: null })}
                className="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAction}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-brand-600"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
