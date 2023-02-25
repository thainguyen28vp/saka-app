import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import FormInput from '@app/components/FormInput'
import FstImage from '@app/components/FstImage/FstImage'
import LoadingProgress from '@app/components/LoadingProgress'
import { SCREEN_ROUTER_AUTH } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import AsyncStorageService from '@app/service/AsyncStorage/AsyncStorageService'
import { colors, fonts } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { phonePattern } from '@app/utils/FuncHelper'
import { Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import FastImage from 'react-native-fast-image'
import OneSignal from 'react-native-onesignal'
// import OneSignal from 'react-native-onesignal'
import reactotron from 'ReactotronConfig'
import * as Yup from 'yup'
import { requestGetProvinceKiotViet, requestLogin } from './AuthApi'
import styles from './styles/stylesLogin'

interface labelProps {
  text: string
  required?: boolean
  style?: TextStyle
}

const loginSchema = Yup.object().shape({
  // phone: Yup.string().required('Vui lòng nhập số điện thoại!'),
  // .matches(phonePattern, 'Số điện thoại không hợp lệ'),
  // password: Yup.string().required('Vui lòng nhập mật khẩu!'),
})

const ProvinceLoginScreen = (props: any) => {
  const info = props.route.params.payload
  // const info = {
  //   user_name: '123',
  //   listProvinceKiotViet: [
  //     { label: 'Ha Noi', value: 10 },
  //     { label: 'Ho Chi Minh', value: 11 },
  //   ],
  // }
  const [kiotviet_id, setKiotVietId] = useState<String>()
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [device_id, setDevice_id] = useState<string>()

  const onLogin = (data: any) => {
    NavigationUtil.navigate(SCREEN_ROUTER_AUTH.PASSWORD, {
      payload: {
        user_name: info.user_name,
        kiotviet_id,
        device_id: info.device_id || device_id,
      },
    })
  }
  useEffect(() => {
    getDeviceID()
  }, [])
  const getDeviceID = async () => {
    const deviceState = await OneSignal.getDeviceState()
    reactotron.log('deviceID', deviceState?.userId)
    setDevice_id(deviceState?.userId)
  }

  return (
    <>
      <ImageBackground style={styles.main} source={R.images.img_background}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle="light-content"
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Image style={styles.imageLogin} source={R.images.ic_logo} />
            <View
              style={{
                borderWidth: 2,
                borderColor: colors.brand,
                borderRadius: 12,
                backgroundColor: colors.white,
                paddingVertical: 30,
                marginHorizontal: 15,
              }}
            >
              <Text style={styles.txtLogin}>{R.strings().login}</Text>
              {/* <View style={styles.phoneinfo}>
                <FastImage
                  source={R.images.ic_phone}
                  style={styles.iconPhone}
                  tintColor={colors.blue}
                />
                <Text style={styles.info}>0123456789 - Chi nhánh ABCXYZ</Text>
              </View> */}
              <View style={styles.content}>
                <View style={{ marginTop: 24, justifyContent: 'center' }}>
                  <Text style={styles.titleProvice}>
                    {R.strings().select_area}
                  </Text>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    iconStyle={styles.iconStyle}
                    data={info.listProvinceKiotViet}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={R.strings().select_area}
                    value={kiotviet_id}
                    onChange={item => {
                      setKiotVietId(item.value)
                    }}
                    renderLeftIcon={() => (
                      <FstImage
                        source={R.images.ic_address_bold}
                        style={{ width: 24, height: 24 }}
                      />
                    )}
                  />
                  <Button
                    style={styles.btnRegister}
                    children={
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: R.fonts.sf_semi_bold,
                          fontWeight: '500',
                          color: colors.white,
                        }}
                      >
                        {R.strings().continue}
                      </Text>
                    }
                    onPress={onLogin}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: '5%',
            padding: 10,
          }}
          onPress={() => {
            NavigationUtil.goBack()
          }}
          children={
            <FastImage
              tintColor={colors.white}
              style={{ width: 30, height: 30 }}
              source={R.images.ic_back}
            />
          }
        />
      </ImageBackground>
      {isFetchingData && <LoadingProgress />}
    </>
  )
}

export default ProvinceLoginScreen
