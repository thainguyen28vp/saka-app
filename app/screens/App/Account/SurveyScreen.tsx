import { View, Text, Platform, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { colors, fonts, styleView, WIDTH } from '@app/theme'
import { Formik } from 'formik'
import R from '@app/assets/R'
import * as Yup from 'yup'
import { phonePattern, mailPattern } from '@app/utils/FuncHelper'
import FormInput from '@app/components/FormInput'
import { Button } from '@app/components/Button/Button'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { requestSurveyUser } from '@app/service/Network/account/AccountApi'
import { showMessages } from '@app/utils/GlobalAlertHelper'
import NavigationUtil from '@app/navigation/NavigationUtil'
import Toast from 'react-native-root-toast'
import ToastShow from '@app/utils/ToastHelper'
const SurveyScreen = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const EditUserSchema = Yup.object().shape({
    name: Yup.string().required(R.strings().please_input_fullname),
    phone: Yup.string()
      .required(R.strings().please_input_phone)
      .matches(phonePattern, R.strings().phone_not_validate),
    email: Yup.string()
      .required(R.strings().please_input_email)
      .matches(mailPattern, R.strings().email_not_validate),
    content: Yup.string().required(R.strings().please_input_survey_content),
  })
  const handleOnSubmit = (form: any) => {
    if (!!!form.name.trim()) {
      ToastShow(R.strings().please_input_fullname)
      return
    }
    if (!!!form.content.trim()) {
      ToastShow(R.strings().please_input_survey_content)
      return
    }
    const payload = {
      description: form.content.trim(),
      email: form.email,
      phone_number: form.phone,
      full_name: form.name.trim(),
    }
    callAPIHook({
      API: requestSurveyUser,
      useLoading: setIsLoading,
      payload: payload,
      onSuccess: res => {
        NavigationUtil.goBack()
        ToastShow(R.strings().send_successfully)
        // showMessages('', R.strings().send_successfully, () => {

        // })
      },
    })
  }
  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: '',
        phone: '',
        email: '',
        content: '',
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
          titleHeader={R.strings().user_survey}
          backgroundHeader={colors.white}
          scroll
          borderBottomHeader={colors.line}
          dialogLoading={isLoading}
          // unsafe
          style={styles.viewScreen}
        >
          <View style={styles.wrapperView}>
            <FormInput
              value={values.name}
              label={R.strings().full_name}
              placeholder={R.strings().type_name}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
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
              placeholder={R.strings().type_email}
              label={R.strings().email}
              value={values.email.trim()}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              error={errors.email && touched.email ? errors.email : undefined}
            />
            <FormInput
              value={values.content}
              label={R.strings().survey_content}
              placeholder={R.strings().type_survey_content}
              onChangeText={handleChange('content')}
              onBlur={handleBlur('content')}
              error={
                errors.content && touched.content ? errors.content : undefined
              }
            />
          </View>
          <Button
            style={styles.btn}
            onPress={handleSubmit}
            children={
              <Text style={styles.txtBtn} children={R.strings().send} />
            }
          />
        </ScreenWrapper>
      )}
    />
  )
}
const styles = StyleSheet.create({
  wrapperView: {
    ...styleView.sharedStyle,
    marginTop: 2,
    paddingTop: 10,
  },
  viewScreen: {
    paddingTop: 8,
    justifyContent: 'space-between',
    flex: 1,
    backgroundColor: colors.white,
  },
  btn: {
    ...styleView.centerItem,
    width: WIDTH,
    height: 50,
    backgroundColor: colors.primary,
    alignSelf: 'center',
    marginTop: 35,
  },
  txtBtn: {
    ...fonts.semi_bold16,
    color: colors.white,
  },
})
export default SurveyScreen
