import React, { useRef, useEffect, useState } from 'react'
import {
  SafeAreaView,
  View,
  TextInput,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  Animated,
  Text,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from 'react-native'
import R from '@app/assets/R'
import { colors, fonts, HEIGHT, styleView, WIDTH } from '@app/theme'
import FastImage from 'react-native-fast-image'
import OptionPointVoucherLayout from './components/OptionPoinVoucherLayout'
import SellingProducts from './components/SellingProductsLayout'
import CategoryLayout from './components/CategoryLayout'
import BannerHomeScreen from './components/BannerHomeScreen'
import { FAB } from '@app/components/FAB/FAB'
import LinkingUtils, { LINKING_TYPE } from '@app/utils/LinkingUtils'
import styles from './styles/HomeScreen.styles'
import { requestGetListProvince } from './slice/ProvinceSlice'
import { requestListCartThunk } from '../Shop/slices/CartSlice'
import { useAppDispatch, useAppSelector } from '@app/store'
import AsyncStorageService from '@app/service/AsyncStorage/AsyncStorageService'
import CartButton from '../Product/component/CartButton'
import { Button } from '@app/components/Button/Button'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { MAIN_TAB, SCREEN_ROUTER_APP } from '@app/config/screenType'
import { callAPIHook } from '@app/utils/CallApiHelper'
import {
  getProductFlashSale,
  getProductSaleOff,
  requestCreateAnonymousAccount,
  requestInfoSuport,
} from '@app/service/Network/home/HomeApi'
import { requestGetCategory } from '@app/service/Network/product/ProductApi'
import LoadingProgress from '@app/components/LoadingProgress'
import { requestUserThunk } from '../Account/slice/AccountSlice'
import Loading from '@app/components/Loading'
import { getListNews } from '@app/service/Network/account/AccountApi'
import {
  DEFAULT_PARAMS,
  FILTER_TYPE,
  NEWS_ACTIVE,
  NEWS_STATUS,
  NEWS_TYPE,
} from '@app/config/Constants'
import isUser from '@app/utils/isUser'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import Title from './components/Title'
import LinearGradient from 'react-native-linear-gradient'
import { requestGetPointVoucher } from './slice/PointVoucherSlice'
import reactotron from 'ReactotronConfig'
import OneSignalUtil from '@app/utils/OneSignalUtils'
import { updateCountNotification } from '../Notification/utils/NotificationUtils'
import downloadImageHelper from '@app/utils/DownloadImageHelper'
import OneSignal from 'react-native-onesignal'

const scale = WIDTH / 375
export default function MomoHeader() {
  const [checkToken, setCheckToken] = useState<undefined | string>(undefined)
  const [device_id, setDevice_id] = useState<string>('')
  const [productSaleList, setProductSaleList] = useState<any>([])
  const [categoryList, setCategoryList] = useState<any>([])
  const [infoSupport, setInfoSupport] = useState<any>()
  const [productFlashList, setProductFlashList] = useState<any>([])
  const [bannerList, setBannerList] = useState<any>([])
  const [isFetchingData, setIsFetchingData] = useState(false)
  const { isLoading, data }: any = useAppSelector(state => state.accountReducer)
  const dataPointVoucher: any = useAppSelector(
    state => state.pointVoucherReducer
  )
  const { countNotification } = useAppSelector(
    state => state.notificationReducer
  )

  const Dispatch = useAppDispatch()
  useEffect(() => {
    Dispatch(requestGetListProvince())
    OneSignalUtil.onPushNotification()
  }, [])
  useEffect(() => {
    onRefresh()
    getDeviceID()
  }, [])
  useEffect(() => {
    const payload = {
      device_type: Platform.OS,
      device_id,
    }
    if (device_id)
      callAPIHook({
        API: requestCreateAnonymousAccount,
        payload,
      })
  }, [device_id])
  const getDeviceID = async () => {
    const deviceState = await OneSignal.getDeviceState()
    // reactotron.log('deviceID', deviceState?.userId)
    setDevice_id(deviceState?.userId)
  }
  const getData = async () => {
    getProductSale()
    getProductFlash()
    getCategory()
    getBanner()
    getInfoSuport()
  }
  const getInfoSuport = () => {
    callAPIHook({
      API: requestInfoSuport,
      useLoading: setIsFetchingData,
      onSuccess: (res: any) => {
        setInfoSupport(res.data.value)
        // setIsFetchingData(true)
      },
    })
  }
  const getProductSale = () => {
    callAPIHook({
      API: getProductSaleOff,
      useLoading: setIsFetchingData,
      onSuccess: (res: any) => {
        setProductSaleList(res.data)
        // setIsFetchingData(true)
      },
    })
  }
  const getProductFlash = () => {
    callAPIHook({
      API: getProductFlashSale,
      onSuccess: (res: any) => {
        setProductFlashList(res.data)
      },
    })
  }
  const getBanner = () => {
    const payload = {
      limit: DEFAULT_PARAMS.LIMIT,
      type_news: NEWS_TYPE.BANNER,
      status: NEWS_STATUS.POST,
      status_active: NEWS_ACTIVE.ACTIVE,
    }
    callAPIHook({
      API: getListNews,
      payload,
      onSuccess: (res: any) => {
        setBannerList(res.data)
      },
    })
  }
  const getCategory = () => {
    callAPIHook({
      API: requestGetCategory,
      payload: {
        limit: 100,
      },
      onSuccess: (res: any) => {
        setCategoryList(res.data)
      },
    })
  }
  const onRefresh = async () => {
    const tokenCurrent = await AsyncStorageService.getToken()
    if (tokenCurrent) {
      setCheckToken(tokenCurrent)
      Dispatch(requestListCartThunk())
      Dispatch(requestUserThunk())
      Dispatch(requestGetPointVoucher())
      updateCountNotification(Dispatch)
    }
    getData()
  }
  // const countNotification = 13
  const NotiButton = () => {
    return (
      <View style={[{ ...styleView.centerItem, zIndex: 10, marginLeft: 14 }]}>
        {countNotification != 0 && (
          <View
            style={[
              {
                ...styleView.centerItem,
                position: 'absolute',
                width: 16 * scale,
                aspectRatio: 1,
                backgroundColor: colors.primary,
                borderRadius: 11,
                top: -6,
                right: -4,
              },
              countNotification > 99 && {
                top: -6,
                right: -8,
                width: 20 * scale,
                height: 16,
              },
            ]}
            children={
              <Text
                style={{
                  ...fonts.medium8,
                  color: colors.white,
                  textAlign: 'center',
                }}
                children={`${
                  countNotification > 99 ? '99+' : countNotification
                }`}
              />
            }
          />
        )}
        <FastImage
          style={[{ width: 24, height: 24, zIndex: -1 }]}
          source={R.images.ic_bell}
          tintColor={colors.white}
        />
      </View>
    )
  }
  const renderHeader = () => {
    return (
      <LinearGradient colors={['#20458B', '#13326C']} style={styles.imgHeader}>
        <View style={styles.wrapperLogo}>
          <FastImage source={R.images.ic_logo} style={styles.icLogo} />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Button
              onPress={() =>
                isUser(() => NavigationUtil.navigate(SCREEN_ROUTER_APP.CART))
              }
              children={
                <CartButton
                  styleIcon={styles.icNoti}
                  colorIcon={colors.white}
                />
              }
            />
            <Button
              onPress={() =>
                isUser(() =>
                  NavigationUtil.navigate(SCREEN_ROUTER_APP.NOTIFICATION)
                )
              }
              children={
                <NotiButton />
                // <FastImage
                //   source={R.images.ic_bell}
                //   style={[styles.icNoti, { marginLeft: 16 }]}
                //   tintColor={colors.white}
                // />
              }
            />
          </View>
        </View>
      </LinearGradient>
    )
  }
  const renderViewPosition = () => {
    return <View style={styles.viewPosition}></View>
  }
  const renderBtnSearch = () => {
    return (
      <ImageBackground
        source={R.images.img_bg_search}
        style={styles.imgBgSearch}
      >
        <Button
          onPress={() =>
            NavigationUtil.navigate(MAIN_TAB.PRODUCT, {
              clickSearch: Math.random(),
            })
          }
          children={
            <View style={styles.btnSearch}>
              <FastImage
                tintColor={colors.brand}
                source={R.images.ic_home_search}
                style={styles.icNoti}
              />
              <Text style={styles.txtSearch}>{R.strings().search}</Text>
            </View>
          }
        />
      </ImageBackground>
    )
  }
  const renderFab = () => {
    return (
      <FAB
        type={'group'}
        actions={[
          {
            icon: R.images.ic_messenger,
            styleIcon: { backgroundColor: colors.white },
            onPress: () => {
              LinkingUtils(LINKING_TYPE.WEB, infoSupport?.link_facebook)
            },
          },
          {
            icon: R.images.ic_zalo,
            styleIcon: { backgroundColor: colors.white },
            onPress: () => {
              LinkingUtils(LINKING_TYPE.WEB, infoSupport.link_zalo)
            },
          },
        ]}
      />
    )
  }
  if (isFetchingData || isLoading) return <Loading />
  return (
    <ScreenWrapper unsafe>
      <StatusBar translucent backgroundColor={'transparent'} />
      {renderHeader()}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isFetchingData} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: colors.white,
        }}
        showsVerticalScrollIndicator={false}
      >
        {renderBtnSearch()}
        <OptionPointVoucherLayout
          point={dataPointVoucher.data.point}
          voucher_count={dataPointVoucher.data.voucher_count}
          dataBanner={bannerList}
        />
        <SellingProducts
          customer_type={data?.group || ''}
          title={R.strings().product_sale}
          listHotItems={productSaleList}
          type={FILTER_TYPE.SELL_FLASH}
        />
        <CategoryLayout listCategory={categoryList} />
        <SellingProducts
          customer_type={data?.group || ''}
          title={R.strings().product_hot}
          listHotItems={productFlashList}
          type={FILTER_TYPE.SELL_FAST}
        />
      </ScrollView>
      {renderViewPosition()}
      {renderFab()}
    </ScreenWrapper>
  )
}
