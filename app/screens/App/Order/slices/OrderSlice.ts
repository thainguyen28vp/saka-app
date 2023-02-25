import { getListOrder } from '@app/service/Network/order/OrderApi'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import reactotron from 'reactotron-react-native'
export const requestListProductThunk = createAsyncThunk(
  'get/listProduct',
  async (payload: object) => {
    const res = await getListOrder(payload)
    return res
  }
)

interface IInitialState {
  PENDING: any
  CONFIRMED: any
  COMPLETED: any
  CANCEL: any
}

type TYPE_STATE = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCEL'

const initialState = {
  PENDING: {
    data: [],
    isLoading: false,
    error: null,
    loaded: false,
    count: 0,
    isLoadMore: false,
    isLastPage: false,
    page: 1,
  },
  CONFIRMED: {
    data: [],
    isLoading: false,
    error: null,
    loaded: false,
    count: 0,
    isLoadMore: false,
    isLastPage: false,
    page: 1,
  },
  COMPLETED: {
    data: [],
    isLoading: false,
    error: null,
    loaded: false,
    count: 0,
    isLoadMore: false,
    isLastPage: false,
    page: 1,
  },
  CANCEL: {
    data: [],
    isLoading: false,
    error: null,
    loaded: false,
    count: 0,
    isLoadMore: false,
    isLastPage: false,
    page: 1,
  },
}

export const handlePayload = (status: number) => {
  switch (status) {
    case 0:
      return 'wait_confirmation'
    case 1:
      return 'inprogress'
    case 2:
      return 'completed'
    case 3:
      return 'cancelled'
    default:
      break
  }
}

export const requestListOrderThunk: any = createAsyncThunk(
  'order',
  async (payload: any) => {
    const page = payload?.page
    const limit = payload?.limit
    const status = handlePayload(payload.status)
    return await getListOrder({ status, page, limit })
  }
)
export const ListProductSlice = createSlice({
  name: 'get/listProduct',
  initialState,
  reducers: {
    updateLoadedOrder: (state: IInitialState, action) => {
      const type: TYPE_STATE = action.payload?.type
      state[type].loaded = false
    },
    updateLoadedOrderAll: (state: IInitialState) => {
      state['CANCEL'].loaded = false
      state['COMPLETED'].loaded = false
      state['CONFIRMED'].loaded = false
      state['PENDING'].loaded = false
    },
    updatePageOrder: (state: IInitialState, action) => {
      const type: TYPE_STATE = action.payload?.type
      if (!state[type].isLastPage) state[type].page += 1
    },
    clearDataOrder: () => {
      return initialState
    },
  },
  extraReducers: {
    [requestListOrderThunk.pending]: (state: IInitialState, action) => {
      const type: TYPE_STATE = action.meta.arg?.type || ''
      const page = action.meta.arg?.page || ''
      state[type].isLoading = !state[type].data.length || page === 1
      state[type].isLoadMore = page > 1
      state[type].page = page
      if (page == 1) {
        state[type].isLastPage = false
        state[type].data = []
      }
    },
    [requestListOrderThunk.rejected]: (state: IInitialState, action) => {
      const type: TYPE_STATE = action.meta.arg?.type || ''
      state[type].isLoading = false
      state[type].error = true
      state[type].isLoadMore = false
      state[type].isLastPage = false
    },
    [requestListOrderThunk.fulfilled]: (state: IInitialState, action) => {
      const type: TYPE_STATE = action.meta.arg?.type || ''
      const dataOrder = action.payload?.data?.orders
      state[type].isLoading = false
      state[type].loaded = true
      // state[type].data = action.payload?.data?.orders || []
      const newData = [...state[type].data]
      state[type].data = newData.concat(dataOrder || [])
      state['PENDING'].count =
        action.payload?.data?.couting?.wait_confirmation || 0
      state['CONFIRMED'].count = action.payload?.data?.couting?.inprogress || 0
      state['COMPLETED'].count = action.payload?.data?.couting?.completed || 0
      state['CANCEL'].count = action.payload?.data?.couting?.cancelled || 0
      state[type].error = false
      state[type].isLoadMore = false
      state[type].isLastPage = dataOrder.length == 0
    },
  },
})
export const {
  updateLoadedOrder,
  updatePageOrder,
  clearDataOrder,
  updateLoadedOrderAll,
} = ListProductSlice.actions

export default ListProductSlice.reducer
