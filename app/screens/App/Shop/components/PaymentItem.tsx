import { View, StyleSheet, Text } from 'react-native'
import React from 'react'
import FstImage from '@app/components/FstImage/FstImage'
import { fonts } from '@app/theme'
import { Button } from '@app/components/Button/Button'
import { colors } from 'react-native-elements'
interface Props {
  icon: any
  title: string
  description: string
  onPress?: () => void
  disabled?: boolean
  message?: string
}
const PaymentItem = ({
  icon,
  title,
  description,
  onPress,
  disabled,
  message,
}: Props) => {
  return (
    <Button
      disabled={disabled}
      onPress={onPress}
      style={[styles.wrapper, disabled && { opacity: 0.4 }]}
    >
      <View style={{ flexDirection: 'row' }}>
        <FstImage source={icon} style={styles.icon} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </Button>
  )
}
const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    marginTop: 2,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  title: {
    ...fonts.semi_bold16,
    color: '#262626',
  },
  description: {
    color: '#69747E',
    ...fonts.regular15,
    marginTop: 8,
  },
  message: {
    color: colors.error,
    ...fonts.regular15,
    marginTop: 2,
  },
})
export default PaymentItem
