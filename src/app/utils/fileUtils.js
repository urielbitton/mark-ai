import { blobToURL, fromBlob } from 'image-resize-compress'
import { infoToast } from "app/data/toastsTemplates"

function setLoadingDef(num) { }

export const fileTypeConverter = (string) => {
  if (string?.includes('wordprocessingml') || string?.includes('word'))
    return { icon: 'fas fa-file-word', color: '#2194ff', name: 'Word', docType: 'word' }
  else if (string?.includes('spreadsheetml') || string?.includes('excel'))
    return { icon: 'fas fa-file-excel', color: '#73d609', name: 'Excel', docType: 'excel' }
  else if (string?.includes('presentationml') || string?.includes('powerpoint'))
    return { icon: 'fas fa-file-powerpoint', color: '#ff640a', name: 'PowerPoint', docType: 'powerpoint' }
  else if (string?.includes('pdf'))
    return { icon: 'fas fa-file-pdf', color: '#ff0a37', name: 'PDF', docType: 'pdf' }
  else if (string?.includes('audio'))
    return { icon: 'fas fa-music-alt', color: '#ff6c24', name: 'Audio', docType: 'none' }
  else if (string?.includes('image'))
    return { icon: 'fas fa-image', color: '#6c26ff', name: 'Image', docType: 'none' }
  else if (string?.includes('video'))
    return { icon: 'fas fa-video', color: '#a9cf00', name: 'Image', docType: 'none' }
  else if (string?.includes('zip-compressed'))
    return { icon: 'fas fa-file-archive', color: '#9fb8c4', name: 'Zip', docType: 'none' }
  else if (string?.includes('html'))
    return { icon: 'far fa-code', color: '#9fb8c4', name: 'HTML', docType: 'none' }
  else
    return { icon: 'fas fa-file-alt', color: '#9fb8c4', name: 'Other', docType: 'none' }
}

export const fileTypePathConverter = (string) => {
  if (string?.includes('zip'))
    return 'other'
  else if (string?.includes('application'))
    return 'document'
  else if (string?.includes('audio'))
    return 'audio'
  else if (string?.includes('image'))
    return 'image'
  else if (string?.includes('video'))
    return 'video'
  else if (string?.includes('html'))
    return 'html'
  else
    return 'other'
}

export const uploadMultipleFilesLocal = (e, maxSize, maxFilesNum=20, setFiles, setLoading=setLoadingDef, setToasts) => {
  let files = e.target.files
  if(files.length > maxFilesNum) 
    return setToasts(infoToast(`You can only upload ${maxFilesNum} files at a time`))
  setLoading(true)
  for (let i = 0; i < files.length; i++) {
    if (files[i].size > maxSize) {
      setLoading(false)
      return setToasts(infoToast(`One or more of the uploaded files are too large. Max file size is ${(maxSize/1000000).toFixed(0)} MB`))
    }
  }
  let filesArray = []
  if (files) {
    for (let i = 0; i < files.length; i++) {
      filesArray.push(files[i])
    }
  }
  return Promise.all(filesArray.map(file => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader()
      reader.onloadend = function () {
        setLoading(false)
        resolve({ src: reader.result, file })
      }
      if (file) {
        reader.readAsDataURL(file)
      }
    })
  }))
    .then((files) => {
      setLoading(false)
      if (files) {
        if (files.length > 1)
          setFiles(prev => [...prev, ...files])
        else
          setFiles(prev => [...prev, files[0]])
      }
    })
    .catch(err => {
      setLoading(false)
      console.log(err)
    })
}

export const uploadFileLocal = (e, maxSize, setFile, setLoading = setLoadingDef, setToasts) => {
  setLoading(true)
  let file = e.target.files[0]
  if (file.size > maxSize) {
    setLoading(false)
    return setToasts(infoToast(`The uploaded file is too large. Max file size is ${maxSize / 1000000} MB`))
  }
  let reader = new FileReader()
  reader.onloadend = function () {
    setLoading(false)
    setFile({ src: reader.result, file })
  }
  if (file) {
    reader.readAsDataURL(file)
  }
}

export const isFileTypeImage = (file) => {
  return file?.type?.includes('image')
}

export const convertBytesToKbMbGb = (bytes, toFixedNum = 2) => {
  if (bytes < 1024) {
    return bytes + ' B'
  }
  else if (bytes < 1048576) {
    return (bytes / 1024).toFixed(toFixedNum) + 'KB'
  }
  else if (bytes < 1073741824) {
    return (bytes / 1048576).toFixed(toFixedNum) + 'MB'
  }
  else {
    return (bytes / 1073741824).toFixed(toFixedNum) + 'GB'
  }
}

export const getSizeOfAllFiles = (files) => {
  let totalSize = 0
  files.forEach(file => {
    totalSize += file.fileSize
  })
  return totalSize
}

export async function downloadUsingFetch(fileURL, fileName) {
  const res = await fetch(fileURL)
  const blob = await res.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
  window.URL.revokeObjectURL(url)
}

export async function downloadUsingFetchFromFile(file, fileName) {
  const url = window.URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
  window.URL.revokeObjectURL(url)
}

export const convertFilesToBase64 = (files) => {
  if(!files) return Promise.resolve([])
  return Promise.all(files.map((file, i) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        let encoded = reader.result.toString().replace(/^data:(.*,)?/, "")
        if (encoded.length % 4 > 0) {
          encoded += "=".repeat(4 - (encoded.length % 4))
        }
        resolve(encoded)
      }
      reader.onerror = (error) => reject(error)
    })
      .catch(err => console.log(err))
  }))
    .then((encodedFiles) => {
      console.log(encodedFiles)
      return encodedFiles
    })
    .catch(err => console.log(err))
}

export const convertDocToFileObject = (doc, filename) => {
  let file = new File([doc], doc.name || filename, { type: doc.type })
  return file
}

export const convertBase64ToFileObject = (base64, filename) => {
  let file = new File([base64], filename, { type: 'image/png' })
  return file
}

export const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = () => {
      let encoded = reader.result.toString().replace(/^data:(.*,)?/, "")
      if (encoded.length % 4 > 0) {
        encoded += "=".repeat(4 - (encoded.length % 4))
      }
      resolve(encoded)
    }
    reader.onerror = (error) => reject(error)
  })
}

export const compressImageService = (file, quality=50, format='webp') => {
  if(!file) return Promise.resolve([])
  fromBlob(file, quality, 0, 0, format)
  .then((blob) => {
    console.log('blob' , blob)
    return blob
  })
  .catch((err) => console.log(err))
}

export const compressImagesService = (files, quality=50, format='webp') => {
  if(files.length === 0) return Promise.resolve([])
  return Promise.all(files.map((file, i) => {
    return new Promise((resolve, reject) => {
      fromBlob(file, quality, 0, 0, format)
      .then((blob) => {
        const blobFile = new File([blob], file.name, { type: blob.type })
        resolve(blobFile)
      })
      .catch((err) => {
        console.log(err)
        reject(err)
      })
    })
  }))
  .then((blobs) => {
    return blobs
  })
  .catch((err) => console.log(err))
}