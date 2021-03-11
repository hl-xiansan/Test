import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  Button
} from 'react-native'
import ScreenUtil from '../../../utils/ScreenUtils'
import page from '../../../components/Page'
import Icons from '../../../Icons'
import {BottomTabNavigationProp} from "@react-navigation/bottom-tabs";
import Api from "../../../utils/Api";
import CommonUtils from "../../../utils/CommonUtils";
import {Portal, Toast} from "@ant-design/react-native";

type Props = {
  navigation: BottomTabNavigationProp<any>;
  route:any
};
type ItemType = {
  title: string;
  value?: string;
};
const width = Dimensions.get('window').width
@page({
  navigation: {
    headerShown: false
  }
})

export default class LoanApplyDetailPage1 extends Component<Props> {

  // toSign = () => {
  //   this.props.navigation.navigation('')
  // }

  readonly state: {detail:any} = {
    detail: {}
  }

  async handleClick(status:number) {
    const key = Toast.fail('loading',0)
    const data = {  status: status }
    try {
      await Api.put(`/labor/staff/worker/${this.props.route.params.id}/out/status`, data)
      Toast.success('操作成功')

      this.componentDidMount().then()
      Portal.remove(key)
    } catch (e) {
      Toast.fail('出现未知错误')
      Portal.remove(key)
    }
  }

  async componentDidMount() {
    const res = await Api.get('/labor/staff/worker/' + this.props.route.params.id + '/out/detail');
    this.setState({
      detail: res
    })
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.background}>
          <ImageBackground source={require('../../../assets/icons/apply/rectangle.png')} style={styles.topBg}>
            <ProcessView detail={this.state.detail}/>
            <ApplyStatusView detail={this.state.detail}/>
          </ImageBackground>
          <View style={styles.applyInfoView}>
            <View style={styles.titleView}>
              <Image style={styles.titleIcon} source={Icons.News.Resign} />
              <Text style={styles.titleText}>离职信息</Text>
            </View>
            <TextItem title="申请日期" value={CommonUtils.UTCDateFormat(this.state.detail.create_time,'YYYY-MM-DD')} />
            <TextItem title="申请人" value={this.state.detail.employee_name} />
            <TextItem title="所在单位" value={this.state.detail.customer_name} />
            <TextItem title="入职日期" value={CommonUtils.UTCDateFormat(this.state.detail.sign_date,'YYYY-MM-DD')} />
            <TextItem title="离职日期" value={CommonUtils.UTCDateFormat(this.state.detail.quit_date,'YYYY-MM-DD')} />
            <TextItem title="事由" value={this.state.detail.desc} />
          </View>
          <View style={styles.applyInfoView1}>
            <View style={styles.titleView}>
              <Image style={styles.titleIcon} source={Icons.News.Loan} />
              <Text style={styles.titleText}>借款信息</Text>
            </View>
            <TextItem title="员工共借款（元）" value={this.state.detail.loan_amount} />
            <TextItem title="员工共还款（元）" value={this.state.detail.return_amount} />
            <TextItem title="应还未还（元）" value={this.state.detail.left_amount} />
          </View>
          <View style={styles.applyInfoView1}>
            <View style={styles.titleView}>
              <Image style={styles.titleIcon} source={Icons.News.Loan} />
              <Text style={styles.titleText}>评价信息</Text>
            </View>
            <ScoreItem title="服务" value={this.state.detail.comment ? this.state.detail.comment.server : '0'}/>
            <ScoreItem title="态度" value={this.state.detail.comment ? this.state.detail.comment.attitude : '0'}/>
            <ScoreItem title="能力" value={this.state.detail.comment ? this.state.detail.comment.ability : '0'}/>
          </View>
          {
            this.state.detail.status === 10 ?
              <View style={styles.footerView}>
                <TouchableOpacity style={styles.footerBtn} onPress={ () => {
                  this.handleClick(0).then()
                }}>
                  <Text style={styles.footerText}>拒绝</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerBtn1} onPress={() => {
                  this.handleClick(1).then()
                }}>
                  <Text style={styles.footerText}>同意</Text>
                </TouchableOpacity>
              </View>
              : null
          }
        </View>
      </ScrollView>
    )
  }
}

const ProcessView = ({detail}:any) => {
  return (
    <View style={styles.processView}>
      <View style={styles.stepView}>
        <ImageBackground source={Icons.Apply.CircleFill} style={styles.circleBg}>
          <Text>1</Text>
        </ImageBackground>
        <Text style={styles.step1Name}>{detail.employee_name}-发起申请</Text>
        <Text style={styles.step1Time}>{CommonUtils.UTCDateFormat(detail.create_time,'YYYY-MM-DD HH:mm')}</Text>
      </View>
      <View style={styles.centerBar}></View>
      <View style={styles.stepView}>
        <ImageBackground source={Icons.Apply.CircleEmpty} style={styles.circleBg}>
          <Text>2</Text>
        </ImageBackground>
        <Text style={styles.step2Name}>{detail.user?.nickname}</Text>
        <Text style={styles.step2Time}>待审批</Text>
      </View>
    </View>
  )
}

const ApplyStatusView = ({detail}:any) => {
  return (
    <View style={styles.applyStatusView}>
      <View style={styles.statusView}>
        <Text style={styles.applyText}>{detail.employee_name}提交的离职申请</Text>
        <ImageBackground source={Icons.Apply.RoundRectangle} style={styles.statusTag}>
          <Text style={styles.tagText}>{detail.status === 11 ? '拒绝' : detail.status === 15 ? '同意' : '待处理'}</Text>
        </ImageBackground>
      </View>
      <Text style={styles.applyDesText}>{detail.customer_name}</Text>
    </View>
  )
}

const TextItem = (props: ItemType) => {
  const { title = '', value = '' } = props
  return (
    <View style={styles.textItemView}>
      <Text style={styles.applyDesText}>{title}</Text>
      <Text style={styles.valueStyle}>{value}</Text>
    </View>
  )
}

const renderStar = (value: string | undefined) => {
  const arr = []
  for (let index = 0; index < 5; index++) {
    arr.push(
        <TouchableOpacity key={index} activeOpacity={0.8}>
          <Image style={styles.starImg} source={index < Number(value) ? Icons.Apply.StarFill : Icons.Apply.StarEmpty} />
        </TouchableOpacity >
    )
  }
  return arr
}

const ScoreItem = (props: ItemType) => {
  const { title = '',value } = props
  return (
    <View style={styles.scoreItemView}>
      <Text style={styles.applyDesText}>{title}：</Text>
      <View style={{ flex: 1 }}></View>
      {
        renderStar(value)
        // [1, 2, 3, 4].map(ite => {
        //   return <Image style={styles.starImg} key={ite} source={Icons.Apply.StarFill} />
        //
        // <Image style={styles.starImg} key={value} source={Icons.Apply.StarFill} />
      }

      {/*<Image style={styles.starImg} source={Icons.Apply.StarEmpty} />*/}
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    zIndex: 0,
  },
  topBg: {
    width: width,
    height: ScreenUtil.scaleSize(200),
  },
  processView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: ScreenUtil.scaleSize(60),
    marginTop: ScreenUtil.scaleSize(15),
  },
  stepView: {
    alignItems: 'center'
  },
  circleBg: {
    alignItems: 'center',
    justifyContent: 'center',
    width: ScreenUtil.scaleSize(35),
    height: ScreenUtil.scaleSize(35),
    marginBottom: ScreenUtil.scaleSize(8)
  },
  step1Name: {
    color: '#C9D3FF',
    fontSize: ScreenUtil.scaleSize(12)
  },
  step1Time: {
    color: '#C9D3FF',
    fontSize: ScreenUtil.scaleSize(10)
  },
  step2Name: {
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(12)
  },
  step2Time: {
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(10)
  },
  centerBar: {
    backgroundColor: '#95A8FD',
    height: ScreenUtil.scaleSize(2),
    width: ScreenUtil.scaleSize(68),
  },
  applyStatusView: {
    backgroundColor: '#fff',
    padding: ScreenUtil.scaleSize(15),
    borderRadius: ScreenUtil.scaleSize(5),
    marginTop: ScreenUtil.scaleSize(10),
    marginHorizontal: ScreenUtil.scaleSize(15),
  },
  statusView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ScreenUtil.scaleSize(10),
  },
  applyText: {
    color: '#030014',
    fontWeight: 'bold',
    fontSize: ScreenUtil.scaleSize(14)
  },
  statusTag: {
    width: ScreenUtil.scaleSize(53),
    height: ScreenUtil.scaleSize(19),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(12),
  },
  applyDesText: {
    color: '#545468',
    fontSize: ScreenUtil.scaleSize(12),
  },
  applyInfoView: {
    marginHorizontal: ScreenUtil.scaleSize(15),
    borderRadius: ScreenUtil.scaleSize(5),
    backgroundColor: '#fff',
    height: ScreenUtil.scaleSize(285),
    marginTop: -ScreenUtil.scaleSize(15),
    marginBottom: ScreenUtil.scaleSize(15),
  },
  applyInfoView1: {
    marginHorizontal: ScreenUtil.scaleSize(15),
    borderRadius: ScreenUtil.scaleSize(5),
    backgroundColor: '#fff',
    marginBottom: ScreenUtil.scaleSize(15),
  },
  textItemView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ScreenUtil.scaleSize(10),
    marginHorizontal: ScreenUtil.scaleSize(15),
    borderBottomWidth: 1,
    borderBottomColor: '#E7EBEF',
    borderStyle: 'dashed',
  },
  nameStyle: {
    color: '#545468',
    fontSize: ScreenUtil.scaleSize(12),
  },
  valueStyle: {
    color: '#030014',
    fontSize: ScreenUtil.scaleSize(12),
  },
  footerView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: ScreenUtil.scaleSize(12),
    paddingHorizontal: ScreenUtil.scaleSize(25),
  },
  footerBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: ScreenUtil.scaleSize(37),
    borderRadius: ScreenUtil.scaleSize(20),
    backgroundColor: '#FE9B16',
    marginRight: ScreenUtil.scaleSize(20)
  },
  footerBtn1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: ScreenUtil.scaleSize(37),
    borderRadius: ScreenUtil.scaleSize(20),
    backgroundColor: '#526CDD',
  },
  footerText: {
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(15)
  },
  titleView: {
    padding: ScreenUtil.scaleSize(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    width: ScreenUtil.scaleSize(22),
    height: ScreenUtil.scaleSize(22),
    marginRight: ScreenUtil.scaleSize(5),
  },
  titleText: {
    color: '#030014',
    fontSize: ScreenUtil.scaleSize(12),
    fontWeight: 'bold',
  },
  scoreItemView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: ScreenUtil.scaleSize(15),
    marginBottom: ScreenUtil.scaleSize(20)
  },
  starImg: {
    width: ScreenUtil.scaleSize(19),
    height: ScreenUtil.scaleSize(19),
    marginLeft: ScreenUtil.scaleSize(15),
  },
})
