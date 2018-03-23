import * as firebase from 'firebase'

function database (firebaseApp) {
  const db = firebaseApp.database()

  const ref = function (ref) {
    return db.ref(ref)
  }

  const generateKey = function (ref) {
    return db.ref(ref).push().key
  }

  const getTimestamp = () => firebase.database.ServerValue.TIMESTAMP

  const add = function (ref, data) {
    const addRef = db.ref(ref)
    return addRef.push(data).key
  }

  const set = function (ref, data) {
    db.ref(ref).set(data)
  }

  const get = function (ref) {
    const source = ref ? db.ref(ref) : db.ref()
    return new Promise((resolve, reject) => {
      source.once('value')
        .then(function (snapshot) {
          resolve({
            key: snapshot.key,
            value: snapshot.val()
          })
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  const update = function (ref, data) {
    const updateRef = db.ref(ref)
    return updateRef.update(data)
  }

  const remove = function (ref) {
    const deleteRef = db.ref(ref)
    deleteRef.remove()
  }

  const transact = function (ref, updateFunc) {
    return db.ref(ref).transaction(updateFunc)
  }

  const fetchLatestNumItems = function (ref, numItems, endAtItemKey) {
    return new Promise((resolve, reject) => {
      if (!endAtItemKey) { // if initial fetch
        db.ref(ref)
        .orderByKey()
        .limitToLast(numItems)
        .once('value')
        .then(snapshot => {
            // changing to reverse chronological order (latest first)
          const data = snapshot.val()
          if (data) {
            let arrayOfKeys = Object.keys(data).sort().reverse()
              // transforming to array
            let results = arrayOfKeys.map(key => ({ id: key, ...data[key] }))
              // storing reference
            let referenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1]
            resolve({ results, referenceToOldestKey, noMore: arrayOfKeys.length < numItems })
          } else {
            resolve({ results: [], referenceToOldestKey: null })
          }
        })
        .catch(error => reject(error))
      } else {
        db.ref(ref)
        .orderByKey()
        .endAt(endAtItemKey)
        .limitToLast(numItems + 1)
        .once('value')
        .then((snapshot) => {
          // changing to reverse chronological order (latest first)
          // & removing duplicate
          const data = snapshot.val()
          if (data) {
            let arrayOfKeys = Object.keys(data).sort().reverse().slice(1)
              // transforming to array
            let results = arrayOfKeys.map(key => ({ id: key, ...data[key] }))
              // updating reference
            let referenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1]
              // Do what you want to do with the data, i.e.
            resolve({ results, referenceToOldestKey, noMore: arrayOfKeys.length < numItems })
          } else {
            resolve({ results: [], referenceToOldestKey: null })
          }
        })
        .catch((error) => reject(error))
      }
    })
  }

  return {
    ref,
    generateKey,
    getTimestamp,
    add,
    set,
    get,
    fetchLatestNumItems,
    update,
    transact,
    remove
  }
}

export default database
