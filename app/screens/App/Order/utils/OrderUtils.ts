import { DF_NOTIFICATION, ORDER_STATUS_TYPE } from '@app/config/Constants'
import AsyncStorageService from '@app/service/AsyncStorage/AsyncStorageService'
import reactotron from 'ReactotronConfig'
import { Dispatch } from 'redux'
import {
  requestListOrderThunk,
  updateLoadedOrderAll,
} from '../slices/OrderSlice'
const STATUS = [
  ORDER_STATUS_TYPE.PENDING,
  ORDER_STATUS_TYPE.CONFIRMED,
  ORDER_STATUS_TYPE.COMPLETED,
  ORDER_STATUS_TYPE.CANCEL,
]
export const changeUploadOrder = async (Dispatch: Dispatch, type: number) => {
  const token = await AsyncStorageService.getToken()
  if (!!token) {
    Dispatch(updateLoadedOrderAll())
    const changeData = (tabIndex: number) => {
      return {
        page: 1,
        limit: 10,
        status: tabIndex,
        type: STATUS[tabIndex].alias,
      }
    }
    let payload1 = changeData(0)
    let payload2 = changeData(1)
    let payload3 = changeData(2)
    let payload4 = changeData(3)
    Dispatch(requestListOrderThunk(payload1))
    Dispatch(requestListOrderThunk(payload2))
    Dispatch(requestListOrderThunk(payload3))
    Dispatch(requestListOrderThunk(payload4))
    // switch (type) {
    //   case DF_NOTIFICATION.NEW_ORDER:
    //  let   payload = changeData(0)
    //     Dispatch(requestListOrderThunk(payload))
    //     break
    //   case DF_NOTIFICATION.ORDER_INPROGRESS:

    //     break
    //   case DF_NOTIFICATION.ORDER_COMPLETED:
    //     payload = changeData(2)
    //     break
    //   case DF_NOTIFICATION.ORDER_CANCEL:
    //     payload = changeData(3)
    //     break
    //   default:
    //     payload = changeData(0)
    //     break
    // }

    // // reactotron.log('lalala', payload)
    // Dispatch(requestListOrderThunk(payload))
  }
}
