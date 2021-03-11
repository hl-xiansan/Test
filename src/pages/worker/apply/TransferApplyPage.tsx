import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  ImageBackground,
  Button, ScrollView, Image, TouchableOpacity
} from 'react-native'
import ScreenUtil from '../../../utils/ScreenUtils'
import Api from '../../../utils/Api'
import page from '../../../components/Page'
import Icons from '../../../Icons'
import {getDateString} from "../jobs/ResumeInfoPage";
import {workerInfo} from "../../../utils/worker";
import {NavigationProp} from "@react-navigation/native";

type Props = {
  navigation: NavigationProp<any>;
  route: any
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

export default class TransferApplyPage extends Component<Props> {
  state: any = {
    info: {
      sign_date: '',
      customer: {},
      employee: {},
    },
  };

  async componentDidMount() {
    this.props.navigation.setOptions({
      headerLeft: () => <TouchableOpacity activeOpacity={0.6} onPress={() => { this.props.navigation.reset({ index: 0, routes: [{ name: 'Index' }] }) }}>
        <Image source={Icons.Public.ReturnIcon} style={{
          height: ScreenUtil.scaleSize(22), width: ScreenUtil.scaleSize(22)
        }}/>
      </TouchableOpacity>,
    });
    const info: any = await workerInfo.getPerson();
    const res = await Api.get(`/labor/staff/jobs/apply/${info?.id}`);
    this.setState({
      info: res,
    });
  }

  toSign = () => {
    this.props.navigation.navigate('')
  }
  toNextPage = () => {
    this.props.navigation.navigate('ApplyDetail')
  }

  render() {
    const { info = {} } = this.state;
    const {
      customer = {}, employee = {}, staff={},
    } = info;
    return (
      <View style={styles.background}>
        <ImageBackground source={require('../../../assets/icons/apply/rectangle.png')} style={styles.topBg}>
          <ProcessView key={JSON.stringify(this.state)} state={this.state} />
          <View style={{ flex: 1 }} />
          <ApplyStatusView state={this.state} />
        </ImageBackground>
        <ScrollView style={styles.applyInfoView}>
          <TextItem title="签约日期" value={getDateString(new Date(info.sign_date), false)} />
          <TextItem title="甲方单位名称" value={customer.name} />
          <TextItem title="甲方联系人" value={staff.nickname} />
          <TextItem title="甲方单位地址" value={customer.address} />
          <TextItem title="乙方员工姓名" value={employee.name} />
          <TextItem title="员工手机号" value={employee.phone} />
          <TextItem title="员工身份证号" value={employee.id_no} />
          <TextItem title="员工住址" value={employee.address} />
          <TextItem title="签字确认" value={(
              <View>
                <Image style={styles.photo} source={{ uri: employee.autograph }} />
              </View>
          )} />
          <TextItem title='身份证照片' value={(
              <View style={{flexDirection: 'row'}}>
                <Image style={styles.photo} source={{ uri: employee?.authentication?.idcard_fore }} />
                <Image style={styles.photo} source={{ uri: employee?.authentication?.idcard_back }} />
              </View>
          )} />
        </ScrollView>

      </View>
    )
  }
}

const ProcessView = ({ state }: any) => {
  const { info = {} } = state;
  const {
    employee = {}, staff_name,
  } = info;
  return (
    <View style={styles.processView}>
      <View style={styles.stepView}>
        <ImageBackground source={Icons.Apply.CircleFill} style={styles.circleBg}>
          <Text>1</Text>
        </ImageBackground>
        <Text style={styles.step1Name}>{employee.name || 'xx'}-发起申请</Text>
        <Text style={styles.step1Time}>{getDateString(new Date(info.sign_date), false)}</Text>
      </View>
      <View style={styles.centerBar}></View>
      <View style={styles.stepView}>
        <ImageBackground source={Icons.Apply.CircleEmpty} style={styles.circleBg}>
          <Text>2</Text>
        </ImageBackground>
        <Text style={styles.step2Name}>{staff_name || '- -'}</Text>
        <Text style={styles.step2Time}>待审批</Text>
      </View>
    </View>
  )
}

const ApplyStatusView = ({ state }: any) => {
  const { info = {} } = state;
  const {
    employee = {},
  } = info;
  return (
    <View style={styles.applyStatusView}>
      <View style={styles.statusView}>
        <Text style={styles.applyText}>{employee.name || 'xx'}提交的签约申请</Text>
        <ImageBackground source={Icons.Apply.RoundRectangle} style={styles.statusTag}>
          <Text style={styles.tagText}>待处理</Text>
        </ImageBackground>
      </View>
      <Text style={styles.applyDesText}>你已成功申请签约，请等待管理员确认</Text>
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
  },
  topBg: {
    width: width,
    height: ScreenUtil.scaleSize(190),
  },
  processView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: ScreenUtil.scaleSize(60),
    marginTop: ScreenUtil.scaleSize(15),
  },
  stepView: {
    alignItems: 'center',
    marginLeft: ScreenUtil.scaleSize(20),
    marginRight: ScreenUtil.scaleSize(20),
    minWidth: '40%',
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
    marginLeft: ScreenUtil.scaleSize(30),
    marginRight: ScreenUtil.scaleSize(30),
    backgroundColor: '#95A8FD',
    height: ScreenUtil.scaleSize(2),
    width: ScreenUtil.scaleSize(58),
    marginTop: ScreenUtil.scaleSize(-35),
  },
  applyStatusView: {
    backgroundColor: '#fff',
    padding: ScreenUtil.scaleSize(15),
    borderRadius: ScreenUtil.scaleSize(5),
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
    height: ScreenUtil.scaleSize(350),
    marginTop: ScreenUtil.scaleSize(15),
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
  photo: {
    width: ScreenUtil.scaleSize(80),
    height: ScreenUtil.scaleSize(45),
    backgroundColor: 'orange',
    marginLeft: ScreenUtil.scaleSize(6),
  }
})
