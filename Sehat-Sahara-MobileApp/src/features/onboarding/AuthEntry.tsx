import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../../components';
import { InnerScreenLayout } from '../../components/layouts';

export const AuthEntry: React.FC = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/auth/verify', { 
      state: { identifier },
      replace: true 
    });
  };

  return (
    <InnerScreenLayout title="" bottomPadding={false}>
      <div className="flex flex-col min-h-full bg-white relative justify-between">
        <form onSubmit={handleSubmit} className="flex flex-col justify-between flex-1 min-h-full">
          <div className="px-5 pt-4 pb-28">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Welcome to Sehat Sahara</h2>
              <p className="text-[15px] text-slate-600">Enter your phone number to continue</p>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <Input
                  label="Phone Number"
                  placeholder="03XX XXXXXXX"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 left-0 right-0 px-4 py-4 bg-white/95 backdrop-blur-sm border-t border-slate-200 pb-safe z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] mt-auto">
            <Button type="submit" fullWidth size="lg">
              Send Verification Code
            </Button>
          </div>
        </form>
      </div>
    </InnerScreenLayout>
  );
};
