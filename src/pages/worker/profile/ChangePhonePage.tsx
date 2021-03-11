import React, {Component} from 'react';
import {View, Text, TextInput, Image, StyleSheet, Dimensions, SafeAreaView} from 'react-native';
import {Button, Toast, Portal, Provider} from '@ant-design/react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CommonUtils from '../../../utils/CommonUtils';
import Api from '../../../utils/Api';
import ScreenUtil from '../../../utils/ScreenUtils'
import Icons from "../../../Icons";


type Props = {
    navigation: any;
    route: any;
    store: any;
};

type State = any;

export default class ChangePhonePage extends Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);
        this.state = {
            phone: '',
            showPhone: '',
            verificationCode: '',
            disabledTime: 0,
        };
    }

    changePhone = () => {
        if (!CommonUtils.isPhoneAvailable(this.state.phone)) {
            Toast.fail('手机号码格式不正确', 2);
            return false;
        }
        if (!this.state.verificationCode) {
            Toast.fail('验证码不能为空');
            return false;
        }
        const key = Toast.loading('正在保存...', 0);
        const params:any = {
            phone: this.state.phone,
            captcha: this.state.verificationCode,
            organization: 'tongtu.labor.app.worker',
        };
        CommonUtils.changePhone(params).then((res) => {
          Portal.remove(key)
          Toast.success('修改成功', 1, () => {
            this.props.navigation.goBack();
          })
        }).catch((err) => {
          Portal.remove(key)
            if (err.message === '5005101') {
                Toast.fail('验证码错误', 1)
            } else if (err.message === '5005106') {
                Toast.fail('手机号已存在', 1)
            } else {
                Toast.fail(err.message, 1)
            }
        })
    }

    // 获取个人信息
    getUserInfo = () => {
        const key = Toast.loading('加载中...', 0)
        Api.get('/gateway/profile').then((res: any) => {
            Portal.remove(key)
            this.setState({
                showPhone: res?.phone || '***********',
            })
        }).catch((err) => {
            Portal.remove(key)
            Toast.fail({
                content: err.message,
                duration: 0
            })
        })
    }

    changePhoneValue = (value: string) => {
        this.setState({ phone: value });
    }

    changeVerficationCode = (value: string) => {
        this.setState({ verificationCode: value });
    }

    componentDidMount() {
        this.getUserInfo();
    }

    startDisabledTime = () => {
        const key = Toast.loading('发送中...', 0);
        Api.get(`/gateway/captcha/default?target=${this.state.phone}`).then((res: any) => {
            Portal.remove(key)
            const time = setInterval(() => {
                this.setState({
                    disabledTime: this.state.disabledTime - 1,
                }, () => this.state.disabledTime <= 0 && clearInterval(time));
            }, 1000);
        }).catch((err) => {
            Portal.remove(key)
            Toast.fail({
                content: err.message,
                duration: 0
            })
        })
    }

    render() {
        return (
            <Provider>
                <SafeAreaView style={styles.container}>
                    <View style={styles.changePhoneInfoTitle}>
                        <Text style={styles.phoneNumber}>{this.state.showPhone?.slice(0, 3)}****{this.state.showPhone?.slice(7, 11)}</Text>
                        <Text style={styles.phoneNumberSubTitle}>当前绑定手机号</Text>
                    </View>
                    <View style={styles.changeInfoContent}>
                        <View style={styles.itemIconContent}><Image style={styles.icon} source={Icons.Profile.Phone}/></View>
                        <TextInput
                            defaultValue={this.state.phone}
                            style={styles.infoText}
                            onChangeText={(value) => {this.changePhoneValue(value)}}
                            returnKeyType="done"
                            placeholder={'请输入手机号'}
                        />
                    </View>
                    <View style={{...styles.changeInfoContent, borderTopWidth: 1, borderTopColor: '#ccc'}}>
                        <View style={styles.itemIconContent}><Image style={styles.icon} source={Icons.Profile.VerCode}/></View>
                        <TextInput
                            style={styles.infoText}
                            onChangeText={(value) => {this.changeVerficationCode(value)}}
                            returnKeyType="done"
                            placeholder="请输入验证码"
                        />
                        <Button
                            style={{
                                backgroundColor: this.state.disabledTime > 0 ? '#ccc' : '#526CDD',
                                height: ScreenUtil.scaleSize(35), borderWidth: 0
                            }}
                            onPress={() => {
                                if (!CommonUtils.isPhoneAvailable(this.state.phone)) {
                                    return Toast.fail('手机号码格式不正确', 2);
                                }
                                this.setState({
                                    disabledTime: 60,
                                }, () => this.startDisabledTime())
                            }}
                            disabled={this.state.disabledTime > 0}
                        >
                            {this.state.disabledTime > 0
                            ? (<Text style={{color: '#fff'}}>{`${this.state.disabledTime}`}</Text>) : (
                                <Text style={{color: '#fff'}}>获取验证码</Text>
                            )}
                        </Button>
                    </View>
                    <View style={styles.bottomBtns}>
                        <TouchableOpacity activeOpacity={0.5} onPress={() => this.changePhone()}>
                            <Text style={styles.btn}>确定修改手机号</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Provider>
        );
    }
}

const screenWidth = Math.round(Dimensions.get('window').width);
const styles = StyleSheet.create({
    changePhoneInfoTitle: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        height: ScreenUtil.scaleSize(120),
    },
    phoneNumber: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    phoneNumberSubTitle: {
        fontSize: 17,
        color: '#ccc'
    },
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
