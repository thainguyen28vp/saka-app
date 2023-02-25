import React, { useState, useEffect, useRef, memo } from 'react'
import { View, Text, Platform, Keyboard } from 'react-native'
import R from '@app/assets/R'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { colors, fonts, styleView, dimensions } from '@app/theme'
import { Button } from '@app/components/Button/Button'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { SCREEN_ROUTER_APP } from '@config/screenType'
import { callAPIHook } from '@app/utils/CallApiHelper'
import FormInput from '@app/components/FormInput'
import BottomInforEditableForm from './components/BottomInforEditableForm'
import {
  getReceiverInfor,
  requestAddNewReceiver,
  requestDeleteUserAddress,
  requestEditReceiver,
} from '@app/service/Network/shop/ShopApi'
import { useAppSelector } from '@app/store'
import {
  getListDistrict,
  getListWard,
} from '@app/service/Network/default/DefaultApi'
import { showConfirm, showMessages } from '@app/utils/GlobalAlertHelper'
import isEqual from 'react-fast-compare'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { phonePattern } from '@app/utils/FuncHelper'
import BottomModal from './components/BottomModal'
import reactotron from 'reactotron-react-native'
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper'
import Toast from 'react-native-root-toast'
import ToastShow from '@app/utils/ToastHelper'

const { width } = dimensions

type ListAddressId = {
  provinceId: number | null
  districtId: number | null
  wardId: number | null
}

const EditUserSchema = Yup.object().shape({
  name: Yup.string().required(R.strings().please_input_fullname),
  phone: Yup.string()
    .required(R.strings().please_input_phone)
    .matches(phonePattern, R.strings().phone_not_validate),
  province: Yup.object().required(),
  district: Yup.object().required(),
  ward: Yup.object().required(),
  address: Yup.string().required(R.strings().please_input_address),
})

const SELECT_TYPE = {
  PROVINCE: 0,
  DISTRICT: 1,
  WARD: 2,
}

const EditReceiverInforScreen = (props: any) => {
  const id = props.route.params?.id
  const { reloadList, isPayment, itemInfoReciver, checkDefault } =
    props?.route.params
  const idReceiver = props?.route?.params?.idReceiver
  const selectReceiver = props?.route?.params?.selectReceiver
  const ProvinceData = useAppSelector((state: any) => state.provinceReducer)
  const listProvince = ProvinceData.data!.map((item: any) => ({
    label: item.name,
    value: item.id,
  }))

  const [isLoading, setIsloading] = useState<boolean>()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [userData, setUserData] = useState<any>(itemInfoReciver)
  const [listAddress, setListAddress] = useState<any>([])
  const [isLoadingAddress, setIsLoadingAddress] = useState<boolean>(false)

  const selectTypeRef = useRef<number>(SELECT_TYPE.PROVINCE)
  const listAddressIdRef = useRef<ListAddressId>({
    provinceId: itemInfoReciver?.province_id || null,
    districtId: itemInfoReciver?.district_id || null,
    wardId: itemInfoReciver?.ward_id || null,
  })

  const handleOnSubmit = (form: any) => {
    // const payload = {
    //   name: form.name,
    //   phone: form.phone,
    //   df_province_id: form.province.id,
    //   df_district_id: form.district.id,
    //   df_ward_id: form.ward.id,
    //   address: form.address,
    //   location_address: form.locationAddress,
    //   long: 0,
    //   lat: 0,
    //   is_default: form.isDefault ? 1 : 0,
    // }
    if (!!!form.name.trim()) {
      ToastShow(R.strings().please_input_fullname)
      return
    }
    if (!!!form.address.trim()) {
      ToastShow(R.strings().please_input_address)
      return
    }
    const payload = {
      is_default: !!form.isDefault,
      phone_number: form.phone,
      name: form.name.trim(),
      address: form.address.trim(),
      ward_id: form.ward.id,
      district_id: form.district.id,
      province_id: form.province.id,
    }
    callAPIHook({
      API: !id ? requestAddNewReceiver : requestEditReceiver,
      payload: !id ? payload : { id, body: { ...payload } },
      useLoading: setIsloading,
      onSuccess: res => {
        ToastShow(R.strings().save_successfully)
        reloadList()
        if (isPayment) {
          NavigationUtil.goBack()
          return
        }
        NavigationUtil.navigate(SCREEN_ROUTER_APP.SELECT_RECEIVER)
        // showMessages(
        //   R.strings().notification,
        //   R.strings().save_successfully,
        //   () => {

        //   }
        // )
      },
    })
  }

  const onDeletePress = () => {
    if (userData.is_default) {
      ToastShow('Không thể xoá địa chỉ mặc định')
      return
    }
    showConfirm(
      R.strings().delete_address,
      R.strings().do_you_want_delete_address,
      () => {
        callAPIHook({
          API: requestDeleteUserAddress,
          payload: id,
          onSuccess: async res => {
            await reloadList()
            if (idReceiver == id) selectReceiver(undefined)
            setTimeout(() => {
              ToastShow(R.strings().delete_successfully)
              NavigationUtil.goBack()
              // showMessages('', R.strings().delete_successfully, () => {
              //   NavigationUtil.goBack()
              // })
            }, 150)
          },
        })
      }
    )
  }

  const renderTitleModal = (): string => {
    if (selectTypeRef.current == SELECT_TYPE.PROVINCE)
      return R.strings().select_province
    else if (selectTypeRef.current == SELECT_TYPE.DISTRICT)
      return R.strings().select_districts
    else return R.strings().select_wards
  }

  const renderDefaultValue = (): number | null => {
    if (selectTypeRef.current == SELECT_TYPE.PROVINCE)
      return listAddressIdRef.current.provinceId
    else if (selectTypeRef.current == SELECT_TYPE.DISTRICT)
      return listAddressIdRef.current.districtId
    else return listAddressIdRef.current.wardId
  }

  const updateListDataAddress = () => {
    if (selectTypeRef.current == SELECT_TYPE.PROVINCE)
      setListAddress(listProvince)
    else {
      const isDistrictPress = selectTypeRef.current == SELECT_TYPE.DISTRICT

      if (
        (isDistrictPress && !listAddressIdRef.current.provinceId) ||
        (!isDistrictPress && !listAddressIdRef.current.districtId)
      )
        setListAddress([])
      else
        callAPIHook({
          API: isDistrictPress ? getListDistrict : getListWard,
          useLoading: setIsLoadingAddress,
          payload: isDistrictPress
            ? { province_id: listAddressIdRef.current.provinceId }
            : { district_id: listAddressIdRef.current.districtId },
          onSuccess: res => {
            setListAddress(
              res.data.map((item: any) => ({
                label: item.name,
                value: item.id,
              }))
            )
          },
        })
    }
  }
  const getUserData = () => {
    const payload = { id }
    callAPIHook({
      API: getReceiverInfor,
      payload,
      useLoading: setIsloading,
      onSuccess: res => {
        listAddressIdRef.current = {
          provinceId: res.data.DFProvince.id,
          districtId: res.data.DFDistrict.id,
          wardId: res.data.DFWard.id,
        }
        setUserData(res.data)
      },
    })
  }

  useEffect(() => {
    !!id && getUserData()
  }, [id])

  useEffect(() => {
    modalVisible && updateListDataAddress()
  }, [modalVisible])
  reactotron.log(
    !checkDefault ? true : Boolean(userData?.is_default),
    !checkDefault
  )
  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: userData?.name || '',
        phone: userData?.phone_number || '',
        address: userData?.address || '',
        province: !!userData?.province
          ? { name: userData?.province.name, id: userData.province.id }
          : null,
        district: !!userData?.district
          ? { name: userData.district.name, id: userData.district.id }
          : null,
        ward: !!userData?.ward
          ? { name: userData.ward.name, id: userData.ward.id }
          : null,
        locationAddress: '',
        isDefault: !checkDefault ? true : Boolean(userData?.is_default),
      }}
      onSubmit={handleOnSubmit}
      validationSchema={EditUserSchema}
      children={({
        handleSubmit,
        handleChange,
        values,
        handleBlur,
        errors,
        touched,
        setFieldValue,
        setFieldTouched,
      }) => (
        <ScreenWrapper
          back
          color={colors.black}
          titleHeader={!!id ? 'Sửa địa chỉ' : 'Thêm địa chỉ'}
          backgroundHeader={colors.white}
          scroll
          isLoading={isLoading}
          // unsafe
          style={{
            paddingBottom: 16,
            paddingTop: 8,
            flexGrow: 1,
            justifyContent: 'space-between',
          }}
        >
          <View style={{}}>
            <View
              style={{
                marginTop: 2,
                paddingTop: 10,
                backgroundColor: colors.white,
                paddingHorizontal: 16,
              }}
            >
              <FormInput
                value={values.name}
                label={R.strings().full_name}
                placeholder={R.strings().type_name}
                onBlur={handleBlur('name')}
                onChangeText={handleChange('name')}
                //  onBlur={handleBlur('name')}
                error={errors.name && touched.name ? errors.name : undefined}
              />
              <FormInput
                value={values.phone.trim()}
                label={R.strings().phone}
                placeholder={R.strings().type_phone}
                keyboardType={
                  Platform.OS === 'android' ? 'numeric' : 'number-pad'
                }
                maxLength={10}
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                error={errors.phone && touched.phone ? errors.phone : undefined}
              />
              <FormInput
                placeholder={R.strings().select_province}
                label={R.strings().province}
                selectedText={values.province?.name}
                clickable
                onPress={() => {
                  selectTypeRef.current = SELECT_TYPE.PROVINCE
                  setModalVisible(true)
                  Keyboard.dismiss()
                }}
                showRightIcon
                error={
                  errors.province && touched.province && !values.province
                    ? R.strings().please_select_province
                    : undefined
                }
              />
              <FormInput
                label={R.strings().districts}
                placeholder={R.strings().select_districts}
                selectedText={values.district?.name}
                onPress={() => {
                  selectTypeRef.current = SELECT_TYPE.DISTRICT
                  setModalVisible(true)
                  Keyboard.dismiss()
                }}
                clickable
                error={
                  errors.district && touched.district && !values.district
                    ? R.strings().please_select_districts
                    : undefined
                }
                showRightIcon
              />
              <FormInput
                label={R.strings().wards}
                placeholder={R.strings().select_wards}
                selectedText={values.ward?.name}
                clickable
                onPress={() => {
                  selectTypeRef.current = SELECT_TYPE.WARD
                  setModalVisible(true)
                  Keyboard.dismiss()
                }}
                error={
                  errors.ward && touched.ward && !values.ward
                    ? R.strings().please_select_wards
                    : undefined
                }
                showRightIcon
              />
              <FormInput
                value={values.address}
                label={R.strings().address_detail}
                placeholder={'Ví dụ: 179 Vĩnh Hưng'}
                onChangeText={handleChange('address')}
                error={
                  errors.address && touched.address ? errors.address : undefined
                }
              />
            </View>
            <BottomInforEditableForm
              // idReceiver={idReceiver}
              // disable={!!checkDefault}
              showDefaulBar
              showDeleteBar={!!id}
              onDeletePress={onDeletePress}
              switchValue={values.isDefault}
              onSwitchChange={() => {
                if (!checkDefault || !!itemInfoReciver?.is_default) {
                  ToastShow('Bạn cần có ít nhất 1 địa chỉ mặc định!')
                  return
                }
                setFieldValue('isDefault', !values.isDefault)
              }}
            />
          </View>

          <Button
            style={{
              ...styleView.centerItem,
              width: width - 40,
              height: 50,
              backgroundColor: colors.primary,
              borderRadius: 8,
              alignSelf: 'center',
              marginTop: 35,
            }}
            onPress={handleSubmit}
            children={
              <Text
                style={{ ...fonts.semi_bold16, color: colors.white }}
                children={R.strings().save}
              />
            }
          />
          <BottomModal
            title={renderTitleModal()}
            isVisible={modalVisible}
            data={listAddress}
            defaultValue={renderDefaultValue()}
            onClose={() => {
              if (selectTypeRef.current == SELECT_TYPE.PROVINCE) {
                setFieldTouched('province', true)
              } else if (selectTypeRef.current == SELECT_TYPE.DISTRICT) {
                setFieldTouched('district', true)
              } else {
                setFieldTouched('ward', true)
              }
              Keyboard.dismiss()
              setModalVisible(false)
            }}
            onBackdropPress={() => setModalVisible(false)}
            isLoadingData={isLoadingAddress}
            onSelectChange={(item: any) => {
              if (selectTypeRef.current == SELECT_TYPE.PROVINCE) {
                if (listAddressIdRef.current.provinceId != item.value) {
                  listAddressIdRef.current.provinceId = item.value
                  setFieldValue('province', {
                    name: item.label,
                    id: item.value,
                  })
                  setFieldValue('ward', null)
                  setFieldValue('district', null)
                }
              } else if (selectTypeRef.current == SELECT_TYPE.DISTRICT) {
                if (listAddressIdRef.current.provinceId != item.value) {
                  listAddressIdRef.current.districtId = item.value
                  setFieldValue('district', {
                    name: item.label,
                    id: item.value,
                  })
                  setFieldValue('ward', null)
                }
              } else {
                listAddressIdRef.current.wardId = item.value
                setFieldValue('ward', { name: item.label, id: item.value })
              }
              Keyboard.dismiss()
              setModalVisible(false)
            }}
          />
        </ScreenWrapper>
      )}
    />
  )
}

export default memo(EditReceiverInforScreen, isEqual)
