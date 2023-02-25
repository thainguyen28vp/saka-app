import { ApiClient } from '../ApiService'

export const getListNotification = (payload: any) =>
  ApiClient.get(`/api/v1/notification`, { params: payload })

export const requestReadNotification = (payload: any) =>
  ApiClient.put(`/api/v1/notification/${payload.id}`, payload)

export const getCountNotification = () =>
  ApiClient.get(`/api/v1/notification/count-noti`)
export const requestReadAll = () =>
  ApiClient.put(`/api/v1/notification/mark-as-read-all`)
