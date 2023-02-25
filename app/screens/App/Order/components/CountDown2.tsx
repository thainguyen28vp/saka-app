import React, { useLayoutEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { colors, fonts } from '@app/theme'

import moment from 'moment'
import reactotron from 'ReactotronConfig'

let timeout: NodeJS.Timeout
const CountDown = ({ time_ex }: { time_ex?: string }) => {
  const time_expire = useRef(time_ex || '')
  const [timeCountDown, setTimeCountDown] = useState(() => {
    const time = moment(time_expire.current)
      .utcOffset(7)
      .add(15, 'minutes')
      .diff(moment(), 'seconds')
    return time
  })
  useLayoutEffect(() => {
    countDown()
    return () => {
      clearInterval(timeout)
      reactotron.log('clear timeout ', timeout)
    }
  }, [])
  const countDown = () => {
    timeout = setInterval(() => {
      const newTimeCountDown = moment(time_expire.current)
        .utcOffset(7)
        .add(15, 'minutes')
        .diff(moment(), 'seconds')

      if (newTimeCountDown <= 0) {
        reactotron.log('timeout clear ', timeout)
        clearInterval(timeout)
      }
      setTimeCountDown(newTimeCountDown)
    }, 1000)
    reactotron.log('timeout real ', timeout)
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
        <Text
          style={styles.txt_time}
          children={`${formatHour}:${formatMinutes}:${formatSeconds}`}
        />
      ) : (
        <Text style={styles.txt_time} children={`00:00:00`} />
      )}
    </View>
  )
}

export default CountDown

const styles = StyleSheet.create({
  txt_time: {
    color: colors.primary,
    ...fonts.semi_bold16,
    lineHeight: 22,
  },
})
