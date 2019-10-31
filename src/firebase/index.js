import firebase from 'firebase/app'
import 'firebase/storage'

const config = {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET
}

export const app = firebase.initializeApp(config)
export const storage = app.storage().ref()