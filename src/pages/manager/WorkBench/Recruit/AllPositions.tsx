import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import React, { Component } from 'react'
import { StatusBar, View, StyleSheet, FlatList, Text, ActivityIndicator, LogBox, RefreshControl } from 'react-native'
import ScreenUtils from '../../../../utils/ScreenUtils'
import Page from '../../../../components/Page'
import RecruitJobItem from '../../../../components/RecruitJobItem'
import { Provider, Modal, Toast } from '@ant-design/react-native'
import Api from '../../../../utils/Api'
import { ScrollView } from 'react-native-gesture-handler'
import customerFilter from '../../../../utils/customerFilter'

type Props = {
  navigation: BottomTabNavigationProp<any>
}

type State = {
  visible: boolean
  jobs: any[],
  loading: boolean,
  refreshing: boolean,
  keyword?: string, // 关键字
}

@Page({
  navigation: {
    title: 'Jobs'
  }
})
export default class AllPositions extends Component<Props, State> {
  // 页码
  id: any = null
  page: number = 1
  hasMore: boolean = true
  readonly state: State = {
    visible: false,

    refreshing: false,
    loading: false,
    jobs: [],
    keyword: ''
  }

  renderPorsitionItem = ({ item, navigation }: any) => {
    return (
      <View key={item} style={styles.positionItem}>
        <RecruitJobItem
          noChange={true}
          item={item.item}
          // onPress={() => { navigation.navigate('ApplicantList', { job: item.item }) }}
          onPress={() => { navigation.navigate('JobView', { id: item.item.id, status: 1, isManager: 1 }) }}
          setNum={() => { }}
        />
      </View>
    )
  }

  componentDidMount() {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested'])
    this.loadData(true)
    customerFilter.selectID = null
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
  }
  loadData(flag = false) {
    if (this.state.loading || this.state.refreshing || (!flag && !this.hasMore)) return
    if (flag) {
      this.page = 1
      this.hasMore = true
      this.setState({ refreshing: true })
    }
    else this.setState({ loading: true })
    const params: any = {
      size: 10,
      keywords: this.state.keyword
    }
    if (customerFilter.selectID) params.customer_id = customerFilter.selectID
    Api.get('/labor/jobs/list/' + this.page, {
      params
    })
      .then((res: any) => {

        let datas = this.state.jobs
        if (this.page === 1) datas = res.list
        else datas = datas.concat(res.list)
        console.log(datas)

        // 是否有下一页
        const hasMore = !(datas && datas.length >= res.count)
        this.page++
        this.hasMore = hasMore
        this.setState({ refreshing: false, jobs: datas, loading: false })
      }).catch((error: Error) => {
        console.log('jobs list error:', error)
        Toast.fail('加载失败')
        this.setState({ refreshing: false, loading: false })
      })
  }
  renderLoadMoreView() {
    if (this.state.loading) {
      return <View style={{ alignItems: 'center' }}>
        <ActivityIndicator
          size={'large'}
          animating={true}
        />
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
          <StatusBar barStyle={'light-content'} translucent={true} backgroundColor="rgba(255,255,255,0)" />
          <ScrollView
            style={{ marginTop: ScreenUtils.scaleSize(15) }}
            scrollEventThrottle={200}
            onScroll={this.handleScroll.bind(this)}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => { this.loadData(true) }}
              />
            }
          >
            {(!this.state.refreshing && this.state.jobs?.length === 0) ? <Text style={{ textAlign: 'center', marginTop: 20 }}>{'暂无数据'}</Text> : null}
            <FlatList
              data={this.state.jobs}
              renderItem={(item) => this.renderPorsitionItem({ item, navigation: this.props.navigation })}
              keyExtractor={(item: any, index: number) => item + index}
              ListFooterComponent={() => this.renderLoadMoreView()}
              style={{ flex: 1, }}
            />
          </ScrollView >
        </View>
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

