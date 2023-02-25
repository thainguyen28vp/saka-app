import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import reactotron from 'reactotron-react-native'
import { DEFAULT_PARAMS } from '@app/config/Constants'
import { PointSliceProps } from '../model/NewsModules'
import { getPointTransactions } from '@app/service/Network/account/AccountApi'

let initialState: PointSliceProps = {
  isLoading: false,
  error: false,
  isLoadMore: false,
  isLastPage: false,
  data: [],
  total_point: 0,
}

export const requestListPointThunk = createAsyncThunk(
  'point',
  async (payload: any) => {
    return await getPointTransactions(payload.body)
  }
)

export const PointSlice = createSlice({
  name: 'point',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(requestListPointThunk.pending, (state, action) => {
      if (!action.meta.arg.loadOnTop) {
        if (action.meta.arg.body.page == DEFAULT_PARAMS.PAGE) {
          state.isLoading = true
        } else {
          state.isLoadMore = true
        }
      }
    })
    builder.addCase(requestListPointThunk.fulfilled, (state, action) => {
      state.error = false
      state.total_point = action.payload.data.total_point
      if (
        action.meta.arg.body.page == DEFAULT_PARAMS.PAGE ||
        action.meta.arg.loadOnTop
      ) {
        state.isLoading = false
        state.data = action.payload.data.transactions
        state.isLastPage = false
      } else {
        state.isLoadMore = false
        if (!!action.payload.data.transactions.length) {
          state.data = [...state.data, ...action.payload.data.transactions]
        } else {
          state.isLastPage = true
        }
      }
    })
    builder.addCase(requestListPointThunk.rejected, (state, action) => {
      if (action.meta.arg.page == DEFAULT_PARAMS.PAGE) {
        state.isLoading = false
      } else {
        state.isLoadMore = false
      }
      state.isLoading = false
      state.error = true
    })
  },
})

// export const { readNotification, setCountNotify, clearNotifyCount } =
//   PointSlice.actions

export default PointSlice.reducer
