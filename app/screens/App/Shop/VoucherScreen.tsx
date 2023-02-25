import Empty from '@app/components/Empty/Empty'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import NavigationUtil from '@app/navigation/NavigationUtil'
import {
  getListVoucher,
  getListVoucherNoParams,
} from '@app/service/Network/shop/ShopApi'
import { callAPIHook } from '@app/utils/CallApiHelper'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  TouchableOpacity,
  ListRenderItem,
  RefreshControl,
  ScrollView,
  Text,
  View,
  StyleSheet,
} from 'react-native'
import { ScrollableTab, Tab, Tabs } from 'native-base'

import { showConfirm } from '@app/utils/GlobalAlertHelper'
import { useAppDispatch, useAppSelector } from '@app/store'
import { addVoucher } from './slices/CartSlice'
import GiftItem from './components/GiftItem'
import { colors, fonts } from '@app/theme'
import Toast from 'react-native-root-toast'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import R from '@app/assets/R'
import {
  REWARD_TYPE,
  APPLICABLE_TYPE,
  VOUCHER_ACTIVE,
  PRODUCT_ENABLE,
  PAYMENT_STATUS,
} from '@app/config/Constants'
import Loading from '@app/components/Loading'
import Error from '@app/components/Error/Error'
import { Button } from '@app/components/Button/Button'
import FastImage from 'react-native-fast-image'
import reactotron from 'ReactotronConfig'
import AsyncStorageService from '@app/service/AsyncStorage/AsyncStorageService'
import CustomTopTab from '../Order/components/CustomTopTab'

const VoucherScreen = (props: any) => {
  const Dispatch = useAppDispatch()
  let verifyListInit: any = []
  const TAB = [REWARD_TYPE.GIFT, REWARD_TYPE.DISCOUNT]
  const voucher_id = props.route.params?.voucher_id
  const isPaymentScreen = props.route.params?.isPaymentScreen
  const isPayNow = props.route.params?.isPayNow
  const list_product = props.route.params?.list_product
  const quantity = props.route.params?.quantity
  const total = props.route.params?.total
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [dataVoucher, setDataVoucher] = useState<any>({})
  const [badgeCount, setBadgeCount] = useState<any>([])
  const [verifyGift] = useState(verifyListInit)

  const getData = async () => {
    let payload: any = {
      total,
      limit: 100,
      status: VOUCHER_ACTIVE.ACTIVE,
    }
    if (isPayNow) {
      payload = { ...payload, product_variant_id: list_product[0], quantity }
    } else {
      payload = {
        ...payload,
        products: list_product ? JSON.stringify(list_product) : undefined,
      }
    }
    callAPIHook({
      API: isPaymentScreen ? getListVoucher : getListVoucherNoParams,
      payload,
      useLoading: setIsLoading,
      onSuccess: res => {
        // return
        const { GIFT, DISCOUNT } = REWARD_TYPE
        // const { ORDER, PRODUCT } = APPLICABLE_TYPE
        const { ORDER, PRODUCT } = PRODUCT_ENABLE
        const data = res?.data || []
        let dataSortStatus = []
        if (isPaymentScreen) {
          const filterData = data.filter((x: any) => x.voucher_used.status != 3)
          dataSortStatus = filterData.sort(
            (a: any, b: any) => b.voucher_used.status - a.voucher_used.status
          )
        } else {
          dataSortStatus = data
        }

        const dataGiftOrder = dataSortStatus.filter(
          (x: any) => x.reward_type == GIFT.id
        )
        const dataDiscount = dataSortStatus.filter(
          (x: any) => x.reward_type == DISCOUNT.id
        )
        setBadgeCount([dataGiftOrder.length, dataDiscount.length])
        const dataDiscountProduct = dataSortStatus.filter(
          (x: any) =>
            x.reward_type == DISCOUNT.id && x.applicable_type == PRODUCT.id
        )
        const dataDiscountOrder = dataSortStatus.filter(
          (x: any) =>
            x.reward_type == DISCOUNT.id && x.applicable_type == ORDER.id
        )
        setDataVoucher({
          GIFT: {
            products: {
              data: [],
              checkFillData: false,
            },
            order: {
              data: dataGiftOrder,
              checkFillData: dataGiftOrder.length > 5,
            },
          },
          DISCOUNT: {
            products: {
              data: dataDiscountProduct,
              checkFillData: dataDiscountProduct.length > 5,
            },
            order: {
              data: dataDiscountOrder,
              checkFillData: dataDiscountOrder.length > 5,
            },
          },
        })
      },
    })
  }

  const onVoucherPress = (item: any) => {
    if (!!list_product) {
      NavigationUtil.navigate(SCREEN_ROUTER_APP.PAYMENT, {
        dataVoucher: {
          id: item.id,
          reload: Math.random(),
          name: item.name,
          discount: item.reward_percentage,
        },
        isPayNow,
      })
      return
    }
    NavigationUtil.navigate(SCREEN_ROUTER_APP.VOUCHER_DETAIL, {
      data: item,
      isPayment: !!list_product,
    })
    return
  }
  useEffect(() => {
    getData()
  }, [])

  const renderVoucherItem: ListRenderItem<any> = useCallback((item: any) => {
    // const checkGiftUsed = verifyGift.some((gift: any) => gift.giftId == item.id)
    //  console.log({ status: item.voucher_used?.status, name: item.name })
    const disable = item.voucher_used?.status == 0
    const message = item.voucher_used?.message || ''
    return (
      <GiftItem
        disable={disable && !!list_product}
        onPress={() => onVoucherPress(item)}
        data={item}
        message={message}
        key={item.code}
        //using={voucher_id == item.id}
      />
    )
  }, [])

  const RenderSeeMore = ({ onPress, keyRender }: any) => {
    return (
      <TouchableOpacity style={styles.btnSeeMore} onPress={onPress}>
        <Text style={styles.txtSeeMore}>
          {keyRender ? R.strings().see_more : R.strings().see_less}
        </Text>
        <FastImage
          source={keyRender ? R.images.ic_down : R.images.ic_up}
          style={styles.iconSeeMore}
        />
      </TouchableOpacity>
    )
  }
  const renderListVoucher = (index: number) => {
    const key = index == 0 ? 'GIFT' : 'DISCOUNT'
    if (!dataVoucher[key]) return <Error reload={getData} />
    const { products, order } = dataVoucher[key]
    if (!products.data.length && !order.data.length) return <Empty />
    return (
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={getData} />
          }
          contentContainerStyle={styles.container}
        >
          {!!products.data.length && (
            <View
              style={{
                backgroundColor: colors.white,
                paddingBottom: 12,
                marginTop: 8,
              }}
            >
              <Text style={styles.txtTitle}>
                {R.strings().apply_only_product}
              </Text>

              <View style={styles.content}>
                {products.data
                  .slice(0, products.checkFillData ? 5 : undefined)
                  .map((item: any) => {
                    return renderVoucherItem(item)
                  })}
              </View>

              {products.data.length > 5 && (
                <RenderSeeMore
                  keyRender={dataVoucher[key].products.checkFillData}
                  onPress={() => {
                    const data = { ...dataVoucher }
                    data[key].products.checkFillData =
                      !data[key].products.checkFillData
                    setDataVoucher(data)
                  }}
                />
              )}
            </View>
          )}

          {!!order.data.length && (
            <View
              style={{
                backgroundColor: colors.white,
                paddingBottom: 12,
                marginTop: 8,
              }}
            >
              <Text style={styles.txtTitle}>
                {R.strings().apply_total_order}
              </Text>

              <View style={styles.content}>
                {order.data
                  .slice(0, order.checkFillData ? 5 : undefined)
                  .map((item: any) => {
                    return renderVoucherItem(item)
                  })}
              </View>

              {order.data.length > 5 && (
                <RenderSeeMore
                  keyRender={dataVoucher[key].order.checkFillData}
                  onPress={() => {
                    const data = { ...dataVoucher }
                    data[key].order.checkFillData =
                      !data[key].order.checkFillData
                    setDataVoucher(data)
                  }}
                />
              )}
            </View>
          )}
        </ScrollView>
      </>
    )
  }

  const renderLayout = () => {
    return (
      <Tabs
        initialPage={0}
        // renderTabBar={() => (
        //   <ScrollableTab underlineStyle={styles.underLine} style={styles.tab} />
        // )}

        renderTabBar={() => <CustomTopTab bageVoucher={badgeCount} />}
      >
        {TAB.map((item: any, index: number) => {
          return (
            <Tab
              key={item.id}
              heading={item.alias}
              activeTextStyle={styles.txtActiveTab}
              textStyle={styles.txtTab}
              activeTabStyle={{ backgroundColor: colors.white }}
              tabStyle={{ backgroundColor: colors.white }}
            >
              {renderListVoucher(index)}
            </Tab>
          )
        })}
      </Tabs>
    )
  }
  return (
    <ScreenWrapper
      back
      borderBottomHeader={colors.line}
      backgroundHeader={colors.white}
      isLoading={isLoading}
      titleHeader={R.strings().discount_code}
      color={colors.black}
      children={renderLayout()}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    marginBottom: 20,
  },
  txtTitle: {
    color: colors.text.dark,
    ...fonts.regular14,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    paddingTop: 10,
  },
  content: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },
  btnSeeMore: {
    flexDirection: 'row',
    // alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingVertical: 10,
  },
  txtSeeMore: { color: colors.text.dark, ...fonts.regular14 },
  iconSeeMore: { width: 20, aspectRatio: 1, marginLeft: 4 },
  tab: { backgroundColor: colors.white, borderBottomWidth: 0 },
  underLine: {
    backgroundColor: '#2E2E2E',
    height: 2,
  },
  txtTab: { color: colors.text.dark, ...fonts.regular16 },
  txtActiveTab: {
    color: colors.text.primary,
    ...fonts.semi_bold16,
  },
})

export default VoucherScreen
