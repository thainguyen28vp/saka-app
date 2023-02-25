import { Button } from '@app/components/Button/Button'
import FstImage from '@app/components/FstImage/FstImage'
import { BASE_REQUEST, GIFT_TYPE } from '@app/config/Constants'
import { colors, fonts, styleView, WIDTH } from '@app/theme'
import DateUtil from '@app/utils/DateUtil'
import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import R from '@app/assets/R'
import { Grayscale } from 'react-native-color-matrix-image-filters'
import FastImage from 'react-native-fast-image'

interface Props {
  data: any
  onPress?: () => void
  disable?: boolean
  message?: string
}
const scale = WIDTH / 375
const GiftItem = ({ data, onPress, disable, message }: Props) => {
  const GrayscaledImage = (imageProps: any) => (
    <Grayscale>
      <FastImage {...imageProps} />
    </Grayscale>
  )
  return (
    <Button
      onPress={() => {
        !!onPress && onPress()
      }}
      disabled={disable || !onPress}
      children={
        <View style={styles.listGiftView}>
          <View style={{ ...styleView.rowItem, opacity: disable ? 0.5 : 1 }}>
            {disable ? (
              <GrayscaledImage
                style={[styles.giftImg, { opacity: disable ? 0.5 : 1 }]}
                source={
                  data?.image ? { uri: data.image } : R.images.ic_code_promotion
                }
              />
            ) : (
              <FstImage
                style={styles.giftImg}
                source={
                  data?.image ? { uri: data.image } : R.images.ic_code_promotion
                }
                resizeMode="cover"
              />
            )}
            <View style={styles.viewContent}>
              <View style={styles.flexRow}>
                <Text
                  style={styles.txtName}
                  children={data.name}
                  numberOfLines={1}
                />
              </View>

              <Text
                numberOfLines={2}
                style={styles.txtDescription}
                children={data?.description || ''}
              />
              <Text
                style={styles.txtTime}
                children={DateUtil.formatDisplayDate(data?.end_time)}
              />
            </View>
          </View>
          {disable && (
            <View style={styles.viewWarning}>
              <FstImage
                source={R.images.img_warning2}
                style={styles.iconWarning}
              />
              <Text style={styles.txtWarning}>{message}</Text>
            </View>
          )}
        </View>
      }
    />
  )
}

const styles = StyleSheet.create({
  listGiftView: {
    //...styleView.rowItem,
    width: '100%',
    // marginBottom: 3,
    //  paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    marginTop: 12,
    //marginHorizontal: 16,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  giftImg: {
    height: 96 * scale,
    aspectRatio: 1,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  icon: {
    width: 20,
    aspectRatio: 1,
    marginRight: 8,
  },
  flexRow: {
    //flexDirection: 'row',
    // alignItems: 'center',
    //flex: 1,
    justifyContent: 'space-between',
  },
  txtWarning: {
    color: '#E72A00',
    ...fonts.regular12,
    flex: 1,
  },
  iconWarning: {
    width: 16,
    height: 16,
    marginRight: 4,
    marginVertical: 8,
  },
  viewContent: {
    flex: 1,
    marginHorizontal: 15,
    justifyContent: 'space-around',
  },
  txtName: {
    ...fonts.regular14,
    color: colors.text.primary,
    flex: 1,
  },
  txtTime: {
    ...fonts.regular14,
    color: colors.text.dark,
    // marginLeft: 8,
  },
  txtDescription: { ...fonts.regular14, color: colors.text.dark },
  viewWarning: {
    ...styleView.rowItem,
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    // backgroundColor: 'red',
  },
})

export default GiftItem
