import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { colors, dimensions, fonts, styleView } from '@app/theme'
import R from '@R'

type AlertProp = {
  title?: string
  content?: string
  action?: () => void
  text?: string
}

interface Props {
  navigation: any
  route: { params: AlertProp }
}

const { width } = dimensions

const ModalAlert = (props: Props) => {
  const {
    navigation,
    route: { params },
  } = props

  const title = params?.title || R.strings().noti
  const content = params?.content
  const action = params?.action
  const text = params?.text || 'Ok'

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.title} children={title} />
        <Text style={styles.description} children={content} />
        <TouchableOpacity
          onPress={() => {
            navigation.pop()
            !!action && action()
          }}
          children={
            <View
              style={styles.btn}
              children={
                <Text style={{ ...fonts.medium16, color: colors.white }}>
                  {text}
                </Text>
              }
            />
          }
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    // zIndex: 100,
  },
  container: {
    ...styleView.centerItem,
    width: width - 40,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 27,
  },
  btn: {
    ...styleView.centerItem,
    width: width - 80,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  title: { ...fonts.semi_bold16, color: colors.text.primary },
  description: {
    ...fonts.regular16,
    marginVertical: 20,
    color: colors.text.dark,
    textAlign: 'center',
  },
})

export default ModalAlert
