import { PermissionsAndroid, Platform } from 'react-native'
import RNFetchBlob from 'rn-fetch-blob'
import { CameraRoll } from '@react-native-camera-roll/camera-roll'
import ToastShow from './ToastHelper'
import R from '@app/assets/R'
import { openSettings } from 'react-native-permissions'
import { requestPermissionLibrary } from './AppPermissions'
import reactotron from 'ReactotronConfig'

const downloadImage = (url: string) => {
  let date = new Date()
  let image_url = url
  let ext = getExtention(image_url)
  ext = '.' + ext[0]

  const { config, fs } = RNFetchBlob
  let pictureDir =
    Platform.OS === 'ios' ? fs.dirs['MainBundleDir'] : fs.dirs.PictureDir
  let options = {
    fileCache: true,
    path:
      pictureDir +
      '/image_' +
      Math.floor(date.getTime() + date.getSeconds() / 2) +
      ext,
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      path:
        pictureDir +
        '/image_' +
        Math.floor(date.getTime() + date.getSeconds() / 2) +
        ext,
      description: 'Image',
    },
  }
  config(options)
    .fetch('GET', image_url)
    .then(res => {
      if (Platform.OS === 'ios') {
        // RNFetchBlob.ios.previewDocument(res.data)
        // reactotron.log(res.data)
        reactotron.log('91101')
        CameraRoll.save(res.data)
          .then(result => reactotron.log(result))
          .catch(err => reactotron.log(err))
      }
      ToastShow(R.strings().download_image_successfully)
    })
}
const getExtention = (file_name: string) => {
  return /[.]/.exec(file_name) ? /[^.]+$/.exec(file_name) : undefined
}
const downloadImageHelper = async (image_url: string) => {
  await requestPermissionLibrary().then(result => {
    if (result) downloadImage(image_url)
    else openSettings()
  })
}
export default downloadImageHelper
