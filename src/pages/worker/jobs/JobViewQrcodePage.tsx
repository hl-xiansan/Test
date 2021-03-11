import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs'
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import ScreenUtils from '../../../utils/ScreenUtils'
import LinearGradient from 'react-native-linear-gradient'
import Page from '../../../components/Page'
import Icons from '../../../Icons'
import {Portal, Provider, Toast} from '@ant-design/react-native'
import QRCode from 'react-native-qrcode-svg'
import {workerInfo} from "../../../utils/worker";

type Props = {
  navigation: BottomTabNavigationProp<any>
  route: any
}

@Page({
  navigation: {
    title: 'JobViewQrcode',
  }
})
export default class JobViewQrcodePage extends Component<Props> {

  readonly state:{inviteCode: string | null,staffName: string | null} = {
    inviteCode: '',
    staffName: ''
  }

  async componentDidMount() {
    const key = Toast.loading('loading')
    const user = await workerInfo.getUser()
    this.setState({
      inviteCode: user?.extras?.invite_code! || '',
      staffName: user?.nickname! || ''
    })
    Portal.remove(key)
  }

  render() {
    return (
      <Provider>
        <View style={styles.box}>
          <View style={styles.content}>
            <View style={styles.backColor}/>
            <LinearGradient colors={['rgba(82, 108, 221, 1)', 'rgba(82, 108, 221, 0.5)', 'rgba(82, 108, 221, 0.1)']} style={styles.linearGradient}/>
            <ScrollView style={styles.paddingBox}>
              <View style={styles.positionItemView}>
                <View style={styles.positonInfoView}>
                  <View style={[styles.positonInfoRow, styles.positonInfoRowOne]}>
                    <Text style={styles.positionName}>{this.props.route.params.job.name}</Text>
                    <View style={{flexDirection: 'row'}}>
                      <ImageBackground source={Icons.Public.BgOne} style={styles.priceView}>
                        <Text style={styles.priceViewText}>{this.props.route.params.job.salary}/小时</Text>
                      </ImageBackground>
                    </View>
                  </View>
                  <View style={[styles.positionRowTwo, styles.positonInfoRow]}>
                    <Text style={styles.rowTwoText}>{this.props.route.params.job.customer_name || this.props.route.params.job.customer?.name}</Text>
                  </View>
                  <View style={[styles.positionInfoRowThree, styles.positonInfoRow]}>
                    <Image source={require('../../../assets/icons/job/location.png')}/>
                    <Text style={styles.rowThreeText}>
                      {this.props.route.params.job.province && this.props.route.params.job.city ? `${this.props.route.params.job.province?.name}-${this.props.route.params.job.city?.name}` : this.props.route.params.job.place}
                    </Text>
                    {this.props.route.params.job.exp_low || this.props.route.params.job.exp_high ?
                      <><Image source={require('../../../assets/icons/job/experience.png')}/>
                        <Text style={styles.rowThreeText}>{this.props.route.params.job.exp_low}年{this.props.route.params.job.exp_high ? `-${this.props.route.params.job.exp_high}年` : '或以上'}</Text></> : null}
                    {this.props.route.params.job.education ?
                      <><Image source={require('../../../assets/icons/job/schoolRecord.png')}/><Text style={styles.rowThreeText}>{this.props.route.params.job?.education?.name}</Text></> : null}
                  </View>
                </View>
              </View>
              <View style={styles.paddingBox2}>
                <View style={styles.qrCodeView}>
                  <QRCode
                    value={
                      `{
                        "name": "JobView",
                        "params": {
                          "id": "${this.props.route.params.job.id}",
                          "inviteCode": "${this.state.inviteCode}",
                          "staffName": "${this.state.staffName}"
                        }
                      }`
                    }
                    size={ScreenUtils.scaleSize(215)}
                  />
                </View>
                <Text style={styles.descText}>使用手机扫一扫上面的二维码应聘职位</Text>
                <View style={styles.bottomBtns}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => this.props.navigation.goBack()}>
                    <Text style={styles.btn}>返回</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  box: {
    display: 'flex',
    flex: 1,
    position: 'relative',
  },
  content: {
    height: '100%',
  },
  backColor: {
    width: '100%',
    height: ScreenUtils.scaleSize(33),
    backgroundColor: 'rgba(82, 108, 221, 1)',
    position: 'absolute',
  },
  paddingBox: {
    paddingHorizontal: ScreenUtils.scaleSize(15),
  },
  paddingBox2: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ScreenUtils.scaleSize(4),
    paddingHorizontal: ScreenUtils.scaleSize(15),
    paddingVertical: ScreenUtils.scaleSize(15),
    backgroundColor: '#fff',
  },
  linearGradient: {
    position: 'absolute',
    zIndex: -1,
    top: ScreenUtils.scaleSize(33),
    width: '100%',
    height: ScreenUtils.scaleSize(150)
  },

  positionItemView: {
    minHeight: ScreenUtils.scaleSize(140),
    overflow: 'hidden',
    marginBottom: ScreenUtils.scaleSize(15),
  },
  positonInfoView: {
    width: '100%',
    minHeight: ScreenUtils.scaleSize(125),
    backgroundColor: '#fff',
    borderRadius: ScreenUtils.scaleSize(4),
    paddingHorizontal: ScreenUtils.scaleSize(15),
    position: 'relative',
  },
  positonInfoRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  positonInfoRowOne: {
    marginTop: ScreenUtils.scaleSize(20)
  },
  positionName: {
    color: 'rgba(3, 0, 20, 1)',
    fontSize: ScreenUtils.scaleSize(15),
    fontWeight: 'bold',
    flex: 1
  },
  priceView: {
    width: ScreenUtils.scaleSize(75),
    height: ScreenUtils.scaleSize(20)
  },
  priceViewText: {
    textAlign: 'center',
    lineHeight: ScreenUtils.scaleSize(20),
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(13),
    fontWeight: '500'
  },
  positionRowTwo: {
    marginTop: ScreenUtils.scaleSize(10),
  },
  rowTwoText: {
    color: 'rgba(84, 84, 104, 1)',
    fontSize: ScreenUtils.scaleSize(13),
    fontWeight: '500'
  },
  rowCircle: {
    marginHorizontal: ScreenUtils.scaleSize(8),
    width: ScreenUtils.scaleSize(4),
    height: ScreenUtils.scaleSize(4),
    backgroundColor: 'rgba(84, 84, 104, 1)',
    borderRadius: ScreenUtils.scaleSize(4)
  },
  positionInfoRowThree: {
    marginTop: ScreenUtils.scaleSize(15),
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%'
  },
  rowThreeText: {
    color: 'rgba(168, 168, 172, 1)',
    fontSize: ScreenUtils.scaleSize(12),
    paddingHorizontal: ScreenUtils.scaleSize(7),
    paddingVertical: ScreenUtils.scaleSize(4),
    backgroundColor: '#fff',
    borderRadius: ScreenUtils.scaleSize(6),
    marginRight: ScreenUtils.scaleSize(5)
  },
  qrCodeView: {
    paddingVertical: ScreenUtils.scaleSize(20),
  },
  descText: {
    color: '#A8A8AC',
    fontSize: ScreenUtils.scaleSize(12),
    marginTop: ScreenUtils.scaleSize(10)
  },
  bottomBtns: {
    marginTop: ScreenUtils.scaleSize(20),
    width: '60%',
    height: ScreenUtils.scaleSize(59),
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  btn: {
    width: ScreenUtils.scaleSize(125),
    height: ScreenUtils.scaleSize(39),
    lineHeight: ScreenUtils.scaleSize(39),
    backgroundColor: '#526CDD',
    borderRadius: 50,
    textAlign: 'center',
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(15),
    borderTopColor: 'rgb(0, 0, 0)',
  },
})

