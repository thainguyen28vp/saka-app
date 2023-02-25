import React, { useState, useEffect, useRef, memo } from 'react'
import R from '@app/assets/R'
import { useAppSelector } from '@app/store'
import { colors, fonts, styleView, WIDTH } from '@app/theme'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
} from 'react-native'
import isEqual from 'react-fast-compare'
import reactotron from 'ReactotronConfig'
import Animated from 'react-native-reanimated'

const OrderCustomTopTab = (props: any) => {
  const {
    tabs,
    activeTab,
    goToPage,
    initialTab,
    dataOrder,
    bottomView,
    bageVoucher,
    style,
  } = props
  //const { data } = useAppSelector(state => state.OrderReducer)
  const [currentTab, setCurrentTab] = useState<number>(activeTab)

  const listRef = useRef<FlatList>(null)
  const listOffset = useRef<Array<number>>([])

  const handleScrollOnChangeTab = (tab: number) => {
    const offset = listOffset.current
      .slice(0, tab)
      // .filter(item => listOffset.current.indexOf(item) < tab)
      .reduce((acc, curr) => acc + curr, 0)
    listRef.current?.scrollToOffset({
      offset: offset != 0 ? offset - 100 : offset,
      animated: true,
    })
  }

  useEffect(() => {
    setCurrentTab(activeTab)
  }, [activeTab])

  useEffect(() => {
    setTimeout(() => {
      handleScrollOnChangeTab(currentTab)
    }, 100)
    //goToPage(currentTab)
    //reactotron.log(currentTab)
  }, [currentTab])
  const onClickTab = (index: number) => {
    setCurrentTab(index)
    handleScrollOnChangeTab(index)
    goToPage(index)
  }

  useEffect(() => {
    !!initialTab && setCurrentTab(initialTab)
  }, [initialTab])
  const aliasNameOrder = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCEL']
  const renderTabItem: ListRenderItem<string> = ({ item, index }) => {
    const isActiveTab = activeTab == index
    const badgeCount = dataOrder
      ? dataOrder[aliasNameOrder[index]].count
      : undefined
    const badgeIcon =
      badgeCount && badgeCount != 0 ? (
        <View style={styles.badgeView}>
          <Text
            style={{ ...fonts.regular10, color: colors.white }}
            children={badgeCount}
          />
        </View>
      ) : null
    const badgeVoucherIcon =
      bageVoucher && bageVoucher[index] ? (
        <View style={styles.badgeView}>
          <Text
            style={{ ...fonts.regular10, color: colors.white }}
            children={bageVoucher[index]}
          />
        </View>
      ) : null
    return (
      <TouchableOpacity
        key={index}
        onLayout={({ nativeEvent }) => {
          const { width } = nativeEvent.layout
          if (listOffset.current.length < tabs.length) {
            listOffset.current.push(width)
          }
        }}
        onPress={() => onClickTab(index)}
        children={
          <View style={styles.tab}>
            <View>
              {badgeIcon}
              {badgeVoucherIcon}
              <Text
                style={{
                  ...fonts.regular16,
                  color: isActiveTab ? colors.brand : colors.text.dark,
                  fontFamily: isActiveTab
                    ? R.fonts.sf_semi_bold
                    : R.fonts.sf_regular,
                }}
                children={item}
              />
            </View>
            {isActiveTab && (
              <View
                style={{
                  width: '100%',
                  height: 2,
                  borderRadius: 2,
                  backgroundColor: colors.brand,
                  alignSelf: 'center',
                  position: 'absolute',
                  bottom: 0,
                }}
              />
            )}
          </View>
        }
      />
    )
  }
  return (
    <View style={[styles.tabs]}>
      <FlatList
        style={{
          height: 45,
          backgroundColor: colors.white,
          width: '100%',
          zIndex: 10,
        }}
        contentContainerStyle={[
          {
            paddingRight: 5,
          },
          bageVoucher && { justifyContent: 'space-around', flex: 1 },
        ]}
        ref={listRef}
        horizontal
        data={tabs}
        renderItem={renderTabItem}
        keyExtractor={(_, index) => `${index}`}
        showsHorizontalScrollIndicator={false}
      />
      {bottomView && bottomView()}
    </View>
  )
}

const styles = StyleSheet.create({
  tab: {
    paddingHorizontal: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    backgroundColor: colors.white,
    borderBottomWidth: 2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    zIndex: 100,
    height: 'auto',
  },
  badgeView: {
    ...styleView.centerItem,
    position: 'absolute',
    top: -6,
    right: -20,
    width: 18,
    height: 18,
    backgroundColor: colors.brand,
    borderRadius: 9,
  },
})

export default memo(OrderCustomTopTab, isEqual)
