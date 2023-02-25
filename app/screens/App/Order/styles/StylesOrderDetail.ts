import { colors, fonts, styleView } from '@app/theme'
import { StyleSheet } from 'react-native'
import { colorsDark } from 'react-native-elements/dist/config'
export default StyleSheet.create({
  headerStatus: {
    ...styleView.rowItemBetween,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
  },
  orderItemView: {
    ...styleView.rowItem,
    alignItems: 'center',
    // paddingHorizontal: 15,
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: colors.v_line,
    paddingBottom: 9,
  },
  bottomTextRight: {
    ...fonts.regular16,
  },
  bottomTextLeft: {
    ...fonts.regular16,
    color: '#69747E',
  },
  bottomButton: {
    ...styleView.centerItem,
    // width: 122,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E72A00',
    paddingHorizontal: 16,
    // bottom: 50,
  },
  txtOrderStatus: { ...fonts.regular16, color: colors.white },
  icon24: { width: 24, height: 24 },
  wrapperDelivery: {
    paddingTop: 15,
    paddingHorizontal: 15,
    backgroundColor: colors.white,
    marginTop: 8,
    paddingBottom: 8,
  },
  txt_infoTransport: {
    ...fonts.semi_bold16,
    marginLeft: 8,
    flex: 1,
    color: colors.text.primary,
  },
  txtTransportStatus: {
    ...fonts.regular16,
    marginLeft: 8,
    color: colors.text.primary,
  },
  wrapperReceiver: { padding: 15, backgroundColor: colors.white, marginTop: 8 },
  txtReceiverInfo: {
    ...fonts.semi_bold16,
    marginLeft: 8,
    color: colors.text.primary,
  },
  txtAdress: {
    ...fonts.regular16,
    marginTop: 12,
    color: colors.text.dark,
  },
  txtPhone: {
    ...fonts.regular16,
    color: colors.text.dark,
    marginTop: 4,
  },
  wrapperOrderInfo: {
    backgroundColor: colors.white,
    marginTop: 8,
    paddingVertical: 10,
    marginBottom: 2,
  },
  txtOrderInfo: {
    ...fonts.semi_bold16,
    marginLeft: 8,
    color: colors.text.primary,
  },
  linePrice: {
    ...styleView.rowItemBetween,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  titleLine: { ...fonts.regular16, color: colors.text.dark },
  wrapperInfoPrice: {
    backgroundColor: colors.white,
    marginTop: 8,
    paddingTop: 11,
  },
  viewCodeOrder: {
    ...styleView.rowItemBetween,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  txtCodeOrder: { ...fonts.medium16, color: colors.text.primary },
  paddingBtnDelete: { height: 40, ...styleView.centerItem, marginTop: 35 },
  txtDelete: { ...fonts.regular16, color: '#E72A00' },
  txtCanceledVNpay: { ...fonts.regular16, color: '#E72A00' },
  titleStatusHistory: {
    ...fonts.regular14,
    color: colors.text.dark,
    //backgroundColor: 'red',
    width: '40%',
  },
  dot: {
    height: 9,
    aspectRatio: 1,
    borderRadius: 9,
    backgroundColor: colors.primary,
    zIndex: 10,
    // padding: 4,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  line: {
    height: '100%',
    width: 1,
    backgroundColor: '#D0DBEA',
    position: 'absolute',
  },
  viewItemHistory: {
    flexDirection: 'row',
    maxHeight: 40,
    alignItems: 'center',

    // marginVertical: 5,
  },
  viewDot: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green',
    height: '100%',
  },
  viewInfoDelivery: {
    ...styleView.rowItem,
    alignItems: 'center',
    marginBottom: 8,
  },
  wrapperBankingInfo: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: colors.white,
    marginTop: 8,
  },
  txtPolicyBanking: {
    color: colors.text.dark,
    ...fonts.regular16,
    marginBottom: 12,
  },
  txtNameBanking: {
    ...fonts.regular16,
    color: colors.text.light,
  },
  infoBanking: {
    color: colors.text.primary,
  },
  txtBankingNumber: {
    color: colors.text.primary,
    ...fonts.regular16,
    flex: 1,
  },
  viewNumberBanking: {
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  txtContentBanking: {
    ...fonts.regular16,
    color: colors.text.dark,
    marginTop: 16,
  },
  titleQR: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  txtQR: {
    textAlign: 'center',
    marginHorizontal: 8,
    ...fonts.regular16,
    color: '#2E2E2E',
  },
  line_half: {
    flex: 1,
    height: 1,
    backgroundColor: colors.focus,
  },
  imgQR: {
    width: '40%',
    aspectRatio: 1,
    marginVertical: 12,
  },
  btnSaveQR: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.backgroundColor,
    borderRadius: 8,
    marginBottom: 12,
  },
  txtSaveText: {
    ...fonts.regular16,
    color: colors.black,
  },
  txtNotiSale: {
    ...fonts.regular16,
    color: '#FF544D',
    textAlign: 'center',
  },
  wrapperMemo: {
    paddingHorizontal: 15,
    marginTop: 8,
    backgroundColor: colors.white,
  },
  titleMemo: {
    ...fonts.regular16,
    color: colors.text.primary,
  },
  contentMemo: {
    ...fonts.regular14,
    color: colors.text.dark,
    marginTop: 4,
  },
  txtGift: {
    color: colors.text.dark,
    ...fonts.regular14,
    textAlign: 'center',
    marginVertical: 6,
    paddingHorizontal: 15,
  },
  txtSeeMore: {
    color: colors.text.dark,
    ...fonts.regular13,
    textAlign: 'center',
  },
})
