import { ApiClient } from '../ApiService'

export const getListProduct = (payload?: any) =>
  ApiClient.get(`/api/v1/user/product`, { params: payload })
export const requestProductRelated = (payload?: any) =>
  ApiClient.get(`/api/v1/user/product/related`, { params: payload })
export const requestGetCategory = (payload?: any) =>
  ApiClient.get(`/api/v1/user/product_category`, { params: payload })
export const getProductDetail = (payload: any) =>
  ApiClient.get(`/api/v1/user/product/${payload.product_id}`, payload)
export const requestAddToCart = (payload?: any) =>
  ApiClient.post(`/api/v1/u/cart`, payload)
export const requestCheckStockBuyNow = (payload?: any) =>
  ApiClient.post(`/api/v1/user/order/check_stock_buy_now`, payload)
