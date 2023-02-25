import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { colors, fonts, styleView } from '@app/theme'
import isUser from '@app/utils/isUser'
import React from 'react'
import { View, Text, Animated, StyleSheet, Platform } from 'react-native'
import FastImage from 'react-native-fast-image'
import {
  getBottomSpace,
  getStatusBarHeight,
  isIphoneX,
} from 'react-native-iphone-x-helper'
import CartButton from './CartButton'

interface HeaderProps {
  headerBgColor: any
  headerTitleColor: any
  headerBtnColor: any
  borderOpacity: any
  opacityBack: any
  title?: string
  isLike: boolean
  onLikeClick: (current: boolean) => void
}

const ProductDetailHeader = (props: HeaderProps) => {
  const {
    headerBgColor,
    borderOpacity,
    headerBtnColor,
    headerTitleColor,
    title,
    isLike,
    opacityBack,
    onLikeClick,
  } = props
  const AnimatedFastImage = Animated.createAnimatedComponent(FastImage)

  return (
    <Animated.View
      style={[
        styles.header,
        {
          backgroundColor: headerBgColor,
          borderBottomWidth: borderOpacity,
          borderBottomColor: colors.line,
        },
      ]}
    >
      <View
        style={{
          ...styleView.rowItemBetween,
          width: '100%',
          alignItems: 'center',
          //marginBottom: 40,
          //  backgroundColor: 'red',
        }}
      >
        <Button
          onPress={() => NavigationUtil.goBack()}
          children={
            <View
              style={{
                ...styleView.rowItem,
                alignItems: 'center',
              }}
            >
              <Animated.View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  backgroundColor: headerBtnColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <FastImage
                  source={R.images.ic_back}
                  style={{ width: 20, height: 20 }}
                  tintColor={colors.gray}
                  resizeMode="contain"
                />
                <AnimatedFastImage
                  source={R.images.ic_back}
                  style={[
                    {
                      width: 20,
                      height: 20,
                      position: 'absolute',
                    },
                    opacityBack,
                  ]}
                  tintColor={colors.white}
                  resizeMode="contain"
                />
              </Animated.View>
              <Animated.Text
                style={{
                  ...fonts.medium18,
                  marginLeft: 10,
                  opacity: headerTitleColor,
                }}
                children={
                  !!title
                    ? `${
                        title.length >= 17
                          ? `${title.substring(0, 17)}...`
                          : title
                      }`
                    : ''
                }
              />
            </View>
          }
        />
        <View style={{ ...styleView.rowItem, alignItems: 'center' }}>
          <Button
            // style={styles.buttonHeader}
            children={
              <Animated.View
                style={{
                  width: 44,
                  height: 44,
                  backgroundColor: headerBtnColor,
                  borderRadius: 8,
                  ...styleView.centerItem,
                }}
                children={<CartButton opacityCart={opacityBack} />}
              />
            }
            onPress={() =>
              isUser(() => {
                NavigationUtil.navigate(SCREEN_ROUTER_APP.CART)
              })
            }
          />
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  header: {
    ...styleView.rowItemBetween,
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    position: 'absolute',
    width: '100%',
    // top: Platform.OS == 'android' ? 20 : getStatusBarHeight(),
    top: 0,
    height:
      getStatusBarHeight() +
      (Platform.OS == 'android' ? 50 : !isIphoneX() ? 55 : 60),
    zIndex: 1,
  },
  buttonHeader: {
    width: 36,
    height: 36,
    backgroundColor: '#ECEBED',
    borderRadius: 16,
    ...styleView.centerItem,
  },
})

export default ProductDetailHeader
