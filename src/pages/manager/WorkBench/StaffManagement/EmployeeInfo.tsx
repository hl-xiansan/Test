import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground
} from 'react-native'
import ScreenUtil from '../../../../utils/ScreenUtils'
import page from '../../../../components/Page'
import Icons from '../../../../Icons'
import Api from '../../../../utils/Api'
import { calculateAge, getStatusCn } from '../../../../utils/Fn'
import {Route} from "@react-navigation/routers";
import {NavigationProp} from "@react-navigation/native";

type Props = {
  navigation: NavigationProp<any>;
  route: Route<string, { id: string | null, isManager:number | null }>
};
type ItemType = {
  title: string;
  value: string;
};
const height = Dimensions.get('window').height
const width = Dimensions.get('window').width
@page({
  navigation: {
    headerShown: false
  }
})

export default class EmployeeInfoPage extends Component<Props> {
  state = {
    data: {},
  }
  // toSign = () => {
  //   this.props.navigation.navigation('')
  // }

  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo = async () => {
    const userId = this.props.route.params.id
    if (!userId) return
    try {
      const res = await Api.get(`/labor/staff/worker/${userId}`)
      console.log('处理员工签约信息页面',res);
      this.setState({
        data: res ?? {},
      })
    } catch (e) {
      console.error(e)
    }
  }

  render() {
    const data: any = this.state.data ?? {}

    return (
      <View style={styles.background}>
        <ImageBackground source={require('../../../../assets/icons/apply/rectangle.png')} style={styles.topBg}>
          <ApplyStatusView data={data} />
        </ImageBackground>
        <View style={styles.applyInfoView}>
          <TextItem title="手机号码" value={data.phone ?? data.telephone} />
          <TextItem title="邮箱/QQ号" value={data.qq ?? data.email ?? ''} />
          <TextItem title="本人现住地址" value={data.address} />
          <TextItem title="工作年限" value={data.working?.reduce((count:any, x:any) => {
            if (typeof x?.on_job_time === 'number') { return count + x.on_job_time }
            return count
          }, 0)} />
          <TextItem title="用人单位" value="珠海市通途劳务派遣有限公司" />
          <TextItem title="派遣单位" value={ data.customer_name }/>
          <TextItem title="职位" value={data.position} />
          <TextItem title="入职时间" value={data.entry_date} />
          <View style={styles.bottomBox} >
            <TouchableOpacity style={styles.handleComment} onPress={()=>{ this.props.navigation.navigate('CommentAdd',{ id:data.id,goBack:()=>{ this.getUserInfo() } }) }}>
              <Image source={Icons.WorkBench.AddComment} style={styles.icon} />
              <Text style={styles.commentText}>添加评论</Text>
            </TouchableOpacity>
            <View style={styles.line} />
            <TouchableOpacity style={styles.handleComment} activeOpacity={0.5} onPress={() => { this.props.navigation.navigate('EmployeeEvalualuationRes',{ id:data.id}) }}>
              <View style={styles.handleComment}>
                <Image source={Icons.WorkBench.ViewComment} style={styles.icon} />
                <Text style={styles.commentText}>查看评论</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* TODO status 1 */}
        { data.status === 1 && typeof this.props.route.params.isManager !== 'undefined' &&
        <View style={styles.bottomBtns}>
          <TouchableOpacity activeOpacity={0.5} onPress={() => {
            this.props.navigation.navigate('ConfirmTheTermination', { id: data.id, goBack: () => { this.getUserInfo() } })
          }}>
            <Text style={{
              ...styles.btn, backgroundColor: '#FE9B16'
            }}>强制解约</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} onPress={() => { this.props.navigation.navigate('ConfirmTheDeparture', { id: data.id, goBack: () => { this.getUserInfo() } }) }}>
            <Text style={styles.btn}>离职</Text>
          </TouchableOpacity>
        </View> }
        { data.status === 0 && typeof this.props.route.params.isManager !== 'undefined' &&
          <View style={styles.bottomBtns}>
          <TouchableOpacity activeOpacity={0.5} onPress={() => {
            // TODO 拒绝
          }}>
            <Text style={{
              ...styles.btn, backgroundColor: '#FE9B16'
            }}>拒绝</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} onPress={() => { this.props.navigation.navigate('ConfirmBatchProcess', { ids: [data.id], goBack: () => { this.getUserInfo() } }) }}>
            <Text style={styles.btn}>签约</Text>
          </TouchableOpacity>
        </View>}
      </View>
    )
  }
}

const ApplyStatusView = ({ data }: any) => {
  return (
    <View style={styles.applyStatusView}>
      <Image source={{uri: data.photo}} style={styles.userPhoto} />
      {/*<Image source={require('../../../../assets/images/login-bg.png')} style={styles.userPhoto} />*/}
      <View style={styles.rightBox}>
        <View style={styles.statusView}>
          <Text style={styles.applyText}>{data.name}</Text>
          <ImageBackground source={require('../../../../assets/icons/apply/round_rectangle.png')} style={styles.statusTag}>
            <Text style={styles.tagText}>{getStatusCn(data.status)}</Text>
          </ImageBackground>
        </View>
        <View style={styles.rightBottomBox}>
          <Text style={styles.rightBottomItem}>性别：{['未知', '男', '女'][data.gender ? data.gender : 0]}</Text>
          <Text style={styles.rightBottomItem}>年龄：{calculateAge(data.birth)}岁</Text>
          <Text style={styles.rightBottomItem}>学历：{data.qualifications}</Text>
        </View>
      </View>
    </View>
  )
}

const TextItem = (props: ItemType) => {
  const { title = '', value = '' } = props
  return (
    <View style={styles.textItemView}>
      <Text style={styles.nameStyle}>{title}</Text>
      <Text style={styles.valueStyle}>{value}</Text>
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
  topBg: {
    width: width,
    height: ScreenUtil.scaleSize(200),
  },
  centerBar: {
    backgroundColor: '#95A8FD',
    height: ScreenUtil.scaleSize(2),
    width: ScreenUtil.scaleSize(68),
  },
  applyStatusView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: ScreenUtil.scaleSize(12),
    borderRadius: ScreenUtil.scaleSize(5),
    marginHorizontal: ScreenUtil.scaleSize(15),
  },
  userPhoto: {
    width: ScreenUtil.scaleSize(45),
    height: ScreenUtil.scaleSize(45),
    borderRadius: 50,
  },
  rightBox: {
    flex: 1,
    marginLeft: ScreenUtil.scaleSize(10),
  },
  rightBottomBox: {
    flexDirection: 'row',
  },
  rightBottomItem: {
    borderWidth: ScreenUtil.scaleSize(1),
    borderColor: '#E3E6EA',
    color: '#A8A8AC',
    lineHeight: ScreenUtil.scaleSize(18),
    borderRadius: ScreenUtil.scaleSize(6),
    marginRight: ScreenUtil.scaleSize(8),
    paddingHorizontal: ScreenUtil.scaleSize(6),
  },
  statusView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ScreenUtil.scaleSize(10),
  },
  applyText: {
    color: '#030014',
    fontWeight: 'bold',
    fontSize: ScreenUtil.scaleSize(15)
  },
  statusTag: {
    width: ScreenUtil.scaleSize(53),
    height: ScreenUtil.scaleSize(19),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(12),
  },
  applyInfoView: {
    marginHorizontal: ScreenUtil.scaleSize(15),
    borderRadius: ScreenUtil.scaleSize(5),
    backgroundColor: '#fff',
    marginTop: ScreenUtil.scaleSize(-116),
  },
  textItemView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ScreenUtil.scaleSize(12),
    marginHorizontal: ScreenUtil.scaleSize(15),
    borderBottomWidth: 1,
    borderBottomColor: '#E7EBEF',
    borderStyle: 'dashed',
  },
  nameStyle: {
    color: '#545468',
    fontSize: ScreenUtil.scaleSize(13),
  },
  valueStyle: {
    color: '#030014',
    fontSize: ScreenUtil.scaleSize(13),
  },
  icon: {
    width: ScreenUtil.scaleSize(15),
    height: ScreenUtil.scaleSize(15),
    marginRight: ScreenUtil.scaleSize(5),
  },
  bottomBtns: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: ScreenUtil.scaleSize(59),
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  btn: {
    width: ScreenUtil.scaleSize(152),
    height: ScreenUtil.scaleSize(39),
    lineHeight: ScreenUtil.scaleSize(39),
    backgroundColor: '#526CDD',
    borderRadius: 50,
    textAlign: 'center',
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(15),
    borderTopColor: 'rgb(0, 0, 0)',
  },
  bottomBox: {
    flexDirection: 'row',
    height: ScreenUtil.scaleSize(57),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  handleComment: {
    flexDirection: 'row',
    width: '49%',
    justifyContent: 'center',
    alignItems: 'center',
    // borderRightColor: '#ccc',
    // borderRightWidth: ScreenUtil.scaleSize(1),
  },
  commentText: {
    color: '#526CDD',
    fontSize: ScreenUtil.scaleSize(13),
    fontWeight: 'bold',
  },
  line: {
    width: ScreenUtil.scaleSize(1),
    height: ScreenUtil.scaleSize(22),
    backgroundColor: '#EDEDF0',
  }
})
