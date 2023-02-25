import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getPointVoucherUser } from '@app/service/Network/home/HomeApi'
import AsyncStorageService from '@app/service/AsyncStorage/AsyncStorageService'

let initialState = {
  dialogLoading: false,
  error: false,
  data: {
    voucher_count: 0,
    point: 0,
  },
}

export const requestGetPointVoucher = createAsyncThunk(
  'pointVoucher',
  async payload => {
    return await getPointVoucherUser()
  }
)

const PointVoucherSlice = createSlice({
  name: 'pointVoucherUser',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(requestGetPointVoucher.pending, (state, action) => {
      state.dialogLoading = true
    })
    builder.addCase(requestGetPointVoucher.fulfilled, (state, action) => {
      state.dialogLoading = false
      state.error = false
      state.data = action.payload.data
    })
    builder.addCase(requestGetPointVoucher.rejected, (state, action) => {
      state.dialogLoading = false
      state.error = true
    })
  },
})

export const {} = PointVoucherSlice.actions

export default PointVoucherSlice.reducer
