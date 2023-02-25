import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Platform,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import FstImage from '@app/components/FstImage/FstImage'
import R from '@app/assets/R'
import { colors, fonts, styleView, WIDTH } from '@app/theme'
import FastImage from 'react-native-fast-image'
import { Button } from '@app/components/Button/Button'
import NavigationUtil from '@app/navigation/NavigationUtil'
import Error from '@app/components/Error/Error'
import RenderHTML, { defaultSystemFonts } from 'react-native-render-html'
import DateUtil from '@app/utils/DateUtil'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import { rgba } from 'react-native-color-matrix-image-filters'
import { NewsDetailProps } from './model/NewsModules'
import { callAPIHook } from '@app/utils/CallApiHelper'
import {
  getNewsDetail,
  requestChangePassword,
} from '@app/service/Network/account/AccountApi'
import Loading from '@app/components/Loading'
import reactotron from 'ReactotronConfig'

const NewsDetailScreen = (props: any) => {
  const idNews = props.route.params?.id
  const [size, setSize] = useState({ width: 1, height: 1 })
  const [news, setNews] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  useEffect(() => {
    getData()
  }, [])
  function checkImageURL(url: string) {
    fetch(url)
      .then(res => {
        if (res.status == 404) {
          setSize({ width: WIDTH, height: 150 })
        } else {
          Image.getSize(url, (width, height) => {
            setSize({ width, height })
          })
        }
      })
      .catch(err => {
        setSize({ width: WIDTH, height: 150 })
      })
  }
  const getData = () => {
    const payload = { id: idNews }
    callAPIHook({
      API: getNewsDetail,
      payload,
      useLoading: setIsLoading,
      onSuccess: res => {
        setNews(res.data)
        checkImageURL(res.data.image)
      },
    })
  }
  const styleHtml = {
    h1: styles.description,
    h2: styles.description,
    h3: styles.description,
    h4: styles.description,
    h5: styles.description,
    h6: styles.description,
    li: styles.description,
    ul: styles.description,
    span: styles.description,
    p: styles.description,
    div: styles.description,
    strong: styles.description,
  }
  const systemFonts = [R.fonts.sf_semi_bold]
  const { width, height } = size
  if (isLoading) return <Loading />
  if (!!!news) return <Error reload={getData} />
  return (
    <ScreenWrapper
      isLoading={width == 1 || isLoading}
      style={{ paddingTop: Platform.OS == 'ios' ? 0 : 27 }}
    >
      <StatusBar barStyle={'dark-content'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={news?.image ? { uri: news?.image } : R.images.img_logo}
          style={{ width: WIDTH, aspectRatio: width / height }}
          resizeMode="contain"
        />
        <Text style={styles.title}>{news?.title}</Text>
        <View style={styles.viewTime}>
          <FstImage
            source={R.images.ic_calander}
            style={{ width: 24, height: 24 }}
          />
          <Text style={styles.txtTime}>
            {DateUtil.formatShortDate(news.created_at)}
          </Text>
        </View>
        <View style={{ paddingHorizontal: 16 }}>
          <RenderHTML
            tagsStyles={{
              ...styleHtml,
            }}
            // systemFonts={systemFonts}
            contentWidth={WIDTH}
            source={{ html: news?.content }}
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => NavigationUtil.goBack()}
        style={styles.btnClose}
      >
        <FastImage
          source={R.images.ic_close}
          style={{ width: 20, height: 20 }}
        />
      </TouchableOpacity>
    </ScreenWrapper>
  )
}
const styles = StyleSheet.create({
  image: {
    width: WIDTH,
    aspectRatio: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  title: {
    //...fonts.re,
    fontFamily: R.fonts.sf_regular,
    fontSize: 22,
    color: colors.text.primary,
    padding: 16,
  },
  description: {
    /// ...fonts.regular16,
    // fontFamily: R.fonts.sf_regular,
    color: colors.text.dark,
    fontSize: 16,
    // paddingHorizontal: 16,
  },
  btnClose: {
    position: 'absolute',
    top: Platform.OS == 'ios' ? 20 : 45,
    right: 20,
    height: 44,
    aspectRatio: 1,
    borderRadius: 44,
    borderWidth: 0.5,
    borderColor: colors.line,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  viewTime: {
    ...styleView.rowItem,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  txtTime: {
    // ...fonts.regular14,
    fontSize: 14,
    color: colors.text.dark,
    marginLeft: 4,
  },
})
export default NewsDetailScreen

// import { Animated, StyleSheet, Text, View } from 'react-native'
// import React, { useRef } from 'react'
// import { HEIGHT, WIDTH } from '@app/theme'
// import { Button } from '@app/components/Button/Button'
// var SQUARE_DIMENSIONS = 100
// var SPRING_CONFIG = { speed: 1 } //Soft spring
// export default function NewsDetailScreen() {
//   const pan = useRef(new Animated.ValueXY()).current
//   const opacity = useRef(new Animated.Value(1)).current
//   const animateed = () => {
//     // Animated.timing(pan, {
//     //   toValue: 200,
//     //   duration: 1000,
//     //   useNativeDriver: false,
//     // }).start()
//     Animated.sequence([
//       Animated.spring(pan, {
//         ...SPRING_CONFIG,
//         toValue: { x: 0, y: HEIGHT - SQUARE_DIMENSIONS },
//         useNativeDriver: false,
//       }),
//       // Animated.spring(pan, {
//       //   ...SPRING_CONFIG,
//       //   toValue: {
//       //     x: WIDTH - SQUARE_DIMENSIONS,
//       //     y: HEIGHT - SQUARE_DIMENSIONS,
//       //   },
//       //   useNativeDriver: false,
//       // }),
//       // Animated.spring(pan, {
//       //   ...SPRING_CONFIG,
//       //   toValue: { x: WIDTH - SQUARE_DIMENSIONS, y: 0 },
//       //   useNativeDriver: false,
//       // }),
//       Animated.timing(opacity, {
//         toValue: 0,

//         useNativeDriver: false,
//       }),
//       Animated.spring(pan, {
//         ...SPRING_CONFIG,
//         toValue: { x: 0, y: 0 },
//         useNativeDriver: false,
//       }),
//       Animated.timing(opacity, {
//         toValue: 1,

//         useNativeDriver: false,
//       }),
//     ]).start()
//     // Animated.multiply,
//   }
//   return (
//     <View style={styles.container}>
//       <Animated.View
//         style={[
//           styles.square,
//           {
//             transform: pan.getTranslateTransform(),
//             opacity: opacity,
//           },
//         ]}
//       />
//       <Button style={{ padding: 50 }} onPress={animateed}>
//         <Text>12113</Text>
//       </Button>
//     </View>
//   )
// }

// var styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   square: {
//     width: SQUARE_DIMENSIONS,
//     height: SQUARE_DIMENSIONS,
//     backgroundColor: 'blue',
//   },
// })
