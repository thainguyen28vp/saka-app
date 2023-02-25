import R from '@app/assets/R'
import { useAppSelector } from '@app/store'
import { colors, fonts, styleView, WIDTH } from '@app/theme'
import React from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import FastImage from 'react-native-fast-image'
const scale = WIDTH / 375
const CartButton = ({ opacityCart, style, styleIcon, colorIcon }: any) => {
  const AnimatedFastImage = Animated.createAnimatedComponent(FastImage)
  const { data } = useAppSelector(state => state.cartReducer)
  return (
    <View style={[{ ...styleView.centerItem, zIndex: 10 }, style]}>
      {data?.length != 0 && (
        <View
          style={[
            {
              ...styleView.centerItem,
              position: 'absolute',
              width: 16 * scale,
              aspectRatio: 1,
              backgroundColor: colors.primary,
              borderRadius: 11,
              top: -6,
              right: -4,
            },
            data?.length > 99 && {
              top: -6,
              right: -8,
              width: 20 * scale,
              height: 16,
            },
          ]}
          children={
            <Text
              style={{
                ...fonts.medium8,
                color: colors.white,
                textAlign: 'center',
              }}
              children={`${data?.length > 99 ? '99+' : data?.length}`}
            />
          }
        />
      )}
      <FastImage
        style={[{ width: 20, height: 20, zIndex: -1 }, styleIcon]}
        source={R.images.ic_cart}
        tintColor={colorIcon || colors.gray}
      />
      <AnimatedFastImage
        style={[
          { width: 20, height: 20, zIndex: -1, position: 'absolute' },
          !!opacityCart ? opacityCart : { opacity: 0 },
        ]}
        source={R.images.ic_cart}
        tintColor={!!opacityCart ? colors.white : colors.gray}
      />
    </View>
  )
}

const styles = StyleSheet.create({})

export default CartButton
