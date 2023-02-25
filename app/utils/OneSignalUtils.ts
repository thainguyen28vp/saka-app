import { SCREEN_ROUTER, SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import OneSignal from 'react-native-onesignal'
import reactotron from 'ReactotronConfig'
import { ONESIGNAL_APP_ID, DF_NOTIFICATION } from '@app/config/Constants'
import { Dispatch } from 'redux'
import {
  refreshNotification,
  updateCountNotification,
} from '@app/screens/App/Notification/utils/NotificationUtils'
import AsyncStorageService from '@app/service/AsyncStorage/AsyncStorageService'
import { changeUploadOrder } from '@app/screens/App/Order/utils/OrderUtils'
// import {
//   refreshNotification,
//   updateCountChat,
//   updateCountNotification,
// } from '@app/screens/App/Notification/utils/NotificationUtils'

export default abstract class OneSignalUtil {
  private static Dispatch: Dispatch

  static initialize(Dispatch: Dispatch) {
    this.Dispatch = Dispatch
    OneSignal.setLogLevel(6, 0)
    OneSignal.setAppId(ONESIGNAL_APP_ID)
  }

  static onPushNotification() {
    //Prompt for push on iOS
    OneSignal.promptForPushNotificationsWithUserResponse(response => {
      // console.log('Prompt response:', response)
    })
    //Method for handling notifications received while app in foreground
    OneSignal.setNotificationWillShowInForegroundHandler(
      notificationReceivedEvent => {
        let notification = notificationReceivedEvent.getNotification()
        this.onShow(notification)
        notificationReceivedEvent.complete(notification)
      }
    )

    //Method for handling notifications opened
    OneSignal.setNotificationOpenedHandler(notification => {
      this.onOpened(notification)
    })
  }

  static onShow = async (notification: any) => {
    updateCountNotification(this.Dispatch)
    let type = notification.additionalData.df_notification_id
    reactotron.log!('type id noti', type)
    if (type)
      switch (type) {
        case DF_NOTIFICATION.ORDER_SHOP:
        case DF_NOTIFICATION.NEW_ORDER:
        case DF_NOTIFICATION.ORDER_INPROGRESS:
        case DF_NOTIFICATION.ORDER_COMPLETED:
        case DF_NOTIFICATION.ORDER_CANCEL:
          changeUploadOrder(this.Dispatch, type)
          break
        // return updateCountChat(this.Dispatch)
        default:
          break
      }
  }

  static onOpened = ({ notification }: any) => {
    let data = notification.additionalData
    let type = data?.df_notification_id
    switch (type) {
      case DF_NOTIFICATION.NEWS:
        return NavigationUtil.navigate(SCREEN_ROUTER_APP.NEWS_DETAIL, {
          id: data.data.id,
        })
      case DF_NOTIFICATION.ORDER_COMPLETION_ADD_POINT:
      case DF_NOTIFICATION.ORDER_PAYMENT_SUBTRACT_POINT:
        return NavigationUtil.navigate(SCREEN_ROUTER_APP.POINT)
      case DF_NOTIFICATION.VOUCHER_EXPIRED:
      case DF_NOTIFICATION.VOUCHER_OUT_OF_STOCK:
      case DF_NOTIFICATION.VOUCHER_NEW:
        return NavigationUtil.navigate(SCREEN_ROUTER_APP.VOUCHER)
      case DF_NOTIFICATION.ORDER_SHOP:
      case DF_NOTIFICATION.NEW_ORDER:
      case DF_NOTIFICATION.ORDER_INPROGRESS:
      case DF_NOTIFICATION.ORDER_COMPLETED:
      case DF_NOTIFICATION.ORDER_CANCEL:
        return NavigationUtil.navigate(SCREEN_ROUTER_APP.ORDER_DETAIL, {
          id: data.data.order_id,
        })
      case DF_NOTIFICATION.ALL:
        return NavigationUtil.navigate(SCREEN_ROUTER_APP.NOTIFICATION)
      default:
        NavigationUtil.navigate(SCREEN_ROUTER.MAIN, {
          screen: SCREEN_ROUTER_APP.HOME,
        })
        break
    }
  }
}
