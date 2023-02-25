import { DEFAULT_PARAMS } from '@app/config/Constants'
import AsyncStorageService from '@app/service/AsyncStorage/AsyncStorageService'
import { getCountNotification } from '@app/service/Network/notification/NotificationApi'
import { useAppDispatch } from '@app/store'
import { callAPIHook } from '@app/utils/CallApiHelper'
import reactotron from 'ReactotronConfig'
import { Dispatch } from 'redux'
import {
  clearNotifyCount,
  requestListNotificationThunk,
  setCountNotify,
} from '../slice/NotificationSlice'

export const updateCountNotification = async (Dispatch: Dispatch) => {
  const token = await AsyncStorageService.getToken()

  if (!!token) {
    callAPIHook({
      API: getCountNotification,
      onSuccess: res => {
        Dispatch(setCountNotify(res.data.count))
      },
    })
  }
}

export const refreshNotification = (Dispatch: any) => {
  const body = { page: DEFAULT_PARAMS.PAGE }

  Dispatch(requestListNotificationThunk({ body, loadOnTop: false }))
}

export const clearBadgeData = (Dispatch: Dispatch) => {
  Dispatch(clearNotifyCount())
}
