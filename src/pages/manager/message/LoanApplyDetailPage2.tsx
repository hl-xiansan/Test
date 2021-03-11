import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Button
} from 'react-native'
import ScreenUtil from '../../../utils/ScreenUtils'
import page from '../../../components/Page'
import Icons from '../../../Icons'
import {NavigationProp} from "@react-navigation/native";
import Api from "../../../utils/Api";
import CommonUtils from "../../../utils/CommonUtils";
import {Toast} from "@ant-design/react-native";

type Props = {
  navigation: NavigationProp<any>;
  route:any;
};
type ItemType = {
  title: string;
  value?: string;
};
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

@page({
  navigation: {
    headerShown: false
  }
})
export default class LoanApplyDetailPage2 extends Component<Props> {

  readonly state: {detail:any} = {
    detail: {}
  }

  async componentDidMount(){
    const res = await Api.get(`/labor/staff/worker/${this.props.route.params.id}/transfer/detail`)
    this.setState({
      detail: res
    })
  }

  toNextPage = async () => {
    this.props.navigation.navigate('ConfirmBatchProcess', { id: this.props.route.params.id,transfer:1, goBack: () => { this.componentDidMount() } })
  }

  toRefuse = async () =>{
    await Api.post(`/labor/staff/worker/transfer/${this.props.route.params.id}/refuse`)
    // Toast.info('loading')
    await this.componentDidMount()
  }

  render() {
    return (
      <View style={styles.background}>
        <View style={styles.content}>
          <ImageBackground source={require('../../../assets/icons/apply/rectangle.png')} style={styles.topBg}>
            <ApplyStatusView detail={this.state.detail}/>
          </ImageBackground>
          <View style={styles.applyInfoView}>
            <View style={styles.applyInfoHeader}>
              <Text style={styles.applyInfoHeaderText}>该员工有一笔借款未还（{this.state.detail.amount ? this.state.detail.amount : 0}元）</Text>
            </View>
            <TextItem title="申请时间" value={CommonUtils.UTCDateFormat(this.state.detail.time,'YYYY-MM-DD HH:mm')} />
            <TextItem title="员工姓名" value={this.state.detail.employee_name} />
            <TextItem title="当前用工单位" value={this.state.detail.customer_name} />
            <TextItem title="申请转厂单位" value={this.state.detail.next_customer_name} />
          </View>
          {
            this.state.detail.status === 1 ?
              <View style={styles.footerView}>
                <TouchableOpacity style={styles.footerBtn} onPress={this.toRefuse}>
                  <Text style={styles.footerText}>拒 绝</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerBtn1} onPress={this.toNextPage}>
                  <Text style={styles.footerText}>通 过</Text>
                </TouchableOpacity>
              </View> : null
          }

        </View>
      </View>
    )
  }
}

const ApplyStatusView = ({detail}:any) => {
  return (
    <View style={styles.applyStatusView}>
      <View style={styles.statusView}>
        <Text style={styles.applyText}>{detail.employee_name}提交的转厂申请</Text>
        <ImageBackground source={Icons.Apply.RoundRectangle} style={styles.statusTag}>
          <Text style={styles.tagText}>{detail.status === 1 ? '待处理' : detail.status === 3 ? '通过' : '拒绝'}</Text>
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

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
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
    marginTop: -ScreenUtil.scaleSize(100),
    marginBottom: ScreenUtil.scaleSize(15),
    flex: 1,
  },
  applyInfoHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF6E9',
    padding: ScreenUtil.scaleSize(10),
    borderTopLeftRadius: ScreenUtil.scaleSize(5),
    borderTopRightRadius: ScreenUtil.scaleSize(5),
  },
  applyInfoHeaderText: {
    color: '#FE9B16',
    fontSize: ScreenUtil.scaleSize(12),
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
    marginRight: ScreenUtil.scaleSize(20),
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
})
