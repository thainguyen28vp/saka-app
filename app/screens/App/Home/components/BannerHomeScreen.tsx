import SwiperFlatList from 'react-native-swiper-flatlist'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import React, { useCallback } from 'react'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import FstImage from '@app/components/FstImage/FstImage'
import { colors, WIDTH } from '@app/theme'
import Title from './Title'
import R from '@app/assets/R'
interface ListBannerProps {
  id: number
  image: string
}
interface Props {
  style?: any
  data: Item[]
}
interface Item {
  image: string
  id: number
  kiotviet_id: null
  title: string
  status: number
  type: number
  content: string
  created_at: Date
  updated_at: Date
  deleted_at: null
  createdAt: Date
  updatedAt: Date
  version: number
}
const BannerHomeScreen = ({ style, data }: Props) => {
  const renderItemBanner = useCallback(
    ({ item }: { item: ListBannerProps; index: number }) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            !!data.length &&
              NavigationUtil.navigate(SCREEN_ROUTER_APP.NEWS_DETAIL, {
                id: item.id,
              })
          }}
          children={
            <FstImage
              source={!!data.length ? { uri: item?.image } : R.images.img_logo}
              style={[styles.imgBanner]}
              resizeMode="cover"
            />
          }
        />
      )
    },
    [data]
  )
  return (
    <View style={[style]}>
      {/* {!!data?.length && ( */}
      <SwiperFlatList
        pagingEnabled
        keyExtractor={(_, index) => `${index}`}
        data={!!data?.length ? data : [1]}
        renderItem={renderItemBanner}
        paginationActiveColor={colors.primary}
        paginationStyleItem={styles.normalDot}
        autoplay
        autoplayDelay={3}
        autoplayLoop
        index={0}
        showPagination
        paginationDefaultColor={colors.focus}
        paginationStyle={styles.v_pagination}
      />
      {/* )} */}
    </View>
  )
}
const styles = StyleSheet.create({
  imgBanner: {
    width: WIDTH - 30,
    height: 166,
    marginHorizontal: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  normalDot: {
    width: 5,
    aspectRatio: 1,
    marginHorizontal: 6,
  },
  v_pagination: {
    bottom: -10,
  },
})
export default BannerHomeScreen
