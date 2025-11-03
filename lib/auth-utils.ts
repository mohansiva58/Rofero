import { GoogleAuthProvider, signInWithPopup, signOut, type User } from "firebase/auth"
import { auth } from "./firebase-config"

export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    console.log("[v0] User signed in:", user.email)
    return user
  } catch (error) {
    console.error("[v0] Google sign-in error:", error)
    throw error
  }
}

export async function signOutUser() {
  try {
    await signOut(auth)
    console.log("[v0] User signed out")
  } catch (error) {
    console.error("[v0] Sign-out error:", error)
    throw error
  }
}

export function getCurrentUser(): User | null {
  return auth.currentUser
}
