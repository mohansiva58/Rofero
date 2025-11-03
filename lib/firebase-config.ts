import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBUO87GZoz0GzwzQ_SnNnioji6VhDwQPiw",
  authDomain: "rarerabbit-a412f.firebaseapp.com",
  databaseURL: "https://rarerabbit-a412f-default-rtdb.firebaseio.com",
  projectId: "rarerabbit-a412f",
  storageBucket: "rarerabbit-a412f.firebasestorage.app",
  messagingSenderId: "666983339059",
  appId: "1:666983339059:web:374783cb729b514460bf46",
  measurementId: "G-4SVQQYBPQP",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

export default app
