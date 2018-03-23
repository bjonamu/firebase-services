import uuid from 'uuid/v1'
import * as firebase from 'firebase'

/**
 * Uploads files to firebase storgae defaults to an image/jpeg and stores it in the images bucket
 * By default the uuid is used to generate a unique name for the file
 * @param {*} cb is a callback function that brings back the status and progress of uploading
 */
const uploadFile = function ({ file, mime = 'image/jpeg', bucket = 'images', fileName = uuid() }, cb) {
  return new Promise(function (resolve, reject) {
    // Create a root reference
    const storageRef = firebase.storage().ref()
    // Create the file metadata
    const metadata = {
      contentType: mime
    }
    // const fileName = uuid()
    // Upload file and metadata to the object 'images/mountains.jpg'
    const uploadTask = storageRef.child(`${bucket}/${fileName}`).put(file, metadata)

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      function (snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        if (cb) {
          cb({ status: 'UPLOADING', progress })
        }
        console.log('Upload is ' + progress + '% done')
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            if (cb) {
              cb({ status: 'PAUSED', progress })
            }
            console.log('Upload is paused')
            break
          case firebase.storage.TaskState.RUNNING: // or 'running'
            if (cb) {
              cb({ status: 'RUNNING', progress })
            }
            console.log('Upload is running')
            break
        }
      }, function (error) {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
          // User doesn't have permission to access the object
            break

          case 'storage/canceled':
          // User canceled the upload
            break

          case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
            break
        }
        reject(error)
      }, function () {
      // Upload completed successfully, now we can get the download URL
        const downloadURL = uploadTask.snapshot.downloadURL
        resolve(downloadURL)
      })
  })
}

const deleteFile = function (filePath) {
  return new Promise(function (resolve, reject) {
    // Get a reference to the storage service, which is used to create references in your storage bucket
    const storage = firebase.storage()

    // Create a storage reference from our storage service
    const storageRef = storage.ref()
    // Create a reference to the file to delete
    const desertRef = storageRef.child(filePath)

    // Delete the file
    desertRef.delete().then(function () {
      // File deleted successfully
      resolve()
    }).catch(function (error) {
      // Uh-oh, an error occurred!
      reject(error)
    })
  })
}

export default {
  uploadFile,
  deleteFile
}
