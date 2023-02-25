import React, { useCallback, useState, ReactNode } from 'react'
import {
  View,
  FlatList,
  FlatListProps,
  StyleSheet,
  LayoutRectangle,
  Text,
} from 'react-native'
import FastImage, { Source } from 'react-native-fast-image'
import R from '@R'
import _ from 'lodash'
import { fonts } from '@app/theme'
// import { fonts } from '@app/theme'

type FastImageSourceType = Source | number
type TImageSize = { width: number; height: number }

interface Props<T> extends FlatListProps<T> {
  empty?: ReactNode | FastImageSourceType
  emptySize?: number | TImageSize
  showEmpty?: boolean
  emptyTxt?: string
}

const DEFAULT_SIZE = {
  height: 0,
  width: 0,
  x: 0,
  y: 0,
}

const RNFlatList = React.forwardRef(
  <itemT extends any>(props: Props<itemT>, ref: any) => {
    const {
      data,
      empty = R.images.ic_empty,
      showEmpty = true,
      emptySize = 250,
      emptyTxt = 'Danh sách trống',
      ...flatListProps
    } = props

    const [flatListSize, setFlatListSize] =
      useState<LayoutRectangle>(DEFAULT_SIZE)

    const isDefaultSize = (size: LayoutRectangle) => {
      return _.isEqual(size, DEFAULT_SIZE)
    }

    const renderEmptyImageSize = () => {
      if (typeof emptySize == 'number')
        return { width: emptySize, height: emptySize }
      else return { width: emptySize.width, height: emptySize.height }
    }

    const renderEmptyComponent = useCallback(() => {
      const isReactNode = React.isValidElement(empty)

      return (
        <View
          style={[
            styles.emptyContainer,
            {
              width: flatListSize.width,
              height: flatListSize.height,
            },
          ]}
        >
          {!!isReactNode ? (
            empty
          ) : (
            <>
              <FastImage
                style={renderEmptyImageSize()}
                source={empty as FastImageSourceType}
              />
              <Text style={styles.emptyTxt} children={emptyTxt} />
            </>
          )}
        </View>
      )
    }, [flatListSize])

    return (
      <FlatList
        ref={ref}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, idx) => `${idx}`}
        {...flatListProps}
        // contentContainerStyle={{
        //   ...(flatListProps.contentContainerStyle as {}),
        //   paddingBottom: 20,
        // }}
        onLayout={event => {
          const size = event.nativeEvent.layout
          if (!isDefaultSize(size)) setFlatListSize(size)
        }}
        data={data}
        ListEmptyComponent={showEmpty ? renderEmptyComponent : undefined}
      />
    )
  }
)

export default RNFlatList

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTxt: {
    ...fonts.regular16,
    marginTop: 20,
    color: '#333',
  },
})
