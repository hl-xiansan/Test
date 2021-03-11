import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  ImageBackground,
  TouchableOpacity,
  Button
} from 'react-native'
import ScreenUtil from '../../../utils/ScreenUtils'
import page from '../../../components/Page'
import Icons from '../../../Icons'
import { Portal, Provider, Toast } from '@ant-design/react-native'
import Api from '../../../utils/Api'
import { getDateString } from '../jobs/ResumeInfoPage'

type Props = {
  navigation: any;
  route: any
};
type ItemType = {
  title: string | null;
  value: string;
};
const height = Dimensions.get('window').height
const width = Dimensions.get('window').width
interface State {
  data: any
}
@page({
  navigation: {
    headerShown: false
  }
})
export default class LoanDetailPage extends Component<Props, State> {
  isUnmount = false
  loading = false
  readonly state: State = {
    data: null
  }
  toSign = () => {
    this.props.navigation.navigation('')
  }
  componentDidMount() {
    this.getData()
  }
  componentWillUnmount() {
    this.isUnmount = true
  }
  async getData() {
    if (this.loading) return
    const key = Toast.loading('loading')
    this.loading = true
    const id = this.props.route.params.id
    try {
      const res: any = await Api.get(`/labor/my/loan/${id}`)
      if (this.isUnmount) return
      if (res) {
        console.log(res)
        const data = {
          loan_no: res.loan_no,
          employee_name: res.employee_name,
          customer_name: res.customer_name,
          bank_account: res.bankcard?.bank_account,
          desc: res.bankcard?.desc,
          amount: res.amount / 1000,
          modifier: res.modifier,
          status: res.status,
          auditor_id: res.auditor_id,
          create_time: res.create_time,
          real_amount: res.real_amount / 1000,
          user: res.user,
          auditor_time: res.auditor_time
        }
        this.setState({ data })
      }
    }
    catch (error) { Toast.fail(error.message) }
    this.loading = false
    Portal.remove(key)
  }
  async setController(reject = false) {
    if (this.loading) return
    const key = Toast.loading('loading')
    this.loading = true
    const id = this.props.route.params.id
    try {
      await Api.put(`/labor/my/loan/${id}/status`, { status: reject ? 11 : 10 })
      if (this.isUnmount) return
      this.loading = false
      Portal.remove(key)
      this.getData()
    }
    catch (error) {
      Toast.fail('操作失败，请稍后再试') }
    this.loading = false
    Portal.remove(key)
  }

  render() {
    const { data } = this.state
    console.log(data)
    return (
      <Provider>
        {
          data ? <View style={styles.background}>
            <ImageBackground source={require('../../../assets/icons/apply/rectangle.png')} style={styles.topBg}>
              <View style={styles.processView}>
                <View style={styles.stepView}>
                  <ImageBackground source={Icons.Apply.CircleFill} style={styles.circleBg}>
                    <Text>1</Text>
                  </ImageBackground>
                  <Text style={styles.step1Name}>{data?.employee_name + '-发起申请'}</Text>
                  <Text style={styles.step1Time}>{getDateString(new Date(data?.create_time))}</Text>
                </View>
                <View style={styles.centerBar}></View>
                <View style={styles.stepView}>
                  <ImageBackground source={Icons.Apply.CircleEmpty} style={styles.circleBg}>
                    <Text>2</Text>
                  </ImageBackground>
                  <Text style={styles.step2Name}>{data?.user?.nickname}</Text>
                  <Text style={styles.step2Time}>{getDateString(new Date(data?.auditor_time))}</Text>
                </View>
              </View>
              <View style={styles.applyStatusView}>
                <View style={styles.statusView}>
                  <Text style={styles.applyText}>{data?.employee_name}提交的签约申请</Text>
                  <ImageBackground source={Icons.Apply.RoundRectangle} style={styles.statusTag}>
                    <Text style={styles.tagText}>
                      {
                        data.status===0?'待审核' :(data.status===5?'同意借款': (data.status===6?'不同意借款': (data.status===7?'金额已修改':
                          (data.status===10?'同意修改': (data.status===11?'不同意修改': (data.status===15?'待还款':
                            (data.status===16?'拒绝转账':  (data.status===20?'已还款':''))))))))
                      }
                    </Text>
                  </ImageBackground>
                </View>
                <Text style={styles.applyDesText}>{data?.customer_name}</Text>
              </View>
            </ImageBackground>
            <View style={styles.applyInfoView}>
              <TextItem title="审批编号" value={data?.loan_no} />
              <TextItem title="申请人" value={data?.employee_name} />
              <TextItem title="所在单位" value={data?.customer_name} />
              {
                data?.type === 0 ? (<TextItem title="银行卡号" value={data?.bankcard?.bank_account} /> ):
                  (data?.type === 1 ? <TextItem title="支付宝帐号" value={data?.account_number} /> : null)
              }
              <TextItem title="申请金额" value={data?.amount} />
              <TextItem title="实际金额" value={data?.real_amount} />
              <TextItem title="事由" value={data?.desc} />
            </View>
            <View style={{ flex: 1 }}></View>
            {
              (data?.real_amount !== data?.amount&&data?.status===7) ? <View style={styles.footerView}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.loanAmountText}>借款金额：{data?.real_amount}元</Text>
                  <Text style={styles.loanInfoText}>{data?.modifier}更改了借款金额</Text>
                </View>
                <View style={styles.footerBtnView}>
                  <TouchableOpacity style={styles.footerBtn} onPress={() => { this.setController(true) }}>
                    <Text style={styles.footerText}>拒绝</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.footerBtn1} onPress={() => { this.setController() }}>
                    <Text style={styles.footerText}>同意</Text>
                  </TouchableOpacity>
                </View>
              </View> : null
            }
          </View> : null
        }
      </Provider>
    )
  }
}


const TextItem = (props: ItemType) => {
  const { title = '', value = '' } = props
  return (
    <View style={styles.textItemView}>
      <Text style={styles.nameStyle}>{title}</Text>
      <Text style={styles.valueStyle}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
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
    width: ScreenUtil.scaleSize(70),
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
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: ScreenUtil.scaleSize(12),
    paddingHorizontal: ScreenUtil.scaleSize(14),
  },
  loanAmountText: {
    color: '#030014',
    fontSize: ScreenUtil.scaleSize(14),
    fontWeight: 'bold',
    marginBottom: ScreenUtil.scaleSize(3)
  },
  loanInfoText: {
    color: '#545468',
    fontSize: ScreenUtil.scaleSize(12)
  },
  footerBtnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: ScreenUtil.scaleSize(70),
    height: ScreenUtil.scaleSize(37),
    borderRadius: ScreenUtil.scaleSize(20),
    backgroundColor: '#FE9B16',
    marginRight: ScreenUtil.scaleSize(10)
  },
  footerBtn1: {
    alignItems: 'center',
    justifyContent: 'center',
    width: ScreenUtil.scaleSize(70),
    height: ScreenUtil.scaleSize(37),
    borderRadius: ScreenUtil.scaleSize(20),
    backgroundColor: '#526CDD',
  },
  footerText: {
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(15)
  }


})
