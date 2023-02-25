import MediaSwiper from '@app/components/MediaSwiper/MediaSwiper'
import ProductItem from '@app/components/ProductItem'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { colors, dimensions, fonts, styleView, WIDTH } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { showMessages } from '@app/utils/GlobalAlertHelper'
import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  Animated as AnimatedRN,
  FlatList,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from 'react-native'
import { Button } from '@app/components/Button/Button'
import { checkExistUser, formatPrice } from '@app/utils/FuncHelper'
import FastImage from 'react-native-fast-image'
import R from '@app/assets/R'
import FstImage from '@app/components/FstImage/FstImage'
import RenderHTML from 'react-native-render-html'
import Animated from 'react-native-reanimated'
import {
  useSharedValue,
  useAnimatedStyle,
  Easing,
  withTiming,
} from 'react-native-reanimated'
import Modal from 'react-native-modal'
import ProductSelectTypeView from './component/ProductSelectTypeVIew'
import {
  getProductDetail,
  requestProductRelated,
} from '@app/service/Network/product/ProductApi'
import styles from './styles/stylesDetailProduct'
import { checkDuplicatePrice } from './utils/ProductUtils'
import { isIphoneX } from 'react-native-iphone-x-helper'
import ProductDetailHeader from './component/ProductDetailHeader'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import ButtonFooter from './component/ButtonFooter'
import reactotron from 'reactotron-react-native'
import ProductSelectTypeModal from './component/ProductSelectTypeVIew'
import { useAppSelector } from '@app/store'
import LinearGradient from 'react-native-linear-gradient'

const { width } = dimensions
const scale = width / 375
const NUM_OF_LINES = 4
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
  br: styles.description,
  strong: styles.description,
  // img: styles.imgHtml,
}
const renderersProps = {
  img: {
    enableExperimentalPercentWidth: true,
  },
}
const ProductDetailScreen = (props: any) => {
  const product_id = props.route.params?.id || props.route.params?.product_id
  const category_id = props.route.params?.id || props.route.params?.category_id
  const { data }: any = useAppSelector(state => state.accountReducer)
  const item = props.route.params?.item
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [dialogLoading, setDialogLoading] = useState<boolean>(false)
  const [productDetail, setProductDetail] = useState<any>()
  const [similarProduct, setSimilarProduct] = useState<any>([])
  const [modalTypeVisible, setModalTypeVisible] = useState<boolean>(false)
  const [showMoreContent, setShowMoreContent] = useState<boolean>(false)
  const [itemProduct, setItemProduct] = useState<any>()
  const [isValidLength, setIsValidLength] = useState<boolean>(true)

  const scrolling = useRef(new AnimatedRN.Value(0)).current
  const isBuyNow = useRef<boolean>(false)

  const headerBgColorAnimated = scrolling.interpolate({
    inputRange: [0, 150],
    outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)'],
    extrapolate: 'clamp',
  })
  const borderOpacity = scrolling.interpolate({
    inputRange: [100, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  })

  const BtnBgColorAnimated = scrolling.interpolate({
    inputRange: [0, 150],
    outputRange: ['rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0)'],
    extrapolate: 'clamp',
  })
  const opacityIconBack = {
    opacity: scrolling.interpolate({
      inputRange: [0, 50],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    }),
  }

  const headerTitleAnimated = scrolling.interpolate({
    inputRange: [100, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  })
  const getData = (product_id: number) => {
    callAPIHook({
      API: getProductDetail,
      payload: { product_id },
      useLoading: setIsLoading,
      onSuccess: res => {
        setProductDetail(res.data)
        setItemProduct(res.data)
      },
    })
  }

  const getProductRelated = (product_id: number, category_id: number) => {
    callAPIHook({
      API: requestProductRelated,
      payload: { product_id, category_id },
      //useLoading: setIsLoading,
      onSuccess: res => {
        setSimilarProduct(res.data)
      },
    })
  }
  const checkProductExist = () => {
    if (item?.stock <= 0) return true
    return false
  }
  useEffect(() => {
    getData(product_id)
    getProductRelated(product_id, category_id)
  }, [product_id, category_id])

  useEffect(() => {
    item?.amount == 0
      ? showMessages(
          R.strings().noti,
          R.strings().product_out_of_stock,
          () => {}
        )
      : null
  }, [product_id])
  // const handlePriceCustomerType = (type?: string) => {
  //   switch (type) {
  //     case 'nha_phan_phoi':
  //       return item?.variants[0]?.distributor_price
  //     case 'dai_ly':
  //       return item?.variants[0]?.agent_price
  //     default:
  //       return item?.price
  //   }
  // }
  const renderImageSlider = () => {
    return (
      <MediaSwiper
        data={productDetail?.images.map((item: any) => item.src)}
        activeDotColor={'#595959'}
        inactiveDotColor={'#BFBFBF'}
        itemWidth={width}
        showIndicator
      />
    )
  }
  const renderTopInformation = () => {
    let rangePrice = `${formatPrice(productDetail?.min_price)}đ - ${formatPrice(
      productDetail?.max_price
    )}đ`
    return (
      <View>
        <View style={styles.titlePro}>
          <Text
            style={styles.txtName}
            children={
              productDetail?.product_name + ' ' + (productDetail?.unit || '')
            }
          />
          {/* {productDetail?.stock > 0 && ( */}
          <Text
            style={styles.txtNumberLeft}
            children={`${R.strings().number_left} ${
              productDetail?.stock < 0
                ? 0
                : productDetail?.stock
                ? productDetail?.stock
                : 0
            } ${R.strings().product}`}
          />
          {/* )} */}
          <Text
            style={styles.txtPrice}
            children={`${formatPrice(productDetail?.price) || 0}đ`}
          />
          {/* <Text
            style={styles.txtPriceSale}
            children={`cái này chưa biết`}
          /> */}
        </View>
      </View>
    )
  }
  const renderProductAttributeView = () => {
    return (
      <View style={styles.viewDescription}>
        <Text
          style={styles.txtProductDetail}
          children={R.strings().product_detail}
        />
        {/* <Text style={{ color: colors.text.dark, ...fonts.regular16 }}>
          {productDetail?.description}
        </Text> */}
        <ScrollView
          scrollEnabled={false}
          style={{
            maxHeight: showMoreContent ? 10000 : 75,
            // backgroundColor: 'red',
          }}
        >
          <RenderHTML
            contentWidth={WIDTH}
            source={{ html: productDetail?.description }}
            tagsStyles={{
              ...styleHtml,
            }}
            renderersProps={renderersProps}
          />
          {!showMoreContent && (
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.7)', '#fff']}
              style={styles.linearGradient}
            />
          )}
        </ScrollView>
        {isValidLength && (
          <Button
            onPress={() => {
              setShowMoreContent(prev => !prev)
            }}
            style={styles.btnSeeMore}
            children={
              <Text
                style={styles.txtSeeMore}
                children={
                  !showMoreContent ? R.strings().see_more : R.strings().see_less
                }
              />
            }
          />
        )}
      </View>
    )
  }

  const renderSimilarProduct = () => {
    return (
      <View>
        {!!similarProduct.length && (
          <View style={styles.viewRelated}>
            <Text
              style={styles.txtRelated}
              children={R.strings().product_related}
            />
            <View style={styles.line} />
          </View>
        )}
        <View style={styles.wrapperRelated}>
          {similarProduct.map((item: any, index: number) => {
            return (
              <ProductItem
                customer_type={data?.group || ''}
                item={item}
                index={index}
                key={item.kiotviet_product_id}
                onPressProductItem={item => {
                  if (item.stock <= 0) {
                    showMessages('', R.strings().product_stop_sell)
                    return
                  }
                  setModalTypeVisible(true)
                  setItemProduct(item)
                }}
              />
            )
          })}
        </View>
      </View>
    )
  }

  const ModalSelectType = () => {
    return (
      <Modal
        backdropColor={'transparent'}
        isVisible={modalTypeVisible}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        style={{ margin: 0 }}
      >
        <ProductSelectTypeView
          customer_type={data?.group || ''}
          productDetail={itemProduct}
          onClosePress={() => {
            isBuyNow.current = false
            setModalTypeVisible(false)
          }}
          product_id={itemProduct?.id}
          stock_id={itemProduct?.stock_id}
          isBuyNow={isBuyNow.current}
          shop_id={itemProduct?.shop_id}
        />
      </Modal>
    )
  }
  reactotron.log('productDetail', productDetail)
  return (
    <ScreenWrapper
      unsafe
      //statusBar="dark-content"
      header={
        <ProductDetailHeader
          title={productDetail?.product_name}
          headerBgColor={headerBgColorAnimated}
          headerTitleColor={headerTitleAnimated}
          headerBtnColor={BtnBgColorAnimated}
          borderOpacity={borderOpacity}
          opacityBack={opacityIconBack}
          isLike={!!productDetail?.check_like}
          onLikeClick={() => {}}
        />
      }
      dialogLoading={dialogLoading}
      isLoading={isLoading}
    >
      <AnimatedRN.ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => getData(product_id)}
          />
        }
        scrollEventThrottle={16}
        onScroll={AnimatedRN.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: scrolling,
                },
              },
            },
          ],
          { useNativeDriver: false }
        )}
      >
        <ModalSelectType />
        {renderImageSlider()}
        {renderTopInformation()}
        {!!productDetail?.description && renderProductAttributeView()}
        {renderSimilarProduct()}
      </AnimatedRN.ScrollView>
      <ButtonFooter
        bg3={item?.amount == 0 ? '#DDD' : colors.primary}
        disabled={item?.amount == 0}
        action1={async () => {
          checkExistUser(async () => {
            if (!checkProductExist()) {
              setItemProduct(productDetail)
              setModalTypeVisible(true)
            } else showMessages('', R.strings().product_stop_sell)
          })
        }}
        action3={() => {
          checkExistUser(async () => {
            if (!checkProductExist()) {
              isBuyNow.current = true
              setItemProduct(productDetail)
              setModalTypeVisible(true)
            } else {
              showMessages('', R.strings().product_stop_sell)
            }
          })
        }}
        title3={R.strings().buyNow}
        title1={R.strings().addToCart}
        iphoneX={isIphoneX()}
        bg1={colors.white}
        line
      />
    </ScreenWrapper>
  )
}

export default ProductDetailScreen
