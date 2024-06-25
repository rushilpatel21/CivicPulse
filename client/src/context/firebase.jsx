import { createContext, useContext } from "react";
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { getDatabase, set, ref } from "firebase/database";
import PropTypes from 'prop-types';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    authDomain: import.meta.env.VITE_GOOGLE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_GOOGLE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_GOOGLE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_GOOGLE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_GOOGLE_APP_ID,
    measurementId: import.meta.env.VITE_GOOGLE_MEASUREMENT_ID,
    databaseURL: import.meta.env.VITE_GOOGLE_DATABASE_URL
  };

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);

const FirebaseContext = createContext(null);

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = (props) => {
    const signupUserWithEmailAndPassword = (email, password) => {
        return createUserWithEmailAndPassword(firebaseAuth, email, password);
    }

    const putData = (key, data) => {
        set(ref(database, key), data);
    }

    return(
        <FirebaseContext.Provider value={{signupUserWithEmailAndPassword, putData}}>
            {props.children}
        </FirebaseContext.Provider>
    )
}

FirebaseProvider.propTypes = {
    children: PropTypes.node.isRequired
}
