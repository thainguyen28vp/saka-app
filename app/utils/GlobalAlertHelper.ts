import { ROOT_STACK } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'

export const showConfirm = (
  title: string,
  content: string,
  action: () => void,
  textConfirm?: string,
  textCancel?: string
) => {
  NavigationUtil.navigate(ROOT_STACK.GLOBAL_CONFIRM, {
    title,
    content,
    action,
    textConfirm,
    textCancel,
  })
}

export const showMessages = (
  title: string,
  content: string,
  action: () => void = () => {},
  text?: string
) => {
  NavigationUtil.navigate(ROOT_STACK.GLOBAL_ALERT, {
    title,
    content,
    action,
    text,
  })
}