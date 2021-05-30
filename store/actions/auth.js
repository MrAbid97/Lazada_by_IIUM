import {AsyncStorage} from 'react-native';
import Firebase from "../../firebaseConfig";


// Create some const that will used in future
export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const SET_DID_TRY_AUTO_LOGIN = 'SET_DID_TRY_AUTO_LOGIN';

let timer;
// Method for state change
export const setDidTryAutoLogin = () => {
    return {
        type: SET_DID_TRY_AUTO_LOGIN
    };
};

//  Action for authenticate and login
export const authenticate = (userId, token, expiryTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({
            type: AUTHENTICATE,
            userId: userId,
            token: token,
        });
    }
};

// Action for SignUp make post to Firebase and check if valid user then set token and login
export const signup = (email, password) => {
    return async dispatch => {
        await Firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((response) => {
                if (!response.user.emailVerified) {
                    Firebase.auth().currentUser.sendEmailVerification();
                    throw new Error("Your Email is Not Verified\nCheck Your Email");
                } else {
                    Firebase.auth().currentUser.getIdTokenResult().then(auth => {
                        dispatch(
                            authenticate(
                                response.user.uid,
                                auth.token,
                                1000000
                            ));
                        const expirationDate = new Date(new Date().getTime() + 1000000);
                        saveDataToStorage(response.user.uid, auth.token, expirationDate);
                    });
                }
            })
            .catch(error => {
                throw new Error(error.message)
            })

    };
};

// Action for Login make post to Firebase and check if valid user then set token and login
export const login = (email, password) => {
    return async dispatch => {
        await Firebase.auth().signInWithEmailAndPassword(email, password)
            .then((response) => {
                console.log(response.user);
                const email = response.user.email;
                if (!response.user.emailVerified) {
                    Firebase.auth().currentUser.sendEmailVerification();
                    throw new Error("Your Email is Not Verified\nCheck Your Email");
                } else {
                    Firebase.auth().currentUser.getIdTokenResult().then(auth => {
                        dispatch(
                            authenticate(
                                response.user.uid,
                                auth.token,
                                1000000
                            ));
                        const expirationDate = new Date(new Date().getTime() + 1000000);
                        saveDataToStorage(response.user.uid, auth.token, expirationDate);
                    });
                }
            })
            .catch(error => {
                throw new Error(error.message)
            })
    };
};

// Logout option with clear Token from Storage
export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData');
    return {
        type: LOGOUT
    };
}

// Logout Timer
const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer);
    }
};

// Set Logout Timer that will auto Logout if time is Exceed
const setLogoutTimer = expirationTime => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
    }
}

// Function to save data to storage
const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        token: token,
        userId: userId,
        expiryDate: expirationDate.toISOString(),
    }));
}



