import * as firebase from 'firebase'
import sagaChannel from './lib/sagaChannel'
import database from './lib/database'
import storage from './lib/storage'
import user from './lib/user'

export default function (config) {
  const firebaseApp = firebase.initializeApp(config)
  return {
    storage,
    sagaChannel,
    user: user(firebaseApp),
    db: database(firebaseApp),
    firestore: firebaseApp.firestore()
  }
}
