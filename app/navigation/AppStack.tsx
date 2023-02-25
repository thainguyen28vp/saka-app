import MediaViewer from '@app/components/MediaSwiper/RNMediaViewer'
import { SCREEN_ROUTER_APP, SCREEN_ROUTER_AUTH } from '@app/config/screenType'
import AccountScreen from '@app/screens/App/Account/AccountScreen'
import ChangePasswordScreen from '@app/screens/App/Account/ChangePasswordScreen'
import DebitScreen from '@app/screens/App/Account/DebitScreen'
import NewsDetailScreen from '@app/screens/App/Account/NewsDetailScreen'
import NewsScreen from '@app/screens/App/Account/NewsScreen'
import PointScreen from '@app/screens/App/Account/PointScreen'
import SurveyScreen from '@app/screens/App/Account/SurveyScreen'
import UpdateUserInforScreen from '@app/screens/App/Account/UpdateUserInforScreen'
import HomeScreen from '@app/screens/App/Home/HomeScreen'
import NotificationScreen from '@app/screens/App/Notification/NotificationScreen'
import OrderDetailScreen from '@app/screens/App/Order/OrderDetailScreen'
import OrderScreen from '@app/screens/App/Order/OrderScreen'
import FilterSearch from '@app/screens/App/Product/FilterSearchScreen'
import ProductDetailScreen from '@app/screens/App/Product/ProductDetailScreen'
import ProductScreen from '@app/screens/App/Product/ProductScreen'
import CartScreen from '@app/screens/App/Shop/CartScreen'
import EditReceiverInforScreen from '@app/screens/App/Shop/EditReceiverInforScreen'
import PaymentScreen from '@app/screens/App/Shop/PaymentScreen'
import PaymentTypeScreen from '@app/screens/App/Shop/PaymentTypeScreen'
import SelectReceiverScreen from '@app/screens/App/Shop/SelectReceiverScreen'
import VoucherDetailScreen from '@app/screens/App/Shop/VoucherDetailScreen'
import VoucherScreen from '@app/screens/App/Shop/VoucherScreen'
import LoginScreen from '@app/screens/Auth/LoginScreen'
import PasswordScreen from '@app/screens/Auth/PasswordScreen'
import ProvinceLoginScreen from '@app/screens/Auth/ProvinceLoginScreen'
import SupportScreen from '@app/screens/Auth/SupportScreen'
// import RegisterScreen from '@app/screens/Auth/RegisterScreen'
import SplashScreen from '@app/screens/SplashScreen'
import {
  createStackNavigator,
  StackCardInterpolationProps,
} from '@react-navigation/stack'
import React from 'react'

const MainStack = createStackNavigator()
const AuthStack = createStackNavigator()

const {
  SPLASH,
  LOGIN,
  SUPPORT,
  //   FORGOT_PASS,
  //   OTP,
  //   UPDATE_PASS,
  //   LIST_SHOP_FOLLOW,
  PASSWORD,
  PROVINCE_LOGIN,
} = SCREEN_ROUTER_AUTH

const {
  HOME,
  PRODUCT,
  PRODUCT_DETAIL,
  ACCOUNT,
  ORDER,
  MEDIA_VIEWER,
  CART,
  PAYMENT,
  VOUCHER,
  SELECT_RECEIVER,
  RECEIVER_EDIT,
  CHANGE_PASS,
  ORDER_DETAIL,
  FILTER_SEARCH,
  VOUCHER_DETAIL,
  PAYMENT_TYPE,
  USER_INFO,
  NEWS,
  NEWS_DETAIL,
  SURVEY,
  POINT,
  DEBIT,
  NOTIFICATION,
} = SCREEN_ROUTER_APP

const AUTH_STACK = {
  [SPLASH]: SplashScreen,
  [LOGIN]: LoginScreen,
  [SUPPORT]: SupportScreen,
  [PASSWORD]: PasswordScreen,
  [PROVINCE_LOGIN]: ProvinceLoginScreen,
}

const APP_STACK = {
  [HOME]: HomeScreen,
  [PRODUCT]: ProductScreen,
  [ORDER]: OrderScreen,
  [ACCOUNT]: AccountScreen,
  [PRODUCT_DETAIL]: ProductDetailScreen,
  [MEDIA_VIEWER]: MediaViewer,
  [CART]: CartScreen,
  [PAYMENT]: PaymentScreen,
  [VOUCHER]: VoucherScreen,
  [SELECT_RECEIVER]: SelectReceiverScreen,
  [RECEIVER_EDIT]: EditReceiverInforScreen,
  [CHANGE_PASS]: ChangePasswordScreen,
  [ORDER_DETAIL]: OrderDetailScreen,
  [FILTER_SEARCH]: FilterSearch,
  [VOUCHER_DETAIL]: VoucherDetailScreen,
  [PAYMENT_TYPE]: PaymentTypeScreen,
  [USER_INFO]: UpdateUserInforScreen,
  [NEWS]: NewsScreen,
  [NEWS_DETAIL]: NewsDetailScreen,
  [SURVEY]: SurveyScreen,
  [POINT]: PointScreen,
  [NOTIFICATION]: NotificationScreen,
  [DEBIT]: DebitScreen,
}

const forFade = ({ current }: StackCardInterpolationProps) => ({
  cardStyle: {
    opacity: current.progress,
  },
})

const StackAuthScreen = () => {
  return (
    <>
      {Object.keys(AUTH_STACK).map((item, index) => {
        if (item == SPLASH || item == LOGIN) {
          return (
            <AuthStack.Screen
              options={{
                cardStyleInterpolator: forFade,
              }}
              key={index}
              name={item}
              component={AUTH_STACK[item]}
            />
          )
        } else {
          return (
            <AuthStack.Screen
              key={index}
              name={item}
              component={AUTH_STACK[item]}
            />
          )
        }
      })}
    </>
  )
}

const StackAppScreen = () => {
  return (
    <>
      {Object.keys(APP_STACK).map((item, index) => (
        <MainStack.Screen key={index} name={item} component={APP_STACK[item]} />
      ))}
    </>
  )
}

export { StackAppScreen, StackAuthScreen, AuthStack, MainStack }
