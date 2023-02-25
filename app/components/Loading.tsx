import React, { Component } from 'react'
import { StatusBar, View } from 'react-native'
import { BarIndicator } from 'react-native-indicators'
import { colors } from '@app/theme'
interface Props {
  backgroundColor?: string
  translucent?: boolean
}
const Loading = ({ backgroundColor, translucent = false }: Props) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: backgroundColor || 'transparent',
      }}
    >
      {/* <StatusBar translucent={translucent} backgroundColor="transparent" /> */}
      <BarIndicator color={colors.brand} />
    </View>
  )
}
export default Loading
