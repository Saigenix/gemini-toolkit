import { getAuth, signInWithPopup, GoogleAuthProvider,signOut } from "firebase/auth";
import { provider,app } from "./firebase"

export const auth = getAuth(app)

export const  LoginWithGoogle = ()=>{

signInWithPopup(auth, provider)
  .then(async (result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    console.log(user)
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
  });
  }

  export const SignOut = ()=> {
        signOut(auth)
  }