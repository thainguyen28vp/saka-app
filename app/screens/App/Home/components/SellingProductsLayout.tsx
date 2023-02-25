import R from '@app/assets/R'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { StyleSheet, Text } from 'react-native'
import { View } from 'react-native'
import { FlatList } from 'react-native'
import React from 'react'
import { Button } from '@app/components/Button/Button'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import FstImage from '@app/components/FstImage/FstImage'
import Title from './Title'
import ProductItem from '@app/components/ProductItem'
import { showMessages } from '@app/utils/GlobalAlertHelper'
import LinearGradient from 'react-native-linear-gradient'
import { WIDTH } from '@app/theme'
import { useAppDispatch } from '@app/store'
import { updateFilter } from '../../Product/slices/FilterSlice'
interface State {
  listHotItems: any[]
  title?: string
  type: number
  customer_type?: string
}
const scale = WIDTH / 375
const SellingProducts = (props: State) => {
  const { listHotItems, title } = props
  const Dispatch = useAppDispatch()
  if (!!!listHotItems.length) return <></>
  return (
    <View
      style={[styles.containerCategory, { paddingBottom: 14 }]}
      children={
        <>
          <Title
            title={title}
            onPress={() => {
              NavigationUtil.navigate(SCREEN_ROUTER_APP.PRODUCT, {
                idCate: { id: undefined, name: 'Tất cả' },
                page: 0,
                numberScrollTab: Math.random(),
              })
              Dispatch(
                updateFilter({
                  sell: props.type,
                  reload: Math.random(),
                })
              )
            }}
          />
          <LinearGradient colors={['#1E4287', '#0E2A61']}>
            <FlatList
              style={{ marginTop: 18 * scale, marginBottom: 6 * scale }}
              contentContainerStyle={{ flexGrow: 1, paddingLeft: 15 }}
              data={listHotItems}
              // data={data}
              keyExtractor={(item, index) => `${index}`}
              horizontal
              renderItem={({ item, index }) => (
                <ProductItem
                  customer_type={props.customer_type}
                  item={item}
                  index={index}
                  half={false}
                  //   notBuyNow={false}
                  // onPressProductItem={item => {
                  //   if (item.stock <= 0) {
                  //     showMessages('', R.strings().product_stop_sell)
                  //     return
                  //   }
                  //   setModalTypeVisible(true)
                  //   setItemProduct(item)
                  // }}
                />
              )}
              showsHorizontalScrollIndicator={false}
            />
          </LinearGradient>
        </>
      }
    />
  )
}

export default SellingProducts
const styles = StyleSheet.create({
  containerCategory: { marginTop: 13 },
  txtTitle: {
    color: '#262626',
    fontSize: 18 * scale,
    lineHeight: 16 * scale,
    // fontWeight: '600',
    paddingVertical: 8 * scale,
    fontFamily: R.fonts.sf_semi_bold,
  },
  txtSeeMore: {
    fontSize: 16 * scale,
    color: '#425369',
  },
  containerHeaderCategory: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15 * scale,
  },
  btnSeeMore: { flex: 1, alignItems: 'flex-end' },
})
