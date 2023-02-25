import React from 'react'
import { View, Text, Switch, StyleSheet } from 'react-native'
import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import { colors, fonts, styleView } from '@app/theme'
import FastImage from 'react-native-fast-image'

interface Props {
  locationAdress?: string
  onDeletePress?: () => void
  switchValue?: boolean
  onSwitchChange?: () => void
  showDefaulBar?: boolean
  showDeleteBar?: boolean
  disable?: boolean
}

const BottomInforEditableForm = (props: Props) => {
  const {
    locationAdress,
    onDeletePress,
    showDefaulBar,
    showDeleteBar,
    switchValue,
    onSwitchChange,
    disable,
  } = props

  return (
    <React.Fragment>
      {/* <Button
        onPress={() => {}}
        children={
          <View
            style={{
              ...styleView.sharedStyle,
              ...styleView.rowItemBetween,
              alignItems: 'center',
              marginTop: 6,
              paddingVertical: 10,
            }}
          >
            <View>
              <Text style={{ ...fonts.regular14, marginBottom: 14 }}>
                Địa chỉ định vị
              </Text>
              <Text style={{ ...fonts.regular16 }}>
                181 Vĩnh Hưng, Hoàng Mai, Hà Nội ...
              </Text>
            </View>
            <FastImage style={styles.icRight} source={R.images.ic_back} />
          </View>
        }
      /> */}
      {showDefaulBar && (
        <View
          style={{
            // ...styleView.sharedStyle,
            ...styleView.rowItemBetween,
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 16,
            backgroundColor: colors.white,
            // opacity: disable ? 0.7 : 1,
          }}
        >
          <Text
            style={{
              fontFamily: R.fonts.sf_regular,
              fontSize: 16,
              color: colors.text.primary,
            }}
            children={R.strings().set_address_default}
          />
          <Switch
            // disabled={disable}
            value={switchValue}
            // trackColor={{ true: colors.primary }}
            trackColor={{ false: colors.focus, true: colors.primary }}
            thumbColor={colors.white}
            onValueChange={onSwitchChange}
          />
        </View>
      )}
      {showDeleteBar && (
        <Button
          onPress={onDeletePress!}
          children={
            <View
              style={{
                marginTop: 25,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <FastImage
                style={{ width: 24, height: 24 }}
                tintColor={'#E72A00'}
                source={R.images.ic_trash}
              />
              <Text
                style={{
                  fontFamily: R.fonts.sf_medium,
                  fontSize: 16,
                  lineHeight: 22,
                  color: '#E72A00',
                  marginLeft: 4,
                }}
              >
                {R.strings().delete_address}
              </Text>
            </View>
          }
        />
      )}
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  icRight: {
    width: 20,
    height: 20,
    transform: [{ rotate: '180deg' }],
  },
})

export default BottomInforEditableForm
