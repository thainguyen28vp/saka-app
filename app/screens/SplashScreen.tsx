import R from '@app/assets/R'
import { SCREEN_ROUTER } from '@app/config/screenType'
import AsyncStorageService from '@app/service/AsyncStorage/AsyncStorageService'
import { useAppDispatch } from '@app/store'
import { colors, dimensions, fonts, OS } from '@app/theme'
// import { SocketHelper } from '@app/utils/SocketHelper'
// import { SocketHelperLivestream } from '@app/utils/SocketHelperLivestream'
import React, { useEffect } from 'react'
import { ActivityIndicator, Text, View, StatusBar } from 'react-native'
import codePush from 'react-native-code-push'
import FastImage from 'react-native-fast-image'
import ProgressBar from 'react-native-progress/Bar'
import { connect } from 'react-redux'
import {
  clearInfoUser,
  requestUserThunk,
} from './App/Account/slice/AccountSlice'
import { clearNotifyCount } from './App/Notification/slice/NotificationSlice'
import { clearDataOrder } from './App/Order/slices/OrderSlice'
import {
  clearDataSliceCart,
  requestListCartThunk,
} from './App/Shop/slices/CartSlice'
// import { requestUserThunk } from './App/Account/slice/AccountSlice'
// import {
//   clearBadgeData,
//   updateCountCart,
//   updateCountChat,
//   updateCountNotification,
// } from './App/Notification/utils/NotificationUtils'

const { MAIN, AUTH } = SCREEN_ROUTER

const SplashScreen = (props: any) => {
  const Dispatch = useAppDispatch()
  const [isNeedUpdate, setIsNeedUpdate] = React.useState(false)
  const re_login = props.route?.params?.re_login
  const [progress, setProgress] = React.useState({
    receivedBytes: 0,
    totalBytes: 1,
  })
  const clearStore = async () => {
    const token = (await AsyncStorageService.getToken()) || ''
    if (!token) {
      Dispatch(clearDataSliceCart())
      Dispatch(clearInfoUser())
      Dispatch(clearDataOrder())
      Dispatch(clearNotifyCount())
    }
  }
  useEffect(() => {
    clearStore()
    setTimeout(() => {
      checkAccount()
    }, 500)
  }, [])

  const checkAccount = () => {
    if (re_login) {
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'LOGIN' }],
      })
    } else
      props.navigation.reset({
        index: 0,
        routes: [{ name: MAIN }],
      })
  }

  return (
    <FastImage
      source={R.images.img_splash}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'red',
      }}
      resizeMode={'cover'}
    >
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle="light-content"
      />
      {isNeedUpdate ? (
        <View style={{ marginTop: dimensions.height * 0.2 }}>
          <ProgressBar
            progress={progress.receivedBytes / progress.totalBytes}
            width={dimensions.width / 2}
            height={1.5}
            color={colors.primary}
          />
          <Text
            style={{
              ...fonts.semi_bold12,
              textAlign: 'center',
              marginVertical: 8,
              color: colors.primary,
            }}
            children={`Đang đồng bộ dữ liệu ${Math.round(
              (progress.receivedBytes / progress.totalBytes) * 100
            )}%`}
          />
        </View>
      ) : (
        <View style={{ position: 'absolute', bottom: 40 }}>
          <ActivityIndicator
            style={{ marginTop: 50 }}
            size={'large'}
            color={colors.primary}
          />
        </View>
      )}
    </FastImage>
  )
}

const mapStateToProps = (state: any) => ({})

const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen)
