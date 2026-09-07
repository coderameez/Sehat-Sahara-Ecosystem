import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Info, Building2, Hospital } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { store } from '../../store';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fillClinicDemo = () => {
    setEmail('clinic@sehatsahara.demo');
    setPassword('Clinic123');
    setErrorMsg('');
  };

  const fillHospitalDemo = () => {
    setEmail('hospital@sehatsahara.demo');
    setPassword('Hospital123');
    setErrorMsg('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (email === 'clinic@sehatsahara.demo' && password === 'Clinic123') {
      store.login('CLINIC');
      navigate('/');
    } else if (email === 'hospital@sehatsahara.demo' && password === 'Hospital123') {
      store.login('HOSPITAL');
      navigate('/');
    } else {
      setErrorMsg('Invalid credentials. Please use one of the demo accounts.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <img 
            src="/brand/sehat-sahara-logo-transparent.png" 
            alt="Sehat Sahara" 
            className="h-12 w-auto"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-surface-border bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-txt-primary">Welcome Back</h2>
            <p className="mt-1 text-sm text-txt-secondary">Sign in to your account</p>
          </div>

          {errorMsg && (
            <div className="mb-6 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <Info size={16} className="mt-0.5 shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-txt-primary">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-surface-border bg-white py-2.5 pl-10 pr-4 text-sm text-txt-primary placeholder:text-txt-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-txt-primary">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-surface-border bg-white py-2.5 pl-10 pr-4 text-sm text-txt-primary placeholder:text-txt-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full py-2.5">
              Sign In
            </Button>
          </form>

          {/* Demo Helper Buttons */}
          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-txt-muted">Demo Accounts</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={fillClinicDemo}
                className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-surface-border bg-slate-50 p-3 text-sm font-medium text-txt-secondary hover:bg-slate-100 hover:text-txt-primary transition-colors"
              >
                <Hospital size={16} className="text-brand-600" />
                Use Clinic Demo
              </button>
              <button
                type="button"
                onClick={fillHospitalDemo}
                className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-surface-border bg-slate-50 p-3 text-sm font-medium text-txt-secondary hover:bg-slate-100 hover:text-txt-primary transition-colors"
              >
                <Building2 size={16} className="text-brand-600" />
                Use Hospital Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
