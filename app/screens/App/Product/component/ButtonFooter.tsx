import R from '@app/assets/R'
// import { SCREEN_ROUTER_APP } from '@app/constant/Constant'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { colors, fonts, styleView, WIDTH } from '@app/theme'
import React from 'react'
import { StyleProp, TouchableOpacityProps, ViewStyle } from 'react-native'
import { ImageRequireSource } from 'react-native'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FastImage, { ImageStyle } from 'react-native-fast-image'
import { getBottomSpace } from 'react-native-iphone-x-helper'
const scale = WIDTH / 375
interface Props extends TouchableOpacityProps {
  action1: () => void
  action2?: () => void
  action3: () => void
  url1?: ImageRequireSource
  url2?: ImageRequireSource
  title1: string
  title3: string
  img1Style?: ImageStyle
  img2Style?: ImageStyle
  style?: ViewStyle
  iphoneX?: boolean
  bg1?: string
  bg2?: string
  bg3?: string
  img1TintColor?: string
  img2TintColor?: string
  line?: boolean
  showAction2?: boolean
}

const ButtonFooter = (props: Props) => {
  const {
    action1,
    action2,
    action3,
    url1,
    url2,
    title1,
    title3,
    img1Style,
    img2Style,
    iphoneX,
    img1TintColor,
    img2TintColor,
    bg1,
    bg2,
    bg3,
    line,
    style,
    showAction2 = true,
    ...btnActionProps
  } = props
  return (
    <View style={style}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.white,
          // height: 50,
        }}
      >
        <TouchableOpacity
          onPress={action1}
          style={{
            ...styleView.centerItem,
            // paddingVertical: 14,
            backgroundColor: bg1 || colors.white,
            width: '50%',
            height: 52,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: colors.primary,
          }}
          {...btnActionProps}
          children={
            <Text
              style={{
                color: colors.primary,
                fontSize: 16 * scale,
                fontFamily: R.fonts.sf_semi_bold,
              }}
              children={title1}
            />
          }
        />

        <TouchableOpacity
          onPress={action3}
          style={{
            ...styleView.centerItem,
            // paddingVertical: 14,
            backgroundColor: bg3 || colors.primary,
            flex: 1,
            height: 52,
          }}
          {...btnActionProps}
          children={
            <Text
              style={{
                color: colors.white,
                fontSize: 16 * scale,
                fontFamily: R.fonts.sf_semi_bold,
              }}
              children={title3}
            />
          }
        />
      </View>
      {iphoneX && (
        <View
          style={{
            width: '100%',
            height: getBottomSpace() - 15,
            backgroundColor: colors.white,
          }}
        />
      )}
    </View>
  )
}

export default ButtonFooter

const styles = StyleSheet.create({})
