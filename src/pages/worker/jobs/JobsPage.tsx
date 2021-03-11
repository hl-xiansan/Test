import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import React, { Component } from 'react'
import { StatusBar, View, StyleSheet, FlatList, RefreshControl, LogBox } from 'react-native'
import ScreenUtils from '../../../utils/ScreenUtils'
import SearchView from '../../../components/SearchPage'
import LinearGradient from 'react-native-linear-gradient'
import JobCard from '../../../components/JobCard'
import Page from '../../../components/Page'
import { Job } from '../../../@types'
import Api, { PageResult } from '../../../utils/Api'
import { ActivityIndicator, Provider, Toast } from '@ant-design/react-native'
import { Text } from 'react-native-svg'
import { ScrollView } from 'react-native-gesture-handler'

type Props = {
  navigation: BottomTabNavigationProp<any>
}

type State = {
  jobs: Job[],
  loading: boolean,
  refreshing: boolean,
  keyword?: string, // 关键字
}

@Page({
  navigation: {
    title: 'Jobs'
  }
})
export default class WorkerHomePage extends Component<Props, State> {

  // 页码
  page: number = 1
  hasMore: boolean = true
  readonly state: State = {
    refreshing: false,
    loading: false,
    jobs: [],
    keyword: ''
  }
  componentDidMount() {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested'])
    this.loadData(true)
  }
  loadData(flag = false) {
    if (this.state.loading || this.state.refreshing || (!flag && !this.hasMore)) return
    if (flag) {
      this.page = 1
      this.hasMore = true
      this.setState({ refreshing: true })
    }
    else this.setState({ loading: true })

    Api.get<PageResult<Job>>('/labor/jobs/list/' + this.page, {
      params: {
        size: 10,
        keywords: this.state.keyword
      }
    })
      .then((res) => {

        let datas = this.state.jobs
        if (this.page === 1) datas = res.list
        else datas = datas.concat(res.list)

        // 是否有下一页
        const hasMore = !(datas && datas.length >= res.count)
        this.page++
        this.hasMore = hasMore
        this.setState({ refreshing: false, jobs: datas, loading: false })
      }).catch(error => {
        console.log('jobs list error:', error)
        Toast.fail('加载失败')
        this.setState({ refreshing: false, loading: false })
      })
  }
  renderPorsitionItem({ item, navigation }: any) {
    console.log(item.item)
    
    return (
      <View key={item} style={styles.positionItem}>
        <JobCard
          data={item.item}
          onBtnPress={() => { this.props.navigation.navigate('ResumeInfo', { id: item.item.customer_id, name: item.item.name,jobId:item.id, }) }}
          onPress={() => { navigation.navigate('JobView', { id: item.item.id }) }} />
      </View>
    )
  }
  renderLoadMoreView() {
    if (this.state.loading) {
      return <View style={styles.loadMore}>
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
          <View style={styles.searchView}>
            <SearchView
              type="navigation"
              placeholder="请输入工厂或门店关键词"
              onPress={() => { this.props.navigation.navigate('SearchPosition') }}
            ></SearchView>
          </View>
          <LinearGradient colors={['rgba(82, 108, 221, 1)', 'rgba(82, 108, 221, 0.5)', 'rgba(82, 108, 221, 0.1)']} style={styles.linearGradient}></LinearGradient>
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
  },
  loadMore: {
    alignItems: 'center'
  },
  indicator: {
    color: 'red',
    margin: 10
  }
})

