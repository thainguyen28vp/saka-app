import { getAccounts } from '@app/service/Network/account/AccountApi'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import reactotron from 'reactotron-react-native'

let initialState = {
  isLoading: false,
  dialogLoading: false,
  data: {},
  error: false,
}

export const requestUserThunk = createAsyncThunk('getAccount', async () => {
  return await getAccounts()
})

export const AccountSlice = createSlice({
  name: 'getAccount',
  initialState,
  reducers: {
    clearInfoUser: state => {
      return initialState
    },
  },
  extraReducers: builder => {
    builder.addCase(requestUserThunk.pending, (state, action) => {
      state.dialogLoading = true
      state.isLoading = true
    })
    builder.addCase(requestUserThunk.fulfilled, (state, action) => {
      state.isLoading = false
      state.dialogLoading = false
      state.error = false
      reactotron.log('action.payload.data.user', action.payload.data.user)
      state.data = action.payload.data.user
    })
    builder.addCase(requestUserThunk.rejected, (state, action) => {
      state.isLoading = false
      state.dialogLoading = false
      state.error = true
    })
  },
})

export const selectCount = (state: any) => state.account
export const { clearInfoUser } = AccountSlice.actions
export default AccountSlice.reducer
