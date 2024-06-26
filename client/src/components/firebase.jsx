import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  authDomain: import.meta.env.VITE_GOOGLE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_GOOGLE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_GOOGLE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_GOOGLE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_GOOGLE_APP_ID,
  measurementId: import.meta.env.VITE_GOOGLE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_GOOGLE_DATABASE_URL
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const auth = getAuth(app);
const db=getFirestore(app);
const storage = getStorage();
const storageRef = ref(storage);

export { analytics, auth, db, storage, storageRef };