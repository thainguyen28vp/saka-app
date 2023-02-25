import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import R from '@app/assets/R'
import RNHeader from '@app/components/RNHeader'
import { colors, fonts } from '@app/theme'
import { formatPrice } from '@app/utils/FuncHelper'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { getListDebit } from '@app/service/Network/account/AccountApi'
import Loading from '@app/components/Loading'
import DateUtil from '@app/utils/DateUtil'

export default function DebitScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [data, setData] = useState<any>()
  useEffect(() => {
    callAPIHook({
      API: getListDebit,
      useLoading: setIsLoading,
      onSuccess: async res => {
        setData(res.data)
      },
    })
  }, [])
  if (isLoading) return <Loading />
  return (
    <ImageBackground
      style={styles.container}
      resizeMode={'cover'}
      source={R.images.img_bg_debit}
    >
      <RNHeader
        back
        backgroundHeader="transparent"
        borderBottomHeader="transparent"
        titleHeader={R.strings().manager_debit}
        color={colors.white}
        colorsBack={colors.white}
      />
      {!data?.is_apply_debit && (
        <Text style={styles.txtDebitNot}>Công nợ không khả dụng</Text>
      )}

      <View style={styles.wrapperView}>
        <Text style={styles.txtDebitNow}>Nợ hiện tại</Text>
        <Text style={styles.txtPriceDebitNow}>{`${formatPrice(
          data?.current_debt || 0
        )}đ`}</Text>
        <Text style={styles.txtTime}>
          Thời hạn công nợ:{' '}
          <Text style={styles.txtDate}>
            {!!data?.date_overdue_debit
              ? DateUtil.formatShortDate(data?.date_overdue_debit)
              : '---'}
          </Text>
        </Text>
      </View>
      <Text style={styles.txtTitle}>Công nợ khả dụng</Text>
      <Text style={styles.txtPrice}>{`${formatPrice(
        data?.available_debit || 0
      )}đ`}</Text>
      <Text style={styles.txtTitle}>Hạn mức công nợ</Text>
      <Text style={styles.txtPrice}>{`${formatPrice(
        data?.max_debit || 0
      )}đ`}</Text>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    //backgroundColor: 'red',
  },
  wrapperView: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 16,
    marginTop: 30,
  },
  txtDebitNow: {
    ...fonts.regular16,
    color: colors.text.dark,
    textAlign: 'center',
  },
  txtPriceDebitNow: {
    fontFamily: R.fonts.sf_medium,
    fontSize: 30,
    color: colors.brand,
    textAlign: 'center',
  },
  txtTime: {
    ...fonts.regular14,
    color: colors.text.dark,
    textAlign: 'center',
    marginTop: 20,
  },
  txtDate: {
    ...fonts.medium16,
    color: colors.primary,
  },
  txtTitle: {
    ...fonts.regular16,
    color: colors.white,
    textAlign: 'center',
    marginTop: 35,
  },
  txtPrice: {
    ...fonts.medium24,
    color: colors.white,
    textAlign: 'center',
    marginTop: 4,
  },
  txtDebitNot: {
    textAlign: 'center',
    ...fonts.regular18,
    color: '#E72A00',
    marginTop: 30,
  },
})
