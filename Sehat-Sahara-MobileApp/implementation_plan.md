# Implement Patient Onboarding, Prototype Account Flow, and Home UI Polish

This plan addresses the implementation of the new onboarding flow, the prototype state service, the Home UI polish, and the critical layout fixes for the responsive mobile shell as requested.

## Proposed Changes

### 1. Prototype State Service
We will create a lightweight `PrototypeService` to manage the app's persistent onboarding and demo state using `localStorage`.
- Stores properties: `onboardingVersion`, `language`, `role`, `authMode`, `profile` (demo defaults), `preferences`, `lastStep`, `onboardingComplete`.
- Includes safe parsing, versioning, fallback logic, and a mechanism to clear/reset the demo state.

### 2. Layout & Architecture Fixes (MobileAppShell & index.css)
**Fixing the Grey/Black Strip and Double Scrolling:**
- **index.html**: Set `<meta name="color-scheme" content="light">` and ensure `viewport-fit=cover` is present.
- **index.css**:
  - Normalize `html`, `body`, `#root` to have `height: 100%`, `margin: 0`, and a light-neutral background (`#F8FAFC`). Remove `overflow: visible` hacks on mobile.
- **MobileAppShell.tsx**:
  - **Mobile**: Set to `height: 100vh; height: 100svh; height: 100dvh; overflow: hidden; display: flex; flex-direction: column`. This ensures the shell itself never scrolls and stretches perfectly to the browser viewport without exposing the body background.
  - **Desktop**: Fix the aspect ratio to strictly `393 / 852`. Set the outer frame height to `min(876px, 100dvh - 32px)` and compute width automatically. The frame will have a graphite bezel and a centered Dynamic Island. No scaling or 50% zoom will be required on standard desktop resolutions.
- **Route-level Height Conflicts**: All screens inside `MobileAppShell` will be configured to inherit available height (`flex: 1`, `min-height: 0`) and use the `.app-scroll` region internally, removing any rogue `h-screen` or `min-h-screen` classes on individual pages.

### 3. PatientBottomNav & Headers
- Ensure `PatientBottomNav` is only present on primary root routes (`Home`, `Find Care`, `AI`, `Community`, `Profile`) and is locked to the bottom inside the `MobileAppShell`'s flex column layout.
- The `AI Check` button will be elevated and prominently styled.
- Standardize the `RootHeader` and `InnerHeader` to be sticky/fixed, non-shrinking flex items inside `MobileAppShell` to avoid disappearing or colliding with content.

### 4. New User Flow & Authentication Routes
We will implement the following routes using the approved UI language and form behaviors. Missing form fields will deterministically fill with demo fallback values on submission.
- **`/welcome` (Splash)**: Animated deep green Sehat Sahara branding, auto-transitions after 1.5s.
- **`/onboarding/language`**: Select between English, Urdu, Roman Urdu.
- **`/onboarding/role`**: Choose Patient or Healthcare Provider. (Provider redirects back with a demo warning).
- **`/onboarding/intro`**: Three-state carousel detailing app features.
- **`/auth`**: Authentication choice screen (Create Account, Sign In, Demo Profile).
- **`/auth/login`**: Phone/email login prototype.
- **`/auth/create-account`**: Registration fields with inline validation.
- **`/auth/verify`**: 6-digit OTP verification prototype (defaulting to 123456).
- **`/onboarding/profile`**: Setup name, gender, city, emergency contact.
- **`/onboarding/preferences`**: Configure reminders and text size.

### 5. Patient Home Polish
- Update `/patient` to feature a personalized greeting block (e.g., "Assalam-o-Alaikum, [Name]").
- Add a prominent "AI Health Assistant" hero card with a distinct deep green gradient.
- Build a quick-action grid (Find Care, My Records, Appointments, Medicines).
- Conditionally render recent activity only if data is present in the mock store.

## Verification Plan
1. **Automated Scripts**: Run `npx tsc --noEmit && npm run lint && npm run build` to verify type safety and syntax.
2. **Layout Audit**: Inspect browser computed styles at 320x568, 390x844, and 1366x768 (Desktop) to ensure `MobileAppShell` correctly fills the screen on mobile and stays strictly constrained on desktop without gray bars or double scrollbars.
3. **Flow Testing**: Manually click through the complete `/welcome` to `/patient` journey, verifying the empty-form fallback logic, state persistence, and root tab navigations.
