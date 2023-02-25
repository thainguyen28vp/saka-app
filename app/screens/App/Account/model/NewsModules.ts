export interface NewsDetailProps {
  image?: string
  id: number
  kiotviet_id: number
  title: string
  status: number
  status_active: number
  notification_customer: number
  type: number
  content: string
  created_at: Date
  updated_at: Date
  deleted_at: null
  createdAt: Date
  updatedAt: Date
  version: number
  kiotviet: any
}
export interface PointSliceProps {
  isLoading: boolean
  error: boolean
  isLoadMore: boolean
  isLastPage: boolean
  total_point: number
  data: PointItem[]
}
interface PointItem {
  id: number
  wallet_id: number
  wallet_type: string
  value: number
  type: string
  current_balance: number
  note: string
  mutable_type: string
  mutable_id: number
  deleted_at: null
  created_at: Date
  updated_at: Date
  createdAt: Date
  updatedAt: Date
  deletedAt: null
}
