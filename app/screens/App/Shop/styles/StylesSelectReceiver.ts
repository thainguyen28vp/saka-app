import { colors, fonts, styleView, WIDTH } from '@app/theme'
import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    //...styleView.paddingBottomScreen,
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  searchContainer: {
    ...styleView.centerItem,
    marginTop: 2,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  inforContainer: {
    ...styleView.rowItemBetween,
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 2,
  },
  addReceiverView: {
    // ...styleView.rowItemBetween,
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 8,
    marginBottom: 20,
  },
  search: {
    backgroundColor: '#F1F3F5',
    marginTop: 0,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  container_search: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderColor: 'white',
    // alignItems: 'center',
    // justifyContent: 'center',
    // paddingHorizontal: 80,
    // marginHorizontal: 0,
  },
  input_container: {
    marginLeft: 0,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 0,
    width: WIDTH - 14,
  },
  containerReceiver: {
    ...fonts.regular16,
    color: colors.text.primary,
    flex: 1,
  },
  txtAddress: { ...fonts.regular14, color: colors.text.dark, flex: 1 },
  iconMap: { width: 20, height: 20, marginRight: 6 },
  txtEdit: { ...fonts.regular15, color: colors.primary },
  icSearch: { width: 24, height: 24, marginLeft: 10 },
  txtInput: { ...fonts.regular14, color: colors.text.primary },
  txtAddReceiver: {
    ...fonts.medium16,
    color: colors.white,
    marginLeft: 4,
  },
})
