import { MapPin, Phone, Mail, Clock, Building2, Stethoscope, HeartPulse } from 'lucide-react';
import { Card, StatCard } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { clinicProfileData } from '../data/demo-data';
import { Button } from '../components/ui/Button';

export function ClinicProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary">Clinic Profile</h1>
          <p className="text-sm text-txt-secondary mt-1">Manage facility details and core information.</p>
        </div>
        <Button variant="primary">Edit Profile</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card padding="lg">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="h-24 w-24 rounded-2xl bg-brand-50 flex items-center justify-center flex-shrink-0 border border-brand-100 p-2">
                {/* Using original Sehat Sahara Logo */}
                <img src="/brand/sehat-sahara-logo.svg" alt="Sehat Sahara Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-bold text-txt-primary">{clinicProfileData.name}</h2>
                    <StatusBadge status={clinicProfileData.verificationStatus} variant="success" />
                  </div>
                  <p className="text-txt-secondary font-medium">{clinicProfileData.type}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 pt-4 border-t border-surface-border">
                  <div className="flex items-start gap-2 text-sm text-txt-secondary">
                    <Building2 className="h-4 w-4 mt-0.5 text-slate-400" />
                    <span>{clinicProfileData.branch}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-txt-secondary">
                    <MapPin className="h-4 w-4 mt-0.5 text-slate-400" />
                    <span>{clinicProfileData.address}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-txt-secondary">
                    <Phone className="h-4 w-4 mt-0.5 text-slate-400" />
                    <span>{clinicProfileData.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-txt-secondary">
                    <Mail className="h-4 w-4 mt-0.5 text-slate-400" />
                    <span>{clinicProfileData.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-bold text-txt-primary mb-4">About the Facility</h3>
            <p className="text-sm text-txt-secondary leading-relaxed">
              {clinicProfileData.name} is a state-of-the-art multi-specialty healthcare facility dedicated to providing comprehensive and compassionate care. 
              Equipped with modern technology and staffed by highly qualified medical professionals, we strive to ensure the best possible outcomes for all our patients.
            </p>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-bold text-txt-primary mb-4">Operating Hours</h3>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-txt-primary">Open 24/7</p>
                <p className="text-sm text-txt-secondary mt-1">{clinicProfileData.operatingHours}</p>
              </div>
            </div>
          </Card>

          <StatCard
            label="Total Departments"
            value={clinicProfileData.departmentsCount}
            icon={<Building2 className="h-6 w-6" />}
          />
          <StatCard
            label="Services Offered"
            value={clinicProfileData.servicesCount}
            icon={<HeartPulse className="h-6 w-6" />}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
          />
          <StatCard
            label="Total Doctors"
            value={clinicProfileData.doctorsCount}
            icon={<Stethoscope className="h-6 w-6" />}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
        </div>
      </div>
    </div>
  );
}
