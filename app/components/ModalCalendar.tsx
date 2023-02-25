import R from '@app/assets/R'
import { colors, fonts, WIDTH } from '@app/theme'
import moment from 'moment'
import React, { Fragment, memo, useState } from 'react'
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import { Calendar } from 'react-native-calendars'
import DatePicker from 'react-native-date-picker'
import Modal from 'react-native-modal'
import { Button } from './Button/Button'
const isEqual = require('react-fast-compare')

const { width, height } = Dimensions.get('window')
interface OptionData {
  /**
   * (Required) Text to display
   */
  text: string

  /**
   * Param pass to the call back function
   */
  itemCallback?: any

  id: number
}
const styles = StyleSheet.create({
  contentStyle: {
    width: '100%',
    // borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#2E384D',
    // alignSelf: 'center',
    borderRadius: 16,
    alignItems: 'center',
  },
  wrapOption: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
    alignItems: 'center',
  },
  option: {
    backgroundColor: 'transparent',
    borderTopWidth: 0.7,
    borderColor: colors.line,

    // marginVertical: 5,
  },
  txt_title_modal: {
    ...fonts.regular16,
    color: '#000000',
  },
  header_modal: {
    maxHeight: 150,
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    backgroundColor: colors.primary,
  },
  line: { height: '100%', width: 1, backgroundColor: colors.line },
  containerModal: {
    width: width * 0.9,
    alignSelf: 'center',
  },
  containerBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
})

interface ModalCalendarProps {
  isVisible?: boolean
  backdrop?: boolean
  onSubmit?: (date: any) => void
  onClose?: () => void
  onModalHide?: () => void
  contentView?: React.ReactNode
  title?: string
  textCancel?: string
  textSubmit?: string
  validSubmit?: boolean
  maximumDate?: Date
  option?: OptionData[]
  optionStyle?: StyleProp<ViewStyle>
  textOption?: StyleProp<TextStyle>
  modalCalender?: boolean
  isButtonSubmit?: boolean
  modalFilterCalendar: boolean
  titleModal: string
}

const ModalCalendarComponent = (props: ModalCalendarProps) => {
  const {
    onModalHide,
    isVisible,
    backdrop,
    onSubmit,
    onClose,
    option = [],
    maximumDate,
    textSubmit = R.strings().confirm,
    textCancel = R.strings().cancel,
    validSubmit = true,
    optionStyle,
    modalCalender,
    textOption,
    isButtonSubmit,
    titleModal,
    modalFilterCalendar,
  } = props
  const today = moment().clone().startOf('month').format('YYYY-MM-DD')
  const ONE_DAY = 864e5
  const endday = new Date().toISOString().split('T')[0]
  const [startDay, setStartDay] = useState(today)
  const [endDay, setEndDay] = useState(endday)
  const [dataCallBack, setDataCallBack] = useState(new Date())

  const setDay = (startDay, endDay) => {
    setStartDay(startDay)
    setEndDay(endDay)
  }

  const getFutureDates = (startDay, endDay) => {
    let start = Date.parse(startDay)
    let end = Date.parse(endDay)
    const array = {}
    let dateString = new Date(start).toISOString().split('T')[0]

    if (end == start) {
      array[dateString] = {
        color: colors.primary,
        startingDay: true,
        endingDay: true,
        textColor: colors.white,
        dotColor: 'white',
        marked: true,
      }
      return array
    }
    array[dateString] = {
      color: colors.primary,
      startingDay: true,
      textColor: colors.white,
      dotColor: 'white',
      marked: true,
    }
    start += ONE_DAY
    while (start != end) {
      dateString = new Date(start).toISOString().split('T')[0]
      start += ONE_DAY
      array[dateString] = {
        color: '#FFEAD9',
        textColor: colors.black,
      }
    }
    dateString = new Date(start).toISOString().split('T')[0]
    array[dateString] = {
      color: colors.primary,
      endingDay: true,
      textColor: colors.white,
      dotColor: 'white',
      marked: true,
    }
    return array
  }
  const renderFilterCalendar = () => {
    return (
      <Fragment>
        <Calendar
          theme={{
            arrowColor: colors.primary,
            textDayFontFamily: R.fonts.sf_regular,
            dayTextColor: colors.black,
          }}
          style={{
            width: WIDTH * 0.85,
            backgroundColor: colors.white,
          }}
          renderHeader={date => {
            return (
              <Text
                style={{
                  // ...fonts.bold16,
                  marginVertical: 10,
                  color: colors.text.primary,
                }}
                children={`Tháng ${
                  date.getMonth() + 1
                } Năm ${date.getFullYear()}`}
              />
            )
          }}
          monthFormat={'MM/yyyy'}
          onDayPress={date => {
            var dateNum = Date.parse(date.dateString)
            if (
              dateNum == Date.parse(startDay) ||
              dateNum == Date.parse(endDay)
            ) {
              setDay(date.dateString, date.dateString)
            } else if (dateNum < Date.parse(startDay)) {
              setDay(date.dateString, endDay)
            } else setDay(startDay, date.dateString)
          }}
          markedDates={getFutureDates(startDay, endDay)}
          markingType={'period'}
          maxDate={maximumDate}
        />
      </Fragment>
    )
  }

  return (
    <Modal
      onModalHide={() => {
        if (onModalHide) onModalHide()
      }}
      isVisible={isVisible}
      onBackdropPress={() => {
        if (backdrop) onClose()
      }}
      style={styles.containerModal}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationInTiming={100}
      animationOutTiming={100}
      backdropTransitionInTiming={100}
      backdropTransitionOutTiming={100}
    >
      <View style={styles.contentStyle}>
        <View style={styles.header_modal}>
          <Text
            style={styles.txt_title_modal}
            children={titleModal || R.strings().choose_day}
          />
        </View>
        {option.map((item: OptionData, index: number) => {
          return (
            <Button
              style={[styles.option, optionStyle]}
              onPress={() => {
                onSubmit(item)
                onClose()
              }}
              key={item.text}
            >
              <Text style={textOption} children={item?.text} />
            </Button>
          )
        })}

        {modalFilterCalendar && renderFilterCalendar()}

        {modalCalender && (
          <DatePicker
            style={{ marginTop: '5%' }}
            maximumDate={maximumDate}
            locale="vi"
            date={dataCallBack}
            onDateChange={setDataCallBack}
            mode="date"
          />
        )}
        {isButtonSubmit && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              paddingHorizontal: 20,
              borderTopWidth: 1,
              borderTopColor: colors.line,
            }}
            children={
              <>
                <Button
                  onPress={onClose}
                  style={styles.containerBtn}
                  children={
                    <Text
                      children={R.strings().cancel}
                      style={[fonts.regular16, { color: colors.black }]}
                    />
                  }
                />
                <View style={styles.line} />
                <Button
                  onPress={() => {
                    onSubmit(
                      modalFilterCalendar ? { startDay, endDay } : dataCallBack
                    )
                    // onClose()
                  }}
                  style={styles.containerBtn}
                  children={
                    <Text
                      children={'Chọn ngày'}
                      style={[fonts.regular16, { color: colors.black }]}
                    />
                  }
                />
                {/* <Button onPress={onToday} children={<Text style={[fonts.regular14, { color: colors.purple.dark }]} children='Hôm nay' />} /> */}
                {/* <Button onPress={onClose} children={<Text style={[fonts.semi_bold14, { color: colors.primary }]} children='Hủy' />} /> */}
              </>
            }
          />
        )}
      </View>
    </Modal>
  )
}

export const ModalCalendar = memo(ModalCalendarComponent, isEqual)
