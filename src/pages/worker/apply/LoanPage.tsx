import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  LogBox,
} from 'react-native'
// @ts-ignore
import { createForm } from 'rc-form'
import {InputItem, List, Picker, Portal, Provider, Toast} from '@ant-design/react-native'
import page from '../../../components/Page'
import Tabs from '../../../components/Tabs'
import { ListItem } from './component/LoanViewRecordPage'
import Api, { PageResult } from '../../../utils/Api'
import { BankList, LoanList_Staff } from '../../../@types/loan'
import ScreenUtils from '../../../utils/ScreenUtils'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import {NavigationProp} from "@react-navigation/native";

type Props = {
  navigation: NavigationProp<any>;
  form: any;
};
type ItemType = {
  title: string;
  dataIndex: string;
  required: boolean;
  right?: boolean | null;
  onPress?: any;
  rightText?: any;
  type?: string;
  placeholder?: string;
  render?: any;
  getFieldProps: any
}
const height = Dimensions.get('window').height
const width = Dimensions.get('window').width


type State = {
  tabKey: string;
  loan: LoanList_Staff[];
  modalVisible: boolean;
  bank: BankList[];
  bankId: any;
  loading: boolean,
  refreshing: boolean,
  loanType:any
  selectLoanType: any
  accountNumber: string
}

type SubmitValue = {
  amount: number;
  bankcard_id: number;
  desc: string;
}

const format = (array: any) => {
  if (typeof array !== 'object') {
    return [[]]
  }
  const arr = [...array.map((ite: BankList) => {
    return {
      label: ite.bank_account,
      value: ite.id,
    }
  })]
  return [arr]
}

@page()
class LoanPage extends Component<Props, State> {
  page = 1
  hasMore: boolean = true
  readonly state: State = {
    tabKey: '申请借款',
    loan: [],

    modalVisible: true,
    bank: [],
    bankId: '',
    refreshing: false,
    loading: false,
    loanType:[[{label:'银行卡',value: 0},{label:'支付宝',value: 1},{label:'现金',value: 2}]],
    selectLoanType: '',
    accountNumber: ''
  }

  componentDidMount() {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested'])
    this.getBankList()
  }

  fetchLoanList(flag = false) {
    if (this.state.loading || this.state.refreshing || (!flag && !this.hasMore)) return
    if (flag) {
      this.page = 1
      this.hasMore = true
      this.setState({ refreshing: true })
    }
    else this.setState({ loading: true })
    Api.get<PageResult<LoanList_Staff>>('/labor/my/loan/list/' + this.page, {
      params: { page: this.page, size: 10 }
    }).then((res) => {
      console.log('借款记录列表',res);
      let datas = this.state.loan
      if (this.page === 1) datas = res.list
      else datas = datas.concat(res.list)

      const hasMore = !(datas && datas.length >= res.count)
      this.page++
      this.hasMore = hasMore
      this.setState({ refreshing: false, loan: datas, loading: false })
    }).catch((error) => {
      console.log(' list error:', error)
      this.setState({ refreshing: false, loading: false })
    })
  }

  getBankList() {
    Api.get('/labor/my/bankcard/list')
      .then((res) => {
        this.setState({ bank: res as any })
      })
      .catch((e) => {
        console.log(e)
      })
  }

  // toSign() { this.props.navigation.navigation('') }
  toNextPage() {
    const key = Toast.loading('loading',0)
    const { form } = this.props
    const { bankId } = this.state
    const { selectLoanType } = this.state

    if (selectLoanType === '') {
      Portal.remove(key)
      Toast.info('请选择借款方式')
      return
    }

    if (selectLoanType[0] === 0 && bankId === '') {
      Portal.remove(key)
      Toast.info('请选择银行卡')
      return
    }

    if (selectLoanType[0] === 1 && this.state.accountNumber === '') {
      Portal.remove(key)
      Toast.info('请输入账号')
      return
    }

    form.validateFields((error: any, value: SubmitValue) => {
      if (!error) {
        const { amount, desc } = value
        const params = {
          amount: Number(amount) * 1000,
          desc,
          bankcard_id: bankId[0],
          type: selectLoanType[0],
          account_number: this.state.accountNumber
        }

        Api.post<any>('/labor/my/loan', params).then((res) => {
          Portal.remove(key)
          this.props.navigation.navigate('LoanDetail1',{id: res})
          Toast.success('申请成功！')
        })
        .catch((error: Error) => {
          if (error.message == '10010') Toast.fail('非在职人员无法借贷')
          else Toast.fail(error.message)
          Portal.remove(key)
        })

      } else {
        Toast.info('请输入必填信息')
        Portal.remove(key)
      }
    })
  }
  applyForJob() {
    this.setModalVisible(!this.state.modalVisible)
  }
  setModalVisible(visible: boolean) {
    this.setState({ modalVisible: visible })
  }
  BankPicker() {
    const { bankId, bank, selectLoanType } = this.state
    const bankList = bank && bank.length > 0 ? format(bank) : [[]]

    return (
      <View>
        <Picker data={this.state.loanType} title={'选择借款方式'} value={selectLoanType} cascade={false} cols={1} onOk={(selectLoanType) => {
          this.setState({ selectLoanType:selectLoanType,bankId: '',accountNumber: '' })
        }}>
          <List.Item arrow="horizontal">借款方式</List.Item>
        </Picker>
        {
          this.state.selectLoanType[0] === 0 ?
              <Picker data={bankList} title={'选择银行卡'} value={bankId} cascade={false} cols={1} onOk={(bankId) => { this.setState({ bankId }) }}>
                <List.Item arrow="horizontal">选择银行卡</List.Item>
              </Picker> :
              this.state.selectLoanType[0] === 1 ?
                  <InputItem placeholder={'请输入账号'} onChange={(res) => { this.setState({accountNumber: res}) }} /> : null
        }
      </View>
    )
  }
  renderPositionItem(item: any) {
    return (
      <View style={styles.positionItem}>
        <ListItem data={item.item} onPress={() => { this.props.navigation.navigate('LoanDetail', { id: item.item.id }) }} />
      </View>
    )
  }
  renderLoadMoreView() {
    if (this.state.loading) {
      return <View style={styles.loadMore}>
        <ActivityIndicator size={'large'} animating={true} />
        <Text>正在加载</Text>
      </View>
    }
    return null
  }
  handleScroll(event: any) {
    const offsetY = event.nativeEvent?.contentOffset?.y
    const contentHeight = event.nativeEvent?.contentSize?.height
    const height = event.nativeEvent?.layoutMeasurement?.height
    if (offsetY + height > contentHeight - 100 && contentHeight > height)this.fetchLoanList()
  }
  renderTab() {
    const { tabKey, loan } = this.state
    if (tabKey === '申请借款') {
      return (

        <View style={styles.applyView}>
          <TextItem getFieldProps={this.props.form.getFieldProps} title="申请金额（元）" type="number" dataIndex="amount" placeholder="请输入申请金额" required rightText="最多可借500元" />
          <TextItem getFieldProps={this.props.form.getFieldProps} title="借款方式" type="number" dataIndex="bankcard_id" required render={this.BankPicker.bind(this)} />
          <TextItem getFieldProps={this.props.form.getFieldProps} title="事由" dataIndex="desc" placeholder="请输入" required />
          <TouchableOpacity style={styles.subBtn} onPress={this.toNextPage.bind(this)}>
            <Text style={styles.subText}>提 交</Text>
          </TouchableOpacity>
        </View>
      )
    }
    else {
      return (
        <ScrollView
          scrollEventThrottle={200}
          onScroll={this.handleScroll.bind(this)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => { this.fetchLoanList(true) }}
            />
          }
        >
          {  (!this.state.refreshing && this.state.loan?.length === 0) ? <Text style={{
            textAlign: 'center', marginTop: 20
          }}>{'暂无数据'}</Text> : null}
          <FlatList
            data={loan}
            renderItem={(item) => this.renderPositionItem(item)}
            keyExtractor={(item: any, index: number) => item + index}
            ListFooterComponent={() => this.renderLoadMoreView()}
            // onEndReached={() => { this.fetchLoanList() }}
            // onEndReachedThreshold={0.5}
            style={{
              flex: 1, marginTop: ScreenUtils.scaleSize(15), zIndex: 2,
            }}
          />
        </ScrollView >


      )
    }
  }

  render() {
    const { tabKey } = this.state
    return (
      <Provider>
        <View style={styles.background}>
          <Tabs
            data={['申请借款', '查看记录']}
            value={tabKey}
            onChange={(val: string) => {
              this.setState({ tabKey: val })
              if (val === '查看记录' && this.state.loan.length === 0) this.fetchLoanList(true)
            }}
          />
          {this.renderTab()}
        </View>
      </Provider>

    )
  }
}
const TextItem = (props: ItemType) => {
  const { title, type, placeholder, dataIndex, required = false, right = false, rightText, render, getFieldProps } = props
  // const { getFieldProps } = this.props.form
  return (
    <ScrollView style={styles.textItemView}>
      <View style={styles.flexRowAlignCenter}>
        <Text style={styles.titleStyle}>{title}</Text>
        {required && <Text style={styles.redPoint}>*</Text>}
        <View style={{ flex: 1 }}></View>
        {(right || rightText) && <Text style={styles.rightText}>{rightText}</Text>}
      </View>
      <View style={styles.placeholderView}>
        {render ? render() : <InputItem placeholder={placeholder} type={type} {...getFieldProps(dataIndex, { rules: [{ required }], })} />}
      </View>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
    zIndex: 0,
    backgroundColor: '#fff',
  },
  applyView: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: ScreenUtils.scaleSize(10),
  },
  textItemView: {
    paddingVertical: ScreenUtils.scaleSize(10),
    paddingHorizontal: ScreenUtils.scaleSize(15),
  },
  flexRowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleStyle: {
    fontSize: ScreenUtils.scaleSize(14),
    fontWeight: 'bold',
  },
  redPoint: {
    color: '#FF5B53',
    fontSize: ScreenUtils.scaleSize(16),
    marginLeft: 5
  },
  placeholderView: {
    paddingTop: ScreenUtils.scaleSize(10),
    marginLeft: -ScreenUtils.scaleSize(13),
  },
  placeholderStyle: {
    color: '#A8A8AC',
    fontSize: ScreenUtils.scaleSize(12),
  },
  icon: {
    width: ScreenUtils.scaleSize(14),
    height: ScreenUtils.scaleSize(14),
  },
  rightText: {
    color: '#FE9B16',
    fontSize: ScreenUtils.scaleSize(12)
  },
  subBtn: {
    backgroundColor: '#526CDD',
    width: ScreenUtils.scaleSize(300),
    height: ScreenUtils.scaleSize(40),
    marginHorizontal: ScreenUtils.scaleSize(40),
    marginTop: ScreenUtils.scaleSize(120),
    marginBottom: ScreenUtils.scaleSize(15),
    alignItems: 'center',
    justifyContent: 'center',
    padding: ScreenUtils.scaleSize(12),
    borderRadius: ScreenUtils.scaleSize(20),
  },
  subText: {
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(15)
  },

  successImg: {
    width: ScreenUtils.scaleSize(175),
    height: ScreenUtils.scaleSize(190),
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: '#526CDD',
    borderRadius: 20,
    elevation: 2,
    width: ScreenUtils.scaleSize(250),
    height: ScreenUtils.scaleSize(39),
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: ScreenUtils.scaleSize(15),
    lineHeight: ScreenUtils.scaleSize(39),
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: ScreenUtils.scaleSize(17),
    fontWeight: 'bold',
  },
  date: {
    color: '#030014',
    fontSize: ScreenUtils.scaleSize(14)
  },
  downIcon: {
    width: ScreenUtils.scaleSize(7),
    height: ScreenUtils.scaleSize(4.5),
    marginLeft: ScreenUtils.scaleSize(10)
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadMore: {
    alignItems: 'center'
  },
  positionItem: {
    marginBottom: ScreenUtils.scaleSize(15),
    backgroundColor: '#fff',
    paddingHorizontal: ScreenUtils.scaleSize(15)
  },
  box: {
    flex: 1,
    minHeight: height,
    display: 'flex',
    position: 'relative',
    backgroundColor: '#FFF',
  },
})


export default createForm<Props>()(LoanPage)