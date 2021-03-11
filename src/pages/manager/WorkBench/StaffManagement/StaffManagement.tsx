import React from 'react'
import {RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import ScreenUtils from '../../../../utils/ScreenUtils'
import Tabs from '../../../../components/Tabs'
import StaffManagementItem from '../components/StaffManagementItem'
import Api from '../../../../utils/Api'
import {Toast} from '@ant-design/react-native'
import {FlatList} from 'react-native-gesture-handler'
import customerFilter from '../../../../utils/customerFilter'
import {NavigationProp} from "@react-navigation/native";

const TESTDATA: any[] = [
  {
    'address': null,
    'authentication': null,
    'autograph': null,
    'birth': '2012-12-11',
    'create_id': '133867977014514903',
    'create_time': '2021-01-04T01:43:39.000Z',
    'creator': null,
    'customer_name': '浩廷电器（珠海）有限公司',
    'desc': null,
    'education_id': null,
    'educations': null,
    'email': null,
    'entry_date': '2021-01-07T09:14:31.000Z',
    'familys': null,
    'gender': 0,
    'id': '133867977060652248',
    'id_no': null,
    'ids': null,
    'modifier': null,
    'modify_id': null,
    'modify_time': '2021-01-04T01:43:39.000Z',
    'name': '用户03917524',
    'native_place_id': null,
    'operating_time': null,
    'operator': null,
    'phone': '13192205858',
    'photo': null,
    'position': '普工',
    'qq': null,
    'quit_date': null,
    'referrer_id': null,
    'social_securitys': null,
    'status': 0,
    'telephone': null,
    'type': 2,
    'urgent_addr': null,
    'urgent_name': null,
    'urgent_phone': null,
    'user_id': '133867977014514903',
    'working_date': null,
    'working_unit': '137507734223328592',
    'workings': null,
    'wx_number': null,
    'wx_qrcode': null
  },
  {
    'address': null,
    'authentication': null,
    'autograph': null,
    'birth': null,
    'create_id': '133862262212400341',
    'create_time': '2021-01-04T01:20:57.000Z',
    'creator': null,
    'customer_name': '浩廷电器（珠海）有限公司',
    'desc': null,
    'education_id': null,
    'educations': null,
    'email': null,
    'entry_date': '2021-01-20T02:54:10.000Z',
    'familys': null,
    'gender': 1,
    'id': '133862262438892758',
    'id_no': null,
    'ids': null,
    'modifier': null,
    'modify_id': null,
    'modify_time': '2021-01-04T01:20:57.000Z',
    'name': '用户69839140',
    'native_place_id': null,
    'operating_time': null,
    'operator': null,
    'phone': '18373016845',
    'photo': null,
    'position': '张三',
    'qq': null,
    'quit_date': null,
    'referrer_id': null,
    'social_securitys': null,
    'status': 1,
    'telephone': null,
    'type': 2,
    'urgent_addr': null,
    'urgent_name': null,
    'urgent_phone': null,
    'user_id': '133862262212400341',
    'working_date': null,
    'working_unit': '137507734223328592',
    'workings': null,
    'wx_number': null,
    'wx_qrcode': null
  },
  {
    'address': null,
    'authentication': null,
    'autograph': null,
    'birth': null,
    'create_id': '133862262212400341',
    'create_time': '2021-01-04T01:20:57.000Z',
    'creator': null,
    'customer_name': '浩廷电器（珠海）有限公司',
    'desc': null,
    'education_id': null,
    'educations': null,
    'email': null,
    'entry_date': '2021-01-20T02:54:10.000Z',
    'familys': null,
    'gender': 2,
    'id': '133862262438892758',
    'id_no': null,
    'ids': null,
    'modifier': null,
    'modify_id': null,
    'modify_time': '2021-01-04T01:20:57.000Z',
    'name': '用户69839140',
    'native_place_id': null,
    'operating_time': null,
    'operator': null,
    'phone': '18373016845',
    'photo': null,
    'position': '张三',
    'qq': null,
    'quit_date': null,
    'referrer_id': null,
    'social_securitys': null,
    'status': 2,
    'telephone': null,
    'type': 2,
    'urgent_addr': null,
    'urgent_name': null,
    'urgent_phone': null,
    'user_id': '133862262212400341',
    'working_date': null,
    'working_unit': '137507734223328592',
    'workings': null,
    'wx_number': null,
    'wx_qrcode': null
  },
  {
    'address': null,
    'authentication': null,
    'autograph': null,
    'birth': null,
    'create_id': '133862262212400341',
    'create_time': '2021-01-04T01:20:57.000Z',
    'creator': null,
    'customer_name': '浩廷电器（珠海）有限公司',
    'desc': null,
    'education_id': null,
    'educations': null,
    'email': null,
    'entry_date': '2021-01-20T02:54:10.000Z',
    'familys': null,
    'gender': 1,
    'id': '133862262438892758',
    'id_no': null,
    'ids': null,
    'modifier': null,
    'modify_id': null,
    'modify_time': '2021-01-04T01:20:57.000Z',
    'name': '用户69839140',
    'native_place_id': null,
    'operating_time': null,
    'operator': null,
    'phone': '18373016845',
    'photo': null,
    'position': '张三',
    'qq': null,
    'quit_date': null,
    'referrer_id': null,
    'social_securitys': null,
    'status': 3,
    'telephone': null,
    'type': 2,
    'urgent_addr': null,
    'urgent_name': null,
    'urgent_phone': null,
    'user_id': '133862262212400341',
    'working_date': null,
    'working_unit': '137507734223328592',
    'workings': null,
    'wx_number': null,
    'wx_qrcode': null
  }
]
type Props = {
  navigation: NavigationProp<any>;
  customerFilter: any;
}

type State = {
  tabKey: string,
  page: number,
  workerList: any[],
  workerCount: number,
  size: number,
}

const NAV = ['全部', '待处理', '在职', '离职', '黑名单'] // '' 0 1 3 2
const useListView = (url: string, tabKey: string, props: any, status = -1): any => {
  const hasMore = React.useRef(true)
  const page = React.useRef(1)
  const id = React.useRef<any>(null)
  const [refreshing, setRefreshing] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [list, setList] = React.useState<any[]>([])
  React.useEffect(() => {
    customerFilter.selectID = null
    customerFilter.name = 'StaffManagement'
    customerFilter.callBack.push(() => {
      id.current = customerFilter.selectID
      fetchtList(true)
    })
    return () => {
      customerFilter.selectID = null
      customerFilter.name = null
      customerFilter.callBack = []
    }
  }, [])
  const fetchtList = async (flag = false) => {
    if (refreshing || loading || (!flag && !hasMore.current)) return
    if (flag) {
      page.current = 1
      hasMore.current = true
      setRefreshing(true)
    } else setLoading(true)
    try {
      const params: any = {page: page.current, size: 10}
      if (status > -1) params.status = status
      if (id.current) params.working_unit = id.current
      const res: any = await Api.get(url + page.current, {params})
      let datas = list
      if (page.current == 1) datas = res.list
      else datas = datas.concat(res.list)

      hasMore.current = !(datas && datas.length >= res.count)
      page.current += 1
      setLoading(false)
      setRefreshing(false)
      setList(datas)
    } catch (error) {
      Toast.fail(error.message)
      setLoading(false)
      setRefreshing(false)
    }
  }
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent?.contentOffset?.y
    const contentHeight = event.nativeEvent?.contentSize?.height
    const height = event.nativeEvent?.layoutMeasurement?.height
    if (offsetY + height > contentHeight - 100 && contentHeight > height) fetchtList()
  }
  const mainRender = React.useMemo(() => {
    return (
      <ScrollView
        scrollEventThrottle={200}
        onScroll={handleScroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {
          fetchtList(true)
        }}/>}>
        {(!refreshing && list?.length === 0) ?
          <Text style={{
            textAlign: 'center', marginTop: 20
          }}>{'暂无数据'}</Text> : null}
        <FlatList
          data={list}
          renderItem={(item: any) => <View key={String(item.item.user_id)} style={styles.positionItem}>
            <StaffManagementItem
              tabKey={tabKey}
              data={item.item}
              onPress={() => {
                props.navigation.navigate('EmployeeInfo', {id: item.item.id,isManager: 1})
              }}
            />
          </View>}
          keyExtractor={(item: any, index: number) => item + index}
          style={{paddingTop: ScreenUtils.scaleSize(15)}}
        />
      </ScrollView>
    )
  }, [list, refreshing, loading])
  return [list, fetchtList, mainRender]
}
const StaffManagementFc = (props: any) => {
  const [tabKey, setTabKey] = React.useState(0)
  const [list, fetchtList, render1] = useListView('/labor/staff/worker/list/', NAV[0], props)  // 全部
  const [list2, fetchtList2, render2] = useListView('/labor/staff/worker/list/', NAV[1], props, 0) //待处理
  const [list3, fetchtList3, render3] = useListView('/labor/staff/worker/list/', NAV[2], props, 1) //在职
  const [list4, fetchtList4, render4] = useListView('/labor/staff/worker/list/', NAV[3], props, 3) //离职
  const [list5, fetchtList5, render5] = useListView('/labor/staff/worker/list/', NAV[4], props, 2) //黑名单
  const extraBoxStyle = tabKey === 1 ? {paddingBottom: ScreenUtils.scaleSize(59)} : {}

  React.useEffect(() => {
    fetchtList(true)
  }, [])
  const renderBottom = React.useMemo(() => {
    if (tabKey === 1) {
      return <View style={styles.bottomBtns}>
        <TouchableOpacity activeOpacity={0.5} onPress={() => {
          const ids = list2.map((item: any) => item.id)
          console.log(ids)
          props.navigation.navigate('ConfirmBatchProcess', { ids, goBack: () => { fetchtList2(true) } })
        }}>
          <Text style={styles.btn}>批量处理</Text>
        </TouchableOpacity>
      </View>
    }
    return null
  }, [tabKey, list2])
  const render = () => {
    if (tabKey === 0) return render1
    else if (tabKey === 1) return render2
    else if (tabKey === 2) return render3
    else if (tabKey === 3) return render4
    else if (tabKey === 4) return render5
  }
  return (
    <View style={styles.box}>
      <View style={{
        ...styles.content, ...extraBoxStyle
      }}>
        <Tabs
          data={NAV} value={NAV[tabKey]}
          onChange={(val: string) => {
            for (let index = 0; index < NAV.length; index++) {
              const element = NAV[index]
              if (element === val) {
                setTabKey(index)
                if (index === 0 && list.length === 0) fetchtList(true)
                if (index === 1 && list2.length === 0) fetchtList2(true)
                if (index === 2 && list3.length === 0) fetchtList3(true)
                if (index === 3 && list4.length === 0) fetchtList4(true)
                if (index === 4 && list5.length === 0) fetchtList5(true)
                break
              }
            }
          }}
        />
        {render()}
        {renderBottom}
      </View>
    </View>
  )
}
export default StaffManagementFc


const styles = StyleSheet.create({
  box: {
    display: 'flex',
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff'
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
    backgroundColor: '#fff',
    paddingHorizontal: ScreenUtils.scaleSize(15)
  },
  bottomBtns: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: ScreenUtils.scaleSize(59),
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  btn: {
    width: ScreenUtils.scaleSize(325),
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
