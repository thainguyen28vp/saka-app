import { ApiClient } from '../ApiService'

export const requestCreateNewOrder = (payload: any) =>
  ApiClient.post(`/api/v1/user/order`, payload)
///
export const getListOrder = (payload: any) =>
  ApiClient.get(`/api/v1/user/order`, { params: payload })
//
export const getOrderItemDetail = (payload: any) =>
  ApiClient.get(`/api/v1/user/order/${payload.order_id}`, payload)

export const requestCancelOrder = (payload: any) =>
  ApiClient.post(`/api/v1/user/order/${payload?.id}`, payload)
export const requestBankingInfo = () =>
  ApiClient.get(`/api/v1/user/config/bank`)
