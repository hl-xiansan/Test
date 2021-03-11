import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  Image, ScrollView, DeviceEventEmitter,
} from 'react-native'
import { List, Picker, Portal, Provider, Toast } from '@ant-design/react-native'
import ScreenUtil from '../../../../utils/ScreenUtils'
import page from '../../../../components/Page'
import Icons from '../../../../Icons'
import ScreenUtils from '../../../../utils/ScreenUtils'
import { TextInput } from 'react-native-gesture-handler'
import Api from '../../../../utils/Api'
import {workerInfo} from "../../../../utils/worker";


type Props = {
  navigation: any;
  route: any
};

type ItemType = {
  title: string
  star: number
  action?: (index: number) => void
}
type State = {
  server: number
  attitude: number
  abilityint: number
  result: number
  content: string,

}

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width
const CONFIG_ARR = [{ label: '好评', value: 0, }, { label: '中评', value: 1, }, { label: '差评', value: 2, }]

@page()
export default class ReviewsPage extends Component<Props, State> {
  loading: number | null = null
  isUnmount = false
  isEdith = false
  readonly state: State = {
    server: 0,
    attitude: 0,
    abilityint: 0,
    result: 0,
    content: '',
  }
  componentDidMount() {
    if (this.props.route.params.item) {
      this.isEdith = true
      const { server, attitude, ability, content, result } = this.props.route.params.item
      let value = 0
      for (let index = 0; index < CONFIG_ARR.length; index++) {
        const element = CONFIG_ARR[index]
        if (element.label === result) {
          value = element.value
          break
        }
      }
      this.setState({ server, attitude, abilityint: ability, content, result: value })
    }

  }
  componentWillUnmount() {
    this.isUnmount = true
  }
  async handleBtn() {
    // console.log(this.props.route)
    if (this.loading !== null) return
    this.loading = Toast.loading('loading')

    let user = await workerInfo.getUser();

    const { server, attitude, abilityint, content, result } = this.state
    const data: any = {
      // employee_id: this.props.route.params.id,
      server, attitude, ability: abilityint, content,
      staff_name: user?.nickname,
      result: CONFIG_ARR[result].label
    }

    try {
      let text = '点评成功'
      if (this.isEdith) {
        const id = this.props.route.params.item.id
        await Api.put<any>(`/labor/staff/comment/${id}`, data)
        text = '修改'
      }
      else {
        data.employee_id = this.props.route.params.id
        await Api.post<any>('/labor/staff/comment', data)
      }

      if (this.isUnmount) return
      Toast.success(text)
      setTimeout(() => {
        this.props.route.params.goBack()
        if(!this.isEdith)DeviceEventEmitter.emit('mannager_comment_sent')
        this.props.navigation.goBack()
      }, 500)
      // 返回上一页，上一页重新加载
      Portal.remove(this.loading)
    } catch (error) {
      if (this.isUnmount) return
      Portal.remove(this.loading)
      Toast.fail(error.message)
    }
    this.loading = null
  }
  render() {
    return (
      <Provider>
        <ScrollView style={styles.background}>
          <View style={styles.applyView}>
            <View style={styles.headerTextView}>
              <Text style={styles.headerText}>本评价为保密性评价，仅供管理人员查看</Text>
            </View>
            <View style={styles.commentContentView}>
              <View style={styles.commentHeaderView}>
                <Image source={Icons.Apply.Comment} style={styles.commentImg} />
                <Text style={styles.commentHeaderText}>评价</Text>
                <View style={{ flex: 1 }}></View>
                <Text style={styles.commentHeaderText2}>{CONFIG_ARR[this.state.result].label}</Text>
                <Picker
                  data={[CONFIG_ARR]}
                  title={'选择评价'}
                  value={[this.state.result]}
                  cascade={false}
                  onOk={(result) => {
                    this.setState({ result: result[0] })
                  }}
                  cols={1}
                >
                  <List.Item style={{ marginLeft: 0, display: 'flex', width: ScreenUtil.scaleSize(30), height: ScreenUtil.scaleSize(30), position: 'relative', opacity: 0 }} ></List.Item>
                </Picker>
                <View style={styles.rectangleIcon} pointerEvents={'none'}></View>
              </View>
              <ScoreItem title="服务" star={this.state.server} action={(index) => { this.setState({ server: index + 1 }) }} />
              <ScoreItem title="态度" star={this.state.attitude} action={(index) => { this.setState({ attitude: index + 1 }) }} />
              <ScoreItem title="能力" star={this.state.abilityint} action={(index) => { this.setState({ abilityint: index + 1 }) }} />
            </View>
            <View style={styles.commentContentView}>
              <View style={styles.commentView}>
                <Image style={styles.commentImg} source={Icons.Apply.Edit} />
                <Text style={styles.commentHeaderText}>评价内容</Text>
                <View style={{ flex: 1 }}></View>
                <Text style={styles.commentHeaderText3}>最多300字</Text>
              </View>
              <View style={styles.commentAreaView}>
                <TextInput
                  placeholder={'请输入您的评价内容'}
                  placeholderTextColor={'#A8A8AC'}
                  style={styles.commentHeaderText3}
                  editable
                  value={this.state.content}
                  onChangeText={(text) => { this.setState({ content: text }) }}
                  multiline={true}

                />
              </View>
            </View>
            <TouchableOpacity style={styles.subBtn} onPress={this.handleBtn.bind(this)}>
              <Text style={styles.subText}>评 价</Text>
            </TouchableOpacity>
          </View>
        </ScrollView >
      </Provider >
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

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
    zIndex: 0,
  },
  applyView: {
    flex: 1,
  },
  headerTextView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: ScreenUtil.scaleSize(12),
    backgroundColor: '#fff',
  },
  headerText: {
    color: '#545468',
    fontSize: ScreenUtil.scaleSize(12)
  },
  commentImg: {
    width: ScreenUtil.scaleSize(21),
    height: ScreenUtil.scaleSize(21),
    marginRight: ScreenUtil.scaleSize(6),
  },
  rectangleIcon: {
    // position: 'absolute',
    // left: -15,
    // top: -10,
    borderRightColor: 'transparent',
    borderTopColor: '#526CDD',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderWidth: ScreenUtil.scaleSize(6),
    marginTop: ScreenUtil.scaleSize(7),
    marginLeft: ScreenUtil.scaleSize(-20),
  },
  commentContentView: {
    backgroundColor: '#fff',
    marginHorizontal: ScreenUtil.scaleSize(15),
    borderRadius: ScreenUtil.scaleSize(5),
    marginTop: ScreenUtil.scaleSize(15),
    paddingBottom: ScreenUtil.scaleSize(15),
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
    flexDirection: 'row',
    // alignItems: 'center',
    marginHorizontal: ScreenUtil.scaleSize(15),
    paddingVertical: ScreenUtil.scaleSize(15),
  },
  commentHeaderText3: {
    color: '#555',
    // backgroundColor: '#00cc00',
    textAlignVertical: 'top',
    height: '100%',
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
  }
})
