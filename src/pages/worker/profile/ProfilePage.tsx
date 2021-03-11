import React, { Component } from 'react'
import { Text, View, StatusBar, Image, StyleSheet, TouchableOpacity, DeviceEventEmitter } from 'react-native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { ApplicationStoreDispatchProps, ApplicationStoreState } from '../../../utils/Store'
import Icons from '../../../Icons'
import Page from '../../../components/Page'
import ScreenUtils from '../../../utils/ScreenUtils'
import { BoxShadow } from 'react-native-shadow'
import Api from '../../../utils/Api'
import { workerInfo, UPDATE_WORKER_INFO } from '../../../utils/worker'
import {Profile} from "../../../@types";

export type Props = {
  navigation: BottomTabNavigationProp<any>
} & ApplicationStoreState & ApplicationStoreDispatchProps
const defaultAvatar = require('../../../assets/images/login-bg.png')
interface UserInfo {
  nickname: string,
  logo: string,
  workPlace: string,
}
interface State {
  user: UserInfo | null
}
@Page()
export default class WorkerProfilePage extends Component<Props, State> {

  shadowOpt = {
    height: ScreenUtils.scaleSize(234),
    width: ScreenUtils.scaleSize(345),
    color: '#253039',
    border: 4,
    radius: 1,
    opacity: 0.02,
    x: 0,
    y: -1
  }

  emitter: any = null
  readonly state: State = { user: null }

  onChangeRolePress = () => {
    this.props.changeToManager()
  }

  // TODO 清空缓存
  onLogoutPress = () => {
    this.props.navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
  }

  onBankCardPress = () => { this.props.navigation.navigate('BankCard') }
  onProfileDetailPress = () => { this.props.navigation.navigate('MyProfile') }
  toScan = () => { this.props.navigation.navigate('Scan') }
  toNews = () => { this.props.navigation.navigate('NewsDetail') }

  componentDidMount() {
    this.setUserInfo().then()
    // 监听 user info
    this.emitter = DeviceEventEmitter.addListener(UPDATE_WORKER_INFO, () => {
      this.setUserInfo().then()
    })
  }

  componentWillUnmount() {
    if (this.emitter) this.emitter.remove()
  }

  async setUserInfo() {
    const res = await workerInfo.getUser()
    const person = await workerInfo.getPerson()

    const user: UserInfo = {
      nickname: res?.nickname! || '',
      logo: res?.logo! || '',
      workPlace: person?.position! || '',
    }
    this.setState({ user })
  }

  render() {
    return (
      <View style={styles.content}>
        <StatusBar barStyle={'light-content'} translucent={true} backgroundColor="rgba(255,255,255,0)" />
        <View style={styles.bgView}></View>
        <View style={styles.listView}>
          <BoxShadow setting={{
            color: '#253039', border: 4, radius: 1, opacity: 0.02, x: 0, y: 2, width: ScreenUtils.scaleSize(345), height: ScreenUtils.scaleSize(90)
          }}>
            <TouchableOpacity onPress={this.onProfileDetailPress} style={styles.userInfoView} activeOpacity={0.8}>
              <Image source={this.state.user?.logo ? { uri: this.state.user?.logo } : defaultAvatar} style={styles.userPhoto} />
              <View style={styles.userInfoContent}>
                <Text style={styles.userName}>{this.state.user?.nickname}</Text>
                {
                  this.state.user?.workPlace ? <View style={styles.otherUserInfoView}>
                    <Image source={Icons.Profile.Address} style={styles.addressIcon} />
                    <Text style={styles.companyName}>{this.state.user?.workPlace}</Text>
                  </View> : null
                }
              </View>
              <Image source={Icons.Public.More} style={styles.userInfoMore} />
            </TouchableOpacity>
          </BoxShadow>
          <View style={{ marginTop: ScreenUtils.scaleSize(10) }}>
            <BoxShadow setting={Object.assign(this.shadowOpt, { borderRadius: ScreenUtils.scaleSize(5) })}>
              <TouchableOpacity onPress={this.onBankCardPress} style={styles.listItemView} activeOpacity={0.5}>
                <Image source={Icons.Profile.BankCard} style={styles.listItemIcon} />
                <Text style={styles.listItemTitle}>我的银行卡</Text>
                <Image source={Icons.Public.More} style={styles.listItemMore} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.listItemView} activeOpacity={0.5} onPress={this.toScan}>
                <Image source={Icons.Profile.Scan} style={styles.listItemIcon} />
                <Text style={styles.listItemTitle}>扫一扫</Text>
                <Text style={styles.listItemTip}>签约或者转场</Text>
                <Image source={Icons.Public.More} style={styles.listItemMore} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.listItemView} activeOpacity={0.5} onPress={this.toNews}>
                <Image source={Icons.Profile.Recommend} style={styles.listItemIcon} />
                <Text style={styles.listItemTitle}>推荐</Text>
                <Image source={Icons.Public.More} style={styles.listItemMore} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.listItemView} activeOpacity={0.5} onPress={() => { this.props.navigation.navigate('VersionPage') }}>
                <Image source={Icons.Public.Version} style={styles.listItemIcon} />
                <Text style={styles.listItemTitle}>版本</Text>
                <Text style={styles.listItemTip}>V1.0.0</Text>
                <Image source={Icons.Public.More} style={styles.listItemMore} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.listItemView} activeOpacity={0.5} onPress={() => { this.props.navigation.navigate('Setting') }}>
                <Image source={Icons.Profile.Setting} style={styles.listItemIcon} />
                <Text style={styles.listItemTitle}>设置</Text>
                <Image source={Icons.Public.More} style={styles.listItemMore} />
              </TouchableOpacity>
            </BoxShadow>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'rgba(252, 253, 253, 1)',
    flex: 1,
    position: 'relative'
  },
  bgView: {
    height: ScreenUtils.scaleSize(84),
    backgroundColor: 'rgba(82, 108, 221, 1)',
  },
  listView: {
    marginHorizontal: ScreenUtils.scaleSize(15),
    marginTop: ScreenUtils.scaleSize(-48),
    borderRadius: ScreenUtils.scaleSize(5),
  },
  userInfoView: {
    flexDirection: 'row',
    height: ScreenUtils.scaleSize(90),
    alignItems: 'center',
    paddingHorizontal: ScreenUtils.scaleSize(15),
    backgroundColor: '#fff',
    borderRadius: ScreenUtils.scaleSize(5)
  },
  userPhoto: {
    width: ScreenUtils.scaleSize(55),
    height: ScreenUtils.scaleSize(55),
    borderRadius: ScreenUtils.scaleSize(55),
  },
  userInfoContent: {
    flex: 1,
    marginLeft: ScreenUtils.scaleSize(14)
  },
  userName: {
    color: 'rgba(3, 0, 20, 1)',
    fontWeight: 'bold',
    fontSize: ScreenUtils.scaleSize(21),
  },
  otherUserInfoView: {
    flexDirection: 'row',
    marginTop: ScreenUtils.scaleSize(10),
    alignItems: 'center'
  },
  userInfoMore: {
    width: ScreenUtils.scaleSize(18),
    height: ScreenUtils.scaleSize(34)
  },
  addressIcon: {
    width: ScreenUtils.scaleSize(15),
    height: ScreenUtils.scaleSize(15)
  },
  companyName: {
    color: 'rgba(168, 168, 172, 1)',
    fontSize: ScreenUtils.scaleSize(14),
    marginLeft: ScreenUtils.scaleSize(6)
  },
  listItemView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ScreenUtils.scaleSize(57),
    backgroundColor: '#fff',
    paddingHorizontal: ScreenUtils.scaleSize(15)
  },
  listItemIcon: {
    width: ScreenUtils.scaleSize(22),
    height: ScreenUtils.scaleSize(22),
  },
  listItemTitle: {
    flex: 1,
    marginLeft: ScreenUtils.scaleSize(16),
    fontSize: ScreenUtils.scaleSize(15),
    color: 'rgba(3, 0, 20, 1)',
    fontWeight: 'bold'
  },
  listItemMore: {
    width: ScreenUtils.scaleSize(12),
    height: ScreenUtils.scaleSize(20)
  },
  listItemTip: {
    color: 'rgba(168, 168, 172, 1)',
    fontSize: ScreenUtils.scaleSize(13),
    marginRight: ScreenUtils.scaleSize(10)
  }
})
