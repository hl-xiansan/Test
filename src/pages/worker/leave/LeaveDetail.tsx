import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs'
import React, {Component} from 'react'
import {ImageBackground, ScrollView, StyleSheet, Text, View} from 'react-native'
import Icons from '../../../Icons'
import ScreenUtils from '../../../utils/ScreenUtils'
import LinearGradient from 'react-native-linear-gradient'
import Page from '../../../components/Page'
import {Portal, Provider, Toast} from '@ant-design/react-native'
import Api from '../../../utils/Api'
import {formatDate} from './Leave'
import {Route} from "@react-navigation/native";

const ICONS = [
  Icons.Apply.RoundRectangle,
  Icons.Apply.GreenRectangle,
  Icons.Apply.OrangeRectangle,
]

const TEXTS = {
  0: '待审核',
  5: '在职',
  10: '申请离职',
  11: '不被批准',
  15: '终止',
  16: '被辞退',
}
type Props = {
  navigation: BottomTabNavigationProp<any>
  route: Route<string, { id: string }>
}

interface State {
  data: any
}

@Page()
export default class LeaveDetail extends Component<Props, State> {
  isU = false
  isLoading = false
  readonly state: State = {
    data: null
  }

  componentWillUnmount() {
    this.isU = true
  }

  componentDidMount() {
    this.getData()
  }

  async getData() {
    if (this.isLoading) return
    this.isLoading = true
    const {id} = this.props.route.params
    const key = Toast.loading('loading')
    console.log(id)
    try {
      const res = await Api.get('/labor/my/jobs/out/detail/' + this.props.route.params.id)
      this.isLoading = false
      this.setState({data: res})
      console.log(res)
      Portal.remove(key)
    } catch (error) {
      this.isLoading = false
      Portal.remove(key)
      Toast.fail(error.message)
    }
  }

  getStatus(status: number) {
    switch (status) {
      case 0:
        return '待审核';
      case 5:
        return '在职';
      case 10:
        return '申请离职';
      case 11:
        return '不被批准';
      case 15:
        return '终止';
      case 16:
        return '被辞退';
      default:
        return '申请离职';
    }
  }

  render() {
    return (
      <Provider>
        <View style={styles.content}>
          <LinearGradient colors={['rgba(82, 108, 221, 1)', 'rgba(82, 108, 221, 0.5)', 'rgba(82, 108, 221, 0.01)']}
            style={styles.linearGradient}/>
          <View>
            <View style={styles.backColor}/>
            <View style={styles.progress}>
              <View style={styles.progressItemBox}>
                <View style={{...styles.baseStatus, ...styles.applying}}>
                  <Text style={styles.baseStatusNumber}>1</Text>
                </View>
                <Text
                  style={{...styles.baseStatusText, ...styles.applyingText}}>{this.state.data?.employee_name}-发起申请</Text>
                {/* <Text style={{ ...styles.baseStatusText, ...styles.applyingText, ...styles.date }}>2020-10-12 12:23</Text> */}
              </View>
              <View style={styles.line}/>
              <View style={styles.progressItemBox}>
                <View style={{...styles.baseStatus, ...styles.agreed}}>
                  <Text style={styles.baseStatusNumber}>2</Text>
                </View>
                <Text style={{...styles.baseStatusText, ...styles.agreedText}}>{this.state.data?.staff_name}</Text>
                <Text style={{...styles.baseStatusText, ...styles.agreedText, ...styles.date}}>
                  {this.state.data&&this.state.data.status === 10?'待审批':'已审核'}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.titleBox}>
            <View style={styles.leftBox}>
              <Text style={styles.leftTitle}>{this.state.data?.employee_name}提交的离职申请</Text>
              <Text style={styles.leftSubTitle}>{this.state.data?.customer_name}</Text>
            </View>
            <ImageBackground source={Icons.Apply.RoundRectangle} style={styles.priceView}>
              <Text style={styles.priceViewText}>{this.getStatus(this.state.data?.status)}</Text>
            </ImageBackground>
          </View>
          <ScrollView style={styles.scroll}>
            <View style={styles.contentBox}>
              <View style={styles.boxContent}>
                <View style={styles.item}>
                  <Text style={styles.itemLable}>申请日期</Text>
                  <Text>{this.state.data?.create_time ? formatDate(new Date(this.state.data?.create_time)) : null}</Text>
                </View>
              </View>
              <View style={styles.boxContent}>
                <View style={styles.item}>
                  <Text style={styles.itemLable}>申请人</Text>
                  <Text>{this.state.data?.employee_name}</Text>
                </View>
              </View>
              <View style={styles.boxContent}>
                <View style={styles.item}>
                  <Text style={styles.itemLable}>所在单位</Text>
                  <Text>{this.state.data?.customer_name}</Text>
                </View>
              </View>
              <View style={styles.boxContent}>
                <View style={styles.item}>
                  <Text style={styles.itemLable}>入职日期</Text>
                  <Text>{this.state.data?.sign_date ? formatDate(new Date(this.state.data?.sign_date)) : null}</Text>
                </View>
              </View>
              <View style={styles.boxContent}>
                <View style={styles.item}>
                  <Text style={styles.itemLable}>离职日期</Text>
                  <Text>{this.state.data?.quit_date ? formatDate(new Date(this.state.data?.quit_date)) : null}</Text>
                </View>
              </View>
              <View style={styles.boxContent}>
                <View style={styles.item}>
                  <Text style={styles.itemLable}>事由</Text>
                  <Text>{this.state.data?.desc}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'rgba(252, 253, 253, 1)',
    flex: 1,
    position: 'relative',
  },
  paddingBox: {
    paddingHorizontal: ScreenUtils.scaleSize(15)
  },
  backColor: {
    width: '100%',
    height: ScreenUtils.scaleSize(35),
    backgroundColor: 'rgba(82, 108, 221, 1)',
  },
  linearGradient: {
    position: 'absolute',
    zIndex: -2,
    top: ScreenUtils.scaleSize(35),
    width: '100%',
    height: ScreenUtils.scaleSize(150)
  },
  progress: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingLeft: ScreenUtils.scaleSize(20),
    paddingRight: ScreenUtils.scaleSize(20),
  },
  progressItemBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: ScreenUtils.scaleSize(-35),
  },
  line: {
    backgroundColor: '#95A8FD',
    width: ScreenUtils.scaleSize(71),
    height: ScreenUtils.scaleSize(2),
    marginTop: ScreenUtils.scaleSize(-20),
  },
  baseStatus: {
    width: ScreenUtils.scaleSize(32),
    height: ScreenUtils.scaleSize(32),
    lineHeight: ScreenUtils.scaleSize(32),
    borderRadius: ScreenUtils.scaleSize(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  baseStatusNumber: {
    color: '#526CDD',
    fontSize: ScreenUtils.scaleSize(18),
    fontWeight: 'bold',
  },
  applying: {
    backgroundColor: '#95A8FD',
    marginBottom: ScreenUtils.scaleSize(10),
  },
  agreed: {
    backgroundColor: '#fff',
    borderWidth: ScreenUtils.scaleSize(3),
    width: ScreenUtils.scaleSize(36),
    height: ScreenUtils.scaleSize(36),
    lineHeight: ScreenUtils.scaleSize(36),
    borderColor: '#95A8FD',
    borderRadius: ScreenUtils.scaleSize(18),
    marginBottom: ScreenUtils.scaleSize(8),
  },
  baseStatusText: {
    fontSize: ScreenUtils.scaleSize(12),
    // lineHeight: ScreenUtils.scaleSize(24),
  },
  applyingText: {
    color: '#C9D3FF'
  },
  agreedText: {
    color: '#fff'
  },
  titleBox: {
    backgroundColor: '#fff',
    borderRadius: ScreenUtils.scaleSize(5),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: ScreenUtils.scaleSize(15),
    marginLeft: ScreenUtils.scaleSize(15),
    marginRight: ScreenUtils.scaleSize(15),
    marginTop: ScreenUtils.scaleSize(11),
  },
  priceView: {
    width: ScreenUtils.scaleSize(65),
    height: ScreenUtils.scaleSize(20)
  },
  priceViewText: {
    textAlign: 'center',
    lineHeight: ScreenUtils.scaleSize(20),
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(13),
    fontWeight: '500'
  },
  leftBox: {},
  leftTitle: {
    fontWeight: 'bold',
    fontSize: ScreenUtils.scaleSize(15),
    lineHeight: ScreenUtils.scaleSize(20),
    marginBottom: ScreenUtils.scaleSize(15),
    color: '#030014',
  },
  leftSubTitle: {
    fontSize: ScreenUtils.scaleSize(12),
    // lineHeight: ScreenUtils.scaleSize(30),
    color: '#545468',
  },
  contentBox: {
    marginTop: ScreenUtils.scaleSize(-4),
    padding: ScreenUtils.scaleSize(15),
  },
  boxContent: {
    backgroundColor: '#fff',
    paddingHorizontal: ScreenUtils.scaleSize(15),
    borderRadius: ScreenUtils.scaleSize(5),
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: ScreenUtils.scaleSize(55),
    borderBottomWidth: ScreenUtils.scaleSize(1),
    borderColor: '#E7EBEF'
  },
  itemLable: {
    fontSize: ScreenUtils.scaleSize(14),
    color: '#545468',
  },
  scroll: {
    backgroundColor: 'rgba(220, 223, 226, 0.3)',
    zIndex: -2,
    position: 'relative',
  },
  date: {
    width: ScreenUtils.scaleSize(120),
    textAlign: 'center'
  }
})

