import { StyleProp, TextStyle, ViewStyle } from 'react-native'
import { Source } from 'react-native-fast-image'

export interface Actions {
  icon: Source | number
  style?: ViewStyle | ViewStyle[]
  label?: string
  styleIcon?: any
  onPress?: () => void
}

export interface FABGroupProps {
  style?: ViewStyle | ViewStyle[]

  icon?: Source | number

  label?: string | React.ReactNode

  actions?: Actions[]
  title?: String
  styleTitle?: StyleProp<TextStyle>
}
