import React, { useState, useEffect, useCallback, Component } from 'react'
import { View, Text, StyleSheet, Switch } from 'react-native'
import R from '@app/assets/R'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { colors, fonts, styleView } from '@app/theme'
import { Button } from '@app/components/Button/Button'
import { useAppDispatch, useAppSelector } from '@app/store'
import FastImage from 'react-native-fast-image'
import { Enterprise, Stock } from './model/Cart'
import { FlatList } from 'react-native-gesture-handler'
import FstImage from '@app/components/FstImage/FstImage'
import { formatPrice, handlePrice } from '@app/utils/FuncHelper'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { MAIN_TAB, SCREEN_ROUTER_APP } from '@app/config/screenType'
import { Customer } from './model/Customer'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { showMessages, showConfirm } from '@app/utils/GlobalAlertHelper'
import {
  getDefaultCustomerInfor,
  getListReceiver,
  requestApplyVoucher,
  requestCreateUrlVnpay,
} from '@app/service/Network/shop/ShopApi'
import {
  addVoucher,
  cancelVoucher,
  changeTotalDiscount,
  clearVoucher,
  requestListCartThunk,
} from './slices/CartSlice'
import reactotron from 'ReactotronConfig'
import ract from 'reactotron-react-native'
import LoadingProgress from '@app/components/LoadingProgress'
import { requestCreateNewOrder } from '@app/service/Network/order/OrderApi'
import { styles } from './styles/StylesPaymentScreen'
import { OptionItem } from './components/PaymentOptionItem'
import { updateLoadedOrder } from '../Order/slices/OrderSlice'
import { APPLICABLE_TYPE, PAYMENT_TYPE } from '@app/config/Constants'
import { MemoOptionItem } from './components/MemoOptionItem'
import ToastShow from '@app/utils/ToastHelper'
import { getPointVoucherUser } from '@app/service/Network/home/HomeApi'
import { requestGetPointVoucher } from '../Home/slice/PointVoucherSlice'
import LinkingUtils, { LINKING_TYPE } from '@app/utils/LinkingUtils'

type PaymentData = {
  customerInfor: Customer | undefined
  promotionCode: number | null
}
interface PropsLine {
  title: string
  content: string
  primary?: boolean
}
type PAYMENT_TYPE = 'banking' | 'cod' | 'vnpay' | 'debit'

const PaymentScreen = (props: any) => {
  const { data, totalPrice, voucher_id, total_discount }: any = useAppSelector(
    state => state.cartReducer
  )
  const isPayNow = props.route.params?.isPayNow || null
  const dataIsBuyNow = props.route.params?.dataIsBuyNow || null
  const dataVoucher = props.route.params?.dataVoucher
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [listProduct, setListProduct] = useState<any>(
    isPayNow ? dataIsBuyNow : data
  )
  const [dialogLoading, setDialogLoading] = useState<boolean>(false)
  const [verifyGift, setVerifyGift] = useState<boolean>(false)
  const [usePoint, setUsePoint] = useState<boolean>(false)
  const [paymentTypeState, setPaymentTypeState] = useState<string>('')
  const [checkUseVoucher, setCheckUseVoucher] = useState<any>({})
  const [memo, setMemo] = useState<string>('')
  const [paymentData, setPaymentData] = useState<PaymentData>({
    customerInfor: undefined,
    promotionCode: null,
  })

  const paymentType: PAYMENT_TYPE = props.route.params?.paymentType || null
  const dataPointVoucher: any = useAppSelector(
    state => state.pointVoucherReducer
  )
  const Dispatch = useAppDispatch()

  // const { dataParser, paymentPayload, totalDiscount } = usePaymentData(data!)
  let point = dataPointVoucher.data.point
  let calTotalPrice = usePoint
    ? listProduct?.length && isPayNow
      ? listProduct[0]?.total - point
      : totalPrice - point
    : listProduct?.length && isPayNow
    ? listProduct[0]?.total
    : totalPrice
  const getDataListReceiver = (search?: string) => {
    callAPIHook({
      API: getListReceiver,
      payload: { search },
      useLoading: typeof search == 'string' ? undefined : setIsLoading,
      onSuccess: res => {
        // if (res.data?.length == 1) {
        //   setPaymentData({
        //     ...paymentData,
        //     customerInfor: res?.data[0],
        //   })
        //   return
        // }
        res.data.map((item: any) => {
          if (item.is_default) {
            setPaymentData({
              ...paymentData,
              customerInfor: item,
            })
          }
        })
      },
    })
  }

  const onOrderBtnPress = (calTotalPrice: number) => {
    if (!paymentTypeState) {
      showMessages('', 'Vui lòng chọn phương thức thanh toán!', () =>
        NavigationUtil.navigate(SCREEN_ROUTER_APP.PAYMENT_TYPE, {
          total_payment: calTotalPrice,
        })
      )
      return
    }
    if (calTotalPrice < 10000 && paymentTypeState == 'vnpay') {
      showMessages('', 'Số tiền thanh toán VNPAY tối thiều là 10.000đ!', () =>
        NavigationUtil.navigate(SCREEN_ROUTER_APP.PAYMENT_TYPE, {
          total_payment: calTotalPrice,
        })
      )
      return
    }
    let payload = {
      shipping_phone_number: paymentData?.customerInfor?.phone_number,
      shipping_name: paymentData?.customerInfor?.name,
      shipping_address: `${paymentData?.customerInfor?.address}, ${paymentData?.customerInfor?.ward.name}, ${paymentData?.customerInfor?.district.name}, ${paymentData?.customerInfor?.province.name}`,
      shipping_ward_id: paymentData?.customerInfor?.ward.id,
      shipping_district_id: paymentData?.customerInfor?.district.id,
      shipping_province_id: paymentData?.customerInfor?.province.id,
      address_book_id: undefined,
      payment_method: paymentTypeState,
      use_point: usePoint,
      voucher_id: voucher_id,
      cart_item_id: isPayNow ? undefined : handleCartId(),
      product: isPayNow
        ? {
            product_variant_id: listProduct[0].product_variant_id,
            quantity: listProduct[0].quantity,
          }
        : undefined,
      product_discounts:
        !!checkUseVoucher?.discount &&
        typeof checkUseVoucher?.discount != 'number'
          ? checkUseVoucher?.discount.map((item: any) => {
              return {
                product_variant_id: item.product_variant_id,
                discount: item.discount,
              }
            })
          : undefined,
      discount:
        !!checkUseVoucher?.discount &&
        typeof checkUseVoucher?.discount == 'number'
          ? checkUseVoucher?.discount
          : undefined,
      condition: checkUseVoucher?.condition,
      note: memo,
    }
    // reactotron.log(payload)
    // return
    // if (paymentType == 'vnpay') {
    //   LinkingUtils(
    //     LINKING_TYPE.WEB,
    //     'https://sandbox.vnpayment.vn/tryitnow/Home/CreateOrder'
    //   )
    //   return
    // }
    if (!paymentData?.customerInfor)
      return showMessages('', R.strings().please_add_receiver, () => {
        // NavigationUtil.navigate(SCREEN_ROUTER_APP.SELECT_RECEIVER, {
        //   isPayment: true,
        //   idReceiver: paymentData?.customerInfor?.id,
        //   // reloadList: getDataListReceiver,
        //   selectReceiver: (customerInfor: Customer) =>
        //     setPaymentData(prev => ({
        //       ...prev,
        //       customerInfor,
        //     })),
        // })
        NavigationUtil.navigate(SCREEN_ROUTER_APP.RECEIVER_EDIT, {
          isPayment: true,
          reloadList: getDataListReceiver,
        })
        return
      })
    // return
    try {
      callAPIHook({
        API: requestCreateNewOrder,
        payload,
        useLoading: setDialogLoading,
        onSuccess: res => {
          if (res.code == 85) {
            showMessages('', res.message, () => {
              setPaymentTypeState('')
              NavigationUtil.navigate(SCREEN_ROUTER_APP.PAYMENT_TYPE)
            })
            return
          }
          Dispatch(updateLoadedOrder({ type: 'PENDING' }))
          Dispatch(requestListCartThunk())
          Dispatch(requestGetPointVoucher())
          NavigationUtil.navigate(MAIN_TAB.ODER, {
            page: 0,
            paymentSign: true,
            scrollToPending: Math.random(),
          })
          ToastShow(R.strings().order_success)
          // reactotron.log(res)
          // return
          if (paymentTypeState == 'vnpay') {
            const dataOrder = res.data?.order
            const total =
              dataOrder?.is_order_synced == 1
                ? dataOrder?.total
                : dataOrder?.total - dataOrder?.total_discount
            const payloadVnPay = {
              orderId: dataOrder?.id,
              amount: total,
            }
            callAPIHook({
              API: requestCreateUrlVnpay,
              payload: payloadVnPay,
              onSuccess: res => {
                LinkingUtils(LINKING_TYPE.WEB, res.data)
              },
            })
            return
          }
          // showMessages(
          //   R.strings().notification,
          //   R.strings().order_success,
          //   () => {
          //     // updateCountCart(Dispatch)

          //   }
          // )
        },
        onError: () => {
          reactotron.log('jajajaja')
        },
      })
    } catch (error) {}
  }

  const handleCartId = () => {
    let arrIdCart: Array<number> = []
    data?.map((item: any) => {
      if (item.isCheck) return arrIdCart.push(item.id)
    })
    return arrIdCart
  }

  // const getData = () => {
  //   callAPIHook({
  //     API: getDefaultCustomerInfor,
  //     useLoading: setIsLoading,
  //     onSuccess: res => {
  //       setPaymentData(prev => ({ ...prev, customerInfor: res.data }))
  //     },
  //   })
  // }

  // useEffect(() => {
  //   getData()
  // }, [])

  useEffect(() => {
    getDataListReceiver()
    Dispatch(requestGetPointVoucher())
  }, [])
  useEffect(() => {
    if (paymentType) setPaymentTypeState(paymentType)
  }, [paymentType])
  useEffect(() => {
    if (!dataVoucher) return
    requestVoucher()
  }, [dataVoucher])

  const requestVoucher = async () => {
    const id = dataVoucher?.id
    const payload = {
      cart_item_id:
        listProduct?.length && isPayNow
          ? undefined
          : listProduct
              ?.filter((item: any) => item.isCheck)
              .map((x: any) => x.id),
      voucher_id: id,
      quantity:
        listProduct?.length && isPayNow ? listProduct[0].quantity : undefined,
      product_variant_id:
        listProduct?.length && isPayNow
          ? listProduct.map((item: any) => item.product_variant_id)[0]
          : undefined,
    }
    // reactotron.log('payload', payload)
    try {
      await callAPIHook({
        API: requestApplyVoucher,
        payload,
        useLoading: setDialogLoading,
        onSuccess: res => {
          const condition = res?.data?.condition || 0
          const discount = res?.data?.discounts || undefined
          setVerifyGift(!!condition)
          if (condition) {
            setListProduct((prev: any) => {
              return prev.map((e: any) => {
                return { ...e, discount: 0 }
              })
            })
            return
          }
          const type = res.data?.type
          if (
            type == APPLICABLE_TYPE.ORDER.id ||
            APPLICABLE_TYPE.PRODUCT.id == type
          ) {
            const totalDiscount = discount.reduce(
              (total: number, x: any) => total + x.discount,
              0
            )
            Dispatch(changeTotalDiscount({ total_discount: totalDiscount }))
          }
          switch (type) {
            case APPLICABLE_TYPE.ORDER.id:
              setCheckUseVoucher({ discount: discount[0].discount, condition })
              setListProduct((prev: any) => {
                return prev.map((e: any) => {
                  return { ...e, discount: 0 }
                })
              })
              break
            case APPLICABLE_TYPE.PRODUCT.id:
              setCheckUseVoucher({ discount, condition })
              setListProduct((prev: any) => {
                return prev.map((e: any) => {
                  let temp = discount.find(
                    (element: any) =>
                      element.product_variant_id === e.product_variant_id
                  )
                  // if (temp?.discount) {
                  temp = {
                    ...e,
                    discount: temp?.discount ? dataVoucher?.discount : 0,
                  }
                  // }
                  return temp
                })
              })

              break
            default:
              break
          }
          ToastShow(R.strings().apply_promo_successfully)
          Dispatch(
            addVoucher({
              voucher_id: dataVoucher?.id,
            })
          )

          // const totalDiscount = res.data?.discount || 0
          // const condition = res.data?.condition || 0
          // const gift = res.data?.status || false
          // // reactotron.log(totalDiscount, condition, payload)
          // setCheckUseVoucher({ discount: totalDiscount, condition })
          // setVerifyGift(gift)
          // Dispatch(changeTotalDiscount({ total_discount: totalDiscount }))
        },
      })
    } catch (er) {}
  }

  useEffect(() => {
    return () => {
      Dispatch(cancelVoucher())
    }
  }, [])

  const informationView = () => {
    return (
      <>
        <Button
          onPress={() => {
            if (!paymentData?.customerInfor) {
              NavigationUtil.navigate(SCREEN_ROUTER_APP.RECEIVER_EDIT, {
                isPayment: true,
                reloadList: getDataListReceiver,
              })
              return
            }
            NavigationUtil.navigate(SCREEN_ROUTER_APP.SELECT_RECEIVER, {
              selectReceiver: (customerInfor: Customer) =>
                setPaymentData(prev => ({
                  ...prev,
                  customerInfor,
                })),
              reloadList: getDataListReceiver,
              isPayment: true,
              idReceiver: paymentData?.customerInfor?.id,
            })
          }}
          children={
            <View style={styles.inforView}>
              <View style={{ ...styleView.rowItem, alignItems: 'center' }}>
                <FastImage
                  style={styles.icMap}
                  source={R.images.ic_map_outline}
                  tintColor={colors.primary}
                />
                <View style={styles.viewInfoReceiver}>
                  <Text
                    style={styles.txtInfoReceiver}
                    children={R.strings().receiver_info}
                  />
                  {paymentData?.customerInfor ? (
                    <View style={styles.viewAddressInfo}>
                      <Text
                        style={styles.txtAddress}
                        //numberOfLines={1}
                        children={`${paymentData?.customerInfor?.address}, ${paymentData?.customerInfor?.ward.name}, ${paymentData?.customerInfor?.district.name}, ${paymentData?.customerInfor?.province.name}`}
                      />
                      <FastImage
                        style={styles.icArrow}
                        source={R.images.ic_arrow_right}
                        tintColor={colors.text.primary}
                      />
                    </View>
                  ) : null}
                  <Text
                    style={styles.phoneAddress}
                    children={
                      paymentData.customerInfor
                        ? `${paymentData?.customerInfor?.name} | ${paymentData?.customerInfor?.phone_number}`
                        : R.strings().please_select_receiver
                    }
                  />
                </View>
              </View>
            </View>
          }
        />
        <View style={styles.orderItemView}>
          <FastImage style={styles.icOrder} source={R.images.ic_info_order} />
          <Text style={styles.txtOrderInfo} children={R.strings().order_info} />
        </View>
      </>
    )
  }
  const totalAmount =
    listProduct?.length && isPayNow ? listProduct[0]?.total : totalPrice
  const max_point = !!total_discount
    ? totalAmount - total_discount > point
      ? point
      : totalAmount - total_discount
    : totalAmount < point
    ? totalAmount
    : point
  let discount_point = 0
  if (usePoint && total_discount) {
    if (totalAmount - total_discount < point)
      discount_point = totalAmount - total_discount
    else discount_point = point
  } else if (usePoint && !total_discount) {
    if (totalAmount < point) discount_point = totalAmount
    else discount_point = point
  }
  const total_payment = usePoint
    ? totalAmount < point
      ? 0
      : totalAmount - point
    : totalAmount
  const bottomView = () => {
    return (
      <View style={styles.bottomView}>
        <View style={{ marginLeft: 16 }}>
          <Text style={styles.txtTotal} children={R.strings().total_money} />
          <Text
            style={styles.txtPriceTotal}
            children={
              Number(total_payment - total_discount) < 0
                ? '0đ'
                : formatPrice(total_payment - total_discount) + 'đ'
            }
          />
        </View>
        <Button
          // disabled={data?.length == 0}
          style={styles.btnOrder}
          onPress={() => onOrderBtnPress(calTotalPrice)}
          children={
            <Text style={styles.txtBtnOrder}>{R.strings().order_amount}</Text>
          }
        />
      </View>
    )
  }
  const renderFooter = () => {
    const total_payment_discount = total_payment - total_payment * 0.02
    return (
      <>
        <View style={styles.vTotalMoney}>
          <Text
            style={styles.txtTotalAmount}
            children={R.strings().total_amount}
          />
          <Text
            style={styles.txtPriceAmount}
            children={formatPrice(totalAmount + '') + 'đ'}
          />
        </View>
        {renderOption()}
        <View style={styles.viewPrice}>
          <RenderLine
            title={R.strings().total_amount}
            content={formatPrice(totalAmount + '') + 'đ'}
          />
          {!!total_discount && (
            <RenderLine
              title={R.strings().promotion_code}
              content={'-' + formatPrice(total_discount + '') + 'đ'}
            />
          )}
          {usePoint && (
            <RenderLine
              title={R.strings().use_point}
              content={'-' + formatPrice(`${discount_point}`) + 'đ'}
            />
          )}
          {/* <RenderLine title="Sử dụng ví hoa hồng" content="123" /> */}
          <RenderLine
            title={R.strings().total_money}
            content={
              total_payment - total_discount < 0
                ? '0đ'
                : formatPrice(`${total_payment - total_discount}`) + 'đ'
            }
            primary
          />
        </View>
        {paymentTypeState == 'banking' && (
          <View
            style={{
              backgroundColor: colors.white,
              padding: 16,
              marginVertical: 8,
            }}
          >
            <Text style={styles.txtNotiSale}>
              Nếu quý thanh toán đơn trong vòng 24h thì tổng đơn hàng chỉ còn
              <Text style={{ ...fonts.semi_bold16 }}>
                {' '}
                {formatPrice(total_payment_discount + '')} VNĐ
              </Text>
            </Text>
          </View>
        )}
      </>
    )
  }

  const renderOption = () => {
    // const totalAmount =
    //   listProduct?.length && isPayNow ? listProduct[0]?.total : totalPrice
    // const total_payment = usePoint
    //   ? totalAmount < dataPointVoucher.data.point
    //     ? totalAmount - total_discount - totalAmount
    //     : totalAmount - total_discount - dataPointVoucher.data.point
    //   : totalAmount - total_discount
    // const max_point = !!total_discount
    //   ? totalAmount - total_discount > dataPointVoucher.data.point
    //     ? dataPointVoucher.data.point
    //     : totalAmount - total_discount
    //   : totalAmount < dataPointVoucher.data.point
    //   ? totalAmount
    //   : dataPointVoucher.data.point
    return (
      <>
        <OptionItem
          title={R.strings().promotion_code}
          content={
            verifyGift
              ? dataVoucher?.name
              : !!total_discount
              ? `-${formatPrice(total_discount)}`
              : R.strings().select_promotion_code
          }
          onPress={() => {
            NavigationUtil.navigate(SCREEN_ROUTER_APP.VOUCHER, {
              voucher_id,
              quantity:
                listProduct?.length && isPayNow
                  ? listProduct[0].quantity
                  : undefined,
              list_product: listProduct
                ?.filter((item: any) => item.isCheck)
                .map((x: any) => x.product_variant_id),
              total:
                listProduct?.length & isPayNow
                  ? listProduct[0]?.total
                  : totalPrice,
              isPayNow,
              isPaymentScreen: true,
            })
          }}
        />
        <OptionItem
          title={R.strings().use_point}
          content={`${formatPrice(max_point)}đ`}
          icon={R.images.img_point_payment}
          isPoint={true}
          valueSwitch={usePoint}
          point={max_point}
          onValueChange={() => setUsePoint(prev => !prev)}
        />
        <OptionItem
          title={R.strings().payments}
          content={
            !!paymentTypeState
              ? PAYMENT_TYPE[paymentTypeState].title
              : R.strings().select_payments
          }
          icon={R.images.img_wallet}
          onPress={() =>
            NavigationUtil.navigate(SCREEN_ROUTER_APP.PAYMENT_TYPE, {
              total_payment,
            })
          }
        />
        {/* <OptionItem
          title={R.strings().memo}
          content={R.strings().add_memo}
          icon={R.images.ic_memo}
        /> */}
        <MemoOptionItem valueInput={memo} onChangeText={setMemo} />
      </>
    )
  }
  const RenderLine = ({ title, content, primary }: PropsLine) => {
    return (
      <View style={styles.viewLine}>
        <Text style={styles.titleLine}>{title}</Text>
        <Text
          style={
            primary
              ? { ...fonts.semi_bold16, color: colors.primary }
              : { ...fonts.medium16, color: colors.text.dark }
          }
        >
          {content}
        </Text>
      </View>
    )
  }
  const renderItem = ({ item, index }: any) => {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Button
          onPress={() => {
            NavigationUtil.navigate(SCREEN_ROUTER_APP.PRODUCT_DETAIL, {
              id: item?.product_id,
              category_id: item?.product_category_id,
            })
          }}
          children={
            <View style={styles.containerItem}>
              <FstImage
                style={[styles.itemImg]}
                source={{ uri: item.product_image }}
                resizeMode={'cover'}
              />

              <View style={{ flex: 1 }}>
                <Text
                  style={styles.txtNameProduct}
                  children={item?.product_name}
                  numberOfLines={2}
                />

                <View style={styles.viewPriceProduct}>
                  {item?.discount ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Text
                        style={styles.txtPriceProduct}
                        children={`${
                          // formatPrice(item?.price - item?.discount) || 0
                          formatPrice(item?.price) || 0
                        } đ`}
                      />
                      <Text
                        style={{
                          ...fonts.regular10,
                          color: colors.brand,
                          marginLeft: 6,
                        }}
                      >
                        {`-${item?.discount}%`}
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={styles.txtPriceProduct}
                      children={`${formatPrice(item?.price) || 0} đ`}
                    />
                  )}
                  <Text
                    style={styles.txtAmount}
                    children={'x' + item.quantity}
                  />
                </View>
              </View>
            </View>
          }
        />
      </View>
    )
  }
  const renderLayout = () => {
    return (
      <>
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          ListHeaderComponent={informationView()}
          ListFooterComponent={renderFooter()}
          showsVerticalScrollIndicator={false}
          data={listProduct?.filter((item: any) => item?.isCheck)}
          renderItem={renderItem}
          keyExtractor={(_, index) => `${index}`}
        />
        {bottomView()}
      </>
    )
  }
  return (
    <>
      <ScreenWrapper
        back
        unsafe
        //scroll
        color={colors.black}
        isLoading={isLoading}
        titleHeader={R.strings().payment}
        borderBottomHeader={colors.line}
        backgroundHeader={colors.white}
        dialogLoading={dialogLoading}
        children={renderLayout()}
      />
    </>
  )
}

export default PaymentScreen
