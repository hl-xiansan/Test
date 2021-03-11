import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs'
import React, {Component, Fragment} from 'react'
import {StatusBar, View, StyleSheet, FlatList, Text, RefreshControl, ActivityIndicator, LogBox} from 'react-native'
import ScreenUtils from '../../../../utils/ScreenUtils'
import SearchView from '../../../../components/SearchPage'
import LinearGradient from 'react-native-linear-gradient'
// import JobItem from '../../../../components/JobItem'
import Page from '../../../../components/Page'
import RecruitJobItem from '../../../../components/RecruitJobItem'
import {Provider, Modal, Toast, Portal} from '@ant-design/react-native'
import Tabs from '../../../../components/Tabs'
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler'
import Api from '../../../../utils/Api'
import customerFilter from '../../../../utils/customerFilter'
import {Route} from "@react-navigation/routers";


type Props = {
  navigation: BottomTabNavigationProp<any>
  route: Route<string, { tabKey?: string }>
}

type State = {
  visible: boolean
  jobs: any[],
  loading: boolean,
  refreshing: boolean,
  keyword?: string, // 关键字
  tabKey: string,
}

const STATUS: any = {
  '招聘中': 1,
  '待审核': 0,
  '已暂停': 5,
  '不通过': 2,
};

@Page({
  navigation: {
    title: 'Jobs'
  }
})
export default class MyPositions extends Component<Props, State> {
  id: any = null
  // 页码
  page: number = 1
  hasMore: boolean = true
  loading: boolean = false
  didFocus: any
  readonly state: State = {
    visible: false,
    refreshing: false,
    loading: false,
    jobs: [],
    keyword: '',
    tabKey: this.props.route?.params?.tabKey || '招聘中',
  }

  async changeNumber(id: string, recruit_count: number) {
    if (this.loading) return
    this.loading = true
    const key = Toast.loading('loading')
    try {
      const res = await Api.put(`/labor/staff/jobs/${id}/recruit`, {recruit_count})
      console.log(res)

      Portal.remove(key)
      Toast.success('修改成功')
      const jobs = JSON.parse(JSON.stringify(this.state.jobs))
      for (let index = 0; index < jobs.length; index++) {
        const element = jobs[index]
        if (element.id === id) {
          element.recruit_count = recruit_count
          break
        }
      }
      this.setState({jobs})
    } catch (error) {
      Portal.remove(key)
      Toast.fail(error.message)
    }
  }

  renderPorsitionItem = ({item, navigation}: any) => {
    return (
      <View>
          <View key={item} style={styles.positionItem}>
          <RecruitJobItem
            item={item.item}
            noChange={[0, 2].includes(STATUS[this.state.tabKey])}
            onPress={() => {
              navigation.navigate('JobView', {id: item.item.id, status: STATUS[this.state.tabKey], isManager: 1})
            }}
            setNum={() => {
              navigation.navigate('RegistrationDetail', {job: item.item,isManager: 1});
              // Modal.prompt('应聘人数', '', (n) => this.changeNumber(item.item.id, n), 'default', '', ['请输入应聘人数'],)
            }}
          />
        </View>
      </View>
    )
  }

  componentDidMount() {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested'])
    this.didFocus = this.props.navigation.addListener('focus', () => {
      this.loadData(true);
    });
    this.loadData(true)
    // customerFilter.selectID = null
    // TODO 没有按照工厂分的查询
    customerFilter.name = 'MyPositions'
    customerFilter.callBack.push(() => {
      this.id = customerFilter.selectID
      this.loadData(true)
    })
  }

  componentWillUnmount() {
    customerFilter.selectID = null
    customerFilter.name = null
    customerFilter.callBack = []
    this.didFocus?.remove?.()//不要忘了移除监听哦
  }

  loadData(flag = false) {
    if (this.state.loading || this.state.refreshing || (!flag && !this.hasMore)) return
    if (flag) {
      this.page = 1
      this.hasMore = true
      this.setState({refreshing: true})
    } else this.setState({loading: true})
    const params: any = {
      size: 10,
      keywords: this.state.keyword,
      status: STATUS[this.state.tabKey],
    }
    if (customerFilter.selectID) params.customer_id = customerFilter.selectID
    Api.get('/labor/staff/jobs/list/' + this.page, {
      params
    })
      .then((res: any) => {
        let datas = this.state.jobs
        if (this.page === 1) datas = res.list
        else datas = datas.concat(res.list)
        // 是否有下一页
        const hasMore = !(datas && datas.length >= res.count)
        this.page++
        this.hasMore = hasMore
        this.setState({refreshing: false, jobs: datas, loading: false})
      }).catch((error: Error) => {
        console.log('jobs list error:', error)
        Toast.fail('加载失败')
        this.setState({refreshing: false, loading: false})
      })
  }

  renderLoadMoreView() {
    if (this.state.loading) {
      return <View style={{alignItems: 'center'}}>
        <ActivityIndicator size={'large'} animating={true}/>
        <Text>正在加载更多</Text>
      </View>
    }
    return null
  }

  handleScroll(event: any) {
    const offsetY = event.nativeEvent?.contentOffset?.y
    const contentHeight = event.nativeEvent?.contentSize?.height
    const height = event.nativeEvent?.layoutMeasurement?.height
    if (offsetY + height > contentHeight - 100 && contentHeight > height) this.loadData()
  }

  render() {
    return (
      <Provider>
        <View style={styles.content}>
          <Tabs
            data={Object.keys(STATUS)}
            tabStyle={{fontSize: ScreenUtils.scaleSize(12), color: '#C9D3FF'}}
            tabBoxStyle={{marginBottom: ScreenUtils.scaleSize(16)}}
            triangleSize={4}
            value={this.state.tabKey}
            onChange={(tabKey: any) => this.setState({tabKey}, () => this.loadData(true))}
          />
          <StatusBar barStyle={'light-content'} translucent={true} backgroundColor="rgba(255,255,255,0)"/>
          <ScrollView
            style={{marginTop: ScreenUtils.scaleSize(15)}}
            scrollEventThrottle={200}
            onScroll={this.handleScroll.bind(this)}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => {
                  this.loadData(true)
                }}
              />
            }
          >
            
            
            {(!this.state.refreshing && this.state.jobs?.length === 0) ? <Text style={{textAlign: 'center', marginTop: 20}}>{'暂无数据'}</Text> : null}
            <FlatList
              data={this.state.jobs}
              renderItem={(item) => this.renderPorsitionItem({item, navigation: this.props.navigation})}
              keyExtractor={(item: any, index: number) => item + index}
              ListFooterComponent={() => this.renderLoadMoreView()}
              style={{flex: 1}}
            />
            
          </ScrollView>
          
        </View>

        {/* -------------------------------------- */}
        <View style={{position:"absolute",zIndex:100,right:20,bottom:70 }}>
          <TouchableOpacity 
            onPress = { () => { this.props.navigation.navigate('Interviewer',{ data:this.props }) } }
          >
            <View style={{ width:70,height:30,backgroundColor:'#526CDD',borderRadius:3,display:'flex',justifyContent:"center",alignItems:'center' }}>
              <Text style={{ color:'#fff' }}>
                面试结果
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* -------------------------------------- */}
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#fff',
    flex: 1,
    position: 'relative'
  },
  searchView: {
    paddingHorizontal: ScreenUtils.scaleSize(15),
    backgroundColor: 'rgba(82, 108, 221, 1)',
  },
  linearGradient: {
    position: 'absolute',
    zIndex: -1,
    top: ScreenUtils.scaleSize(33),
    width: '100%',
    height: ScreenUtils.scaleSize(150)
  },
  positionItem: {
    marginBottom: ScreenUtils.scaleSize(15),
    paddingHorizontal: ScreenUtils.scaleSize(15)
  }
})

