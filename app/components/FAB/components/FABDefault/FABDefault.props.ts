import { ViewStyle } from 'react-native';
import { Source } from 'react-native-fast-image';
export interface FABDefaultProps {
  onPress?: () => void;

  style?: ViewStyle | ViewStyle[];

  icon?: Source | number;

  label?: string | React.ReactNode;
}
