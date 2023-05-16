import { storage } from "app/firebase/fire"
import { deleteObject, getDownloadURL, ref, 
  uploadBytesResumable } from "firebase/storage"

export const uploadMultipleFilesToFireStorage = (files, storagePath, fileNames, setUploadProgress) => {
  return new Promise((resolve, reject) => {
    if(!files?.length) return resolve([])
    const fileURLs = []
    files.forEach((file, i) => {
      const storageRef = ref(storage, `${storagePath}/${fileNames ? fileNames[i] : file.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setUploadProgress && setUploadProgress(progress)
      }, (error) => {
        console.log(error)
        reject(error)
      }, () => {
        getDownloadURL(uploadTask.snapshot.ref)
        .then(downloadURL => {
          fileURLs.push({downloadURL, file, filename: file.name})
          if (fileURLs.length === files.length) {
            resolve(fileURLs)
          }
        })
        .catch(error => {
          console.log(error)
          reject(error)
        })
      })
    })
  })
}

export const deleteMultipleStorageFiles = (storagePath, filenames) => {
  return new Promise((resolve, reject) => {
    if(!filenames?.length) return resolve()
    filenames.forEach((file, i) => {
      let storageRef = ref(storage, `${storagePath}/${file}`)
      deleteObject(storageRef)
      .then(() => {
        if(i === filenames.length-1) {
          resolve()
        }
      })
      .catch(err => {
        console.log(err)
        reject(err)
      })
    })
  })
}

