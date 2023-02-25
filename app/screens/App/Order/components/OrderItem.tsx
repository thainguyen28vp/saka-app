import React, { memo, useCallback } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, fonts, styleView } from '@app/theme'
import Line from './Line'
import FastImage from 'react-native-fast-image'
import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { SCREEN_ROUTER, SCREEN_ROUTER_APP } from '@app/config/screenType'
import { formatPrice } from '@app/utils/FuncHelper'
import FstImage from '@app/components/FstImage/FstImage'
import reactotron from 'ReactotronConfig'
import DateUtil from '@app/utils/DateUtil'
import isEqual from 'react-fast-compare'
import { genProductAttributeName } from '../../Product/utils/ProductUtils'
import CountDown from './CountDown'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { requestCreateUrlVnpay } from '@app/service/Network/shop/ShopApi'
import LinkingUtils, { LINKING_TYPE } from '@app/utils/LinkingUtils'
import { PAYMENT_STATUS } from '@app/config/Constants'

interface OrderItemProps {
  data?: any
  showTopStatus?: boolean
  showBottomStatus?: boolean
  onPress?: () => void
  showRating?: Boolean
  tabIndex?: number
  onRatingPress?: () => void
  onRepurchase?: () => void
  discount: number
}

const OrderItem = ({
  data,
  showBottomStatus = true,
  showTopStatus = true,
  tabIndex,
  onPress,
  showRating,
  onRatingPress,
  onRepurchase,
  discount,
}: OrderItemProps) => {
  const total =
    data?.is_order_synced == 1
      ? data?.total
      : data?.total - data?.total_discount
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
  const onPressVnPay: any = useCallback(() => {
    // return
    // const total =
    //   data?.is_order_synced == 0
    //     ? data?.total
    //     : data?.total - data?.total_discount
    const payloadVnPay = {
      orderId: data?.id,
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
  }, [data])
  const orderItemView = (
    <View
      style={{
        backgroundColor: colors.white,
      }}
    >
      {showTopStatus && (
        <>
          <View style={styles.top}>
            <Text
              style={[styles.text16, { color: colors.text.primary }]}
              children={`${data.code}` || R.strings().updating}
            />
            <Text
              style={styles.text16}
              children={DateUtil.formatTimeDateUtc7(data?.created_at)}
            />
          </View>
          <Line />
        </>
      )}
      <View style={styles.center}>
        <FstImage
          style={styles.imgProduct}
          source={{
            uri: data?.items ? data?.items[0]?.image : data?.image,
          }}
          resizeMode={'cover'}
        />
        <View style={styles.viewContent}>
          <Text
            style={[styles.text16, { color: colors.text.primary }]}
            numberOfLines={2}
            children={`${
              data?.items
                ? data?.items[0]?.product_name
                : data?.product_name || data.name
            }`}
          />
          <View style={styles.viewPrice}>
            {/* <Text
              style={{ ...fonts.regular15, color: '#69747E' }}
              children={genProductAttributeName(data)}
            /> */}
            {data?.discount ? (
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Text
                  style={[styles.text16, { color: colors.primary }]}
                  children={
                    `${formatPrice(
                      data?.items ? data?.items[0]?.price : data?.price
                    )}đ` || R.strings().updating
                  }
                />
                <Text
                  style={{
                    ...fonts.regular10,
                    color: colors.brand,
                    marginLeft: 6,
                  }}
                  children={`-${discount}%`}
                />
                {/* <Text
                  style={[styles.text16, styles.textLineThrough]}
                  children={
                    `${formatPrice(
                      data?.items ? data?.items[0]?.price : data?.price
                    )}đ` || R.strings().updating
                  }
                /> */}
              </View>
            ) : (
              <Text
                style={[styles.text16, { color: colors.primary }]}
                children={
                  `${formatPrice(
                    data?.items ? data?.items[0]?.price : data?.price
                  )}đ` || R.strings().updating
                }
              />
            )}
            <Text
              style={styles.text16}
              children={`x${
                (data?.items ? data?.items[0]?.quantity : data?.quantity) || 0
              }`}
            />
          </View>
        </View>
      </View>
      {showBottomStatus && (
        <>
          <Line />
          <View style={styles.bottom}>
            <Text
              style={styles.text16}
              children={
                `${data?.items?.length} ${R.strings().product}` ||
                R.strings().updating
              }
            />
            <Text style={styles.text16}>
              {R.strings().total_money}:{' '}
              <Text
                style={{ ...fonts.semi_bold16, color: colors.primary }}
                children={`${formatPrice(total) || 0}đ` || ''}
              />
            </Text>
          </View>
        </>
      )}
      {data?.payment_method == 'vnpay' &&
        PAYMENT_STATUS.PENDING == data?.payment_status &&
        0 === handleStatus(data?.status) && (
          <CountDown
            tabIndex={tabIndex}
            time_ex={data?.created_at}
            onPressVnPay={onPressVnPay}
          />
        )}
    </View>
  )
  // reactotron.log('akajshasasasahjhghguyygyugyy')
  if (!data) return <></>
  return (
    <Button
      disabled={!onPress}
      onPress={() => !!onPress && onPress()}
      children={orderItemView}
    />
  )
}

const styles = StyleSheet.create({
  top: {
    ...styleView.rowItemBetween,
    paddingHorizontal: 15,
    paddingVertical: 9,
  },
  imgProduct: {
    width: 85,
    height: 85,
    borderRadius: 12,
    marginRight: 15,
  },
  center: {
    ...styleView.rowItem,
    paddingVertical: 16,
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.v_line,
  },
  bottom: {
    ...styleView.rowItemBetween,
    paddingHorizontal: 15,
    paddingVertical: 10,
    // alignSelf: 'flex-end',
    // justifyContent: 'space-between',
  },
  ratingBtn: {
    ...styleView.centerItem,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderColor: '#D5A227',
    borderWidth: 1,
    height: 32,
  },
  text16: {
    fontFamily: R.fonts.sf_regular,
    fontSize: 16,
    color: colors.text.dark,
  },
  viewContent: { flex: 1, justifyContent: 'space-around' },
  viewPrice: { ...styleView.rowItemBetween, alignItems: 'center' },
  textLineThrough: {
    fontSize: 12,
    marginLeft: 6,
    color: colors.text.light,
    textDecorationLine: 'line-through',
  },
})

export default memo(OrderItem, isEqual)
