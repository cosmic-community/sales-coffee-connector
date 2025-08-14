import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'

// Firebase configuration - these environment variables are required
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Validate that all required Firebase config values are present
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
] as const

// Check if we're in a build environment and Firebase vars are missing
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])
const isBuildTime = process.env.NODE_ENV === 'production' && process.env.VERCEL

// Only throw error if we're not in build time or if Firebase is actually needed
if (missingEnvVars.length > 0 && !isBuildTime) {
  console.warn(`Missing Firebase environment variables: ${missingEnvVars.join(', ')}. Firebase features will be disabled.`)
}

// Initialize Firebase only if all config is available
let app: FirebaseApp | null = null
let auth: Auth | null = null

try {
  // Only initialize if we have all required config
  if (missingEnvVars.length === 0) {
    // Get existing apps to prevent re-initialization
    const existingApps = getApps()
    
    if (existingApps.length === 0) {
      // Initialize new app - Fixed: Handle undefined return type properly
      const firebaseApp = initializeApp(firebaseConfig)
      app = firebaseApp || null
    } else {
      // Use existing app - Fixed: Handle potential undefined properly
      const existingApp = existingApps[0]
      app = existingApp || null
    }
    
    // Initialize auth - Fixed: Proper null check before using app
    if (app !== null) {
      auth = getAuth(app)
    }
  }
} catch (error) {
  console.error('Failed to initialize Firebase:', error)
  // Firebase will be null, which components can check for
  app = null
  auth = null
}

export { auth }
export default app