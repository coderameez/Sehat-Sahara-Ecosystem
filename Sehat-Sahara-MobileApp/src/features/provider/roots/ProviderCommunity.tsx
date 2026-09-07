import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProviderRootLayout } from '../components/ProviderRootLayout';
import { ProviderStore } from '../../../services/ProviderStore';
import { Users, BookOpen, Microscope, Share2, Droplet, Package, Sparkles } from 'lucide-react';
import { Button, BottomSheet } from '../../../components';

export const ProviderCommunity: React.FC = () => {
  const navigate = useNavigate();
  const { journey } = ProviderStore.getSnapshot();
  const isStudent = journey === 'medical_student';

  const [comingSoon, setComingSoon] = useState<{ title: string; desc: string } | null>(null);

  const openComingSoon = (title: string, desc?: string) => {
    setComingSoon({
      title,
      desc: desc || 'This professional networking and academic module is scheduled for release in the upcoming Sehat Sahara update.'
    });
  };

  return (
    <ProviderRootLayout activeTab="community">
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        {/* Header */}
        <header className="px-5 pt-4 pb-4 bg-white border-b border-slate-200 shrink-0 pt-safe">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Provider Community</h1>
          <p className="text-sm text-slate-500">
            {isStudent 
              ? 'Connect with peers, mentors, and academic resources.' 
              : 'Professional network, case discussions, and resource sharing.'}
          </p>
        </header>

        {/* Content */}
        <div className="flex-1 min-h-0 app-scroll p-5 space-y-6">
          
          {/* Active Public Healthcare Modules (Working) */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Community Exchanges</h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/doctor/community/blood')}
                className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4 active:scale-[0.99] transition-transform shadow-xs text-left group hover:border-red-200"
              >
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Droplet className="w-6 h-6 text-red-600 fill-current" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-[15px] font-bold text-slate-900 group-hover:text-red-700 transition-colors">Blood Donation Network</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 px-2 py-0.5 rounded">Active</span>
                  </div>
                  <p className="text-[12px] text-slate-500 leading-snug">View nearby emergency requests, coordinate donor responses, and pledge blood.</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/doctor/community/things')}
                className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4 active:scale-[0.99] transition-transform shadow-xs text-left group hover:border-blue-200"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-[15px] font-bold text-slate-900 group-hover:text-blue-700 transition-colors">Things Sharing & Borrow</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Active</span>
                  </div>
                  <p className="text-[12px] text-slate-500 leading-snug">Browse available equipment, wheelchairs, and submit borrow requests.</p>
                </div>
              </button>
            </div>
          </div>

          {/* Featured Group */}
          <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-5 text-white shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-white/20 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                  Featured
                </span>
                <span className="text-xs font-medium text-brand-100">1,204 Members</span>
              </div>
              <h2 className="text-xl font-bold mb-2">
                {isStudent ? 'Final Year OSCE Prep Group' : 'National Cardiology Case Forum'}
              </h2>
              <p className="text-brand-100 text-sm mb-4">
                {isStudent 
                  ? 'Join daily practice sessions and get feedback from supervisors.'
                  : 'Discuss complex cases and review the latest treatment guidelines.'}
              </p>
              <Button 
                variant="secondary" 
                onClick={() => openComingSoon(isStudent ? 'Final Year OSCE Prep Group' : 'National Cardiology Case Forum')}
                className="!bg-white !text-brand-700 !border-transparent hover:!bg-brand-50 shadow-sm"
              >
                Join Discussion
              </Button>
            </div>
          </div>

          {/* Hubs */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Professional Hubs</h3>
            <div className="grid grid-cols-2 gap-3">
              <HubCard 
                icon={<Users />} 
                title="Mentorship" 
                desc={isStudent ? 'Find a supervisor' : 'Mentor a junior'}
                color="text-blue-600 bg-blue-50"
                onClick={() => openComingSoon('Mentorship Hub', 'Peer mentorship and senior clinical guidance network.')}
              />
              <HubCard 
                icon={<BookOpen />} 
                title="Case Learning" 
                desc="Clinical discussions"
                color="text-indigo-600 bg-indigo-50"
                onClick={() => openComingSoon('Case Learning Hub', 'Peer-reviewed clinical cases, diagnostic puzzles, and case presentations.')}
              />
              <HubCard 
                icon={<Microscope />} 
                title="Research" 
                desc="Collaborate on papers"
                color="text-purple-600 bg-purple-50"
                onClick={() => openComingSoon('Clinical Research Hub', 'Multi-center clinical research, trials, and collaborative writing.')}
              />
              <HubCard 
                icon={<Share2 />} 
                title="Resource Share" 
                desc="Notes & Guidelines"
                color="text-emerald-600 bg-emerald-50"
                onClick={() => openComingSoon('Resource Sharing', 'Clinical protocols, pharmacology guides, and academic summaries.')}
              />
            </div>
          </div>

          {/* Recent Discussions */}
          <div>
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trending Discussions</h3>
              <button onClick={() => openComingSoon('All Discussions')} className="text-xs font-bold text-[#166B32]">View All</button>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
              <DiscussionRow 
                title={isStudent ? "How to approach the surgery viva?" : "Atypical presentation of Dengue"} 
                author={isStudent ? "Ahmed A." : "Dr. Fatima K."}
                replies={24}
                time="2h ago"
                onClick={() => openComingSoon(isStudent ? "How to approach the surgery viva?" : "Atypical presentation of Dengue")}
              />
              <DiscussionRow 
                title={isStudent ? "Notes for pharmacology requested" : "Thoughts on new hypertension guidelines"} 
                author={isStudent ? "Sara W." : "Dr. Bilal M."}
                replies={12}
                time="5h ago"
                onClick={() => openComingSoon(isStudent ? "Notes for pharmacology requested" : "Thoughts on new hypertension guidelines")}
              />
            </div>
          </div>

        </div>

        {/* Coming Soon Modal */}
        <BottomSheet isOpen={Boolean(comingSoon)} onClose={() => setComingSoon(null)} title={comingSoon?.title || 'Coming Soon'}>
          <div className="pb-4 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#166B32] flex items-center justify-center mx-auto mb-2">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{comingSoon?.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              {comingSoon?.desc}
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
              Currently available provider modules: <strong className="text-slate-800">Blood Donation Network</strong> and <strong className="text-slate-800">Things Sharing & Borrow</strong>.
            </div>
            <Button fullWidth onClick={() => setComingSoon(null)} className="bg-[#166B32] text-white font-bold">
              Back to Provider Community
            </Button>
          </div>
        </BottomSheet>

      </div>
    </ProviderRootLayout>
  );
};

const HubCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  desc: string; 
  color: string;
  onClick: () => void;
}> = ({ icon, title, desc, color, onClick }) => (
  <button 
    onClick={onClick}
    className="bg-white rounded-2xl border border-slate-200 p-4 text-left flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all active:scale-[0.98]"
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
      {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
    </div>
    <div>
      <h4 className="font-bold text-slate-900 text-sm mb-0.5">{title}</h4>
      <p className="text-xs text-slate-500 leading-tight">{desc}</p>
    </div>
  </button>
);

const DiscussionRow: React.FC<{
  title: string;
  author: string;
  replies: number;
  time: string;
  onClick: () => void;
}> = ({ title, author, replies, time, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full text-left p-4 hover:bg-slate-50 transition-colors active:bg-slate-100 block"
  >
    <h4 className="font-bold text-slate-900 text-sm mb-1">{title}</h4>
    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
      <span>{author}</span>
      <span>•</span>
      <span>{replies} replies</span>
      <span>•</span>
      <span>{time}</span>
    </div>
  </button>
);
