import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  Image,
  Button,
} from 'react-native'
import ScreenUtil from '../../../utils/ScreenUtils'
import page from '../../../components/Page'
import Icons from '../../../Icons'
import Textarea from 'react-native-textarea'
import { Portal, Provider, Toast } from '@ant-design/react-native'
import Api from '../../../utils/Api'

type Props = {
  navigation: any;
  route: any
};

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width


@page()
export default class ReviewsPage extends Component<Props> {
  state = {
    desc: ''
  }
  // componentDidMount(){
  //   console.log(this.props.route)
    
  // }
  render() {
    return (
      <Provider>
        <View style={styles.background}>
          <View style={styles.applyView}>
            <View style={styles.commentContentView}>
              <View style={styles.commentView}>
                <Image style={styles.commentImg} source={Icons.Apply.Edit} />
                <Text style={styles.commentHeaderText}>审批意见</Text>
                <View style={{ flex: 1 }}></View>
                <Text style={styles.commentHeaderText3}>最多300字</Text>
              </View>
              <View style={styles.commentAreaView}>
                {/* <Text style={styles.commentHeaderText3}>请输入您的审批意见</Text> */}
                <Textarea
                  value={this.state.desc}
                  onChangeText={(value: string) => { this.setState({ desc: value }) }}
                  placeholder="请输入职位描述信息"
                  style={styles.textArea}
                  placeholderTextColor="#A8A8AC"
                />
              </View>
            </View>
            <TouchableOpacity style={styles.subBtn} onPress={async () => {
              // 查看类型 
              const { type, id, goBack } = this.props.route.params
              const key = Toast.loading('loading')
              try {
                if (type === 0) {
                  // 拒绝借贷
                  await Api.put(`/labor/staff/loan/${id}`, { status: 6, real_amount: '', desc: '' })
                  Toast.success('成功')
                }
                Portal.remove(key)
                setTimeout(() => {
                  if (goBack) {
                    goBack()
                    this.props.navigation.goBack()
                  }
                }, 1000)
              } catch (error) {
                Portal.remove(key)
                Toast.fail(error.message)
              }
            }}>
              <Text style={styles.subText}>确认拒绝</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Provider >
    )
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
    zIndex: 0,
    backgroundColor: '#fff',
  },
  applyView: {
    flex: 1,
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
  commentContentView: {
    borderRadius: ScreenUtil.scaleSize(5),
  },
  commentHeaderText: {
    color: '#030014',
    fontSize: ScreenUtil.scaleSize(14),
  },
  commentView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: ScreenUtil.scaleSize(15),
    paddingVertical: ScreenUtil.scaleSize(15),
  },
  commentHeaderText3: {
    color: '#A8A8AC',
    fontSize: ScreenUtil.scaleSize(12),
  },
  commentAreaView: {
    backgroundColor: '#F3F5F7',
    marginHorizontal: ScreenUtil.scaleSize(15),
    padding: ScreenUtil.scaleSize(15),
    // height: ScreenUtil.scaleSize(130),
    borderRadius: ScreenUtil.scaleSize(5)
  },
  subBtn: {
    backgroundColor: '#526CDD',
    width: ScreenUtil.scaleSize(300),
    height: ScreenUtil.scaleSize(40),
    marginHorizontal: ScreenUtil.scaleSize(40),
    marginBottom: ScreenUtil.scaleSize(15),
    alignItems: 'center',
    justifyContent: 'center',
    padding: ScreenUtil.scaleSize(12),
    borderRadius: ScreenUtil.scaleSize(20),
    marginTop: ScreenUtil.scaleSize(250),
  },
  subText: {
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(15)
  },
  textArea: {
    // flex: 1,
    // width: ScreenUtils.scaleSize(250),
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    backgroundColor: '#F3F5F7',
  }
})
