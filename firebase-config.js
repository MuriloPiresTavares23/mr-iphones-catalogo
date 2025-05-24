// Substitua pelos seus dados do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDsIWsBTtP7YiIYw0a1Reru3XFA9wajP9k",
  authDomain: "mr-iphones-mt-catalogo.firebaseapp.com",
  projectId: "mr-iphones-mt-catalogo",
  storageBucket: "mr-iphones-mt-catalogo.firebasestorage.app",
  messagingSenderId: "231517888492",
  appId: "1:231517888492:web:b12539a232484248e52ac9",
  measurementId: "G-4ZVCJET8BY"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
