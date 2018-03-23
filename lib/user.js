function user (firebaseApp) {
  const createUser = function (email, password) {
    return firebaseApp.auth().createUserWithEmailAndPassword(email, password)
  }

  const loginUser = function (email, password) {
    return new Promise((resolve, reject) => {
      firebaseApp.auth().signInWithEmailAndPassword(email, password)
        .then(data => { resolve({ data }) })
        .catch(error => { reject(error) })
    })
  }

  const logoutUser = function () {
    return firebaseApp.auth().signOut()
  }

  const sendEmailVerification = function (email) {
    var user = firebaseApp.auth().currentUser
    return user.sendEmailVerification()
  }

  const sendPasswordResetEmail = function (email) {
    return firebaseApp.auth().sendPasswordResetEmail(email)
  }

  const updateDisplayname = function (displayName) {
    var user = firebaseApp.auth().currentUser
    return user.updateProfile({ displayName })
  }

  const updatePhotoURL = function (photoURL) {
    var user = firebaseApp.auth().currentUser
    return user.updateProfile({ photoURL })
  }

  return {
    createUser,
    loginUser,
    logoutUser,
    sendPasswordResetEmail,
    sendEmailVerification,
    updateDisplayname,
    updatePhotoURL
  }
}

export default user
