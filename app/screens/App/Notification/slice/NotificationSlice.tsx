import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import reactotron from 'reactotron-react-native'
import { getListNotification } from '@app/service/Network/notification/NotificationApi'
import { DEFAULT_PARAMS, NOTIFICATION_TYPE_VIEW } from '@app/config/Constants'
import { NotiSliceProps } from '../model/Notification'

let initialState: NotiSliceProps = {
  isLoading: false,
  error: false,
  isLoadMore: false,
  isLastPage: false,
  data: [],
  countNotification: 0,
}

export const requestListNotificationThunk = createAsyncThunk(
  'notification',
  async (payload: any) => {
    return await getListNotification(payload.body)
  }
)

export const NotificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    readNotification: (state, action) => {
      state.data[action.payload].is_read = NOTIFICATION_TYPE_VIEW.VIEWED
    },
    setCountNotify: (state, action) => {
      state.countNotification = action.payload
    },
    clearNotifyCount: state => {
      state.countNotification = 0
    },
    readAllNoti: state => {
      state.data.forEach(item => {
        item.is_read = NOTIFICATION_TYPE_VIEW.VIEWED
      })
    },
  },
  extraReducers: builder => {
    builder.addCase(requestListNotificationThunk.pending, (state, action) => {
      if (!action.meta.arg.loadOnTop) {
        if (action.meta.arg.body.page == DEFAULT_PARAMS.PAGE) {
          state.isLoading = true
        } else {
          state.isLoadMore = true
        }
      }
    })
    builder.addCase(requestListNotificationThunk.fulfilled, (state, action) => {
      state.error = false

      if (
        action.meta.arg.body.page == DEFAULT_PARAMS.PAGE ||
        action.meta.arg.loadOnTop
      ) {
        state.isLoading = false
        state.data = action.payload.data
        state.isLastPage = false
      } else {
        state.isLoadMore = false
        if (!!action.payload.data.length) {
          state.data = [...state.data, ...action.payload.data]
        } else {
          state.isLastPage = true
        }
      }
    })
    builder.addCase(requestListNotificationThunk.rejected, (state, action) => {
      if (action.meta.arg.page == DEFAULT_PARAMS.PAGE) {
        state.isLoading = false
      } else {
        state.isLoadMore = false
      }
      state.error = true
    })
  },
})

export const {
  readNotification,
  setCountNotify,
  clearNotifyCount,
  readAllNoti,
} = NotificationSlice.actions

export default NotificationSlice.reducer
