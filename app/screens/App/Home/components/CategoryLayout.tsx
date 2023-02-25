import NavigationUtil from '@app/navigation/NavigationUtil'
import { ScrollView, StyleSheet, Text } from 'react-native'
import { FlatList } from 'react-native'
import { View } from 'react-native'
import { TouchableOpacity } from 'react-native'
import React from 'react'
import R from '@app/assets/R'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import FstImage from '@app/components/FstImage/FstImage'
import { Button } from '@app/components/Button/Button'
import { colors, WIDTH } from '@app/theme'
import Title from './Title'
import LinearGradient from 'react-native-linear-gradient'
import { useAppDispatch } from '@app/store'
import { updateFilter } from '../../Product/slices/FilterSlice'
interface State {
  listCategory: any[]
  payload?: any
}
const scale = WIDTH / 375
const CategoryLayout = (props: State) => {
  const { listCategory, payload } = props
  const Dispatch = useAppDispatch()
  const renderItemCategory = (item: any, index: number) => {
    return (
      <TouchableOpacity
        onPress={() => {
          NavigationUtil.navigate(SCREEN_ROUTER_APP.PRODUCT, {
            idCate: item,
            page: index + 1,
          })
        }}
        style={styles.itmCateContainer}
      >
        <FstImage
          style={styles.imageCategory}
          source={R.images.ic_category}
          resizeMode={'cover'}
        />
        <Text
          style={styles.textCategory}
          children={`${item.name || ``}`}
          numberOfLines={2}
        />
      </TouchableOpacity>
    )
  }
  if (!!!listCategory.length) return <></>
  return (
    <View
      children={
        <>
          <Title
            title={R.strings().category}
            onPress={async () => {
              NavigationUtil.navigate(SCREEN_ROUTER_APP.PRODUCT)
              Dispatch(
                updateFilter({
                  sell: undefined,
                  reload: Math.random(),
                })
              )
            }}
          />
          <LinearGradient colors={['#1E4287', '#0E2A61']}>
            {/* <FlatList
              style={{ marginTop: 8 }}
              contentContainerStyle={{ flexGrow: 1, paddingLeft: 15 }}
              data={listCategory}
              keyExtractor={(item, index) => `${item.id} ${index}`}
              horizontal
              renderItem={renderItemCategory}
              showsHorizontalScrollIndicator={false}
            /> */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.paddingCate}>
                <View style={styles.flexCate}>
                  {listCategory?.map((item: any, index: number) => {
                    if (index < listCategory?.length / 2)
                      return renderItemCategory(item, index)
                  })}
                </View>
                <View style={styles.flexCate}>
                  {listCategory?.map((item: any, index: number) => {
                    if (index >= listCategory?.length / 2)
                      return renderItemCategory(item, index)
                  })}
                </View>
              </View>
            </ScrollView>
          </LinearGradient>
        </>
      }
    />
  )
}
export default CategoryLayout
const styles = StyleSheet.create({
  flexCate: {
    flexDirection: 'row',
  },
  itmCateContainer: {
    backgroundColor: colors.white,
    paddingVertical: 8 * scale,
    paddingHorizontal: 12 * scale,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 12 * scale,
    borderRadius: 4 * scale,
  },
  imageCategory: {
    width: 24 * scale,
    aspectRatio: 1,
    marginRight: 4 * scale,
  },
  textCategory: {
    color: colors.brand,
    fontSize: 16 * scale,
    fontFamily: R.fonts.sf_regular,
  },
  paddingCate: {
    paddingTop: 16 * scale,
    paddingBottom: 6 * scale,
    paddingLeft: 15 * scale,
  },
})
