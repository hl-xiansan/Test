import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import ScreenUtil from '../../../utils/ScreenUtils'
import page from '../../../components/Page'
import Icons from '../../../Icons'
import { Portal, Provider, Toast } from '@ant-design/react-native'
import Api from '../../../utils/Api'
import { formatDate } from '../../worker/leave/Leave'

export const LOAN_STATUS_MAP: any = {
  '0': '待审核',
  '5': '同意借款',
  '6': '不同意',
  '7': '驳回',
  '10': '同意修改',
  '11': '不同意',
  '15': '待还款',
  '16': '拒绝转账',
  '20': '已还款',
}
export const LOAN_STATUS_ICON_MAP: any = {
  '0': Icons.Apply.RoundRectangle,
  '5': Icons.Apply.GreenRectangle,
  '6': Icons.Apply.OrangeRectangle,
  '7': Icons.Apply.OrangeRectangle,
  '10': Icons.Apply.GreenRectangle,
  '11': Icons.Apply.OrangeRectangle,
  '15': Icons.Apply.RoundRectangle,
  '16': Icons.Apply.GreenRectangle,
  '20': Icons.Apply.GreenRectangle,
}
type Props = {
  navigation: any;
  route: any
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

export default class LoanApplyDetailPage extends Component<Props> {
  loading = false
  state: any = {
    data: null
  }
  toNextPage() {
    this.props.navigation.navigate('ModifyLoanAmount', {
      id: this.state.data.id,
      goBack: () => {
        this.getData()
      }
    })
  }
  toRefuse() {
    this.props.navigation.navigate('RefuseConfirm', {
      type: 0,
      id: this.state.data.id,
      goBack: () => {
        this.getData()
      }
    })
  }
  componentDidMount() {
    this.getData()
  }
  async getData() {
    const key = Toast.loading('loading')
    try {
      if (!this.props.route.params) {
        // TODO  测试数据)

        Portal.remove(key)
        return
      }

      // 请求详情
      const { id } = this.props.route.params
      let data = await Api.get(`/labor/staff/loan/${id}`, { params: { id } })
      data.amount = data.amount?data.amount/1000:0
      data.real_amount =  data.real_amount?data.real_amount/1000:0
      this.setState( {data: data })
      Portal.remove(key)
    } catch (error) {
      Portal.remove(key)
      Toast.fail(error.message)
    }

  }
  render() {
    const { data } = this.state
    console.log(data)

    return (
      <Provider>
        <ScrollView>
          <View style={styles.background}>
            <ImageBackground source={require('../../../assets/icons/apply/rectangle.png')} style={styles.topBg}>
              <ProcessView name={data?.employee_name} date={data?.create_time} auditor_name={data?.auditor_name} status={data?.status} />
              <ApplyStatusView name={data?.employee_name} status={data?.status} />
            </ImageBackground>
            <View style={styles.applyInfoView}>
              <TextItem title="审批编号" value={data?.loan_no} />
              <TextItem title="申请人" value={data?.employee_name} />
              <TextItem title="所在单位" value={data?.customer_name} />
              {
                data?.type === 0 ? (<TextItem title="银行卡号" value={data?.bankcard?.bank_account} /> ):
                  (data?.type === 1 ? <TextItem title="支付宝帐号" value={data?.account_number} /> : null)
              }
              <TextItem title="申请金额（元）" value={data?.amount} />
              <TextItem title="实际金额（元）" value={data?.real_amount} />
              <TextItem title="事由" value={data?.desc} />
            </View>
            {data?.status === 0 && <View style={styles.footerView}>
              <TouchableOpacity style={styles.footerBtn} onPress={this.toRefuse.bind(this)}>
                <Text style={styles.footerText}>拒绝</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerBtn1} onPress={this.toNextPage.bind(this)}>
                <Text style={styles.footerText}>更改金额</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerBtn2} onPress={async () => {
                if(this.loading) return
                this.loading = true
                const key = Toast.loading('loading')
                try {
                  await Api.put(`/labor/staff/loan/${this.state.data.id}`, { status: 5, real_amount: this.state.data.real_amount * 1000, desc: '' })
                  Toast.success('成功')
                  Portal.remove(key)
                  this.getData()
                } catch (error) {
                  Portal.remove(key)
                  Toast.fail(error.message)
                }
                this.loading = false
              }}>
                <Text style={styles.footerText}>同意</Text>
              </TouchableOpacity>
            </View>}
          </View>
        </ScrollView>
      </Provider>
    )
  }
}

const ProcessView = (props: any) => {
  return (
    <View style={styles.processView}>
      <View style={styles.stepView}>
        <ImageBackground source={Icons.Apply.CircleFill} style={styles.circleBg}>
          <Text>1</Text>
        </ImageBackground>
        <Text style={styles.step1Name}>{props.name}-发起申请</Text>
        <Text style={styles.step1Time}>{props.date ? formatDate(new Date(props.date)) : null}</Text>
      </View>
      <View style={styles.centerBar}></View>
      <View style={styles.stepView}>
        <ImageBackground source={Icons.Apply.CircleEmpty} style={styles.circleBg}>
          <Text>2</Text>
        </ImageBackground>
        <Text style={styles.step2Name}>{props.auditor_name}</Text>
        <Text style={styles.step2Time}>{props.status === 0 ? '待审批' : ''}</Text>
      </View>
    </View>
  )
}

const ApplyStatusView = (props: any) => {
  return (
    <View style={styles.applyStatusView}>
      <View style={styles.statusView}>
        <Text style={styles.applyText}>{props.name}提交的借款申请</Text>
        {props.status !== undefined ? <ImageBackground source={LOAN_STATUS_ICON_MAP[props.status]} style={styles.statusTag}>
          <Text style={styles.tagText}>{LOAN_STATUS_MAP[props.status]}</Text>
        </ImageBackground> : null}
      </View>
      <Text style={styles.applyDesText}>深圳富士康</Text>
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
    fontSize: ScreenUtil.scaleSize(10),
    marginTop: ScreenUtil.scaleSize(3),
  },
  step2Name: {
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(12)
  },
  step2Time: {
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(10),
    marginTop: ScreenUtil.scaleSize(5),
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
    marginRight: ScreenUtil.scaleSize(20),
  },
  footerBtn1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: ScreenUtil.scaleSize(37),
    borderRadius: ScreenUtil.scaleSize(20),
    backgroundColor: '#526CDD',
    marginRight: ScreenUtil.scaleSize(20),
  },
  footerBtn2: {
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
