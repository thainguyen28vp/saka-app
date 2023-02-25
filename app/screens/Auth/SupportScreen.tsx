import R from '@app/assets/R'
import { Button, DebounceButton } from '@app/components/Button/Button'
import FormInput from '@app/components/FormInput'
import LoadingProgress from '@app/components/LoadingProgress'
import { SCREEN_ROUTER_AUTH } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import AsyncStorageService from '@app/service/AsyncStorage/AsyncStorageService'
import { colors, fonts, WIDTH } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { phonePattern } from '@app/utils/FuncHelper'
import { showMessages } from '@app/utils/GlobalAlertHelper'
import ToastShow from '@app/utils/ToastHelper'
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
// import OneSignal from 'react-native-onesignal'
import reactotron from 'reactotron-react-native'
import * as Yup from 'yup'
import {
  requestCheckPhone,
  requestGetProvinceKiotViet,
  requestLogin,
  requestMailSupport,
} from './AuthApi'
import styles from './styles/stylesLogin'

const { ic_phone, ic_user_tab } = R.images
const scale = WIDTH / 375
const { phone, type_phone, type_name, full_name } = R.strings()

interface labelProps {
  text: string
  required?: boolean
  style?: TextStyle
}

const supportSchema = Yup.object().shape({
  phone: Yup.string()
    .required(R.strings().please_input_phone)
    .matches(phonePattern, R.strings().phone_not_validate),
  full_name: Yup.string().required(R.strings().please_input_fullname),
})

const SupportScreen = (props: any) => {
  const [device_id, setDevice_id] = useState<string>()
  const [isFetchingData, setIsFetchingData] = useState(false)

  const onSubmit = (data: any) => {
    if (!!!data.full_name.trim()) {
      ToastShow(R.strings().please_input_fullname)
      return
    }
    const payload = {
      phone_number: data.phone,
      full_name: data.full_name.trim(),
    }
    callAPIHook({
      API: requestMailSupport,
      payload,
      useLoading: setIsFetchingData,
      // typeLoading: 'isLoading',
      onSuccess: res => {
        showMessages('', R.strings().send_request_support_successfully, () => {
          NavigationUtil.goBack()
        })
      },
    })
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
            <Image
              style={[styles.imageLogin, { marginBottom: 40 }]}
              source={R.images.ic_logo}
            />
            <View
              style={{
                borderWidth: 2,
                borderColor: colors.brand,
                borderRadius: 12,
                backgroundColor: colors.white,
                paddingVertical: 30,
                marginHorizontal: 15,
                marginBottom: 30,
              }}
            >
              <Text style={styles.txtLogin}>{R.strings().support}</Text>
              {/* <View style={styles.phoneinfo}>
                <FastImage
                  source={R.images.ic_phone}
                  style={styles.iconPhone}
                  tintColor={colors.blue}
                />
                <Text style={styles.info}>0123456789 - Chi nhánh ABCXYZ</Text>
              </View>
              <Text style={styles.description}>
                Hãy để lại thông tin của bạn, chúng tôi sẽ liên hệ với bạn
              </Text> */}
              <View style={styles.content}>
                <Formik
                  initialValues={{
                    phone: '',
                    full_name: '',
                  }}
                  validationSchema={supportSchema}
                  onSubmit={onSubmit}
                  children={({
                    handleSubmit,
                    handleChange,
                    values,
                    handleBlur,
                    errors,
                    touched,
                  }) => (
                    <View>
                      <FormInput
                        // renderLabel={<LabelInput text={full_name} required />}
                        label={R.strings().full_name}
                        containerStyle={styles.inputContainer}
                        leftIcon={ic_user_tab}
                        value={values.full_name}
                        onChangeText={handleChange('full_name')}
                        onBlur={handleBlur('full_name')}
                        placeholder={type_name}
                        placeholderTextColor="#8C8C8C"
                        error={
                          errors.full_name && touched.full_name
                            ? errors.full_name
                            : undefined
                        }
                      />
                      <FormInput
                        //renderLabel={<LabelInput text={phone} required />}
                        label={R.strings().phone}
                        containerStyle={styles.inputContainer}
                        leftIcon={ic_phone}
                        value={values.phone.trim()}
                        onChangeText={handleChange('phone')}
                        onBlur={handleBlur('phone')}
                        placeholder={type_phone}
                        placeholderTextColor="#8C8C8C"
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

export default SupportScreen
