import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebase";

const provider = new GoogleAuthProvider();

export function signInWithGoogle(setCurrentUser) {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      setCurrentUser(user);
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          ...user,
          cached: true,
        }),
      );
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      // const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      // const email = error.customData.email;
      // The AuthCredential type that was used.
      GoogleAuthProvider.credentialFromError(error);
      // ...
      console.log("Google auth error", errorMessage);
    });
}

export function signOut(cleanUpOldData) {
  cleanUpOldData();
  auth.signOut();
}
