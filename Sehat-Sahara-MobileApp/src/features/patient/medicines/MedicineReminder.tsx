import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell } from '../../../components';
import { PATIENT_ROUTES } from '../../../constants/routes';
import { ChevronLeft, Pill, Check, Clock, Plus, Mic, X, Trash2, Edit2 } from 'lucide-react';
import { PrototypeStore } from '../../../services/PrototypeStore';
import { MedicineCourse, MedicineDose } from '../../../models';

type TabState = 'NEXT_DOSE' | 'TODAY' | 'ACTIVE_COURSES';

export const MedicineReminder: React.FC = () => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<TabState>('NEXT_DOSE');
  
  const [courses, setCourses] = useState<MedicineCourse[]>(PrototypeStore.getSnapshot().medicineCourses);
  const [doses, setDoses] = useState<MedicineDose[]>(PrototypeStore.getSnapshot().medicineDoses);
  
  const [isVoiceSheetOpen, setIsVoiceSheetOpen] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'listening' | 'parsed' | 'success'>('listening');

  useEffect(() => {
    const unsub = PrototypeStore.subscribe(() => {
      setCourses(PrototypeStore.getSnapshot().medicineCourses);
      setDoses(PrototypeStore.getSnapshot().medicineDoses);
    });
    return unsub;
  }, []);

  const today = new Date().toISOString().split('T')[0];
  
  // Filter doses for today
  const todayDoses = doses.filter(d => {
    const doseDate = d.scheduledTime.split('T')[0];
    return doseDate === today;
  }).sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());

  // Next dose: the first dose today that is DUE
  const nextDoses = todayDoses.filter(d => d.status === 'DUE');
  const pastDoses = todayDoses.filter(d => d.status !== 'DUE');

  const handleAction = (id: string, action: 'TAKEN' | 'SNOOZED' | 'SKIPPED') => {
    PrototypeStore.updateMedicineDose(id, { status: action });
  };

  const handleDeleteCourse = (id: string) => {
    PrototypeStore.deleteMedicineCourse(id);
  };

  const handleAddMedicine = () => {
    setIsVoiceSheetOpen(true);
    setVoiceStatus('listening');
    setTimeout(() => {
      setVoiceStatus('parsed');
    }, 2000);
  };

  const handleSaveReminder = () => {
    setVoiceStatus('success');
    setTimeout(() => {
      setIsVoiceSheetOpen(false);
      
      const newCourseId = `MED-CRS-${Date.now()}`;
      
      // Construct a new course
      const newCourse: MedicineCourse = {
        id: newCourseId,
        patientId: 'USR-PATIENT-DEMO',
        name: 'Amoxicillin',
        strength: '250mg',
        form: 'Capsule',
        frequency: 'DAILY',
        startDate: new Date().toISOString().split('T')[0],
        mealRelation: 'AFTER_MEAL',
        status: 'ACTIVE',
        exactTimes: ['14:00']
      };

      // Construct a new dose for today at 14:00
      const doseTime = new Date();
      doseTime.setHours(14, 0, 0, 0);

      const newDose: MedicineDose = {
        id: `DOSE-${Date.now()}`,
        courseId: newCourseId,
        patientId: 'USR-PATIENT-DEMO',
        medicineName: 'Amoxicillin',
        scheduledTime: doseTime.toISOString(),
        status: 'DUE'
      };

      PrototypeStore.addMedicineCourse(newCourse, [newDose]);
    }, 1500);
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-[#F8FAFC] relative">
        
        {/* ─── HEADER ─── */}
        <header className="px-4 py-4 bg-white border-b border-slate-200 flex-shrink-0 z-10 sticky top-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(PATIENT_ROUTES.HOME)} className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full active:bg-slate-100 text-slate-700">
                <ChevronLeft className="w-7 h-7" />
              </button>
              <h1 className="text-xl font-bold text-slate-900">Medicines</h1>
            </div>
            
            <button 
              onClick={handleAddMedicine}
              className="bg-brand-50 hover:bg-brand-100 active:bg-brand-200 text-brand-700 px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>

          {/* ─── TABS ─── */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('NEXT_DOSE')}
              className={`flex-1 py-2 px-1 text-[11px] uppercase tracking-wide font-bold rounded-lg transition-all ${activeTab === 'NEXT_DOSE' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500'}`}
            >
              Next Dose
            </button>
            <button
              onClick={() => setActiveTab('TODAY')}
              className={`flex-1 py-2 px-1 text-[11px] uppercase tracking-wide font-bold rounded-lg transition-all ${activeTab === 'TODAY' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500'}`}
            >
              Today
            </button>
            <button
              onClick={() => setActiveTab('ACTIVE_COURSES')}
              className={`flex-1 py-2 px-1 text-[11px] uppercase tracking-wide font-bold rounded-lg transition-all ${activeTab === 'ACTIVE_COURSES' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500'}`}
            >
              Courses
            </button>
          </div>
        </header>

        <div className="app-scroll flex-1 overflow-y-auto p-4 pb-8 space-y-6">
          
          {activeTab === 'NEXT_DOSE' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {nextDoses.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-slate-900 font-bold mb-1">All caught up!</h3>
                  <p className="text-slate-500 text-sm">No more medicines due for now.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {nextDoses.map((dose) => {
                    const course = courses.find(c => c.id === dose.courseId);
                    if (!course) return null;
                    return (
                      <div key={dose.id} className="bg-white rounded-2xl border border-brand-100 shadow-[0_4px_20px_rgba(37,99,235,0.05)] overflow-hidden">
                        <div className="p-4 flex gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center flex-shrink-0 border border-brand-100">
                            <Pill className="w-7 h-7 text-brand-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 mb-0.5">{course.name}</h3>
                            <p className="text-sm text-slate-600 mb-2">{course.strength} • {course.mealRelation.replace('_', ' ')}</p>
                            <span className="inline-block bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-md">
                              Due at {formatTime(dose.scheduledTime)}
                            </span>
                          </div>
                        </div>
                        <div className="flex border-t border-slate-100 bg-slate-50">
                          <button 
                            onClick={() => handleAction(dose.id, 'TAKEN')} 
                            className="flex-1 py-3.5 flex items-center justify-center gap-2 text-brand-700 font-bold text-sm border-r border-slate-200 active:bg-brand-50"
                          >
                            <Check className="w-4 h-4" />
                            Take Now
                          </button>
                          <button 
                            onClick={() => handleAction(dose.id, 'SNOOZED')} 
                            className="flex-1 py-3.5 flex items-center justify-center gap-2 text-slate-600 font-bold text-sm border-r border-slate-200 active:bg-slate-100"
                          >
                            <Clock className="w-4 h-4" />
                            Snooze
                          </button>
                          <button 
                            onClick={() => handleAction(dose.id, 'SKIPPED')} 
                            className="flex-1 py-3.5 flex items-center justify-center gap-2 text-slate-600 font-bold text-sm active:bg-slate-100"
                          >
                            <X className="w-4 h-4" />
                            Skip
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'TODAY' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Due Today */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 px-1 flex justify-between">
                  <span>Pending</span>
                  <span className="text-slate-400">{nextDoses.length}</span>
                </h3>
                {nextDoses.length === 0 ? (
                  <p className="text-sm text-slate-500 px-1 italic">No pending doses.</p>
                ) : (
                  <div className="space-y-3">
                    {nextDoses.map(dose => (
                      <div key={dose.id} className="bg-white rounded-xl border border-slate-200 p-3 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                            <Clock className="w-5 h-5 text-orange-500" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{dose.medicineName}</p>
                            <p className="text-xs text-orange-600 font-semibold">{formatTime(dose.scheduledTime)}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleAction(dose.id, 'TAKEN')}
                          className="bg-brand-50 text-brand-700 p-2 rounded-lg font-bold text-xs"
                        >
                          Mark Taken
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Completed/Skipped Today */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 px-1 flex justify-between">
                  <span>Completed</span>
                  <span className="text-slate-400">{pastDoses.length}</span>
                </h3>
                {pastDoses.length === 0 ? (
                  <p className="text-sm text-slate-500 px-1 italic">Nothing completed yet.</p>
                ) : (
                  <div className="space-y-3">
                    {pastDoses.map(dose => (
                      <div key={dose.id} className="bg-slate-50 rounded-xl border border-slate-200 p-3 flex items-center justify-between opacity-80">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${dose.status === 'TAKEN' ? 'bg-green-100' : 'bg-slate-200'}`}>
                            {dose.status === 'TAKEN' ? <Check className="w-5 h-5 text-green-600" /> : <X className="w-5 h-5 text-slate-500" />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm line-through decoration-slate-400">{dose.medicineName}</p>
                            <p className="text-xs text-slate-500 font-medium">
                              {dose.status} at {formatTime(dose.scheduledTime)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {activeTab === 'ACTIVE_COURSES' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {courses.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Pill className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-slate-900 font-bold mb-1">No Active Courses</h3>
                  <p className="text-slate-500 text-sm">Add a medicine to start tracking.</p>
                </div>
              ) : (
                courses.map(course => (
                  <div key={course.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                          <Pill className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-base">{course.name}</h3>
                          <p className="text-sm text-slate-500">{course.strength} • {course.form}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="w-8 h-8 flex items-center justify-center text-slate-400 active:bg-slate-100 rounded-lg">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCourse(course.id)}
                          className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 active:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-slate-500 font-medium mb-0.5">Frequency</p>
                        <p className="font-bold text-slate-800">{course.frequency}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 font-medium mb-0.5">Instructions</p>
                        <p className="font-bold text-slate-800">{course.mealRelation.replace('_', ' ')}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-slate-500 font-medium mb-0.5">Times</p>
                        <div className="flex gap-1.5 mt-1 flex-wrap">
                          {course.exactTimes.map(time => (
                            <span key={time} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold text-slate-700">
                              {time}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Voice Input Bottom Sheet */}
        {isVoiceSheetOpen && (
          <>
            <div 
              className="absolute inset-0 bg-slate-900/40 z-20"
              onClick={() => setIsVoiceSheetOpen(false)}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-30 p-6 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] animate-in slide-in-from-bottom-full duration-300">
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Add Medicine</h3>
                <button onClick={() => setIsVoiceSheetOpen(false)} className="text-slate-400">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {voiceStatus === 'listening' && (
                <div className="text-center py-6">
                  <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-6 shadow-[0_0_0_8px_rgba(37,99,235,0.1)] animate-pulse">
                    <Mic className="w-8 h-8 text-brand-600" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">Listening...</h4>
                  <p className="text-sm text-slate-500 italic mb-8">"Remind me to take Amoxicillin 250mg at 2 PM"</p>
                  
                  <button 
                    onClick={() => navigate('/patient/medicines/add')}
                    className="text-brand-600 font-bold text-sm bg-brand-50 px-6 py-2.5 rounded-full"
                  >
                    Enter Manually Instead
                  </button>
                </div>
              )}

              {voiceStatus === 'parsed' && (
                <div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Parsed Information</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-slate-500">Medicine</span><span className="font-bold text-slate-900">Amoxicillin</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Dosage</span><span className="font-bold text-slate-900">250mg</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Time</span><span className="font-bold text-slate-900">14:00</span></div>
                    </div>
                  </div>
                  <button
                    onClick={handleSaveReminder}
                    className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 shadow-sm"
                  >
                    Save Reminder
                  </button>
                </div>
              )}

              {voiceStatus === 'success' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Reminder Saved</h4>
                  <p className="text-sm text-slate-500">Your medicine has been added.</p>
                </div>
              )}

            </div>
          </>
        )}

      </div>
    </MobileAppShell>
  );
};
