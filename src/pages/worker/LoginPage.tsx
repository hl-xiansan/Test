import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import React, { Component } from 'react'
import { TouchableOpacity, Text, View, ImageBackground, Image, TextInput, StyleSheet, StatusBar } from 'react-native'

import Api from '../../utils/Api'
import Icons from '../../Icons'
import Page from '../../components/Page'
import { ApplicationStoreDispatchProps, ApplicationStoreState, appliction } from '../../utils/Store'
import ScreenUtils from '../../utils/ScreenUtils'
import { Portal, Provider, Toast } from '@ant-design/react-native'
import JPush from "jpush-react-native";



type Props = {
  navigation: BottomTabNavigationProp<any>
} & ApplicationStoreState & ApplicationStoreDispatchProps

type State = {
  isRegister?: boolean
  isFastLogn?: boolean
  mode: number
  username?: string
  password?: string
  captcha?: string
  organization: string,
  count: number
}

@Page({
  navigation: {
    headerShown: false
  }
})
@appliction()
export default class WorkerLoginPage extends Component<Props, State> {
  timer: any
  readonly state: State = {
    mode: 0,
    count: 0,
    organization: 'tongtu.labor.app.worker'
  }

  componentWillUnmount() {
    if (this.timer) clearInterval(this.timer)
  }
  // 倒计时
  countDown = () => {
    this.setState({ count: 60 })
    this.timer = setInterval(() => {
      if (this.state.count > 0) {
        this.setState({ count: this.state.count - 1 })
      } else {
        this.setState({ count: 0 })
        clearInterval(this.timer)
      }
    }, 1000)
  }

  onChangeLoginMode() {
    this.setState({ isFastLogn: !this.state.isFastLogn })
  }

  onLoginPress() {
    const key = Toast.loading('loading...')
    Api
      .post(this.state.isFastLogn ? '/gateway/fast_login' : '/gateway/login', {
        username: this.state.username,
        password: this.state.password,
        captcha: this.state.captcha,
        mode: this.state.mode,
        organization: this.state.organization
      })
      .then((res:any) => {
        this.props.navigation.reset({ index: 0, routes: [{ name: 'Index' }] });
        this.props.navigation.navigate('Home');
        JPush.setAlias({sequence: 0,alias: res.id})
        Portal.remove(key)
      })
      .catch((e) => {
        console.log(e)

        Portal.remove(key)
        Toast.fail(e.message)
      })
  }

  async onRegisterPress() {
    const key = Toast.loading('loading...')
    try {
      await Api
        .post('/gateway/register', {
          username: this.state.username,
          password: this.state.password,
          mode: this.state.mode,
          organization: this.state.organization,
          captcha: this.state.captcha
        })
      this.props.navigation.reset({ index: 0, routes: [{ name: 'Index' }] })
      Portal.remove(key)
    } catch (error) {
      Toast.fail(error.message)
      Portal.remove(key)
    }
  }

  onCaptchaPress() {
    const validRule = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/
    if (!validRule.test(this.state.username + '')) {
      Toast.fail('请输入正确的手机号码')
      return
    }
    if (!this.state.username || this.state.username.length < 11) {
      return
    }
    Api.get(`/gateway/captcha/default?target=${this.state.username}`)
      .then(() => this.countDown())
      .catch((e) => console.error(e))
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
            <View style={styles.hederBtnView}>
              <TouchableOpacity style={styles.headerBtn} onPress={() => this.setState({ isRegister: false, count: 0 })} activeOpacity={0.5}>
                <Text style={[styles.headerBtnText, { color: !this.state.isRegister ? '#fff' : 'rgba(201, 211, 255, 1)' }]}>登录</Text>
                {
                  !this.state.isRegister && (
                    <View style={styles.headerTriangleView}>
                      <View style={styles.headerTriangle}></View>
                    </View>
                  )
                }
              </TouchableOpacity>
              <View style={styles.hederLine}></View>
              <TouchableOpacity style={styles.headerBtn} onPress={() => this.setState({ isRegister: true })} activeOpacity={0.5}>
                <Text style={[styles.headerBtnText, { color: this.state.isRegister ? '#fff' : 'rgba(201, 211, 255, 1)' }]}>注册</Text>
                {
                  this.state.isRegister && (
                    <View style={styles.headerTriangleView}>
                      <View style={styles.headerTriangle}></View>
                    </View>
                  )
                }
              </TouchableOpacity>
            </View>
          </ImageBackground>
          {
            !this.state.isRegister ? (
              <View style={styles.loginView}>
                <View style={styles.loginTypeChangeView}>
                  <TouchableOpacity style={styles.loginTypeChangeBtn} onPress={this.onChangeLoginMode.bind(this)} activeOpacity={0.5}>
                    <Text style={[styles.loginTypeChangeText, { color: this.state.isFastLogn ? 'rgba(3, 0, 20, 1)' : 'rgba(84, 84, 104, 1)' }]}>手机验证码登录</Text>
                    {
                      this.state.isFastLogn && (
                        <View style={styles.loginTypeChangeBottomLine}></View>
                      )
                    }
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.loginTypeChangeBtn} onPress={this.onChangeLoginMode.bind(this)} activeOpacity={0.5}>
                    <Text style={[styles.loginTypeChangeText, { color: !this.state.isFastLogn ? 'rgba(3, 0, 20, 1)' : 'rgba(84, 84, 104, 1)' }]}>账号登录</Text>
                    {
                      !this.state.isFastLogn && (
                        <View style={styles.loginTypeChangeBottomLine}></View>
                      )
                    }
                  </TouchableOpacity>
                </View>
                {
                  this.state.isFastLogn ? (
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
                        <Image source={Icons.Login.Captcha} style={styles.loginTypeIcon} />
                        <TextInput
                          value={this.state.captcha}
                          onChangeText={(value: string) => this.setState({ captcha: value })}
                          style={styles.loginInput}
                          placeholder="请输入验证码"
                          keyboardType="numeric"
                          maxLength={6}
                        ></TextInput>
                        {!this.state.count || this.state.count < 1 ? (
                          <TouchableOpacity style={styles.getVerCodeBtn} activeOpacity={0.5} onPress={this.onCaptchaPress.bind(this)}>
                            <Text style={styles.getVerCodeText}>获取验证码</Text>
                          </TouchableOpacity>
                        ) : (<Text style={styles.count}>{this.state.count + 's'}</Text>
                        )}
                      </View>
                    </View>
                  ) : (
                    <View style={styles.loginContentView}>
                      <View style={styles.loginInputView}>
                        <Image source={Icons.Login.Account} style={styles.loginTypeIcon} />
                        <TextInput
                          value={this.state.username}
                          onChangeText={(value: string) => this.setState({ username: value })}
                          style={styles.loginInput}
                          placeholder="请输入手机号码"
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
                  )
                }
                <TouchableOpacity activeOpacity={0.5} style={styles.loginRegistBtn} onPress={this.onLoginPress.bind(this)}>
                  <Text style={styles.loginRegistBtnText}>登录</Text>
                </TouchableOpacity>
                <View style={styles.noAccountView}>
                  <Text style={styles.noAccountText}>没有账号？</Text>
                  <TouchableOpacity style={styles.noAccountBtn} activeOpacity={0.5} onPress={() => this.setState({ isRegister: true, count: 0 })}>
                    <Text style={styles.noAccountBtnText}>立即注册</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.noAccountView}>
                  <Text style={styles.noAccountText}>点击登录就代表同意</Text>
                  <TouchableOpacity style={styles.noAccountBtn} activeOpacity={0.5} onPress={() => this.props.navigation.navigate('UserAgreement')}>
                    <Text style={styles.noAccountBtnText}>《用户协议及隐私政策》</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.registView}>
                <View style={styles.loginContentView}>
                  <View style={styles.loginInputView}>
                    <Image source={Icons.Login.Account} style={styles.loginTypeIcon} />
                    <TextInput
                      value={this.state.username}
                      onChangeText={(value: string) => this.setState({ username: value })}
                      style={styles.loginInput}
                      placeholder="请输入手机号码"
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
                  <View style={styles.loginInputView}>

                    <Image source={Icons.Login.Captcha} style={styles.loginTypeIcon} />
                    <TextInput
                      value={this.state.captcha}
                      onChangeText={(value: string) => this.setState({ captcha: value })}
                      style={styles.loginInput}
                      placeholder="请输入验证码"
                      keyboardType="numeric"
                      maxLength={6}
                    ></TextInput>
                    {!this.state.count || this.state.count < 1 ? (
                      <TouchableOpacity style={styles.getVerCodeBtn} activeOpacity={0.5} onPress={this.onCaptchaPress.bind(this)}>
                        <Text style={styles.getVerCodeText}>获取验证码</Text>
                      </TouchableOpacity>
                    ) : (<Text style={styles.count}>{this.state.count + 's'}</Text>
                    )}

                  </View>
                </View>
                <TouchableOpacity activeOpacity={0.5} style={styles.loginRegistBtn} onPress={this.onRegisterPress.bind(this)}>
                  <Text style={styles.loginRegistBtnText}>注册</Text>
                </TouchableOpacity>

                <View style={styles.noAccountView}>
                  <Text style={styles.noAccountText}>点击登录就代表同意</Text>
                  <TouchableOpacity style={styles.noAccountBtn} activeOpacity={0.5} onPress={() => this.props.navigation.navigate('UserAgreement')}>
                    <Text style={styles.noAccountBtnText}>《用户协议及隐私政策》</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          }
        </View>
      </Provider>
    )
  }
}


const styles = StyleSheet.create({
  headerView: {
    width: '100%',
    height: ScreenUtils.scaleSize(168),
    paddingBottom: ScreenUtils.scaleSize(16)
  },
  hederBtnView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignContent: 'center',
    width: '100%',
    flex: 1
  },
  headerBtn: {
    flex: 1,
  },
  headerBtnText: {
    textAlign: 'center',
    color: 'rgba(201, 211, 255, 1)',
    fontSize: ScreenUtils.scaleSize(15),
    fontWeight: 'bold'
  },
  hederLine: {
    width: ScreenUtils.scaleSize(1),
    height: ScreenUtils.scaleSize(13),
    backgroundColor: 'rgba(255, 255, 255, 1)'
  },
  headerTriangleView: {
    position: 'absolute',
    zIndex: 11,
    bottom: ScreenUtils.scaleSize(-16),
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center'
  },
  headerTriangle: {
    borderColor: 'transparent',
    borderBottomColor: '#fff',
    borderBottomWidth: ScreenUtils.scaleSize(8),
    borderTopWidth: ScreenUtils.scaleSize(8),
    borderLeftWidth: ScreenUtils.scaleSize(8),
    borderRightWidth: ScreenUtils.scaleSize(8),
    width: 0,
    height: 0,
  },
  loginView: {
    marginTop: ScreenUtils.scaleSize(46)
  },
  loginTypeChangeView: {
    flexDirection: 'row',
  },
  loginTypeChangeBtn: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    paddingBottom: ScreenUtils.scaleSize(8)
  },
  loginTypeChangeText: {
    textAlign: 'center',
    fontSize: ScreenUtils.scaleSize(15),
    fontWeight: '500'
  },
  loginTypeChangeBottomLine: {
    position: 'absolute',
    width: ScreenUtils.scaleSize(120),
    height: ScreenUtils.scaleSize(1),
    backgroundColor: 'rgba(82, 108, 221, 1)',
    bottom: ScreenUtils.scaleSize(0)
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
  getVerCodeBtn: {
    width: ScreenUtils.scaleSize(80),
    height: ScreenUtils.scaleSize(30),
    backgroundColor: 'rgba(82, 108, 221, 1)',
    borderRadius: ScreenUtils.scaleSize(2)
  },
  getVerCodeText: {
    color: '#fff',
    textAlign: 'center',
    lineHeight: ScreenUtils.scaleSize(30),
    fontSize: ScreenUtils.scaleSize(12),
    fontWeight: '500'
  },
  count: {
    color: 'rgba(39, 201, 171, 1)',
    fontSize: 14,
    marginRight: 15.5
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
  registView: {
    marginTop: ScreenUtils.scaleSize(18)
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
