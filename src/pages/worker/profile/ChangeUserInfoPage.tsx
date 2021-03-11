import React, {Component} from 'react';
import {View, Text, TextInput, Image, StyleSheet, Dimensions, SafeAreaView, DeviceEventEmitter} from 'react-native';
import {Picker, Toast, Portal, Provider, List} from '@ant-design/react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CommonUtils from '../../../utils/CommonUtils';
import Api from '../../../utils/Api';
import ScreenUtil from '../../../utils/ScreenUtils'
import Icons from "../../../Icons";
import {UPDATE_WORKER_INFO, workerInfo} from "../../../utils/worker";


type Props = {
  navigation: any;
  route: any;
  store: any;
};

type State = any;

const CHANGE_TYPE: any = {
  'name': '编辑姓名',
  'id_no': '编辑身份证号',
  'address': '编辑住址',
};

const PLACEHOLDER:any = {
  name: '姓名',
  id_no: '身份证号',
  address: '详细地址',
};
const editArrs = ['name', 'id_no', 'address', 'province_id', 'city_id'];

const CustomItem = (props: any) => (
    <TouchableOpacity onPress={props.onPress} style={{height: '100%'}}>
        <View style={{
          ...styles.changeInfoContent, justifyContent: 'flex-end', paddingRight: 0
        }}>
          <Text style={{
            textAlign: 'right', color: props.color, fontSize: 15
          }}>{props.text}</Text>
          <Image source={Icons.Public.More} style={styles.itemMoreIcon}/>
        </View>
    </TouchableOpacity>
);

export default class ChangeUserInfoPage extends Component<Props, State> {
  private emitter: any;
  constructor(props: Readonly<Props>) {
    super(props);
    const changType: string = props.route.params.changType;
    const name: string = props.route.params.name;
    const id_no: string = props.route.params.id_no;
    const address: string = props.route.params.address;
    this.state = {
      name: name,
      id_no: id_no,
      address: address,
      changeType: changType,
      allData: {},
      addressPickerValue: [],
      addressData: [],
      addressObj: {},
    };
    this.emitter = null;
  }

  changeUserInfo = () => {
    const key = Toast.loading('正在保存...', 0);
    const {addressPickerValue, changeType} = this.state;

    const assignData = { ...this.state.allData };
    if (!this.state[changeType]) {
      Portal.remove(key)
      return Toast.fail('内容不能为空');
    }

    if (changeType === 'name') {
      assignData.nickname = this.state.name
    }

    if (changeType === 'id_no') {
      if (!CommonUtils.isCardID(this.state.id_no)) {
        Portal.remove(key)
        return Toast.fail('身份证格式不正确', 2);
      }
      assignData.extras.person.id_no = this.state.id_no
    }

    if (changeType === 'address') {
      if (!addressPickerValue[0] || !addressPickerValue[1]) {
        Portal.remove(key)
        return Toast.fail('请选择省市', 2);
      }
      assignData.extras.person.province_id = addressPickerValue[0];
      assignData.extras.person.city_id = addressPickerValue[1];
      assignData.extras.person.address = this.state.address
    }
    // const params:any = {};
    // Object.keys(this.state).forEach(ite => {
    //   if (this.state[ite] && editArrs.includes(ite)) {
    //     if (editArrs.includes(ite)) {
    //       params.extras = this.state.allData?.extras || {};
    //       if (!params.extras.person) {
    //         params.extras.person = {};
    //       }
    //       params.extras.person[ite] = this.state[ite];
    //     } else {
    //       params[ite] = this.state[ite];
    //     }
    //   }
    // });

    if (changeType === 'address') {

    }
    CommonUtils.changeUserInfo(assignData).then(async (res) => {
      await workerInfo.getUser(true)
      await workerInfo.getPerson(true)
      DeviceEventEmitter.emit(UPDATE_WORKER_INFO)
      Portal.remove(key)
      Toast.success('修改成功', 1, () => {
        this.props.navigation.navigate('MyProfile', { key: +(new Date()) });
      })
    }).catch((err) => {
      Portal.remove(key)
      Toast.fail(err.message, 1)
    })
  }

  // 获取个人信息
  getUserInfo = async () => {
    const res = await workerInfo.getProfile();
    this.setState({
      allData: res,
      addressPickerValue: (res?.extras?.person?.province_id && res?.extras?.person?.city_id)
          ? [res?.extras?.person?.province_id, res?.extras?.person?.city_id] : [],
    });
  }

  getAddressData = async () => {
    const res: any[] = await Api.get('/gateway/dicts/tree?group=address');
    const flatAddressObj: any = {};
    function handleAddressData(arr: any[] = []) {
      arr.forEach(ite => {
          flatAddressObj[ite.value] = ite.label;
          if (ite.children && ite.children.length > 0) handleAddressData(ite.children)
      });
    }
    handleAddressData(res);
    this.setState({
        addressData: res || [],
        addressObj: flatAddressObj,
    });
  }

  _renderHeaderTitle = () => {
    return (
      <View style={styles.headerTitleContent}>
        <TouchableOpacity activeOpacity={0.6} onPress={() => { this.props.navigation.goBack() }}>
          <Image source={Icons.Public.ReturnIcon} style={{
            height: ScreenUtil.scaleSize(22), width: ScreenUtil.scaleSize(22)
          }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{CHANGE_TYPE[this.state.changeType]}</Text>
        <View style={styles.sureBtn}>
          <Text style={styles.sureText}> </Text>
        </View>
      </View>
    );
  };

  changeValue = (value: string) => {
    const newState:any = {};
    newState[this.state.changeType] = value;
    this.setState({ ...newState });
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      headerCenter: () => this._renderHeaderTitle(),
      headerLeft: () => null,
    });
    if (this.state.changeType === 'address') {
      this.getAddressData();
    }
    this.emitter = DeviceEventEmitter.addListener(UPDATE_WORKER_INFO, () => {
      this.getUserInfo();
    });
    this.getUserInfo();
  }

  componentWillUnmount(): void {
    this.emitter.remove()
  }

  render() {
    const {changeType, addressObj, addressPickerValue} = this.state;
    return (
      <Provider>
        <SafeAreaView style={styles.container}>
          {changeType === 'address' && (
            <View style={{
              ...styles.changeInfoContent,
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderBottomWidth: 1,
              borderBottomColor: '#ccc',
              height: ScreenUtil.scaleSize(55)}}
            >
              <Text style={{fontWeight: 'bold'}}>地区</Text>
              <View style={{flex: 1}}><Picker
                  title="选择地区"
                  data={this.state.addressData}
                  cols={2}
                  value={addressPickerValue}
                  onOk={v => {
                    this.setState({ addressPickerValue: v });
                  }}
              >
                  <CustomItem text={addressPickerValue && addressPickerValue.length > 1
                      ? `${addressObj[addressPickerValue[0]] || ''} - ${addressObj[addressPickerValue[1]] || ''}`
                      : '选择地区'} color={addressPickerValue && addressPickerValue.length > 1 ? '#000' : '#c3c3c3'}/>
              </Picker>
              </View>
            </View>
          )}
          <View style={styles.changeInfoContent}>
            {changeType === 'address' && <Text style={{fontWeight: 'bold'}}>详细地址</Text>}
            <TextInput
              defaultValue={this.state[changeType]}
              style={{
                ...styles.infoText, ...(changeType === 'address' ? {textAlign: 'right'} : {})
              }}
              onChangeText={(value) => {this.changeValue(value)}}
              returnKeyType="done"
              placeholder={`请输入${PLACEHOLDER[changeType]}`}
            />
          </View>
          <View style={styles.bottomBtns}>
            <TouchableOpacity activeOpacity={0.5} onPress={() => this.changeUserInfo()}>
              <Text style={styles.btn}>确定修改</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Provider>
    );
  }
}

const screenWidth = Math.round(Dimensions.get('window').width);
const styles = StyleSheet.create({
  headerTitleContent: {
    flexDirection: 'row',
    width: screenWidth - 18,
    alignItems: 'center',
  },
  cancleBtn: {
    backgroundColor: 'transparent',
    paddingRight: ScreenUtil.scaleSize(24),
    borderWidth: 0
  },
  cancleText: {
    color: 'rgba(23, 29, 53, 1)',
    fontSize: 17
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
  },
  sureBtn: {
    backgroundColor: 'rgba(61, 100, 255, 1)',
    height: ScreenUtil.scaleSize(32),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sureText: {
    color: '#fff',
    fontSize: 17,
    paddingHorizontal: ScreenUtil.scaleSize(12)
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(249, 249, 249, 0.1)'
  },
  changeInfoContent: {
    backgroundColor: '#fff',
    paddingHorizontal: ScreenUtil.scaleSize(18),
    height: ScreenUtil.scaleSize(55),
    flexDirection: 'row',
    alignItems: 'center'
  },
  infoText: {
    flex: 1,
    color: 'rgba(23, 29, 53, 1)',
    fontSize: 15
  },
  delectBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  delectIcon: {
    width: ScreenUtil.scaleSize(14),
    height: ScreenUtil.scaleSize(14)
  },
  bottomBtns: {
    width: '100%',
    marginTop: ScreenUtil.scaleSize(70),
    height: ScreenUtil.scaleSize(59),
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  btn: {
    width: ScreenUtil.scaleSize(325),
    height: ScreenUtil.scaleSize(39),
    lineHeight: ScreenUtil.scaleSize(39),
    backgroundColor: '#526CDD',
    borderRadius: 50,
    textAlign: 'center',
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(15),
    borderTopColor: 'rgb(0, 0, 0)',
  },
    itemMoreIcon: {
      width: ScreenUtil.scaleSize(14),
      height: ScreenUtil.scaleSize(14),
      marginLeft: ScreenUtil.scaleSize(10),
    },
})
