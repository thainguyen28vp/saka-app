import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import R from '@app/assets/R'
import { colors, fonts, HEIGHT, styleView, WIDTH } from '@app/theme'
import { Button } from '@app/components/Button/Button'
import FstImage from '@app/components/FstImage/FstImage'
import FastImage from 'react-native-fast-image'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import Empty from '@app/components/Empty/Empty'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { getPointTransactions } from '@app/service/Network/account/AccountApi'
import reactotron from 'ReactotronConfig'
import DateUtil from '@app/utils/DateUtil'
import { formatPrice } from '@app/utils/FuncHelper'
import { useAppDispatch, useAppSelector } from '@app/store'
import { requestListPointThunk } from './slice/PointSlice'
import { DEFAULT_PARAMS } from '@app/config/Constants'
import { ModalCalendar } from '@app/components/ModalCalendar'
const scale = WIDTH / 375
const PointScreen = () => {
  const listRef = useRef<FlatList>(null)
  const [body, setBody] = useState({ page: DEFAULT_PARAMS.PAGE })
  const [isShowModal, setIsShowModal] = useState(false)
  var today = new Date()
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  const [date, setDate] = useState({
    startDate: firstDay,
    endDate: today,
  })
  const { data, isLoading, isLoadMore, isLastPage, total_point } =
    useAppSelector(state => state.pointReducer)
  var onEndReachedCalledDuringMomentum = true
  const Dispatch = useAppDispatch()
  useEffect(() => {
    getData()
  }, [body, date])
  const onRefreshData = () => {
    setBody({ page: DEFAULT_PARAMS.PAGE })
  }
  const getData = () => {
    let payload = {
      ...body,
      from_date: DateUtil.formatPayloadDate(date.startDate),
      to_date: DateUtil.formatPayloadDate(date.endDate),
    }
    Dispatch(requestListPointThunk({ body: payload, loadOnTop: false }))
  }
  const renderItemSeparator = useCallback(
    () => <View style={styles.separator} />,
    []
  )
  const onMomentumScrollBegin = () => {
    onEndReachedCalledDuringMomentum = false
  }

  const handleLoadMore = () => {
    if (!onEndReachedCalledDuringMomentum && !isLastPage && !isLoadMore) {
      setBody({ page: body.page + 1 })
    }

    onEndReachedCalledDuringMomentum = true
  }

  const renderHeader = () => {
    return (
      <ImageBackground
        resizeMode="cover"
        source={R.images.img_background_point}
        style={styles.imgBgr}
      >
        <TouchableOpacity
          onPress={() => NavigationUtil.goBack()}
          style={styles.btnAbsolute}
          children={
            <View style={styles.btnBack}>
              <FstImage
                style={styles.iconBack}
                source={R.images.ic_arrow_left}
              />
            </View>
          }
        />
        <View style={styles.pointView}>
          <Text style={styles.txtTitle}>{R.strings().accumulation_point}</Text>
          <Text style={styles.txtPoint}>{formatPrice(total_point + '')}</Text>
        </View>
      </ImageBackground>
    )
  }
  const renderItem = ({ item }: any) => {
    return <PointItemRow item={item} />
  }
  const renderListPoint = () => {
    return (
      <View
        style={[styles.listPoint, Platform.OS == 'android' && { top: -10 }]}
      >
        <View style={styles.headerPoint}>
          <Text style={styles.txtHistory}>{R.strings().history}</Text>
          <Button
            onPress={() => setIsShowModal(prev => !prev)}
            children={
              <View style={styles.filterTime}>
                <Text style={styles.time}>
                  {DateUtil.formatShortDate(date.startDate)}-
                  {DateUtil.formatShortDate(date.endDate)}
                </Text>
                <FastImage
                  source={R.images.ic_filter_point}
                  style={styles.iconFilter}
                />
              </View>
            }
          />
        </View>
        <FlatList
          ref={listRef}
          contentContainerStyle={styleView.paddingBottomMain}
          showsVerticalScrollIndicator={false}
          data={data}
          refreshing={isLoading}
          onRefresh={onRefreshData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          scrollEventThrottle={16}
          onEndReachedThreshold={0.1}
          onMomentumScrollBegin={onMomentumScrollBegin}
          onEndReached={handleLoadMore}
          ListEmptyComponent={() => <Empty backgroundColor={'transparent'} />}
          ItemSeparatorComponent={renderItemSeparator}
          ListFooterComponent={
            isLoadMore ? <ActivityIndicator style={styles.loadMore} /> : null
          }
        />
      </View>
    )
  }
  const PointItemRow = ({ item }: any) => {
    const type = item.type == 'add'
    return (
      <View
        children={
          <View style={styles.pointItemWrapper}>
            <View style={styles.rowItem}>
              <Text numberOfLines={2} style={styles.txtNamePoint}>
                {item.note}
              </Text>
              <Text style={styles.pointNumber}>
                {type ? '+' : '-'}
                {formatPrice(item.value)} điểm
              </Text>
            </View>
            <View style={[styles.rowItem, { marginTop: 4 }]}>
              <Text style={[styles.timePoint, { flex: 1 }]}>
                {DateUtil.formatShortDate(item.created_at)}
              </Text>
              <Text style={styles.timePoint}>
                Số dư: {formatPrice(item?.current_balance)}đ
              </Text>
            </View>
          </View>
        }
      />
    )
  }
  const renderLayout = () => {
    return (
      <>
        {renderHeader()}
        {renderListPoint()}

        <ModalCalendar
          modalFilterCalendar
          isButtonSubmit
          isVisible={isShowModal}
          onSubmit={date => {
            setDate({
              startDate: date?.startDay,
              endDate: date?.endDay,
            })
            setIsShowModal(false)
          }}
          onClose={() => {
            setIsShowModal(false)
          }}
          maximumDate={new Date().toLocaleDateString()}
          titleModal={R.strings().choose_day}
          textSubmit={R.strings().confirm}
        />
      </>
    )
  }

  return (
    <ScreenWrapper isLoading={isLoading} unsafe children={renderLayout()} />
  )
}

const styles = StyleSheet.create({
  imgBgr: {
    width: WIDTH,
    height: HEIGHT * 0.25,
  },
  btnBack: {
    width: scale * 44,
    aspectRatio: 1,
    borderRadius: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',

    alignItems: 'center',
    justifyContent: 'center',
  },
  btnAbsolute: {
    left: 20,
    top: Platform.OS == 'android' ? 40 : 20 + getStatusBarHeight(),
    position: 'absolute',
  },
  iconBack: {
    width: 20 * scale,
    aspectRatio: 1,
  },
  txtTitle: {
    ...fonts.regular16,
    color: colors.white,
    textAlign: 'right',
  },
  txtPoint: {
    fontFamily: R.fonts.sf_bold,
    fontSize: 40,
    textAlign: 'right',
    color: colors.white,
  },
  pointView: {
    position: 'absolute',
    top: '40%',
    right: 24,
  },
  listPoint: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    top: -35,
    flex: 1,
  },
  headerPoint: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
    paddingVertical: 20,
  },
  txtHistory: {
    ...fonts.regular20,
    color: '#000000',
  },
  time: {
    ...fonts.regular14,
    color: colors.text.dark,
  },
  iconFilter: {
    width: 20,
    height: 20,
    marginLeft: 8,
  },
  filterTime: {
    flexDirection: 'row',
  },
  pointItemWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  rowItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  txtNamePoint: {
    ...fonts.regular16,
    color: colors.text.primary,
    flex: 1,
  },
  pointNumber: {
    color: '#478A28',
    ...fonts.regular16,
    marginLeft: 16,
  },
  timePoint: {
    ...fonts.regular14,
    color: colors.text.dark,
  },
  separator: {
    width: WIDTH - 40,
    height: 1,
    backgroundColor: '#D9D9D9',
    alignSelf: 'center',
  },
  loadMore: { marginVertical: 10 },
})
export default PointScreen
