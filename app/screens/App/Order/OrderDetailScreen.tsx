import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { colors, fonts, styleView } from '@app/theme'
import FastImage from 'react-native-fast-image'
import R from '@app/assets/R'
import OrderItem from './components/OrderItem'
import Line from './components/Line'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { formatPrice } from '@app/utils/FuncHelper'
import { ORDER_STATUS_TYPE, PAYMENT_STATUS } from '@app/config/Constants'
import { Button } from '@app/components/Button/Button'
import { ScrollView } from 'react-native-gesture-handler'
import { showConfirm } from '@app/utils/GlobalAlertHelper'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import Clipboard from '@react-native-clipboard/clipboard'
import { OptionItem } from '../Shop/components/PaymentOptionItem'
import styles from './styles/StylesOrderDetail'
import {
  getOrderItemDetail,
  requestBankingInfo,
  requestCancelOrder,
} from '@app/service/Network/order/OrderApi'
import { requestListOrderThunk, updateLoadedOrder } from './slices/OrderSlice'
import { useAppDispatch } from '@app/store'
import Toast from 'react-native-root-toast'
import DateUtil from '@app/utils/DateUtil'
import ToastShow from '@app/utils/ToastHelper'
import reactotron from 'ReactotronConfig'
import FstImage from '@app/components/FstImage/FstImage'
import downloadImageHelper from '@app/utils/DownloadImageHelper'
import { MemoOptionItem } from '../Shop/components/MemoOptionItem'
import Loading from '@app/components/Loading'
import CountDown from './components/CountDown'
import { requestCreateUrlVnpay } from '@app/service/Network/shop/ShopApi'
import LinkingUtils, { LINKING_TYPE } from '@app/utils/LinkingUtils'
interface PropsLine {
  title: string
  content: string
  primary?: boolean
  style?: any
}
const STATUS = [
  ORDER_STATUS_TYPE.PENDING,
  ORDER_STATUS_TYPE.CONFIRMED,
  // ORDER_STATUS_TYPE.DELIVERING,
  ORDER_STATUS_TYPE.COMPLETED,
  ORDER_STATUS_TYPE.CANCEL,
]

const ORDER_ICON = [
  R.images.ic_wait_order,
  R.images.ic_confirm_order,
  // R.images.ic_delivery,
  R.images.ic_success_order,
  R.images.ic_cancel_order,
]

const OrderDetailScreen = (props: any) => {
  const id = props.route.params?.id
  const index = props.route.params?.index
  const listProduct = props.route.params?.listProduct
  const reloadList = props.route.params?.reloadList

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [loadingDialog, setLoadingDialog] = useState<boolean>(false)
  const [seeMore, setSeeMore] = useState<boolean>(false)
  const [orderItemDetail, setOrderItemDetail] = useState<any>()
  const [bankingInfo, setBankingInfo] = useState<any>()
  const Dispatch = useAppDispatch()

  const getData = (id?: number) => {
    callAPIHook({
      API: getOrderItemDetail,
      payload: { order_id: id },
      useLoading: setIsLoading,
      onSuccess: res => {
        setOrderItemDetail(res.data)
      },
    })
  }

  const reloadPending = () => {
    let payload = {
      page: 1,
      limit: 10,
      status: 0,
      type: 'PENDING',
    }
    Dispatch(requestListOrderThunk(payload))
  }

  const onCancelOrder = () => {
    showConfirm('', R.strings().confirm_cancel_order, () => {
      const payload = { id: `${id}` }
      callAPIHook({
        API: requestCancelOrder,
        payload,
        useLoading: setLoadingDialog,
        onSuccess: () => {
          reloadPending()
          Dispatch(updateLoadedOrder({ type: 'CANCEL' }))
          NavigationUtil.goBack()
          ToastShow(R.strings().cancel_order_successfully)
        },
        onError: err => {
          console.log('err', err)
        },
      })
    })
  }
  const total =
    orderItemDetail?.is_order_synced == 1
      ? orderItemDetail?.total
      : orderItemDetail?.total - orderItemDetail?.total_discount
  let total_amount =
    orderItemDetail?.is_order_synced == 1
      ? orderItemDetail?.total + orderItemDetail?.total_discount
      : orderItemDetail?.total
  const handleStatus: any = (status: any) => {
    switch (status) {
      case 'wait_confirmation':
        return 0
      case 'inprogress':
        return 1
      case 'completed':
        return 2
      case 'cancelled':
        return 3
      default:
        break
    }
  }

  const handleStatusDelivery: any = (status: any) => {
    switch (status) {
      case 'wait_confirmation':
        return R.strings().await_goods
      case 'inprogress':
        return R.strings().being_transport
      case 'completed':
        return R.strings().shiped
      default:
        break
    }
  }

  useEffect(() => {
    id && getData(id)
  }, [id])

  const OrderHistoryItem = ({ index, title, time, dataLength }: any) => {
    return (
      <View style={styles.viewItemHistory}>
        <Text numberOfLines={2} style={[styles.titleStatusHistory]}>
          {title}
        </Text>
        <View style={styles.viewDot}>
          <View style={styles.dot} />
          {dataLength != 1 && (
            <View
              style={[
                styles.line,
                index == 0 && { bottom: 0, height: '50%' },
                index + 1 == dataLength && { top: 0, height: '50%' },
              ]}
            />
          )}
        </View>
        <Text numberOfLines={2} style={[styles.titleStatusHistory]}>
          {time}
        </Text>
      </View>
    )
  }

  const orderState = () => {
    return (
      <View
        style={[
          styles.headerStatus,
          {
            backgroundColor:
              handleStatus(orderItemDetail?.status) == 2
                ? '#478A28'
                : handleStatus(orderItemDetail?.status) == 3
                ? '#E72A00'
                : colors.primary,
          },
        ]}
      >
        <Text
          style={styles.txtOrderStatus}
          children={STATUS[handleStatus(orderItemDetail?.status)]?.name}
        />
        <FastImage
          style={styles.icon24}
          source={ORDER_ICON[handleStatus(orderItemDetail?.status)]}
        />
      </View>
    )
  }

  const deliveryInformation = () => {
    return (
      <View style={styles.wrapperDelivery}>
        <View style={styles.viewInfoDelivery}>
          <FastImage
            style={styles.icon24}
            source={R.images.ic_delivery}
            tintColor={colors.text.primary}
          />
          <Text
            style={styles.txt_infoTransport}
            children={R.strings().transport_info}
          />
        </View>
        {orderItemDetail?.order_history &&
          orderItemDetail.order_history.map((item: any, index: number) => {
            return (
              <OrderHistoryItem
                index={index}
                title={item.Employee}
                time={DateUtil.formatTimeDateUtc7(item.created_at)}
                dataLength={orderItemDetail.order_history.length}
              />
            )
          })}

        {/* <Text
            style={styles.txtTransportStatus}
            children={handleStatusDelivery(orderItemDetail?.status)}
          /> */}
        {/* <OrderHistoryState data={orderItemDetail?.listOrderHistory} /> */}
      </View>
    )
  }

  const receiverInformation = () => {
    return (
      <View style={styles.wrapperReceiver}>
        <View style={{ ...styleView.rowItem, alignItems: 'center' }}>
          <FastImage
            style={styles.icon24}
            source={R.images.ic_map_outline}
            tintColor={colors.text.primary}
          />
          <Text
            style={styles.txtReceiverInfo}
            children={R.strings().receiver_info}
          />
        </View>
        <Text
          style={styles.txtAdress}
          children={orderItemDetail?.shipping_address || '--'}
        />
        <Text
          style={styles.txtPhone}
          children={`${orderItemDetail?.shipping_name || '--'} | ${
            orderItemDetail?.shipping_phone_number || '--'
          }`}
        />
      </View>
    )
  }
  const renderInfoBanking = () => {
    const bankingInfo = orderItemDetail?.transfer_money
    if (orderItemDetail?.payment_method != 'banking') return <></>
    if (!!handleStatus(orderItemDetail?.status)) return <></>
    if (!!!bankingInfo) return <></>
    return (
      <View style={styles.wrapperBankingInfo}>
        <Text style={styles.txtPolicyBanking}>
          {R.strings().banking_policy}
        </Text>
        <Text style={styles.txtNameBanking}>
          {R.strings().bank}:{' '}
          <Text style={styles.infoBanking}>{bankingInfo?.bank_name}</Text>
        </Text>
        <Text style={[styles.txtNameBanking, { marginTop: 6 }]}>
          {R.strings().receiver}:{' '}
          <Text style={styles.infoBanking}>
            {bankingInfo?.bank_account_name}
          </Text>
        </Text>
        <View style={styles.viewNumberBanking}>
          <Text style={styles.txtBankingNumber}>
            STK: {bankingInfo?.bank_account_number}
          </Text>
          <Button
            onPress={() => {
              Clipboard.setString(bankingInfo?.bank_account_number || '')
              ToastShow(R.strings().copy_banking_number_successfully)
            }}
            children={
              <FastImage
                source={R.images.ic_copy}
                style={[{ marginLeft: 12 }, styles.icon24]}
              />
            }
          />
        </View>
        <Text style={styles.txtContentBanking}>
          {R.strings().content_banking}:{' '}
        </Text>
        <View style={styles.viewNumberBanking}>
          <Text style={styles.txtBankingNumber}>{bankingInfo?.content}</Text>
          <Button
            onPress={() => {
              Clipboard.setString(bankingInfo?.content || '')
              ToastShow(R.strings().copy_banking_content_successfully)
            }}
            children={
              <FastImage
                source={R.images.ic_copy}
                style={[{ marginLeft: 12 }, styles.icon24]}
              />
            }
          />
        </View>
        <View style={styles.titleQR}>
          <View style={styles.line_half} />
          <Text style={styles.txtQR}>{R.strings().or_scan_qr}</Text>
          <View style={styles.line_half} />
        </View>
        <View
          style={{
            alignItems: 'center',
          }}
        >
          <FstImage
            source={
              bankingInfo?.bank_qr_code
                ? { uri: bankingInfo?.bank_qr_code }
                : R.images.img_logo
            }
            style={styles.imgQR}
          />
          <Button
            onPress={() => downloadImageHelper(bankingInfo?.bank_qr_code)}
            children={
              <View style={styles.btnSaveQR}>
                <FastImage
                  source={R.images.ic_download}
                  style={styles.icon24}
                />
                <Text style={styles.txtSaveText}>{R.strings().save_code}</Text>
              </View>
            }
          />
        </View>
      </View>
    )
  }
  const listOrderItemDetail = () => {
    const listData = listProduct || orderItemDetail?.items
    return (
      <View style={styles.wrapperOrderInfo}>
        <View style={styles.orderItemView}>
          <FastImage
            style={styles.icon24}
            source={R.images.ic_info_order}
            tintColor={colors.text.primary}
          />
          <Text style={styles.txtOrderInfo} children={R.strings().order_info} />
        </View>
        <FlatList
          data={listData.slice(0, seeMore ? undefined : 2)}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <OrderItem
              discount={orderItemDetail?.Voucher?.reward_percentage}
              data={item}
              showBottomStatus={false}
              showTopStatus={false}
            />
          )}
          ItemSeparatorComponent={() => <Line />}
          keyExtractor={(_, index) => `${index}`}
        />
        {orderItemDetail?.gift_status == 1 && (
          <Text style={styles.txtGift}>
            Quà tặng: {orderItemDetail.Voucher.name}
          </Text>
        )}
        {!seeMore && listData.length > 2 && (
          <Button
            onPress={() => setSeeMore(prev => !prev)}
            children={
              <View
                style={{
                  borderBottomWidth: 1,
                  // borderTopWidth: 1,
                  borderColor: '#F3F3F3',
                  paddingVertical: 7,
                }}
              >
                <Text style={styles.txtSeeMore}>{R.strings().see_more}</Text>
              </View>
            }
          />
        )}
        <RenderLine
          style={{ marginTop: 12 }}
          title={R.strings().total_amount}
          content={`${formatPrice(total_amount)}đ` || R.strings().updating}
          primary
        />
      </View>
    )
  }
  const RenderLine = ({ title, content, primary, style }: PropsLine) => {
    return (
      <View style={[styles.linePrice, style]}>
        <Text style={styles.titleLine}>{title}</Text>
        <Text
          style={
            primary
              ? { ...fonts.semi_bold16, color: colors.primary }
              : { ...fonts.regular16, color: colors.text.dark }
          }
        >
          {content}
        </Text>
      </View>
    )
  }
  const infoPrice = () => {
    const total_voucher =
      orderItemDetail?.total_discount - orderItemDetail?.use_point

    return (
      <View style={styles.wrapperInfoPrice}>
        <View style={styles.viewCodeOrder}>
          <Text style={styles.txtCodeOrder}>{R.strings().order_code}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.txtCodeOrder}>{orderItemDetail?.code}</Text>
            <Button
              onPress={() => {
                Clipboard.setString(orderItemDetail?.code || '')
                ToastShow(R.strings().copy_order_code_successfully)
              }}
            >
              <FastImage
                source={R.images.ic_copy}
                style={[{ marginLeft: 6 }, styles.icon24]}
              />
            </Button>
          </View>
        </View>
        <RenderLine
          title={R.strings().total_amount}
          content={`${formatPrice(total_amount + '')}đ` || R.strings().updating}
        />
        {!!orderItemDetail?.use_point && (
          <RenderLine
            title={R.strings().use_point}
            content={
              `-${formatPrice(orderItemDetail?.use_point)}đ` ||
              R.strings().updating
            }
          />
        )}
        {total_voucher > 0 && (
          <RenderLine
            title={R.strings().discount_code}
            content={
              `-${formatPrice(total_voucher + '')}đ` || R.strings().updating
            }
          />
        )}
        <RenderLine
          title={R.strings().total_payment}
          primary
          content={`${formatPrice(total)}đ` || R.strings().updating}
        />
      </View>
    )
  }

  const renderTotalDiscount = () => {
    const total_payment_discount = Number(total) - Number(total) * 0.02

    const timeCreateOrder = new Date(orderItemDetail?.created_at).getTime()
    const timeApplyDiscount = timeCreateOrder + 86400000
    const checkApllyDiscount = timeApplyDiscount > new Date().getTime()
    if (
      orderItemDetail?.payment_method != 'banking' ||
      !checkApllyDiscount ||
      !!handleStatus(orderItemDetail?.status)
    )
      return <></>
    return (
      <View
        style={{
          backgroundColor: colors.white,
          padding: 15,
          marginTop: 8,
        }}
      >
        <Text style={styles.txtNotiSale}>
          Nếu quý thanh toán đơn trước{' '}
          {DateUtil.formatTimeDateReview(timeApplyDiscount)} thì tổng tiền thanh
          toán chỉ còn
          <Text style={{ ...fonts.semi_bold16 }}>
            {' '}
            {formatPrice(total_payment_discount.toFixed())} VNĐ
          </Text>
        </Text>
      </View>
    )
  }
  const renderMemo = () => {
    if (!!!orderItemDetail?.note) return <></>
    return (
      <MemoOptionItem color valueInput={orderItemDetail.note} />

      // <View style={styles.wrapperMemo}>
      //   {!!orderItemDetail?.note && (
      //     <View style={{ marginVertical: 8 }}>
      //       <Text style={styles.titleMemo}>Ghi chú:</Text>
      //       <Text style={styles.contentMemo}>{orderItemDetail.note}</Text>
      //     </View>
      //   )}
      //   {orderItemDetail?.gift_status == 1 && (
      //     <View style={{ marginVertical: 8 }}>
      //       <Text style={styles.titleMemo}>Quà tặng:</Text>
      //       <Text style={styles.contentMemo}>
      //         {orderItemDetail.Voucher.name}
      //       </Text>
      //     </View>
      //   )}
      // </View>
    )
  }
  const handlePayment = (method: string) => {
    switch (method) {
      case 'cod':
        return 'Tiền mặt'
      case 'debit':
        return 'Công nợ'
      case 'banking':
        return 'Chuyển khoản'
      case 'vnpay':
        return 'VNPAY'
      default:
        break
    }
  }

  const paymentStatus = () => {
    return (
      <>
        <OptionItem
          title={R.strings().payments}
          content={handlePayment(orderItemDetail?.payment_method)}
          paymentStatus={handlePaymentStatus(orderItemDetail?.payment_status)}
          colorStatus={handleColorPaymentStatus(
            orderItemDetail?.payment_status
          )}
          icon={R.images.img_wallet}
          colorIcon={colors.text.primary}
          paymentType={orderItemDetail?.payment_method}
        />
      </>
    )
  }
  const handleOrderStatus = (key: string) => {
    switch (key) {
      case 'wait_confirmation':
        return 1
      default:
        break
    }
  }
  const renderButtonDelete = () => {
    // const timeCreateOrder = new Date(orderItemDetail?.created_at).getTime()
    // const timeCheckCancel = timeCreateOrder + 86400000
    // const checkCancelOrder = timeCheckCancel > new Date().getTime()
    // if (!checkCancelOrder) return <></>
    if (
      handleOrderStatus(orderItemDetail?.status) == ORDER_STATUS_TYPE.PENDING.id
    )
      return (
        <View
          style={styles.paddingBtnDelete}
          children={
            <Button
              onPress={onCancelOrder}
              children={
                <View
                  style={styles.bottomButton}
                  children={
                    <Text
                      style={styles.txtDelete}
                      children={R.strings().cancel_order}
                    />
                  }
                />
              }
            />
          }
        />
      )
  }
  const handlePaymentStatus = (status: string) => {
    switch (status) {
      case PAYMENT_STATUS.COMPLETED:
        return ' (Thanh toán thành công)'
      case PAYMENT_STATUS.FAILED:
        return ' (Thanh toán thất bại)'
      case PAYMENT_STATUS.PENDING:
        return ' (Chưa thanh toán)'
      default:
        break
    }
  }
  const handleColorPaymentStatus = (status: string) => {
    switch (status) {
      case PAYMENT_STATUS.COMPLETED:
        return '#1E984F'
      case PAYMENT_STATUS.FAILED:
        return colors.red
      case PAYMENT_STATUS.PENDING:
        return colors.primary
      default:
        break
    }
  }
  const onPressVnPay = () => {
    // reactotron.log(data)
    // return

    const payloadVnPay = {
      orderId: orderItemDetail?.id,
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
  const renderCountdown = () => {
    if (
      orderItemDetail?.payment_method === 'vnpay' &&
      PAYMENT_STATUS.PENDING === orderItemDetail?.payment_status &&
      handleStatus(orderItemDetail?.status) === 0
    )
      return (
        <View style={{ backgroundColor: colors.white, marginTop: 8 }}>
          <CountDown
            time_ex={orderItemDetail?.created_at}
            onPressVnPay={onPressVnPay}
          />
        </View>
      )
    if (
      orderItemDetail?.payment_method === 'vnpay' &&
      PAYMENT_STATUS.COMPLETED === orderItemDetail?.payment_status &&
      handleStatus(orderItemDetail?.status) === 3
    )
      return (
        <View
          style={{ backgroundColor: colors.white, marginTop: 8, padding: 5 }}
        >
          <Text
            style={styles.txtCanceledVNpay}
            children={
              'Đơn hàng đã hủy, vui lòng liên hệ STAKA để tiến hành thủ tục hoàn tiền'
            }
          />
        </View>
      )
    return <></>
  }
  const renderLayout = () => {
    return (
      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: '10%' }}
      >
        {orderState()}
        {renderCountdown()}
        {deliveryInformation()}
        {receiverInformation()}
        {listOrderItemDetail()}
        {paymentStatus()}
        {renderMemo()}
        {infoPrice()}
        {renderTotalDiscount()}
        {renderInfoBanking()}
        {renderButtonDelete()}
      </ScrollView>
    )
  }
  if (isLoading) return <Loading />
  return (
    <ScreenWrapper
      back
      isLoading={isLoading}
      titleHeader={R.strings().order_detail}
      backgroundHeader={colors.white}
      color={colors.black}
      unsafe
      children={renderLayout()}
      dialogLoading={loadingDialog}
    />
  )
}

export default OrderDetailScreen
