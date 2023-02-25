export interface NotiSliceProps {
  isLoading: boolean
  error: boolean
  isLoadMore: boolean
  isLastPage: boolean
  countNotification: number
  data: NotiItemProps[]
}

export interface NotiItemProps {
  id: number
  account_id: number
  target: string
  title: string
  content: string
  is_read: number
  url: null
  data: Data
  df_notification_id: number
  is_push: number
  is_active: number
  created_at: Date
  updated_at: Date
}

interface Data {
  id: number
}
