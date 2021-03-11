import React, {Component} from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Image, Platform, Linking} from 'react-native'
import ScreenUtil from '../../../utils/ScreenUtils'
import {Toast} from '@ant-design/react-native'
import CommonUtils from '../../../utils/CommonUtils'
import Config from '../../../Config'

type Props = {
  navigation: any,
  route: any
}
type State = {
  showNewVersion: boolean
  updateUrl:string
}
export default class AboutUsPage extends Component<Props,State> {
  // componentDidMount () {
  //   Toast.loading('正在加载...')
  // }

  state = {
    showNewVersion: false,
    updateUrl: ''
  }

  componentDidMount() {
    this.checkUpdate()
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
          this.setState({updateUrl: url, showNewVersion: true})
        }
      }
    }).catch(error => {
      console.log('check latest fail:', error)
    })
  }

  // 跳转到更新app
  onUpdateApp = (url: string) => {
    Linking.canOpenURL(url)
      .then((supported: any) => {
        if (supported) {
          Linking.openURL(url)
        } else {
          Toast.fail('无法跳转到更新页面，请先安装浏览器')
        }
      })
      .catch((reason: any) => {
        console.log('cannot open url', reason)
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.usImagesContent}>
          <Image source={require('../../../assets/images/logo.png')} style={styles.usImage}/>
        </View>
        <Text style={styles.title}>锦绣通途</Text>
        <Text style={styles.version}>V1.0.0</Text>
        {
          this.state.showNewVersion?
            <TouchableOpacity onPress={() => this.onUpdateApp(this.state.updateUrl)}>
              <Text style={styles.newVersion}>有新版本,点击更新</Text>
            </TouchableOpacity>
            :
            <Text style={styles.latestVersion}> 当前是最新版本 </Text>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: ScreenUtil.scaleSize(28),
    textAlign: 'center',
  },
  title: {
    color: 'rgba(23, 29, 53, 1)',
    fontSize: 15,
    paddingHorizontal: ScreenUtil.scaleSize(24),
    marginTop: ScreenUtil.scaleSize(20),
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  scrollViewContent: {
    flex: 1,
    marginTop: ScreenUtil.scaleSize(20),
    paddingHorizontal: ScreenUtil.scaleSize(18),
  },
  usImagesContent: {
    width: '100%',
    height: ScreenUtil.scaleSize(100),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  usImage: {
    width: ScreenUtil.scaleSize(87),
    height: ScreenUtil.scaleSize(87),
  },
  content: {
    color: 'rgba(23, 29, 53, 0.5)',
    fontSize: 12,
    lineHeight: ScreenUtil.scaleSize(24),
    marginTop: ScreenUtil.scaleSize(20)
  },
  version: {
    color: 'rgba(23, 29, 53, 0.5)',
    fontSize: 14,
    lineHeight: ScreenUtil.scaleSize(20),
    marginTop: ScreenUtil.scaleSize(5),
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  newVersion: {
    color: 'rgba(117, 136, 255, 1)',
    fontSize: 14,
    lineHeight: ScreenUtil.scaleSize(20),
    marginTop: ScreenUtil.scaleSize(20),
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  latestVersion: {
    color: 'rgba(28, 29, 53, 1)',
    fontSize: 14,
    lineHeight: ScreenUtil.scaleSize(20),
    marginTop: ScreenUtil.scaleSize(20),
    textAlign: 'center',
    textAlignVertical: 'center',
  }
})
