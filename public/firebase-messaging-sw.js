// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
// import { getMessaging, onBackgroundMessage } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging.js";

// const firebaseApp = initializeApp({
//   apiKey: "AIzaSyCj7ZBdCOLeUcfKVusG9EEGSkO3T4wbrBM",
//   authDomain: "toyota-81e68.firebaseapp.com",
//   projectId: "toyota-81e68",
//   storageBucket: "toyota-81e68.firebasestorage.app",
//   messagingSenderId: "523355652200",
//   appId: "1:523355652200:web:59189f25a723e17d53bbdd",
//   measurementId: "G-M630YW8H07"
// });

// const messaging = getMessaging(firebaseApp);

// onBackgroundMessage(messaging, (payload) => {
//   console.log("Background message received: ", payload);
//   self.registration.showNotification(payload.notification.title, {
//     body: payload.notification.body,
//     icon: "/logo.jpg",
//   });
// });

// export default messaging;