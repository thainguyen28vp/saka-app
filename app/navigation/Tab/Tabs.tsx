import R from '@app/assets/R'
import { scale } from '@app/common'
import { Block } from '@app/components/Block/Block'
import { MAIN_TAB, SCREEN_ROUTER_AUTH } from '@app/config/screenType'
import AccountScreen from '@app/screens/App/Account/AccountScreen'
import HomeScreen from '@app/screens/App/Home/HomeScreen'
import OrderScreen from '@app/screens/App/Order/OrderScreen'
import ProductScreen from '@app/screens/App/Product/ProductScreen'
import { clearFilter } from '@app/screens/App/Product/slices/FilterSlice'
import AsyncStorageService from '@app/service/AsyncStorage/AsyncStorageService'
import { useAppDispatch } from '@app/store'
import {
  colors,
  dimensions,
  fonts,
  HEIGHT,
  OS,
  styleView,
  WIDTH,
} from '@app/theme'
import { showConfirm } from '@app/utils/GlobalAlertHelper'
import {
  BottomTabBar,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import React from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { isIphoneX } from 'react-native-iphone-x-helper'
import Svg, { Path } from 'react-native-svg'
import NavigationUtil from '../NavigationUtil'
import { RouteProps } from './Tabs.props'

type TabBarOption = {
  name: string
  icon: any
  route: (props?: any) => JSX.Element
  title: string
}
const height = dimensions.height
const width = dimensions.width
const aspectRatio = height / width
const CHECK_IPHONE = aspectRatio > 1.6
const IS_IP5 = aspectRatio == 1.775
const CHECK_HEIGHT_BOTTOM_TAB_BAR =
  OS === 'ios' ? (isIphoneX() ? HEIGHT * 0.1 : HEIGHT * 0.13) : HEIGHT * 0.13
const CHECK_MARGIN_BOTTOM_ICON =
  Platform.OS === 'ios'
    ? isIphoneX()
      ? height * 0.03
      : CHECK_IPHONE
      ? IS_IP5
        ? height * 0.018
        : height * 0.06
      : height * 0.02
    : height * 0.06 //android
const { HOME, PRODUCT, ODER, ACCOUNT } = MAIN_TAB

export const TAB_BAR: Record<string, TabBarOption> = {
  [HOME]: {
    name: MAIN_TAB.HOME,
    icon: R.images.ic_home_tab,
    route: HomeScreen,
    title: R.strings().home,
  },
  [PRODUCT]: {
    name: MAIN_TAB.PRODUCT,
    icon: R.images.ic_product_tab,
    route: ProductScreen,
    title: R.strings().product,
  },
  [ODER]: {
    name: MAIN_TAB.ODER,
    icon: R.images.ic_order_tab,
    route: OrderScreen,
    title: R.strings().order,
  },
  [ACCOUNT]: {
    name: MAIN_TAB.ACCOUNT,
    icon: R.images.ic_user_tab,
    route: AccountScreen,
    title: R.strings().account,
  },
}

const Tab = createBottomTabNavigator()

export const Tabs = ({ route }: { route: RouteProps }) => {
  const Dispatch = useAppDispatch()
  return (
    <Tab.Navigator
      // tabBar={props => renderTabBar(props)}
      tabBarOptions={{
        keyboardHidesTabBar: false,
        tabStyle: {
          flexDirection: 'column',
        },
      }}
      screenOptions={({ navigation, route }) => ({
        tabBarIcon: ({ focused }) => {
          const tintColor = focused ? colors.brand : colors.focus
          return (
            <FastImage
              style={styles.img_icon}
              tintColor={tintColor}
              source={TAB_BAR[route.name].icon}
              resizeMode={'contain'}
            />
          )
        },
        tabBarLabel: ({ focused }) => {
          const tintColor = focused ? colors.brand : colors.focus
          return (
            <Text
              style={[
                styles.txtLabel,
                {
                  color: tintColor,
                  fontFamily: focused
                    ? R.fonts.sf_semi_bold
                    : R.fonts.sf_regular,
                },
              ]}
              numberOfLines={1}
            >
              {TAB_BAR[route.name].title}
            </Text>
          )
        },
        tabBarButton: props => {
          return (
            <TouchableOpacity
              {...props}
              onPress={async e => {
                Dispatch(clearFilter())
                const token = await AsyncStorageService.getToken()
                if (
                  route.name != MAIN_TAB.HOME &&
                  route.name != MAIN_TAB.PRODUCT &&
                  !token
                ) {
                  showConfirm(
                    R.strings().notification,
                    R.strings().require_login_message,
                    () => {
                      NavigationUtil.navigate(SCREEN_ROUTER_AUTH.LOGIN)
                    },
                    R.strings().login,
                    ''
                  )
                  return
                }
                if (props.onPress) props.onPress(e)
              }}
            />
          )
        },
      })}
    >
      {Object.keys(TAB_BAR).map((item, index) => {
        return (
          <Tab.Screen
            key={index}
            name={TAB_BAR[item].name}
            component={TAB_BAR[item].route}
          />
        )
      })}
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  tab: {
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 11,
  },
  img_icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    backgroundColor: 'white',
    marginTop: 14,
  },

  txtLabel: {
    lineHeight: 20,
    fontSize: 12,
    // fontSize: Platform.OS == 'ios' ? 12 : 18,
  },
  badge: {
    ...styleView.centerItem,
    width: 17,
    height: 17,
    backgroundColor: colors.primary,
    borderRadius: 9,
    position: 'absolute',
    top: -3,
    right: -3,
  },
  navigatorContainer: {
    position: 'absolute',
    bottom: -22,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  customTabBar: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderTopColor: 'transparent',
    borderColor: 'transparent',
    height: scale(CHECK_HEIGHT_BOTTOM_TAB_BAR),
    elevation: 0,
  },
  svgShadow: {
    shadowColor: 'rgba(0, 0, 0, 1.0)',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  liveStreamBtn: {
    position: 'absolute',
    width: width * 0.17,
    height: width * 0.17,
    bottom: CHECK_MARGIN_BOTTOM_ICON,
    backgroundColor: 'red',
  },
})
