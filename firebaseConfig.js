import firebase from 'firebase';


const firebaseConfig = {
    apiKey: "AIzaSyD480eQzY9RTRTmRSTBhSKYqQlmhmEJBKM",
    authDomain: "ecom-c0f34.firebaseapp.com",
    databaseURL: "https://ecom-c0f34-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ecom-c0f34",
    storageBucket: "ecom-c0f34.appspot.com",
    messagingSenderId: "488931104450",
    appId: "1:488931104450:web:8a1a841707efe04673cd5b",
    measurementId: "G-L1BP968VYF"
};

const Firebase = firebase.initializeApp(firebaseConfig)

export default Firebase
