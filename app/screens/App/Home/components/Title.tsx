import { Button } from '@app/components/Button/Button'
import React from 'react'
import { View, Text, ImageBackground, StyleSheet } from 'react-native'
import R from '@app/assets/R'
import { colors, WIDTH } from '@app/theme'

interface Props {
  title?: string
  onPress?: () => void
}
const scale = WIDTH / 375
const Title = ({ title, onPress }: Props) => {
  return (
    <ImageBackground source={R.images.img_bg_header} style={styles.img}>
      <Text style={styles.txtTitle}>{title}</Text>
      <Button
        onPress={onPress}
        // style={[styles.btnSeeMore]}
        children={
          <Text style={styles.txtSeeMore} children={R.strings().see_more} />
        }
      />
    </ImageBackground>
    // <View
    //   style={[
    //     styles.containerHeaderCategory,
    //     {
    //       marginTop: 8,
    //       marginBottom: 15,
    //       paddingHorizontal: 15,
    //     },
    //   ]}
    // >
    //   <Text style={styles.txtTitle}>{title}</Text>
    //   <Button
    //     onPress={onPress}
    //     style={[styles.btnSeeMore]}
    //     children={
    //       <Text style={styles.txtSeeMore} children={R.strings().see_more} />
    //       // <View style={styles.containerSeeMore}>
    //       //   <Text style={styles.txtSeeMore} children={R.strings().see_more} />
    //       //   <FstImage
    //       //     source={R.images.ic_arrow_right}
    //       //     style={{ width: 16, height: 20, marginLeft: 5 }}
    //       //   />
    //       // </View>
    //     }
    //   />
    // </View>
  )
}
const styles = StyleSheet.create({
  img: {
    width: WIDTH,
    height: 41 * scale,
    // marginTop: 4 * scale,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    // paddingHorizontal: 15 * scale,
    bottom: -1,
  },
  txtTitle: {
    fontSize: 18 * scale,
    fontFamily: R.fonts.sf_bold,
    marginLeft: 15 * scale,
    color: colors.brand,
  },
  txtSeeMore: {
    fontSize: 13 * scale,
    color: colors.white,
    fontFamily: R.fonts.sf_regular,
    // textDecorationLine: 'underline',
    textDecorationColor: colors.line,
    marginRight: 10 * scale,
  },
})
export default Title
