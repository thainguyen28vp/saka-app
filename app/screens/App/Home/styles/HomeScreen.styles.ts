import { colors, fonts, HEIGHT, WIDTH } from '@app/theme'
import R from '@app/assets/R'
import { Platform, StyleSheet } from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper'
const scale = WIDTH / 375
export default StyleSheet.create({
  imgHeader: {
    width: WIDTH,
    height: isIphoneX() ? 104 * scale : 80 * scale,
    // zIndex: 1,
    backgroundColor: colors.white,
  },
  wrapperLogo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: isIphoneX() ? 65 * scale : 41 * scale,
    paddingHorizontal: 20,
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  icLogo: {
    width: 120 * scale,
    height: 22 * scale,
  },
  icNoti: {
    width: 24 * scale,
    height: 24 * scale,
  },
  txtSearch: {
    fontSize: 14 * scale,
    color: colors.text.light,
    marginLeft: 8 * scale,
  },
  btnSearch: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: WIDTH * 0.6,
    //backgroundColor: 'red',
    paddingVertical: 4 * scale,
    marginTop: 8 * scale,
    // marginTop: 10,
    //marginVertical: 40 * scale,
    //  paddingTop: 8 * scale,
  },
  imgBgSearch: {
    width: WIDTH,
    height: 61 * scale,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    //paddingTop: 6 * scale,
    //backgroundColor: 'red',
    marginBottom: 60 * scale,
    // paddingBottom: 100,
  },
  viewPosition: {
    backgroundColor: '#13326C',
    position: 'absolute',
    top: 0,
    height: HEIGHT / 2,
    right: 0,
    left: 0,
    zIndex: -1,
  },
})
