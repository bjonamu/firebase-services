import * as firebase from 'firebase'
// Required for side-effects
// https://stackoverflow.com/a/48092919
import 'firebase/firestore'

import database from './lib/database'
import storage from './lib/storage'
import user from './lib/user'

export default function (config) {
  const firebaseApp = firebase.initializeApp(config)
  return {
    storage,
    user: user(firebaseApp),
    db: database(firebaseApp),
    fs: firebase.firestore()
  }
}
