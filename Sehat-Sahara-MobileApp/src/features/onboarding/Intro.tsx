import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell, Button } from '../../components';
import { Stethoscope, HeartHandshake, Users } from 'lucide-react';

const SLIDES = [
  {
    icon: <Stethoscope className="w-16 h-16 text-[#1B7F4C]" />,
    title: "Find trusted doctors near you",
    desc: "Book in-clinic, online or home visits with verified doctors."
  },
  {
    icon: <Users className="w-16 h-16 text-[#1B7F4C]" />,
    title: "Care for your whole family",
    desc: "Manage appointments, medicines and records for everyone you care for."
  },
  {
    icon: <HeartHandshake className="w-16 h-16 text-[#1B7F4C]" />,
    title: "A community that helps",
    desc: "Request blood, share medical equipment, support your neighbours."
  }
];

export const Intro: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(s => s + 1);
    } else {
      navigate('/auth/entry', { replace: true });
    }
  };

  const handleSkip = () => {
    navigate('/auth/entry', { replace: true });
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-white relative">
        <button 
          onClick={handleSkip}
          className="absolute top-6 right-6 z-10 text-[15px] font-bold text-[#1B7F4C]"
        >
          Skip
        </button>

        <div className="flex-1 flex flex-col justify-center px-8 text-center pt-10">
          <div className="w-48 h-48 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-10 transition-transform duration-500">
            {SLIDES[currentSlide].icon}
          </div>
          
          <h2 className="text-2xl font-extrabold text-slate-900 mb-4 transition-opacity duration-300">
            {SLIDES[currentSlide].title}
          </h2>
          
          <p className="text-[15px] text-slate-500 leading-relaxed max-w-xs mx-auto">
            {SLIDES[currentSlide].desc}
          </p>
        </div>

        <div className="px-6 pb-8 pt-4">
          <div className="flex justify-center gap-2 mb-8">
            {SLIDES.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide ? 'bg-[#1B7F4C] w-6' : 'bg-slate-200'
                }`} 
              />
            ))}
          </div>

          <Button onClick={handleNext}>
            {currentSlide === SLIDES.length - 1 ? "Get Started" : "Continue"}
          </Button>
        </div>
      </div>
    </MobileAppShell>
  );
};
