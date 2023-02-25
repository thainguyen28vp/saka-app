import * as React from 'react'
import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import Error from '@app/components/Error/Error'
import Loading from '@app/components/Loading'
import LoadingProgress from '@app/components/LoadingProgress'
import {
  MAIN_TAB,
  SCREEN_ROUTER_APP,
  SCREEN_ROUTER_AUTH,
} from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { requestDeleteAccount, requestLogout } from '@app/screens/Auth/AuthApi'
import AsyncStorageService from '@app/service/AsyncStorage/AsyncStorageService'
import { useAppDispatch, useAppSelector } from '@app/store'
import { colors, fonts, HEIGHT, styleView, WIDTH } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { showConfirm, showMessages } from '@app/utils/GlobalAlertHelper'
import { useEffect, useState } from 'react'
import {
  ImageRequireSource,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  ImageBackground,
} from 'react-native'
import DeviceInfo from 'react-native-device-info'
import FastImage from 'react-native-fast-image'
// import { clearNotifyCount } from '../Notification/slice/NotificationSlice'
import { clearInfoUser, requestUserThunk } from './slice/AccountSlice'
import { formatPrice } from '@app/utils/FuncHelper'
import { BlurView } from '@react-native-community/blur'
import FstImage from '@app/components/FstImage/FstImage'
import {
  DEFAULT_PARAMS,
  NEWS_ACTIVE,
  NEWS_STATUS,
  NEWS_TYPE,
} from '@app/config/Constants'
import { clearDataSliceCart } from '../Shop/slices/CartSlice'
import { clearDataOrder } from '../Order/slices/OrderSlice'
import { getListNews } from '@app/service/Network/account/AccountApi'
import ToastShow from '@app/utils/ToastHelper'
import { clearNotifyCount } from '../Notification/slice/NotificationSlice'
interface VerticalItemProps {
  icTitle: ImageRequireSource
  title: string
  onPress: () => void
}

const VerticalItem = (props: VerticalItemProps) => {
  const { icTitle, title, onPress } = props

  return (
    <Button
      onPress={onPress}
      children={
        <View
          style={{
            ...styleView.rowItemBetween,
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}
        >
          <View style={{ ...styleView.rowItem, alignItems: 'center' }}>
            <FastImage
              style={{ width: 24, height: 24 }}
              resizeMode={'cover'}
              source={icTitle}
              tintColor={colors.focus}
            />
            <Text
              style={{
                ...fonts.regular16,
                marginLeft: 16,
                color: colors.text.primary,
              }}
              children={title}
            />
          </View>
          <FastImage
            style={{ width: 24, height: 24 }}
            source={R.images.ic_arrow_right}
            tintColor={colors.focus}
          />
        </View>
      }
    />
  )
}
const Line = () => {
  return <View style={{ height: 1, backgroundColor: '#F0F0F0' }} />
}

const AccountScreen = () => {
  const [loading, setIsLoading] = useState(false)
  const { data, isLoading, error }: any = useAppSelector(
    state => state.accountReducer
  )
  const Dispatch = useAppDispatch()

  const onLogout = () => {
    showConfirm(
      R.strings().notification,
      R.strings().confirm_logout,
      async () => {
        callAPIHook({
          API: requestLogout,
          useLoading: setIsLoading,
          typeLoading: 'isLoading',
          onSuccess: async res => {
            await AsyncStorageService.clear()
            NavigationUtil.navigate(SCREEN_ROUTER_AUTH.SPLASH)
          },
          onError: async err => {
            await AsyncStorageService.clear()
            NavigationUtil.navigate(SCREEN_ROUTER_AUTH.SPLASH)
          },
          onFinaly: () => {
            Dispatch(clearDataSliceCart())
            Dispatch(clearInfoUser())
            Dispatch(clearDataOrder())
            Dispatch(clearNotifyCount())
            // Dispatch(clearNotifyCount())
          },
        })
      },
      R.strings().logout
    )
  }

  const onDeleteAccount = () => {
    showConfirm(
      R.strings().notification,
      R.strings().do_you_cancel_account,
      async () => {
        callAPIHook({
          API: requestDeleteAccount,
          useLoading: setIsLoading,
          typeLoading: 'isLoading',
          onSuccess: async res => {
            showMessages(
              '',
              R.strings().cancle_link_account_successfully,
              async () => {
                await AsyncStorageService.clear()
                NavigationUtil.navigate(SCREEN_ROUTER_AUTH.SPLASH)
              }
            )
          },

          onFinaly: () => {
            // Dispatch(clearNotifyCount())
          },
        })
      },
      'Đồng ý'
    )
  }

  const getData = () => {
    Dispatch(requestUserThunk())
  }

  useEffect(() => {
    !data && getData()
  }, [])
  const onPressGuileOrder = () => {
    const payload = {
      limit: DEFAULT_PARAMS.LIMIT,
      type_news: NEWS_TYPE.TUTORIAL,
      status: NEWS_STATUS.POST,
      status_active: NEWS_ACTIVE.ACTIVE,
    }
    callAPIHook({
      useLoading: setIsLoading,
      payload,
      API: getListNews,
      onSuccess: res => {
        if (res?.data && !!res?.data.length)
          NavigationUtil.navigate(SCREEN_ROUTER_APP.NEWS_DETAIL, {
            id: res.data[0].id,
          })
        else ToastShow(R.strings().updating)
      },
    })
  }
  const renderAvatar = () => {
    return (
      <ImageBackground
        source={data?.avatar ? { uri: data?.avatar } : R.images.img_logo}
        imageStyle={styles.imageStyle}
        style={styles.bgrImage}
        blurRadius={6}
        resizeMode="cover"
      >
        <View style={styles.wrapperAvt}>
          <FastImage
            source={data?.avatar ? { uri: data?.avatar } : R.images.img_logo}
            style={styles.avt}
          />
          <View>
            <Text style={styles.txtName} children={`${data?.full_name}`} />
            {/* children={`${data?.full_name} - ${data?.Kiotviet?.name}`} */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FastImage
                source={R.images.ic_phone}
                style={{ width: 20, height: 20 }}
                tintColor={colors.white}
              />
              <Text style={styles.txtPhone}>{data?.phone_number}</Text>
            </View>
          </View>
        </View>
        <View style={styles.fillBackground} />
      </ImageBackground>
    )
  }
  const renderMenu = () => {
    return (
      <View style={{ paddingHorizontal: 16 }}>
        <View style={styles.viewMenu}>
          <Text style={styles.title}>{R.strings().infomation}</Text>
          <VerticalItem
            icTitle={R.images.ic_info_option}
            title={R.strings().info_account}
            onPress={() =>
              NavigationUtil.navigate(SCREEN_ROUTER_APP.USER_INFO, {
                refreshList: () => getData(),
              })
            }
          />
          {!!data?.Debit && (
            <VerticalItem
              icTitle={R.images.ic_debit}
              title={R.strings().manager_debit}
              onPress={() => NavigationUtil.navigate(SCREEN_ROUTER_APP.DEBIT)}
            />
          )}
          <VerticalItem
            icTitle={R.images.ic_order_option}
            title={R.strings().order}
            onPress={() => NavigationUtil.navigate(MAIN_TAB.ODER)}
          />
          <VerticalItem
            icTitle={R.images.ic_map_outline}
            title={R.strings().receiver_address}
            onPress={() =>
              NavigationUtil.navigate(SCREEN_ROUTER_APP.SELECT_RECEIVER)
            }
          />
          <VerticalItem
            icTitle={R.images.ic_promo_option}
            title={R.strings().promotion_code}
            onPress={() => NavigationUtil.navigate(SCREEN_ROUTER_APP.VOUCHER)}
          />

          <VerticalItem
            icTitle={R.images.ic_policy_option}
            title={R.strings().policy_and_infomation}
            onPress={() =>
              NavigationUtil.navigate(SCREEN_ROUTER_APP.NEWS, {
                type_news: NEWS_TYPE.POLICY,
              })
            }
          />
          <Line />
          <Text style={styles.title}>{R.strings().support}</Text>
          <VerticalItem
            icTitle={R.images.ic_guide_option}
            title={R.strings().guide_order}
            onPress={onPressGuileOrder}
          />
          <VerticalItem
            icTitle={R.images.ic_gift_option}
            title={R.strings().user_survey}
            onPress={() => NavigationUtil.navigate(SCREEN_ROUTER_APP.SURVEY)}
          />
          <Line />
          <Text style={styles.title}>{R.strings().setting}</Text>
          <VerticalItem
            icTitle={R.images.ic_lock_option}
            title={R.strings().change_password}
            onPress={() =>
              NavigationUtil.navigate(SCREEN_ROUTER_APP.CHANGE_PASS)
            }
          />

          <Button onPress={onLogout} style={styles.btnLogout}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FstImage
                source={R.images.ic_logout_option}
                style={{ width: 24, height: 24 }}
              />
              <Text style={styles.txtLogout}>{R.strings().logout}</Text>
            </View>
          </Button>
        </View>
      </View>
    )
  }

  if (isLoading) return <Loading />
  if (error) return <Error reload={getData} />
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor={'transparent'} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={getData} />
        }
      >
        {renderAvatar()}
        {renderMenu()}
        <Button onPress={onDeleteAccount}>
          <Text
            style={styles.txtDelete}
            children={R.strings().delete_account}
          />
        </Button>

        <Text
          style={{ color: '#DDD', textAlign: 'right' }}
          children={`Version ${DeviceInfo.getVersion()}(${DeviceInfo.getBuildNumber()})`}
        />
        {loading && <LoadingProgress />}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors.white,
    //paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  avt: {
    height: 73,
    aspectRatio: 1,
    borderRadius: 73 / 2,
    marginRight: 20,
  },
  txtName: {
    ...fonts.regular20,
    color: colors.white,
    marginBottom: 4,
  },
  txtPhone: {
    color: colors.white,
    ...fonts.regular16,
    marginLeft: 4,
  },
  bgrImage: {
    width: WIDTH,
    height: HEIGHT * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    //borderBottomEndRadius: 20,
    // borderBottomRightRadius: 20,
  },
  imageStyle: {
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  viewMenu: {
    backgroundColor: colors.white,
    borderRadius: 8,
    //paddingHorizontal: 16,
    // position: 'absolute',
    top: -40,
  },
  title: {
    ...fonts.semi_bold16,
    color: colors.primary,
    paddingHorizontal: 16,
    paddingTop: 12,
    marginBottom: 8,
  },
  btnLogout: {
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: 'center',
  },
  txtLogout: {
    ...fonts.regular16,
    color: colors.white,
    marginLeft: 4,
  },
  fillBackground: {
    backgroundColor: colors.black,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    opacity: 0.4,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  txtDelete: {
    ...fonts.medium16,
    color: '#E72A00',
    textAlign: 'center',
    top: -10,
  },
  wrapperAvt: { flexDirection: 'row', alignItems: 'center', zIndex: 10 },
})

export default AccountScreen
