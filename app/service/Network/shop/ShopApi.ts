import { ApiClient } from '../ApiService'

export const getListCart = () => ApiClient.get(`/api/v1/u/cart`, {})

export const requestCountCart = (payload?: any) =>
  ApiClient.get(`user-cart/count-cart`, payload)

export const requestDeleteAllCartItem = () =>
  ApiClient.delete(`/api/v1/u/cart/clear`, {})

export const requestDeleteCartItem = (payload: any) =>
  ApiClient.delete(`/api/v1/u/cart/${payload.id}`, payload)

export const requestEditCartItem = (payload: any) =>
  ApiClient.path(`api/v1/u/cart/${payload.id}/change_quantity`, payload.body)

export const getDefaultCustomerInfor = (payload: any) =>
  ApiClient.get(`client/user-address/default-shop`, payload)

export const requestApplyVoucher = (payload: any) =>
  ApiClient.post('/api/v1/user/voucher', payload)

export const getListVoucher = (payload: any) =>
  ApiClient.get('/api/v1/user/voucher', { params: payload })

export const getListVoucherNoParams = () =>
  ApiClient.get('/api/v1/user/voucher/list')

export const requestAddNewReceiver = (payload: any) =>
  ApiClient.post(`/api/v1/u/address_book`, payload)

export const getReceiverInfor = (payload: any) =>
  ApiClient.get(`client/user-address/${payload.id}`, payload)

export const requestEditReceiver = (payload: any) =>
  ApiClient.put(`/api/v1/u/address_book/${payload.id}`, payload.body)

export const getListReceiver = (payload: any) =>
  ApiClient.get(`/api/v1/u/address_book`, { params: payload })

export const requestDeleteUserAddress = (id: any) =>
  ApiClient.delete(`/api/v1/u/address_book/${id}`)

export const requestCreateUrlVnpay = (payload: any) =>
  ApiClient.post(`/api/v1/user/vnpay/create_payment_url`, payload)
export const requestCheckStockBuy = (payload: any) =>
  ApiClient.post(`/api/v1/user/order/check_stock_buy`, payload)
