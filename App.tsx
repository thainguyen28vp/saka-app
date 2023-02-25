import ErrorBoundary from '@app/components/ErrorBoundary'
import store from '@app/store'
import React from 'react'
import { LogBox } from 'react-native'
import codePush from 'react-native-code-push'
import { RootSiblingParent } from 'react-native-root-siblings'
import { Provider } from 'react-redux'
import AppContainer from './AppContainer'
import { showConfirm } from '@app/utils/AlertHelper'
LogBox.ignoreAllLogs()

class App extends React.Component {
  componentDidMount() {
    codePush.disallowRestart()
    //
  }

  codePushStatusDidChange(status: any) {
    switch (status) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
      case codePush.SyncStatus.INSTALLING_UPDATE:
      case codePush.SyncStatus.UP_TO_DATE:
        break
      case codePush.SyncStatus.UPDATE_INSTALLED:
        showConfirm('Đã có bản cập nhật', 'Khởi động lại ứng dụng ?', () => {
          codePush.allowRestart()
          setTimeout(() => {
            codePush.restartApp()
          }, 1000)
        })
        break
    }
  }

  render() {
    return (
      <ErrorBoundary>
        <Provider store={store}>
          <RootSiblingParent>
            <AppContainer />
          </RootSiblingParent>
        </Provider>
      </ErrorBoundary>
    )
  }
}

let codePushOptions = {
  updateDialog: false,
  installMode: codePush.InstallMode.IMMEDIATE,
  checkFrequency: __DEV__
    ? codePush.CheckFrequency.MANUAL
    : codePush.CheckFrequency.ON_APP_RESUME,
}

const MyApp = codePush(codePushOptions)(App)

export default MyApp
