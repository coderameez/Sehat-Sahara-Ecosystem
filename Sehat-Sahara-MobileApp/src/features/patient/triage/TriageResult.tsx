import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../components';
import { InnerScreenLayout } from '../../../components/layouts';
import { PATIENT_ROUTES } from '../../../constants/routes';
import { AlertCircle, Calendar, RefreshCcw, Phone } from 'lucide-react';

export const TriageResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { symptom?: string; answers?: Record<string, string> } || {};
  
  if (!state.symptom) {
    navigate(PATIENT_ROUTES.TRIAGE, { replace: true });
    return null;
  }

  const symptomText = state.symptom.toLowerCase();
  
  // Deterministic result logic
  let priority = 'Routine';
  let severityColor = '#166B32'; // Brand Green
  let severityBg = '#EBF5EF';
  let title = 'Routine Care Advised';
  let summary = 'Based on your symptoms, there is no immediate cause for concern. You can book a regular consultation.';
  
  if (symptomText.includes('chest') || symptomText.includes('breath') || symptomText.includes('severe') && symptomText.includes('pain')) {
    priority = 'Urgent';
    severityColor = '#E6192B'; // SOS Red
    severityBg = '#FFF1F2';
    title = 'Immediate Attention Recommended';
    summary = 'Your symptoms may require urgent medical evaluation. Please seek immediate help or book an urgent visit.';
  } else if (symptomText.includes('fever') || symptomText.includes('cough') || symptomText.includes('flu')) {
    priority = 'Moderate';
    severityColor = '#F59E0B'; // Warning Amber
    severityBg = '#FFFBEB';
    title = 'Medical Evaluation Advised';
    summary = 'Your symptoms indicate a possible infection. We recommend booking a consultation soon.';
  }
  
  let recommendedSpecialty = 'General Physician';
  if (priority === 'Urgent') {
    recommendedSpecialty = 'Cardiologist';
  } else if (symptomText.includes('skin') || symptomText.includes('rash')) {
    recommendedSpecialty = 'Dermatologist';
  } else if (symptomText.includes('child') || symptomText.includes('baby')) {
    recommendedSpecialty = 'Pediatrician';
  }

  const triageContext = { symptom: state.symptom, priority, recommendedSpecialty };

  return (
    <InnerScreenLayout title="Triage Result" onBack={() => navigate(PATIENT_ROUTES.HOME)}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#F8FAFC' }}>
        <div className="app-scroll" style={{ flex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Priority Card */}
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', textAlign: 'center', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', backgroundColor: severityBg, color: severityColor, marginBottom: '16px' }}>
              <AlertCircle width={18} height={18} />
              <span style={{ fontSize: '14px', fontWeight: 700 }}>{priority} Priority</span>
            </div>
            
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', margin: '0 0 12px', lineHeight: '1.3' }}>
              {title}
            </h2>
            
            <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: '1.5' }}>
              {summary}
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            <Button
              size="lg"
              fullWidth
              onClick={() => navigate('/patient/care', { state: triageContext })}
              icon={<Calendar width={20} height={20} />}
            >
              Book Care
            </Button>
            
            {priority === 'Urgent' && (
              <Button
                variant="danger"
                size="lg"
                fullWidth
                icon={<Phone width={20} height={20} />}
                onClick={() => navigate('/patient/sos')}
              >
                Call Emergency Services
              </Button>
            )}

            <Button
              variant="outline"
              size="lg"
              fullWidth
              icon={<RefreshCcw width={18} height={18} />}
              onClick={() => navigate(PATIENT_ROUTES.TRIAGE)}
            >
              Restart Assessment
            </Button>
          </div>
          
        </div>
      </div>
    </InnerScreenLayout>
  );
};
