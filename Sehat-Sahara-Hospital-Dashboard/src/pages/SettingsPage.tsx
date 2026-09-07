import { useState, useEffect } from 'react';
import { Settings, Building2, Bell, Shield, Users, Clock, Save, Building, Mail, Smartphone, KeyRound, SmartphoneNfc } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('facility');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Simple local state for demo settings
  const [settings, setSettings] = useState({
    facilityName: 'Sehat Sahara Hospital',
    facilityType: 'Multispecialty Hospital',
    emailNotifications: true,
    smsNotifications: true,
    twoFactorAuth: false,
    autoAssignTokens: true,
    operatingMode: '24/7 Emergency',
  });

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('sehat-sahara-settings');
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('sehat-sahara-settings', JSON.stringify(settings));
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  const tabs = [
    { id: 'facility', label: 'Facility Profile', icon: <Building2 className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'security', label: 'Security & Access', icon: <Shield className="h-4 w-4" /> },
    { id: 'operations', label: 'Operations & Queue', icon: <Clock className="h-4 w-4" /> },
    { id: 'staff', label: 'Staff Management', icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary">Settings</h1>
          <p className="text-sm text-txt-secondary mt-1">Manage hospital configuration and preferences.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-emerald-600 font-medium animate-pulse">Changes saved!</span>}
          <Button 
            variant="primary" 
            icon={<Save className="h-4 w-4" />} 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Settings Navigation */}
        <Card padding="none" className="w-full md:w-64 flex-shrink-0">
          <nav className="flex flex-col p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors text-left ${
                  activeTab === tab.id
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-txt-secondary hover:bg-slate-50 hover:text-txt-primary'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </Card>

        {/* Settings Content */}
        <div className="flex-1 w-full">
          {activeTab === 'facility' && (
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-txt-primary">Facility Profile</h2>
                  <p className="text-sm text-txt-secondary">Core details and identity for your organization.</p>
                </div>
              </div>
              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-txt-primary mb-1.5">Facility Name</label>
                  <input 
                    type="text" 
                    value={settings.facilityName}
                    onChange={(e) => setSettings({ ...settings, facilityName: e.target.value })}
                    className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-txt-primary mb-1.5">Facility Type</label>
                  <select 
                    value={settings.facilityType}
                    onChange={(e) => setSettings({ ...settings, facilityType: e.target.value })}
                    className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  >
                    <option>Multispecialty Hospital</option>
                    <option>Poly-Clinic</option>
                    <option>Specialized Care Center</option>
                  </select>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-txt-primary">Notification Preferences</h2>
                  <p className="text-sm text-txt-secondary">Configure alerts for staff and patients.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-surface-border pb-4">
                  <div className="flex gap-3">
                    <Mail className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-txt-primary text-sm">Email Notifications</h4>
                      <p className="text-xs text-txt-secondary">Receive daily summaries and booking alerts via email.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={settings.emailNotifications} onChange={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between border-b border-surface-border pb-4">
                  <div className="flex gap-3">
                    <Smartphone className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-txt-primary text-sm">Patient SMS Reminders</h4>
                      <p className="text-xs text-txt-secondary">Automatically send appointment reminders via SMS.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={settings.smsNotifications} onChange={() => setSettings({ ...settings, smsNotifications: !settings.smsNotifications })} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                  </label>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-txt-primary">Security & Access</h2>
                  <p className="text-sm text-txt-secondary">Protect your facility's data and manage access protocols.</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-surface-border pb-4">
                  <div className="flex gap-3">
                    <SmartphoneNfc className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-txt-primary text-sm">Two-Factor Authentication (2FA)</h4>
                      <p className="text-xs text-txt-secondary">Require staff to use an authenticator app when logging in.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={settings.twoFactorAuth} onChange={() => setSettings({ ...settings, twoFactorAuth: !settings.twoFactorAuth })} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                  </label>
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" icon={<KeyRound className="h-4 w-4" />}>
                    Reset Admin Password
                  </Button>
                  <p className="text-xs text-txt-muted mt-2">A password reset link will be sent to the registered admin email.</p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'operations' && (
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-txt-primary">Operations & Queue</h2>
                  <p className="text-sm text-txt-secondary">Configure how patients flow through the facility.</p>
                </div>
              </div>
              
              <div className="space-y-6 max-w-lg">
                <div className="flex items-center justify-between border-b border-surface-border pb-4">
                  <div>
                    <h4 className="font-medium text-txt-primary text-sm">Auto-Assign Tokens</h4>
                    <p className="text-xs text-txt-secondary">Automatically generate sequential tokens upon check-in.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={settings.autoAssignTokens} onChange={() => setSettings({ ...settings, autoAssignTokens: !settings.autoAssignTokens })} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-txt-primary mb-1.5">Default Operating Mode</label>
                  <select 
                    value={settings.operatingMode}
                    onChange={(e) => setSettings({ ...settings, operatingMode: e.target.value })}
                    className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  >
                    <option>24/7 Emergency</option>
                    <option>Day OPD Only (08:00 - 20:00)</option>
                    <option>Evening Clinic Only (16:00 - 23:00)</option>
                  </select>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'staff' && (
            <Card>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-txt-primary">Staff Management</h3>
                <p className="text-sm text-txt-secondary max-w-md mt-2">
                  Staff permissions and roles are managed through the central Sehat Sahara administrative portal.
                </p>
                <Button variant="outline" className="mt-6">Open Admin Portal</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
