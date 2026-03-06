// // src/firebase.js
// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: "AIzaSyCj7ZBdCOLeUcfKVusG9EEGSkO3T4wbrBM",
//   authDomain: "toyota-81e68.firebaseapp.com",
//   projectId: "toyota-81e68",
//   storageBucket: "toyota-81e68.firebasestorage.app",
//   messagingSenderId: "523355652200",
//   appId: "1:523355652200:web:59189f25a723e17d53bbdd",
//   measurementId: "G-M630YW8H07"
// };

// const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);

// // ขอ permission และรับ FCM token
// export const requestFirebaseNotificationPermission = async () => {
//   try {
//     const permission = await Notification.requestPermission();
//     if (permission === "granted") {
//       const token = await getToken(messaging, { vapidKey: "BKaxu7_MGsdl1BhPlxBpCIX5hBv8F7U08XfpisZkn3ANORD63rXJQmDqrUP1Z8gqjTTCi_C_qaOxdEyRKMDc2E8" });
//       console.log("FCM Token:", token);
//       return token;
//     } else {
//       console.log("Notification permission not granted");
//       return null;
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

// // รับ notification ตอน frontend active
// export const onMessageListener = () =>
//   new Promise((resolve) => {
//     onMessage(messaging, (payload) => {
//       resolve(payload);
//     });
//   });

// export default messaging;