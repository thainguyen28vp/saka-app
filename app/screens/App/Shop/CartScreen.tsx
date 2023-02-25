import React, { useState, useEffect } from 'react'
import { View, Text, FlatList } from 'react-native'
import { Button, DebounceButton } from '@app/components/Button/Button'
import { colors, HEIGHT, styleView } from '@app/theme'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import R from '@app/assets/R'
import { formatPrice } from '@app/utils/FuncHelper'
import NavigationUtil from '@app/navigation/NavigationUtil'
import FstImage from '@app/components/FstImage/FstImage'
import CheckBox from './components/CheckBox'
import { useAppDispatch, useAppSelector } from '@app/store'
import { callAPIHook } from '@app/utils/CallApiHelper'
import Empty from '@app/components/Empty/Empty'
import { showConfirm, showMessages } from '@app/utils/GlobalAlertHelper'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import Toast from 'react-native-root-toast'
import styles from './styles/StylesCartScreen'
import {
  requestCheckStockBuy,
  requestDeleteAllCartItem,
  requestDeleteCartItem,
  requestEditCartItem,
} from '@app/service/Network/shop/ShopApi'
import {
  checkAll,
  checkProduct,
  decreaseQuantity,
  deleteCartItem,
  increaseQuantity,
  onChangePrice,
  requestListCartThunk,
} from './slices/CartSlice'
import FastImage from 'react-native-fast-image'
import ToastShow from '@app/utils/ToastHelper'
import reactotron from 'ReactotronConfig'

const DEFAULT_AMOUNT = 1
enum AMOUNT_OPTION {
  INCREASE,
  DECREASE,
}

const CartScreen = (props: any) => {
  const { data, isLoading, error, totalPrice, isCheckAll } = useAppSelector(
    (state: any) => state.cartReducer
  )
  reactotron.log(data)
  const Dispatch = useAppDispatch()
  const [dialogLoading, setDialogLoading] = useState<boolean>(false)

  const handleDeleteAllProduct = () => {
    showConfirm(
      R.strings().delete_all_cart,
      R.strings().do_you_want_delete_all_cart,
      () => {
        callAPIHook({
          API: requestDeleteAllCartItem,
          useLoading: setDialogLoading,
          onSuccess: res => {
            getData()
            ToastShow(R.strings().delete_product_successfully)
          },
        })
      },
      R.strings().confirm
    )
  }

  const onTrashPress = (id: number) => {
    showConfirm(
      '',
      R.strings().do_you_want_delete_product,
      () => {
        callAPIHook({
          API: requestDeleteCartItem,
          payload: { id },
          useLoading: setDialogLoading,
          onSuccess: res => {
            Dispatch(deleteCartItem({ id }))
          },
        })
      },
      R.strings().confirm
    )
  }

  const handleAmountCounter = async (
    id: number,
    option: number,
    quantity: number
  ) => {
    let body
    if (option == AMOUNT_OPTION.INCREASE) {
      body = { quantity: quantity + DEFAULT_AMOUNT }
    } else {
      body =
        quantity == DEFAULT_AMOUNT
          ? { quantity: DEFAULT_AMOUNT }
          : { quantity: quantity - DEFAULT_AMOUNT }
    }
    let payload = {
      id: id,
      body,
    }
    await callAPIHook({
      API: requestEditCartItem,
      payload,
      onSuccess: res => {
        Dispatch(
          option == AMOUNT_OPTION.INCREASE
            ? increaseQuantity({ id })
            : decreaseQuantity({ id })
        )
      },
    })
  }
  const QuantityCounterCart = ({ item }: any) => {
    return (
      <View style={styles.viewCounter}>
        <View style={styles.quantityForm}>
          <Button
            onPress={() => {
              handleAmountCounter(
                item.id,
                AMOUNT_OPTION.DECREASE,
                item.quantity
              )
            }}
            style={[styles.btnMinus, { borderRightWidth: 1 }]}
          >
            <FastImage
              tintColor={colors.focus}
              source={R.images.ic_minus}
              style={[styles.iconMinus]}
            />
          </Button>
          <Text style={styles.numberCart}>{`${item.quantity}` || ''}</Text>
          <Button
            onPress={() => {
              handleAmountCounter(
                item.id,
                AMOUNT_OPTION.INCREASE,
                item.quantity
              )
            }}
            style={[styles.btnMinus, { borderLeftWidth: 1 }]}
          >
            <FastImage
              tintColor={colors.focus}
              source={R.images.ic_plus}
              style={styles.iconMinus}
            />
          </Button>
        </View>
        <Button
          onPress={() => {
            onTrashPress(item.id)
          }}
        >
          <FastImage
            tintColor={colors.gray}
            source={R.images.ic_trash}
            style={styles.iconMinus}
          />
        </Button>
      </View>
    )
  }
  const renderStockItem = ({ item }: any) => {
    let uri = item?.product_image
    return (
      <View style={[styles.itemContainer]}>
        <CheckBox
          fillColor={'#D5A227'}
          containerStyle={[{ marginRight: 12 }]}
          onPress={() => {
            Dispatch(checkProduct({ id: item.id }))
          }}
          isCheck={item.isCheck}
        />
        <View style={{ flex: 1 }}>
          <Button
            onPress={() =>
              NavigationUtil.navigate(SCREEN_ROUTER_APP.PRODUCT_DETAIL, {
                product_id: item?.product_id,
                category_id: item?.product_category_id,
              })
            }
            children={
              <View style={styles.viewProduct}>
                <FstImage
                  style={styles.itemImg}
                  source={{ uri }}
                  resizeMode={'cover'}
                />
                <View
                  style={{
                    justifyContent: 'space-between',
                    flex: 1,
                  }}
                >
                  <Text
                    style={styles.txtProduct}
                    numberOfLines={2}
                    children={item?.product_name}
                  />
                  <View style={styles.viewPrice}>
                    <Text
                      style={styles.txtPrice}
                      children={`${formatPrice(item?.price) || 0} đ`}
                    />
                    {/* <Text
                      style={styles.txtPriceSale}
                      children={`${formatPrice(item?.price) || 0} đ`}
                    /> */}
                  </View>
                  <QuantityCounterCart item={item} />
                </View>
              </View>
            }
          />
        </View>
      </View>
    )
  }

  const getData = () => {
    Dispatch(requestListCartThunk())
  }

  useEffect(() => {
    getData()
  }, [])
  const renderSelectNumber = () => {
    return (
      <View style={styles.viewSelectNumber}>
        <CheckBox
          fillColor={'#D5A227'}
          containerStyle={[{ marginRight: 6 }]}
          onPress={() => {
            Dispatch(checkAll({ isCheckAll }))
          }}
          isCheck={isCheckAll}
          title={R.strings().sellect_all}
          titleStyle={styles.txtCheckbox}
        />
        <Text style={styles.txtNumberSelect}>
          {R.strings().selected +
            ': ' +
            data.filter((x: any) => x.isCheck).length}
        </Text>
      </View>
    )
  }
  const onPressBuy = () => {
    if (!totalPrice) showMessages('', R.strings().please_select_product)
    else {
      const payload = {
        cart_item_id: data
          .filter((item: any) => item.isCheck)
          .map((i: any) => i.id),
      }
      callAPIHook({
        API: requestCheckStockBuy,
        payload,
        useLoading: setDialogLoading,
        onSuccess: res => {
          if (!res.data.length) {
            NavigationUtil.navigate(SCREEN_ROUTER_APP.PAYMENT)
          } else {
            Dispatch(requestListCartThunk())
            ToastShow(
              'Số lượng tồn kho của sản phẩm trong giỏ hàng đã thay đổi !'
            )
          }
        },
      })
    }
  }
  const renderTotalAmount = () => {
    return (
      <View style={styles.viewTotalAmount}>
        <View
          style={{
            justifyContent: 'center',
            height: 52,
          }}
        >
          <View style={{ marginLeft: 9 }}>
            <Text style={styles.txtTotal} children={R.strings().total_money} />
            <Text
              style={styles.txtPriceTotal}
              children={`${formatPrice(totalPrice?.toString()!) || 0}đ`}
            />
          </View>
        </View>
        <Button
          disabled={data?.length == 0}
          style={styles.btnOrder}
          onPress={onPressBuy}
          children={
            <Text style={styles.txtBtnOrder}>{R.strings().buy_amount}</Text>
          }
        />
      </View>
    )
  }
  const renderRightCom = () => {
    return (
      <>
        {data?.length ? (
          <DebounceButton
            onPress={handleDeleteAllProduct}
            children={
              <Text style={styles.txtDeleteAll}>{R.strings().delete_all}</Text>
            }
          />
        ) : null}
      </>
    )
  }
  const renderLayout = () => {
    return (
      <>
        <FlatList
          data={data}
          refreshing={isLoading}
          onRefresh={getData}
          keyExtractor={item => `${item.id}`}
          renderItem={renderStockItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => <Empty />}
        />
        {Boolean(data?.length) && (
          <View style={styles.bottomView}>
            {renderSelectNumber()}
            {renderTotalAmount()}
          </View>
        )}
      </>
    )
  }
  return (
    <ScreenWrapper
      borderBottomHeader={colors.line}
      back
      unsafe
      color={colors.black}
      titleHeader={R.strings().cart}
      backgroundHeader={colors.white}
      isLoading={isLoading}
      dialogLoading={dialogLoading}
      rightComponent={renderRightCom()}
      children={renderLayout()}
    />
  )
}
export default CartScreen
