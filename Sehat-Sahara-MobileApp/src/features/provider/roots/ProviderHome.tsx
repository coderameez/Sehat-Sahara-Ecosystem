import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProviderRootLayout } from '../components/ProviderRootLayout';
import { ProviderStore } from '../../../services/ProviderStore';
import { Button } from '../../../components';
import { 
  Briefcase, Activity, BookOpen, Clock, 
  MessageSquare, FileText, CheckCircle, Video, Users, Stethoscope, Calendar
} from 'lucide-react';

export const ProviderHome: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState(ProviderStore.getSnapshot());

  useEffect(() => {
    const unsub = ProviderStore.subscribe(() => {
      setState(ProviderStore.getSnapshot());
    });
    return () => { unsub(); };
  }, []);

  const { journey, appointments = [], opportunities = [], creditBalance = 0 } = state || {};
  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  const nextAppointment = safeAppointments.find(a => a?.status === 'Upcoming' || a?.status === 'Active' || a?.status === 'Waiting');

  const renderStudentHome = () => (
    <div className="p-5 space-y-6">
      {/* Hero */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Build Your Medical Career</h2>
        <p className="text-sm text-slate-600 mb-6">Find supervised opportunities, practise clinical skills and maintain your learning record.</p>
        <Button onClick={() => navigate('/doctor/opportunities')} variant="primary" fullWidth>
          Explore Opportunities
        </Button>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <QuickAction icon={<Briefcase />} label="My Applications" color="bg-blue-50 text-blue-600" onClick={() => navigate('/doctor/opportunities')} />
          <QuickAction icon={<Activity />} label="AI Clinical Cases" color="bg-purple-50 text-purple-600" onClick={() => navigate('/doctor/ai-copilot')} />
          <QuickAction icon={<BookOpen />} label="Procedure Logbook" color="bg-indigo-50 text-indigo-600" />
          <QuickAction icon={<FileText />} label="CV & Profile" color="bg-orange-50 text-orange-600" onClick={() => navigate('/doctor/profile')} />
        </div>
      </div>

      {/* Next Session */}
      {nextAppointment && (
        <div>
          <div className="flex justify-between items-end mb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Up Next</h3>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                {nextAppointment.patientInitials}
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{nextAppointment.patientName}</h4>
                <p className="text-sm text-slate-500">{nextAppointment.reason}</p>
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl flex justify-between text-sm mb-4">
              <span className="font-medium text-slate-600">{nextAppointment.date} at {nextAppointment.time}</span>
              <span className="font-bold text-blue-700">{nextAppointment.mode}</span>
            </div>
            <Button variant="secondary" fullWidth onClick={() => navigate('/doctor/appointments')}>
              View Details
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const renderFreshDoctorHome = () => (
    <div className="p-5 space-y-6">
      {/* Hero */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Find Work and Grow Your Practice</h2>
        <p className="text-sm text-slate-600 mb-6">Manage appointments, eligible home visits and professional opportunities.</p>
        <Button onClick={() => navigate('/doctor/opportunities')} variant="primary" fullWidth>
          View Available Work
        </Button>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <QuickAction icon={<Calendar />} label="Today's Appointments" color="bg-brand-50 text-brand-600" onClick={() => navigate('/doctor/appointments')} />
          <QuickAction icon={<Clock />} label="Live Walk-in Queue" color="bg-emerald-50 text-emerald-600" onClick={() => navigate('/doctor/queue')} />
          <QuickAction icon={<Activity />} label="Home Visit Requests" color="bg-indigo-50 text-indigo-600" onClick={() => navigate('/doctor/appointments')} />
          <QuickAction icon={<MessageSquare />} label="Community Chat" color="bg-blue-50 text-blue-600" onClick={() => navigate('/doctor/community/chat')} />
        </div>
      </div>

      {/* Credit Balance */}
      <div className="bg-brand-600 text-white rounded-2xl p-5 shadow-sm">
        <p className="text-sm font-medium opacity-90 mb-1">Available Balance</p>
        <h3 className="text-3xl font-bold mb-4">Rs. {creditBalance.toLocaleString()}</h3>
        <Button variant="secondary" size="sm">Withdraw Funds</Button>
      </div>

      {/* Next Appointment */}
      {nextAppointment && (
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Next Appointment</h3>
          <AppointmentCard appointment={nextAppointment} onAction={() => navigate('/doctor/appointments')} />
        </div>
      )}
    </div>
  );

  const renderPracticingDoctorHome = () => (
    <div className="p-5 space-y-6">
      {/* Hero */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Manage Your Practice</h2>
        <p className="text-sm text-slate-600 mb-6">Stay on top of appointments, availability and Care Seeker communication.</p>
        <Button onClick={() => navigate('/doctor/appointments')} variant="primary" fullWidth>
          View Appointments
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <h3 className="text-2xl font-black text-slate-900 mb-1">12</h3>
          <p className="text-xs font-medium text-slate-500 uppercase">Patients Today</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <h3 className="text-2xl font-black text-slate-900 mb-1">Rs. {creditBalance.toLocaleString()}</h3>
          <p className="text-xs font-medium text-slate-500 uppercase">Earnings</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <QuickAction icon={<Calendar />} label="Today" color="bg-brand-50 text-brand-600" onClick={() => navigate('/doctor/appointments')} />
          <QuickAction icon={<Users />} label="Waiting Queue" color="bg-indigo-50 text-indigo-600" />
          <QuickAction icon={<MessageSquare />} label="Messages" color="bg-blue-50 text-blue-600" />
          <QuickAction icon={<CheckCircle />} label="Availability" color="bg-emerald-50 text-emerald-600" />
        </div>
      </div>

      {/* Next Appointment */}
      {nextAppointment && (
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Up Next</h3>
          <AppointmentCard appointment={nextAppointment} onAction={() => navigate('/doctor/appointments')} />
        </div>
      )}
    </div>
  );

  const renderConsultantHome = () => (
    <div className="p-5 space-y-6">
      {/* Hero */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Your Specialist Practice</h2>
        <p className="text-sm text-slate-600 mb-6">Manage consultations, clinical work and specialist opportunities.</p>
        <Button onClick={() => navigate('/doctor/appointments')} variant="primary" fullWidth>
          Open Consultations
        </Button>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <QuickAction icon={<Stethoscope />} label="Today's Consultations" color="bg-brand-50 text-brand-600" onClick={() => navigate('/doctor/appointments')} />
          <QuickAction icon={<Video />} label="Video Lobby" color="bg-indigo-50 text-indigo-600" />
          <QuickAction icon={<Activity />} label="AI Copilot" color="bg-purple-50 text-purple-600" onClick={() => navigate('/doctor/ai-copilot')} />
          <QuickAction icon={<FileText />} label="Records Requests" color="bg-orange-50 text-orange-600" />
        </div>
      </div>

      {/* Next Appointment */}
      {nextAppointment && (
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Next Specialist Consultation</h3>
          <AppointmentCard appointment={nextAppointment} onAction={() => navigate('/doctor/appointments')} />
        </div>
      )}

      {/* Relevant Opportunity */}
      {opportunities.length > 0 && opportunities[0] && (
        <div>
          <div className="flex justify-between items-end mb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Opportunities</h3>
            <button className="text-xs font-bold text-brand-600" onClick={() => navigate('/doctor/opportunities')}>View All</button>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-1">{opportunities[0].title || 'Clinical Opportunity'}</h4>
            <p className="text-sm text-slate-500 mb-3">{opportunities[0].facility || 'Partner Hospital'}</p>
            <Button variant="secondary" size="sm" fullWidth onClick={() => navigate('/doctor/opportunities')}>View Details</Button>
          </div>
        </div>
      )}
    </div>
  );

  const activeJourney = journey || 'practicing_doctor';

  return (
    <ProviderRootLayout activeTab="home">
      <div className="flex-1 min-h-0 app-scroll flex flex-col">
        {activeJourney === 'medical_student' && renderStudentHome()}
        {activeJourney === 'fresh_doctor' && renderFreshDoctorHome()}
        {(activeJourney === 'practicing_doctor' || (activeJourney !== 'medical_student' && activeJourney !== 'fresh_doctor' && activeJourney !== 'consultant_specialist')) && renderPracticingDoctorHome()}
        {activeJourney === 'consultant_specialist' && renderConsultantHome()}
      </div>
    </ProviderRootLayout>
  );
};

const QuickAction: React.FC<{ icon: React.ReactNode, label: string, color: string, onClick?: () => void }> = ({ icon, label, color, onClick }) => (
  <button 
    onClick={onClick}
    className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col gap-3 text-left active:scale-[0.98] transition-transform"
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
      {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
    </div>
    <div>
      <h3 className="text-[13px] font-bold text-slate-900 leading-tight">{label}</h3>
    </div>
  </button>
);

const AppointmentCard: React.FC<{ appointment: any, onAction: () => void }> = ({ appointment, onAction }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-700">
        {appointment.patientInitials}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-slate-900 truncate">{appointment.patientName}</h4>
        <p className="text-sm text-slate-500 truncate">{appointment.reason}</p>
      </div>
    </div>
    <div className="bg-slate-50 p-3 rounded-xl flex justify-between text-sm mb-4">
      <span className="font-medium text-slate-600">{appointment.date} at {appointment.time}</span>
      <span className="font-bold text-brand-700">{appointment.mode}</span>
    </div>
    <div className="flex gap-2">
      <Button variant="secondary" className="flex-1" onClick={onAction}>View Patient</Button>
      <Button variant="primary" className="flex-1" onClick={onAction}>Start</Button>
    </div>
  </div>
);
