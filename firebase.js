// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore, query, getDoc, collection, where, addDoc, setDoc, doc} from "firebase/firestore";
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut} from "firebase/auth";

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

const app = initializeApp(firebaseConfig); // Initialize Firebase
const auth= getAuth(app);
const db= getFirestore(app); //Initialize Firestore and get a reference to the service


//https://blog.logrocket.com/user-authentication-firebase-react-apps/
const logInWithEmailAndPassword= async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } 
    catch (err) {
        console.error(err);
        alert("Invalid email/password");
    }
};

const registerWithEmailAndPassword = async (username, email, password) => {
    try {
        const res= await createUserWithEmailAndPassword(auth, email, password);
        const user= res.user;

        //setDoc allows setting the specific document ID, unlike addDoc. Use doc() instead of collection() when using setDoc
        //This sets the player's database under "users" collection
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            authProivder: "local",
            email: email,
            username: username,
            playerID: user.uid.slice(0,8),
            //Set the base stats to (Strength:5, Agility:5, Health:20, Intellect:5)
            total_exercise: 5,
            total_steps: 50,
            total_sleep: 140,
            total_study: 15,
            weekly_exercise: [0,0,0,0,0,0,0],
            weekly_steps: [0,0,0,0,0,0,0],
            weekly_sleep: [0,0,0,0,0,0,0],
            weekly_study: [0,0,0,0,0,0,0],
        });

        //This sets the player's database under "friends" collection
        await setDoc(doc(db, "friends", user.uid), {
            friends: {}
        });
    }
    catch (err) {
        console.error(err);
        alert("Please enter a valid email");
    }
}

const sendPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link sent!")
    }
    catch (err) {
        console.log(err);
        alert("Please enter a valid email");
    }
};

const logout= () => {
    signOut(auth);
};

export {
    auth,
    db,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
};