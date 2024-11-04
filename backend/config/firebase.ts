// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getAuth, Auth, FacebookAuthProvider, TwitterAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCRIUqE1flK-gKeQu_fxmjZqygncbi0Np0",
    authDomain: "luxe-hotel-e17c1.firebaseapp.com",
    projectId: "luxe-hotel-e17c1",
    storageBucket: "luxe-hotel-e17c1.appspot.com",
    messagingSenderId: "233573690522",
    appId: "1:233573690522:web:02df4abcd913d6f8a70323",
    measurementId: "G-HSKYYYS99G"
};


// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
export const analytics: Analytics = getAnalytics(app);
export const auth: Auth = getAuth(app);
export const db = getFirestore(app);

// Social logins
export const facebookLogin = new FacebookAuthProvider();
export const twitterLogin = new TwitterAuthProvider();
export const googleLogin = new GoogleAuthProvider();


export default app;
