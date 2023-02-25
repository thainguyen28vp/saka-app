import { Button } from '@app/components/Button/Button'
import FstImage from '@app/components/FstImage/FstImage'
import { dimensions, fonts } from '@app/theme'
import React from 'react'
import { Animated, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native'
import { Source } from 'react-native-fast-image'

export const SIZE_BUTTON_GROUP = 50
export const SPACE_BETWEEN = 10
const styles = StyleSheet.create({
  root: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    zIndex: 5,
    left: 10,
    // backgroundColor: 'red',
  },

  wrap: {
    width: SIZE_BUTTON_GROUP,
    height: SIZE_BUTTON_GROUP,
    borderRadius: SIZE_BUTTON_GROUP / 2,
    backgroundColor: '#99aab5',
    shadowColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  wrapLabel: {
    marginTop: 8,
    width: dimensions.width * 0.4,
    paddingHorizontal: '8%',
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginRight: 15,
    borderRadius: 25,
  },
  text: {
    ...fonts.regular16,
    fontFamily: undefined,
    fontWeight: 'normal',
    // color:colors.w
  },
  icon: {
    width: 24,
    height: 24,
  },
})

interface ButtonGroupProps {
  icon: Source | number
  styleIcon?: any
  wrapLabel?: StyleProp<ViewStyle>

  onPress: (onPressItem: () => void) => void

  onPressItem?: any

  progress: Animated.Value

  label?: string
  index?: number
}

export const ButtonGroup = (props: ButtonGroupProps) => {
  const {
    icon,
    onPress,
    onPressItem,
    styleIcon,
    wrapLabel,
    label,
    index,
    progress,
  } = props
  const bottom = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-(SPACE_BETWEEN + SIZE_BUTTON_GROUP), SPACE_BETWEEN],
  })
  const opacity = progress.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 0, 1],
  })
  const _onPress = () => {
    onPress && onPress(onPressItem)
  }
  return (
    <Animated.View style={[styles.root, { marginBottom: bottom, opacity }]}>
      {label && (
        <Animated.View style={[styles.wrapLabel, wrapLabel]}>
          <Text style={[styles.text]} children={label} />
        </Animated.View>
      )}
      <Button onPress={_onPress} style={[styles.wrap, styleIcon]}>
        <FstImage source={icon} style={styles.icon} />
      </Button>
    </Animated.View>
  )
}
