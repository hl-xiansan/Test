import React, { Component } from 'react'
import { NavigationProp, Route } from '@react-navigation/native'
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Easing,
  TouchableWithoutFeedback,
} from 'react-native'

import Icons from '../../../Icons'
import { BarCodeReadEvent, RNCamera } from 'react-native-camera'
import ScreenUtil from '../../../utils/ScreenUtils'
import Page from '../../../components/Page'
import { Animated } from 'react-native'
import {Toast} from '@ant-design/react-native'


type Props = {
  navigation: NavigationProp<any>
  route: Route<any>
}

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

@Page({
  navigation: {
    headerShown: false
  }
})
export default class ReactNativeDemo extends Component<Props> {
  state = {
    cameraType: RNCamera.Constants.Type.back,
    moveAnim: new Animated.Value(0),
    lightStatus: false,
  };

  scanStatus = true;

  componentDidMount() {
    this.startAnimation()
  }

  startAnimation = () => {
    this.state.moveAnim.setValue(0)
    Animated.timing(
      this.state.moveAnim,
      {
        toValue: 230,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: false
      },
    ).start(() => this.startAnimation())
  };

  //  识别二维码
  BarCodeReadEvent = (event: BarCodeReadEvent) => {
    // 这里识别出来的是一个json字符串，一个是路由地址，一个是params
    // For example: `{"name": "WorkerContractForm", "params": {"code": "111"}}`
    try {
      const routeInfo = JSON.parse(event.data);
      this.props.navigation.navigate(routeInfo.name, routeInfo.params);
    } catch (e) {
      Toast.fail('出差啦！请联系管理员');
    }
  }

  render() {
    return (
      <RNCamera
        autoFocus={RNCamera.Constants.AutoFocus.on} /*自动对焦*/
        style={[styles.preview]}
        type={RNCamera.Constants.Type.back} /*切换前后摄像头 front前back后*/
        flashMode={RNCamera.Constants.FlashMode.off} /*相机闪光模式*/
        onBarCodeRead={this.BarCodeReadEvent.bind(this)}>
        <TouchableOpacity style={styles.closeBnt} activeOpacity={0.5} onPress={() => { this.props.navigation.goBack() }}>
          <Image source={Icons.Public.CloseOne} style={styles.closeBtnIcom} />
        </TouchableOpacity>
        <Text style={styles.noteTwo}>手机扫一扫签约或转场</Text>
        {/*<TouchableWithoutFeedback onPress={() => {*/}
        {/*  this.props.navigation.navigate('WorkerContractForm', { code: 'dsadas' })*/}
        {/*}}>*/}
        {/*  <Image source={Icons.Public.Scan} style={styles.scanIcon} />*/}
        {/*</TouchableWithoutFeedback>*/}
        <Image source={Icons.Public.Scan} style={styles.scanIcon} />
      </RNCamera>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  background: {
    flex: 1,
    width: width,
    height: height,
    zIndex: 0,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  rectangle: {
    height: 230,
    width: 230,
  },
  border: {
    flex: 0,
    width: 230,
    height: 2,
    backgroundColor: '#00FF00',
  },
  itemStyle: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: (width - 230) / 2,
    height: 230,
  },

  lightBtn: {
    alignSelf: 'center',
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
  },
  content: {
    paddingTop: ScreenUtil.scaleSize(60),
  },

  note: {
    fontSize: 15,
    color: '#fff',
    marginTop: ScreenUtil.scaleSize(30),
  },
  noteTwo: {
    marginBottom: ScreenUtil.scaleSize(18),
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(14)
  },
  manualCode: {
    fontSize: 15,
    color: '#fff',
    marginTop: ScreenUtil.scaleSize(50),
  },
  scanIcon: {
    width: ScreenUtil.scaleSize(22),
    height: ScreenUtil.scaleSize(22),
    marginBottom: ScreenUtil.scaleSize(30),
  },
  closeBnt: {
    top: ScreenUtil.scaleSize(54),
    right: ScreenUtil.scaleSize(15),
    width: ScreenUtil.scaleSize(25),
    height: ScreenUtil.scaleSize(25),
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: ScreenUtil.scaleSize(25),
    position: 'absolute'
  },
  closeBtnIcom: {
    width: ScreenUtil.scaleSize(25),
    height: ScreenUtil.scaleSize(25),
  }
})
