import { useNavigate } from 'react-router-dom';
import { Building2, HeartPulse, Hospital } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Panel: Content */}
      <div className="flex w-full flex-col justify-center px-8 sm:px-16 lg:w-1/2 lg:px-24">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-12">
            <img 
              src="/brand/sehat-sahara-logo-transparent.png" 
              alt="Sehat Sahara" 
              className="h-14 w-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>

          {/* Welcome Text */}
          <div className="mb-10">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-txt-primary">
              Welcome to the Platform
            </h1>
            <p className="text-lg text-txt-secondary leading-relaxed">
              Experience the unified management dashboard for Sehat Sahara Clinics and Hospitals.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-6 mb-12">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-txt-primary text-lg">Hospital Operations</h3>
                <p className="mt-1 text-sm text-txt-secondary">
                  Manage multiple branches, track high-level KPIs, and oversee hospital-wide performance.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Hospital size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-txt-primary text-lg">Clinic Management</h3>
                <p className="mt-1 text-sm text-txt-secondary">
                  Handle single-clinic operations including queue management, bookings, and patient records.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Button 
            variant="primary" 
            size="lg" 
            className="w-full text-base py-6"
            onClick={() => navigate('/login')}
          >
            Continue to Login
          </Button>
        </div>
      </div>

      {/* Right Panel: Graphic/Brand */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center bg-brand-700 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <polygon fill="currentColor" className="text-white" points="0,100 100,0 100,100" />
          </svg>
        </div>
        <div className="relative z-10 p-12 text-center text-white">
          <HeartPulse size={80} className="mx-auto mb-8 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">Empowering Healthcare</h2>
          <p className="text-brand-100 text-lg max-w-md mx-auto">
            Streamlining operations for a better patient and provider experience.
          </p>
        </div>
      </div>
    </div>
  );
}
