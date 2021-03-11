import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import React, { Component } from 'react'
import { Text, View, StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native'
import page from '../../../../components/Page'
import ScreenUtils from '../../../../utils/ScreenUtils'
import SearchView from '../../../../components/SearchPage'
import AsyncStorage from '@react-native-community/async-storage'
import JobCard from '../../../../components/JobCard'
import Api from '../../../../utils/Api'
import { Modal, Provider, Toast, Portal } from '@ant-design/react-native'
import { FlatList } from 'react-native-gesture-handler'
import RecruitJobItem from '../../../../components/RecruitJobItem'
import StaffManagementItem from '../components/StaffManagementItem'

type Props = {
  navigation: BottomTabNavigationProp<any>
}

type State = {
  keyWord: string,
  resultList: any[],
  hasSearch: boolean,
  searchHistory: string[],
  jobs: any,
  loading: boolean,
  refreshing: boolean,
}

@page({
  token: true,
  navigation: {
    title: '',
    headerShown: true,
    headerCenter: () => {
      return (
        <Text style={{ color: '#fff', fontSize: ScreenUtils.scaleSize(18), fontWeight: 'bold' }}>搜索</Text>
      )
    },
  },
})
export default class PositionSearch extends Component<Props, State> {
  loading = false
  page: number = 1
  hasMore: boolean = true
  isU = false
  readonly state: State = {
    keyWord: '',
    hasSearch: false,
    resultList: [],
    refreshing: false,
    loading: false,
    jobs: [],
    searchHistory: []
  }

  onSearch() {
    this.onAddHistory(this.state.keyWord)
  }

  onAddHistory(value: string) {
    let saveArr = []
    let historyArr: string[] = this.state.searchHistory.concat([])
    if (historyArr.find((item) => item === value)?.length) {
      this.setState({ hasSearch: true }, () => {
        this.loadData(true)
      })
      return false
    }
    historyArr.unshift(value)
    saveArr = historyArr.length > 10 ? historyArr.splice(0, 10) : historyArr.concat([])
    this.setState({ searchHistory: saveArr, hasSearch: true }, () => {
      this.loadData(true)
    })
    AsyncStorage.setItem('searchHistory', JSON.stringify(saveArr))
    return true
  }
  componentWillUnmount() {
    this.isU = true
  }
  async componentDidMount() {
    let history: any = await AsyncStorage.getItem('searchHistory')
    console.log('缓存的记录', history)
    this.setState({
      searchHistory: JSON.parse(history) ? JSON.parse(history) : []
    }, () => {
      console.log(this.state.searchHistory)
    })
  }
  renderHistory() {
    return this.state.searchHistory.map((item, index) => {
      return (
        <TouchableOpacity key={index} activeOpacity={0.8} onPress={() => {
          this.setState({ keyWord: item }, () => {
            this.onSearch()
          })
        }}>
          <View style={styles.historyItem}><Text style={{ color: '#545468' }}>{item}</Text></View>
        </TouchableOpacity>
      )
    })
  }
  loadData(flag = false) {
    if (this.state.loading || this.state.refreshing || (!flag && !this.hasMore)) return
    if (flag) {
      this.page = 1
      this.hasMore = true
      this.setState({ refreshing: true })
    }
    else this.setState({ loading: true })

    Api.get<any>('/labor/staff/worker/list/' + this.page, {
      params: { size: 10, keywords: this.state.keyWord }
    })
      .then((res) => {
        if (this.isU || !this.state.hasSearch) return
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
  renderPorsitionItem = ({ item, navigation }: any) => {
    return <View key={String(item.item.user_id)} style={styles.positionItem}>
      <StaffManagementItem
        tabKey=""
        data={item.item}
        onPress={() => {
          navigation.navigate('EmployeeInfo', { id: item.item.id })
        }}
      />
    </View>
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
  renderBody() {
    if (this.state.hasSearch) {
      return (
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
      )
    }
    else {
      return (
        <ScrollView style={styles.paddingBox}>
          <View style={styles.historyBox}>
            <View style={styles.historyBoxTitle}>
              <View style={styles.historyTitleLeftBox}>
                <Image style={styles.icon} source={require('../../../../assets/icons/job/historyFoot.png')} />
                <Text style={styles.titleHeaderLeft}>搜索历史</Text>
              </View>
              <TouchableOpacity activeOpacity={0.8} onPress={() => {
                AsyncStorage.removeItem('searchHistory')
                this.setState({ searchHistory: [] })
              }}>
                <Image style={styles.icon} source={require('../../../../assets/icons/job/delete.png')} />
              </TouchableOpacity>

            </View>
            <View style={styles.historyContent}>
              {this.renderHistory()}
            </View>
          </View>
        </ScrollView>
      )
    }
  }

  render() {
    return (
      <Provider>
        <View style={styles.content}>
          <View style={styles.searchView}>
            <SearchView
              placeholder="请输入工厂或门店关键词"
              height={38}
              keyWord={this.state.keyWord}
              searchOnPress={() => { this.onSearch() }}
              onChangeText={(value: string) => { this.setState({ keyWord: value }) }}
              onSubmitEditing={() => { this.onSearch() }}
              handleClear={() => {
                this.setState({ keyWord: '', hasSearch: false, refreshing: false, jobs: [], loading: false })
              }}
            ></SearchView>
          </View>
          {this.renderBody()}
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
  paddingBox: {
    paddingHorizontal: ScreenUtils.scaleSize(15)
  },
  searchView: {
    backgroundColor: 'rgba(82, 108, 221, 1)',
    paddingHorizontal: ScreenUtils.scaleSize(15),
    paddingBottom: ScreenUtils.scaleSize(15)
  },
  historyBoxTitle: {
    borderBottomColor: '#E7EBEF',
    borderBottomWidth: ScreenUtils.scaleSize(1),
    height: ScreenUtils.scaleSize(60),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    width: ScreenUtils.scaleSize(22),
    height: ScreenUtils.scaleSize(22),
  },
  historyTitleLeftBox: {
    display: 'flex',
    flexDirection: 'row',
  },
  titleHeaderLeft: {
    color: '#030014',
    fontWeight: 'bold',
    fontSize: ScreenUtils.scaleSize(14),
    marginLeft: ScreenUtils.scaleSize(3),
  },
  historyContent: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  historyItem: {
    backgroundColor: '#F3F5F7',
    height: ScreenUtils.scaleSize(28),
    borderRadius: 4,
    margin: ScreenUtils.scaleSize(8),
    paddingHorizontal: ScreenUtils.scaleSize(8),
    paddingVertical: ScreenUtils.scaleSize(6),
  },
  positionItem: {
    marginBottom: ScreenUtils.scaleSize(15),
    backgroundColor: '#fff',
    paddingHorizontal: ScreenUtils.scaleSize(15)
  },
  noData: {
    flex: 1,
    lineHeight: ScreenUtils.scaleSize(200),
    textAlign: 'center',
  },
  loadMore: {
    alignItems: 'center'
  },
  historyBox: {

  }
})

