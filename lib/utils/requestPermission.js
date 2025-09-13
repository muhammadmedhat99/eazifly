import { getToken } from "firebase/messaging";
import { messaging } from "../../../lib/firebaseClient";

async function requestPermission() {
   
  try {
    useEffect(() => {
        // Only run this code in the browser
        if (messaging) {
          // Your messaging logic here
          const currentToken =  getToken(messaging, {
            vapidKey: "BE35d_uWXjiCqjYwOL-EBiwLtkXdeAomuT3-fn6rBp06R9YOkH5g_djITeUatmhUu1Rx2T8OdTM75Ri6kUOFJic" 
          });

        return currentToken;
        }
      }, []);
   

    if (currentToken) {
      console.log("Token for this browser: ", currentToken);
    } else {
      console.log("No registration token available. Request permission to generate one.");
    }
  } catch (err) {
    console.error("An error occurred while retrieving token. ", err);
  }
}
export default requestPermission;