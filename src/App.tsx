import React, { Component } from 'react'
import {createNativeStackNavigator} from 'react-native-screens/native-stack'
import {Provider} from 'react-redux'
import {NavigationContainer} from '@react-navigation/native'
import store from './utils/Store'
import WorkerRouter from './routers/WorkerRouter'
import ManagerRouter from './routers/ManagerRouter'
import Welcome from './pages/welcome/Welcome'
import {ActionSheetProvider} from '@expo/react-native-action-sheet'
import JPush from 'jpush-react-native'
import {MsgUtil, UPDATE_MSG_JPUSH} from './utils/MessageUtil'
import {DeviceEventEmitter,Linking, Platform, Alert} from 'react-native'
import {Modal, Toast} from '@ant-design/react-native'
import Config from './Config'
import CommonUtils from './utils/CommonUtils'
import styles from "react-native-webview/lib/WebView.styles";

const Stack = createNativeStackNavigator()

// const App = () => {
//   return (
//       <Provider store={store}>
//         <NavigationContainer>
//           <ActionSheetProvider>
//             <Stack.Navigator screenOptions={() => ({
//               headerShown: false
//             })}>
//               <Stack.Screen name="Welcome" component={Welcome}></Stack.Screen>
//               <Stack.Screen name="Worker" component={WorkerRouter}></Stack.Screen>
//               <Stack.Screen name="Manager" component={ManagerRouter}></Stack.Screen>
//             </Stack.Navigator>
//           </ActionSheetProvider>
//         </NavigationContainer>
//       </Provider>
//   )
// }
//
// export default App

export default class App extends Component {

  connectListener:any;
  notificationListener:any;
  localNotificationListener:any;
  customMessageListener:any;
  tagAliasListener:any;
  mobileNumberListener:any;

  componentWillUnmount() {
    if (this.customMessageListener) this.customMessageListener.remove()
    if (this.notificationListener) this.notificationListener.remove()
  }

  componentDidMount() {
    //检查更新
    this.checkUpdate()
    // 极光配置
    JPush.init()

    //连接状态
    // this.connectListener = (result: any) => {
    //   console.log('connectListener:' + JSON.stringify(result))
    // }
    // JPush.addConnectEventListener(this.connectListener)

    //通知回调
    // this.notificationListener = (result: any) => {
    //   console.log('notificationListener:' + JSON.stringify(result))
    // }
    // JPush.addNotificationListener(this.notificationListener)

    //本地通知回调
    // this.localNotificationListener = (result: any) => {
    //   console.log('localNotificationListener:' + JSON.stringify(result))
    // }
    // JPush.addLocalNotificationListener(this.localNotificationListener)

    //自定义消息回调
    this.customMessageListener = DeviceEventEmitter.addListener('CustomMessageEvent',async (result:any) => {
      console.log('---------------')
      console.log('customMessageListener:' + JSON.stringify(result))
      console.log('---------------')
      DeviceEventEmitter.emit(UPDATE_MSG_JPUSH)
    })

    this.notificationListener = DeviceEventEmitter.addListener('NotificationEvent',async (result:any) => {
      console.log('notificationListener:' + JSON.stringify(result))
    })

    //tag alias事件回调
    // this.tagAliasListener = (result: any) => {
    //   console.log('tagAliasListener:' + JSON.stringify(result))
    // }
    // JPush.addTagAliasListener(this.tagAliasListener)

    //手机号码事件回调
    // this.mobileNumberListener = (result: any) => {
    //   console.log('mobileNumberListener:' + JSON.stringify(result))
    // }
    // JPush.addMobileNumberListener(this.mobileNumberListener)

  }

  // 检查更新
  checkUpdate = () => {
    CommonUtils.checkLatest().then(data => {
      let os = Platform.OS
      let versionInfo = data[os]
      if (versionInfo) {
        let version = versionInfo['version']
        let url = versionInfo['url']
        if (CommonUtils.haveNewVersion(version, Config.appVersion) && url) {
          Alert.alert(
            '发现新版本v' + version,
            versionInfo['desc'],
            [
              {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: '马上更新', onPress: () => this.onUpdateApp(url)},
            ],
          )
        }
      }
    }).catch(error => {
      console.log('check latest fail:', error);
    })
  }

  // 跳转到更新app
  onUpdateApp = (url: string) => {
    Linking.canOpenURL(url)
      .then((supported: any) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Toast.fail('无法跳转到更新页面，请先安装浏览器');
        }
      })
      .catch((reason: any) => {
        console.log('cannot open url', reason);
      })
  }

  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <ActionSheetProvider>
            <Stack.Navigator screenOptions={() => ({
              headerShown: false
            })}>
              <Stack.Screen name="Welcome" component={Welcome}></Stack.Screen>
              <Stack.Screen name="Worker" component={WorkerRouter}></Stack.Screen>
              <Stack.Screen name="Manager" component={ManagerRouter}></Stack.Screen>
            </Stack.Navigator>
          </ActionSheetProvider>
        </NavigationContainer>
      </Provider>
    );
  }
}

