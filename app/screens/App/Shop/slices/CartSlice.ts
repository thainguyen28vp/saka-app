import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getListCart } from '@app/service/Network/shop/ShopApi'
import { Stock, ProductPrice, Enterprise } from '../model/Cart'
import reactotron from 'ReactotronConfig'


let initialState = {
  isLoading: false,
  dialogLoading: false,
  error: false,
  data: [],
  totalPrice: 0,
  countCart: 0,
  isCheckAll: false,
  voucher_id: undefined,
  total_discount: 0,
}

export const requestListCartThunk = createAsyncThunk('cart', async () => {
  return await getListCart()
})

const calcTotalPrice = (data: any[] | undefined) => {
  // check product checked
  let total = 0
  data?.forEach(item => {
    if (!!item.isCheck) {
      total += item.price * item.quantity
    }
  })
  return total
}

export const CartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearDataSliceCart: state => {
     return initialState
    },
    clearVoucher: state => {
      state.data?.forEach((enter: any) => {
        enter.Stocks.forEach((stock: Stock) => {
          if (!!stock.voucher) {
            stock.voucher = {}
          }
        })
      })
    },
    setCountCart: (state, action) => {
      state.countCart = action.payload
    },
    cancelVoucher: state => {
      state.voucher_id = undefined
      state.total_discount = 0
    },
    addVoucher: (state, action) => {
      state.voucher_id = action.payload.voucher_id
    },
    changeTotalDiscount: (state, action) => {
      state.total_discount = action.payload.total_discount
    },
    checkStock: (state, action) => {
      // check self
      let enterprise = state.data?.find(
        item => item.id == action.payload.enter_id
      )

      var stock = enterprise.Stocks.find(
        (stock: Stock) => stock.id == action.payload.id
      )

      stock.isCheck = !stock.isCheck
      stock.voucher = stock.isCheck ? {} : undefined
      stock.ProductPrices.forEach((product: ProductPrice) => {
        product.isCheck = stock.isCheck
      })

      enterprise.isCheck = enterprise.Stocks.every((stock: Stock) =>
        stock.ProductPrices.every(product => product.isCheck == true)
      )

      // calc total price
      state.totalPrice = calcTotalPrice(state.data)
    },
    checkProduct: (state: any, action: any) => {
      let target = state.data?.find((item: any) => item.id == action.payload.id)
      target.isCheck = !target.isCheck
      if (!target.isCheck) state.isCheckAll = false
      if (target.isCheck) {
        let point = state.data?.find((item: any) => !item.isCheck)
        if (point?.isCheck == undefined) state.isCheckAll = true
      }

      // calc total price
      state.totalPrice = calcTotalPrice(state.data)
    },
    checkAll: (state: any, action: any) => {
      if (!action.payload.isCheckAll) {
        state.data.map((item: any) => {
          item.isCheck = true
        })
        state.isCheckAll = true
        state.totalPrice = calcTotalPrice(state.data)
        return
      }
      state.data.map((item: any) => {
        item.isCheck = false
      })
      state.isCheckAll = false
      state.totalPrice = calcTotalPrice(state.data)
    },
    checkEnterprise: (state: any, action: any) => {
      var target = state.data?.find((item: any) => item.id == action.payload)
      let check = !target.isCheck
      target.isCheck = check
      target.Stocks.forEach((stock: Stock) => {
        stock.isCheck = check
        stock.voucher = check ? {} : undefined
        stock.ProductPrices.forEach(product => {
          product.isCheck = check
        })
      })

      state.totalPrice = calcTotalPrice(state.data)
    },
    increaseQuantity: (state: any, action: any) => {
      let target = state.data?.find((item: any) => item.id == action.payload.id)
      target.quantity++

      // calc total price
      state.totalPrice = calcTotalPrice(state.data)
    },
    decreaseQuantity: (state: any, action: any) => {
      let target = state.data?.find((item: any) => item.id == action.payload.id)
      if (target.quantity == 1) {
        return
      }
      target.quantity--

      // calc total price
      state.totalPrice = calcTotalPrice(state.data)
    },
    deleteCartItem: (state, action) => {
      // find enterprise
      let enterprise: Enterprise = state.data?.find(
        (item: any) => item.id == action.payload.id
      )
      // logic
      state.data?.splice(state.data.indexOf(enterprise), 1)
      state.totalPrice = calcTotalPrice(state.data)
    },
    onChangePrice: (state, action) => {
      let target = state.data?.find((item: any) => item.id == action.payload.id)

      if (action.payload.quantity == '') {
        target.quantity = ''
      } else {
        target.quantity = Number(action.payload.quantity)
      }
      state.totalPrice = calcTotalPrice(state.data)
    },
  },
  extraReducers: builder => {
    // get list cart
    builder.addCase(requestListCartThunk.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(requestListCartThunk.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = false
      state.data = action.payload.data.cartItems.map(
        (item: any) =>
          (item = {
            ...item,
            isCheck: false,
          })
      )
      state.isCheckAll = false
      state.totalPrice = calcTotalPrice(state.data)
    })
    builder.addCase(requestListCartThunk.rejected, (state, action) => {
      state.isLoading = false
      state.error = true
    })
  },
})

export const {
  checkStock,
  checkProduct,
  checkEnterprise,
  increaseQuantity,
  decreaseQuantity,
  deleteCartItem,
  onChangePrice,
  addVoucher,
  cancelVoucher,
  setCountCart,
  clearVoucher,
  clearDataSliceCart,
  checkAll,
  changeTotalDiscount,
} = CartSlice.actions

export default CartSlice.reducer
