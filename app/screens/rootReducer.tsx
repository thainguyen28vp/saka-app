import AccountSlice from './App/Account/slice/AccountSlice'
import PointSlice from './App/Account/slice/PointSlice'
import PointVoucherSlice from './App/Home/slice/PointVoucherSlice'
import ProvinceSlice from './App/Home/slice/ProvinceSlice'
import NotificationSlice from './App/Notification/slice/NotificationSlice'
import OrderSlice from './App/Order/slices/OrderSlice'
import FilterSlice from './App/Product/slices/FilterSlice'
import ListProductSlice from './App/Product/slices/ListProductSlice'
import CartSlice from './App/Shop/slices/CartSlice'

const rootReducer = {
  listProductReducer: ListProductSlice,
  cartReducer: CartSlice,
  accountReducer: AccountSlice,
  provinceReducer: ProvinceSlice,
  orderReducer: OrderSlice,
  filterReducer: FilterSlice,
  pointVoucherReducer: PointVoucherSlice,
  notificationReducer: NotificationSlice,
  pointReducer: PointSlice,
}

export default rootReducer
