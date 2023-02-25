import R from '@app/assets/R'
import { SCREEN_ROUTER_APP, SCREEN_ROUTER_AUTH } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import stylesProduct from '@app/screens/App/Product/styles/stylesProduct'
import { requestListCartThunk } from '@app/screens/App/Shop/slices/CartSlice'
import AsyncStorageService from '@app/service/AsyncStorage/AsyncStorageService'
import { requestAddToCart } from '@app/service/Network/product/ProductApi'
import { useAppDispatch } from '@app/store'
// import {
//   requestAddToWishList,
//   requestCheckExistProduct,
// } from '@app/service/Network/product/ProductApi'
import { colors, fonts, WIDTH } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { formatPrice, handlePrice } from '@app/utils/FuncHelper'
import { showConfirm, showMessages } from '@app/utils/GlobalAlertHelper'
import isUser from '@app/utils/isUser'
import ToastShow from '@app/utils/ToastHelper'
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import reactotron from 'ReactotronConfig'
import { Button, DebounceButton } from './Button/Button'
import FstImage from './FstImage/FstImage'
interface Props {
  item: any
  index: number
  showLikeIcon?: boolean
  half?: boolean
  customer_type?: string
  onPressProductItem?: ((item: any) => void) | undefined
}
const scale = WIDTH / 375
const ProductItem = ({
  item,
  index,
  showLikeIcon = true,
  onPressProductItem,
  half = true,
  customer_type,
}: Props) => {
  const Dispatch = useAppDispatch()
  const handleOnProductPress = (item: any) => {
    NavigationUtil.push(SCREEN_ROUTER_APP.PRODUCT_DETAIL, {
      product_id: item.id,
      item: item,
      category_id: item.product_category_id,
    })
  }

  const onBuyNow = (item: any) => {
    if (item.stock <= 0) {
      ToastShow(R.strings().product_stop_sell)
      return
    }
    const product_variant_id = item?.variants[0]?.id
    let payload = {
      quantity: 1,
      product_variant_id,
    }
    callAPIHook({
      API: requestAddToCart,
      payload,
      onSuccess: res => {
        Dispatch(requestListCartThunk())
        ToastShow(R.strings().add_product_successfully)
      },
    })
  }
  const handleType = (type?: string) => {
    switch (type) {
      case 'is_new':
        return 'Hàng mới'
      case 'is_best_selling':
        return 'Bán chạy'
      case 'is_sale_off':
        return 'Hàng giảm giá'
      case 'out_of_stock':
        return 'Hết hàng'
      default:
        break
    }
  }
  const handlePriceCustomerType = (type?: string) => {
    switch (type) {
      case 'nha_phan_phoi':
        return item?.variants[0]?.distributor_price
      case 'dai_ly':
        return item?.variants[0]?.agent_price
      default:
        return item?.price
    }
  }
  return (
    <TouchableOpacity
      style={[stylesProduct.vButton, half && { width: WIDTH * 0.5 - 20 }]}
      onPress={() => handleOnProductPress(item)}
      children={
        <>
          <FastImage
            style={[
              {
                width: '100%',
                height: WIDTH * 0.45,
              },
              half && { height: WIDTH * 0.5 },
            ]}
            source={
              item?.images[0]
                ? { uri: item?.images[0]?.src }
                : R.images.img_logo
            }
            resizeMode={item?.images[0] ? 'cover' : 'contain'}
          >
            {!item?.images[0] && (
              <View
                style={{
                  backgroundColor: colors.white,
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  opacity: 0.5,
                }}
              ></View>
            )}
            {item?.custom_type || item?.stock < 0 || !item?.stock ? (
              <View
                style={{
                  backgroundColor:
                    item?.stock < 0 || !item?.stock
                      ? colors.focus
                      : colors.primary,
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  borderTopRightRadius: 8 * scale,
                  paddingHorizontal: 10 * scale,
                  paddingVertical: 4 * scale,
                }}
                children={
                  <Text
                    style={{
                      ...fonts.regular12,
                      color: 'white',
                    }}
                    children={handleType(
                      item?.stock < 0 || !item?.stock
                        ? 'out_of_stock'
                        : item?.custom_type
                        ? item?.custom_type
                        : 'out_of_stock'
                    )}
                  />
                }
              />
            ) : null}
          </FastImage>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                ...fonts.medium16,
                marginTop: 4 * scale,
                marginHorizontal: 12 * scale,
                height: 45 * scale,
                //backgroundColor: 'red',
                color: colors.brand,
                //  marginBottom: 4,
              }}
              numberOfLines={2}
              children={
                item?.product_name + ' ' + (item?.unit || '')
                // item?.name + ' ' + (item?.unit || '')
              }
            />
            {/* <Text
              style={{ ...fonts.regular12, marginTop: 5, color: '#595959' }}
              children={
                'Đã bán: ' + (item?.sold < 0 ? 0 : formatPrice(item?.sold) || 0)
              }
            /> */}
            <View
              style={{
                flexDirection: 'row',
                //backgroundColor: 'red',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  marginHorizontal: 12 * scale,
                  justifyContent: 'center',
                  // marginTop: 11 * scale,
                  ///  marginBottom: 7,
                  height: half ? 45 * scale : undefined,
                  // paddingVertical: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 16 * scale,
                    fontFamily: R.fonts.sf_semi_bold,
                    color: colors.primary,
                  }}
                  children={(formatPrice(item?.price) || 0) + 'đ'}
                />
                {/* <Text
                  style={{
                    fontSize: 12 * scale,
                    fontFamily: R.fonts.sf_semi_bold,
                    color: colors.focus,
                  }}
                  children={(formatPrice(item?.price) || 0) + 'đ'}
                /> */}
              </View>
              {half && (
                <DebounceButton
                  style={{
                    // padding: 12 * scale,
                    height: 44,
                    aspectRatio: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderTopLeftRadius: 8 * scale,
                    backgroundColor: '#E7E7E7',
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    // marginTop: 11,
                    // marginTop: 200,
                    borderBottomRightRadius: 8 * scale,
                  }}
                  onPress={() => {
                    isUser(() => onPressProductItem(item))
                  }}
                >
                  <FastImage
                    style={{ width: 20 * scale, aspectRatio: 1 }}
                    source={R.images.ic_cart_product}
                    resizeMode={'contain'}
                    tintColor={colors.brand}
                  />
                </DebounceButton>
              )}
            </View>
          </View>
          {!half && (
            <DebounceButton
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 10 * scale,
                alignItems: 'center',
                marginTop: 6 * scale,
                // marginTop: 5,
                // borderBottomLeftRadius: 8,
                // borderBottomRightRadius: 8,
              }}
              onPress={() => {
                isUser(() => onBuyNow(item))
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FastImage
                  style={{
                    width: 26 * scale,
                    aspectRatio: 1,
                    marginRight: 4 * scale,
                  }}
                  source={R.images.ic_cart_product}
                  resizeMode={'contain'}
                  tintColor={colors.white}
                />
                <Text
                  style={{ ...fonts.regular14, color: colors.white }}
                  children={R.strings().add_flash}
                />
              </View>
            </DebounceButton>
          )}
        </>
      }
    />
  )
}

export default ProductItem
