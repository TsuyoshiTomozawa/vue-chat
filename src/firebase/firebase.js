import firebase from 'firebase'

var firebaseConfig = {
    apiKey: "AIzaSyCZosf48GIaDbrUini5iLHaE-Z0KNWOVjI",
    authDomain: "vue-chat-6663c.firebaseapp.com",
    projectId: "vue-chat-6663c",
    storageBucket: "vue-chat-6663c.appspot.com",
    messagingSenderId: "931126093746",
    appId: "1:931126093746:web:a493940dafb23731e226ab"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export default firebase;