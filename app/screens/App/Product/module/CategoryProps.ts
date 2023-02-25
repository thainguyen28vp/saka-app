export default interface CategoryProps {
  id: number
  kiotviet_product_category_id: number
  kiotviet_id: number
  code: any
  parent_id: any
  description: any
  image: any
  name: string
  status: number
  order: number
  deleted_at: any
  created_at: Date
  updated_at: Date
  createdAt: Date
  updatedAt: Date
  deletedAt: any
  list_child: ListChild[]
}
interface ListChild {
  category_id: number
  parent_id: number
  status: number
  name: string
}
