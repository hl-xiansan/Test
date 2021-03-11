import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import React, { Component, Fragment, useEffect, useRef, useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Text, TouchableOpacity, RefreshControl, ActivityIndicator, LogBox
} from 'react-native'
import ScreenUtils from '../../../../utils/ScreenUtils'
import Page from '../../../../components/Page'
import Tabs from '../../../../components/Tabs'
import StaffManagementItem from '../components/StaffManagementItem'
import LoanItem from '../components/LoanItem'
import LoanFilter from './LoanFilter'
import { Provider, Toast } from '@ant-design/react-native'
import Api from '../../../../utils/Api'
import { FlatList } from 'react-native-gesture-handler'

type Props = {
  navigation: BottomTabNavigationProp<any>
}

type State = {
  tabKey: string,
}

// @Page({
//   navigation: {
//     title: 'LoanManagement'
//   }
// })
const NAV_ARR = ['待处理', '已处理']
export default function LoanManagement({ navigation }: any) {

  const [state, setState] = useState({
    tabKey: 0
  })
  // const [date, setDate] = useState(`2021-${new Date().getMonth() + 1}`)
  // const [company, setCompany] = useState(0)
  const [unCommentRefreshing, setUnCommentRefreshing] = useState(false)
  const [unCommentLoading, setUnCommentLoading] = useState(false)
  const [commentRefreshing, setCommentRefreshing] = useState(false)
  const [commentLoading, setCommentLoading] = useState(false)

  const [unCommentList, setUnCommentList] = useState<any[]>([])
  const [commentList, setCommentList] = useState<any[]>([])


  const commentPage = useRef(1)
  const dateRef = useRef(`2021-${new Date().getMonth() + 1}`)
  const companyRef = useRef(0)
  const unCommentPage = useRef(1)
  const commentHasMore = useRef(true)
  const unCommentHasMore = useRef(true)

  const batchProcess = () => {
    navigation.navigate('OneClickProcess', { list: unCommentList, goBack: () => { fetchUnCommentList(true) }})
  }

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested'])
    setTimeout(() => {
      fetchUnCommentList(true)
    }, 100)
  }, [])

  const renderBottom = () => {
    return <View style={styles.bottomBtns}>
      <TouchableOpacity style={styles.btn} activeOpacity={0.5} onPress={batchProcess}>
        <Text style={styles.btnText}>一键处理</Text>
      </TouchableOpacity>
    </View>
  }
  const fetchUnCommentList = async (flag = false) => {
    if (unCommentLoading || unCommentRefreshing || (!flag && !unCommentHasMore.current)) return
    if (flag) {
      unCommentPage.current = 1
      unCommentHasMore.current = true
      setUnCommentRefreshing(true)
    }
    else setUnCommentLoading(true)
    const page = unCommentPage.current
    try {
      const res: any = await Api.get('/labor/staff/loan/list/' + page, { params: { page, size: 10, handle: 0, } })
      let datas = commentList
      if (unCommentPage.current == 1) datas = res.list
      else datas = datas.concat(res.list)

      unCommentHasMore.current = !(datas && datas.length >= res.count)
      unCommentPage.current += 1
      setUnCommentLoading(false)
      setUnCommentRefreshing(false)
      // setUnCommentList(datas)
      setUnCommentList(datas)
    } catch (error) {
      Toast.fail(error.message)
      setUnCommentLoading(false)
      setUnCommentRefreshing(false)
    }
    // TODO 测试数据

    // const datas = [
    //   {
    //     id: '321312',
    //     loan_no: '312321',
    //     customer_id: '312321',
    //     customer_name: '企业名',
    //     employee_id: 321321,
    //     employee_name: '雇员名',
    //     employee_status:1,
    //     amount: 1,
    //     real_amount: 1,
    //     audit_batch_no: '321321',
    //     auditor_id: 'dsadas',
    //     auditor_desc: 'dadas',
    //     loan_batch_no: '3212',
    //     payment_id: 'dasds',
    //     repay_batch_no: 'dasds',
    //     clear_id: 'dsada',
    //     desc: 'dasdasdas',
    //     bankcard: {
    //       id: 'dsada',
    //       card_owner: 'dsadas',
    //       bank_name: 'dsadas',
    //       bank_account: 'dsadas',
    //       location: 'dsadas',
    //     },
    //     status: 15,
    //     creator: '31221312',
    //     create_time: '2020-08-18T16:00:00.000Z',
    //     modifier: 'dasdas',
    //     modify_time: 'dasdas',
    //   },
    //   {
    //     id: '321312',
    //     loan_no: '312321',
    //     customer_id: '312321',
    //     customer_name: '企业名',
    //     employee_id: 321321,
    //     employee_name: '雇员名',
    //     employee_status:1,
    //     amount: 100,
    //     real_amount: 1,
    //     audit_batch_no: '321321',
    //     auditor_id: 'dsadas',
    //     auditor_desc: 'dadas',
    //     loan_batch_no: '3212',
    //     payment_id: 'dasds',
    //     repay_batch_no: 'dasds',
    //     clear_id: 'dsada',
    //     desc: 'dasdasdas',
    //     bankcard: {
    //       id: 'dsada',
    //       card_owner: 'dsadas',
    //       bank_name: 'dsadas',
    //       bank_account: 'dsadas',
    //       location: 'dsadas',
    //     },
    //     status: 16,
    //     creator: '31221312',
    //     create_time: '2020-08-18T16:00:00.000Z',
    //     modifier: 'dasdas',
    //     modify_time: 'dasdas',
    //   },
    //   {
    //     id: '321312',
    //     loan_no: '312321',
    //     customer_id: '31232ds1',
    //     customer_name: '企业名2',
    //     employee_id: 321321,
    //     employee_name: '雇员名',
    //     employee_status:1,
    //     amount: 1,
    //     real_amount: 1,
    //     audit_batch_no: '321321',
    //     auditor_id: 'dsadas',
    //     auditor_desc: 'dadas',
    //     loan_batch_no: '3212',
    //     payment_id: 'dasds',
    //     repay_batch_no: 'dasds',
    //     clear_id: 'dsada',
    //     desc: 'dasdasdas',
    //     bankcard: {
    //       id: 'dsada',
    //       card_owner: 'dsadas',
    //       bank_name: 'dsadas',
    //       bank_account: 'dsadas',
    //       location: 'dsadas',
    //     },
    //     status: 20,
    //     creator: '31221312',
    //     create_time: '2020-08-18T16:00:00.000Z',
    //     modifier: 'dasdas',
    //     modify_time: 'dasdas',
    //   }
    // ]
    // setCommentList(datas)
  }
  const fetchCommentList = async (flag = false) => {
    if (commentLoading || commentRefreshing || (!flag && !commentHasMore.current)) return
    if (flag) {
      commentPage.current = 1
      commentHasMore.current = true
      setCommentRefreshing(true)
    }
    else setCommentLoading(true)
    const page = commentPage.current
    try {
      const params: any = { page, size: 10, handle: 1, month: dateRef.current }
      if (companyRef.current !== 0) params.customer_id = companyRef.current
      const res: any = await Api.get('/labor/staff/loan/list/' + page, { params })
      let datas = commentList
      if (commentPage.current == 1) datas = res.list
      else datas = datas.concat(res.list)

      commentHasMore.current = !(datas && datas.length >= res.count)
      commentPage.current += 1
      setCommentLoading(false)
      setCommentRefreshing(false)
      setCommentList(datas)
      
    } catch (error) {
      Toast.fail(error.message)
      setCommentLoading(false)
      setCommentRefreshing(false)
    }
    // TODO 测试数据
    // const datas = [
    //   {
    //     id: '321312',
    //     loan_no: '312321',
    //     customer_id: '312321',
    //     customer_name: '企业名',
    //     employee_id: 321321,
    //     employee_name: '雇员名',
    //     employee_status:1,
    //     amount: 1,
    //     real_amount: 1,
    //     audit_batch_no: '321321',
    //     auditor_id: 'dsadas',
    //     auditor_desc: 'dadas',
    //     loan_batch_no: '3212',
    //     payment_id: 'dasds',
    //     repay_batch_no: 'dasds',
    //     clear_id: 'dsada',
    //     desc: 'dasdasdas',
    //     bankcard: {
    //       id: 'dsada',
    //       card_owner: 'dsadas',
    //       bank_name: 'dsadas',
    //       bank_account: 'dsadas',
    //       location: 'dsadas',
    //     },
    //     status: 15,
    //     creator: '31221312',
    //     create_time: '2020-08-18T16:00:00.000Z',
    //     modifier: 'dasdas',
    //     modify_time: 'dasdas',
    //   },
    //   {
    //     id: '321312',
    //     loan_no: '312321',
    //     customer_id: '312321',
    //     customer_name: '企业名',
    //     employee_id: 321321,
    //     employee_name: '雇员名',
    //     employee_status:1,
    //     amount: 100,
    //     real_amount: 1,
    //     audit_batch_no: '321321',
    //     auditor_id: 'dsadas',
    //     auditor_desc: 'dadas',
    //     loan_batch_no: '3212',
    //     payment_id: 'dasds',
    //     repay_batch_no: 'dasds',
    //     clear_id: 'dsada',
    //     desc: 'dasdasdas',
    //     bankcard: {
    //       id: 'dsada',
    //       card_owner: 'dsadas',
    //       bank_name: 'dsadas',
    //       bank_account: 'dsadas',
    //       location: 'dsadas',
    //     },
    //     status: 16,
    //     creator: '31221312',
    //     create_time: '2020-08-18T16:00:00.000Z',
    //     modifier: 'dasdas',
    //     modify_time: 'dasdas',
    //   },
    //   {
    //     id: '321312',
    //     loan_no: '312321',
    //     customer_id: '31232ds1',
    //     customer_name: '企业名2',
    //     employee_id: 321321,
    //     employee_name: '雇员名',
    //     employee_status:1,
    //     amount: 1,
    //     real_amount: 1,
    //     audit_batch_no: '321321',
    //     auditor_id: 'dsadas',
    //     auditor_desc: 'dadas',
    //     loan_batch_no: '3212',
    //     payment_id: 'dasds',
    //     repay_batch_no: 'dasds',
    //     clear_id: 'dsada',
    //     desc: 'dasdasdas',
    //     bankcard: {
    //       id: 'dsada',
    //       card_owner: 'dsadas',
    //       bank_name: 'dsadas',
    //       bank_account: 'dsadas',
    //       location: 'dsadas',
    //     },
    //     status: 20,
    //     creator: '31221312',
    //     create_time: '2020-08-18T16:00:00.000Z',
    //     modifier: 'dasdas',
    //     modify_time: 'dasdas',
    //   }
    // ]
    // setCommentList(datas)
  }
  const unCommentHandleScroll = (event: any) => {
    const offsetY = event.nativeEvent?.contentOffset?.y
    const contentHeight = event.nativeEvent?.contentSize?.height
    const height = event.nativeEvent?.layoutMeasurement?.height
    if (offsetY + height > contentHeight - 100 && contentHeight > height) fetchUnCommentList()
  }
  const commentHandleScroll = (event: any) => {
    const offsetY = event.nativeEvent?.contentOffset?.y
    const contentHeight = event.nativeEvent?.contentSize?.height
    const height = event.nativeEvent?.layoutMeasurement?.height
    if (offsetY + height > contentHeight - 100 && contentHeight > height) fetchCommentList()
  }
  const renderLoadMoreView = () => {
    if (unCommentLoading || commentLoading) {
      return (
        <View style={{ alignItems: 'center' }}>
          <ActivityIndicator size={'large'} animating={true} />
          <Text>正在加载</Text>
        </View>
      )
    }

    return null
  }
  const renderMain = () => {
    if (state.tabKey === 0) {
      return (
        <ScrollView
          scrollEventThrottle={200}
          style={{ paddingHorizontal: ScreenUtils.scaleSize(15) }}
          onScroll={unCommentHandleScroll}
          refreshControl={<RefreshControl refreshing={unCommentRefreshing} onRefresh={() => { fetchUnCommentList(true) }} />}>
          { !unCommentRefreshing && unCommentList?.length === 0 ? <Text style={{ textAlign: 'center', marginTop: 20 }}>{'暂无数据'}</Text> : null}
          <FlatList
            data={unCommentList}
            renderItem={(item) => <View style={styles.positionItem}>
              <LoanItem status={0} item={item.item} onPress={() => { navigation.navigate('ModifyLoanAmount', { id: item.item.id, goBack: () => { fetchUnCommentList(true) } }) }} />
            </View>}
            keyExtractor={(item: any, index: number) => item + index}
            ListFooterComponent={() => renderLoadMoreView()}
            style={{ flex: 1, marginTop: ScreenUtils.scaleSize(15) }}
          />
        </ScrollView >
      )
    }
    else {
      return (
        <ScrollView
          scrollEventThrottle={200}
          style={{ paddingHorizontal: ScreenUtils.scaleSize(15) }}
          onScroll={commentHandleScroll}
          refreshControl={<RefreshControl refreshing={commentRefreshing} onRefresh={() => { fetchCommentList(true) }} />} >
          { (!commentRefreshing && commentList?.length === 0) ? <Text style={{ textAlign: 'center', marginTop: 20 }}>{'暂无数据'}</Text> : null}
          <FlatList
            data={commentList}
            renderItem={(item) => <LoanItem item={item.item} status={1}  />}
            keyExtractor={(item: any, index: number) => item + index}
            ListFooterComponent={() => renderLoadMoreView()}
            style={{ flex: 1, marginTop: ScreenUtils.scaleSize(15) }}
          />
        </ScrollView >
      )
    }
  }
  const extraBoxStyle = state.tabKey === 0 ? { paddingBottom: ScreenUtils.scaleSize(59) } : {}
  return (
    <Provider>
      <View style={styles.box}>
        <View style={{ ...styles.content, ...extraBoxStyle }}>
          <Tabs data={NAV_ARR} value={NAV_ARR[state.tabKey]} onChange={(val: string) => {
            const tabKey = val === NAV_ARR[0] ? 0 : 1
            setState({ tabKey: tabKey })
            if (tabKey === 0 && unCommentList.length === 0) fetchUnCommentList(true)
            if (tabKey === 1 && commentList.length === 0) fetchCommentList(true)
          }} />
          {state.tabKey === 1 && (<LoanFilter onChange={(date, id) => {
            // console.log(date, id)
            // setDate(date)
            // setCompany(id)
            dateRef.current = date
            companyRef.current = id
            fetchCommentList(true)
          }} />)}
          {renderMain()}
          {/* <ScrollView>
            <View style={{ paddingTop: ScreenUtils.scaleSize(15) }}>
              {
                state.tabKey === 1 ? [1, 2].map((item) => (
                  <View key={item} style={styles.positionItem}>
                    <LoanItem onPress={() => {
                      navigation.navigate('ModifyLoanAmount')
                    }} />
                  </View>
                )) : <Fragment>
                  <View style={styles.positionItem}>
                    <LoanItem status={1} />
                  </View>
                  <View style={styles.positionItem}>
                    <LoanItem status={2} />
                  </View>
                  <View style={styles.positionItem}>
                    <LoanItem status={3} />
                  </View>
                </Fragment>
              }
            </View>
          </ScrollView> */}
          {state.tabKey === 0 && unCommentList.length > 0 && renderBottom()}
        </View>
      </View>
    </Provider>
  )
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
  headerTitle: {
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(18),
    fontWeight: 'bold',
    flex: 1
  },
  searchView: {
    paddingHorizontal: ScreenUtils.scaleSize(15),
    backgroundColor: 'rgba(82, 108, 221, 1)',
    paddingBottom: ScreenUtils.scaleSize(15)
  },
  positionItem: {
    marginBottom: ScreenUtils.scaleSize(15),
    paddingHorizontal: ScreenUtils.scaleSize(15)
  },
  bottomBtns: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: ScreenUtils.scaleSize(59),
    // backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  btn: {
    width: ScreenUtils.scaleSize(325),
    height: ScreenUtils.scaleSize(39),
    lineHeight: ScreenUtils.scaleSize(39),
    backgroundColor: '#526CDD',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: 'rgb(0, 0, 0)',
    borderRadius: ScreenUtils.scaleSize(20),
  },
  btnText: {
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(16),
  }
})
