import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const missingFirebaseConfig = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key)

const getFirebaseApp = () => {
  if (missingFirebaseConfig.length > 0) {
    throw new Error(`Missing Firebase config: ${missingFirebaseConfig.join(', ')}`)
  }

  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
}

export const getFirebaseAuth = () => getAuth(getFirebaseApp())

export const getFirebaseProjectId = () => firebaseConfig.projectId

export const signInWithGoogle = async () => {
  const auth = getFirebaseAuth()
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })

  const credential = await signInWithPopup(auth, provider)
  return credential.user
}
