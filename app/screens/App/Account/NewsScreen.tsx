import { View, Text, StyleSheet, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { colors, fonts, styleView } from '@app/theme'
import FstImage from '@app/components/FstImage/FstImage'
import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { getListNews } from '@app/service/Network/account/AccountApi'
import DateUtil from '@util/DateUtil'
import {
  DEFAULT_PARAMS,
  NEWS_ACTIVE,
  NEWS_STATUS,
  NEWS_TYPE,
} from '@app/config/Constants'
import Empty from '@app/components/Empty/Empty'
const NewsScreen = (props: any) => {
  const type_news = props.route.params?.type_news
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [data, setData] = useState<any>([])

  useEffect(() => {
    getNewList()
  }, [])

  const getNewList = () => {
    const payload = {
      limit: DEFAULT_PARAMS.LIMIT,
      type_news,
      status: NEWS_STATUS.POST,
      status_active: NEWS_ACTIVE.ACTIVE,
    }
    callAPIHook({
      useLoading: setIsLoading,
      payload,
      API: getListNews,
      onSuccess: res => {
        setData(res.data)
      },
    })
  }
  const NewsItem = ({ item }: any) => {
    return (
      <Button
        onPress={() =>
          NavigationUtil.navigate(SCREEN_ROUTER_APP.NEWS_DETAIL, {
            id: item.id,
          })
        }
      >
        <View style={styles.item}>
          <FstImage
            source={item?.image ? { uri: item.image } : R.images.img_logo}
            style={styles.imgae}
            resizeMode="cover"
          />
          <View style={styles.wrapperItem}>
            <Text style={styles.title} numberOfLines={2}>
              {item?.title}
            </Text>
            <View style={styles.viewTime}>
              <FstImage
                source={R.images.ic_clock_bold}
                style={styles.iconTime}
              />
              <Text style={styles.time}>
                {DateUtil.formatShortDate(item.created_at)}
              </Text>
            </View>
          </View>
        </View>
      </Button>
    )
  }
  const renderItem = ({ item }: any) => {
    return <NewsItem item={item} />
  }
  const renderBody = () => {
    if (!data.length) return <Empty />
    return (
      <FlatList
        onRefresh={getNewList}
        refreshing={isLoading}
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => `${item.id}`}
        contentContainerStyle={styles.flatlist}
      />
    )
  }
  return (
    <ScreenWrapper
      back
      titleHeader={
        type_news == 2
          ? R.strings().policy_and_infomation
          : R.strings().guide_order
      }
      borderBottomHeader={colors.line}
      isLoading={isLoading}
      children={renderBody()}
    />
  )
}
const styles = StyleSheet.create({
  imgae: {
    width: 107,
    aspectRatio: 1,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#F3F3F3',
    borderRadius: 12,
  },
  title: {
    ...fonts.semi_bold16,
    color: colors.text.primary,
  },
  time: {
    ...fonts.regular14,
    color: colors.text.dark,
    marginLeft: 4,
  },
  flatlist: {
    padding: 16,
    backgroundColor: colors.white,
    // marginBottom: 16,
    flexGrow: 1,
  },
  iconTime: { height: 20, aspectRatio: 1 },
  viewTime: { ...styleView.rowItem, alignItems: 'center' },
  wrapperItem: {
    justifyContent: 'space-around',
    flex: 1,
    marginLeft: 12,
  },
})
export default NewsScreen
