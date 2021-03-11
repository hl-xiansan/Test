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

type Props = {
    navigation: any;
};
type ItemType = {
    title: string;
    value: any;
};
const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

@page({
  navigation: {
    headerShown: false
  }
})
export default class EmployeeDetailPage extends Component<Props> {

    toSign = () => {
      this.props.navigation.navigation('')
    }

    render() {
      return (
        <View style={styles.background}>
          <ScrollView>
            <ImageBackground source={require('../../../../assets/icons/apply/rectangle.png')} style={styles.topBg}>
              <ApplyStatusView />
            </ImageBackground>
            <View style={styles.applyInfoView}>
              <TextItem title="手机号码" value="13827391027" />
              <TextItem title="邮箱/QQ号" value="1111242775" />
              <TextItem title="本人现住地址" value="广东省珠海市香洲区" />
              <TextItem title="工作年限" value="3-5年" />
              <TextItem title="用人单位" value="深圳富士康" />
              <TextItem title="职位" value="普工" />
              <TextItem title="签约日期" value="2020-11-01" />
              <TextItem title="员工身份证号" value="210403199908072467" />
              <TextItem title="签字确认" value="赵飞" />
              <TextItem title="身份证照片" value={(
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.photo}>身份证</Text>
                  <Text style={styles.photo}>身份证</Text>
                </View>
              )} />
            </View>
          </ScrollView>
          <View style={styles.bottomBtns}>
            <TouchableOpacity activeOpacity={0.5} onPress={() => {this.props.navigation.navigate('ConfirmTheTermination')}}>
              <Text style={{...styles.btn, backgroundColor: '#FE9B16'}}>拒绝</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.5} onPress={() => {this.props.navigation.navigate('ConfirmTheContract')}}>
              <Text style={styles.btn}>通过</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
}

const ApplyStatusView = () => {
  return (
    <View style={styles.applyStatusView}>
      <Image source={require('../../../../assets/images/login-bg.png')} style={styles.userPhoto} />
      <View style={styles.rightBox}>
        <View style={styles.statusView}>
          <Text style={styles.applyText}>张三</Text>
          <ImageBackground source={require('../../../../assets/icons/apply/round_rectangle.png')} style={styles.statusTag}>
            <Text style={styles.tagText}>待签约</Text>
          </ImageBackground>
        </View>
        <View style={styles.rightBottomBox}>
          <Text style={styles.rightBottomItem}>性别：男</Text>
          <Text style={styles.rightBottomItem}>年龄：32岁</Text>
          <Text style={styles.rightBottomItem}>学历：大专</Text>
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
      {typeof value === 'string' ? (
        <Text style={styles.valueStyle}>{value}</Text>
      ) : value}
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
    zIndex: 0,
    paddingBottom: ScreenUtil.scaleSize(79),
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
    height: '100%',
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
  photo: {
    width: ScreenUtil.scaleSize(80),
    height: ScreenUtil.scaleSize(45),
    backgroundColor: 'orange',
    marginLeft: ScreenUtil.scaleSize(6),
  }
})
