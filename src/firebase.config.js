import { getFireStore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCHr1dcx_zd7IYOGwdnz5KHlf7Fhls9x18",
  authDomain: "house-marketplace-app-d41d8.firebaseapp.com",
  projectId: "house-marketplace-app-d41d8",
  storageBucket: "house-marketplace-app-d41d8.appspot.com",
  messagingSenderId: "755365532339",
  appId: "1:755365532339:web:2a55a11a81cd83b4dbd6c6"
};

export const db = getFireStore()