import React, { useEffect, useMemo, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native'
import { BlurView } from '@react-native-community/blur'
import { colors, dimensions, fonts, styleView } from '@app/theme'
import { ScrollView } from 'react-native-gesture-handler'
import FastImage from 'react-native-fast-image'
import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
// import QuantityCounter from '../../Shop/components/QuantityCounter'
import { useAppDispatch, useAppSelector } from '@app/store'
// import { requestGetProductCustomAttribute } from '../slice/ProductCustomAttributeSlice'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
// import { requestAddToCart } from '@app/service/Network/product/ProductApi'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { formatPrice } from '@app/utils/FuncHelper'
import Toast from 'react-native-root-toast'
import reactotron from 'reactotron-react-native'
import FstImage from '@app/components/FstImage/FstImage'
import { requestListCartThunk } from '../../Shop/slices/CartSlice'
import { showMessages } from '@app/utils/GlobalAlertHelper'
import {
  requestAddToCart,
  requestCheckStockBuyNow,
} from '@app/service/Network/product/ProductApi'
import QuantityCounter from '../../Shop/components/QuantityCounter'
import ToastShow from '@app/utils/ToastHelper'

const { width, height } = dimensions
const scale = width / 375

interface ModalProps {
  onClosePress: () => void
  stock_id?: number
  product_id: number
  isBuyNow: boolean
  shop_id?: number
  productDetail: any
  customer_type: string
}

const OPTION = {
  OPTION_1: 1,
  OPTION_2: 2,
}

const OPTION_REQUIRE = {
  NO_REQUIRE: 0,
  ONE_OPTION: 1,
  TWO_OPTION: 2,
}

const DEFAULT_AMOUNT = '1'

const ProductSelectTypeModal = (props: ModalProps) => {
  const {
    onClosePress,
    stock_id,
    product_id,
    isBuyNow,
    shop_id,
    productDetail,
    customer_type,
  } = props

  const [option1, setOption1] = useState<number | undefined>()
  const [option2, setOption2] = useState<number | undefined>()
  // const [stockId, setStockId] = useState<number>(stock_id)
  const [amount, setAmount] = useState<string>(DEFAULT_AMOUNT)
  const [selectTypeLoading, setSelectTypeLoading] = useState<boolean>(false)
  const Dispatch = useAppDispatch()
  const optionRequire = productDetail?.variants?.length

  const addToCartCondition = (): boolean => {
    return Boolean(
      (optionRequire == OPTION_REQUIRE.ONE_OPTION && option1 && amount) ||
        (optionRequire == OPTION_REQUIRE.TWO_OPTION &&
          option1 &&
          option2 &&
          amount) ||
        (optionRequire == OPTION_REQUIRE.NO_REQUIRE && !option1 && !option2)
    )
  }

  reactotron.log(productDetail, productDetail)
  const handleAddToCart = () => {
    if (!!!amount) {
      ToastShow(R.strings().number_not_validate)
      onClosePress()
      return
    }
    // if (isBuyNow) {
    //   onClosePress()
    //   setTimeout(() => {
    //     NavigationUtil.navigate(SCREEN_ROUTER_APP.PAYMENT, {
    //       dataIsBuyNow: [
    //         {
    //           ...productDetail,
    //           product_image: productDetail?.images[0]?.src,
    //           quantity: amount,
    //           total: productDetail.price * +amount,
    //         },
    //       ],
    //     })
    //   }, 350)
    //   return
    // }
    let payload = {
      quantity: Number(amount),
      product_variant_id: productDetail?.variants[0]?.id,
    }
    callAPIHook({
      API: isBuyNow ? requestCheckStockBuyNow : requestAddToCart,
      // API: requestAddToCart,
      useLoading: setSelectTypeLoading,
      payload: payload,
      onSuccess: res => {
        Dispatch(requestListCartThunk())
        if (isBuyNow) {
          // setTimeout(() => {
          NavigationUtil.navigate(SCREEN_ROUTER_APP.PAYMENT, {
            dataIsBuyNow: [
              {
                ...productDetail,
                // id: productDetail?.variants[0]?.id,
                product_variant_id: productDetail?.variants[0]?.id,
                product_id: productDetail?.id,
                product_image: productDetail?.images[0]?.src,
                quantity: amount,
                total: productDetail.price * +amount,
                isCheck: true,
              },
            ],
            isPayNow: true,
          })
          // }, 350)

          return
        }
        ToastShow(R.strings().add_product_successfully)
      },
      onFinaly: () => {
        onClosePress()
      },
    })
  }

  // const handlePriceCustomerType = (type?: string) => {
  //   switch (type) {
  //     case 'nha_phan_phoi':
  //       return productDetail?.variants[0]?.distributor_price
  //     case 'dai_ly':
  //       return productDetail?.variants[0]?.agent_price
  //     default:
  //       return productDetail?.price
  //   }
  // }
  const onDecreasePress = () => {
    if (Number(amount) === 1) {
      setAmount(DEFAULT_AMOUNT)
      return
    }
    setAmount(`${Number(amount) - 1}`)
  }

  const onIncreasePress = () => {
    // if (Number(amount) === 999) return
    // setAmount(`${Number(amount) + 1}`)
    if (Number(amount) >= productDetail?.stock) {
      setAmount(productDetail?.stock + '')
    } else setAmount(prev => (Number(prev) + 1).toString())
  }

  const onPressAttribute = (option: number, id: number) => {
    if (option == OPTION.OPTION_1) {
      if (option1 == id) setOption1(undefined)
      else setOption1(id)
    } else {
      if (option2 == id) setOption2(undefined)
      else setOption2(id)
    }
  }

  const clearAllSelect = () => {
    if (option1 && !option2) {
      setOption1(undefined)
    } else if (!option1 && option2) {
      setOption2(undefined)
    } else if (option1 && option2) {
      setOption1(undefined)
      setOption2(undefined)
    }
  }

  // useEffect(() => {
  //   Dispatch(
  //     requestGetProductCustomAttribute({
  //       id: product_id,
  //       stock_id: stockId,
  //       custom_attribute_option_id_1: option1,
  //       custom_attribute_option_id_2: option2,
  //     })
  //   )
  // }, [stockId, option1, option2])

  const handleType = (type?: string) => {
    switch (type) {
      case 'is_new':
        return 'Hàng mới'
      case 'is_best_selling':
        return 'Bán chạy'
      case 'is_sale_off':
        return 'Hàng giảm giá'
      default:
        break
    }
  }
  return (
    <SafeAreaView
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        top: 0,
        bottom: 0,
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* {Platform.OS == 'android' && ( */}
        {/* <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={'light-content'}
      /> */}

        <TouchableWithoutFeedback onPress={onClosePress}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
        <View style={styles.container}>
          <Text
            style={{
              fontFamily: R.fonts.sf_medium,
              color: colors.text.primary,
              fontSize: 16 * scale,
              fontWeight: '500',
              paddingHorizontal: 12 * scale,
            }}
            children={productDetail?.product_name}
            numberOfLines={1}
          />
          <View
            style={{
              ...styleView.rowItem,
              marginTop: 15 * scale,
              paddingHorizontal: 12 * scale,
            }}
          >
            <FstImage
              style={{
                height: 108 * scale,
                aspectRatio: 1,
                borderRadius: 8 * scale,
                marginRight: 8 * scale,
              }}
              resizeMode={'cover'}
              source={{ uri: productDetail?.images[0]?.src }}
            >
              {productDetail?.custom_type ? (
                <View
                  style={{
                    backgroundColor: colors.primary,
                    position: 'absolute',
                    bottom: 0,
                    // left: 0,
                    //borderRadius: 5,
                    borderTopRightRadius: 8 * scale,
                    paddingHorizontal: 10 * scale,
                    paddingVertical: 4 * scale,
                  }}
                  children={
                    <Text
                      style={{
                        fontFamily: R.fonts.sf_regular,
                        fontSize: 12 * scale,
                        color: colors.white,
                      }}
                      children={handleType(productDetail?.custom_type)}
                      // children={'Khuyến mại'}
                    />
                  }
                />
              ) : null}
            </FstImage>

            <View
              style={{
                justifyContent: 'space-around',
                flex: 1,
              }}
            >
              <View
                style={{
                  width: '100%',
                }}
              >
                <Text
                  style={{
                    fontFamily: R.fonts.sf_semi_bold,
                    color: colors.primary,
                    fontSize: 16 * scale,
                    lineHeight: 22 * scale,
                  }}
                  // children={renderPriceText()}
                  children={formatPrice(productDetail?.price) + ' đ' || 0 + 'đ'}
                />
                {/* <Text
                  style={{
                    fontFamily: R.fonts.sf_regular,
                    color: colors.text.light,
                    fontSize: 12 * scale,
                    textDecorationLine: 'line-through',
                  }}
                  // children={renderPriceText()}
                  children={'chưa biết là gì'}
                /> */}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  //flex: 1,
                }}
              >
                <QuantityCounter
                  onChangeText={text => {
                    const number = text.replace(/[^\d]/g, '')
                    if (number[0] == '0') {
                      setAmount('1')
                      return
                    }
                    if (Number(number) > productDetail?.stock) {
                      setAmount(productDetail?.stock + '')
                    } else setAmount(number)
                  }}
                  // onChangeText={text => {
                  //   const number = text.replace(/[^\d]/g, '')
                  //   if (Number(number) > Number(productDetail?.stock)) {
                  //     setAmount(productDetail?.stock + '')
                  //   } else setAmount(number)
                  // }}
                  // value={
                  //   +amount > productDetail?.stock
                  //     ? productDetail?.stock.toString()
                  //     : amount
                  // }
                  value={amount}
                  dialogLoading={selectTypeLoading}
                  onIncreasePress={onIncreasePress}
                  onDecreasePress={onDecreasePress}
                />
                {/* {productDetail?.stock > 0 && ( */}
                <Text
                  style={{
                    fontFamily: R.fonts.sf_regular,
                    fontSize: 12 * scale,
                    color: colors.text.light,
                    lineHeight: 16 * scale,
                    marginLeft: 16 * scale,
                    flex: 1,
                  }}
                >
                  {R.strings().number_left}{' '}
                  <Text style={{ color: colors.primary }}>
                    {productDetail?.stock}
                  </Text>
                </Text>
                {/* )} */}
              </View>
            </View>
          </View>

          <Button
            onPress={handleAddToCart}
            children={
              <View
                style={{
                  ...styleView.centerItem,
                  backgroundColor: colors.primary,
                  borderRadius: 0,
                  height: 50 * scale,
                  marginTop: 24 * scale,
                }}
              >
                <Text
                  style={{
                    ...fonts.medium16,
                    color: colors.white,
                  }}
                  children={
                    !isBuyNow ? R.strings().addToCart : R.strings().buyNow
                  }
                />
              </View>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: width,

    backgroundColor: colors.white,
    // borderRadius: 30,
    //  paddingHorizontal: 12,
    paddingTop: 16,
    // zIndex: 1,
  },
  iconUpDown: {
    width: 16 * scale,
    height: 16 * scale,
  },
  viewIconUpDown: {
    width: 36 * scale,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 4 * scale,
  },
})

export default ProductSelectTypeModal
