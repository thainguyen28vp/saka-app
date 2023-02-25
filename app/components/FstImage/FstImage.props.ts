import { ViewStyle, StyleProp } from 'react-native'
import { ImageStyle, Source } from 'react-native-fast-image'
type ResizeMode = 'contain' | 'cover' | 'stretch' | 'center'
export interface ImageProps {
  /**
   * Overwrite image style
   * @default undefined
   */
  style?: StyleProp<ImageStyle>

  /**
   * Overwrite wrap image style
   * @default undefined
   */
  containerStyle?: StyleProp<ViewStyle>

  /**
   * Source image(local)
   * @default undefined
   */
  source: Source | number | any

  /**
   * Custom resizeMode
   * @default contain
   */
  resizeMode?: ResizeMode
  children?: React.ReactNode

  defaultSource?: Source | number
}
