import React, { Component } from 'react'
import { ImageBackground, LogBox, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icons from '../../../Icons'
import ScreenUtils from '../../../utils/ScreenUtils'
import ScreenUtil from '../../../utils/ScreenUtils'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { getDateString } from '../jobs/ResumeInfoPage'
import { FlatList } from 'react-native-gesture-handler'
import { ActivityIndicator, Provider, Toast } from '@ant-design/react-native'
import Api, { PageResult } from '../../../utils/Api'

const ICONS = [
  Icons.Apply.RoundRectangle, // 待确认
  Icons.Apply.GreenRectangle, // 完成
  Icons.Apply.OrangeRectangle, // 拒绝
]
const COLORS = {
  0: ['#D2D2DA', '#A8A8AC'],
  5: ['#D2D2DA', '#A8A8AC'],
  10: ['#D2D2DA', '#A8A8AC'],
  11: ['#D2D2DA', '#A8A8AC'],
  15: ['#FF7979', '#FF4343'],
  16: ['#F4B816', '#FF9A16'],
}
// 0:待审核
// - 5:在职
// - 10:申请离职
// - 11:不被批准离职
// - 15:终止
// - 16:被辞退
const TEXTS = {
  0: '待审核',
  5: '在职',
  10: '申请离职',
  11: '不被批准',
  15: '终止',
  16: '被辞退',
}

type State = {
  list: any[],
  loading: boolean,
  refreshing: boolean,
}
type Props = {
  navigation: BottomTabNavigationProp<any>
}
interface ItemMsgPropos {
  id: string,
  name: string,
  state: 0,
  time: Date,
  customer: string,
}
interface ItemPropos {
  navigation: BottomTabNavigationProp<any>
  data: ItemMsgPropos
}
const Item: React.FC<ItemPropos> = ({ data, navigation }: ItemPropos) => {
  return (
    <TouchableOpacity
      style={styles.leaveItem}
      onPress={() => {
        navigation.navigate('LeaveDetail', { id: data.id })
      }}
    >
      <View style={styles.leaveItemTop}>
        <View style={styles.leaveTitleWrapper}>
          <LinearGradient
            colors={COLORS[data.state]}
            style={styles.linearGradient} />

          <Text style={styles.leaveTitle}>{data.name}提交的离职申请</Text>
        </View>
        <ImageBackground source={ICONS[0]} style={styles.statusTag}>
          <Text style={styles.tagText}>{TEXTS[data.state]}</Text>
        </ImageBackground>
      </View>
      <View style={[styles.leaveItemBottom, styles.borderTop]}>
        <View style={styles.bottomItem}>
          <View style={styles.dot}></View>
          <Text style={styles.bottomText}>申  请  人：{data.name}</Text>
        </View>
      </View>
      <View style={styles.leaveItemBottom}>
        <View style={styles.bottomItem}>
          <View style={styles.dot}></View>
          <Text style={styles.bottomText}>所属单位：{data.customer}</Text>
        </View>
      </View>
      <View style={styles.leaveItemBottom}>
        <View style={styles.bottomItem}>
          <View style={styles.dot}></View>
          <Text style={styles.bottomText}>申请时间：{getDateString(new Date(data.time), true)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
class LeaveList extends Component<Props, State>  {
  // 页码
  page: number = 1
  hasMore: boolean = true
  readonly state: State = {
    refreshing: false,
    loading: false,
    list: [],
  }
  // 页码
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

    Api.get<any>('/labor/my/working/list/' + this.page, {
      params: {
        page: this.page,
        size: 10,
        status: 10
      }
    })
      .then((res) => {
        console.log(res)

        let datas = this.state.list
        if (this.page === 1) datas = res.list
        else datas = datas.concat(res.list)
        const arr: any[] = []
        if (datas?.length > 0) {
          datas.map((item: any) => {
            // TODO 缺少 ID
            arr.push({
              id: item.id,
              name: item.employee_name,
              state: item.status,
              time: new Date(item.modify_time),
              customer: item.customer_name,
            })
          })
        }

        // 是否有下一页
        const hasMore = !(datas && datas.length >= res.count)
        this.page++
        this.hasMore = hasMore
        this.setState({ refreshing: false, list: arr, loading: false })
      }).catch(error => {
        console.log('jobs list error:', error)
        Toast.fail('加载失败')
        this.setState({ refreshing: false, loading: false })
      })
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
        <ScrollView
          style={styles.container}
          scrollEventThrottle={200}
          onScroll={this.handleScroll.bind(this)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => { this.loadData(true) }}
            />
          }
        >
          {(!this.state.refreshing && this.state.list?.length === 0) ? <Text style={{ textAlign: 'center', marginTop: 20 }}>{'暂无数据'}</Text> : null}
          <FlatList
            data={this.state.list}
            renderItem={(item) => <Item data={item.item} navigation={this.props.navigation} />}
            keyExtractor={(item: any, index: number) => item + index}
            ListFooterComponent={() => this.renderLoadMoreView()}
            // onEndReached={() => { this.loadData() }}
            // onEndReachedThreshold={0.5}
            style={{ flex: 1, marginTop: ScreenUtils.scaleSize(15), zIndex: 2, }}
          />
        </ScrollView >
      </Provider >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  leaveItem: {
    marginTop: ScreenUtils.scaleSize(10),
    marginHorizontal: ScreenUtils.scaleSize(15),
    backgroundColor: '#fff'
  },
  leaveItemTop: {
    flexDirection: 'row',
    height: ScreenUtils.scaleSize(50),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: ScreenUtils.scaleSize(15),
  },
  leaveTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leaveTitle: {
    color: '#030014',
    fontSize: ScreenUtils.scaleSize(16),
    fontWeight: '700'
  },
  statusTag: {
    width: ScreenUtil.scaleSize(54),
    height: ScreenUtil.scaleSize(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(12),
  },
  linearGradient: {
    height: ScreenUtil.scaleSize(19),
    width: ScreenUtil.scaleSize(3.5),
    borderRadius: ScreenUtil.scaleSize(1.5),
    marginRight: ScreenUtil.scaleSize(11),
  },
  leaveItemBottom: {
    marginHorizontal: ScreenUtil.scaleSize(15),
    paddingBottom: ScreenUtil.scaleSize(15),
  },
  borderTop: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F3F5F7',
    paddingTop: ScreenUtil.scaleSize(15),
  },
  bottomText: {
    fontSize: ScreenUtils.scaleSize(14),
    color: '#545468'
  },
  dot: {
    height: ScreenUtil.scaleSize(3),
    width: ScreenUtil.scaleSize(3),
    borderRadius: ScreenUtil.scaleSize(1.5),
    backgroundColor: '#545468',
    marginRight: ScreenUtil.scaleSize(14),
  },
  bottomItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  loadMore: {
    alignItems: 'center'
  },
  indicator: {
    color: 'red',
    margin: 10
  }
})


export default LeaveList
