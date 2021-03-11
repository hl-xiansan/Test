import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import React, { Component } from 'react'
import {
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'


import Api from '../../utils/Api'
import Icons from '../../Icons'
import Page from '../../components/Page'
import { ApplicationStoreDispatchProps, ApplicationStoreState, appliction } from '../../utils/Store'
import ScreenUtils from '../../utils/ScreenUtils'
import { Portal, Provider, Toast } from '@ant-design/react-native'
import JPush from "jpush-react-native";
import AsyncStorage from "@react-native-community/async-storage";

type Props = {
  navigation: BottomTabNavigationProp<any>
} & ApplicationStoreState & ApplicationStoreDispatchProps

type State = {
  mode: number
  username?: string
  password?: string
  organization: string
}

@Page({
  navigation: {
    headerShown: false
  }
})
@appliction()
export default class ManagerLoginPage extends Component<Props, State> {
  loading = false
  isManager = false
  readonly state: State = {
    mode: 0,
    organization: 'tongtu.labor.boss'
  }
  async onLoginPress() {
    if (this.loading) return
    this.loading = true
    const key = Toast.loading('loading')
    try {
      const loginResult:any = await Api.post('/gateway/login', {
        username: this.state.username,
        password: this.state.password,
        mode: this.state.mode,
        organization: this.state.organization
      })

      await this.queryRole()
      if (this.isManager) {
        Portal.remove(key)
        Toast.success('登录成功')
        JPush.setAlias({sequence: 0,alias: loginResult.id})
        this.loading = false
        this.props.navigation.navigate('Index', { screen: 'WorkPlace' })
        return
      }

      Portal.remove(key)
      Toast.success('登录失败，没有权限')
      this.loading = false
      await Api.logout(true)
      // setTimeout(() => {
      //   this.loading = false
      //   this.props.navigation.navigate('Index', { screen: 'WorkPlace' })
      //   // this.props.navigation.reset({ index: 0, routes: [{ name: 'Index' }] })
      // }, 500)
    } catch (error) {
      Portal.remove(key)
      this.loading = false
      Toast.fail(error.message)
    }
  }

  async queryRole(){
    const roleList:any = await Api.get('/gateway/admin/roles/list/current')

    roleList.forEach((item:any) => {
      if (item.code === '002'){
        this.isManager = true
        AsyncStorage.setItem('appRoleFactory','1')
      }
      if (item.code === '003'){
        this.isManager = true
        AsyncStorage.setItem('appRoleRecruit','2')
      }
    })
  }

  onBackToWelcome() {
    this.props.changeToWelcome()
  }

  render() {
    return (
      <Provider>
        <View>
          <StatusBar barStyle={'light-content'} translucent={true} backgroundColor="rgba(255,255,255,0)" />
          <ImageBackground
            source={Icons.Login.Background}
            style={styles.headerView}
          >
            <TouchableOpacity activeOpacity={0.1} style={styles.returnIcon} onPress={this.onBackToWelcome.bind(this)}>
              <Image source={Icons.Public.ReturnIcon} />
            </TouchableOpacity>
            <Text style={styles.title}>锦绣通途</Text>
          </ImageBackground>
          <View style={styles.loginView}>
            <View style={styles.loginContentView}>
              <View style={styles.loginInputView}>
                <Image source={Icons.Login.Account} style={styles.loginTypeIcon} />
                <TextInput
                  value={this.state.username}
                  onChangeText={(value: string) => this.setState({ username: value })}
                  style={styles.loginInput}
                  placeholder="请输入手机号码"
                  key="verCode"
                  keyboardType="numeric"
                  maxLength={11}
                ></TextInput>
              </View>
              <View style={styles.loginInputView}>
                <Image source={Icons.Login.Password} style={styles.loginTypeIcon} />
                <TextInput
                  value={this.state.password}
                  onChangeText={(value: string) => this.setState({ password: value })}
                  style={styles.loginInput}
                  placeholder="请输入密码"
                  secureTextEntry={true}
                ></TextInput>
              </View>
            </View>
            <TouchableOpacity activeOpacity={0.5} style={styles.loginRegistBtn} onPress={() => { this.onLoginPress() }}>
              <Text style={styles.loginRegistBtnText}>登录</Text>
            </TouchableOpacity>
            <View style={styles.noAccountView}>
              <Text style={styles.noAccountText}>点击登录就代表同意</Text>
              <TouchableOpacity style={styles.noAccountBtn} activeOpacity={0.5} onPress={() => this.props.navigation.navigate('UserAgreement')}>
                <Text style={styles.noAccountBtnText}>《用户协议及隐私政策》</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  headerView: {
    width: '100%',
    height: ScreenUtils.scaleSize(168),
    paddingBottom: ScreenUtils.scaleSize(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: ScreenUtils.scaleSize(20),
    color: '#fff',
    fontWeight: 'bold',
  },
  loginView: {
    marginTop: ScreenUtils.scaleSize(46)
  },
  loginContentView: {
    marginTop: ScreenUtils.scaleSize(10),
    marginHorizontal: ScreenUtils.scaleSize(30)
  },
  loginInputView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    borderBottomWidth: ScreenUtils.scaleSize(1),
    borderBottomColor: 'rgba(168, 168, 172, 0.42)',
    height: ScreenUtils.scaleSize(57)
  },
  loginTypeIcon: {
    width: ScreenUtils.scaleSize(22),
    height: ScreenUtils.scaleSize(22),
    marginBottom: ScreenUtils.scaleSize(7)
  },
  loginInput: {
    flex: 1,
    marginBottom: ScreenUtils.scaleSize(7),
    fontSize: ScreenUtils.scaleSize(15),
    color: 'rgba(168, 168, 172, 1)',
    paddingVertical: 0,
    marginLeft: ScreenUtils.scaleSize(8)
  },
  loginRegistBtn: {
    marginHorizontal: ScreenUtils.scaleSize(30),
    height: ScreenUtils.scaleSize(42),
    backgroundColor: 'rgba(82, 108, 221, 1)',
    borderRadius: ScreenUtils.scaleSize(21),
    marginTop: ScreenUtils.scaleSize(76)
  },
  loginRegistBtnText: {
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(15),
    textAlign: 'center',
    lineHeight: ScreenUtils.scaleSize(42),
    letterSpacing: ScreenUtils.scaleSize(2)
  },
  noAccountView: {
    marginTop: ScreenUtils.scaleSize(33),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noAccountText: {
    color: 'rgba(168, 168, 172, 1)',
    fontSize: ScreenUtils.scaleSize(14),
    fontWeight: '500'
  },
  noAccountBtn: {
    marginLeft: ScreenUtils.scaleSize(4)
  },
  noAccountBtnText: {
    color: 'rgba(82, 108, 221, 1)',
    fontSize: ScreenUtils.scaleSize(14),
    fontWeight: '500'
  },
  returnIcon: {
    height: ScreenUtils.scaleSize(22),
    width: ScreenUtils.scaleSize(22),
    position: 'absolute',
    top: ScreenUtils.scaleSize(25),
    left: ScreenUtils.scaleSize(10),
    zIndex: 11111111,
  }
})
