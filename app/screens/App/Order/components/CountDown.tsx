import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  memo,
} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { colors, fonts } from '@app/theme'

import moment from 'moment'
import { Button } from '@app/components/Button/Button'
import { useAppDispatch } from '@app/store'
import {
  requestListOrderThunk,
  updateLoadedOrderAll,
} from '../slices/OrderSlice'
import reactotron from 'ReactotronConfig'

// let timeout: NodeJS.Timeout
const CountDown = ({
  time_ex,
  onPressVnPay,
  tabIndex,
}: {
  time_ex?: string
  onPressVnPay?: () => void
  tabIndex?: number
}) => {
  // reactotron.log('ajahsyagdsydsgdyuasgyduasgasygdsaygu')
  const Dispatch = useAppDispatch()
  const time_expire = useRef(time_ex || '')
  const [timeCountDown, setTimeCountDown] = useState(() => {
    const time = moment(time_expire.current)
      .utcOffset(7)
      .add(15, 'minutes')
      .diff(moment(), 'seconds')
    return time
  })
  const timeout: any = useRef(null)
  useLayoutEffect(() => {
    return () => {
      // clearInterval(timeout.current)
      // reactotron.log('cleartr timeout : ', timeout.current)
    }
  }, [])
  useLayoutEffect(() => {
    countDown()
  }, [])
  // useEffect(() => {
  //   return () => {
  //     clearInterval(timeout)
  //   }
  // }, [])
  const countDown = () => {
    timeout.current = setInterval(() => {
      const newTimeCountDown = moment(time_expire.current)
        .utcOffset(7)
        .add(15, 'minutes')
        .diff(moment(), 'seconds')
      // reactotron.log('lololo222222', timeout)

      if (newTimeCountDown <= 0) {
        // reactotron.log('lololo', timeout)
        clearInterval(timeout.current)
        // let payload = {
        //   page: 1,
        //   limit: 10,
        //   status: tabIndex,
        //   type: STATUS[tabIndex].alias,
        // }
        // Dispatch(requestListOrderThunk())
        // Dispatch(updateLoadedOrderAll())
        // reactotron.log('hahahahah', newTimeCountDown)
      }
      setTimeCountDown(newTimeCountDown)
    }, 1000)
    // reactotron.log('start countdown', timeout.current)
  }
  const hour = `0${Math.floor(timeCountDown / 3600)}`
  const minutes = `0${Math.floor((timeCountDown % 3600) / 60)}`
  const seconds = `0${(timeCountDown % 3600) % 60}`
  const formatHour = hour.substr(hour.length - 2, 2)
  const formatMinutes = minutes.substr(minutes.length - 2, 2)
  const formatSeconds = seconds.substr(seconds.length - 2, 2)
  return (
    <View>
      {timeCountDown > 0 ? (
        <View style={styles.wrapperCountdown}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.txtCountdown}>Đơn hàng huỷ sau: </Text>
            <Text
              style={styles.txt_time}
              children={`${formatMinutes}:${formatSeconds}`}
            />
          </View>
          <Button
            onPress={onPressVnPay}
            children={
              <View style={styles.btn}>
                <Text style={styles.txtPayNow}>Thanh toán</Text>
              </View>
            }
          />
        </View>
      ) : (
        <></>
      )}
    </View>
  )
}

export default memo(CountDown)

const styles = StyleSheet.create({
  txt_time: {
    color: colors.primary,
    ...fonts.semi_bold16,
    lineHeight: 22,
  },
  wrapperCountdown: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    paddingVertical: 8,
    borderTopColor: colors.v_line,
  },
  btn: {
    borderRadius: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  txtCountdown: {
    ...fonts.regular16,
    color: colors.text.dark,
  },
  txtPayNow: {
    ...fonts.semi_bold16,
    color: colors.white,
  },
})
