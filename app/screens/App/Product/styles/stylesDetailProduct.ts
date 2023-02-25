import { colors, fonts, WIDTH } from '@app/theme'
import { StyleSheet } from 'react-native'
import R from '@app/assets/R'
const scale = WIDTH / 375
export default StyleSheet.create({
  titlePro: {
    paddingVertical: 13,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
    marginBottom: 4,
  },
  txtName: {
    fontFamily: R.fonts.sf_medium,
    fontSize: 20 * scale,
    flex: 1,
    lineHeight: 28 * scale,
  },
  txtNumberLeft: {
    fontFamily: R.fonts.sf_regular,
    fontSize: 14 * scale,
    color: colors.text.light,
    lineHeight: 21 * scale,
    marginTop: 5,
  },
  txtPrice: {
    fontFamily: R.fonts.sf_medium,
    fontSize: 20 * scale,
    color: colors.primary,
    marginTop: 16 * scale,
  },
  txtPriceSale: {
    fontFamily: R.fonts.sf_medium,
    fontSize: 16 * scale,
    color: colors.text.light,
    textDecorationLine: 'line-through',
  },
  viewDescription: {
    paddingHorizontal: 15 * scale,
    paddingTop: 12 * scale,
    backgroundColor: colors.white,
  },
  txtProductDetail: {
    fontFamily: R.fonts.sf_medium,
    fontSize: 16 * scale,
    marginBottom: 10 * scale,
    color: colors.text.primary,
  },
  txtSeeMore: {
    ...fonts.medium14,
    color: colors.text.dark,
    textAlign: 'center',
  },
  btnSeeMore: {
    borderTopWidth: 1,
    borderTopColor: '#E7E7E7',
    marginTop: 12,
    paddingVertical: 8,
  },
  txtRelated: {
    ...fonts.medium16,
    color: colors.text.primary,
    marginRight: 8,
  },
  wrapperRelated: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 12,
  },
  line: {
    backgroundColor: colors.focus,
    height: 1,
    flex: 1,
  },
  viewRelated: {
    flexDirection: 'row',
    margin: 12,
    alignItems: 'center',
  },
  description: {
    /// ...fonts.regular16,
    // fontFamily: R.fonts.sf_regular,
    color: colors.text.dark,
    // color: colors.blue,
    fontSize: 16,

    // backgroundColor: 'red',
    // width: WIDTH - 100,
    // marginRight: 100,
    // paddingHorizontal: 16,
    margin: 0,
    padding: 0,
  },
  linearGradient: {
    position: 'absolute',
    // width: '100%',
    height: '30%',
    top: 40,
    left: 0,
    right: 0,
  },
  imgHtml: {
    width: 100,
    height: 100,
  },
})
