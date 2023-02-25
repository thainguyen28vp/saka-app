import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { colors, fonts, WIDTH } from '@app/theme'
import R from '@app/assets/R'
import GiftItem from './components/GiftItem'
import DateUtil from '@app/utils/DateUtil'
import { Button } from '@app/components/Button/Button'
import { showConfirm } from '@app/utils/GlobalAlertHelper'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { MAIN_TAB, SCREEN_ROUTER_APP } from '@app/config/screenType'
import { Circle } from 'react-native-svg'
import FstImage from '@app/components/FstImage/FstImage'
import { ScrollView } from 'react-native-gesture-handler'
import styles from './styles/StylesDetailVoucher'
import reactotron from 'ReactotronConfig'

const VoucherDetailScreen = (props: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const data = props.route.params?.data
  const isPayment = props.route.params?.isPayment
  const handelUseVoucher = () => {
    NavigationUtil.navigate(MAIN_TAB.PRODUCT)
    return
  }
  const checkProductUse =
    data?.voucher_product && !!data?.voucher_product.length
  const renderImageVoucher = () => {
    return (
      <View style={styles.circle}>
        <View style={styles.circleImage} />
        <FstImage
          source={data?.image ? { uri: data?.image } : R.images.img_logo}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    )
  }

  const renderContentVoucher = () => {
    return (
      <View style={styles.viewContent}>
        <Text style={styles.txtName}>{data.name}</Text>
        <View style={styles.viewLine}>
          <View style={[styles.dot, { left: -15 }]} />
          <View style={styles.line} />
          <View style={[styles.dot, { right: -15 }]} />
        </View>
        <View style={styles.txtContent}>
          <Text style={styles.title}>{R.strings().start_time}</Text>
          <Text style={styles.content}>
            {DateUtil.formatTimeDate(data.start_time)} -{' '}
            {DateUtil.formatTimeDate(data.end_time)}
          </Text>
          <Text style={styles.title}>{R.strings().product}</Text>
          <Text numberOfLines={15} style={styles.content}>
            {checkProductUse
              ? data.voucher_product
                  .map((x: any) => x.product_variant.name)
                  .toString()
              : R.strings().apply_all_product}
          </Text>
          {!!data?.description && (
            <>
              <Text style={styles.title}>{R.strings().description}</Text>
              <Text style={[styles.content, { marginBottom: 0 }]}>
                {data?.description}
              </Text>
            </>
          )}
        </View>
      </View>
    )
  }
  const renderLayout = () => {
    return (
      <>
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderImageVoucher()}
          {renderContentVoucher()}
          {/* <View style={{ height: 62 }} /> */}
        </ScrollView>
      </>
    )
  }
  return (
    <ScreenWrapper
      back
      titleHeader={R.strings().promo_detail}
      // borderBottomHeader={colors.line}
      backgroundHeader={colors.white}
      style={{ backgroundColor: '#F3F3F3' }}
      children={renderLayout()}
    />
  )
}

export default VoucherDetailScreen
