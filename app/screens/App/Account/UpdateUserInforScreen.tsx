import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from 'react-native'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { colors, fonts, styleView } from '@app/theme'
import * as Yup from 'yup'
import Modal from 'react-native-modal'
import FastImage from 'react-native-fast-image'
import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import FormInput from '@app/components/FormInput'
// import { Accessory, Avatar } from 'react-native-elements'
import { Formik } from 'formik'
import DateUtil from '@app/utils/DateUtil'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { requestUpdateUserInfor } from '@app/service/Network/account/AccountApi'
import { showMessages } from '@app/utils/GlobalAlertHelper'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { useAppSelector } from '@app/store'
// import { requestUploadSingleFile } from '@app/service/Network/files/FilesApi'
import reactotron from 'ReactotronConfig'
import { mailPattern } from '@app/utils/FuncHelper'
import Avatar from '@app/components/Avatar'
import Toast from 'react-native-root-toast'
import ToastShow from '@app/utils/ToastHelper'

const updateUserSchema = Yup.object().shape({
  name: Yup.string().required(R.strings().please_input_fullname),
  email: Yup.string()
    // .required(R.strings().please_input_email)
    .matches(mailPattern, R.strings().email_not_validate),
  address: Yup.string().optional(),
  profileImgUrl: Yup.string(),
  // date: Yup.date().required(R.strings().please_input_birtday),
})

const GENDER = {
  MALE: 'man',
  FEMALE: 'female',
}

const UpdateUserInforScreen = (props: any) => {
  const refreshList = props.route.params.refreshList
  const { data }: any = useAppSelector(state => state.accountReducer)

  const [gender, setGender] = useState(data.gender || GENDER.MALE)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [date, setDate] = useState<Date>()
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
  const [dialogLoading, setDialogLoading] = useState<boolean>(false)
  const [avtImgLoading, setAvtImgLoading] = useState<boolean>(false)
  const [avtSource, setAvtSource] = useState<string>('')

  const handleUpdate = (dataForm: any) => {
    if (!!!dataForm.name.trim()) {
      ToastShow(R.strings().please_input_fullname)
      return
    }
    const body = new FormData()
    !!avtSource &&
      body.append('file', {
        name: `images${new Date().getTime()}.jpg`,
        type: 'image/jpeg',
        uri: avtSource,
      })
    body.append('full_name', dataForm.name.trim())
    body.append('email', dataForm.email)
    body.append('gender', gender == GENDER.MALE ? 1 : 2)
    !!dataForm?.date &&
      body.append('date_of_birth', DateUtil.formatPayloadDate(dataForm.date))
    callAPIHook({
      API: requestUpdateUserInfor,
      payload: body,
      useLoading: setDialogLoading,
      onSuccess: res => {
        refreshList()
        setTimeout(() => {
          NavigationUtil.goBack()
          ToastShow(R.strings().change_info_account_success)
        }, 150)
        // showMessages('', R.strings().change_info_account_success, () => {

        // })
      },
    })
  }
  const Line = () => {
    return <View style={styles.line} />
  }
  const renderModalSelectGender = () => {
    return (
      <Modal
        isVisible={showModal}
        useNativeDriver
        onBackdropPress={() => {
          setShowModal(!showModal)
        }}
      >
        <View style={styles.wrapperModalGender}>
          <Text
            style={styles.titleModalGender}
            children={R.strings().select_gender}
          />
          <Line />
          <TouchableOpacity
            onPress={() => {
              setGender(GENDER.MALE)
              setShowModal(!showModal)
            }}
            style={styles.rowGender}
          >
            <Text
              style={{ ...fonts.regular16, flex: 1 }}
              children={R.strings().male}
            />
            {gender == GENDER.MALE ? (
              <FastImage
                source={R.images.ic_tick}
                style={{ width: 12, height: 12 }}
                resizeMode={'contain'}
                tintColor={colors.primary}
              />
            ) : null}
          </TouchableOpacity>
          <Line />
          <TouchableOpacity
            onPress={() => {
              setGender(GENDER.FEMALE)
              setShowModal(!showModal)
            }}
            style={styles.rowGender}
          >
            <Text
              style={{ ...fonts.regular16, flex: 1 }}
              children={R.strings().female}
            />
            {gender == GENDER.FEMALE ? (
              <FastImage
                source={R.images.ic_tick}
                style={{ width: 12, height: 12 }}
                resizeMode={'contain'}
                tintColor={colors.primary}
              />
            ) : null}
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }

  return (
    <ScreenWrapper
      back
      backgroundColor={colors.white}
      dialogLoading={dialogLoading}
      scroll
      style={{ flexGrow: 1 }}
      titleHeader={R.strings().info_account}
    >
      <Formik
        initialValues={{
          name: data.full_name || '',
          email: data.email || '',
          profileImg: data.avatar || '',
          date: data.date_of_birth || '',
          address: '',
        }}
        validationSchema={updateUserSchema}
        onSubmit={handleUpdate}
        children={({
          handleSubmit,
          handleChange,
          values,
          handleBlur,
          errors,
          touched,
          setFieldValue,
        }) => (
          <View style={styles.container}>
            <View>
              <Avatar
                src={
                  avtSource || values.profileImg
                    ? {
                        uri: avtSource || values.profileImg,
                      }
                    : R.images.img_logo
                }
                style={{ marginVertical: 20 }}
                isLoading={avtImgLoading}
                accessorySrc={R.images.ic_camera}
                onSelect={res => setAvtSource(res)}
              />
              <FormInput
                value={values.name}
                label={R.strings().full_name}
                placeholder={R.strings().type_name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                rightIcon={R.images.ic_heart}
                error={errors.name && touched.name ? errors.name : undefined}
              />
              <FormInput
                value={values.email.trim()}
                label={R.strings().email}
                placeholder={R.strings().type_email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={errors.email && touched.email ? errors.email : undefined}
                requireText={false}
              />
              <FormInput
                clickable
                label={R.strings().birtday}
                selectedText={
                  values.date ? DateUtil.formatDisplayDate(values.date) : ''
                }
                placeholder={R.strings().select_birtday}
                showRightIcon
                rightIcon={R.images.ic_calendar}
                onPress={() => {
                  setShowDatePicker(true)
                  Keyboard.dismiss()
                }}
                error={errors.date && touched.date ? errors.date : undefined}
                requireText={false}
              />
              <FormInput
                clickable
                label={R.strings().gender}
                showRightIcon
                selectedText={
                  gender == GENDER.MALE ? R.strings().male : R.strings().female
                }
                placeholder={R.strings().select_gender}
                onPress={() => {
                  setShowModal(!showModal)
                  Keyboard.dismiss()
                }}
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
            <DateTimePickerModal
              timePickerModeAndroid={'spinner'}
              isVisible={showDatePicker}
              date={date}
              mode="date"
              maximumDate={new Date()}
              onConfirm={dateTime => {
                setFieldValue('date', dateTime)
                setDate(dateTime)
                setShowDatePicker(false)
              }}
              onCancel={() => setShowDatePicker(false)}
            />
            {renderModalSelectGender()}
          </View>
        )}
      />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    //backgroundColor: colors.backgroundColor,
    paddingHorizontal: 20,
    // alignItems: 'center'
    flex: 1,
    justifyContent: 'space-between',
  },
  inputContainer: {
    paddingHorizontal: 0,
  },
  labelInput: {
    ...fonts.regular14,
    color: '#262626',
  },
  iconStyle: {
    width: 16,
    height: 17,
    resizeMode: 'contain',
    marginRight: 13,
  },
  checkBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderColor: '#868E96',
    borderWidth: 1,
    marginRight: 8,
  },
  button: {
    ...styleView.centerItem,
    width: '100%',
    height: 50,
    marginVertical: 20,
    borderRadius: 8,
    alignSelf: 'center',
    backgroundColor: colors.primary,
  },
  accessory: {
    backgroundColor: 'white',
    width: 32,
    height: 32,
    borderRadius: 15,
    shadowColor: 'white',
  },
  line: { backgroundColor: colors.v_line, width: '100%', height: 1 },
  wrapperModalGender: { backgroundColor: colors.white, borderRadius: 10 },
  titleModalGender: { textAlign: 'center', ...fonts.regular16, margin: 14 },
  rowGender: { flexDirection: 'row', alignItems: 'center', padding: 12 },
})

export default UpdateUserInforScreen
