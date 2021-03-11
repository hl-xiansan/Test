import React, { Component } from 'react'
import { NavigationProp, Route } from '@react-navigation/native'
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native'
import QRCode from 'react-native-qrcode-svg'

import Api from '../../../utils/Api'
import ScreenUtils from '../../../utils/ScreenUtils'
import LinearGradient from 'react-native-linear-gradient'
import Page from '../../../components/Page'
import Icons from '../../../Icons'
import { Job } from '../../../@types'

type Props = {
  navigation: NavigationProp<any>
  route: Route<string, { id: string,isManager:number | null,inviteCode:string | null,staffName:string | null }>
}

type State = {
  job?: Job
  inviteCode: string,
  staffName: string,
  userState:Job
}

@Page()
export default class WorkerJobsViewPage extends Component<Props, State> {

  readonly state: State = {
    inviteCode: '',
    staffName: '',
    userState:'',
  }

  componentDidMount() {
    Api.get<Job>(`/labor/jobs/${this.props.route.params.id}`).then((res) => {
      
      this.setState({ job: res })
    })
    Api.get<Job>(`/gateway/users`).then((res) => {
      console.log(this.props.route.params.id); 
      this.setState({
        userState:res
      })
    })
    if (this.props.route.params.inviteCode !== null) {
      this.setState({ inviteCode: this.props.route.params.inviteCode})
    }
    if (this.props.route.params.staffName !== null) {
      this.setState({ staffName: this.props.route.params.staffName})
    }
  }
  render() {
    if (!this.state.job) return <View></View>
    return (
      <View style={styles.box}>
        <View style={styles.content}>
          <View style={styles.backColor} />
          <LinearGradient colors={['rgba(82, 108, 221, 1)', 'rgba(82, 108, 221, 0.5)', 'rgba(82, 108, 221, 0.1)']} style={styles.linearGradient} />
          <ScrollView style={styles.paddingBox}>
            <View style={styles.positionItemView}>
              <View style={styles.positonInfoView}>
                <View style={[styles.positonInfoRow, styles.positonInfoRowOne]}>
                  <Text style={styles.positionName}>{this.state.job?.name}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => { this.props.navigation.navigate('JobViewQrcode', { job: this.state.job }) }}>
                      <Image
                        source={Icons.Job.QrCodeIcon}
                        style={{
                          height: ScreenUtils.scaleSize(22),
                          width: ScreenUtils.scaleSize(22),
                          marginRight: ScreenUtils.scaleSize(10)
                        }}
                      />
                    </TouchableOpacity>
                    <ImageBackground source={Icons.Public.BgOne} style={styles.priceView}>
                      <Text style={styles.priceViewText}>{this.state.job?.salary}/小时</Text>
                    </ImageBackground>
                  </View>
                </View>
                <View style={[styles.positionRowTwo, styles.positonInfoRow]}>
                  <Text style={styles.rowTwoText}>{this.state.job?.customer_name || this.state.job.customer?.name}</Text>
                </View>
                <View style={[styles.positionInfoRowThree, styles.positonInfoRow]}>
                  <Image source={require('../../../assets/icons/job/location.png')} />
                  <Text style={styles.rowThreeText}>
                    {this.state.job?.province && this.state.job?.city ? `${this.state.job?.province?.name}-${this.state.job?.city?.name}` : this.state.job?.place}
                  </Text>
                  {
                    this.state.job?.exp_low || this.state.job?.exp_high ?
                      <React.Fragment>
                        <Image source={require('../../../assets/icons/job/experience.png')} />
                        <Text style={styles.rowThreeText}>
                          <Text style={styles.rowThreeText}>{this.state.job?.exp_low}年{this.state.job?.exp_high ? `-${this.state.job?.exp_high}年` : '或以上'}</Text>
                        </Text>
                      </React.Fragment>
                      : null
                  }
                  <Image source={require('../../../assets/icons/job/schoolRecord.png')} />
                  <Text style={styles.rowThreeText}>{this.state.job?.education?.name}</Text>
                </View>
              </View>
            </View>
            <View style={styles.positionItemView}>
              <View style={styles.positonInfoView}>
                <View style={styles.titleHeader}>
                  <View style={styles.titleHeaderLeftBox}>
                    <Image style={styles.titleHeaderLeftImg} source={require('../../../assets/icons/job/positionDetail.png')} />
                    <Text style={styles.titleHeaderLeft}>职位详情</Text>
                  </View>
                  <Text style={styles.titleHeaderRight}>职位招聘{this.state.job?.recruit_count}人</Text>
                </View>
                <View>
                  <Text style={styles.itemContentText}>{this.state.job?.desc}</Text>
                </View>
              </View>
            </View>
            <View style={styles.positionItemView}>
              <View style={styles.positonInfoView}>
                <View style={styles.titleHeader}>
                  <View style={styles.titleHeaderLeftBox}>
                    <Image style={styles.titleHeaderLeftImg} source={require('../../../assets/icons/job/factoryPicture.png')} />
                    <Text style={styles.titleHeaderLeft}>工厂图片</Text>
                  </View>
                </View>
                <View style={styles.twoContent}>
                  {
                    this.state.job?.customer?.photos?.length > 0 ?
                      <View style={{
                        height: 85, marginTop: 12, width: '100%'
                      }}>
                        <FlatList
                          horizontal={true}
                          data={this.state.job?.customer?.photos}
                          keyExtractor={(item: any, index: number) => item + index}
                          renderItem={({ item, index }) => <Image key={index} source={{ uri: 'http://tongtu.juyunfuwu.cn/api/tongtu/storage/' + item }} style={styles.contentImage} />}
                          style={{ width: '100%' }}
                        />
                      </View> : null
                  }
                </View>
              </View>
            </View>
            <View style={styles.positionItemView}>
              <View style={styles.positonInfoView}>
                <View style={styles.titleHeader}>
                  <View style={styles.titleHeaderLeftBox}>
                    <Image style={styles.titleHeaderLeftImg} source={require('../../../assets/icons/job/customer_desc.png')} />
                    <Text style={styles.titleHeaderLeft}>工厂介绍</Text>
                  </View>
                </View>
                <View>
                  <Text style={styles.itemContentText}>{this.state.job?.customer?.desc}</Text>
                </View>
              </View>
            </View>
            <View style={styles.positionItemView}>
             <View style={styles.positonInfoView}>
               <View style={styles.titleHeader}>
                 <View style={styles.titleHeaderLeftBox}>
                   <Image style={styles.titleHeaderLeftImg} source={require('../../../assets/icons/job/employerInfo.png')} />
                   <Text style={styles.titleHeaderLeft}>招聘者信息</Text>
                 </View>
                 <Text style={styles.titleHeaderRight}>扫描下方微信二维码</Text>
               </View>
               <View style={styles.threeBoxContent}>
                 <View>
                   <Text style={styles.itemContentText}>姓名：{ this.state.userState.modifier }</Text>
                   <Text style={styles.itemContentText}>手机：{ this.state.userState.phone ? this.state.userState.phone : "" }</Text>
                   <Text style={styles.itemContentText}>微信：{ this.state.userState.extras.wechat ? this.state.userState.extras.wechat : "" }</Text>
                 </View>
                 {/* <Image style={styles.scanImg} source={{uri: this.state.job?.person?.wx_qrcode}}/> */}
                 {/* <Image
                        source={Icons.Job.QrCodeIcon}
                        style={{
                          height: ScreenUtils.scaleSize(100),
                          width: ScreenUtils.scaleSize(100),
                          marginRight: ScreenUtils.scaleSize(10)
                        }}
                      /> */}
                      <QRCode
                          value={
                            `{
                              "name": "JobView",
                              "params": {
                                "inviteCode": "${this.state.userState.extras.wx_qrcode}",
                              }
                            }`
                          }
                          size={ScreenUtils.scaleSize(80)}
                        />
               </View>
             </View>
            </View>

          </ScrollView>
        </View>
        <View style={styles.bottomBtns}>
          {/* {
            //  如果是详情1那就不展示推荐好友
            true ? null : <Text style={styles.btn}>推荐好友</Text>
          } */}

          {
            typeof this.props.route.params.isManager !== 'undefined' ? null :
              <TouchableOpacity activeOpacity={0.5} onPress={() => {
                this.props.navigation.navigate('ResumeInfo', {
                  id: this.state.job?.customer_id, name: this.state.job?.name, jobId: this.state.job?.id,
                  staffName: this.state.staffName,
                  inviteCode: this.state.inviteCode
                })
              }}>
                <Text style={{
                  ...styles.btn,
                  // 如果是详情1那就把宽度加宽
                  width: ScreenUtils.scaleSize(304),
                }}>应聘</Text>
              </TouchableOpacity>
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  box: {
    display: 'flex',
    flex: 1,
    position: 'relative',
    paddingBottom: ScreenUtils.scaleSize(59),
  },
  content: {
    height: '100%',
  },
  bottomBtns: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: ScreenUtils.scaleSize(59),
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  btn: {
    width: ScreenUtils.scaleSize(152),
    height: ScreenUtils.scaleSize(39),
    lineHeight: ScreenUtils.scaleSize(39),
    backgroundColor: '#526CDD',
    borderRadius: 50,
    textAlign: 'center',
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(15),
    borderTopColor: 'rgb(0, 0, 0)',
  },
  backColor: {
    width: '100%',
    height: ScreenUtils.scaleSize(33),
    backgroundColor: 'rgba(82, 108, 221, 1)',
    position: 'absolute',
  },
  paddingBox: {
    paddingHorizontal: ScreenUtils.scaleSize(15)
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
    minHeight: ScreenUtils.scaleSize(134),
    backgroundColor: '#fff',
    borderRadius: ScreenUtils.scaleSize(2),
    paddingHorizontal: ScreenUtils.scaleSize(15),
    position: 'relative',
    paddingBottom: ScreenUtils.scaleSize(15)
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
  titleHeader: {
    height: ScreenUtils.scaleSize(45),
    borderBottomWidth: ScreenUtils.scaleSize(1),
    borderBottomColor: '#E7EBEF',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: ScreenUtils.scaleSize(12),
    marginBottom: ScreenUtils.scaleSize(15),
  },
  titleHeaderLeftBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleHeaderLeftImg: {
    width: ScreenUtils.scaleSize(22),
    height: ScreenUtils.scaleSize(22),
  },
  titleHeaderLeft: {
    color: '#030014',
    fontWeight: 'bold',
    fontSize: ScreenUtils.scaleSize(14),
  },
  titleHeaderRight: {
    color: '#A8A8AC'
  },
  itemContentText: {
    fontSize: ScreenUtils.scaleSize(15),
    lineHeight: ScreenUtils.scaleSize(30),
    color: '#545468',
  },
  twoContent: {
    display: 'flex',
    flexDirection: 'row',
  },
  contentImage: {
    width: ScreenUtils.scaleSize(115),
    height: ScreenUtils.scaleSize(64),
    backgroundColor: 'orange',
    marginLeft: ScreenUtils.scaleSize(10),
    borderRadius: 5,
  },
  threeBoxContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scanImg: {
    width: ScreenUtils.scaleSize(73),
    height: ScreenUtils.scaleSize(73),
    backgroundColor: 'orange',
  },
})

