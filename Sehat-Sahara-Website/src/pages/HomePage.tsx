import React from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { EcosystemIntro } from '../components/sections/EcosystemIntro';
import { ServicesSection } from '../components/sections/ServicesSection';
import { PatientShowcase } from '../components/sections/PatientShowcase';
import { DoctorShowcase } from '../components/sections/DoctorShowcase';
import { AiSection } from '../components/sections/AiSection';
import { AppsSection } from '../components/sections/AppsSection';
import { HospitalsSection } from '../components/sections/HospitalsSection';
import { HospitalOnboardingForm } from '../components/sections/HospitalOnboardingForm';
import { ScopeSection } from '../components/sections/ScopeSection';
import { AboutVisionSection } from '../components/sections/AboutVisionSection';
import { CoverageSection } from '../components/sections/CoverageSection';
import { ContactSection } from '../components/sections/ContactSection';
import { FinalCtaSection } from '../components/sections/FinalCtaSection';

export const HomePage: React.FC = () => {
  return (
    <main className="w-full">
      <HeroSection />
      <EcosystemIntro />
      <ServicesSection />
      <PatientShowcase />
      <DoctorShowcase />
      <AiSection />
      <AppsSection />
      <HospitalsSection />
      <HospitalOnboardingForm />
      <ScopeSection />
      <AboutVisionSection />
      <CoverageSection />
      <ContactSection />
      <FinalCtaSection />
    </main>
  );
};

export default HomePage;
