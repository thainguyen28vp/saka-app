import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { colors, fonts, WIDTH } from '@app/theme'
import { formatPrice } from '@app/utils/FuncHelper'
import isUser from '@app/utils/isUser'
import React from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from 'react-native'
import { useAppSelector } from '@app/store'
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient'
import EndowComponent from '../components/EndowComponent'
import BannerHomeScreen from './BannerHomeScreen'
import reactotron from 'ReactotronConfig'
interface State {
  point?: any
  voucher_count?: any
  toggleModal?: any
  userState?: any
  dataBanner?: any
}
const scale = WIDTH / 375
const OptionPointVoucherLayout = (props: State) => {
  const { voucher_count, point, dataBanner } = props
  const { data }: any = useAppSelector(state => state.accountReducer)
  const renderPoint = () => {
    return (
      <Button
        onPress={() => {
          isUser(() => {
            NavigationUtil.navigate(SCREEN_ROUTER_APP.POINT)
          })
        }}
        children={
          <ImageBackground
            source={R.images.img_bg_point}
            style={styles.imgPoint}
          >
            <Text style={styles.txtPoint}>{formatPrice(point || 0)}</Text>
            <View style={[styles.flexPoint, { marginTop: 8 * scale }]}>
              <Text style={[styles.txtTitle, { marginRight: 16 * scale }]}>
                {R.strings().accumulation_point}
              </Text>
              <FastImage
                source={R.images.img_point_home}
                style={styles.icon}
                // tintColor={colors.white}
              />
            </View>
          </ImageBackground>
        }
      />
    )
  }
  const renderPromo = () => {
    return (
      <Button
        onPress={() => {
          isUser(() => {
            NavigationUtil.navigate(SCREEN_ROUTER_APP.VOUCHER, {
              isClickRoute: true,
            })
          })
        }}
        children={
          <ImageBackground
            source={R.images.img_bg_promo}
            style={[styles.imgPromo, { paddingLeft: 24 * scale }]}
          >
            <View
              style={[styles.flexPoint, { justifyContent: 'space-between' }]}
            >
              <Text style={styles.txtPoint}>
                {formatPrice(voucher_count || 0)}
              </Text>
              <FastImage
                source={R.images.img_promo_home}
                style={[styles.icon, { marginRight: 12 * scale }]}
                // tintColor={colors.white}
              />
            </View>
            <Text style={[styles.txtTitle, { marginTop: 8 * scale }]}>
              {R.strings().promotion_code}
            </Text>
          </ImageBackground>
        }
      />
    )
  }
  return (
    <View>
      <BannerHomeScreen style={styles.banner} data={dataBanner} />
      <LinearGradient colors={['#20458B', '#0E2A61']} style={styles.wrapper}>
        <View style={styles.wrapperPoint}>
          {!!data?.full_name && (
            <>
              {renderPoint()}
              {renderPromo()}
            </>
          )}
        </View>
      </LinearGradient>
    </View>
  )
}
const styles = StyleSheet.create({
  wrapper: {
    width: '100%',

    paddingVertical: 15 * scale,
    paddingTop: 120 * scale,
    zIndex: -1,
  },
  wrapperPoint: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15 * scale,
  },
  banner: {
    position: 'absolute',
    top: -55 * scale,
  },
  imgPoint: {
    width: 192 * scale,
    height: 88 * scale,
    padding: 12 * scale,
    justifyContent: 'center',
    //paddingVertical: 12 * scale,
    // backgroundColor: 'red',
  },
  imgPromo: {
    width: 152 * scale,
    height: 88 * scale,
    padding: 12 * scale,
    justifyContent: 'center',
    // backgroundColor: 'green',
  },
  txtPoint: {
    fontSize: 22 * scale,
    fontFamily: R.fonts.sf_bold,
    color: colors.primary,
  },
  flexPoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24 * scale,
    aspectRatio: 1,
  },
  txtTitle: {
    color: colors.primary,
    fontSize: 16 * scale,
    fontFamily: R.fonts.sf_regular,
  },
})
export default OptionPointVoucherLayout
