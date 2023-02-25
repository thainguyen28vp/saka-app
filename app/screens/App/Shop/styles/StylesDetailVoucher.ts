import { colors, fonts, WIDTH } from '@app/theme'
import { StyleSheet } from 'react-native'
import R from '@app/assets/R'

export default StyleSheet.create({
  image: {
    width: WIDTH / 2,
    aspectRatio: 1,
    borderRadius: 8,
  },
  txtName: {
    fontFamily: R.fonts.sf_bold,
    fontSize: 28,
    color: colors.primary,
    paddingVertical: 12,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  dot: {
    width: 30,
    aspectRatio: 1,
    borderRadius: 15,
    backgroundColor: '#F3F3F3',
    position: 'absolute',
  },
  txtContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
  line: {
    borderBottomWidth: 2,
    borderBottomColor: '#F3F3F3',
  },
  viewLine: {
    height: 30,
    justifyContent: 'center',
  },
  circle: {
    // backgroundColor: 'red',
    // width: WIDTH * 4,
    // aspectRatio: 1,
    // borderRadius: WIDTH * 2,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  viewContent: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginHorizontal: 16,
    // paddingHorizontal: 16,
  },
  info: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
  },
  title: {
    ...fonts.regular15,
    color: colors.text.primary,
    marginBottom: 4,
  },
  content: {
    ...fonts.regular16,
    color: colors.text.dark,
    marginBottom: 20,
  },
  btn: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: colors.primary,
    left: 0,
    right: 0,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtButton: {
    //marginVertical: 17,
    textAlign: 'center',
    color: colors.white,
    ...fonts.medium16,
  },
  circleImage: {
    height: WIDTH * 2,
    aspectRatio: 1,
    borderRadius: WIDTH * 2,
    top: -WIDTH * 1.7,
    backgroundColor: colors.white,
    position: 'absolute',
  },
})
