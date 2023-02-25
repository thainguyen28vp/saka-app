import R from '@app/assets/R'
// import NavigationUtil from '@app/navigation/NavigationUtil';
import { showMessages } from '@app/utils/GlobalAlertHelper'
import AsyncStorage from '@react-native-community/async-storage'
import { ResponseType } from '@app/service/Network/model/ApiResponse'
import AsyncStoreService from '../AsyncStorage/AsyncStorageService'
import { BASE_REQUEST } from '@app/config/Constants'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { SCREEN_ROUTER_AUTH } from '@app/config/screenType'

const createAPI = () => {
  const APIInstant = require('axios').default.create()
  APIInstant.defaults.baseURL = BASE_REQUEST.API_URL
  APIInstant.defaults.timeout = 20000
  APIInstant.defaults.headers = { 'Content-Type': 'application/json' }
  APIInstant.interceptors.request.use(async (config: any) => {
    config.headers.token = (await AsyncStoreService.getToken()) || ''
    config.headers.platform = 'app'
    return config
  }, Promise.reject)

  APIInstant.interceptors.response.use((response: ResponseType<any>) => {
    const data = response.data
    if (data && data.code === 10) {
      showMessages(R.strings().notification, R.strings().re_login, () => {
        AsyncStoreService.putToken('').then(() => {})
        NavigationUtil.navigate(SCREEN_ROUTER_AUTH.SPLASH, { re_login: true })
      })
    } else if (data && data.status !== 1) {
      //console.log(data)
      showMessages('', data?.message)
      // (R.strings().notification, data?.message)
    }

    return response
  })
  return APIInstant
}

const axiosClient = createAPI()

/* Support function */
function handleResult<T>(api: any) {
  // if (NetworkHelper.isInternetReachable) {
  return api.then((res: any) => {
    return handleResponse<T>(res.data)
  })
  // } else Promise.reject(new Error('Network offline'));
}

function handleResponse<T>(data: ResponseType<T>) {
  if (data.status !== 1)
    return Promise.reject(new Error(data?.message || 'Co loi xay ra'))
  return Promise.resolve(data)
}

export const ApiClient = {
  get: (url: string, payload?: any) =>
    handleResult(axiosClient.get(url, payload)),
  post: (url: string, payload?: any) =>
    handleResult(axiosClient.post(url, payload)),
  put: (url: string, payload?: any) =>
    handleResult(axiosClient.put(url, payload)),
  path: (url: string, payload?: any) =>
    handleResult(axiosClient.patch(url, payload)),
  delete: (url: string, payload?: any) =>
    handleResult(axiosClient.delete(url, payload)),
}
