import { View, Text } from 'react-native'
import React from 'react'
import { Button } from '@app/components/Button/Button'
import styles from '../styles/NotiStyles'
import FastImage from 'react-native-fast-image'
import R from '@app/assets/R'
import { DF_NOTIFICATION, NOTIFICATION_TYPE_VIEW } from '@app/config/Constants'
import DateUtil from '@app/utils/DateUtil'
import { NotiItemProps } from '../model/Notification'
import reactotron from 'ReactotronConfig'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { requestReadNotification } from '@app/service/Network/notification/NotificationApi'
import { useAppDispatch } from '@app/store'
import { readNotification } from '../slice/NotificationSlice'
import { updateCountNotification } from '../utils/NotificationUtils'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { SCREEN_ROUTER, SCREEN_ROUTER_APP } from '@app/config/screenType'
import NOTIFICATION_ICON from '../constants/NotiType'
import { colors } from '@app/theme'

const NotiItem = ({ data, index }: any) => {
  console.log('====================================')
  console.log(NOTIFICATION_ICON[data.df_notification_id])
  console.log(data.df_notification_id)
  console.log('====================================')
  const Dispatch = useAppDispatch()
  const onPressNoti = () => {
    if (data.is_read == NOTIFICATION_TYPE_VIEW.NOT_VIEW) {
      callAPIHook({
        API: requestReadNotification,
        payload: { id: data.id },
        onSuccess: () => {
          updateCountNotification(Dispatch)
        },
      })
      Dispatch(readNotification(index))
    }

    switch (data.df_notification_id) {
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
        reactotron.log(data)
        return NavigationUtil.navigate(SCREEN_ROUTER_APP.ORDER_DETAIL, {
          id: data.data.order_id,
        })
      default:
        // NavigationUtil.navigate(SCREEN_ROUTER.MAIN, {
        //   screen: SCREEN_ROUTER_APP.HOME,
        // })
        break
    }
  }
  return (
    <Button
      onPress={onPressNoti}
      children={
        <View
          style={[
            styles.notiWrapper,
            NOTIFICATION_TYPE_VIEW.VIEWED == data.is_read && {
              backgroundColor: colors.white,
            },
          ]}
        >
          <Text style={styles.headerNoti}>{data.title}</Text>
          <Text style={styles.titleNoti}>{data.content}</Text>
          <View style={styles.typeNoti}>
            <View style={styles.iconNoti}>
              <FastImage
                source={NOTIFICATION_ICON[data.df_notification_id].icon}
                style={styles.icon}
                tintColor={colors.primary}
              />
              <Text style={styles.txtType}>
                {NOTIFICATION_ICON[data.df_notification_id].title}
              </Text>
            </View>
            <Text style={styles.txtTime}>
              {DateUtil.formatTimeDateUtc7(data.created_at)}
            </Text>
          </View>
        </View>
      }
    />
  )
}

export default NotiItem
