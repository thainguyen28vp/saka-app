import { Button } from '@app/components/Button/Button'
import { Text, View, Switch, TextInput, Platform } from 'react-native'
import React, { useRef } from 'react'
import FastImage from 'react-native-fast-image'
import { colors, fonts, styleView } from '@app/theme'
import R from '@app/assets/R'
import { styles } from '../styles/StylesPaymentScreen'
import { color } from 'react-native-reanimated'
export const MemoOptionItem = ({
  title,
  icon,
  valueInput,
  onChangeText,
  color,
}: any) => {
  const ref = useRef<TextInput>(null)
  return (
    <Button
      onPress={() => {
        ref.current?.focus()
      }}
      children={
        <View
          style={[
            styles.giftViewContainer,
            Platform.OS == 'android' && { paddingBottom: 0 },
          ]}
        >
          <View style={{ ...styleView.rowItem, flex: 1, marginRight: 16 }}>
            <FastImage
              style={{ width: 24, height: 24, marginRight: 8 }}
              source={icon || R.images.ic_memo}
              tintColor={!color ? colors.primary : colors.black}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  {
                    ...fonts.regular16,
                    color: colors.text.primary,
                    //
                  },
                  Platform.OS == 'ios' && { marginBottom: 8 },
                ]}
                children={R.strings().memo}
              />
              {!color ? (
                <TextInput
                  ref={ref}
                  placeholder={R.strings().add_memo}
                  placeholderTextColor={colors.text.dark}
                  style={{
                    ...fonts.regular16,
                    color: colors.text.dark,
                    // maxHeight: 40,
                    paddingVertical: 0,
                    marginVertical: 4,
                  }}
                  value={valueInput}
                  onChangeText={onChangeText}
                  editable={!color}
                />
              ) : (
                <Text style={{ ...fonts.regular16, color: colors.text.dark }}>
                  {valueInput}
                </Text>
              )}
            </View>
          </View>
        </View>
      }
    />
  )
}
