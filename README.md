## Girl Health Journey

Pregnancy tracking and health journey app built with React, TypeScript, Vite, Tailwind CSS, shadcn-ui, and Firebase Authentication.

## Getting Started @

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the dev server:
   ```sh
   npm run dev 
   ```
3. Build for production:
   ```sh
   npm run build
   ```
4. Preview production build:
   ```sh
   npm run preview
   ```

## Authentication #

This app uses Firebase Authentication with Google Sign-In. The Firebase configuration is set up in `src/lib/firebase.ts` with the following features:

- Google OAuth authentication
- Automatic user state management
- Secure user data storage
- Real-time authentication state updates

### Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn-ui
- Firebase Authentication
- Framer Motion

### Project Structure ##

- `src/` application code
- `src/lib/firebase.ts` Firebase configuration
- `src/hooks/use-firebase-auth.tsx` Firebase authentication hook
- `src/components/auth/` authentication components
- `public/` static assets




