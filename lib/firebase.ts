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

// Check for missing environment variables
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])
const hasAllConfig = missingEnvVars.length === 0

// Initialize Firebase only if all config is available
let app: FirebaseApp | null = null
let auth: Auth | null = null
let firebaseAvailable = false

try {
  if (hasAllConfig) {
    // Get existing apps to prevent re-initialization
    const existingApps = getApps()
    
    if (existingApps.length === 0) {
      // Initialize new app
      app = initializeApp(firebaseConfig)
    } else {
      // Use existing app
      app = existingApps[0]!
    }
    
    // Initialize auth
    auth = getAuth(app)
    firebaseAvailable = true
    
    console.log('✅ Firebase initialized successfully')
  } else {
    console.warn(`❌ Firebase not available. Missing environment variables: ${missingEnvVars.join(', ')}`)
    console.warn('📝 Please add Firebase configuration to your .env.local file. See .env.example for required variables.')
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase:', error)
  app = null
  auth = null
  firebaseAvailable = false
}

// Helper function to check if Firebase is available
export const isFirebaseAvailable = (): boolean => {
  return firebaseAvailable
}

// Helper function to get missing environment variables
export const getMissingFirebaseEnvVars = (): string[] => {
  return missingEnvVars
}

export { auth }
export default app