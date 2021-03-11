import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import React, { Component } from 'react'
import {StatusBar, View, StyleSheet, TouchableOpacity, FlatList, Image, Text, DeviceEventEmitter} from 'react-native'
import Icons from '../../../Icons'
import ScreenUtils from '../../../utils/ScreenUtils'
import SearchView from '../../../components/SearchPage'
import LinearGradient from 'react-native-linear-gradient'
import Page from '../../../components/Page'
import {BoxShadow} from 'react-native-shadow'
import {Message} from '../../../@types'
import {string} from 'prop-types'
import Api, {PageResult} from '../../../utils/Api'
import {Toast} from '@ant-design/react-native'
import CommonUtils from '../../../utils/CommonUtils'
import {Msg} from "../../../utils/MessageUtil";

type Props = {
  navigation: BottomTabNavigationProp<any>
}

type State = {
  messages?: Message[],
  refreshing: boolean,
  hasMore: boolean,
  keyword?: string, // 关键字
}

@Page({
  navigation: {
    title: 'NewsView'
  }
})
export default class WorkerHomePage extends Component<Props> {
  // 页码
  page: number = 1;
  // 是否正在加载更多
  isLoadMore: boolean = false;

  emitter: any = null

  readonly state: State = {
    refreshing: false,
    hasMore: false,
    messages: [],
    keyword: ''
  }

  componentDidMount() {
    this.setState({refreshing: true})
    this.loadData()
    this.emitter = DeviceEventEmitter.addListener('JPushMsgUpdate', () => {
      this.page=1
      this.loadData()
    })
  }

  componentWillUnmount() {
    if (this.emitter) this.emitter.remove()
  }

  loadData() {
    Api.get<PageResult<Message>>('/labor/person/message/list/' + this.page)
      .then((res) => {
        let datas = this.state.messages
        if (this.page === 1) {
          // 第一页
          datas = res.list
        } else {
          // 其他页
          datas = datas?.concat(res.list)
        }
        // 是否有下一页
        const hasMore = !(datas && datas.length >= res.count)
        this.page++
        this.isLoadMore = false

        this.setState({refreshing: false, hasMore: hasMore, messages: datas})
      }).catch(error => {
        console.log('message list error:', error)
        Toast.fail('加载失败')
        this.isLoadMore = false
        this.setState({refreshing: false})
      })
  }

  shadowOpt = {
    width: ScreenUtils.scaleSize(345),
    height: ScreenUtils.scaleSize(73),
    color:'#253039',
    border: 6,
    radius: ScreenUtils.scaleSize(5),
    opacity: 0.08,
    style:{
      marginBottom: ScreenUtils.scaleSize(15),
      paddingHorizontal: ScreenUtils.scaleSize(1)
    },
    x: 0,
    y: 2
  }

  getItemIcon (value: number) {
    let iconName: 'BigIconsOne' | 'BigIconsTwo' | 'BigIconsThree' | 'BigIconsFour'  = 'BigIconsOne'
    if (value === 31) {
      iconName = 'BigIconsOne'
    } else if (value === 1) {
      iconName = 'BigIconsTwo'
    } else if (value === 2) {
      iconName = 'BigIconsThree'
    } else if (value === 3) {
      iconName = 'BigIconsFour'
    } else if (value === 4) {
      iconName = 'BigIconsOne'
    }
    return iconName
  }

  getItemTitle(type:number) {
    if (type === 31) return '借款审批'
    if (type === 2) return '离职申请'
    if (type === 3) return '签约申请'
    if (type === 4) return '转厂申请'
    if (type === 5) return '还款通知'
    return  ''
  }

  goToView = (type: number,id: string) => {
    console.log(id)
    console.log(type)
    if (type===31) { // true就跳还款详情
      this.props.navigation.navigate('LoanDetail',{id: id,isManager:1})
    } else { // false就跳消息详情
      this.props.navigation.navigate('PaymentView')
    }
  }

  onRenderNewsItem = ({item}: any) => {
    return (
      <BoxShadow setting={this.shadowOpt}>
        <TouchableOpacity activeOpacity={0.5} style={styles.listItemView} onPress={() =>{this.goToView(item.type,item.value_id)}}>
          <Image source={Icons.News[this.getItemIcon(item.type)]} style={styles.listItemIcon}/>
          <View style={styles.listItemMiddle}>
            <Text style={styles.listItemTitle}>{this.getItemTitle(item.type)}</Text>
            <Text style={styles.listItemDetail} ellipsizeMode="tail" numberOfLines={1}>{item.content}</Text>
          </View>
          <Text style={styles.listItemdate}>{CommonUtils.UTCDateFormat(item.create_time,'MM月DD日')}</Text>
        </TouchableOpacity>
      </BoxShadow>
    )
  }

  render() {
    return (
      <View style={styles.content}>
        <StatusBar backgroundColor="rgba(82, 108, 221, 1)"></StatusBar>
        <View style={styles.searchView}>
          <SearchView type="navigation" placeholder="请输入消息关键词"></SearchView>
        </View>
        <LinearGradient colors={['rgba(82, 108, 221, 1)', 'rgba(82, 108, 221, 0.5)', 'rgba(82, 108, 221, 0.1)']} style={styles.linearGradient}></LinearGradient>
        <FlatList
          data={this.state.messages}
          renderItem={this.onRenderNewsItem}
          keyExtractor={(item: any, index: number) => item + index}
          style={{flex: 1, marginTop: ScreenUtils.scaleSize(15), paddingHorizontal: ScreenUtils.scaleSize(15)}}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'rgba(252, 253, 253, 1)',
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
  listItemView: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: ScreenUtils.scaleSize(15),
    backgroundColor: '#fff',
    borderRadius: ScreenUtils.scaleSize(5),
    width: ScreenUtils.scaleSize(343)
  },
  listItemIcon: {
    width: ScreenUtils.scaleSize(44),
    height: ScreenUtils.scaleSize(44)
  },
  listItemMiddle: {
    flex: 1,
    marginLeft: ScreenUtils.scaleSize(15),
    marginRight: ScreenUtils.scaleSize(7)
  },
  listItemTitle: {
    color: 'rgba(3, 0, 20, 1)',
    fontSize: ScreenUtils.scaleSize(14),
    fontWeight: 'bold',
  },
  listItemDetail: {
    marginTop: ScreenUtils.scaleSize(11),
    fontSize: ScreenUtils.scaleSize(13),
    color: 'rgba(84, 84, 104, 1)',
  },
  listItemdate: {
    color: 'rgba(168, 168, 172, 1)',
    fontSize: ScreenUtils.scaleSize(12)
  }
})

