import { ApiClient } from '@app/service/Network/ApiService'
import { SurveyUser } from './AccountPayload'

export const getAccounts = (payload?: any) =>
  ApiClient.get('/api/v1/user/session/me')

export const getListGift = (payload: any) =>
  ApiClient.get(`client/gift/owner`, { params: payload })

export const requestChangePassword = (payload: any) =>
  ApiClient.path(`/api/v1/user/session/me/password`, payload)

export const requestUpdateUserInfor = (payload: any) =>
  ApiClient.path(`/api/v1/user/session`, payload)

export const requestSurveyUser = (payload: SurveyUser) =>
  ApiClient.post(`/api/v1/user/mail/survey`, payload)

export const getListNews = (payload: any) =>
  ApiClient.get(`/api/v1/user/news`, { params: payload })
export const getNewsDetail = (payload: any) =>
  ApiClient.get(`/api/v1/user/news/${payload.id}`, { params: payload })
export const getPointTransactions = (payload: any) =>
  ApiClient.get(`/api/v1/user/wallet_history/point_transactions`, {
    params: payload,
  })
export const getPointCongNo = () =>
  ApiClient.get('/api/v1/user/order/get_payment_methods')
export const getListDebit = (payload: any) =>
  ApiClient.get('/api/v1/user/debit', { params: payload })
