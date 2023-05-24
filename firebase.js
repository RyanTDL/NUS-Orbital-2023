// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDCpsTM-QJKYCISsOTjzNabNhCWic5fdUQ",
    authDomain: "orbital-2023-dee7e.firebaseapp.com",
    databaseURL: "https://orbital-2023-dee7e-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "orbital-2023-dee7e",
    storageBucket: "orbital-2023-dee7e.appspot.com",
    messagingSenderId: "687538630843",
    appId: "1:687538630843:web:ee1607400218adb944b99e",
    measurementId: "G-8XQ8H640VX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Initialize Firestore and get a reference to the servicd\
export const db= getFirestore(app);