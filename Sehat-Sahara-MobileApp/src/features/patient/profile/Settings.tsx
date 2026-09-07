import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MobileAppShell, Button } from '../../../components';
import { OnboardingStore } from '../../../services/OnboardingStore';
import { useAppBack } from '../../../utils/navigation';
import { PATIENT_ROUTES } from '../../../constants/routes';
import { 
  ChevronLeft, 
  Bell, 
  Heart, 
  Users, 
  Type, 
  Phone, 
  Plus, 
  MessageSquare, 
  Clock, 
  Shield, 
  Languages, 
  Smartphone, 
  Mail, 
  Radio, 
  Moon, 
  FileText,
  AlertTriangle
} from 'lucide-react';

export const Settings: React.FC = () => {
  const goBack = useAppBack();
  const location = useLocation();
  const fromSource = (location.state as any)?.from;
  const defaultBackRoute = fromSource === 'notifications' ? PATIENT_ROUTES.NOTIFICATIONS : PATIENT_ROUTES.PROFILE;

  const state = OnboardingStore.getSnapshot();
  const existingPrefs = (state.preferences || {}) as any;

  const [settings, setSettings] = useState({
    // Notification channels
    appointmentReminders: existingPrefs.appointmentReminders ?? true,
    medicineReminders: existingPrefs.medicineReminders ?? true,
    queueUpdates: existingPrefs.queueUpdates ?? true,
    chatMessages: existingPrefs.chatMessages ?? true,
    careRequestResponses: existingPrefs.careRequestResponses ?? true,
    communityOpportunities: existingPrefs.communityOpportunities ?? true,
    reviewUpdates: existingPrefs.reviewUpdates ?? true,
    emergencyAnnouncements: existingPrefs.emergencyAnnouncements ?? true,

    // Notification delivery
    inAppDelivery: true, // required prototype channel
    pushNotifications: existingPrefs.pushNotifications ?? true,
    emailNotifications: existingPrefs.emailNotifications ?? false,
    smsNotifications: existingPrefs.smsNotifications ?? true,
    quietHoursEnabled: existingPrefs.quietHoursEnabled ?? false,
    reminderTiming: existingPrefs.reminderTiming ?? '30m', // 15m, 30m, 1h, 2h

    // Preferences
    language: existingPrefs.language ?? 'EN',
    currency: existingPrefs.currency ?? 'PKR',
    largeText: existingPrefs.largeText ?? false,

    // Privacy & Permissions
    contactVisibility: existingPrefs.contactVisibility ?? 'verified_only',
    shareRecordsWithDoctors: existingPrefs.shareRecordsWithDoctors ?? true,
    allowSim: existingPrefs.allowSim ?? true,
    allowWhatsApp: existingPrefs.allowWhatsApp ?? true,
    contacts: existingPrefs.contacts ?? [
      { id: '1', number: '+92 300 1234567', label: 'Primary Contact', allowSim: true, allowWhatsApp: true }
    ]
  });

  const [savedBanner, setSavedBanner] = useState(false);

  const toggle = (key: keyof typeof settings) => {
    const nextVal = !settings[key as keyof typeof settings];
    const updated = { ...settings, [key]: nextVal };
    setSettings(updated);
    OnboardingStore.updateState({ preferences: updated });
    triggerSaveFeedback();
  };

  const setOption = (key: keyof typeof settings, val: any) => {
    const updated = { ...settings, [key]: val };
    setSettings(updated);
    OnboardingStore.updateState({ preferences: updated });
    triggerSaveFeedback();
  };

  const triggerSaveFeedback = () => {
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2000);
  };

  const toggleContactPref = (id: string, pref: 'allowSim' | 'allowWhatsApp') => {
    const nextContacts = settings.contacts.map((c: any) => 
      c.id === id ? { ...c, [pref]: !c[pref] } : c
    );
    const updated = { ...settings, contacts: nextContacts };
    setSettings(updated);
    OnboardingStore.updateState({ preferences: updated });
    triggerSaveFeedback();
  };

  const addContact = () => {
    const newContact = {
      id: Date.now().toString(),
      number: '',
      label: 'Secondary Contact',
      allowSim: true,
      allowWhatsApp: false
    };
    const updated = { ...settings, contacts: [...settings.contacts, newContact] };
    setSettings(updated);
    OnboardingStore.updateState({ preferences: updated });
  };

  const updateContactNumber = (id: string, number: string) => {
    const updated = {
      ...settings,
      contacts: settings.contacts.map((c: any) => c.id === id ? { ...c, number } : c)
    };
    setSettings(updated);
    OnboardingStore.updateState({ preferences: updated });
  };

  const removeContact = (id: string) => {
    const updated = {
      ...settings,
      contacts: settings.contacts.filter((c: any) => c.id !== id)
    };
    setSettings(updated);
    OnboardingStore.updateState({ preferences: updated });
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        {/* Header */}
        <header className="px-4 py-4 pt-safe bg-white border-b border-slate-200 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center">
            <button 
              onClick={() => goBack(defaultBackRoute)} 
              className="p-1 -ml-1 text-slate-700 active:bg-slate-100 rounded-full"
              aria-label="Go back"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <h1 className="text-lg font-bold text-slate-900 ml-2">Settings & Preferences</h1>
          </div>
          {savedBanner && (
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full animate-fade-in">
              Saved
            </span>
          )}
        </header>

        <div className="app-scroll flex-1 px-4 py-5 space-y-6">
          
          {/* SECTION 1: Notification Types */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
              <Bell className="w-4 h-4 text-brand-600" />
              <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Notifications</h2>
            </div>

            <SettingsRow
              icon={<Clock className="w-5 h-5 text-brand-600" />}
              title="Appointment Reminders"
              description="Get alerts before scheduled consultations"
              active={settings.appointmentReminders}
              onToggle={() => toggle('appointmentReminders')}
            />
            <SettingsRow
              icon={<Heart className="w-5 h-5 text-emerald-600" />}
              title="Medicine Alerts"
              description="Daily medication schedule reminders"
              active={settings.medicineReminders}
              onToggle={() => toggle('medicineReminders')}
            />
            <SettingsRow
              icon={<Radio className="w-5 h-5 text-amber-600" />}
              title="Live Queue & Token Updates"
              description="Real-time notifications when your token is near"
              active={settings.queueUpdates}
              onToggle={() => toggle('queueUpdates')}
            />
            <SettingsRow
              icon={<MessageSquare className="w-5 h-5 text-blue-600" />}
              title="Messages & Chat"
              description="Direct inquiries and doctor consult replies"
              active={settings.chatMessages}
              onToggle={() => toggle('chatMessages')}
            />
            <SettingsRow
              icon={<FileText className="w-5 h-5 text-indigo-600" />}
              title="Care Request Responses"
              description="Provider offers for your home care or transport needs"
              active={settings.careRequestResponses}
              onToggle={() => toggle('careRequestResponses')}
            />
            <SettingsRow
              icon={<Users className="w-5 h-5 text-rose-600" />}
              title="Community & Blood Needs"
              description="Urgent blood donation and medicine sharing alerts"
              active={settings.communityOpportunities}
              onToggle={() => toggle('communityOpportunities')}
            />
            <SettingsRow
              icon={<AlertTriangle className="w-5 h-5 text-orange-600" />}
              title="Emergency & Service Announcements"
              description="Outage notices and critical health alerts"
              active={settings.emergencyAnnouncements}
              onToggle={() => toggle('emergencyAnnouncements')}
              isLast
            />
          </div>

          {/* SECTION 2: Notification Delivery */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-brand-600" />
              <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Delivery Channels</h2>
            </div>

            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">In-App Notifications</h3>
                <p className="text-xs text-slate-500 mt-0.5">Always active for security and records</p>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">REQUIRED</span>
            </div>

            <SettingsRow
              icon={<Smartphone className="w-5 h-5 text-slate-600" />}
              title="Push Notifications"
              description="Device pop-ups when app is closed"
              active={settings.pushNotifications}
              onToggle={() => toggle('pushNotifications')}
            />
            <SettingsRow
              icon={<Phone className="w-5 h-5 text-slate-600" />}
              title="SMS Alerts"
              description="Critical OTPs and emergency booking confirmations"
              active={settings.smsNotifications}
              onToggle={() => toggle('smsNotifications')}
            />
            <SettingsRow
              icon={<Mail className="w-5 h-5 text-slate-600" />}
              title="Email Summaries"
              description="Receipts and monthly consultation digests"
              active={settings.emailNotifications}
              onToggle={() => toggle('emailNotifications')}
            />

            {/* Reminder Timing Selector */}
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-900">Appointment Reminder Timing</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '15m', val: '15m' },
                  { label: '30m', val: '30m' },
                  { label: '1 hour', val: '1h' },
                  { label: '2 hours', val: '2h' },
                ].map(item => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setOption('reminderTiming', item.val)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-colors ${
                      settings.reminderTiming === item.val
                        ? 'bg-brand-50 border-brand-500 text-brand-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <SettingsRow
              icon={<Moon className="w-5 h-5 text-slate-600" />}
              title="Quiet Hours (10 PM – 7 AM)"
              description="Silence non-emergency alerts during nighttime"
              active={settings.quietHoursEnabled}
              onToggle={() => toggle('quietHoursEnabled')}
              isLast
            />
          </div>

          {/* SECTION 3: Preferences (Language, Display, Currency) */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
              <Languages className="w-4 h-4 text-brand-600" />
              <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Preferences</h2>
            </div>

            {/* Language Selector */}
            <div className="p-4 border-b border-slate-100">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-sm font-semibold text-slate-900">App Language</span>
                <span className="text-xs text-slate-400">زبان منتخب کریں</span>
              </div>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setOption('language', 'EN')}
                  className={`py-2 text-sm font-bold rounded-lg transition-colors ${
                    settings.language === 'EN' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setOption('language', 'UR')}
                  className={`py-2 text-sm font-bold rounded-lg transition-colors ${
                    settings.language === 'UR' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  اردو
                </button>
              </div>
            </div>

            {/* Currency Selector */}
            <div className="p-4 border-b border-slate-100">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-sm font-semibold text-slate-900">Pricing Currency</span>
                <span className="text-xs text-slate-400">Shown in checkout</span>
              </div>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setOption('currency', 'PKR')}
                  className={`py-2 text-sm font-bold rounded-lg transition-colors ${
                    settings.currency === 'PKR' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  PKR (Rs.)
                </button>
                <button
                  type="button"
                  onClick={() => setOption('currency', 'USD')}
                  className={`py-2 text-sm font-bold rounded-lg transition-colors ${
                    settings.currency === 'USD' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  USD ($)
                </button>
              </div>
            </div>

            <SettingsRow
              icon={<Type className="w-5 h-5 text-slate-600" />}
              title="Large Text (Accessibility)"
              description="Increase readability for senior family members"
              active={settings.largeText}
              onToggle={() => toggle('largeText')}
              isLast
            />
          </div>

          {/* SECTION 4: Privacy & Permissions */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-600" />
                <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Privacy & Permissions</h2>
              </div>
              <button onClick={addContact} className="text-brand-600 text-xs font-bold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Phone
              </button>
            </div>

            <SettingsRow
              icon={<Shield className="w-5 h-5 text-emerald-600" />}
              title="Share Records with Verified Providers"
              description="Allow treating doctors to view your lab reports"
              active={settings.shareRecordsWithDoctors}
              onToggle={() => toggle('shareRecordsWithDoctors')}
            />

            {/* Contacts & Channels */}
            {settings.contacts.map((contact: any, index: number) => (
              <div key={contact.id} className="p-4 border-b border-slate-100 last:border-0 bg-slate-50/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">{contact.label}</span>
                  {index > 0 && (
                    <button 
                      onClick={() => removeContact(contact.id)}
                      className="text-red-500 text-xs font-bold hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="relative mb-3">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="tel"
                    value={contact.number}
                    onChange={(e) => updateContactNumber(contact.id, e.target.value)}
                    placeholder="+92 300 0000000"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-500 text-sm font-medium"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={contact.allowSim} 
                      onChange={() => toggleContactPref(contact.id, 'allowSim')}
                      className="rounded text-brand-600 focus:ring-brand-500"
                    />
                    Allow SIM Calls
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={contact.allowWhatsApp} 
                      onChange={() => toggleContactPref(contact.id, 'allowWhatsApp')}
                      className="rounded text-brand-600 focus:ring-brand-500"
                    />
                    Allow WhatsApp
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 pb-8">
            <Button 
              onClick={() => goBack(defaultBackRoute)} 
              size="lg" 
              fullWidth
            >
              Done
            </Button>
          </div>

        </div>
      </div>
    </MobileAppShell>
  );
};

const SettingsRow: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  active: boolean;
  onToggle: () => void;
  isLast?: boolean;
}> = ({ icon, title, description, active, onToggle, isLast }) => {
  return (
    <div className={`p-4 flex items-center justify-between gap-3 ${!isLast ? 'border-b border-slate-100' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{icon}</div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 leading-tight">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5 leading-snug">{description}</p>
        </div>
      </div>
      <button 
        type="button"
        onClick={onToggle}
        className={`w-12 h-7 rounded-full flex items-center px-1 shrink-0 transition-colors ${
          active ? 'bg-brand-600' : 'bg-slate-300'
        }`}
        aria-label={title}
      >
        <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
          active ? 'transform translate-x-5' : ''
        }`} />
      </button>
    </div>
  );
};
