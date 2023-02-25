import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getListProvince } from '@app/service/Network/default/DefaultApi'

let initialState = {
  dialogLoading: false,
  error: false,
  data: [],
}

export const requestGetListProvince = createAsyncThunk(
  'province',
  async payload => {
    return await getListProvince(payload)
  }
)

const ProvinceSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(requestGetListProvince.pending, (state, action) => {
      state.dialogLoading = true
    })
    builder.addCase(requestGetListProvince.fulfilled, (state, action) => {
      state.dialogLoading = false
      state.error = false
      state.data = action.payload.data
    })
    builder.addCase(requestGetListProvince.rejected, (state, action) => {
      state.dialogLoading = false
      state.error = true
    })
  },
})

export const {} = ProvinceSlice.actions

export default ProvinceSlice.reducer
