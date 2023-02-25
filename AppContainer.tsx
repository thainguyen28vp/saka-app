import React, { useEffect } from 'react'
// import { StyleSheet } from 'react-native';
// import { connect } from 'react-redux';
import AppNavigator from './app/navigation/AppNavigator'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Orientation from 'react-native-orientation'
import { useAppDispatch } from '@app/store'
import OneSignalUtil from '@app/utils/OneSignalUtils'
import { AppState, Linking } from 'react-native'
import reactotron from 'ReactotronConfig'
import { showMessages } from '@app/utils/GlobalAlertHelper'
import R from '@app/assets/R'
import { DEFAULT_PARAMS, RESULT_VNPAY } from '@app/config/Constants'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { MAIN_TAB, SCREEN_ROUTER_APP } from '@app/config/screenType'
import {
  ListProductSlice,
  requestListProductThunk,
} from '@app/screens/App/Product/slices/ListProductSlice'
import { requestListOrderThunk } from '@app/screens/App/Order/slices/OrderSlice'
import ToastShow from '@app/utils/ToastHelper'

// import OneSignalHelper from './app/utils/OneSignalHelper';

const AppContainer = () => {
  const Dispatch = useAppDispatch()
  useEffect(() => {
    Orientation.lockToPortrait()
    // CodePushUtil.getCodePushMetadata()
    // !__DEV__ && CodePushUtil.checkCodePushUpdate()
  }, [])
  useEffect(() => {
    OneSignalUtil.initialize(Dispatch)
  }, [Dispatch])
  useEffect(() => {
    Linking.addListener('url', handleOpenUrl)
    handleDeepLinkingRequests()

    return () => {
      Linking.removeEventListener('url', handleOpenUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  //npx uri-scheme open staka://success/12 --android
  const handleOpenUrl = (event: { url: string }) => {
    reactotron.log!('=2121212121212121====', { event })
    navigate(event?.url)
  }

  const handleDeepLinkingRequests = () => {
    Linking.getInitialURL()
      .then(url => {
        reactotron.log!('======url====', url)
        if (url) navigate(url)
      })
      .catch(error => console.log(error))
  }

  const navigate = (url: any) => {
    reactotron.log!('eventDeepLink', url)
    let payload = {
      page: 1,
      limit: 10,
      status: 0,
      type: 'PENDING',
    }
    if (url?.includes(RESULT_VNPAY.SUCCESS)) {
      const order_id = url.split('=')
      NavigationUtil.navigate(MAIN_TAB.ODER, { scrollToPending: Math.random() })
      Dispatch(requestListOrderThunk(payload))
      ToastShow('Thanh toán thành công')
      setTimeout(() => {
        if (!!Number(order_id[1])) {
          NavigationUtil.navigate(SCREEN_ROUTER_APP.ORDER_DETAIL, {
            id: order_id[1],
          })
        }
      }, 500)
    } else if (url?.includes(RESULT_VNPAY.FAILED)) {
      reactotron.log!('eventDeepLink-failed', url)
      const order_id = url.split('=')

      NavigationUtil.navigate(MAIN_TAB.ODER, { scrollToPending: Math.random() })
      Dispatch(requestListOrderThunk(payload))
      showMessages(R.strings().notification, 'Thanh toán thất bại', () => {})
      setTimeout(() => {
        if (!!Number(order_id[1])) {
          NavigationUtil.navigate(SCREEN_ROUTER_APP.ORDER_DETAIL, {
            id: order_id[1],
          })
        }
      }, 300)
    }
  }
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  )
}

export default AppContainer
function requestListOrder(payload: {
  order_status: number
  page: number
  limit: number
}): any {
  throw new Error('Function not implemented.')
}
