import R from '@app/assets/R'
import Empty from '@app/components/Empty/Empty'
import Error from '@app/components/Error/Error'
import Loading from '@app/components/Loading'
import ProductItem from '@app/components/ProductItem'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import Search from '@app/components/Search'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { requestGetCategory } from '@app/service/Network/product/ProductApi'
import { useAppDispatch, useAppSelector } from '@app/store'
import { colors, WIDTH } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import styles from './styles/stylesProduct'
import { showMessages } from '@app/utils/GlobalAlertHelper'
import { Tab, Tabs } from 'native-base'
import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  Platform,
  TextInput,
  SafeAreaView,
  StatusBar,
} from 'react-native'
import Modal from 'react-native-modal'
import ProductSelectTypeModal from './component/ProductSelectTypeVIew'
import { requestListProductThunk } from './slices/ListProductSlice'
import CartButton from './component/CartButton'
import { Button } from '@app/components/Button/Button'
import { DEFAULT_PARAMS } from '@app/config/Constants'
import { clearFilter, updateFilter } from './slices/FilterSlice'
import FastImage from 'react-native-fast-image'
import CustomTopTab from '../Order/components/CustomTopTab'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import isUser from '@app/utils/isUser'
import CategoryProps from './module/CategoryProps'
import reactotron from 'ReactotronConfig'

const ProductScreen = (props: any) => {
  const { params } = props?.route
  const lastContentOffset = useSharedValue(0)
  // const isScrolling = useSharedValue(false)
  const translateYIOS = useSharedValue(0)
  const opacityAndroidTab = useSharedValue(1)
  //  var onEndReachedCalledDuringMomentum = false
  //const page =
  const [tab, setTab] = useState(params?.page || 0)
  const [page, setPage] = useState(DEFAULT_PARAMS.PAGE)
  const appDispatch = useAppDispatch()
  const [idCategory, setIdCategory] = useState<any>(params?.idCate)
  const [idChild, setIdChild] = useState<any>(null)
  const refTab = useRef(null)
  const [listCategory, setListCategory] = useState<CategoryProps[]>([])
  const [search, setSearch] = useState(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [modalTypeVisible, setModalTypeVisible] = useState<boolean>(false)
  const isBuyNow = useRef<boolean>(false)
  const [itemProduct, setItemProduct] = useState<any>()
  const ListProductReducer = useAppSelector(
    (state: any) => state.listProductReducer
  )
  const { data }: any = useAppSelector(state => state.accountReducer)
  const datInfoUser = useAppSelector((state: any) => state.accountReducer)
  const FilterReducer = useAppSelector(state => state.filterReducer)
  const refInput = useRef<TextInput>(null)
  const dataFilter: any = FilterReducer.data
  const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList)
  useEffect(() => {
    if (params?.page != undefined && refTab.current) {
      refTab.current.goToPage(params?.page)
    }
  }, [params?.page, params?.numberScrollTab])
  useEffect(() => {
    if (params?.clickSearch) refInput.current?.focus()
  }, [params?.clickSearch])
  useEffect(() => {
    if (!!params?.pageProduct) {
      setPage(1)
    }
  }, [params?.pageProduct])
  useEffect(() => {
    getListCategory()
  }, [])
  useEffect(() => {
    if (search != undefined) {
      const timer = setTimeout(() => {
        setPage(1)
        getListProduct(1)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [search])
  useEffect(() => {
    if (page != 1) {
      getListProduct()
    }
  }, [page])
  useEffect(() => {
    getListProduct()
    // return () => {
    //   appDispatch(
    //     updateFilter({
    //       sell: undefined,
    //       time: undefined,
    //       price: undefined,
    //       reload: undefined,
    //     })
    //   )
    // }
  }, [idCategory, idChild, listCategory])
  useEffect(() => {
    return () => {
      setIdChild(null)
      lastContentOffset.value = 0
      translateYIOS.value = 0
      opacityAndroidTab.value = 1
    }
  }, [idCategory])

  useEffect(() => {
    if (
      dataFilter.sell != undefined ||
      dataFilter.price != undefined ||
      dataFilter.time != undefined ||
      dataFilter.reload != undefined
    ) {
      setPage(1)
      getListProduct(1)
      return
    }
  }, [dataFilter])
  const getListProduct: any = (pageNumber?: number) => {
    if (!listCategory.length || listCategory == undefined) {
      return
    }
    const payload = {
      page: pageNumber || page,
      limit: DEFAULT_PARAMS.LIMIT,
      //limit: 60,
      search: search,
      parent_id: idCategory?.id || listCategory[0]?.id,
      //idCategory
      category_id: idChild,
      custom_type: dataFilter.sell
        ? dataFilter.sell == 1
          ? 'is_best_selling'
          : 'is_sale_off'
        : undefined,
      price_sort_order: dataFilter.price
        ? dataFilter.price == 1
          ? 'DESC'
          : 'ASC'
        : undefined,
      created_at_sort_order: dataFilter.time
        ? dataFilter.time == 1
          ? 'DESC'
          : 'ASC'
        : undefined,
      kiotviet_id: datInfoUser?.data?.kiotviet_id,
    }
    reactotron.log!(payload)
    appDispatch(requestListProductThunk(payload))
  }

  const getListCategory = async () => {
    try {
      callAPIHook({
        API: requestGetCategory,
        payload: {
          limit: 100,
        },
        useLoading: setIsLoading,
        onSuccess: res => {
          const categoryAll: any = [{ id: undefined, name: 'Tất cả' }]
          setListCategory(categoryAll.concat(res.data))
          // setListCategory([])
        },
        onError: () => {
          setListCategory([])
        },
      })
    } catch (error) {}
  }
  const actionCateCildStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(translateYIOS.value, {
            duration: 200,
            easing: Easing.inOut(Easing.ease),
          }),
        },
      ],
    }
  })
  const actionopacityAndroidTab = useAnimatedStyle(() => {
    return {
      zIndex: withTiming(opacityAndroidTab.value, {
        duration: 350,
        easing: Easing.inOut(Easing.ease),
      }),
      opacity: withTiming(opacityAndroidTab.value, {
        duration: 350,
        easing: Easing.inOut(Easing.ease),
      }),
    }
  })
  const scrollHandler = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y

    if (lastContentOffset.value > offsetY) {
      translateYIOS.value = 0
      opacityAndroidTab.value = 1
      //  console.log('scrolling up')
    } else if (lastContentOffset.value < offsetY) {
      if (offsetY > 0) {
        translateYIOS.value = -45
        opacityAndroidTab.value = 0
      }
      //  console.log('scrolling down')
    }
    lastContentOffset.value = offsetY
  }

  const modalSelectType = () => {
    return (
      <Modal
        backdropColor={'transparent'}
        isVisible={modalTypeVisible}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        style={{ margin: 0 }}
      >
        <ProductSelectTypeModal
          customer_type={data?.group || ''}
          productDetail={itemProduct}
          onClosePress={() => {
            isBuyNow.current = false
            setModalTypeVisible(false)
          }}
          product_id={itemProduct?.id}
          isBuyNow={isBuyNow.current}
        />
      </Modal>
    )
  }
  const renderFooterFlatlist = () => {
    if (ListProductReducer.isLoadMore)
      return <Text style={styles.txtLoading}>{R.strings().loading}</Text>
    return <></>
  }
  // const onMomentumScrollBegin = () => {
  //   onEndReachedCalledDuringMomentum = false
  // }
  const handleLoadMore = () => {
    const { isLastPage, isLoadMore } = ListProductReducer
    // console.log(onEndReachedCalledDuringMomentum, isLastPage, isLoadMore)
    //!onEndReachedCalledDuringMomentum &&
    if (!isLastPage && !isLoadMore) setPage(prev => prev + 1)
  }

  const renderListProduct = (index: number, checkChild: boolean) => {
    if (ListProductReducer.isLoading)
      return <Loading backgroundColor={colors.backgroundColor} />
    if (!listCategory.length) return <Empty />

    // if (!ListProductReducer.data?.length)
    //   return <Empty backgroundColor={colors.backgroundColor} />
    return (
      <>
        <FlatList
          key={index}
          numColumns={2}
          refreshing={false}
          onRefresh={async () => {
            appDispatch(
              updateFilter({
                sell: undefined,
                time: undefined,
                price: undefined,
                childIdCate: undefined,
                reload: Math.random(),
              })
            )
          }}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          ListFooterComponent={renderFooterFlatlist}
          onEndReachedThreshold={0.1}
          scrollEventThrottle={16}
          ListEmptyComponent={<Empty />}
          onScroll={scrollHandler}
          // onScroll={AnimatedRN.event(
          //   [{ nativeEvent: { contentOffset: { y: refScroll } } }],
          //   {
          //     useNativeDriver: true,
          //     listener: event => {
          //       const offsetY = event.nativeEvent.contentOffset.y
          //       // do something special
          //     },
          //   }
          // )}
          // onScrollEndDrag={() => (isScrolling.value = false)}
          // onScrollBeginDrag={() => (isScrolling.value = true)}
          contentContainerStyle={[
            styles.styleFlatlist,
            {
              paddingTop: checkChild ? 55 : 16,
            },
          ]}
          // onMomentumScrollBegin={onMomentumScrollBegin}
          //  style={{ flex: 1, zIndex: -100, backgroundColor: 'red' }}
          data={ListProductReducer?.data}
          keyExtractor={(item: any) => `${item.id}-${Math.random()}`}
          renderItem={({ item, index }: any) => (
            <ProductItem
              customer_type={data?.group || ''}
              item={item}
              index={index}
              onPressProductItem={item => {
                if (item.stock <= 0) {
                  showMessages('', R.strings().product_stop_sell)
                  return
                }
                setModalTypeVisible(true)
                setItemProduct(item)
              }}
            />
          )}
        />
        {modalSelectType()}
      </>
    )
  }
  const CateChild = ({ child }: any) => {
    return (
      <Button
        onPress={() => {
          setPage(1)
          if (child.category_id === idChild) {
            setIdChild(undefined)
          } else setIdChild(child.category_id)
        }}
        children={
          <View
            style={[
              styles.wrapperChild,
              idChild === child.category_id && {
                backgroundColor: colors.brand,
              },
            ]}
          >
            <Text
              style={[
                styles.txtChild,
                idChild === child.category_id && {
                  color: colors.white,
                },
              ]}
            >
              {child.name}
            </Text>
          </View>
        }
      />
    )
  }

  const renderChild = () => {
    const data =
      idCategory?.list_child?.filter((x: any) => x.status != 0) ||
      listCategory[0]?.list_child?.filter((x: any) => x.status != 0) ||
      []
    if (!data.length) return <></>
    return (
      <Animated.View
        style={[
          {
            position: 'absolute',

            top: 45,
            width: WIDTH,
            backgroundColor: colors.backgroundColor,
            height: 45,
            //  marginVertical: 12,
            //zIndex: 100,
            // opacity: 0,
          },
          Platform.OS == 'ios' ? actionCateCildStyle : actionopacityAndroidTab,
          // ,
        ]}
      >
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={data}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }) => <CateChild child={item} />}
          contentContainerStyle={{
            paddingHorizontal: 15,
            // flexGrow: 1,
            alignItems: 'center',
          }}
        />
      </Animated.View>
    )
  }
  const renderBodyTab = () => {
    if (isLoading) return <Loading />
    if (!listCategory.length) return <Empty />
    if (ListProductReducer.error) return <Error reload={getListProduct} />

    return (
      <>
        <Tabs
          ref={refTab}
          initialPage={tab || 0}
          onChangeTab={({ i }: { i: number }) => {
            setIdCategory(listCategory[i])
            setPage(1)
            // setTab(i)
          }}
          renderTabBar={() => (
            <CustomTopTab bottomView={Platform.OS == 'ios' && renderChild} />
          )}
        >
          {listCategory.map((item: any, index: number) => {
            return (
              <Tab key={item.id} heading={item.name}>
                <>
                  {/* {renderChild()} */}
                  {renderListProduct(
                    index,
                    !!item?.list_child?.filter((x: any) => x.status != 0).length
                  )}
                </>
              </Tab>
            )
          })}
        </Tabs>
      </>
    )
  }
  const renderHeader = () => {
    return (
      <SafeAreaView style={{ backgroundColor: colors.white }}>
        <StatusBar barStyle="dark-content" translucent />
        <View style={styles.header}>
          <Button
            onPress={() => {
              NavigationUtil.goBack()
              appDispatch(clearFilter())
            }}
          >
            <FastImage
              source={R.images.ic_back}
              style={{ width: 20, aspectRatio: 1 }}
              tintColor={colors.gray}
            />
          </Button>
          <Search
            value={search}
            containerStyle={styles.vSearch}
            placeholder={R.strings().search_product}
            onChangeText={(value: any) => {
              if (value[0] == ' ') return
              setSearch(value)
            }}
            style={{ flex: 1 }}
            ref={refInput}
          />
          <Button
            onPress={() =>
              isUser(() => NavigationUtil.navigate(SCREEN_ROUTER_APP.CART))
            }
          >
            <CartButton style={{ marginHorizontal: 16 }} />
          </Button>
          <Button
            onPress={() =>
              NavigationUtil.navigate(SCREEN_ROUTER_APP.FILTER_SEARCH, {
                childNameCate: idCategory?.name || listCategory[0].name,
                childIdCate: idCategory?.id || listCategory[0].id,
              })
            }
          >
            <FastImage
              source={R.images.ic_filter}
              style={{ width: 20, aspectRatio: 1 }}
            />
          </Button>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <ScreenWrapper
      header={renderHeader()}
      children={
        <View style={{ flex: 1 }}>
          {Platform.OS == 'android' && renderChild()}
          {renderBodyTab()}
        </View>
      }
    />
  )
}

export default ProductScreen
