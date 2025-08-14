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
]

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])
if (missingEnvVars.length > 0) {
  throw new Error(`Missing required Firebase environment variables: ${missingEnvVars.join(', ')}`)
}

// Initialize Firebase
let app: FirebaseApp
let auth: Auth

// Get existing apps to prevent re-initialization
const existingApps = getApps()

if (existingApps.length === 0) {
  // Initialize new app
  app = initializeApp(firebaseConfig)
} else {
  // Use existing app - TypeScript fix: we know existingApps[0] exists since length > 0
  app = existingApps[0] as FirebaseApp
}

// Initialize auth
auth = getAuth(app)

export { auth }
export default app