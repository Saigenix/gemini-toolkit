"use client";
import { app} from "./firebase";

import {getMessaging, getToken } from "firebase/messaging";


export function requestPermission() {
  console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
    }
  });

  const messaging = getMessaging(app);
  // Add the public key generated from the console here.
  getToken(messaging, {
    vapidKey:
      "BNiqM4X8v5yfWHCDkCfuRG22PV0a9S0jLR6z9iU4XvRiUFeBzHhWOZ50FaBDJjrEZw_oVytNxxuZbppQVK4vIko",
  })
    .then((currentToken) => {
      if (currentToken) {
        // console.log("Token: ", currentToken);
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
}