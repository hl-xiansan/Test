import React, {Component, useCallback, useState} from 'react'
import * as ImagePicker from 'react-native-image-picker/src'
import {
  Dimensions,
  Image,
  KeyboardType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from 'react-native'
import ScreenUtil from '../../../utils/ScreenUtils'
import Page from '../../../components/Page'
import {TextInput} from 'react-native-gesture-handler'
import {workerInfo} from '../../../utils/worker'
import Api from '../../../utils/Api'
import {Portal, Provider, Toast,Picker} from '@ant-design/react-native'
import SelectPicker from "react-native-picker";
import {useActionSheet} from "@expo/react-native-action-sheet";
import {NavigationProp} from "@react-navigation/native";
import ScreenUtils from "../../../utils/ScreenUtils";
import Icons from "../../../Icons";

type Props = {
  navigation: NavigationProp<any>;
  route: any
};
type ItemType = {
  title: string;
  placeholder?: string;
  required: boolean;
  right?: boolean | null;
  onPress?: any;
  children?: any;
  isInput?: boolean;
  value?: string;
  onChange?: (res: string) => void;
  keyboardType?: KeyboardType,
}
const height = Dimensions.get('window').height
const width = Dimensions.get('window').width


const TextItem = (props: ItemType) => {
  const { title = '', placeholder = '',required = false, right = false, onPress, isInput = false, keyboardType, onChange, value } = props
  const obj = <View style={styles.textItemView}>
    <View style={styles.flexRowAlignCenter}>
      <Text style={styles.titleStyle}>{title}</Text>
      {required && <Text style={styles.redPoint}>*</Text>}
    </View>
    {props.children || (
      <View style={{
        ...styles.placeholderView, paddingTop: ScreenUtil.scaleSize(isInput ? 5 : 20), paddingBottom: ScreenUtil.scaleSize(isInput ? 0 : 10),display:'flex',flexDirection:'column'
      }}>
        {isInput ? <TextInput value={value} onChangeText={(res) => { if (onChange) onChange(res) }} keyboardType={keyboardType} placeholder={placeholder} style={styles.placeholderInputStyle}></TextInput> : <Text style={styles.placeholderStyle}>{value ? value : placeholder}</Text>}
        {right && <Image style={styles.icon} source={require('../../../../src/assets/icons/public/more.png')} />}
        { title === "银行卡" && !value  ?  <TextInput  placeholder=" 如没有银行卡，请输入原因 " value="123123" /> : <></> }
        
      </View>
    )}
  </View>
  if (isInput) return obj
  return (
    <TouchableWithoutFeedback onPress={ (res) => { if (onPress) onPress(res) } }>
      {obj}
    </TouchableWithoutFeedback>
  )
}

const separatorStyle: ViewStyle = {
  backgroundColor: '#eee'
}

const uploadAvatar = async (res: { didCancel: any, fileName: string, type: string, uri: string }) => {
  if (res.didCancel) {
    return
  }
  const param: any = {
    file: {
      name: res.fileName,
      type: res.type,
      uri: res.uri
    },
    name: res.fileName
  }
  const avatar = await workerInfo.updateAvatar(param)

  return base + avatar.filename
}

const base = 'http://tongtu.juyunfuwu.cn/api/tongtu/storage/employee/'

const UploadPhoto = (props: { onPhotoTaked?: (res: string) => void, def: any }) => {
  const [source, setSource] = useState<string | undefined>()
  const {showActionSheetWithOptions = () => void {}} = useActionSheet()
  const onPress = useCallback(() => {
    // ImagePicker.launchCamera(
    //   {
    //     mediaType: 'photo',
    //     includeBase64: false
    //   },
    //   (response: ImagePickerResponse) => {
    //     setSource(response)
    //     props.onPhotoTaked && props.onPhotoTaked(response)
    //   }
    // )
    const options = ['拍照', '从相册选择']
    showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: 3,
          showSeparators: true, separatorStyle
        },
        (buttonIndex: number) => {
          // Picker.hide()
          if (buttonIndex === 0) {
            ImagePicker.launchCamera(
                {
                  mediaType: 'photo',
                  includeBase64: false,
                  maxHeight: 200,
                  maxWidth: 200,
                },
                (response: any) => {
                  uploadAvatar(response).then(res => {
                    if (res) {
                      setSource(res)
                      props.onPhotoTaked && props.onPhotoTaked(res)
                    }
                  })
                },
            )
          } else if (buttonIndex === 1) {
            ImagePicker.launchImageLibrary(
                {
                  mediaType: 'photo',
                  includeBase64: false,
                  maxHeight: 200,
                  maxWidth: 200,
                },
                (response: any) => {
                  uploadAvatar(response).then(res => {
                    if (res) {
                      setSource(res)
                      props.onPhotoTaked && props.onPhotoTaked(res)
                    }
                  })
                },
            )
          }
          // Do something here depending on the button index selected
        }
    )
  }, [])
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.uploadImageView}>{(source || props.def.uri) ?
          <Image style={{
            width: 120, height: 120
          }} source={source ? {uri: source} : props.def} /> :
          <Image style={styles.upload} source={require('../../../../src/assets/icons/public/picture.png')} />}</View>
    </TouchableWithoutFeedback>
  )
}
interface State {
  name: string,
  tel: string,
  IDNumber: string,
  location: string,
  autograph: string,
  idcard_fore: any,
  idcard_back: any,
  jobId: string,
  status: number | null,
  jobList:{label:string,value:string}[],
  SelectorJobList:{label:string,value:string}[],
  position: string,
  jobIdIndex: number,
  bankCard:string,
  education:string,
  Dispatch_unit:string,

}
@Page({
  navigation: {
    headerShown: false
  }
})

export default class WorkerContractFormPage extends Component<Props> {
  userInfo: any = null
  emitter: any = null
  isUnmount = false
  isLoading = false
  readonly state: State = {
    name: '',
    tel: '',
    IDNumber: '',
    location: '',
    autograph: '',
    idcard_fore: null,
    idcard_back: null,
    jobId: '',
    status: null,
    jobList: [],
    SelectorJobList:[],
    position: '',
    jobIdIndex: -1,
    bankCard:'',
    education:'',
    Dispatch_unit:'',
  }
  async componentDidMount() {
    this.isUnmount = false
    await this.setUserInfo()
    // this.emitter = DeviceEventEmitter.addListener(UPDATE_WORKER_INFO, () => { this.setUserInfo() })
    this.state.jobList = [];
    this.state.SelectorJobList = [];
    Api.get('/labor/jobs/list/by_customer/'+ this.props.route.params.customerId).then((res:any) => {
      res.forEach((item:any) => {
        this.state.jobList.push({ label:item.name,value:item.id })
        this.state.SelectorJobList.push(item.name)
      })
      this.setState({
        jobList:this.state.jobList,
        SelectorJobList:this.state.SelectorJobList
      })
    })
    console.log(this.state.jobList);
  }
  componentWillUnmount() {
    this.isUnmount = true
    // if (this.emitter) this.emitter.remove()
  }
  async setUserInfo() {
    const data:any = await workerInfo.getPerson()

    this.userInfo = data
    if (data) {
      this.setState({
        name: data?.name || '',
        tel: data?.phone || '',
        IDNumber: data?.id_no || '',
        location: data?.address || '',
        autograph: data?.autograph || '',
        idcard_fore: data?.authentication?.idcard_fore || null,
        idcard_back: data?.authentication?.idcard_back || null,
        status: data?.status || null,
        position: data?.position || '',
        Registered_residence:'',
      })
    }
    return data
  }
  toSign() {
    this.props.navigation.navigate('Signature', {
      autograph: this.state.autograph,
      getImage: (res: any) => {
        this.setState({ autograph: base + res })
      }
    })
  }
  requestBad(key: number, message: string) {
    this.isLoading = false
    Portal.remove(key)
    Toast.fail(message)
    return false
  }
  async toNextPage() {
    // 检查星号的值是否存在
    if (this.state.name.length === 0) {
      Toast.fail('员工姓名不能为空')
      return
    }
    if (this.state.tel.length === 0) {
      Toast.fail('员工手机号不能为空')
      return
    }
    if (this.state.IDNumber.length === 0) {
      Toast.fail('员工身份证不能为空')
      return
    }
    if (this.state.location.length === 0) {
      Toast.fail('员工住址不能为空')
      return
    }
    if (this.state.autograph.length === 0) {
      Toast.fail('请签字确认')
      return
    }
    if (!this.state.idcard_back || !this.state.idcard_fore) {
      Toast.fail('请上传身份证')
      return
    }
    if (this.isLoading) return
    this.isLoading = true
    const key = Toast.loading('loading',0)
    let flag = true
    // let sign: any = this.state.autograph
    // let idcard_fore: any = this.state.idcard_fore
    // let idcard_back: any = this.state.idcard_back

    // 签名上传 - 非 HTTP 开头的就是 base64 图片
    // if (this.state.autograph.indexOf('http') !== 0) {
    //   try {
    //     const name = this.userInfo?.id + '_sign.png'
    //     const res: any = await Api.RNUpload('/storage/sign/', this.state.autograph.replace('data:image/png;base64,', ''), name)
    //     console.log(res)
    //     if (res.code === 200) {
    //       sign = Config.http.baseURL + '/storage/sign/' + name
    //     }
    //   } catch (error) {
    //     flag = this.requestBad(key, error.message)
    //   }
    // }
    // 身份证 1上传
    // if (flag && typeof this.state.idcard_fore !== 'string' && this.state.idcard_fore) {
    //   const name = this.userInfo?.id + '_' + this.state.idcard_fore.fileName
    //   const data: any = {
    //     file: {
    //       name: this.state.idcard_fore.fileName,
    //       type: this.state.idcard_fore.type,
    //       uri: this.state.idcard_fore.uri
    //     },
    //     name
    //   }
    //   try {
    //     const uploadRes: any = await Api.myUpload('/storage/idcard', data)
    //     if (uploadRes) idcard_fore = Config.http.baseURL + '/storage/idcard/' + name
    //   } catch (error) {
    //     flag = this.requestBad(key, error.message)
    //   }
    // }

    // 身份证 2上传
    //this.props.navigation.navigate('TransferApply')
    // if (flag && typeof this.state.idcard_back !== 'string' && this.state.idcard_back) {
    //   const name = this.userInfo?.id + '_' + this.state.idcard_back.fileName
    //   const data: any = {
    //     file: {
    //       name: this.state.idcard_back.fileName,
    //       type: this.state.idcard_back.type,
    //       uri: this.state.idcard_back.uri
    //     },
    //     name
    //   }
    //   try {
    //     const uploadRes: any = await Api.myUpload('/storage/idcard', data)
    //     if (uploadRes) idcard_back = Config.http.baseURL + '/storage/idcard/' + name
    //   } catch (error) {
    //     flag = this.requestBad(key, error.message)
    //   }
    // }

    // 修改个人信息
    if (flag) {
      // {
      //   nickname: this.state.name,
      //   extras: {
      //     person: {
      //       name: this.state.name,
      //       phone: this.state.tel,
      //       address: this.state.location,
      //       id_no: this.state.IDNumber,
      //     }
      //   }
      // }
      // this.userInfo.nickname = this.state.name
      // if (!this.userInfo.extras) this.userInfo.extras = {person:{}}
      // data.extras.person.name =  this.state.name
      // data.extras.person.phone =  this.state.tel
      // data.extras.person.address =  this.state.location
      // data.extras.person.id_no =  this.state.IDNumber
      // if (sign) data.extras.person.autograph = sign
      // if (idcard_fore || idcard_back) {
      //   data.extras.person.authentication = {}
      //   if (idcard_fore) data.extras.person.authentication.idcard_fore = idcard_fore
      //   if (idcard_back) data.extras.person.authentication.idcard_back = idcard_back
      // }

      this.userInfo.authentication = {}

      this.userInfo.authentication.idcard_fore = this.state.idcard_fore
      this.userInfo.authentication.idcard_back = this.state.idcard_back
      this.userInfo.name = this.state.name
      this.userInfo.phone = this.state.tel
      this.userInfo.address = this.state.location
      this.userInfo.id_no = this.state.IDNumber
      this.userInfo.autograph = this.state.autograph

      try {
        await Api.put('/labor/person/profiles/all', JSON.stringify(this.userInfo))
        workerInfo.getPerson(true).then()

      } catch (error) {
        flag = this.requestBad(key, error.message)
      }
    }
    if (flag) {
      try {
        await Api.post(`/labor/worker/sign/${this.props.route.params.code}`)
        Toast.success('提交成功')
        Portal.remove(key)
        this.isLoading = false
        this.props.navigation.navigate('TransferApply')
      } catch (error) {
        flag = this.requestBad(key, error.message)
        Portal.remove(key)
      }
    }

  }
  async transferFactory() {
    if (this.state.jobId === '') {
      Toast.fail('请选择职位')
      return
    }
    const Getdata:any = await workerInfo.getPerson()

    

    const key = Toast.loading('loading',0)
    const data = { customer_id: this.props.route.params.customerId, job_id: this.state.jobList[ this.state.SelectorJobList.indexOf( this.state.jobId ) ].value,id:Getdata.id,customer_name:Getdata.customer_name }

    try {
      await Api.post(`/labor/worker/sign/${this.props.route.params.code}`,data)
      await Toast.success('提交转厂申请成功')
      Portal.remove(key)

      setTimeout(() => {
        this.props.navigation.reset({ index: 0, routes: [{ name: 'Index' }] })
      },500)
    } catch (error) {
      console.log('err',error);
      Portal.remove(key)
    }
  }

  render() {
    if (this.state.status === 1) {
      return (
        <Provider>
          <ScrollView style={styles.background}>
            <View style={styles.textItemView}>
              <View style={styles.flexRowAlignCenter}>
                <Text style={styles.titleStyle}>{'职位'}</Text>
                <Text style={styles.redPoint}>*</Text>
                {/* <Picker data={this.state.jobList} title={'职位'} cascade={false}
                        onOk={(result) => {
                          this.setState({jobId: result[0],jobIdIndex: this.state.jobList.findIndex(item => item.value === result[0])})
                        }}
                        cols={1}>
                  <TouchableOpacity>
                    <View style={{
                      ...styles.flexBox,
                      height: ScreenUtils.scaleSize(55),
                      width: ScreenUtils.scaleSize(125),
                      justifyContent: 'flex-end'
                    }}>
                      <Text style={styles.pleaseSelect2}>{this.state.jobId ? this.state.jobList[this.state.jobIdIndex].label : '请选择'}</Text>
                      <Image source={Icons.Public.More} style={styles.listItemMore}/>
                    </View>
                  </TouchableOpacity>
                </Picker> */}
                <TouchableOpacity
                  onPress = { () => {
                    SelectPicker.init({
                      pickerData: this.state.SelectorJobList,
                      selectedValue:[this.state.jobId],
                      pickerTitleText: '职位',
                      pickerToolBarBg: [245, 245, 245, 1],
                      pickerCancelBtnText: '取消',
                      pickerBg: [255, 255, 255, 1],
                      pickerConfirmBtnText: '确认',
                      onPickerConfirm: data => {
                        this.setState({
                          jobId:data[0]
                        })
                      },
                      onPickerCancel: data => {
                        // console.log(data)
                      },
                      onPickerSelect: data => {
                        // console.log(data)
                      }
                    })
                    SelectPicker.show()
                  } }
                >
                    <View style={{
                      ...styles.flexBox,
                      height: ScreenUtils.scaleSize(55),
                      width: ScreenUtils.scaleSize(125),
                      justifyContent: 'flex-end'
                    }}>
                      <Text style={styles.pleaseSelect2}>{this.state.jobId ? this.state.jobId : '请选择'}</Text>
                      <Image source={Icons.Public.More} style={styles.listItemMore}/>
                    </View>
                  </TouchableOpacity>
              </View>
              <View style={styles.flexRowAlignCenter}>
                <Text style={styles.fontTransfer}>{'从 ' + this.state.position + ' 转厂到 ' + this.props.route.params.customerName}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.subBtn} onPress={this.transferFactory.bind(this)}>
              <Text style={styles.subText}>提 交 转 厂 申 请</Text>
            </TouchableOpacity>
          </ScrollView>
        </Provider>
      )
    }
    return (
      <Provider>
        <ScrollView style={styles.background}>
          <TextItem title="员工姓名" placeholder="请输入员工姓名" required isInput={true} value={this.state.name} onChange={(res: string) => { this.setState({ name: res }) }} />
          <TextItem title="员工手机号" placeholder="请输入员工手机号" required isInput={true} keyboardType={'phone-pad'} value={this.state.tel} onChange={(res: string) => { this.setState({ tel: res }) }} />
          <TextItem title="员工身份证号" placeholder="请输入员工身份证号" required isInput={true} value={this.state.IDNumber} onChange={(res: string) => { this.setState({ IDNumber: res }) }} />
          <TextItem title="户籍地" placeholder="请输入户籍地" required isInput={true} value={this.state.Registered_residence} onChange={(res: string) => { this.setState({ Registered_residence: res }) }} />
          <TextItem title="学历" placeholder="请选择学历" required isInput={false} value={this.state.education} onPress={(  ) => { 
            const educationList = ['小学', '初中', '高中', '大专', '本科']
            SelectPicker.init({
              pickerData: educationList,
              selectedValue:[this.state.education],
              pickerTitleText: '学历',
              pickerToolBarBg: [245, 245, 245, 1],
              pickerCancelBtnText: '取消',
              pickerBg: [255, 255, 255, 1],
              pickerConfirmBtnText: '确认',
              onPickerConfirm: data => {
                this.setState({
                  education:data[0]
                })
                console.log(data)
                // this.updateEducation(data)
              },
              onPickerCancel: data => {
                // console.log(data)
              },
              onPickerSelect: data => {
                // console.log(data)
              }
            })
            SelectPicker.show()
          }} /> 
          <TextItem title="现住地址" placeholder="请输入现住地址" required isInput={true} value={this.state.location} onChange={(res: string) => { this.setState({ location: res }) }} />
          <TextItem title="派遣单位" placeholder="请输入派遣单位" required isInput={true} value={this.state.Dispatch_unit} onChange={(res: string) => { this.setState({ Dispatch_unit: res }) }} />
          <TextItem title="职位" placeholder="请选择职位" required isInput={false} value={this.state.position} onPress={ ()=>{
            SelectPicker.init({
              pickerData: this.state.SelectorJobList,
              selectedValue:[this.state.position],
              pickerTitleText: '职位',
              pickerToolBarBg: [245, 245, 245, 1],
              pickerCancelBtnText: '取消',
              pickerBg: [255, 255, 255, 1],
              pickerConfirmBtnText: '确认',
              onPickerConfirm: data => {
                this.setState({
                  position:data[0]
                })
              },
              onPickerCancel: data => {
                // console.log(data)
              },
              onPickerSelect: data => {
                // console.log(data)
              }
            })
            SelectPicker.show()
          } } />
          <TextItem title="银行卡" placeholder="请输入银行卡"  isInput={true} value={this.state.bankCard} onChange={(res: string) => { this.setState({ bankCard: res }) }} />
          <TextItem onPress={this.toSign.bind(this)} title="签字确认" placeholder={this.state.autograph ? '修改签字' : '请签字'} required right={true} >
            {
              this.state.autograph ?
                <View style={styles.uploadImageView}>
                  <Image style={{
                    width: 120, height: 120
                  }} source={{ uri: this.state.autograph }} />
                </View> :
                null
            }
          </TextItem>
          <TextItem title="身份证照片" required >
            <UploadPhoto onPhotoTaked={(res: any) => {
              this.setState({ idcard_fore: res })
            }} def={{ uri: this.state.idcard_fore }} />
            <UploadPhoto onPhotoTaked={(res: any) => {
              this.setState({ idcard_back: res })
            }} def={{ uri: this.state.idcard_back }} />
          </TextItem>
          <TouchableOpacity style={styles.subBtn} onPress={this.toNextPage.bind(this)}>
            <Text style={styles.subText}>提 交</Text>
          </TouchableOpacity>
        </ScrollView>
      </Provider>
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
  textItemView: {
    paddingVertical: ScreenUtil.scaleSize(10),
    paddingHorizontal: ScreenUtil.scaleSize(15),
  },
  titleStyle: {
    fontSize: ScreenUtil.scaleSize(13),
    fontWeight: 'bold',
  },
  redPoint: {
    color: '#FF5B53',
    fontSize: ScreenUtil.scaleSize(16),
    marginLeft: 5,
    flex: 1
  },
  placeholderView: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    paddingTop: ScreenUtil.scaleSize(5),
    paddingBottom: ScreenUtil.scaleSize(0),
    borderBottomWidth: 1,
    borderBottomColor: '#E3E6EA',
  },
  placeholderInputStyle: {
    color: '#555',
    flex: 1,
  },
  placeholderStyle: {
    color: '#A8A8AC',
    flex: 1,
  },
  icon: {
    width: ScreenUtil.scaleSize(14),
    height: ScreenUtil.scaleSize(14),
  },
  upload: {
    width: ScreenUtil.scaleSize(29),
    height: ScreenUtil.scaleSize(23),
  },
  uploadImageView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: ScreenUtil.scaleSize(20),
    width: ScreenUtil.scaleSize(120),
    height: ScreenUtil.scaleSize(120),
    borderColor: '#526CDD',
    borderWidth: 1,
    borderRadius: 10,
    borderStyle: 'dashed',
    backgroundColor: '#F8F9FD'
  },
  flexRowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subBtn: {
    backgroundColor: '#526CDD',
    width: ScreenUtil.scaleSize(300),
    height: ScreenUtil.scaleSize(40),
    marginHorizontal: ScreenUtil.scaleSize(40),
    marginTop: ScreenUtil.scaleSize(30),
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
  pleaseSelect: {
    color: '#A8A8AC',
    marginRight: ScreenUtils.scaleSize(5)
  },
  pleaseSelect2: {
    color: '#545468',
    marginRight: ScreenUtils.scaleSize(5)
  },
  flexBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  listItemMore: {
    width: ScreenUtils.scaleSize(6),
    height: ScreenUtils.scaleSize(10)
  },
  fontTransfer: {
    fontSize: ScreenUtil.scaleSize(20),
    marginLeft: 10
  }
})
