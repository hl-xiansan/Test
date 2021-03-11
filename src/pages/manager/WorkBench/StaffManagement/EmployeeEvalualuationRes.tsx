import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  Image,
  ImageBackground, ScrollView,
} from 'react-native'
import ScreenUtil from '../../../../utils/ScreenUtils'
import page from '../../../../components/Page'
import Icons from '../../../../Icons'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { Portal, Provider, Toast } from '@ant-design/react-native'
import Api from '../../../../utils/Api'
import { TouchableOpacity } from 'react-native-gesture-handler'

type Props = {
  navigation: BottomTabNavigationProp<any>;
  route: any
};

type ItemType = {
  title: string
  star: number
  action?: (index: number) => void
}

type CommentItemPropsType = {
  title: string;
  content: string;
  date: string;
};

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

@page({
  navigation: {
    title: 'EmployeeEvalualuationRes',
  }
})
export default class EmployeeEvalualuationResPage extends Component<Props> {
  state = {
    list: [],
    num1: 0,
    num2: 0,
    num3: 0,
    server: 0,
    ability: 0,
    attitude: 0,
  }
  componentDidMount() {
    this.getData()
  }
  async getData() {
    const key = Toast.loading('loading')
    try {
      const id = this.props.route.params.id
      const res: any = await Api.get(`/labor/staff/comment/worker/${id}/list/1`, { params: { page: 1, size: 10000, id } })
      const list = res.list
      // const list = [
      //   {
      //     employee_name: '雇员名',
      //     server: 1,
      //     attitude: 2,
      //     ability: 3,
      //     result: '好评',
      //     content: '内容',
      //     staff_name: '名字',
      //     create_time: '2010-12-12',
      //   },
      //   {
      //     employee_name: '雇员名',
      //     server: 3,
      //     attitude: 2,
      //     ability: 3,
      //     result: '差评',
      //     content: '内容',
      //     staff_name: '名字',
      //     create_time: '2010-12-12',
      //   }
      // ]
      const obj = {
        num1: 0,
        num2: 0,
        num3: 0,
        server: 0,
        ability: 0,
        attitude: 0,
      }
      list.map((item) => {
        if (item.result === '好评') obj.num1 += 1
        else if (item.result === '中评') obj.num2 += 1
        else if (item.result === '差评') obj.num3 += 1
        obj.server += item.server
        obj.ability += item.ability
        obj.attitude += item.attitude
      })
      obj.server = parseInt(obj.server / list.length + '')
      obj.ability = parseInt(obj.ability / list.length + '')
      obj.attitude = parseInt(obj.attitude / list.length + '')

      this.setState({ list,...obj })


      Portal.remove(key)
    } catch (error) {
      Portal.remove(key)
      Toast.fail(error.message)
    }
  }
  render() {
    return (
      <Provider>
        <ScrollView style={styles.background}>
          <View style={styles.applyView}>
            <View style={styles.commentContentView}>
              <View style={{
                ...styles.commentHeaderView,
                flexDirection: 'column',
              }}>
                <View style={{
                  ...styles.commentHeaderView,
                  marginHorizontal: 0,
                  paddingVertical: 0,
                  marginBottom: 0,
                  borderBottomWidth: 0,
                }}>
                  <Image source={Icons.Apply.Comment} style={styles.commentImg} />
                  <Text style={styles.commentHeaderText}>张三的综合评价结果</Text>
                  <View style={{ flex: 1 }}></View>
                </View>
                <View style={{ width: '100%', flexDirection: 'row', marginTop: ScreenUtil.scaleSize(10) }}>
                  <Text style={styles.tagText}>好评（{this.state.num1}）</Text>
                  <Text style={styles.tagText}>中评（{this.state.num2}）</Text>
                  <Text style={styles.tagText}>差评（{this.state.num3}）</Text>
                </View>
              </View>
              <ScoreItem title="服务" star={this.state.server} />
              <ScoreItem title="态度" star={this.state.attitude} />
              <ScoreItem title="能力" star={this.state.ability} />
            </View>
            <View style={styles.commentContentView}>
              <View style={styles.commentHeaderView}>
                <Image style={styles.commentImg} source={Icons.Apply.Detail} />
                <Text style={styles.commentHeaderText}>评价详情</Text>
              </View>
              <View style={styles.commentView}>
                {this.state.list.map((item: any, index: number) => <CommentItem
                  key={index}
                  title={item.staff_name}
                  content={item.content}
                  date={item.create_time}
                />)}
              </View>
            </View>
          </View>
        </ScrollView>
      </Provider>
    )
  }
}

export const ScoreItem = ({ title, star, action }: ItemType) => {
  const renderStar = () => {
    const arr = []
    for (let index = 0; index < 5; index++) {

      arr.push(
        <TouchableOpacity key={index} activeOpacity={0.8} onPress={() => { if (action) action(index) }}>
          <Image style={styles.starImg} source={index < star ? Icons.Apply.StarFill : Icons.Apply.StarEmpty} />
        </TouchableOpacity >
      )
    }
    return arr
  }
  return (
    <View style={styles.scoreItemView}>
      <Text style={styles.headerText}>{title}：</Text>
      <View style={{ flex: 1 }}></View>
      {renderStar()}
    </View>
  )
}

const CommentItem = (props: CommentItemPropsType) => {
  const { title, content, date } = props
  return (
    <View style={styles.commentDetailBox}>
      <View style={styles.commentTitleBox}>
        <Text style={styles.commentTitleText}>{title}</Text>
        <Text style={styles.commentTitleStatus}>好评</Text>
      </View>
      <View style={styles.commentContentBox}>
        <Text>{content}</Text>
        <Text style={styles.commentContentDate}>{date}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    // height: height,
    zIndex: 0,
  },
  applyView: {
    flex: 1,
  },
  commentImg: {
    width: ScreenUtil.scaleSize(21),
    height: ScreenUtil.scaleSize(21),
    marginRight: ScreenUtil.scaleSize(6),
  },
  rectangleIcon: {
    borderRightColor: 'transparent',
    borderTopColor: '#526CDD',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderWidth: ScreenUtil.scaleSize(6),
    marginTop: ScreenUtil.scaleSize(7),
    marginLeft: ScreenUtil.scaleSize(10),
  },
  headerText: {
    color: '#545468',
    fontSize: ScreenUtil.scaleSize(12)
  },
  commentContentView: {
    backgroundColor: '#fff',
    marginHorizontal: ScreenUtil.scaleSize(15),
    borderRadius: ScreenUtil.scaleSize(5),
    marginTop: ScreenUtil.scaleSize(15),
  },
  commentHeaderView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: ScreenUtil.scaleSize(15),
    paddingVertical: ScreenUtil.scaleSize(15),
    borderBottomColor: '#E7EBEF',
    borderBottomWidth: 1,
    marginBottom: ScreenUtil.scaleSize(20),
  },
  commentHeaderText: {
    fontWeight: 'bold',
    color: '#030014',
    fontSize: ScreenUtil.scaleSize(14),
  },
  commentHeaderText2: {
    color: '#526CDD',
    fontSize: ScreenUtil.scaleSize(12),
  },
  scoreItemView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: ScreenUtil.scaleSize(15),
    marginBottom: ScreenUtil.scaleSize(20)
  },
  starImg: {
    width: ScreenUtil.scaleSize(19),
    height: ScreenUtil.scaleSize(19),
    marginLeft: ScreenUtil.scaleSize(15),
  },
  commentView: {
    marginHorizontal: ScreenUtil.scaleSize(15),
    paddingBottom: ScreenUtil.scaleSize(10)
  },
  commentHeaderText3: {
    color: '#A8A8AC',
    fontSize: ScreenUtil.scaleSize(12),
  },
  commentAreaView: {
    backgroundColor: '#F3F5F7',
    marginHorizontal: ScreenUtil.scaleSize(15),
    padding: ScreenUtil.scaleSize(15),
    height: ScreenUtil.scaleSize(130)
  },
  subBtn: {
    backgroundColor: '#526CDD',
    width: ScreenUtil.scaleSize(300),
    height: ScreenUtil.scaleSize(40),
    marginHorizontal: ScreenUtil.scaleSize(40),
    marginTop: ScreenUtil.scaleSize(20),
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
  statusTag: {
    width: ScreenUtil.scaleSize(53),
    height: ScreenUtil.scaleSize(19),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    width: ScreenUtil.scaleSize(75),
    height: ScreenUtil.scaleSize(23),
    textAlign: 'center',
    lineHeight: ScreenUtil.scaleSize(23),
    color: '#545468',
    fontSize: ScreenUtil.scaleSize(12),
    backgroundColor: '#F3F5F7',
    borderRadius: ScreenUtil.scaleSize(20),
    marginRight: ScreenUtil.scaleSize(10),
  },
  commentDetailBox: {
    marginBottom: ScreenUtil.scaleSize(20),
  },
  commentTitleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: ScreenUtil.scaleSize(10),
  },
  commentContentBox: {
    padding: ScreenUtil.scaleSize(10),
    backgroundColor: '#F3F5F7',
    borderRadius: ScreenUtil.scaleSize(6),
  },
  commentTitleText: {
    color: '#030014',
    fontWeight: 'bold',
    fontSize: ScreenUtil.scaleSize(15),
  },
  commentTitleStatus: {
    color: '#fff',
    backgroundColor: '#02CD65',
    borderRadius: ScreenUtil.scaleSize(20),
    paddingHorizontal: ScreenUtil.scaleSize(8),
    height: ScreenUtil.scaleSize(17),
    lineHeight: ScreenUtil.scaleSize(17),
  },
  commentContentDate: {
    marginTop: ScreenUtil.scaleSize(20),
    color: '#A8A8AC',
  }
})
