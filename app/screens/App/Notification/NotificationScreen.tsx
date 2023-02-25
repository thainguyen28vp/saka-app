import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native'
import R from '@app/assets/R'
import { colors, fonts, styleView } from '@app/theme'
import { Button } from '@app/components/Button/Button'
import FastImage from 'react-native-fast-image'
import Empty from '@app/components/Empty/Empty'
import NotiItem from './components/NotiItem'
import { useAppDispatch, useAppSelector } from '@app/store'
import {
  DEFAULT_PARAMS,
  DF_NOTIFICATION,
  NOTIFICATION_TYPE_VIEW,
  ORDER_STATUS_TAB,
} from '@app/config/Constants'
import {
  readAllNoti,
  readNotification,
  requestListNotificationThunk,
  setCountNotify,
} from './slice/NotificationSlice'
import { useScrollToTop } from '@react-navigation/native'
import { NotiItemProps } from './model/Notification'
import { callAPIHook } from '@app/utils/CallApiHelper'
import {
  requestReadAll,
  requestReadNotification,
} from '@app/service/Network/notification/NotificationApi'

import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import styles from './styles/NotiStyles'
import reactotron from 'ReactotronConfig'

const NotificationScreen = () => {
  const [body, setBody] = useState({ page: DEFAULT_PARAMS.PAGE })
  const [loadingDialog, setIsLoadingDialog] = useState(false)
  const { data, isLoading, isLoadMore, isLastPage, error } = useAppSelector(
    state => state.notificationReducer
  )
  const listRef = useRef<FlatList>(null)

  const Dispatch = useAppDispatch()

  var onEndReachedCalledDuringMomentum = true

  const onMomentumScrollBegin = () => {
    onEndReachedCalledDuringMomentum = false
  }

  const handleLoadMore = () => {
    if (!onEndReachedCalledDuringMomentum && !isLastPage && !isLoadMore) {
      setBody({ page: body.page + 1 })
    }

    onEndReachedCalledDuringMomentum = true
  }

  const onRefreshData = () => {
    setBody({ page: DEFAULT_PARAMS.PAGE })
  }

  const getData = () => {
    Dispatch(requestListNotificationThunk({ body, loadOnTop: false }))
  }

  useScrollToTop(
    React.useRef({
      scrollToTop: () => {
        listRef.current?.scrollToOffset({ animated: true, offset: 0 })
        setTimeout(() => {
          Dispatch(requestListNotificationThunk({ body, loadOnTop: true }))
        }, 300)
      },
    })
  )

  useEffect(() => {
    getData()
  }, [body])
  const renderItem = ({ item, index }: any) => {
    return <NotiItem data={item} index={index} />
  }
  const renderItemSeparator = useCallback(
    () => <View style={styles.separator} />,
    []
  )
  const handleReadAll = () => {
    callAPIHook({
      API: requestReadAll,
      onSuccess: () => {
        Dispatch(readAllNoti())
        Dispatch(setCountNotify(0))
      },
      useLoading: setIsLoadingDialog,
    })
  }
  const renderLayout = () => {
    return (
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
    )
  }
  const renderRightComponrnt = () => {
    return (
      <Button
        onPress={handleReadAll}
        children={<Text style={styles.txtReadAll}>{R.strings().readAll}</Text>}
      />
    )
  }
  return (
    <ScreenWrapper
      dialogLoading={loadingDialog}
      titleHeader={R.strings().notification}
      back
      borderBottomHeader={colors.line}
      children={renderLayout()}
      rightComponent={renderRightComponrnt()}
    />
  )
}

export default NotificationScreen
