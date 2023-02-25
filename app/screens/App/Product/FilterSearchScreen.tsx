import RadioButton from '@app/components/RadioButton'
import RNHeader from '@app/components/RNHeader'
import { FILTER_TYPE } from '@app/config/Constants'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { useAppDispatch, useAppSelector } from '@app/store'
import { colors, dimensions } from '@app/theme'
import React, { useEffect, useState } from 'react'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import R from '@app/assets/R'
import { updateFilter } from './slices/FilterSlice'
import styles from './styles/stylesFilterSearch'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'

const scale = dimensions.width / 375

const FilterSearch = (props: any) => {
  const appDispatch = useAppDispatch()
  const FilterReducer = useAppSelector(state => state.filterReducer)
  const { childIdCate, childNameCate } = props.route.params
  const { data }: any = FilterReducer
  const [sell, setSell] = useState(data?.sell || undefined)
  const [time, setTime] = useState(data?.time || undefined)
  const [price, setPrice] = useState(data?.price || undefined)

  const renderCategory = () => {
    return (
      <View style={styles.v_major}>
        <View style={styles.v_major_content}>
          <Text style={styles.txt_major}>{R.strings().category}</Text>
          <View style={styles.v_arrow}>
            <Text
              style={[
                styles.txt_arrow,
                {
                  textDecorationLine: 'underline',
                },
              ]}
            >
              {childNameCate || R.strings().all}
            </Text>
            {/* <Image style={styles.img24} source={R.images.ic_arrow_right} /> */}
          </View>
        </View>
      </View>
    )
  }
  const renderOption = () => {
    return (
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flex: 1,
          paddingBottom: '10%',
        }}
      >
        {renderCategory()}

        <View style={styles.v_sort}>
          <Text style={[styles.txt_major, { paddingLeft: 15 * scale }]}>
            {R.strings().sort_follwing}
          </Text>
        </View>
        <View style={[styles.v_type, { marginTop: 16 }]}>
          <RadioButton
            isCheck={time == FILTER_TYPE.TIME_NEW_OLD}
            title={R.strings().newest}
            onPress={() => {
              if (time == FILTER_TYPE.TIME_NEW_OLD) {
                setTime(undefined)
                return
              }
              setTime(FILTER_TYPE.TIME_NEW_OLD)
            }}
          />
          <RadioButton
            style={{ marginTop: 18 }}
            isCheck={time == FILTER_TYPE.TIME_OLD_NEW}
            title={R.strings().oldest}
            onPress={() => {
              if (time == FILTER_TYPE.TIME_OLD_NEW) {
                setTime(undefined)
                return
              }
              setTime(FILTER_TYPE.TIME_OLD_NEW)
            }}
          />
          <View style={styles.viewLine}></View>
        </View>

        <View style={[styles.v_type, { marginTop: 16 }]}>
          <RadioButton
            style={{}}
            isCheck={price == FILTER_TYPE.PRICE_MIN_MAX}
            title={R.strings().price_min_to_max}
            onPress={() => {
              if (price == FILTER_TYPE.PRICE_MIN_MAX) {
                setPrice(undefined)
                return
              }
              setPrice(FILTER_TYPE.PRICE_MIN_MAX)
            }}
          />
          <RadioButton
            style={{ marginTop: 18 }}
            isCheck={price == FILTER_TYPE.PRICE_MAX_MIN}
            title={R.strings().price_max_to_min}
            onPress={() => {
              if (price == FILTER_TYPE.PRICE_MAX_MIN) {
                setPrice(undefined)
                return
              }
              setPrice(FILTER_TYPE.PRICE_MAX_MIN)
            }}
          />
          <View style={styles.viewLine}></View>
        </View>

        <View style={styles.v_type}>
          <RadioButton
            style={{ marginTop: 12 }}
            isCheck={sell == FILTER_TYPE.SELL_FAST}
            title={R.strings().amount_hot}
            onPress={() => {
              if (sell == FILTER_TYPE.SELL_FAST) {
                setSell(undefined)
                return
              }
              setSell(FILTER_TYPE.SELL_FAST)
            }}
          />
          <RadioButton
            style={{ marginTop: 18 }}
            isCheck={sell == FILTER_TYPE.SELL_FLASH}
            title={R.strings().amount_sale}
            onPress={() => {
              if (sell == FILTER_TYPE.SELL_FLASH) {
                setSell(undefined)
                return
              }
              setSell(FILTER_TYPE.SELL_FLASH)
            }}
          />
          <View style={styles.viewLine}></View>
        </View>
      </ScrollView>
    )
  }
  const renderBtn = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          appDispatch(
            updateFilter({
              sell,
              time,
              price,
              childIdCate,
              reload: Math.random(),
            })
          )
          NavigationUtil.goBack()
        }}
        style={styles.btn_bottom}
      >
        <Text style={styles.txt_btn}>{R.strings().apply}</Text>
      </TouchableOpacity>
    )
  }
  return (
    <ScreenWrapper
      header={
        <RNHeader
          titleHeader={R.strings().advance_filter}
          back
          rightComponent={
            <TouchableOpacity
              onPress={() => {
                setSell(undefined)
                setTime(undefined)
                setPrice(undefined)
              }}
            >
              <Text children={R.strings().cancel_filter} />
            </TouchableOpacity>
          }
          borderBottomHeader="#CED4DA"
        />
      }
      style={{ backgroundColor: colors.white }}
      children={
        <>
          {renderOption()}
          {renderBtn()}
        </>
      }
    />
  )
}

export default FilterSearch
