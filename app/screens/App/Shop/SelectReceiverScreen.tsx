import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import R from '@app/assets/R'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { colors, dimensions, fonts, styleView, WIDTH } from '@app/theme'
import { Button } from '@app/components/Button/Button'
import FastImage from 'react-native-fast-image'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { callAPIHook } from '@app/utils/CallApiHelper'
import Empty from '@app/components/Empty/Empty'
import RNHeader from '@app/components/RNHeader'
import { SearchBar } from 'react-native-elements'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import {
  getListReceiver,
  requestDeleteUserAddress,
} from '@app/service/Network/shop/ShopApi'
import _ from 'lodash'
import { Customer } from './model/Customer'
import { showConfirm, showMessages } from '@app/utils/GlobalAlertHelper'
import styles from './styles/StylesSelectReceiver'
import ToastShow from '@app/utils/ToastHelper'
import reactotron from 'ReactotronConfig'
import { removeVietnameseTones } from '@app/utils/ConvertVietnamese'
const { width } = dimensions

const SelectReceiverScreen = (props: any) => {
  const reloadList = props.route.params?.reloadList
  const giftSign = props.route.params?.giftSign
  const selectReceiver = props.route.params?.selectReceiver
  const idReceiver = props.route.params?.idReceiver
  const selectUserAddress = props.route.params?.selectUserAddress
  const setVisible = props.route.params?.setVisible
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [listReceiver, setListReceiver] = useState<any>()
  const [listReceiverAll, setListReceiverAll] = useState<any>()
  const [textSearch, setTextSearch] = useState<string>('')
  const [enableEdit, setEnableEdit] = useState<boolean>(false)

  const id = props.route.params?.id

  const getData = (search?: string) => {
    callAPIHook({
      API: getListReceiver,
      payload: { search },
      useLoading: typeof search == 'string' ? undefined : setIsLoading,
      onSuccess: res => {
        setListReceiver(res.data)
        setListReceiverAll(res.data)
        reloadList()
      },
    })
  }
  const searchData = (text: string) => {
    const data_clone = [...listReceiverAll]
    if (text == 'string') {
      getData()
      return
    }
    const convertString = removeVietnameseTones(text)

    setListReceiver(
      data_clone.filter((x: any) => {
        const convertName = removeVietnameseTones(x.name)
        const convertAddress = removeVietnameseTones(x.address)
        const convertProvince = removeVietnameseTones(x.province?.name)
        const convertDistrict = removeVietnameseTones(x.district?.name)
        const convertWard = removeVietnameseTones(x.ward?.name)
        return (
          convertName.trim().toLowerCase().includes(convertString) ||
          x.phone_number.trim().toLowerCase().includes(convertString) ||
          convertAddress.trim().toLowerCase().includes(convertString) ||
          convertProvince.trim().toLowerCase().includes(convertString) ||
          convertDistrict.trim().toLowerCase().includes(convertString) ||
          convertWard.trim().toLowerCase().includes(convertString)
        )
      })
    )
  }

  const handleDeleteAddress = async (item: any) => {
    if (item.is_default) {
      ToastShow('Không được xoá địa chỉ mặc định')
      return
    }
    callAPIHook({
      API: requestDeleteUserAddress,
      payload: item.id,
      onSuccess: async res => {
        // showMessages('', R.strings().delete_address_successfully, getData)

        //setTimeout(() => {
        await getData()
        //}, 2000)
        ToastShow(R.strings().delete_address_successfully)
        if (idReceiver == item.id) selectReceiver(undefined)
      },
    })
  }

  useEffect(() => {
    getData()
  }, [id])

  const _inforItem = ({ item, index }: { item: Customer; index: number }) => {
    return (
      <Button
        key={index}
        // disabled={enableEdit ? false : !!accountSign}
        onLongPress={() => {
          showConfirm('', R.strings().do_you_want_delete_address, () =>
            handleDeleteAddress(item)
          )
        }}
        onPress={() => {
          if (!!selectReceiver) {
            selectReceiver(item)
            NavigationUtil.goBack()
          } else
            NavigationUtil.navigate(SCREEN_ROUTER_APP.RECEIVER_EDIT, {
              id: item.id,
              reloadList: getData,
              itemInfoReciver: item,
              checkDefault: !!listReceiver.length,
              idReceiver: idReceiver,
              selectReceiver,
            })
        }}
        children={
          <View style={styles.inforContainer}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 6,
                }}
              >
                <FastImage
                  style={styles.iconMap}
                  source={R.images.ic_map_fill}
                  tintColor={item.is_default ? colors.primary : '#69747E'}
                />
                <Text
                  style={styles.containerReceiver}
                  children={`${item.name} 〡 ${item?.phone_number}`}
                />
                <Button
                  onPress={() =>
                    NavigationUtil.navigate(SCREEN_ROUTER_APP.RECEIVER_EDIT, {
                      id: item.id,
                      reloadList: getData,
                      itemInfoReciver: item,
                      checkDefault: !!listReceiver.length,
                      idReceiver: idReceiver,
                      selectReceiver,
                    })
                  }
                  children={
                    <Text style={styles.txtEdit}>{R.strings().edit}</Text>
                  }
                />
              </View>
              <Text
                style={styles.txtAddress}
                children={`${item.address}, ${item?.ward.name}, ${item?.district?.name}, ${item?.province?.name}`}
              />
            </View>
          </View>
        }
      />
    )
  }

  const renderButtonAdd = () => {
    if (listReceiverAll?.length >= 10) return <></>
    return (
      <View
        style={{
          alignItems: 'center',
        }}
      >
        {!enableEdit && (
          <Button
            onPress={() =>
              NavigationUtil.navigate(SCREEN_ROUTER_APP.RECEIVER_EDIT, {
                reloadList: getData,
                checkDefault: !!listReceiver.length,
                idReceiver: idReceiver,
                selectReceiver,
                // getDataInfoPayment: () => props.route.params.getData(),
              })
            }
            style={{ maxWidth: '100%', position: 'absolute', bottom: 0 }}
            children={
              <View style={styles.addReceiverView}>
                <FastImage
                  style={{ width: 24, height: 24 }}
                  source={R.images.ic_add}
                  tintColor={colors.white}
                />
                <Text style={styles.txtAddReceiver}>
                  {R.strings().add_address}
                </Text>
              </View>
            }
          />
        )}
      </View>
    )
  }
  const renderData = () => {
    return (
      <View style={{ flex: 1 }}>
        <SearchBar
          platform={'default'}
          searchIcon={
            <FastImage
              resizeMode="contain"
              style={styles.icSearch}
              source={R.images.ic_search}
              tintColor={colors.gray}
            />
          }
          placeholder={R.strings().search_receiver}
          placeholderTextColor={colors.text.dark}
          value={textSearch}
          containerStyle={styles.container_search}
          inputContainerStyle={styles.input_container}
          style={styles.txtInput}
          onChangeText={text => {
            //setPage(1)
            if (text[0] != ' ') {
              setTextSearch(text)
              _.debounce(() => searchData(text.toLowerCase()), 300)()
            }
          }}
          onClear={() => {
            setTextSearch('')
          }}
          autoFocus
        />

        <FlatList
          data={listReceiver}
          refreshing={isLoading}
          onRefresh={getData}
          renderItem={_inforItem}
          keyExtractor={item => `${item.id}`}
          ListEmptyComponent={() => <Empty />}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 90 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    )
  }
  return (
    <ScreenWrapper
      unsafe
      color={colors.black}
      backgroundHeader={colors.white}
      isLoading={isLoading}
      // header={header()}
      titleHeader={R.strings().list_address}
      back
      style={styles.container}
    >
      <TouchableWithoutFeedback
        style={{ flex: 1 }}
        onPress={() => Keyboard.dismiss()}
      >
        <View style={{ flex: 1 }}>
          {renderData()}
          {renderButtonAdd()}
        </View>
      </TouchableWithoutFeedback>
    </ScreenWrapper>
  )
}

export default SelectReceiverScreen
