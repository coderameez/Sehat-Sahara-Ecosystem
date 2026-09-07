import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MobileAppShell } from '../../../components';
import { PATIENT_ROUTES } from '../../../constants/routes';
import { ChevronLeft, Star, ShieldCheck, MapPin, Calendar, GraduationCap, Play, Video, X, Ticket } from 'lucide-react';
import { ContactActions } from '../../../components/ContactActions';
import { MOCK_DOCTORS } from './mockData';
import { PrototypeStore } from '../../../services/PrototypeStore';

export const DoctorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const triageContext = location.state as { symptom?: string; priority?: string; recommendedSpecialty?: string } | null;
  
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [transcriptionStatus, setTranscriptionStatus] = useState<'IDLE' | 'TRANSCRIBING' | 'DONE'>('IDLE');

  let doctor = MOCK_DOCTORS.find(d => d.id === id);
  if (!doctor) {
    const prov = PrototypeStore.getSnapshot().providers.find((p: any) => p.id === id);
    if (prov) {
      doctor = {
        id: prov.id,
        name: prov.name,
        specialty: prov.specialty,
        experience: `${prov.experienceYears || 10} Years`,
        fee: prov.fees.in_clinic_doctor || 1500,
        rating: prov.rating,
        reviews: prov.reviewsCount,
        avatarUrl: prov.avatarUrl || 'https://i.pravatar.cc/150?u=doc',
        availableToday: true,
        nextAvailable: 'Today, 02:00 PM',
        about: prov.about,
        gender: (prov.gender as any) || 'Female',
        bookingModes: prov.bookingModes || ['fixed_time', 'queue_token']
      };
    }
  }

  if (!doctor) {
    return (
      <MobileAppShell>
        <div className="flex flex-col h-full bg-[#F8FAFC]">
          <header className="px-4 py-4 pt-safe bg-white flex items-center border-b border-slate-200 shrink-0">
            <button onClick={() => navigate('/patient/care', { replace: true })} className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full active:bg-slate-100 text-slate-700">
              <ChevronLeft className="w-7 h-7" />
            </button>
            <h1 className="text-lg font-bold text-slate-900 ml-1">Provider Unavailable</h1>
          </header>
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4 text-amber-600">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2">Provider information is unavailable</h2>
            <p className="text-sm text-slate-500 mb-8 max-w-xs">
              The selected doctor or healthcare service could not be loaded. Please choose another verified provider.
            </p>
            <div className="w-full max-w-xs space-y-3">
              <button 
                onClick={() => navigate('/patient/care', { replace: true })}
                className="w-full py-3.5 bg-brand-600 text-white font-bold rounded-xl active:scale-[0.98] transition-transform"
              >
                Back to Find Care
              </button>
              <button 
                onClick={() => navigate('/patient', { replace: true })}
                className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl active:scale-[0.98] transition-transform"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </MobileAppShell>
    );
  }

  const modes = doctor.bookingModes || ['fixed_time', 'queue_token'];
  const hasFixedTime = modes.includes('fixed_time');
  const hasQueueToken = modes.includes('queue_token');

  const handleBookNearest = () => {
    navigate(PATIENT_ROUTES.BOOKING.replace(':id', doctor.id), { 
      state: { 
        ...triageContext, 
        prefilledDate: doctor.nextAvailable.split(', ')[0], 
        prefilledTime: doctor.nextAvailable.split(', ')[1], 
        prefilledVisitType: 'clinic',
        prefilledBookingMode: 'fixed_time'
      } 
    });
  };

  const handleBookStandard = () => {
    navigate(PATIENT_ROUTES.BOOKING.replace(':id', doctor.id), { 
      state: { 
        ...triageContext, 
        prefilledVisitType: 'clinic',
        prefilledBookingMode: 'fixed_time' 
      } 
    });
  };

  return (
    <MobileAppShell>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#F8FAFC' }}>
        
        {/* Header */}
        <header style={{ padding: '16px', display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderBottom: '1px solid #E2E8F0', flexShrink: 0 }} className="pt-safe">
          <button onClick={() => navigate('/patient/care', { replace: true })} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }} aria-label="Go back">
            <ChevronLeft width={28} height={28} color="#0F172A" />
          </button>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginLeft: '12px', margin: 0 }}>Doctor Profile</h1>
        </header>

        <div className="app-scroll" style={{ flex: 1, paddingBottom: '20px' }}>
          {/* Profile Card */}
          <div style={{ backgroundColor: '#fff', padding: '24px 20px', borderBottom: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <img src={doctor.avatarUrl} alt={doctor.name} style={{ width: '100px', height: '100px', borderRadius: '16px', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', margin: 0 }}>{doctor.name}</h2>
                  <ShieldCheck width={18} height={18} color="#1E9B46" />
                </div>
                <p style={{ fontSize: '14px', color: '#166B32', fontWeight: 600, margin: '0 0 8px' }}>{doctor.specialty}</p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                  <Star width={16} height={16} color="#F59E0B" fill="#F59E0B" />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{doctor.rating}</span>
                  <span style={{ fontSize: '13px', color: '#64748B' }}>({doctor.reviews} reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', padding: '20px', backgroundColor: '#fff', marginBottom: '8px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#EBF5EF', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap width={20} height={20} color="#166B32" />
              </div>
              <p style={{ fontSize: '11px', color: '#64748B', margin: '0 0 2px' }}>Experience</p>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', margin: 0 }}>{doctor.experience}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#EBF5EF', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin width={20} height={20} color="#166B32" />
              </div>
              <p style={{ fontSize: '11px', color: '#64748B', margin: '0 0 2px' }}>Location</p>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Karachi</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#EBF5EF', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar width={20} height={20} color="#166B32" />
              </div>
              <p style={{ fontSize: '11px', color: '#64748B', margin: '0 0 2px' }}>Availability</p>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', margin: 0 }}>{doctor.availableToday ? 'Today' : 'Tomorrow'}</p>
            </div>
          </div>

          {/* Video Intro (New) */}
          <div style={{ padding: '20px', backgroundColor: '#fff', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>Doctor Introduction</h3>
            <button 
              onClick={() => {
                setIsVideoModalOpen(true);
                setTranscriptionStatus('TRANSCRIBING');
                setTimeout(() => setTranscriptionStatus('DONE'), 3000);
              }}
              style={{ width: '100%', height: '160px', borderRadius: '16px', backgroundColor: '#0F172A', position: 'relative', overflow: 'hidden', border: 'none', padding: 0, cursor: 'pointer', backgroundImage: 'url("https://placehold.co/600x400/1e293b/cbd5e1?text=Doctor+Intro")', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {/* Overlay */}
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)' }} />
              
              <div style={{ width: '48px', height: '48px', borderRadius: '24px', backgroundColor: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                <Play width={24} height={24} color="#0F172A" style={{ marginLeft: '4px' }} />
              </div>

              <div style={{ position: 'absolute', bottom: '12px', left: '12px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', zIndex: 10 }}>
                <Video width={12} height={12} color="#fff" />
                <span style={{ color: '#fff', fontSize: '11px', fontWeight: 600 }}>Up to 60 sec</span>
              </div>
            </button>
          </div>

          {/* About */}
          <div style={{ padding: '20px', backgroundColor: '#fff', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>About Doctor</h3>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: 0 }}>{doctor.about}</p>
          </div>

          {/* Contact Actions (New) */}
          <div style={{ padding: '20px', backgroundColor: '#fff', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>Contact Doctor</h3>
            <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', fontStyle: 'italic' }}>
              Direct numbers are hidden. Use the options below to connect securely.
            </div>
            <ContactActions 
              name={doctor.name}
              onInAppChat={() => navigate('/patient/community/chat', { 
                state: { 
                  type: 'DOCTOR_PATIENT', 
                  contextTitle: `Consultation with ${doctor.name}`, 
                  otherPartyName: doctor.name,
                } 
              })}
            />
          </div>

          {/* Reviews (New) */}
          <div style={{ padding: '20px', backgroundColor: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Patient Reviews</h3>
              <button style={{ border: 'none', background: 'none', color: '#166B32', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>View All</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{doctor.rating}</span>
                <div style={{ display: 'flex', gap: '2px', color: '#F59E0B', margin: '4px 0' }}>
                  {[1,2,3,4,5].map(i => <Star key={i} width={14} height={14} fill={i <= Math.floor(doctor.rating) ? "#F59E0B" : "transparent"} />)}
                </div>
                <span style={{ fontSize: '12px', color: '#64748B' }}>Based on {doctor.reviews} reviews</span>
              </div>
              
              <div style={{ flex: 1, borderLeft: '1px solid #E2E8F0', paddingLeft: '16px' }}>
                {[5, 4, 3].map(rating => (
                  <div key={rating} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', color: '#475569', width: '8px' }}>{rating}</span>
                    <Star width={10} height={10} color="#94A3B8" fill="#94A3B8" />
                    <div style={{ flex: 1, height: '4px', backgroundColor: '#F1F5F9', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: rating === 5 ? '80%' : rating === 4 ? '15%' : '5%', height: '100%', backgroundColor: '#F59E0B' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Static Review 1 */}
              <div style={{ paddingBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '14px', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#475569' }}>AK</div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>Ahmad K.</span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>2 weeks ago</span>
                </div>
                <div style={{ display: 'flex', gap: '2px', color: '#F59E0B', marginBottom: '8px' }}>
                  {[1,2,3,4,5].map(i => <Star key={i} width={12} height={12} fill="#F59E0B" />)}
                </div>
                <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: '1.5' }}>Very professional and thorough. Took the time to listen to all my symptoms and explained the treatment plan clearly.</p>
              </div>

              {/* Static Review 2 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '14px', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#475569' }}>SZ</div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>Sana Z.</span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>1 month ago</span>
                </div>
                <div style={{ display: 'flex', gap: '2px', color: '#F59E0B', marginBottom: '8px' }}>
                  {[1,2,3,4,5].map(i => <Star key={i} width={12} height={12} fill={i === 5 ? "transparent" : "#F59E0B"} />)}
                </div>
                <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: '1.5' }}>Great doctor, but the clinic waiting time was a bit long. The actual consultation was excellent though.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Booking Action */}
        <div style={{ padding: '16px 20px', backgroundColor: '#fff', borderTop: '1px solid #E2E8F0', paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}>
          
          {hasFixedTime && (
            <div style={{ backgroundColor: '#F0FAF4', border: '1px solid #BBF7D0', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Calendar width={20} height={20} color="#166B32" />
                <div>
                  <div style={{ fontSize: '12px', color: '#166B32', fontWeight: 600 }}>Next Available Slot</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{doctor.nextAvailable}</div>
                </div>
              </div>
              <button
                onClick={handleBookNearest}
                style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#fff', border: '1px solid #166B32', color: '#166B32', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Book Slot
              </button>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '14px', color: '#64748B' }}>Consultation Fee</span>
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#166B32' }}>Rs. {doctor.fee}</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {hasFixedTime && (
              <button
                onClick={handleBookStandard}
                style={{
                  width: '100%',
                  height: '52px',
                  borderRadius: '16px',
                  backgroundColor: '#166B32',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(22,107,50,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Calendar width={18} height={18} />
                Book Fixed-Time Appointment
              </button>
            )}

            {hasQueueToken && (
              <button
                onClick={() => navigate(PATIENT_ROUTES.BOOKING.replace(':id', doctor.id), { 
                  state: { ...triageContext, prefilledVisitType: 'clinic', prefilledBookingMode: 'queue_token' } 
                })}
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '16px',
                  backgroundColor: '#FEF3C7',
                  color: '#92400E',
                  fontSize: '14px',
                  fontWeight: 700,
                  border: '1px solid #FDE68A',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Ticket width={18} height={18} color="#D97706" />
                Get Walk-in Queue Token (Today)
              </button>
            )}
          </div>
        </div>

        {/* Video Modal */}
        {isVideoModalOpen && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,23,42,0.95)', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setIsVideoModalOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', width: '40px', height: '40px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                <X width={24} height={24} />
              </button>
            </div>
            
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#000', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
                {/* Mock Video Player */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("https://placehold.co/800x450/1e293b/cbd5e1?text=Playing+Doctor+Introduction...")', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.6)', padding: '12px 24px', borderRadius: '8px' }}>
                    <p style={{ color: '#fff', margin: 0, fontSize: '14px', fontWeight: 600 }}>Video Playback</p>
                  </div>
                </div>

                {/* Subtitles / Transcription */}
                <div style={{ position: 'absolute', bottom: '70px', left: '16px', right: '16px', zIndex: 20 }}>
                  {transcriptionStatus === 'TRANSCRIBING' && (
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.7)', padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', width: 'fit-content', margin: '0 auto' }}>
                      <div style={{ width: '12px', height: '12px', border: '2px solid #2563EB', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      <span style={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}>Auto-transcribing...</span>
                    </div>
                  )}
                  {transcriptionStatus === 'DONE' && (
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.7)', padding: '12px 16px', borderRadius: '12px', textAlign: 'center', margin: '0 auto', maxWidth: '90%' }}>
                      <p style={{ color: '#fff', fontSize: '14px', lineHeight: '1.4', margin: 0, textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                        "Hello, I am {doctor?.name}, a specialist in {doctor?.specialty}. I've been treating patients in Karachi for over {doctor?.experience}. I look forward to helping you feel better."
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Mock Controls */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                  <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '2px', marginBottom: '12px' }}>
                    <div style={{ width: '30%', height: '100%', backgroundColor: '#2563EB', borderRadius: '2px' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Play width={20} height={20} fill="#fff" />
                      <span style={{ fontSize: '13px', fontVariantNumeric: 'tabular-nums' }}>00:18 / 01:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </MobileAppShell>
  );
};
