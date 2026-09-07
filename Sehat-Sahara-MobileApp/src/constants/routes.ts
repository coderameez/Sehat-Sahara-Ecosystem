/**
 * Canonical Patient Route Definitions
 * Extracted to avoid circular dependency between AppRoutes and screen components.
 */
export const PATIENT_ROUTES = {
  DEV_SHELL:     '/dev/mobile-shell',
  ONBOARDING:    '/patient/onboarding',
  HOME:          '/patient',                  // P-01 — Chunk 01
  TRIAGE:        '/patient/triage',           // P-02, P-03
  TRIAGE_RESULT: '/patient/triage/result',    // P-04
  DOCTORS:       '/patient/doctors',          // P-05 — Chunk 04
  DOCTOR_DETAIL: '/patient/doctors/:id',      // P-06 — Chunk 04
  BOOKING:       '/patient/book/:id',         // P-07, P-08 — Chunk 04
  BOOKING_CONFIRM: '/patient/booking/confirmation', // P-08 explicitly
  APPOINTMENT_DETAIL: '/patient/appointments/:id', // P-10 — Chunk 05
  QUEUE:         '/patient/queue/:id',        // P-11 — Chunk 05
  NOTIFICATIONS: '/patient/notifications',    // P-09
  RECORDS:       '/patient/records',          // P-12
  RECORD_DETAIL: '/patient/records/:id',      // P-13
  RECORD_SHARE:  '/patient/records/:id/share',// P-14
  PRESCRIPTION_DETAIL: '/patient/prescriptions/:id',
  MEDICINES: '/patient/medicines',

  // Community Flow
  COMMUNITY: '/patient/community',
  COMMUNITY_BLOOD: '/patient/community/blood',
  COMMUNITY_BLOOD_DETAIL: '/patient/community/blood/:id',
  COMMUNITY_BLOOD_CREATE: '/patient/community/blood/create',
  COMMUNITY_THINGS: '/patient/community/things',
  COMMUNITY_THINGS_DETAIL: '/patient/community/things/:id',
  COMMUNITY_THINGS_ADD: '/patient/community/things/add',
  COMMUNITY_THINGS_BORROW: '/patient/community/things/:id/borrow',

  // Profile Flow
  PROFILE: '/patient/profile',

} as const;
