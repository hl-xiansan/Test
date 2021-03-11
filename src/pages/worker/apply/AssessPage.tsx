import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  Image,
  TouchableOpacity,
  RefreshControl,
  LogBox,
  ActivityIndicator
} from 'react-native'
import ScreenUtil from '../../../utils/ScreenUtils'
import page from '../../../components/Page'
import Tabs from '../../../components/Tabs'
import Icons from '../../../Icons'
import { TextItem as CommentItem } from './component/AssessRecords'
import Api, { PageResult } from '../../../utils/Api'
import { AssessList_Staff } from '../../../@types/assess'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { Toast } from '@ant-design/react-native'
import ScreenUtils from '../../../utils/ScreenUtils'
import {workerInfo} from "../../../utils/worker";
import {NavigationProp} from "@react-navigation/native";

type Props = {
  navigation: NavigationProp<any>;
};

type ItemType = {
  title: string;
  placeholder?: string;
  right?: boolean | null;
  onPress?: any;
}
const height = Dimensions.get('window').height
const width = Dimensions.get('window').width
type State = {
  tabKey: string
  customerName: string
  unCommentRefreshing: boolean,
  unCommentLoading: boolean,
  commentRefreshing: boolean,
  commentLoading: boolean,
  unCommentList: AssessList_Staff[],
  commentList: AssessList_Staff[],
}

@page()
export default class AssessPage extends Component<Props> {
  commentPage = 1
  unCommentPage = 1
  commentHasMore: boolean = true
  unCommentHasMore: boolean = true
  readonly state: State = {
    tabKey: '待评价',
    customerName: 'aa',
    unCommentRefreshing: false,
    unCommentLoading: false,
    commentRefreshing: false,
    commentLoading: false,
    unCommentList: [],
    commentList: []
  }

  componentDidMount() {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested'])
    setTimeout(() => {
      this.fetchUnCommentList(true)
    }, 100)

    workerInfo.getPerson().then(res => {
      this.setState({
        customerName: res.position.substring(0,res.position.indexOf('·'))
      })
    })
  }
  fetchCommentList = async (flag = false) => {
    if (this.state.commentLoading || this.state.commentRefreshing || (!flag && !this.commentHasMore)) return
    if (flag) {
      this.commentPage = 1
      this.commentHasMore = true
      this.setState({ commentRefreshing: true })
    }
    else this.setState({ commentLoading: true })
    const page = this.commentPage
    try {
      const res = await Api.get<PageResult<AssessList_Staff>>('/labor/my/comment/list/' + page, { params: { page, size: 10 } })
      let datas = this.state.commentList
      if (this.commentPage === 1) datas = res.list
      else datas = datas.concat(res.list)

      this.commentHasMore = !(datas && datas.length >= res.count)
      this.commentPage++
      this.setState({ commentLoading: false, commentRefreshing: false, commentList: datas })
    } catch (error) {
      Toast.fail(error.message)
      this.setState({ commentLoading: false, commentRefreshing: false })
    }
  }
  fetchUnCommentList = async (flag = false) => {
    if (this.state.unCommentLoading || this.state.unCommentRefreshing || (!flag && !this.unCommentHasMore)) return
    if (flag) {
      this.unCommentPage = 1
      this.unCommentHasMore = true
      this.setState({ unCommentRefreshing: true })
    }
    else this.setState({ unCommentLoading: true })
    const page = this.unCommentPage
    try {
      const res = await Api.get<PageResult<AssessList_Staff>>('/labor/my/comment/uncomment/list/' + page, { params: { page, size: 10 } })
      let datas = this.state.unCommentList
      // console.log(datas)

      if (this.unCommentPage === 1) datas = res.list
      else datas = datas.concat(res.list)

      this.unCommentHasMore = !(datas && datas.length >= res.count)
      this.unCommentPage++
      this.setState({ unCommentLoading: false, unCommentRefreshing: false, unCommentList: datas })
    }
    catch (error) {
      Toast.fail(error.message)
      this.setState({ unCommentLoading: false, unCommentRefreshing: false })
    }
  }
  handleChange(val: string) {
    this.setState({ tabKey: val })
    if (val === '待评价' && this.state.unCommentList.length === 0) this.fetchUnCommentList(true)
    if (val === '评价记录' && this.state.commentList.length === 0) this.fetchCommentList(true)
  }
  renderLoadMoreView() {
    if (this.state.unCommentLoading || this.state.commentLoading) return <View style={styles.loadMore}> <ActivityIndicator size={'large'} animating={true} /> <Text>正在加载</Text> </View>
    return null
  }
  commentHandleScroll(event: any) {
    const offsetY = event.nativeEvent?.contentOffset?.y
    const contentHeight = event.nativeEvent?.contentSize?.height
    const height = event.nativeEvent?.layoutMeasurement?.height
    if (offsetY + height > contentHeight - 100 && contentHeight > height) this.fetchCommentList()
  }
  unCommentHandleScroll(event: any) {
    const offsetY = event.nativeEvent?.contentOffset?.y
    const contentHeight = event.nativeEvent?.contentSize?.height
    const height = event.nativeEvent?.layoutMeasurement?.height
    if (offsetY + height > contentHeight - 100 && contentHeight > height) this.fetchUnCommentList()
  }
  renderByTab() {
    const { tabKey,customerName } = this.state
    if (tabKey === '待评价') {
      return (
        <ScrollView
          scrollEventThrottle={200}
          onScroll={this.unCommentHandleScroll.bind(this)}
          refreshControl={<RefreshControl refreshing={this.state.unCommentRefreshing} onRefresh={() => { this.fetchUnCommentList(true) }} />}>
          { !this.state.unCommentRefreshing && this.state.unCommentList?.length === 0 ? <Text style={{
            textAlign: 'center', marginTop: 20
          }}>{'暂无数据'}</Text> : null}
          <FlatList
            data={this.state.unCommentList}
            renderItem={(item) => <TextItem title={item.item.user?.nickname} placeholder={customerName} onPress={() => {
              this.props.navigation.navigate('Reviews', {
                id: item.item.staff_id,
                name: item.item.user?.nickname,
                goBack: () => {
                  this.fetchUnCommentList(true)
                }
              })
            }} />}
            keyExtractor={(item: any, index: number) => item + index}
            ListFooterComponent={() => this.renderLoadMoreView()}
            // onEndReached={() => { this.fetchUnCommentList() }}
            // onEndReachedThreshold={0.5}
            style={{
              flex: 1, marginTop: ScreenUtils.scaleSize(15)
            }}
          />
        </ScrollView >
      )
    }
    else {
      return (
        <ScrollView
          scrollEventThrottle={200}
          onScroll={this.commentHandleScroll.bind(this)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.commentRefreshing}
              onRefresh={() => { this.fetchCommentList(true) }}
            />
          }
        >
          { (!this.state.commentRefreshing && this.state.commentList?.length === 0) ? <Text style={{ textAlign: 'center', marginTop: 20 }}>{'暂无数据'}</Text> : null}
          <FlatList
            data={this.state.commentList}
            renderItem={(item) => <CommentItem data={item.item} onPress={() => {
              console.log(item.item)
              this.props.navigation.navigate('ReviewDetail', {
                item: item.item,
              })
            }} />}
            keyExtractor={(item: any, index: number) => item + index}
            ListFooterComponent={() => this.renderLoadMoreView()}
            // onEndReached={() => { this.fetchCommentList() }}
            // onEndReachedThreshold={0.5}
            style={{
              flex: 1, marginTop: ScreenUtils.scaleSize(15)
            }}
          />
        </ScrollView >
      )
    }
  }
  render() {
    const { tabKey } = this.state
    return (
      <View style={styles.background}>
        <Tabs
          data={['待评价', '评价记录']}
          value={tabKey}
          onChange={this.handleChange.bind(this)}
        />
        { this.renderByTab()}
      </View>
    )
  }
}

const TextItem = (props: ItemType) => {
  const { title = '', placeholder = '', onPress } = props
  return (
    <View style={styles.textItemView}>
      <Image style={styles.avatarImg} source={Icons.Apply.BlueMoney} />
      <View style={{ justifyContent: 'center' }}>
        <Text style={styles.nameText}>{title}</Text>
        {placeholder ? <Text style={styles.placeText}>{placeholder}</Text> : null}
      </View>
      <View style={{ flex: 1 }}></View>
      <TouchableOpacity style={styles.commBtn} onPress={onPress && onPress}>
        <Text style={styles.commText}>去评价</Text>
        <Image style={styles.rightTriangle} source={Icons.Apply.RightTriangle} />
      </TouchableOpacity>
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
  assessView: {
    padding: ScreenUtil.scaleSize(15)
  },
  textItemView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: ScreenUtil.scaleSize(15),
    borderRadius: ScreenUtil.scaleSize(5),
    marginBottom: ScreenUtil.scaleSize(12),
  },
  avatarImg: {
    width: ScreenUtil.scaleSize(42),
    height: ScreenUtil.scaleSize(42),
    marginRight: ScreenUtil.scaleSize(15),
  },
  nameText: {
    color: '#030014',
    fontWeight: 'bold',
    fontSize: ScreenUtil.scaleSize(14),

  },
  placeText: {
    color: '#545468',
    fontWeight: '500',
    marginTop: ScreenUtil.scaleSize(10),
    fontSize: ScreenUtil.scaleSize(12),
  },
  commBtn: {
    backgroundColor: '#526CDD',
    borderRadius: ScreenUtil.scaleSize(15),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: ScreenUtil.scaleSize(80),
    height: ScreenUtil.scaleSize(30),
  },
  commText: {
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(12),
    fontWeight: '500',
    marginRight: ScreenUtil.scaleSize(5)
  },
  rightTriangle: {
    width: ScreenUtil.scaleSize(8),
    height: ScreenUtil.scaleSize(8),
  },
  applyView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flexRowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleStyle: {
    fontSize: ScreenUtil.scaleSize(14),
    fontWeight: 'bold',
  },
  redPoint: {
    color: '#FF5B53',
    fontSize: ScreenUtil.scaleSize(16),
    marginLeft: 5
  },
  placeholderView: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    paddingTop: ScreenUtil.scaleSize(20),
    paddingBottom: ScreenUtil.scaleSize(10),
    borderBottomWidth: 1,
    borderBottomColor: '#E3E6EA',
  },
  placeholderStyle: {
    color: '#A8A8AC',
    fontSize: ScreenUtil.scaleSize(12),
  },
  icon: {
    width: ScreenUtil.scaleSize(14),
    height: ScreenUtil.scaleSize(14),
  },
  rightText: {
    color: '#FE9B16',
    fontSize: ScreenUtil.scaleSize(12)
  },
  subBtn: {
    backgroundColor: '#526CDD',
    width: ScreenUtil.scaleSize(300),
    height: ScreenUtil.scaleSize(40),
    marginHorizontal: ScreenUtil.scaleSize(40),
    marginTop: ScreenUtil.scaleSize(150),
    marginBottom: ScreenUtil.scaleSize(15),
    alignItems: 'center',
    justifyContent: 'center',
    padding: ScreenUtil.scaleSize(12),
    borderRadius: ScreenUtil.scaleSize(20),
  },
  subText: {
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(15)
  },
  loadMore: {
    alignItems: 'center'
  },
})
