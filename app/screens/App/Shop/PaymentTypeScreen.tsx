import { View, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import PaymentItem from './components/PaymentItem'
import R from '@app/assets/R'
import { PAYMENT_TYPE } from '@app/config/Constants'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { getPointCongNo } from '@app/service/Network/account/AccountApi'
import { formatPrice } from '@app/utils/FuncHelper'

const PaymentTypeScreen = (props: any) => {
  const { banking, cod, vnpay, debit } = PAYMENT_TYPE
  const data = [banking, cod, debit, vnpay]
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [pointCongno, setPointCongno] = useState<any>()
  const total_payment = props.route.params?.total_payment
  useEffect(() => {
    callAPIHook({
      API: getPointCongNo,
      useLoading: setIsLoading,
      onSuccess: res => {
        setPointCongno(res.data)
      },
    })
  }, [])
  const renderPaymentType = ({ item, index }: any) => {
    if (index == 2 && !pointCongno?.is_apply_debit) return <></>
    return (
      <PaymentItem
        disabled={
          (index == 2 && total_payment > pointCongno?.available_debit) ||
          (index == 3 && total_payment < 10000)
        }
        icon={item.icon}
        title={item.title}
        description={
          index != 2
            ? item.description
            : `Công nợ khả dụng: ${formatPrice(
                pointCongno?.available_debit + ''
              )}đ`
        }
        onPress={() => {
          NavigationUtil.navigate(SCREEN_ROUTER_APP.PAYMENT, {
            paymentType: item.alias,
          })
        }}
        message={
          index === 3 && total_payment < 10000
            ? 'Thanh toán tối thiểu 10.000đ'
            : undefined
        }
      />
    )
  }

  return (
    <ScreenWrapper
      isLoading={isLoading}
      back
      titleHeader={R.strings().select_payments_type}
    >
      <FlatList
        data={data}
        renderItem={renderPaymentType}
        keyExtractor={item => `${item.id}`}
      />
    </ScreenWrapper>
  )
}

export default PaymentTypeScreen
