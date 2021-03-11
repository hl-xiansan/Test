import React, { Component } from 'react'
import {Text, View, StatusBar, Image, StyleSheet, TouchableOpacity, DeviceEventEmitter} from 'react-native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { ApplicationStoreDispatchProps, ApplicationStoreState } from '../../../utils/Store'
import Icons from '../../../Icons'
import Page from '../../../components/Page'
import ScreenUtils from '../../../utils/ScreenUtils'
import { BoxShadow } from 'react-native-shadow'
import Api from '../../../utils/Api'
import { Profile } from '../../../@types'
import { Provider, Toast,Portal } from '@ant-design/react-native'
import JPush from "jpush-react-native";
import {UPDATE_WORKER_INFO, workerInfo} from "../../../utils/worker";
const defaultAvatar = require('../../../assets/images/login-bg.png')
export type Props = {
  navigation: BottomTabNavigationProp<any>
} & ApplicationStoreState & ApplicationStoreDispatchProps

@Page()
export default class WorkerProfilePage extends Component<Props> {

  isU = false

  emitter: any = null

  state: any = {
  }

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

  onChangeRolePress = () => {
    this.props.changeToManager()
  }

  onLogoutPress = () => {
    this.props.navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }]
    })
  }

  onBankCardPress = () => {
    this.props.navigation.navigate('BankCard')
  }

  onProfileDetailPress = () => {
    this.props.navigation.navigate('MyProfile')
  }

  componentWillUnmount() {
    this.isU = false
    if (this.emitter) this.emitter.remove()
  }

  async componentDidMount() {
    const key = Toast.loading('loading')
    try {
      await this.getUser()

      this.emitter = DeviceEventEmitter.addListener(UPDATE_WORKER_INFO, () => {
        this.getUser()
      })

      Portal.remove(key)
    } catch (error) {
      Toast.fail(error.message)
      Portal.remove(key)
    }
  }

  async getUser() {
    const res = await workerInfo.getUser()
    const user: any = {
      id: res?.id,
      nickname: res?.nickname || '',
      logo: res?.logo,
      workPlace: res?.extras?.team!,
      inviteCode: res?.extras?.invite_code! || ''
    }
    this.setState({ user })
  }

  render() {
    return (
      <Provider>
        <View style={styles.content}>
          <StatusBar barStyle={'light-content'} translucent={true} backgroundColor="rgba(255,255,255,0)" />
          <View style={styles.bgView}></View>
          <View style={styles.listView}>
            <BoxShadow setting={{
              color: '#253039', border: 4, radius: 1, opacity: 0.02, x: 0, y: 2, width: ScreenUtils.scaleSize(345), height: ScreenUtils.scaleSize(90)
            }}>
              <TouchableOpacity onPress={this.onProfileDetailPress} style={styles.userInfoView} activeOpacity={0.5}>
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
                <TouchableOpacity style={styles.listItemView} activeOpacity={0.5} onPress={() => { this.props.navigation.navigate('QRList', {
                  id: this.state.user.id,inviteCode: this.state.user.inviteCode
                }) }}>
                  <Image source={Icons.Profile.Scan} style={styles.listItemIcon} />
                  <Text style={styles.listItemTitle}>我的二维码</Text>
                  <Image source={Icons.Public.More} style={styles.listItemMore} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.listItemView} activeOpacity={0.5}>
                  <Image source={Icons.Profile.InviteCode} style={styles.listItemIcon} />
                  <Text style={styles.listItemTitle}>我的邀请码</Text>
                  <Text style={styles.listItemTip}>{this.state.user?.inviteCode}</Text>
                  <Image source={Icons.Public.More} style={styles.listItemMore} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.listItemView} activeOpacity={0.5}>
                  <Image source={Icons.Profile.AboutUs} style={styles.listItemIcon} />
                  <Text style={styles.listItemTitle}>关于我们</Text>
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
      </Provider>

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
    // color: 'rgba(168, 168, 172, 1)',
    color: 'rgb(9,9,16)',
    fontSize: ScreenUtils.scaleSize(20),
    marginRight: ScreenUtils.scaleSize(10)
  }
})
