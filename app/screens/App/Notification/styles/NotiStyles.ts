import { colors, fonts, WIDTH } from '@app/theme'
import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  notiWrapper: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#F3F3F3',
  },
  titleNoti: {
    ...fonts.regular14,
    color: '#3E433B',
    marginBottom: 10,
  },
  typeNoti: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconNoti: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    height: 20,
    aspectRatio: 1,
    marginRight: 4,
  },
  txtType: {
    color: colors.primary,
    ...fonts.regular14,
  },
  txtTime: {
    color: '#969A95',
    ...fonts.regular12,
  },
  separator: {
    width: WIDTH - 40,
    height: 1,
    backgroundColor: '#D9D9D9',
    alignSelf: 'center',
  },
  notifyIcon: {
    width: 32,
    height: 32,
    marginRight: 16,
  },
  time: {
    ...fonts.regular14,
    color: 'rgba(0, 0, 0, 0.7)',
    marginTop: 10,
  },
  loadMore: { marginVertical: 10 },
  txtReadAll: {
    color: colors.primary,
    fontSize: 14,
  },
  headerNoti: {
    ...fonts.semi_bold14,
    marginBottom: 4,
  },
})
