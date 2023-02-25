import R from '@app/assets/R'
import * as theme from '@app/theme'
import React, { Component } from 'react'
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native'
import { Header } from 'react-native-elements'
import FastImage from 'react-native-fast-image'
import NavigationUtil from '../navigation/NavigationUtil'
import { colors, dimensions, fonts, OS, WIDTH } from '@app/theme'
import { getStatusBarHeight, isIphoneX } from 'react-native-iphone-x-helper'
const scale = WIDTH / 375
interface Props {
  color?: string
  backgroundHeader?: string
  borderBottomHeader?: string
  back?: boolean
  onBack?: () => void
  /**
   * View nút phải
   */
  rightComponent?: React.ReactNode
  /**
   * View nút trái
   */
  leftComponent?: React.ReactNode
  /**
   * Title thanh header
   */
  titleHeader: string
  colorsBack?: string
}

interface BackProps {
  style?: ViewStyle
  onBack?: () => void
  colorsBack?: string
}

export class BackButton extends Component<BackProps> {
  render() {
    const { style, onBack, colorsBack } = this.props
    return (
      <TouchableOpacity
        style={[style || styles.leftComp]}
        onPress={onBack || NavigationUtil.goBack}
      >
        <FastImage
          source={R.images.ic_back}
          style={{ marginLeft: 12, width: 24, height: 24 }}
          tintColor={colorsBack ? colorsBack : colors.gray}
          resizeMode="contain"
        />
      </TouchableOpacity>
    )
  }
}

export default class RNHeader extends Component<Props> {
  render() {
    const {
      color,
      back,
      onBack,
      titleHeader,
      rightComponent,
      leftComponent,
      borderBottomHeader,
      backgroundHeader,
      colorsBack,
    } = this.props
    return (
      <Header
        placement="center"
        containerStyle={{
          backgroundColor: backgroundHeader || 'white',
          height:
            OS == 'ios' ? (isIphoneX() ? 60 : 54) + getStatusBarHeight() : 70,
          borderBottomColor: borderBottomHeader || '#E7E7E7',
          paddingBottom: 7,
        }}
        centerContainerStyle={{
          justifyContent: 'center',
          height: !titleHeader ? 0 : 40,
        }}
        leftContainerStyle={{ justifyContent: 'center' }}
        rightContainerStyle={{ justifyContent: 'center' }}
        leftComponent={
          back ? (
            <BackButton colorsBack={colorsBack} onBack={onBack} />
          ) : (
            leftComponent
          )
        }
        centerComponent={
          <Text
            numberOfLines={1}
            style={[
              {
                fontFamily: R.fonts.sf_regular,
                fontSize: 20 * scale,
                lineHeight: 28 * scale,
                color: colors.text.primary,
              },
              { color: color || colors.colorDefault.text },
            ]}
          >
            {titleHeader}
          </Text>
        }
        rightComponent={rightComponent}
        statusBarProps={{
          barStyle: 'dark-content',
          translucent: true,
          backgroundColor: 'transparent',
        }}
      />
    )
  }
}

const styles = StyleSheet.create({
  leftComp: {
    // height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightComp: {
    // height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
})
