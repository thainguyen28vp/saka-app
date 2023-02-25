import { getListProduct } from '@app/service/Network/product/ProductApi'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import reactotron from 'reactotron-react-native'

export const requestListProductThunk = createAsyncThunk(
  'get/listProduct',
  async (payload: object) => {
    const res = await getListProduct(payload)
    return res
  }
)

export const ListProductSlice = createSlice({
  name: 'get/listProduct',
  initialState: {
    isLoading: true,
    error: false,
    success_message: '',
    data: [],
    listProductSelect: [],
    checkAll: false,
    productId: [],
    listProductDelete: [],
    listProductAdd: [],
    arrTemp: [],
    isLoadMore: false,
    isLastPage: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(requestListProductThunk.pending, (state, action) => {
      const { limit, page }: any = action.meta.arg
      state.isLoading = !state.data.length || page == 1
      state.isLoadMore = page > 1
      if (page == 1) {
        state.isLastPage = false
        state.data = []
      }
    })
    builder.addCase(requestListProductThunk.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = false
      state.isLoadMore = false
      state.isLastPage = action.payload.data?.length == 0
      const newData = [...state.data]
      state.data = newData.concat(action.payload.data)
      state.arrTemp = state.listProductSelect
      state.success_message = ' Success'
    })
    builder.addCase(requestListProductThunk.rejected, (state, action) => {
      state.isLoading = false
      state.error = true
      state.isLoadMore = false
      state.isLastPage = false
    })
  },
})
export const {} = ListProductSlice.actions

export default ListProductSlice.reducer
