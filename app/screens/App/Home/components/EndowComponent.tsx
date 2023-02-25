import R from '@app/assets/R'
import FstImage from '@app/components/FstImage/FstImage'
import { colors, fonts, WIDTH } from '@app/theme'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { StyleSheet, Text } from 'react-native'
import { View } from 'react-native-animatable'
import FastImage, { Source } from 'react-native-fast-image'
interface State {
  icon?: any
  name?: string
  option?: number | string
  onClick?: () => void
}
const scale = WIDTH / 375
const EndowComponent = (props: State) => {
  const { icon, name, option, onClick } = props
  const convertName = name?.split(' ') || []
  return (
    <TouchableOpacity style={styles.container} onPress={onClick}>
      <View style={styles.viewIcon}>
        {/* <FastImage tintColor={colors.white} source={icon} style={styles.icon} /> */}
        <View style={styles.viewText}>
          <Text style={styles.txtTitle}>{convertName[0]}</Text>
          <Text style={styles.txtTitle}>
            {name?.slice(convertName[0].length + 1)}
          </Text>
        </View>
        <FstImage source={icon} style={styles.icon} />
      </View>
      {/* <View style={styles.viewInfo}>
        <Text numberOfLines={1} style={styles.textName} children={name} />
        <Text style={styles.textOption} children={option || 0} />
      </View> */}
      <Text style={styles.textOption} children={option || 0} />
    </TouchableOpacity>
  )
}
export default EndowComponent
const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    width: '48%',
    backgroundColor: colors.white,
    padding: 10,
  },
  viewIcon: {
    flexDirection: 'row',
  },
  icon: {
    width: 35 * scale,
    aspectRatio: 1,
  },
  txtTitle: {
    fontFamily: R.fonts.sf_regular,
    fontSize: 14 * scale,
    color: '#183C80',
  },
  viewText: {
    //flexDirection: 'row',
    flex: 1,
    //  backgroundColor: 'red',
  },
  viewInfo: {
    marginLeft: 12,
    justifyContent: 'space-around',
  },
  textName: {
    fontFamily: R.fonts.sf_regular,
    fontSize: 14 * scale,
    color: colors.white,
  },
  textOption: {
    fontFamily: R.fonts.sf_bold,
    color: '#183C80',
    fontSize: 24 * scale,
    textAlign: 'center',
  },
})
