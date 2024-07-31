importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object

firebase.initializeApp({
  apiKey: "AIzaSyC_FTuxEeWdy4H00eSroOpA2pPegTdN42g",
  authDomain: "gemini-toolkit.firebaseapp.com",
  projectId: "gemini-toolkit",
  storageBucket: "gemini-toolkit.appspot.com",
  messagingSenderId: "190798096608",
  appId: "1:190798096608:web:39fd0bc690f79285470885",
});
// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();;
messaging
  .getToken(messaging, {
    vapidKey:
      "BNiqM4X8v5yfWHCDkCfuRG22PV0a9S0jLR6z9iU4XvRiUFeBzHhWOZ50FaBDJjrEZw_oVytNxxuZbppQVK4vIko",
  })
  .then((currentToken) => {
    if (currentToken) {
      console.log("Token: ", currentToken);
      // Send the token to your server and update the UI if necessary
      // ...
    } else {
      // Show permission request UI

      console.log(
        "No registration token available. Request permission to generate one."
      );
      // ...
    }
  })
  .catch((err) => {
    console.log("An error occurred while retrieving token. ", err);
    // ...
  });

// messaging.onMessage(messaging, (payload) => {
//   console.log("Message received. ", payload);
//   // ...
// });

// messaging.onBackgroundMessage(messaging, (payload) => {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message ",
//     payload
//   );
//   // Customize notification here
//   const notificationTitle = "Background Message Title";
//   const notificationOptions = {
//     body: "Background Message body.",
//     icon: "/firebase-logo.png",
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
