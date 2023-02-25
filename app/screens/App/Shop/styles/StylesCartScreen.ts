import { colors, fonts, styleView } from '@app/theme'
import { StyleSheet } from 'react-native'
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper'
import R from '@app/assets/R'
export default StyleSheet.create({
  depotView: {
    ...styleView.rowItem,
    marginTop: 2,
    paddingVertical: 16,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  bottomView: {
    width: '100%',
    paddingBottom: isIphoneX() ? getBottomSpace() : 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  btnOrder: {
    ...styleView.centerItem,
    height: 52,
    flex: 1,
    maxWidth: '50%',
    backgroundColor: colors.primary,
  },
  itemContainer: {
    ...styleView.rowItem,
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    marginVertical: 4,
  },
  itemImg: {
    width: 91,
    height: 91,
    borderRadius: 4,
    marginRight: 12,
  },
  quantityCounterBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  txtDeleteAll: {
    fontFamily: R.fonts.sf_regular,
    fontSize: 14,
    color: '#FF544D',
  },
  iconMinus: {
    width: 16,
    height: 16,
    margin: 4,
  },
  btnMinus: {
    alignItems: 'center',
    justifyContent: 'center',
    // height: '100%',
    // aspectRatio: 1,
    // backgroundColor: 'red',

    borderColor: colors.line,
  },
  numberCart: {
    paddingHorizontal: 10,
    color: colors.text.dark,
    ...fonts.regular14,
  },
  quantityForm: {
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    // maxWidth: '50%',
    // height: 24,
  },
  viewCounter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  viewProduct: {
    ...styleView.rowItem,
    alignItems: 'center',
    marginBottom: 4,
  },
  txtProduct: {
    fontFamily: R.fonts.sf_regular,
    fontSize: 16,
    color: colors.text.primary,
    // width: '75%',
  },
  viewPrice: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
  },
  txtPrice: {
    //marginTop: 8,
    marginRight: 10,
    fontFamily: R.fonts.sf_semi_bold,
    fontSize: 16,
    color: colors.primary,
  },
  txtPriceSale: {
    fontFamily: R.fonts.sf_regular,
    fontSize: 12,
    color: colors.text.light,
    textDecorationLine: 'line-through',
  },
  viewSelectNumber: {
    paddingVertical: 11,
    //  backgroundColor: 'pink',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  txtNumberSelect: {
    fontSize: 16,
    fontFamily: R.fonts.sf_regular,
    color: colors.text.dark,
  },
  txtCheckbox: {
    fontSize: 16,
    fontFamily: R.fonts.sf_regular,
    color: colors.text.dark,
  },
  viewTotalAmount: {
    ...styleView.rowItemBetween,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  txtTotal: {
    fontSize: 16,
    fontFamily: R.fonts.sf_regular,
    color: colors.text.dark,
    lineHeight: 21,
  },
  txtPriceTotal: {
    fontSize: 16,
    fontFamily: R.fonts.sf_semi_bold,
    color: colors.primary,
    lineHeight: 22,
  },
  txtBtnOrder: {
    ...fonts.semi_bold16,
    color: colors.white,
  },
})
