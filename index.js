/*
 * @Author: yejianfei
 * @Date: 2020-12-18 11:24:29
 * @LastEditors: yejianfei
 * @LastEditTime: 2020-12-29 20:08:54
 * @Description: 
 * @Developer: 
 */
import { AppRegistry, LogBox} from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'

LogBox.ignoreLogs([
  'Require cycle:',
  'VirtualizedLists should never be nested'
])
AppRegistry.registerComponent(appName, () => App)
