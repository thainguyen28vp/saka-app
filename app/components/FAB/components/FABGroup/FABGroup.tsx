import { enhance } from '@app/common/handle'
import { Block } from '@app/components/Block/Block'
import { Button } from '@app/components/Button/Button'
import FstImage from '@app/components/FstImage/FstImage'
import { isIphoneX } from 'react-native-iphone-x-helper'
import { colors } from '@app/theme'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  Image,
  LogBox,
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import { ButtonGroup, SPACE_BETWEEN } from './ButtonGroup'
import { Actions, FABGroupProps } from './FABGroup.props'
import R from '@app/assets/R'

export const SIZE_FAB = 50
// function isIPhoneX() {
//   const { width, height } = Dimensions.get('window')
//   return (
//     Platform.OS === 'ios' &&
//     !Platform.isPad &&
//     !Platform.isTVOS &&
//     (height === 812 || width === 812 || height === 896 || width === 896)
//   )
// }

const styles = StyleSheet.create({
  wrap: {
    minWidth: SIZE_FAB,
    height: SIZE_FAB,
    borderRadius: SIZE_FAB / 2,
    backgroundColor: '#fe00f6',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  label: {
    color: '#FFFFFF',
    fontWeight: 'normal',
    fontFamily: undefined,
    textAlign: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'red',
    zIndex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  wrapAction: {
    position: 'absolute',
    zIndex: 2,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  icPlus: {
    width: 24,
    height: 24,
    // marginLeft: Platform.OS != 'ios' ? 3 : 5,
  },
})
export const FABGroup = (props: FABGroupProps) => {
  const { style, icon, label, actions = [] } = props
  const window = useWindowDimensions()
  const [isShow, setIsShow] = useState(false)
  const progress = useRef(new Animated.Value(0)).current
  const inset = useSafeArea()

  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`'])
  }, [])
  const styleBase = useMemo(
    () =>
      enhance([
        styles.wrap,
        {
          right: inset.right + 15,
          height: SIZE_FAB,
          bottom:
            inset.bottom + (isIphoneX() ? 0 : Platform.OS == 'ios' ? 25 : 25),
          // bottom: inset.bottom,
        },
        style ?? {},
      ]),
    [inset, style]
  )
  const _show = () => {
    setIsShow(!isShow)
  }
  const _hide = () => {
    setIsShow(false)
  }
  const onStartShouldSetResponder = () => true
  const onPressItem = (onPressAction: Function) => {
    setIsShow(false)
    onPressAction && onPressAction()
  }
  useEffect(() => {
    Animated.spring(progress, {
      toValue: isShow ? 1 : 0,
      useNativeDriver: false,
    }).start()
  }, [isShow])
  return (
    <>
      <Button
        onPress={_show}
        style={[
          styleBase,
          {
            backgroundColor: isShow ? colors.white : '#183C80',
            flexDirection: 'row',
          },
        ]}
      >
        <FstImage
          source={isShow ? R.images.ic_close_fab : R.images.ic_headphone}
          style={styles.icPlus}
        />
        {/* <Text style={{ ...fonts.semi_bold15 }} children={R.strings().support} /> */}

        {React.isValidElement(label)
          ? label
          : label && <Text style={[styles.label]} children={label} />}
      </Button>
      {isShow === true && (
        <View
          onStartShouldSetResponder={onStartShouldSetResponder}
          onResponderRelease={_hide}
          style={[
            styles.background,
            {
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              right: 0,
              backgroundColor: 'rgba(0,0,0,.25)',
            },
          ]}
        />
      )}
      <Block
        onStartShouldSetResponder={onStartShouldSetResponder}
        style={[
          styles.wrapAction,
          {
            right: inset.right + 25,
            // bottom: inset.bottom + SIZE_FAB + 5,
            bottom:
              inset.bottom +
              SIZE_FAB +
              (isIphoneX() ? 0 : Platform.OS == 'ios' ? 30 : 30),
          },
        ]}
      >
        {actions.map((item: Actions, index: number) => (
          <ButtonGroup
            key={index}
            styleIcon={[item.styleIcon]}
            index={index}
            icon={item.icon}
            label={isShow && item.label}
            onPressItem={item.onPress}
            progress={progress}
            onPress={onPressItem}
          />
        ))}
      </Block>
    </>
  )
}
