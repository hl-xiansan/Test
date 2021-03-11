import React, { Component } from 'react'
import { NavigationProp } from '@react-navigation/native'

import { Text, StyleSheet, Image, View, TouchableOpacity, ImageBackground, ScrollView, StatusBar, RefreshControl } from 'react-native'

import Api, { PageResult } from '../../utils/Api'
import Icons from '../../Icons'
import { Job } from '../../@types'

import ScreenUtils from '../../utils/ScreenUtils'
import SearchView from '../../components/SearchPage'
import LinearGradient from 'react-native-linear-gradient'
import { Carousel, Toast } from '@ant-design/react-native'
import JobCard from '../../components/JobCard'
import Page from '../../components/Page'
import {workerInfo} from "../../utils/worker";


type Props = {
  navigation: NavigationProp<any>
}

type State = {
  showHotPosition: boolean
  jobs: PageResult<Job>,
  refreshing: boolean,
  keyword: string
  carousel: any[]
  notices: any[]
}

@Page()
export default class WorkerHomePage extends Component<Props, State> {
  isUnmount = false
  // 页码
  page: number = 1;
  // 是否正在加载更多
  isLoadMore: boolean = false;
  readonly state: State = {
    showHotPosition: true,
    keyword: '',
    refreshing: false,
    jobs: { count: 0, list: [] },
    carousel: [],
    notices: []
  }

  componentWillUnmount() {
    this.isUnmount = true
  }
  componentDidMount() {
    this.loadData()
    this.getBanner()
    this.getNotices()
  }
  async loadData() {
    if (this.state.refreshing) return
    this.setState({ refreshing: true })
    try {
      const res = await Api.get<PageResult<Job>>('/labor/jobs/list/' + this.page, { params: { size: 10, keywords: this.state.keyword } })
      if (this.isUnmount) return
      if (res.count > 0) this.setState({ jobs: res ? res : { count: 0, list: [] }, refreshing: false })
      else this.setState({ refreshing: false })
    } catch (error) {
      Toast.fail(error.message)
    }

  }
  async getBanner() {
    try {
      const res: any = await Api.get('/gateway/news/list/1', { params: { size: 1000, carousel: 1, type: 0 } })
      const carousel = res.list
      // console.log(carousel)

      // const carousel = [
      //   {
      //     id:321312321,
      //     photos:['http://n.sinaimg.cn/sinacn20121/63/w363h500/20181219/6647-hqnkypr2763138.jpg']
      //   }
      // ]
      if (this.isUnmount) return
      else this.setState({ carousel })
    } catch (error) {
      Toast.fail(error.message)
    }
  }
  async getNotices() {
    try {
      const res: any = await Api.get('/gateway/news/list/1', { params: { size: 1, type: 1 } })
      // console.log(res)
      const notices = res.list
      if (this.isUnmount) return
      else this.setState({ notices })
    } catch (error) {
      Toast.fail(error.message)
    }
  }
  renderList() {
    const arr = this.state.carousel.map((item: any, index: number) => {
      // console.log(item)

      return (
        <TouchableOpacity onPress={() => { this.props.navigation.navigate('NewsDetail', { id: item.id }) }} key={index} style={style.carouseItem}>
          <Image source={item.photos  ? { uri: 'http://tongtu.juyunfuwu.cn/api/tongtu/storage/' + item.photos } : require('../../assets/images/login-bg.png')} style={style.carouseItemImg} />
        </TouchableOpacity>
      )
    })
    return arr.length === 0 ? (
      <View style={style.carouseItem}>
        <Image source={require('../../assets/images/login-bg.png')} style={style.carouseItemImg} />
      </View>
    ) : arr
  }
  renderList2() {
    return this.state.notices.map((item: any, index: number) => {
      return <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('NewsDetail', { id: item.id })} style={style.noticesItem}>
        <Text style={style.noticesText}>{item.title}</Text>
      </TouchableOpacity>
    })
  }

  render() {
    return (
      <View style={style.content}>
        <StatusBar barStyle={'light-content'} translucent={true} backgroundColor="rgba(255,255,255,0)" />
        <View style={style.searchView}>
          <SearchView onPress={() => { this.props.navigation.navigate('SearchPosition') }} type="navigation" placeholder="请输入工厂或门店关键词"></SearchView>
        </View>
        <LinearGradient colors={['rgba(82, 108, 221, 1)', 'rgba(82, 108, 221, 0.5)', 'rgba(82, 108, 221, 0.1)']} style={style.linearGradient}></LinearGradient>
        {/* 顶部 banner */}
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => { this.loadData() }}
            />
          }
        >
          <View style={style.carouselView}>
            <Carousel
              infinite={true}
              style={style.carousel}
              dotStyle={{ backgroundColor: 'rgba(125, 137, 179, 1)' }}
              dotActiveStyle={{ backgroundColor: '#fff' }}
            >
              {this.renderList()}
            </Carousel>
          </View>
          {/* 公告 */}
          <View style={style.noticesView}>
            <Image source={Icons.Home.NoticeIcon} style={style.noticesIcon} />
            <Image source={Icons.Home.NoticeText} style={style.noticesTextIcon} />
            <View style={style.noticesLine}></View>
            <Carousel
              infinite={true}
              style={style.notices}
              dots={false}
              vertical
            >
              {this.renderList2()}
            </Carousel>
          </View>
          {/* 安全借款 &  职员评价 */}
          <View style={style.twoTouchView}>
            <ImageBackground source={Icons.Home.BorrowMoney} style={[style.touchView, { marginRight: ScreenUtils.scaleSize(14) }]} imageStyle={style.touchViewBg}>
              <TouchableOpacity style={style.touch} onPress={() => this.props.navigation.navigate('Loan')}>
                <Text style={style.touchTitle}>员工借款</Text>
                <Text style={style.touchIntroduce}>员工申请预支工资</Text>
              </TouchableOpacity>
            </ImageBackground>
            <ImageBackground source={Icons.Home.Evaluate} style={style.touchView} imageStyle={style.touchViewBg}>
              <TouchableOpacity style={style.touch} onPress={() => this.props.navigation.navigate('Assess')}>
                <Text style={style.touchTitle}>职员评价</Text>
                <Text style={style.touchIntroduce}>真实评价、了解实情</Text>
              </TouchableOpacity>
            </ImageBackground>
          </View>

          <View style={style.positionHeader}>
            <Image source={Icons.Home.SwitchIcon} style={style.switchIcon} />
            <Text style={style.hostPositionTitle}>热门招聘</Text>
            <TouchableOpacity style={style.moreHotPositionBtn} onPress={() => { this.props.navigation.navigate('Jobs') }}>
              <Text style={style.moreHostPositionBtnText}>更多职位</Text>
              <Image source={Icons.Public.More} style={style.moreHostPositionBtnIcon} />
            </TouchableOpacity>
          </View>
          <View style={{
            backgroundColor: '#fff', paddingTop: ScreenUtils.scaleSize(15)
          }}>
            {
              this.state.jobs.list.map((item) => (
                <View key={item.id} style={style.positionItem}>
                  <JobCard
                    data={item}
                    onPress={() => { this.props.navigation.navigate('JobView', { id: item.id }) }}
                    onBtnPress={() => { this.props.navigation.navigate('ResumeInfo', { id: item.customer_id, name: item.name,jobId:item.id, }) }}
                  />
                </View>
              ))
            }
          </View>
        </ScrollView>
      </View>
    )
  }
}

const style = StyleSheet.create({
  content: {
    flex: 1,
    position: 'relative'
  },
  header: {
    paddingVertical: ScreenUtils.scaleSize(16),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(82, 108, 221, 1)',
    paddingHorizontal: ScreenUtils.scaleSize(15)
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
  carouselView: {
    paddingHorizontal: ScreenUtils.scaleSize(15),
    height: ScreenUtils.scaleSize(137),
  },
  carousel: {
    height: ScreenUtils.scaleSize(137),
    width: '100%'
  },
  carouseItem: {
    width: '100%',
    height: ScreenUtils.scaleSize(137),
    borderRadius: ScreenUtils.scaleSize(5),
    overflow: 'hidden'
  },
  carouseItemImg: {
    width: '100%',
    height: ScreenUtils.scaleSize(137),
  },
  noticesView: {
    height: ScreenUtils.scaleSize(50),
    backgroundColor: '#fff',
    paddingHorizontal: ScreenUtils.scaleSize(15),
    flexDirection: 'row',
    alignItems: 'center'
  },
  noticesIcon: {
    width: ScreenUtils.scaleSize(22),
    height: ScreenUtils.scaleSize(22)
  },
  noticesTextIcon: {
    width: ScreenUtils.scaleSize(26),
    height: ScreenUtils.scaleSize(12),
    marginLeft: ScreenUtils.scaleSize(4)
  },
  noticesLine: {
    marginLeft: ScreenUtils.scaleSize(10),
    width: ScreenUtils.scaleSize(0.5),
    height: ScreenUtils.scaleSize(13),
    backgroundColor: 'rgba(220, 223, 226, 1)'
  },
  notices: {
    flex: 1,
    marginLeft: ScreenUtils.scaleSize(10),
    width: ScreenUtils.scaleSize(170),
  },
  noticesItem: {
    height: '100%',
    width: '100%',

  },
  noticesText: {
    color: 'rgba(3, 0, 20, 1)',
    fontSize: ScreenUtils.scaleSize(13),
    lineHeight: ScreenUtils.scaleSize(50)
  },
  twoTouchView: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: ScreenUtils.scaleSize(10),
    padding: ScreenUtils.scaleSize(15)
  },
  touchView: {
    flex: 1,
    height: ScreenUtils.scaleSize(65),
  },
  touchViewBg: {
    width: '100%',
    height: ScreenUtils.scaleSize(65)
  },
  touch: {
    width: '100%',
    height: '100%',
    paddingHorizontal: ScreenUtils.scaleSize(15),
    justifyContent: 'center'
  },
  touchTitle: {
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(16),
    fontWeight: 'bold',
    marginBottom: ScreenUtils.scaleSize(7)
  },
  touchIntroduce: {
    color: 'rgba(224, 241, 254, 1)',
    fontSize: ScreenUtils.scaleSize(12),
    fontWeight: '500'
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: ScreenUtils.scaleSize(5),
    paddingHorizontal: ScreenUtils.scaleSize(15),
    backgroundColor: '#fff'
  },
  switchIcon: {
    width: ScreenUtils.scaleSize(22),
    height: ScreenUtils.scaleSize(22)
  },
  hostPositionTitle: {
    marginLeft: ScreenUtils.scaleSize(7),
    fontSize: ScreenUtils.scaleSize(16),
    fontWeight: 'bold',
    flex: 1
  },
  moreHotPositionBtn: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  moreHostPositionBtnText: {
    color: 'rgba(168, 168, 172, 1)',
    fontSize: ScreenUtils.scaleSize(13)
  },
  moreHostPositionBtnIcon: {
    marginLeft: ScreenUtils.scaleSize(2),
    width: ScreenUtils.scaleSize(15),
    height: ScreenUtils.scaleSize(15)
  },
  positionItem: {
    marginBottom: ScreenUtils.scaleSize(15),
    backgroundColor: '#fff',
    paddingHorizontal: ScreenUtils.scaleSize(15)
  },
  linearGradient: {
    position: 'absolute',
    zIndex: -1,
    top: ScreenUtils.scaleSize(48),
    width: '100%',
    height: ScreenUtils.scaleSize(135)
  },
})
