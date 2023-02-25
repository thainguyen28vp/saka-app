import React, { useState, useEffect, useRef } from 'react'
import { View, StyleSheet, FlatList, Text } from 'react-native'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { colors, fonts, WIDTH } from '@app/theme'
import { DEFAULT_PARAMS, ORDER_STATUS_TYPE } from '@app/config/Constants'
import OrderItem from './components/OrderItem'
import { useAppDispatch, useAppSelector } from '@app/store'
import Empty from '@app/components/Empty/Empty'
import Loading from '@app/components/Loading'
import NavigationUtil from '@app/navigation/NavigationUtil'
import {
  MAIN_TAB,
  SCREEN_ROUTER_APP,
  SCREEN_ROUTER_AUTH,
} from '@app/config/screenType'
import R from '@app/assets/R'
import { requestListOrderThunk, updatePageOrder } from './slices/OrderSlice'
import { ScrollableTab, Tab, Tabs } from 'native-base'
import CustomTopTab from './components/CustomTopTab'
import reactotron from 'ReactotronConfig'

type TabProps = {
  tabLabel: string
  children: JSX.Element
  isLoading: boolean
}

const STATUS = [
  ORDER_STATUS_TYPE.PENDING,
  ORDER_STATUS_TYPE.CONFIRMED,
  ORDER_STATUS_TYPE.COMPLETED,
  ORDER_STATUS_TYPE.CANCEL,
]
const scale = WIDTH / 375
const OrderScreen = (props: any) => {
  const tab = props.route.params?.page
  const paymentSign = props.route.params?.paymentSign

  // const navigation = useNavigation()
  // reactotron.log(props)
  const [dialogLoading, setDialogLoading] = useState<boolean>(false)
  const [currentTab, setCurrentTab] = useState<number>(tab || 0)
  const scrollToPending = props.route.params?.scrollToPending
  const refTab = useRef(null)
  const dataOrder: any = useAppSelector(state => state.orderReducer)
  // const badge = dataOrder['PENDING'].count || 0
  const Dispatch = useAppDispatch()

  const getData = (tabIndex: number, page?: number) => {
    let payload = {
      page: page || dataOrder[STATUS[tabIndex].alias].page,
      limit: 10,
      status: tabIndex,
      type: STATUS[tabIndex].alias,
    }
    // reactotron.log('lalala', payload)
    Dispatch(requestListOrderThunk(payload))
  }
  useEffect(() => {
    refTab.current.goToPage(0)
  }, [scrollToPending])

  useEffect(() => {
    //console.log(dataOrder['CANCEL'], page)
    if (!dataOrder[STATUS[currentTab].alias].loaded) getData(currentTab, 1)
  }, [currentTab, scrollToPending])
  const handleLoadMore = () => {
    const data = dataOrder[STATUS[currentTab].alias]
    // Dispatch(updatePageOrder({ type: STATUS[currentTab].alias }))
    if (!data.isLoadMore && !data.isLastPage) {
      getData(currentTab, data.page + 1)
    }
  }
  const renderFooterFlatlist = () => {
    const data = dataOrder[STATUS[currentTab].alias]
    if (data.isLoadMore)
      return <Text style={styles.txtLoading}>{R.strings().loading}</Text>
    return <></>
  }
  const listOrder = (index: number) => {
    if (dataOrder[STATUS[index].alias].isLoading) return <Loading />
    return (
      <FlatList
        key={index}
        refreshing={false}
        //  refreshing={dialogLoading}
        onRefresh={() => getData(currentTab, 1)}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onEndReached={handleLoadMore}
        // onMomentumScrollBegin={onMomentumScrollBegin}
        contentContainerStyle={{ paddingBottom: '7%' }}
        style={{ flex: 1, backgroundColor: '#F1F3F5' }}
        ListFooterComponent={renderFooterFlatlist}
        onEndReachedThreshold={0.1}
        data={dataOrder[STATUS[currentTab].alias].data}
        keyExtractor={(_, index) => `${index}`}
        renderItem={({ item }) => (
          <OrderItem
            data={item}
            tabIndex={index}
            onPress={() =>
              NavigationUtil.navigate(SCREEN_ROUTER_APP.ORDER_DETAIL, {
                listProduct: item.items,
                id: item.id,
                index,
                reloadList: (i: number) => getData(i, 1),
              })
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={() => <Empty backgroundColor={'transparent'} />}
      />
    )
  }

  const renderBody = () => {
    return (
      <Tabs
        ref={refTab}
        initialPage={tab || 0}
        onChangeTab={({ from, i }: any) => {
          setCurrentTab(i)
        }}
        renderTabBar={() => <CustomTopTab dataOrder={dataOrder} />}
      >
        {STATUS.map((item: any, index: number) => {
          return (
            <Tab key={item.id} heading={item.name}>
              {listOrder(index)}
            </Tab>
          )
        })}
      </Tabs>
    )
  }

  return (
    <ScreenWrapper
      back
      unsafe
      // onBack={() => NavigationUtil.navigate(MAIN_TAB.ACCOUNT)}
      titleHeader={R.strings().order}
      backgroundHeader={colors.white}
      color={colors.black}
      children={renderBody()}
    />
  )
}

const styles = StyleSheet.create({
  txtLoading: {
    ...fonts.regular16,
    lineHeight: 24 * scale,
    color: colors.primary,
    textAlign: 'center',
  },
})

export default OrderScreen
