import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  ImageBackground,
  Image,
  ScrollView,
  Button
} from 'react-native'
import ScreenUtil from '../../../utils/ScreenUtils'
import page from '../../../components/Page'
import Icons from '../../../Icons'

type Props = {
  navigation: any;
};
type ItemType = {
  title: string;
  value?: string;
  render?: any;
};
const height = Dimensions.get('window').height
const width = Dimensions.get('window').width
@page({
  navigation: {
    headerShown: false
  }
})

export default class ApplyDetailPage extends Component<Props> {

  toSign = () => {
    this.props.navigation.navigation('')
  }
  toNextPage = () =>{
    this.props.navigation.navigate('Loan')
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.background}>
          <ImageBackground source={require('../../../assets/icons/apply/rectangle.png')} style={styles.topBg}>
            <ProcessView />
            <ApplyStatusView />
          </ImageBackground>
          <View style={styles.applyInfoView}>
            <TextItem title="签约日期" value="2020-11-05" />
            <TextItem title="甲方单位名称" value="锦绣通途" />
            <TextItem title="甲方联系人" value="张三胖" />
            <TextItem title="甲方单位地址" value="长沙岳麓区麓谷企业广场" />
            <TextItem title="乙方员工姓名" value="刘涛" />
            <TextItem title="员工手机号" value="18989896666" />
            <TextItem title="员工身份证号" value="110120198812150124" />
            <TextItem title="员工住址" value="广东省珠海市高新区海怡湾畔25号" />
            <TextItem title="签字确认" value="赵飞" />
            <TextItem title="身份证照片" render={idCard} />
          </View>
        </View>
      </ScrollView>
    )
  }
}

const ProcessView = () => {
  return (
    <View style={styles.processView}>
      <View style={styles.stepView}>
        <ImageBackground source={Icons.Apply.CircleFill} style={styles.circleBg}>
          <Text>1</Text>
        </ImageBackground>
        <Text style={styles.step1Name}>刘涛-发起申请</Text>
        <Text style={styles.step1Time}>2020-10-12 12:23</Text>
      </View>
      <View style={styles.centerBar}></View>
      <View style={styles.stepView}>
        <ImageBackground source={Icons.Apply.CircleEmpty} style={styles.circleBg}>
          <Text>2</Text>
        </ImageBackground>
        <Text style={styles.step2Name}>龙凤飞</Text>
        <Text style={styles.step2Time}>待审批</Text>
      </View>
    </View>
  )
}

const ApplyStatusView = () => {
  return (
    <View style={styles.applyStatusView}>
      <View style={styles.statusView}>
        <Text style={styles.applyText}>刘涛提交的签约申请</Text>
        <ImageBackground source={Icons.Apply.RoundRectangle} style={styles.statusTag}>
          <Text style={styles.tagText}>待处理</Text>
        </ImageBackground>
      </View>
      <Text style={styles.applyDesText}>你已成功申请签约，请等待管理员确认</Text>
    </View>
  )
}

const TextItem = (props: ItemType) => {
  const { title = '', value = '', render } = props
  return (
    <View style={styles.textItemView}>
      <Text style={styles.nameStyle}>{title}</Text>
      {
        render ? render() :
          <Text style={styles.valueStyle}>{value}</Text>
      }
    </View>
  )
}

const idCard = () => {
  return (
    <View style={styles.idCardView}>
      <Image style={styles.idCard} source={Icons.Apply.Card} />
      <Image style={styles.idCard} source={Icons.Apply.Card} />
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
  processView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: ScreenUtil.scaleSize(60),
    marginTop: ScreenUtil.scaleSize(15),
  },
  stepView: {
    alignItems: 'center'
  },
  circleBg: {
    alignItems: 'center',
    justifyContent: 'center',
    width: ScreenUtil.scaleSize(35),
    height: ScreenUtil.scaleSize(35),
    marginBottom: ScreenUtil.scaleSize(8)
  },
  step1Name: {
    color: '#C9D3FF',
    fontSize: ScreenUtil.scaleSize(12)
  },
  step1Time: {
    color: '#C9D3FF',
    fontSize: ScreenUtil.scaleSize(10)
  },
  step2Name: {
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(12)
  },
  step2Time: {
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(10)
  },
  centerBar: {
    backgroundColor: '#95A8FD',
    height: ScreenUtil.scaleSize(2),
    width: ScreenUtil.scaleSize(68),
  },
  applyStatusView: {
    backgroundColor: '#fff',
    padding: ScreenUtil.scaleSize(15),
    borderRadius: ScreenUtil.scaleSize(5),
    marginTop: ScreenUtil.scaleSize(10),
    marginHorizontal: ScreenUtil.scaleSize(15),
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
    fontSize: ScreenUtil.scaleSize(14)
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
  applyDesText: {
    color: '#545468',
    fontSize: ScreenUtil.scaleSize(12),
  },
  applyInfoView: {
    marginHorizontal: ScreenUtil.scaleSize(15),
    borderRadius: ScreenUtil.scaleSize(5),
    backgroundColor: '#fff',
    marginTop: -ScreenUtil.scaleSize(15),
  },
  textItemView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ScreenUtil.scaleSize(10),
    marginHorizontal: ScreenUtil.scaleSize(15),
    borderBottomWidth: 1,
    borderBottomColor: '#E7EBEF',
    borderStyle: 'dashed',
  },
  nameStyle: {
    color: '#545468',
    fontSize: ScreenUtil.scaleSize(12),
  },
  valueStyle: {
    color: '#030014',
    fontSize: ScreenUtil.scaleSize(12),
  },
  idCardView: {
    flexDirection: 'row',
  },
  idCard: {
    width: ScreenUtil.scaleSize(77),
    height: ScreenUtil.scaleSize(43),
    marginLeft: ScreenUtil.scaleSize(10),
  }

})
