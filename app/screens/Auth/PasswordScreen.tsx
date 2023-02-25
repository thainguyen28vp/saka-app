import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import FormInput from '@app/components/FormInput'
import LoadingProgress from '@app/components/LoadingProgress'
import { SCREEN_ROUTER_AUTH } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import AsyncStorageService from '@app/service/AsyncStorage/AsyncStorageService'
import { useAppDispatch } from '@app/store'
import { colors } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { phonePattern } from '@app/utils/FuncHelper'
import { showConfirm } from '@app/utils/GlobalAlertHelper'
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
import reactotron from 'ReactotronConfig'
// import OneSignal from 'react-native-onesignal'
import * as Yup from 'yup'
import { requestLogin } from './AuthApi'
import styles from './styles/stylesLogin'

const { ic_lock, ic_show_password, ic_eye_close } = R.images

const { password, type_password } = R.strings()

interface labelProps {
  text: string
  required?: boolean
  style?: TextStyle
}

const loginSchema = Yup.object().shape({
  // phone: Yup.string().required('Vui lòng nhập số điện thoại!'),
  // .matches(phonePattern, 'Số điện thoại không hợp lệ'),
  password: Yup.string().required(R.strings().please_input_password),
})

const LabelInput = ({ text, required, style }: labelProps) => {
  return required ? (
    <Text style={[styles.labelInput, style]}>{`${text} `}</Text>
  ) : (
    <Text style={[styles.labelInput, style]}>{text}</Text>
  )
}

const PasswordScreen = (props: any) => {
  const info = props.route.params.payload
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [device_id, setDevice_id] = useState<string>()
  const [securePass, setSecurePass] = useState({
    pass: true,
    rePass: true,
  })
  const onLogin = (data: any) => {
    let payload = {
      phone_number: info.user_name,
      password: data.password,
      kiotviet_id: info.kiotviet_id + '',
      device_id: info.device_id || device_id,
      device_type: Platform.OS,
    }
    callAPIHook({
      API: requestLogin,
      payload,
      useLoading: setIsFetchingData,
      typeLoading: 'isLoading',
      onSuccess: res => {
        AsyncStorageService.putToken(res.data.token)
        NavigationUtil.navigate(SCREEN_ROUTER_AUTH.SPLASH)
      },
    })
  }

  const getDeviceID = async () => {
    const deviceState = await OneSignal.getDeviceState()
    reactotron.log('deviceID', deviceState?.userId)
    setDevice_id(deviceState?.userId)
  }
  useEffect(() => {
    getDeviceID()
  }, [])
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
                      {/* <FormInput
                        renderLabel={<LabelInput text={phone} required />}
                        containerStyle={styles.inputContainer}
                        leftIcon={ic_register_login}
                        value={values.phone.trim()}
                        onChangeText={handleChange('phone')}
                        onBlur={handleBlur('phone')}
                        placeholder={type_phone}
                        placeholderTextColor="#8C8C8C"
                        keyboardType="numeric"
                        error={
                          errors.phone && touched.phone
                            ? errors.phone
                            : undefined
                        }
                      /> */}

                      <FormInput
                        renderLabel={<LabelInput text={password} required />}
                        containerStyle={styles.inputContainer}
                        leftIcon={ic_lock}
                        value={values.password.trim()}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        secureTextEntry={securePass.pass}
                        renderRightIcon={
                          <Button
                            onPress={() => {
                              setSecurePass({
                                ...securePass,
                                pass: !securePass.pass,
                              })
                            }}
                            children={
                              <FastImage
                                style={{
                                  width: 20,
                                  height: 20,
                                  marginRight: 5,
                                }}
                                resizeMode={'contain'}
                                tintColor={colors.focus}
                                source={
                                  !securePass.pass
                                    ? ic_show_password
                                    : ic_eye_close
                                }
                              />
                            }
                          />
                        }
                        placeholder={type_password}
                        placeholderTextColor="#8C8C8C"
                        error={
                          errors.password && touched.password
                            ? errors.password
                            : undefined
                        }
                      />
                      {/* <Text
                        onPress={() => onForgot()}
                        style={styles.txtForgotPass}
                      >
                        Quên mật khẩu?
                      </Text> */}
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
                            {R.strings().login}
                          </Text>
                        }
                        onPress={handleSubmit}
                      />
                    </View>
                  )}
                />
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
              style={{ width: 30, height: 30 }}
              source={R.images.ic_back}
              tintColor={colors.white}
            />
          }
        />
      </ImageBackground>
      {isFetchingData && <LoadingProgress />}
    </>
  )
}

export default PasswordScreen
