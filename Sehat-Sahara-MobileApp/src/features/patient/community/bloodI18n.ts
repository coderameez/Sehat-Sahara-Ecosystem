export interface BloodLabels {
  bloodRequests: string;
  communitySubtitle: string;
  providerSubtitle: string;
  donateBlood: string;
  requestBlood: string;
  nearbyRequests: string;
  myRequests: string;
  myPledgesAndRequests: string;
  viewDetails: string;
  iCanDonate: string;
  searchPlaceholder: string;
  noRequestsFound: string;
  noRequestsDesc: string;
  unit: string;
  units: string;
  requiredFor: string;
  urgent: string;
  youPledged: string;
  tapToView: string;
  all: string;
  anyGroup: string;
  requestNotFound: string;
  requestUnavailable: string;
  backToRequests: string;
  pledgeActive: string;
  pledgeActiveDesc: string;
  chatWithRequester: string;
  withdraw: string;
  pledgedDonors: string;
  hospitalAndCenter: string;
  donorEligibilityNote: string;
  confirmPledgeTitle: string;
  confirmPledgePrompt: string;
  confirmPledgeRoleNotice: string;
  confirmSubmit: string;
  cancel: string;
  withdrawPledgeTitle: string;
  withdrawPledgePrompt: string;
  confirmWithdraw: string;
  keepPledge: string;
}

export const BLOOD_TRANSLATIONS: Record<'en' | 'ru' | 'ur', BloodLabels> = {
  en: {
    bloodRequests: 'Blood Requests',
    communitySubtitle: 'Community Blood Network',
    providerSubtitle: 'Provider Blood Donation Network',
    donateBlood: 'Donate Blood',
    requestBlood: 'Request Blood',
    nearbyRequests: 'Nearby Requests',
    myRequests: 'My Requests',
    myPledgesAndRequests: 'My Requests',
    viewDetails: 'View Details',
    iCanDonate: 'I Can Donate',
    searchPlaceholder: 'Search by hospital, area or patient...',
    noRequestsFound: 'No requests found',
    noRequestsDesc: 'Try adjusting your blood group filter or search query.',
    unit: 'Unit',
    units: 'Units',
    requiredFor: 'required for',
    urgent: 'URGENT',
    youPledged: 'You pledged to donate',
    tapToView: 'Tap to view details',
    all: 'All',
    anyGroup: 'Any Group',
    requestNotFound: 'Request Not Found',
    requestUnavailable: 'This blood request is no longer available.',
    backToRequests: 'Back to Blood Requests',
    pledgeActive: 'Your Donation Pledge is Active',
    pledgeActiveDesc: 'Thank you! The patient has been notified of your response. Coordinate with the hospital blood bank.',
    chatWithRequester: 'Chat with Requester',
    withdraw: 'Withdraw',
    pledgedDonors: 'Pledged Donors',
    hospitalAndCenter: 'Hospital & Center',
    donorEligibilityNote: 'Standard donor eligibility applies: Age 18–60, minimum 50kg weight, hemoglobin ≥ 12.5 g/dL, no active infection.',
    confirmPledgeTitle: 'Confirm Donation Pledge',
    confirmPledgePrompt: 'Are you willing to donate blood for this patient?',
    confirmPledgeRoleNotice: 'Your pledge will be immediately visible to the requester.',
    confirmSubmit: 'Confirm & Submit Pledge',
    cancel: 'Cancel',
    withdrawPledgeTitle: 'Withdraw Donation Pledge',
    withdrawPledgePrompt: 'Are you sure you want to withdraw your pledge to donate?',
    confirmWithdraw: 'Confirm Withdrawal',
    keepPledge: 'Keep Pledge',
  },
  ru: {
    bloodRequests: 'Blood Requests',
    communitySubtitle: 'Community Blood Network',
    providerSubtitle: 'Provider Blood Donation Network',
    donateBlood: 'Blood Donate Karein',
    requestBlood: 'Blood Request Karein',
    nearbyRequests: 'Qareebi Requests',
    myRequests: 'Meri Requests',
    myPledgesAndRequests: 'Meri Requests',
    viewDetails: 'Details Dekhein',
    iCanDonate: 'Main Blood De Sakta/Sakti Hoon',
    searchPlaceholder: 'Hospital, ilaqah ya mareez ka naam search karein...',
    noRequestsFound: 'Koi request nahi mili',
    noRequestsDesc: 'Blood group filter ya search query tabdeel karein.',
    unit: 'Unit',
    units: 'Units',
    requiredFor: 'darkaar baraye',
    urgent: 'URGENT',
    youPledged: 'Aap ne donate karne ka wada kiya',
    tapToView: 'Details dekhne ke liye tap karein',
    all: 'Tamam',
    anyGroup: 'Koi Bhi Group',
    requestNotFound: 'Request Nahi Mili',
    requestUnavailable: 'This blood request is no longer available.',
    backToRequests: 'Blood Requests Par Wapis Jayein',
    pledgeActive: 'Aap ka donation pledge active hai',
    pledgeActiveDesc: 'Shukriya! Mareez ko aap ki response ka pata chal gaya hai. Hospital blood bank se rabta karein.',
    chatWithRequester: 'Requester Se Chat Karein',
    withdraw: 'Wapis Lein',
    pledgedDonors: 'Pledged Donors',
    hospitalAndCenter: 'Hospital Aur Center',
    donorEligibilityNote: 'Aam donor eligibility: Umar 18–60 saal, kam az kam 50kg wazan, hemoglobin ≥ 12.5 g/dL, koi active infection nahi.',
    confirmPledgeTitle: 'Donation Pledge Ki Tasdeeq',
    confirmPledgePrompt: 'Kya aap is mareez ke liye blood donate karne ko tayar hain?',
    confirmPledgeRoleNotice: 'Aap ka pledge foran requester ko nazar aayega.',
    confirmSubmit: 'Pledge Submit Karein',
    cancel: 'Mansookh',
    withdrawPledgeTitle: 'Donation Pledge Wapis Lein',
    withdrawPledgePrompt: 'Kya aap waqai apna donation pledge wapis lena chahte hain?',
    confirmWithdraw: 'Wapsi Ki Tasdeeq',
    keepPledge: 'Pledge Barqarar Rakhein',
  },
  ur: {
    bloodRequests: 'خون کی درخواستیں',
    communitySubtitle: 'کمیونٹی بلڈ نیٹ ورک',
    providerSubtitle: 'پرووائیڈر بلڈ نیٹ ورک',
    donateBlood: 'خون عطیہ کریں',
    requestBlood: 'خون کی درخواست',
    nearbyRequests: 'قریبی درخواستیں',
    myRequests: 'میری درخواستیں',
    myPledgesAndRequests: 'میری درخواستیں',
    viewDetails: 'تفصیلات دیکھیں',
    iCanDonate: 'میں خون دے سکتا/سکتی ہوں',
    searchPlaceholder: 'ہسپتال، علاقہ یا مریض تلاش کریں...',
    noRequestsFound: 'کوئی درخواست نہیں ملی',
    noRequestsDesc: 'بلڈ گروپ فلٹر یا تلاش تبدیل کریں۔',
    unit: 'یونٹ',
    units: 'یونٹس',
    requiredFor: 'برائے',
    urgent: 'فوری',
    youPledged: 'آپ نے عطیہ کرنے کا عزم کیا ہے',
    tapToView: 'تفصیلات دیکھنے کے لیے ٹیپ کریں',
    all: 'تمام',
    anyGroup: 'کوئی بھی گروپ',
    requestNotFound: 'درخواست نہیں ملی',
    requestUnavailable: 'This blood request is no longer available.',
    backToRequests: 'خون کی درخواستوں پر واپس جائیں',
    pledgeActive: 'آپ کا عطیہ کا عزم فعال ہے',
    pledgeActiveDesc: 'شکریہ! مریض کو آپ کے جواب کی اطلاع دے دی گئی ہے۔ ہسپتال کے بلڈ بینک سے رابطہ کریں۔',
    chatWithRequester: 'درخواست گزار سے رابطہ کریں',
    withdraw: 'واپس لیں',
    pledgedDonors: 'عطیہ دہندگان',
    hospitalAndCenter: 'ہسپتال اور سنٹر',
    donorEligibilityNote: 'عطیہ دہندگان کی عمومی اہلیت: عمر 18 تا 60 سال، کم از کم 50 کلو وزن، ہیموگلوبن 12.5 سے زیادہ۔',
    confirmPledgeTitle: 'عطیہ کے عزم کی تصدیق',
    confirmPledgePrompt: 'کیا آپ اس مریض کے لیے خون عطیہ کرنے کے لیے تیار ہیں؟',
    confirmPledgeRoleNotice: 'آپ کا عزم فوری طور پر درخواست گزار کو نظر آئے گا۔',
    confirmSubmit: 'عزم جمع کرائیں',
    cancel: 'منسوخ',
    withdrawPledgeTitle: 'عطیہ کا عزم واپس لیں',
    withdrawPledgePrompt: 'کیا آپ واقعی اپنا عطیہ کا عزم واپس لینا چاہتے ہیں؟',
    confirmWithdraw: 'واپسی کی تصدیق',
    keepPledge: 'عزم برقرار رکھیں',
  }
};

export const getBloodLabels = (lang?: string): BloodLabels => {
  const normalized = (lang || 'en').toLowerCase();
  if (normalized === 'ur') return BLOOD_TRANSLATIONS.ur;
  if (normalized === 'ru' || normalized === 'roman') return BLOOD_TRANSLATIONS.ru;
  return BLOOD_TRANSLATIONS.en;
};
