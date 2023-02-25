// import { ENVIRONMENT } from './Constants';
import R from '@app/assets/R'

export const ENVIRONMENT = {
  DEV: {
    API_URL: 'https://dev.stakaapi.winds.vn',
  },
  PROD: {
    // API_URL: 'http://staging.stakaapi.winds.vn',
    API_URL: 'https://stakaapi.winds.vn',
  },
}
export const BASE_REQUEST = ENVIRONMENT['DEV']
// export const BASE_REQUEST = ENVIRONMENT['PROD']

export const ONESIGNAL_APP_ID = '112fe1a9-6031-4cc1-aa44-4c465bad326b'
export const ANDROID_CHANNEL_ID = '315548d0-472c-406a-b93c-f44e604977e6'

export const DEFAULT_PARAMS = {
  PAGE: 1,
  LIMIT: 20,
}

export const NEWS_STATUS = {
  POST: 1,
  DRAFT: 2,
}
export const NEWS_ACTIVE = {
  ACTIVE: 1,
  ENABLE: 0,
}
export const VOUCHER_ACTIVE = {
  ACTIVE: 1,
  ENABLE: 0,
}

export const NEWS_TYPE = {
  BANNER: 1,
  POLICY: 2,
  TUTORIAL: 3,
}
export const NOTIFICATION_TYPE = {
  PROMO: 1,
  ORDER: 2,
  POINT: 3,
  NEWS: 4,
}
export const RESULT_VNPAY = {
  SUCCESS: 'success',
  FAILED: 'failed',
}
export const PAYMENT_STATUS = {
  FAILED: 'failed',
  PENDING: 'pending',
  COMPLETED: 'completed',
}
export const PAYMENT_TYPE = {
  banking: {
    id: 1,
    title: 'Chuyển khoản',
    description: 'Chuyển khoản qua số tài khoản',
    icon: R.images.ic_payment_banking,
    alias: 'banking',
  },
  cod: {
    id: 2,
    title: 'Thanh toán khi nhận hàng',
    description: 'Thanh toán theo hình thức COD',
    icon: R.images.ic_payment_cod,
    alias: 'cod',
  },
  vnpay: {
    id: 3,
    title: 'VNpay',
    description: 'Thanh toán qua ví VNPAY',
    icon: R.images.ic_payment_vnpay,
    alias: 'vnpay',
  },
  debit: {
    id: 4,
    title: 'Công nợ',
    description: 'Công nợ khả dụng: 50.000đ',
    icon: R.images.ic_payment_cong_no,
    alias: 'debit',
  },
}
export const CALL_API_STATUS = {
  SUCCESS: 1, //thành công
}
export const VOUCHER_STATUS = {
  NOT_USE: {
    id: 0, // chưa sử dụng
    name: R.strings().not_use,
  },
  USED: {
    id: 1, // đã sư dụng
    name: R.strings().used,
  },
  EXPRIED: {
    id: 2, // đã hết hạn
    name: R.strings().expried,
  },
  NOT_TO_EXPIRY: {
    id: 3, // chưa tời ngày sử dụng
    name: R.strings().not_to_expiry,
  },
  NOT_EXPRIED: {
    id: 6, // chưa hết hạn
    name: R.strings().not_expried,
  },
  QUOTA_EXPRIED: {
    id: 4, // đã hết số lần sử dụng
    name: R.strings().quota_expried,
  },
  NOT_QUOTA_EXPRIED: {
    id: 5, // chưa hết số lần sử dụng
    name: R.strings().not_quota_expried,
  },
}
export const REWARD_TYPE = {
  GIFT: {
    id: 1,
    alias: 'Quà tặng',
  },
  DISCOUNT: {
    id: 2,
    alias: 'Chiết khấu',
  },
}
export const APPLICABLE_TYPE = {
  ORDER: {
    id: 1,
    alias: 'Áp dụng cho toàn bộ đơn hàng',
  },
  PRODUCT: {
    id: 2,
    alias: 'Áp dụng cho sản phẩm riêng lẻ',
  },
}
export const PRODUCT_ENABLE = {
  ORDER: {
    id: 1,
    alias: 'Áp dụng cho toàn bộ đơn hàng',
  },
  PRODUCT: {
    id: 2,
    alias: 'Áp dụng cho sản phẩm riêng lẻ',
  },
}
export const OS_KIND_ID = {
  IOS: 0,
  ANDROID: 1,
}

// trạng thái đơn hàng
export const ORDER_STATUS_TYPE = {
  PENDING: {
    id: 1,
    name: R.strings().pending,
    alias: 'PENDING',
  },
  CONFIRMED: {
    id: 2,
    name: R.strings().confirmed,
    alias: 'CONFIRMED',
  },
  COMPLETED: {
    id: 3,
    name: R.strings().completed,
    alias: 'COMPLETED',
  },
  CANCEL: {
    id: 4,
    name: R.strings().canceled,
    alias: 'CANCEL',
  },
}

export const FILTER_TYPE = {
  SELL_FAST: 1,
  SELL_FLASH: 2,
  PRICE_MAX_MIN: 1,
  PRICE_MIN_MAX: 2,
  TIME_NEW_OLD: 1,
  TIME_OLD_NEW: 2,
}

export const TYPE_ITEM = {
  LIST_PRODUCT: 1,
  LIST_PRODUCT_CART: 2,
  LIST_PRODUCT_SELL: 3,
}

export const MESSAGE_EVENT = {
  SEND_MESSAGE: 0,
  TYPING: 1,
  READ: 2,
}

export const USER_EVENT = {
  NEW_MESSAGE: 0,
  NEW_CHANNEL_MESSAGE: 1,
  NEW_NOTIFICATION: 2,
}

export const NOTIFICATION_TYPE_VIEW = {
  NOT_VIEW: 0,
  VIEWED: 1,
}

export const DF_NOTIFICATION = {
  ORDER_SHOP: 1, // trạng thái đơn hàng
  NEW_ORDER: 2, // có đơn hàng mới
  ORDER_INPROGRESS: 3, // xác nhận đơn hàng
  ORDER_COMPLETED: 4, // hoàn thành đơn hàng
  ORDER_CANCEL: 5, // hủy đơn hàng
  NEW_KIOTVIET_SYNC: 6, // đồng bộ gian hàng mới
  KIOTVIET_ACTIVE: 7, // active gian hàng
  KIOTVIET_SYNC_SUCCESS: 8, // đồng bộ gian hàng thành công
  KIOTIVET_SYNC_FAILURE: 9, // đồng bộ gian hàng thất bại
  OVERDUE_DEBT_PAYMENT: 10, // quá hạn thanh toán công nợ
  NEWS: 11, // bài viết mới
  ORDER_COMPLETION_ADD_POINT: 12, // cộng điểm hoàn thành đơn hàng
  ORDER_PAYMENT_SUBTRACT_POINT: 13, // trừ điểm thanh toán đơn hàng
  VOUCHER_EXPIRED: 14, // voucher hết hạn
  VOUCHER_OUT_OF_STOCK: 15, // voucher hết số lượng sử dụng
  ALL: 16, // thông báo tất cả
  VOUCHER_NEW: 17, // VOUHCER MOI
  NEW_USER_POINT: 18, // Cộng điểm KH mới
  SUBTRACT_POINT: 19, // Trừ điểm
}

export const ORDER_STATUS_TAB = {
  PENDING: 0,
  CONFIRMED: 1,
  DELIVERING: 2,
  COMPLETED: 3,
  CANCEL: 4,
}

export const GIFT_STATUS = {
  PENDING: 0,
  CONFIRMED: 1,
  CACELED: 2,
  USED: 3,
}

export const GIFT_TYPE = {
  GIFT: 1,
  DISCOUNT_CODE: 2,
}

export const TYPE_POINT_TRANSACTION_HISTORY = {
  ADD: 1,
  SUB: 0,
}

export const GIFT_OWNER_STATUS = {
  USED: 1,
  NOT_USED: 2,
}

export const CONFIG = {
  cameraConfig: {
    cameraId: 1,
    cameraFrontMirror: true,
  },
  videoConfig: {
    preset: 4,
    bitrate: 400000,
    profile: 2,
    fps: 30,
    videoFrontMirror: false,
  },
  audioConfig: {
    bitrate: 32000,
    profile: 1,
    samplerate: 44100,
  },
}

export const SOCKET_ON_MESSAGE_CHANNEL_EVENT = {
  SUBSCRIBE_MESSAGE_CHANNEL: `subscribe_message_channel`,
  UNSUBSCRIBE_MESSAGE_CHANNEL: `unsubscribe_message_channel`,
}
