import Toast from 'react-native-root-toast'
import { dimensions } from '@app/theme'
const { width, height } = dimensions
const ToastShow = (message: string) => {
  Toast.show(message, {
    duration: 2000,
    position: height - 150,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
  })
}
export default ToastShow
