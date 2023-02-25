import { ApiClient } from '../ApiService'

export const getProductSaleOff = (payload: any) =>
  ApiClient.get(`api/v1/user/product`, {
    params: { custom_type: 'is_sale_off', limit: 5, ...payload },
  })
export const getProductFlashSale = (payload: any) =>
  ApiClient.get(`api/v1/user/product`, {
    params: {
      custom_type: 'is_best_selling',
      limit: 5,
      ...payload,
    },
  })
export const requestCreateAnonymousAccount = (payload: any) =>
  ApiClient.post(`api/v1/user/session/create_anonymous_account`, payload)
export const getPointVoucherUser = () => ApiClient.get(`api/v1/user/home`)
export const requestInfoSuport = () =>
  ApiClient.get(`api/v1/user/config/contact`)
