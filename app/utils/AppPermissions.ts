import { PermissionsAndroid, Platform } from 'react-native'
import {
  check,
  openSettings,
  PERMISSIONS,
  RESULTS,
  request,
} from 'react-native-permissions'
import R from '@app/assets/R'
import reactotron from 'ReactotronConfig'
import { showConfirm, showMessages } from './GlobalAlertHelper'
export const requestPermissionCamera = (useVisible: any, isVisible: any) =>
  new Promise(async resolve => {
    await request(
      Platform.OS == 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA
    ).then(async result => {
      check(
        Platform.OS == 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA
      ).then(result => {
        if (result === RESULTS.GRANTED) resolve(true)
        else {
          isVisible && useVisible(!isVisible)
          showConfirm(
            '',
            'Bạn đã tắt quyền truy cập camera. Hãy vào cài đặt => quyền riêng tư => bật quyền truy cập camera',
            () => {
              openSettings()
            }
          )
        }
      })
    })
  })
export const requestPermissionLibrary = (useVisible: any, isVisible: any) =>
  new Promise(async resolve => {
    await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
    ).then(async () => {
      check(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
      ).then(result => {
        //reactotron.log(result)
        if (result === RESULTS.GRANTED) resolve(true)
        else {
          isVisible && useVisible(!isVisible)
          showConfirm(
            '',
            'Bạn đã tắt quyền truy cập thư viện ảnh. Hãy vào cài đặt => quyền riêng tư => bật quyền truy cập thư viện ảnh',
            () => {
              openSettings()
            }
          )
        }
      })
      // if (Platform.OS == 'ios') {

      // } else {
      //   const granted = await PermissionsAndroid.request(
      //     PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      //     {
      //       title: R.strings().noti,
      //       message: 'Cho phép truy cập thư viện ảnh để sử dụng tính năng này',
      //       buttonPositive: 'OK',
      //     }
      //   )
      //   granted != PermissionsAndroid.RESULTS.BLOCKED
      //     ? resolve(true)
      //     : resolve(false)
      // }
    })
  })
