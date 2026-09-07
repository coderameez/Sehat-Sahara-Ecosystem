import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../../components';
import { InnerScreenLayout } from '../../components/layouts';
import { OnboardingStore } from '../../services/OnboardingStore';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier.trim().length < 5) return;
    
    const profile = OnboardingStore.getSnapshot().profile;
    OnboardingStore.updateState({
      isAuthenticated: true,
      authMode: 'login',
      profile: {
        ...profile,
        name: profile?.name || 'User',
        phone: identifier || '',
        email: profile?.email || '',
        city: profile?.city || '',
        area: profile?.area || ''
      }
    });
    navigate('/onboarding/location');
  };

  return (
    <InnerScreenLayout title="Log In">
      <div className="flex flex-col h-full bg-white">
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-5 pb-8 pt-4">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-[15px] text-slate-600">Enter your phone number or email to log in to your account.</p>
          </div>

          <div className="flex-1">
            <Input
              label="Phone Number or Email"
              placeholder="e.g. 03001234567 or ali@email.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoFocus
              type="text"
              required
            />
          </div>

          <div className="pb-safe shrink-0 mt-6">
            <Button 
              type="submit" 
              size="lg" fullWidth 
              disabled={identifier.trim().length < 5}
            >
              Send OTP
            </Button>
          </div>
        </form>
      </div>
    </InnerScreenLayout>
  );
};
