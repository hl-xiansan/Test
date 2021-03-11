import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Button
} from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import ScreenUtil from '../../../utils/ScreenUtils'
import page from '../../../components/Page'
import Icons from '../../../Icons'

type Props = {
  navigation: any;
  route: any
};
const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

@page({
  navigation: {
    headerShown: false
  }
})
export default class ScanCodePage extends Component<Props> {
  componentDidMount(){
    console.log(this.props.route.params)

  }
  render() {
    return (
      <ScrollView style={styles.background}>
        <View>
          <ImageBackground source={Icons.QR.QR_Bg} style={styles.qrBackgroundView}>
            <Text style={styles.qrHeaderText}>二维码</Text>
            <View style={styles.qrCodeView}>
              <QRCode
                value={`{
                  "name": "WorkerContractForm",
                  "params": {
                    "code": "${this.props.route.params.id}",
                    "invite_code": "${this.props.route.params.inviteCode}",
                    "customerId": "${this.props.route.params.customerId}",
                    "customerName": "${this.props.route.params.customerName}"
                  }
                }`}
                size={ScreenUtil.scaleSize(215)}
              />
            </View>
            <Text style={styles.descText}>手机扫一扫上面的二维码签约或转厂</Text>
          </ImageBackground>
        </View>
        <View style={styles.footerBtnContent}>
          <TouchableOpacity style={styles.footerBtnView}>
            <Image source={Icons.QR.Default_Img} style={styles.defaultImg} />
            <Text style={styles.footerText}>保存相册</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
    zIndex: 0,
    backgroundColor: '#526CDD',
    paddingTop: ScreenUtil.scaleSize(20)
  },
  qrBackgroundView: {
    marginHorizontal: ScreenUtil.scaleSize(30),
    height: ScreenUtil.scaleSize(400),
    alignItems: 'center'
  },
  qrHeaderText: {
    color: '#030014',
    fontSize: ScreenUtil.scaleSize(17),
    fontWeight: 'bold',
    marginVertical: ScreenUtil.scaleSize(15)
  },
  qrCodeView: {
    paddingVertical: ScreenUtil.scaleSize(20),
    marginTop: ScreenUtil.scaleSize(20),
  },
  descText: {
    color: '#A8A8AC',
    fontSize: ScreenUtil.scaleSize(12),
    marginTop: ScreenUtil.scaleSize(10)
  },
  footerBtnContent: {
    flex: 1,
    alignItems: 'center',
    marginTop: ScreenUtil.scaleSize(30),
  },
  footerBtnView: {
    backgroundColor: '#374FBA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: ScreenUtil.scaleSize(35),
    paddingVertical: ScreenUtil.scaleSize(10),
    borderRadius: ScreenUtil.scaleSize(20),
  },
  defaultImg: {
    width: ScreenUtil.scaleSize(21),
    height: ScreenUtil.scaleSize(21),
    marginRight: ScreenUtil.scaleSize(2),
  },
  footerText: {
    color: '#C9D3FF',
    fontSize: ScreenUtil.scaleSize(14),
  }
})
