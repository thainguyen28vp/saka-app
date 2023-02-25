import React, { memo, forwardRef, LegacyRef } from 'react'
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleProp,
  ViewStyle,
  ImageRequireSource,
  TextStyle,
} from 'react-native'
import R from '@app/assets/R'
import { colors, fonts, styleView } from '@app/theme'
import { Button } from '@app/components/Button/Button'
import FastImage from 'react-native-fast-image'
import isEqual from 'react-fast-compare'
import * as Animatable from 'react-native-animatable'
import { FormikErrors } from 'formik'

interface FormInputProps extends TextInputProps {
  label?: string
  labelStyle?: TextStyle
  renderLabel?: React.ReactNode
  placeholder?: string
  selectedText?: string
  requireText?: boolean
  clickable?: boolean
  onPress?: () => void
  leftIcon?: ImageRequireSource
  containerStyle?: StyleProp<ViewStyle>
  inputStyle?: StyleProp<ViewStyle>
  rightIcon?: ImageRequireSource
  showRightIcon?: boolean
  show?: boolean
  error?: string | string[] | FormikErrors<any> | FormikErrors<any>[]
  renderRightIcon?: React.ReactNode
}

const FormInputComponent = forwardRef(
  (props: FormInputProps, ref: LegacyRef<TextInput>) => {
    const {
      label,
      placeholder,
      labelStyle,
      renderLabel,
      clickable = false,
      onPress,
      leftIcon,
      selectedText,
      rightIcon = R.images.ic_down,
      showRightIcon,
      renderRightIcon,
      requireText = true,
      error,
      ...inputProps
    } = props

    const clickableView =
      !!selectedText && selectedText.length > 0 ? (
        <Text
          style={{
            ...fonts.regular16,
            color: colors.black,
          }}
          children={selectedText}
        />
      ) : (
        <Text
          style={{
            ...fonts.regular16,
            color: '#8C8C8C',
          }}
          children={placeholder}
        />
      )

    const renderFormInputView = () => {
      return (
        <>
          <View
            style={{
              paddingBottom: 7,
              borderBottomWidth: 1,
              borderColor: '#E7E7E7',
              marginBottom: 16,
            }}
          >
            {!!label && (
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    {
                      ...fonts.regular14,
                      marginBottom: 7,
                      color: '#595959',
                      marginRight: 3,
                    },
                    labelStyle,
                  ]}
                  children={label}
                />
                {requireText && <Text style={{ color: '#E62900' }}>*</Text>}
              </View>
            )}
            {React.isValidElement(renderLabel) && renderLabel}

            <View
              style={{
                ...styleView.rowItemBetween,
                paddingLeft: clickable ? 12 : 0,
                alignItems: 'center',
              }}
            >
              {!!leftIcon && (
                <FastImage
                  style={{ width: 20, height: 20 }}
                  resizeMode={'contain'}
                  source={leftIcon}
                  tintColor={colors.gray}
                />
              )}
              {!clickable ? (
                <TextInput
                  {...inputProps}
                  ref={ref}
                  style={{
                    ...fonts.regular16,
                    color: colors.black,
                    height: 26,
                    paddingHorizontal: 12,
                    paddingTop: 0,
                    paddingBottom: 0,
                    flex: 1,
                  }}
                  placeholder={placeholder}
                  placeholderTextColor={colors.text.light}
                />
              ) : (
                clickableView
              )}

              {renderRightIcon}
              {showRightIcon && (
                <FastImage
                  style={{
                    width: 24,
                    height: 24,
                    marginRight: 5,
                  }}
                  source={rightIcon}
                />
              )}
            </View>
          </View>
          {!!error && (
            <Animatable.Text
              animation="fadeIn"
              style={{
                ...fonts.regular12,
                color: '#FF544D',
                marginTop: -10,
                marginBottom: 10,
                textAlign: 'right',
              }}
              children={error}
            />
          )}
        </>
      )
    }

    return !!onPress ? (
      <Button onPress={onPress} children={renderFormInputView()} />
    ) : (
      renderFormInputView()
    )
  }
)

const FormInput = memo(FormInputComponent, isEqual)

export default FormInput
