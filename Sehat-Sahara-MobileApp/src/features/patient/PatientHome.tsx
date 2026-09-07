import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RootScreenLayout } from '../../components/layouts';
import { SehatSaharaLogo } from '../../components/SehatSaharaLogo';
import { PATIENT_ROUTES } from '../../constants/routes';
import { OnboardingStore, FALLBACK_PROFILE } from '../../services/OnboardingStore';
import { PrototypeStore } from '../../services/PrototypeStore';
import {
  Bell,
  Stethoscope,
  FileText,
  CalendarDays,
  Pill,
  Mic,
  User,
  ChevronRight,
  AlertTriangle,
  Calendar,
  Droplet,
  Clock,
  Languages
} from 'lucide-react';

// ─── AI Assistant Illustration ───────────────────────────────────────────────
const AIAssistantIllustration: React.FC = () => (
  <svg
    viewBox="0 0 68 68"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width="68"
    height="68"
    aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    <circle cx="34" cy="34" r="33" fill="rgba(255,255,255,0.06)" />
    <circle cx="34" cy="34" r="24" fill="rgba(255,255,255,0.10)" />
    <circle cx="34" cy="27" r="13" fill="rgba(255,255,255,0.18)" />
    <circle cx="29.5" cy="25.5" r="2" fill="white" />
    <circle cx="38.5" cy="25.5" r="2" fill="white" />
    <path d="M29 31 Q34 35 39 31" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <line x1="34" y1="14" x2="34" y2="10" stroke="rgba(255,255,255,0.60)" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="34" cy="8.5" r="2.2" fill="rgba(255,255,255,0.70)" />
    <rect x="27" y="42" width="14" height="16" rx="3.5" fill="rgba(255,255,255,0.14)" />
    <rect x="32" y="45" width="4" height="10" rx="1.8" fill="white" />
    <rect x="28.5" y="49" width="11" height="3.5" rx="1.8" fill="white" />
    <path d="M20 33 Q16 33 16 37 Q16 41 20 41" stroke="rgba(255,255,255,0.35)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    <path d="M48 33 Q52 33 52 37 Q52 41 48 41" stroke="rgba(255,255,255,0.35)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
  </svg>
);

export const PatientHome: React.FC = () => {
  const navigate = useNavigate();
  const state = OnboardingStore.getSnapshot();
  const profile = state?.profile && state.profile.name ? state.profile : FALLBACK_PROFILE;
  const safeName = (profile?.name || FALLBACK_PROFILE.name).split(' ')[0] || 'User';
  const careProfiles = Array.isArray(state?.careProfiles) ? state.careProfiles : [];
  const hasSosSetup = careProfiles.some(p => p?.sosEnabled);

  const prototypeState = PrototypeStore.getSnapshot();
  const medicineCourses = Array.isArray(prototypeState?.medicineCourses) ? prototypeState.medicineCourses : [];
  const bookings = Array.isArray(prototypeState?.bookings) ? prototypeState.bookings : [];
  const bloodRequests = Array.isArray(prototypeState?.bloodRequests) ? prototypeState.bloodRequests : [];

  const activeMedicines = medicineCourses.filter(c => c?.status === 'ACTIVE');
  const upcomingBookings = bookings.filter(b => b?.status === 'confirmed' || b?.status === 'requested' || b?.status === 'awaiting_provider');
  const activeBloodRequests = bloodRequests.filter(r => r?.requesterName === profile.name && r?.state === 'OPEN');

  const [isUrdu, setIsUrdu] = useState(false);

  const ACTION_CARDS = [
    {
      id:   'care',
      label: isUrdu ? 'ڈاکٹر تلاش کریں' : 'Find Care',
      desc:  isUrdu ? 'کلینک، آن لائن، یا ہوم وزٹ بک کریں' : 'Book clinic, online, or home visit',
      Icon:  Stethoscope,
    },
    {
      id:   'records',
      label: isUrdu ? 'میرے ریکارڈز' : 'My Records',
      desc:  isUrdu ? 'اپنی لیب رپورٹس اور ہسٹری دیکھیں' : 'View your lab reports and medical history',
      Icon:  FileText,
    },
    {
      id:   'appointments',
      label: isUrdu ? 'اپوائنٹمنٹس' : 'Appointments',
      desc:  isUrdu ? 'اپنے آنے والے وزٹس کا انتظام کریں' : 'Manage your upcoming visits',
      Icon:  CalendarDays,
    },
    {
      id:   'medicines',
      label: isUrdu ? 'ادویات' : 'Medicines',
      desc:  isUrdu ? 'یاد دہانیاں دیکھیں اور اپنی ادویات کا انتظام کریں' : 'View reminders and manage your meds',
      Icon:  Pill,
    },
  ];

  return (
    <RootScreenLayout activeTab="home">

      {/* ━━ HEADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header
        className="pt-safe"
        style={{
          flexShrink: 0,
          minHeight: '60px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: '16px',
          paddingRight: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <SehatSaharaLogo variant="lightBackground"   />
        </div>

        {/* Right: lang toggle + bell + avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          
          <button
            onClick={() => setIsUrdu(!isUrdu)}
            className="flex items-center justify-center gap-1.5 px-3 h-[36px] rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700 mr-1"
          >
            <Languages className="w-4 h-4" />
            <span className="text-xs font-bold leading-none">{isUrdu ? 'EN' : 'اردو'}</span>
          </button>

          {/* Notification bell */}
          <button
            aria-label="Notifications"
            onClick={() => navigate(PATIENT_ROUTES.NOTIFICATIONS)}
            style={{
              position: 'relative',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '9999px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#475569',
            }}
          >
            <Bell width={22} height={22} />
            <span
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '8px',
                height: '8px',
                backgroundColor: '#E6192B',
                borderRadius: '9999px',
                border: '2px solid #ffffff',
              }}
            />
          </button>

          {/* Patient avatar */}
          <div
            aria-label="Patient profile"
            onClick={() => navigate(PATIENT_ROUTES.PROFILE)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '9999px',
              backgroundColor: '#E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              cursor: 'pointer',
            }}
          >
            <User width={18} height={18} color="#64748B" />
          </div>
        </div>
      </header>

      {/* ━━ SCROLLABLE CONTENT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <main
        className="app-scroll flex-1 min-h-0"
        style={{ backgroundColor: '#F8FAFC' }}
        dir={isUrdu ? 'rtl' : 'ltr'}
      >
        <div style={{ padding: '0 16px 32px' }}>

          {/* ─── GREETING ────────────────────────────────────────────────── */}
          <div style={{ paddingTop: '20px', paddingBottom: '16px' }}>
            <h1
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#0F172A',
                lineHeight: '1.25',
                margin: 0,
                fontFamily: isUrdu ? 'Jameel Noori Nastaleeq, sans-serif' : 'inherit'
              }}
            >
              {isUrdu ? `السلام علیکم، ${safeName}` : `Assalam-o-Alaikum, ${safeName}`}
            </h1>
            <p
              style={{
                fontSize: '14px',
                color: '#64748B',
                margin: '4px 0 0',
                lineHeight: '1.4',
                fontFamily: isUrdu ? 'Jameel Noori Nastaleeq, sans-serif' : 'inherit'
              }}
            >
              {isUrdu ? 'آج ہم آپ کی کیسے مدد کر سکتے ہیں؟' : 'How can we help you today?'}
            </p>
          </div>

          {/* ─── SETUP METER ────────────────────────────────────────────────── */}
          {OnboardingStore.getCompletionPercentage().total < 100 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h3 className="font-bold text-[14px] text-slate-900">{isUrdu ? 'پروفائل سیٹ اپ' : 'Profile Setup'}</h3>
                  <p className="text-[12px] text-slate-500 mt-0.5">
                    {OnboardingStore.getCompletionPercentage().nextSteps[0]?.label}
                  </p>
                </div>
                <span className="text-[13px] font-bold text-brand-600">{OnboardingStore.getCompletionPercentage().total}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full mb-3 overflow-hidden">
                <div 
                  className="h-full bg-brand-500 rounded-full transition-all duration-500"
                  style={{ width: `${OnboardingStore.getCompletionPercentage().total}%` }}
                ></div>
              </div>
              <button
                onClick={() => navigate(OnboardingStore.getCompletionPercentage().nextSteps[0]?.route)}
                className="w-full h-14 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-[13px] rounded-full transition-colors flex items-center justify-center"
              >
                {isUrdu ? 'سیٹ اپ جاری رکھیں' : 'Continue Setup'}
              </button>
            </div>
          )}

          {/* ─── CONDITIONAL ACTIVITY CARDS ────────────────────────────────── */}
          {(upcomingBookings.length > 0 || activeMedicines.length > 0 || activeBloodRequests.length > 0) && (
            <div className="space-y-3 mb-4">
              {upcomingBookings.slice(0, 1).map(booking => (
                <button
                  key={booking.id}
                  onClick={() => navigate('/patient/care/my-care')}
                  className="w-full bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between shadow-sm active:bg-blue-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-blue-700 font-bold text-sm">{isUrdu ? 'آنے والی اپوائنٹمنٹ' : 'Upcoming Appointment'}</p>
                      <p className="text-blue-500 text-xs mt-0.5">{isUrdu ? 'اپوائنٹمنٹ' : 'Appointment'} • {booking.scheduledDate || 'Pending'}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-blue-500 ${isUrdu ? 'rotate-180' : ''}`} />
                </button>
              ))}

              {activeBloodRequests.slice(0, 1).map(req => (
                <button
                  key={req.id}
                  onClick={() => navigate('/patient/community/blood')}
                  className="w-full bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between shadow-sm active:bg-red-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 flex-shrink-0">
                      <Droplet className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-red-700 font-bold text-sm">{isUrdu ? 'خون کی درخواست زیر التواء' : 'Blood Request Pending'}</p>
                      <p className="text-red-500 text-xs mt-0.5">{req.bloodGroup} • {req.unitsRequired} {isUrdu ? 'یونٹس' : 'Units'}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-red-500 ${isUrdu ? 'rotate-180' : ''}`} />
                </button>
              ))}

              {activeMedicines.length > 0 && (
                <button
                  onClick={() => navigate(PATIENT_ROUTES.MEDICINES)}
                  className="w-full bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between shadow-sm active:bg-emerald-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-emerald-700 font-bold text-sm">{isUrdu ? 'دوا کی یاد دہانی' : 'Medicine Reminder'}</p>
                      <p className="text-emerald-600 text-xs mt-0.5">{activeMedicines.length} {isUrdu ? 'فعال نسخے' : 'active prescriptions'}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-emerald-500 ${isUrdu ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>
          )}

          {/* ─── SOS SHORTCUT ────────────────────────────────────────────────── */}
          <button
            onClick={() => navigate(hasSosSetup ? '/patient/sos' : '/patient/profile/sos-setup')}
            className={`w-full rounded-2xl p-4 flex items-center justify-between mb-4 shadow-sm active:scale-[0.98] transition-all ${
              hasSosSetup 
                ? 'bg-red-600 border border-red-700' 
                : 'bg-red-50 border border-red-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                hasSosSetup ? 'bg-white text-red-600' : 'bg-red-100 text-red-600'
              }`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className={`font-bold text-sm ${hasSosSetup ? 'text-white' : 'text-red-700'}`}>{isUrdu ? 'ایمرجنسی SOS' : 'Emergency SOS'}</p>
                <p className={`text-xs mt-0.5 ${hasSosSetup ? 'text-red-100' : 'text-red-500'}`}>
                  {hasSosSetup ? (isUrdu ? 'ہنگامی انتباہات فوری طور پر متحرک کریں' : 'Trigger emergency alerts instantly') : (isUrdu ? 'ہنگامی معلومات تیار کریں' : 'Prepare emergency info')}
                </p>
              </div>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
              hasSosSetup ? 'bg-red-700' : 'bg-white'
            }`}>
              <ChevronRight className={`w-4 h-4 ${isUrdu ? 'rotate-180' : ''} ${hasSosSetup ? 'text-white' : 'text-red-500'}`} />
            </div>
          </button>

          {/* ─── AI GUIDANCE HERO CARD ─────────────────────────────────── */}
          <div
            style={{
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #0D5226 0%, #166B32 55%, #1E9B46 100%)',
              boxShadow: '0 8px 24px -4px rgba(13,82,38,0.28)',
              marginBottom: '16px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                padding: '20px 20px 20px 20px',
              }}
            >
              {/* Left text block */}
              <div style={{ flex: 1, minWidth: 0, textAlign: isUrdu ? 'right' : 'left' }}>
                {/* Live indicator */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '8px',
                  }}
                >
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '9999px',
                      backgroundColor: '#4ADE80',
                      display: 'inline-block',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#A7F3D0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {isUrdu ? 'اے آئی ہیلتھ گائیڈنس' : 'AI Health Guidance'}
                  </span>
                </div>

                <h2
                  style={{
                    fontSize: '17px',
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: '1.3',
                    margin: '0 0 6px',
                    fontFamily: isUrdu ? 'Jameel Noori Nastaleeq, sans-serif' : 'inherit'
                  }}
                >
                  {isUrdu ? 'آج آپ کیسا محسوس کر رہے ہیں؟' : 'How are you feeling today?'}
                </h2>

                <p
                  style={{
                    fontSize: '12px',
                    color: '#BBF7D0',
                    lineHeight: '1.5',
                    margin: '0 0 16px',
                    fontFamily: isUrdu ? 'Jameel Noori Nastaleeq, sans-serif' : 'inherit'
                  }}
                >
                  {isUrdu ? 'فوری ٹرائیج کے لیے اپنی علامات بیان کریں — نجی اور محفوظ۔' : 'Describe your symptoms for instant triage — private & secure.'}
                </p>

                {/* Talk Now CTA */}
                <button
                  onClick={() => navigate(PATIENT_ROUTES.TRIAGE)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    backgroundColor: '#ffffff',
                    color: '#166B32',
                    fontWeight: 700,
                    fontSize: '13px',
                    padding: '9px 18px',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  }}
                >
                  <Mic width={15} height={15} />
                  {isUrdu ? 'ابھی بات کریں' : 'Talk Now'}
                </button>
              </div>

              {/* Right: assistant illustration */}
              <AIAssistantIllustration />
            </div>
          </div>

          {/* ─── 2×2 QUICK-ACTION GRID ────────────────────────────────── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}
          >
            {ACTION_CARDS.map(({ id, label, desc, Icon }) => (
              <button
                key={id}
                aria-label={label}
                tabIndex={-1}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  padding: '20px',
                  textAlign: isUrdu ? 'right' : 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                }}
                onClick={() => {
                  if (id === 'care') navigate('/patient/care');
                  if (id === 'records') navigate(PATIENT_ROUTES.RECORDS);
                  if (id === 'medicines') navigate(PATIENT_ROUTES.MEDICINES);
                  if (id === 'appointments') navigate('/patient/care/my-care');
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    flexDirection: isUrdu ? 'row-reverse' : 'row'
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: '#EBF5EF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon width={22} height={22} color="#166B32" />
                  </div>

                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '9999px',
                      backgroundColor: '#EBF5EF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <ChevronRight width={13} height={13} color="#166B32" className={isUrdu ? "rotate-180" : ""} />
                  </div>
                </div>

                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#0F172A',
                    margin: '0 0 4px',
                    lineHeight: '1.2',
                    fontFamily: isUrdu ? 'Jameel Noori Nastaleeq, sans-serif' : 'inherit'
                  }}
                >
                  {label}
                </p>

                <p
                  style={{
                    fontSize: '11px',
                    color: '#94A3B8',
                    margin: 0,
                    lineHeight: '1.4',
                    fontFamily: isUrdu ? 'Jameel Noori Nastaleeq, sans-serif' : 'inherit'
                  }}
                >
                  {desc}
                </p>
              </button>
            ))}
          </div>

        </div>
      </main>

    </RootScreenLayout>
  );
};
