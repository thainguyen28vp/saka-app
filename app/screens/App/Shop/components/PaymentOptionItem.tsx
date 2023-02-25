import { Button } from '@app/components/Button/Button'
import { Text, View, Switch, TextInput } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'
import { colors, fonts, styleView } from '@app/theme'
import R from '@app/assets/R'
import { styles } from '../styles/StylesPaymentScreen'
import { color } from 'react-native-reanimated'
interface Props {
  title?: string
  content?: string
  colorIcon?: string
  icon?: any
  isPoint?: boolean
  valueSwitch?: boolean
  point?: number
  paymentStatus?: string
  colorStatus?: string
  onValueChange?: () => void
  onPress?: () => void
  paymentType: string
}
export const OptionItem = ({
  title,
  content,
  icon,
  isPoint,
  point,
  colorIcon,
  valueSwitch,
  colorStatus,
  paymentStatus,
  paymentType,
  onValueChange,
  onPress,
}: Props) => {
  return (
    <Button
      onPress={onPress}
      disabled={point == 0}
      children={
        <View style={styles.giftViewContainer}>
          <View style={{ ...styleView.rowItem, flex: 1, marginRight: 16 }}>
            <FastImage
              style={{ width: 24, height: 24, marginRight: 8 }}
              source={icon || R.images.ic_code_promotion}
              tintColor={colorIcon ? colorIcon : colors.primary}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{ ...fonts.regular16, color: colors.text.primary }}
                children={title}
              />

              <Text
                style={{
                  ...fonts.regular15,
                  marginTop: 7,
                  color: colors.text.dark,
                  flex: 1,
                }}
                numberOfLines={2}
              >
                {content}
                {paymentType == 'vnpay' && (
                  <Text style={{ color: colorStatus }}>{paymentStatus}</Text>
                )}
              </Text>

              {/* <TextInput
                placeholder="Thêm ghi chú"
                placeholderTextColor={colors.text.dark}
                style={{ ...fonts.regular16, color: colors.text.dark }}
              /> */}
            </View>
          </View>
          {isPoint ? (
            <Switch
              value={valueSwitch}
              trackColor={{ true: colors.primary, false: colors.focus }}
              thumbColor={colors.white}
              onValueChange={onValueChange}
              disabled={point == 0}
            />
          ) : !!onPress ? (
            <Button
              // disabled={!stockDiscount}
              onPress={() => {
                // Dispatch(
                //   cancelVoucher({
                //     enter_id: enterprise.id,
                //     stock_id: stock.id,
                //   })
                // )
              }}
              children={
                <FastImage
                  style={{ width: 20, height: 20 }}
                  source={
                    // !!stockDiscount
                    //   ? R.images.ic_remove
                    R.images.ic_arrow_right
                  }
                  tintColor={colors.gray}
                />
              }
            />
          ) : (
            <></>
          )}
        </View>
      }
    />
  )
}
