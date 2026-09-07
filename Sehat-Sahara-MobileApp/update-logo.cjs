/* global console */
const fs = require('fs');
const files = [
  'src/app/DevMobileShellPreview.tsx',
  'src/features/doctor/DoctorSignIn.tsx',
  'src/features/onboarding/AuthChoice.tsx',
  'src/features/onboarding/Splash.tsx',
  'src/features/patient/PatientHome.tsx',
  'src/features/patient/PatientOnboarding.tsx',
  'src/features/patient/appointments/AppointmentDetail.tsx',
  'src/features/patient/care/FacilityList.tsx',
  'src/features/patient/care/TokenFacilityList.tsx',
  'src/features/patient/profile/ProfileRoot.tsx',
  'src/features/patient/records/PublicRecordView.tsx',
  'src/features/provider/roots/ProviderProfile.tsx'
];

files.forEach(f => {
  try {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/\bLogo\b/g, 'SehatSaharaLogo');
    c = c.replace(/<SehatSaharaLogo[^>]*>/g, (m) => {
      // Remove height and showWordmark props
      m = m.replace(/height=\{?[0-9]+\}?/, '');
      m = m.replace(/showWordmark(?:=\{[a-z]+\})?/, '');
      m = m.replace(/wordmarkColor=['"]\w+['"]/, '');
      
      // Determine variant
      let variant = 'lightBackground';
      // If it's a green header/splash, use darkBackground
      if (f.includes('Splash') || f.includes('ProviderProfile') || m.includes('dark')) {
          if (f.includes('Splash')) {
              // the Splash uses a dark background
              variant = 'darkBackground';
          }
      }
      
      // Insert variant
      return m.replace('<SehatSaharaLogo', `<SehatSaharaLogo variant="${variant}"`);
    });
    fs.writeFileSync(f, c);
    console.log('Updated ' + f);
  } catch(e) {
    console.error(e);
  }
});
