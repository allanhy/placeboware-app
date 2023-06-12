// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDx6bsWrp8GW96zl_MNT-hoMnLvrVSdPT0",
  authDomain: "teak-hydra-352005.firebaseapp.com",
  projectId: "teak-hydra-352005",
  storageBucket: "teak-hydra-352005.appspot.com",
  messagingSenderId: "981813476362",
  appId: "1:981813476362:web:8de8d6c0f2633313c5b3f3",
  measurementId: "G-2KKXJ534D4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);