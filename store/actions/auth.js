import {AsyncStorage} from 'react-native';

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
        // Make firebase post request
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD480eQzY9RTRTmRSTBhSKYqQlmhmEJBKM', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        });
        // check if response is not OK and show error
        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Something went wrong!';
            if (errorId === 'EMAIL_EXISTS') {
                message = 'This email already exists!';
            }
            throw new Error(message);
        }
        const resData = await response.json();
        // Dispatch if response OK
        dispatch(
            authenticate(
                resData.localId,
                resData.idToken,
                parseInt(resData.expiresIn * 1000),
            ));
        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        // save the Token to local Storage
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    };
};

// Action for Login make post to Firebase and check if valid user then set token and login
export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD480eQzY9RTRTmRSTBhSKYqQlmhmEJBKM', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        });
        // check if response is not OK and show error
        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Something went wrong!';
            if (errorId === 'EMAIL_NOT_FOUND') {
                message = 'This email could not be found';
            } else if (errorId === 'INVALID_PASSWORD') {
                message = 'This password is not valid!';
            }
            throw new Error(message);
        }
        const resData = await response.json();
        // Dispatch if response OK
        dispatch(authenticate(
            resData.localId,
            resData.idToken,
            parseInt(resData.expiresIn * 1000)));

        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        // save the Token to local Storage
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
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



