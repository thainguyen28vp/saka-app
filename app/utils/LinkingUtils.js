import { Linking, Platform } from 'react-native';

export const LINKING_TYPE = {
  CALL: 1,
  ZALO: 2,
  WEB: 3,
  MAIL: 4,
  MESSAGER: 5,
  MESS_FB: 6
};

export default (LinkingUtils = (type, value) => {
  const operator = Platform.select({ ios: '&', android: '?' });
  if(!value) return
  switch (type) {
    case LINKING_TYPE.WEB:
      Linking.openURL(value);
      break;
    case LINKING_TYPE.MAIL:
      Linking.openURL(`mailto:${value}?subject= &body=`);
      break;
    case LINKING_TYPE.MESSAGER:
      Linking.openURL(`sms:${operator}body=${value}`);
      break;
    case LINKING_TYPE.CALL:
      let number = value.trim().toString();
      if (Platform.OS !== 'android') {
        number = `telprompt:${number}`;
      } else {
        number = `tel:${number}`;
      }
      Linking.openURL(number);
      break;
    case LINKING_TYPE.ZALO:
      // const number = value.trim().toString();
      Linking.openURL(`https://zalo.me/${value.trim().toString()}`);
      break;
      case LINKING_TYPE.MESS_FB:
        // const number = value.trim().toString();
        Linking.openURL(`http://m.me/${value.trim().toString()}`);
        break;
    default:
      break;
  }
});
