import R from '@app/assets/R'
import { Button, DebounceButton } from '@app/components/Button/Button'
import FormInput from '@app/components/FormInput'
import LoadingProgress from '@app/components/LoadingProgress'
import {
  SCREEN_ROUTER,
  SCREEN_ROUTER_APP,
  SCREEN_ROUTER_AUTH,
} from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import AsyncStorageService from '@app/service/AsyncStorage/AsyncStorageService'
import { colors, fonts, WIDTH } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { phonePattern } from '@app/utils/FuncHelper'
import { showMessages } from '@app/utils/GlobalAlertHelper'
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
} from 'react-native'
import FastImage from 'react-native-fast-image'
import OneSignal from 'react-native-onesignal'
// import OneSignal from 'react-native-onesignal'
import reactotron from 'reactotron-react-native'
import * as Yup from 'yup'
import {
  requestCheckPhone,
  requestGetProvinceKiotViet,
  requestLogin,
} from './AuthApi'
import styles from './styles/stylesLogin'

const { ic_phone } = R.images

const { phone, type_phone } = R.strings()

interface labelProps {
  text: string
  required?: boolean
  style?: TextStyle
}

const loginSchema = Yup.object().shape({
  phone: Yup.string()
    .required(R.strings().please_input_phone)
    .matches(phonePattern, R.strings().phone_not_validate),
  // password: Yup.string().required('Vui lòng nhập mật khẩu!'),
})

const LabelInput = ({ text, required, style }: labelProps) => {
  return required ? (
    <Text style={[styles.labelInput, style]}>{`${text} `}</Text>
  ) : (
    <Text style={[styles.labelInput, style]}>{text}</Text>
  )
}

const LoginScreen = (props: any) => {
  // 0366883262
  const [device_id, setDevice_id] = useState<string>()
  const [isFetchingData, setIsFetchingData] = useState(false)

  const onLogin = async (data: any) => {
    callAPIHook({
      API: requestCheckPhone,
      payload: { phone_number: data.phone },
      useLoading: setIsFetchingData,
      typeLoading: 'isLoading',
      onSuccess: res => {
        if (res.data.is_duplicate_phone_number) {
          getProvinceKiotViet(data)
          return
        }
        NavigationUtil.navigate(SCREEN_ROUTER_AUTH.PASSWORD, {
          payload: {
            user_name: data.phone,
            device_id,
            kiotviet_id: res.data?.kiotviet_id,
          },
        })
      },
    })
  }

  const getProvinceKiotViet = (data: any) => {
    callAPIHook({
      API: requestGetProvinceKiotViet,
      payload: data.phone,
      onSuccess: res => {
        let listProvince = res.data.map((item: any) => {
          return (item = {
            label: item.name || item.retailer || R.strings().not_update,
            value: item.id,
          })
        })
        NavigationUtil.navigate(SCREEN_ROUTER_AUTH.PROVINCE_LOGIN, {
          payload: {
            user_name: data.phone,
            device_id,
            listProvinceKiotViet: listProvince,
          },
        })
      },
    })
  }

  const getDeviceID = async () => {
    const deviceState = await OneSignal.getDeviceState()
    // reactotron.log('deviceID', deviceState?.userId)
    setDevice_id(deviceState?.userId)
  }
  useEffect(() => {
    getDeviceID()
  }, [])
  useEffect(() => {}, [])

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
              <View style={styles.content}>
                <Formik
                  initialValues={{
                    phone: '',
                    password: '',
                  }}
                  validationSchema={loginSchema}
                  onSubmit={onLogin}
                  children={({
                    handleSubmit,
                    handleChange,
                    values,
                    handleBlur,
                    errors,
                    touched,
                  }) => (
                    <View style={{ marginTop: 30 }}>
                      <FormInput
                        renderLabel={<LabelInput text={phone} required />}
                        containerStyle={styles.inputContainer}
                        leftIcon={ic_phone}
                        value={values.phone.trim()}
                        onChangeText={handleChange('phone')}
                        onBlur={handleBlur('phone')}
                        placeholder={type_phone}
                        placeholderTextColor={colors.text.dark}
                        keyboardType={
                          Platform.OS === 'android' ? 'numeric' : 'number-pad'
                        }
                        maxLength={10}
                        error={
                          errors.phone && touched.phone
                            ? errors.phone
                            : undefined
                        }
                      />

                      <Button
                        style={styles.btnRegister}
                        children={
                          <Text
                            style={{
                              // ...fonts.semi_bold16 * scale,
                              fontSize: 16,
                              fontFamily: R.fonts.sf_semi_bold,
                              fontWeight: '500',
                              color: colors.white,
                            }}
                          >
                            {R.strings().continue}
                          </Text>
                        }
                        onPress={handleSubmit}
                      />
                    </View>
                  )}
                />
              </View>
              <TouchableOpacity
                onPress={() =>
                  NavigationUtil.navigate(SCREEN_ROUTER_AUTH.SUPPORT)
                }
              >
                <Text style={styles.txtSupport}>
                  {R.strings().you_want_support}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <DebounceButton
          style={{
            position: 'absolute',
            top: '6%',
            right: '5%',
          }}
          onPress={() => {
            NavigationUtil.replace(SCREEN_ROUTER.MAIN)
          }}
          children={
            <FastImage
              source={R.images.ic_close}
              style={{
                width: 35,
                height: 35,
              }}
              tintColor={colors.white}
            />
          }
        />
      </ImageBackground>
      {isFetchingData && <LoadingProgress />}
    </>
  )
}

export default LoginScreen
