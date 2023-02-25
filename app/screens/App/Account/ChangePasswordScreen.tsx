import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Formik } from 'formik'
import FormInput from '@app/components/FormInput'
import R from '@app/assets/R'
import { fonts, styleView, colors } from '@app/theme'
import { Button } from '@app/components/Button/Button'
import * as Yup from 'yup'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { requestChangePassword } from '@app/service/Network/account/AccountApi'
import { showMessages } from '@app/utils/GlobalAlertHelper'
import NavigationUtil from '@app/navigation/NavigationUtil'
import FastImage from 'react-native-fast-image'
import Toast from 'react-native-root-toast'
import ToastShow from '@app/utils/ToastHelper'

type PasswordPayload = {
  oldPass: string
  newPass: string
  verify: string
}

const changePassSchema = Yup.object().shape({
  oldPass: Yup.string().required(R.strings().not_allow_empty),
  newPass: Yup.string()
    .required(R.strings().not_allow_empty)
    .notOneOf([Yup.ref('oldPass')], R.strings().not_duplicate_password_now)
    .min(6, R.strings().not_less_than_6_character)
    .max(20, R.strings().not_exceed_21_character),
  verify: Yup.string()
    .required(R.strings().not_allow_empty)
    .oneOf([Yup.ref('newPass')], R.strings().not_duplicate_with_password),
})

const ChangePasswordScreen = () => {
  const [dialogLoading, setDialogLoading] = useState<boolean>(false)
  const [formSecureText, setFormSecureText] = useState({
    current: true,
    new: true,
    verify: true,
  })

  const handleOnSubmit = (data: PasswordPayload) => {
    const payload = {
      current_password: data.oldPass,
      new_password: data.newPass,
    }
    console.log(payload)
    callAPIHook({
      API: requestChangePassword,
      payload,
      useLoading: setDialogLoading,
      onSuccess: res => {
        NavigationUtil.goBack()
        ToastShow(R.strings().change_password_successfully)
      },
    })
  }

  return (
    <ScreenWrapper
      back
      unsafe
      dialogLoading={dialogLoading}
      titleHeader={R.strings().change_password}
      backgroundHeader={colors.white}
      color={colors.black}
    >
      <Formik
        initialValues={{ oldPass: '', newPass: '', verify: '' }}
        validationSchema={changePassSchema}
        onSubmit={handleOnSubmit}
        children={({
          handleSubmit,
          handleChange,
          values,
          handleBlur,
          errors,
          touched,
        }) => (
          <View style={styles.container}>
            <View>
              <FormInput
                value={values.oldPass.trim()}
                label={R.strings().password_old}
                placeholder={R.strings().password_old}
                secureTextEntry={formSecureText.current}
                onChangeText={handleChange('oldPass')}
                onBlur={handleBlur('oldPass')}
                error={
                  errors.oldPass && touched.oldPass ? errors.oldPass : undefined
                }
                renderRightIcon={
                  <Button
                    onPress={() =>
                      setFormSecureText(prev => ({
                        ...prev,
                        current: !prev.current,
                      }))
                    }
                    children={
                      <FastImage
                        style={{ width: 20, height: 20 }}
                        source={
                          formSecureText.current
                            ? R.images.ic_eye_close
                            : R.images.ic_eye
                        }
                      />
                    }
                  />
                }
              />
              <FormInput
                value={values.newPass.trim()}
                label={R.strings().password_new}
                placeholder={R.strings().password_new}
                secureTextEntry={formSecureText.new}
                onChangeText={handleChange('newPass')}
                onBlur={handleBlur('newPass')}
                error={
                  errors.newPass && touched.newPass ? errors.newPass : undefined
                }
                renderRightIcon={
                  <Button
                    onPress={() =>
                      setFormSecureText(prev => ({
                        ...prev,
                        new: !prev.new,
                      }))
                    }
                    children={
                      <FastImage
                        style={{ width: 20, height: 20 }}
                        source={
                          formSecureText.new
                            ? R.images.ic_eye_close
                            : R.images.ic_eye
                        }
                      />
                    }
                  />
                }
              />
              <FormInput
                value={values.verify.trim()}
                label={R.strings().password_confirm}
                placeholder={R.strings().password_confirm}
                secureTextEntry={formSecureText.verify}
                onChangeText={handleChange('verify')}
                onBlur={handleBlur('verify')}
                error={
                  errors.verify && touched.verify ? errors.verify : undefined
                }
                renderRightIcon={
                  <Button
                    onPress={() =>
                      setFormSecureText(prev => ({
                        ...prev,
                        verify: !prev.verify,
                      }))
                    }
                    children={
                      <FastImage
                        style={{ width: 20, height: 20 }}
                        source={
                          formSecureText.verify
                            ? R.images.ic_eye_close
                            : R.images.ic_eye
                        }
                      />
                    }
                  />
                }
              />
            </View>
            <Button
              style={[styles.button]}
              children={
                <Text style={{ ...fonts.semi_bold16, color: colors.white }}>
                  {R.strings().update}
                </Text>
              }
              onPress={handleSubmit}
            />
          </View>
        )}
      />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginTop: 2,
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  button: {
    ...styleView.centerItem,
    width: '100%',
    height: 45,
    marginVertical: 30,
    borderRadius: 8,
    alignSelf: 'center',
    backgroundColor: colors.primary,
  },
})

export default ChangePasswordScreen
