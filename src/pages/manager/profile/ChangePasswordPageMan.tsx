import React, {Component} from 'react';
import {View, Text, TextInput, Image, StyleSheet, Dimensions, SafeAreaView} from 'react-native';
import {Toast, Portal, Provider} from '@ant-design/react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CommonUtils from '../../../utils/CommonUtils';
import ScreenUtil from '../../../utils/ScreenUtils'
import Icons from "../../../Icons";


type Props = {
  navigation: any;
  route: any;
  store: any;
};

type State = any;

export default class ChangePasswordPageMan extends Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props)
    this.state = {
      oldPassword: '',
      password: '',
      passwordAgain: '',
      passwordErr: false,
    };
  }

  changePassword = () => {
    const {oldPassword, password, passwordAgain} = this.state
    if (!password || !oldPassword || !passwordAgain) {
      return Toast.fail('内容不能为空')
    }
    if (password !== passwordAgain) {
      return Toast.fail('俩次密码输入不一致')
    }
    const key = Toast.loading('正在修改...', 0)
    const params = {
      old_password: oldPassword,
      new_password: password,
    };

    CommonUtils.changePassword(params).then((res) => {
      Portal.remove(key)
      Toast.success('修改成功', 1, () => {
        this.props.navigation.goBack()
      })
    }).catch((err) => {
      Portal.remove(key)
      if (err.message === '5000551') {
        this.setState({passwordErr: true})
      }
      Toast.fail(err.message, 1)
    })
  }

  changeValue = (type: string, value: string) => {
    const newState: any = {};
    newState[type] = value;
    this.setState({...newState});
  }

  render() {
    return (
      <Provider>
        <SafeAreaView style={styles.container}>
          {this.state.passwordErr && (
            <View style={styles.tips}>
              <Image source={Icons.Profile.Tips} style={{height: ScreenUtil.scaleSize(22), width: ScreenUtil.scaleSize(22)}}/>
              <Text style={{color: '#fc7300'}}>提示：密码错误</Text>
            </View>
          )}
          <View style={styles.changeInfoContent}>
            <View style={styles.itemIconContent}><Image style={styles.icon} source={Icons.Profile.Password}/></View>
            <TextInput
              style={styles.infoText}
              onChangeText={(value) => {
                this.changeValue('oldPassword', value)
              }}
              returnKeyType="done"
              secureTextEntry={true}
              placeholder={'请输入原密码'}
            />
          </View>
          <View style={styles.changeInfoContent}>
            <View style={styles.itemIconContent}><Image style={styles.icon} source={Icons.Profile.Password}/></View>
            <TextInput
              style={styles.infoText}
              onChangeText={(value) => {
                this.changeValue('password', value)
              }}
              returnKeyType="done"
              secureTextEntry={true}
              placeholder={'请输入新密码'}
            />
          </View>
          <View style={styles.changeInfoContent}>
            <View style={styles.itemIconContent}><Image style={styles.icon} source={Icons.Profile.Password}/></View>
            <TextInput
              style={styles.infoText}
              onChangeText={(value) => {
                this.changeValue('passwordAgain', value)
              }}
              returnKeyType="done"
              secureTextEntry={true}
              placeholder={'请再次确认新密码'}
            />
          </View>
          <View style={styles.changeInfoContent}>
            <View style={styles.itemIconContent}/>
            <TextInput
              style={{...styles.infoText, fontSize: 12}}
              returnKeyType="done"
              editable={false}
              placeholder={'密码最少6位'}
            />
          </View>
          <View style={styles.bottomBtns}>
            <TouchableOpacity activeOpacity={0.5} onPress={() => this.changePassword()}>
              <Text style={styles.btn}>确定修改</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Provider>
    );
  }
}

// const screenWidth = Math.round(Dimensions.get('window').width)
const styles = StyleSheet.create({
  cancleBtn: {
    backgroundColor: 'transparent',
    paddingRight: ScreenUtil.scaleSize(24),
    borderWidth: 0
  },
  cancleText: {
    color: 'rgba(23, 29, 53, 1)',
    fontSize: 17
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(249, 249, 249, 0.1)'
  },
  changeInfoContent: {
    backgroundColor: '#fff',
    paddingHorizontal: ScreenUtil.scaleSize(18),
    height: ScreenUtil.scaleSize(55),
    flexDirection: 'row',
    alignItems: 'center'
  },
  infoText: {
    flex: 1,
    color: 'rgba(23, 29, 53, 1)',
    fontSize: 15
  },
  delectBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  delectIcon: {
    width: ScreenUtil.scaleSize(14),
    height: ScreenUtil.scaleSize(14)
  },
  bottomBtns: {
    width: '100%',
    marginTop: ScreenUtil.scaleSize(70),
    height: ScreenUtil.scaleSize(59),
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  btn: {
    width: ScreenUtil.scaleSize(325),
    height: ScreenUtil.scaleSize(39),
    lineHeight: ScreenUtil.scaleSize(39),
    backgroundColor: '#526CDD',
    borderRadius: 50,
    textAlign: 'center',
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(15),
    borderTopColor: 'rgb(0, 0, 0)',
  },
  tips: {
    flexDirection: 'row',
    height: ScreenUtil.scaleSize(40),
    alignItems: 'center',
    paddingHorizontal: ScreenUtil.scaleSize(20),
    backgroundColor: '#fef4eb',
  },
  itemIconContent: {
    marginRight: ScreenUtil.scaleSize(4),
    width: ScreenUtil.scaleSize(21),
    height: ScreenUtil.scaleSize(21),
  },
  icon: {
    width: '100%',
    height: '100%',
  }
})
