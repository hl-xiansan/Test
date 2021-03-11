import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs'
import React, {Component, useCallback, useState} from 'react'
import {InputItem, List, Picker, Portal, Provider, Toast, DatePicker} from '@ant-design/react-native'
import {
  Modal,
  Alert,
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  Image,
  ScrollView, TextInput, TouchableOpacity, DeviceEventEmitter, TextInputEndEditingEventData
} from 'react-native'
import ScreenUtils from '../../../utils/ScreenUtils'
import Page from '../../../components/Page'
import Icons from '../../../Icons'
import {workerInfo} from '../../../utils/worker'
import {Profile} from '../../../@types'
import {TouchableWithoutFeedback} from 'react-native-gesture-handler'
import * as ImagePicker from 'react-native-image-picker/src'
import {ImagePickerResponse} from 'react-native-image-picker/src'
import Api from '../../../utils/Api'
import Global from '../../../Config'
import {useActionSheet} from "@expo/react-native-action-sheet";
import CommonUtils from "../../../utils/CommonUtils";
import {Route} from "@react-navigation/native";

type Props = {
  navigation: BottomTabNavigationProp<any>
  route: Route<string, { id: string,name:string,jobId:string ,inviteCode:string | null,staffName:string | null }>
}

const base = 'http://tongtu.juyunfuwu.cn/api/tongtu/storage/employee/'

type State = {
  modalVisible: boolean,
  name: string
  logo: string | null
  sex: number
  tel: string
  age: Date | null
  education: number
  wokeAge: Date | null
  email: string | number
  location: string
  educationList: any[]
  inviteCode: string | null
  staffName: string | null
  tempData: any
}
const SEX_ARR = [{label: '保密', value: 0,}, {label: '男性', value: 1,}, {label: '女性', value: 2,}]
// const WORK_ARR_ARR = [{ label: '1 年', value: 0, }]
// for (let index = 1; index < 50; index++) WORK_ARR_ARR.push({ label: `${index + 1} 年`, value: index, })
export const getDateString = (date: Date, time = false) => {
  if (!date) return ''
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate() + 1
  const M = m < 10 ? `0${m}` : m
  const D = d < 10 ? `0${d}` : d
  if (time) {
    const h = date.getHours()
    const min = date.getMilliseconds()
    const H = h < 10 ? `0${h}` : h
    const MIN = min < 10 ? `0${min}` : min
    return y + '-' + M + '-' + D + ' ' + H + ':' + MIN
  }
  return y + '-' + M + '-' + D
}
@Page({
  navigation: {
    title: 'Jobs',
    headerLeft: () => null
  }
})
export default class ResumeInfoPage extends Component<Props, State> {
  emitter: any = null
  loading = false
  isUnmount = false
  userInfo: any = null
  uploadRes: ImagePickerResponse | null = null
  readonly state: State = {
    modalVisible: false,
    name: '',
    logo: null,
    sex: 0,
    tel: '',
    age: null,
    education: -1,
    wokeAge: null,
    email: '',
    location: '',
    educationList: [],
    inviteCode: '',
    staffName: '',
    tempData: {}
  }

  async applyForJob() {
    if (this.loading) return
    this.loading = true
    const key = Toast.loading('loading')

    this.userInfo.gender = this.state.sex
    this.userInfo.photo = this.state.logo
    this.userInfo.name = this.state.name
    this.userInfo.phone = this.state.tel
    this.userInfo.birth = this.state.age
    this.userInfo.working_date = this.state.wokeAge
    this.userInfo.address = this.state.location
    if (this.state.education > -1) this.userInfo.education_id = this.state.educationList[this.state.education].value

    if (isNaN(Number(this.state.email))) this.userInfo.email = this.state.email
    else this.userInfo.qq = this.state.email

    try {
      await Api.put('/labor/person/profiles', this.userInfo)
      // const user = await workerInfo.getInfo(true)
      // console.log(user)
    } catch (error) {
      Portal.remove(key)
      Toast.fail(error.message)
      this.loading = false
    }

    // 应聘
    try {
      const data = {
        customer_id: this.props.route.params.id,
        name: this.props.route.params.name,
        job_id: this.props.route.params.jobId,
        invite_code: this.props.route.params.inviteCode
      }
      await Api.post('/labor/worker/apply', data)
      Portal.remove(key)
      this.setModalVisible(!this.state.modalVisible)
      this.loading = false
    } catch (error) {
      Portal.remove(key)
      Toast.fail(error.message)
      this.loading = false
    }

  }

  setModalVisible = (visible: boolean) => {
    this.setState({modalVisible: visible})
  }

  closeModalVisible = () => {
    this.setState({modalVisible: false})
    this.props.navigation.goBack()
  }

  async componentDidMount() {

    this.isUnmount = false
    const data = await this.setUserInfo()
    this.getEducationList(data!)

    // this.emitter = DeviceEventEmitter.addListener(UPDATE_WORKER_INFO, () => {
    //   this.setUserInfo()
    // })
    if (typeof this.props.route.params.inviteCode !== 'undefined') {
      this.setState({
        inviteCode: this.props.route.params.inviteCode
      })
    }
    if (typeof this.props.route.params.staffName !== 'undefined') {
      this.setState({
        staffName: this.props.route.params.staffName
      })
    }
  }

  componentWillUnmount() {
    this.isUnmount = true
    // if (this.emitter) this.emitter.remove()
  }

  async setUserInfo() {
    const data:any = await workerInfo.getPerson()
    this.userInfo = data
    console.log('personInit', data)
    if (data) {
      this.setState({
        logo: data?.photo,
        name: data?.name || '',
        tel: data?.phone || '',
        sex: Number(data?.gender),
        email: data?.email || data?.qq || '',
        age: data?.birth ? new Date(data?.birth) : null,
        wokeAge: data?.working_date ? new Date(data?.working_date) : null,

        location: data?.address || '',
        tempData: data
      })
    }
    return data
  }

  async getEducationList(data: any) {
    const res = await workerInfo.getEducationList() as any[]
    let education = res.find(i => i.id === data?.education_id)?.id
    let educationIndex = -1
    const arr: any[] = []
    res.map((item, index) => {
      if (education == item.id) educationIndex = index
      arr.push({label: item.name, value: item.id})
    })


    this.setState({educationList: arr, education: educationIndex})
  }

  onChangeText(value: string, type: string) {
    if (type === 'name') this.setState({name: value})
    if (type === 'tel') this.setState({tel: value})
    if (type === 'location') this.setState({location: value})
    if (type === 'email') this.setState({email: value})
    if (type === 'inviteCode') {
      this.setState({inviteCode: value})
    }
  }

  endEditInviteCode(value:any) {
    console.log('******************',value.nativeEvent.text)
  }

  updateAvatar = async (res: any) => {
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
    // const body = {...this.state.tempData}
    // body.photo = base + avatar.filename
    this.setState({
      logo: base + avatar.filename
    })
    // console.log('body', body)
    // CommonUtils.changeUserInfo(body).then(async () => {
    //   this.setUserInfo()
    // })
  }

  render() {
    const {modalVisible} = this.state
    return (
      <Provider>
        <ScrollView>
          <View style={styles.box}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                this.setModalVisible(!modalVisible)
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Image style={styles.successImg} source={require('../../../assets/icons/job/successImg.png')}/>
                  <Text style={styles.modalText}>恭喜您报名成功！</Text>
                  <TouchableHighlight
                    style={{
                      ...styles.openButton, backgroundColor: '#526CDD'
                    }}
                    onPress={() => {
                      this.closeModalVisible()
                    }}
                  >
                    <Text style={styles.textStyle}>关闭</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>
            <View style={styles.titleBox}>
              <Image style={styles.titleIcon} source={require('../../../assets/icons/job/baseInfoIcon.png')}/>
              <Text style={styles.titleText}>基本信息</Text>
            </View>
            <View style={styles.boxContent}>
              <View style={styles.item}>
                <Text style={styles.itemLable}>头像</Text>
                <UploadPhoto def={this.state.logo ? this.state.logo : ''} onPhotoTaked={(res: ImagePickerResponse) => {
                  this.uploadRes = res
                  this.updateAvatar(res)
                }}/>
                <View style={styles.borderBottomLine}/>
              </View>
            </View>
            <View style={styles.boxContent}>
              <View style={styles.item}>
                <Text style={styles.itemLable}>姓名</Text>
                <TextInput
                  value={this.state.name}
                  onChangeText={(value: string) => {
                    this.onChangeText(value, 'name')
                  }}
                  style={styles.itemInput}
                  placeholder="请输入姓名"
                  key="name"
                />
                <View style={styles.borderBottomLine}/>
              </View>
            </View>
            <View style={styles.boxContent}>
              <View style={styles.item}>
                <Text style={styles.itemLable}>性别</Text>
                <Picker
                  data={[SEX_ARR]}
                  title={'性别'}
                  value={[this.state.sex]}
                  cascade={false}
                  onOk={(result) => {
                    this.setState({sex: result[0]})
                  }}
                  cols={1}
                >
                  <Text style={{
                    ...styles.itemInput,
                    width: ScreenUtils.scaleSize(125),
                    lineHeight: ScreenUtils.scaleSize(55),
                  }}>{SEX_ARR[this.state.sex].label}</Text>
                </Picker>
                <View style={styles.borderBottomLine}/>
              </View>
            </View>
            <View style={styles.boxContent}>
              <View style={styles.item}>
                <Text style={styles.itemLable}>手机</Text>
                <TextInput
                  value={this.state.tel + ''}
                  onChangeText={(value: string) => {
                    this.onChangeText(value, 'tel')
                  }}
                  style={styles.itemInput}
                  placeholder="请输入手机号码"
                  key="tel"
                  keyboardType="numeric"
                  maxLength={11}
                />
                <View style={styles.borderBottomLine}/>
              </View>
            </View>
            <View style={styles.boxContent}>
              <View style={styles.item}>
                <Text style={styles.itemLable}>出生年月</Text>
                <DatePicker
                  value={this.state.age ? this.state.age : new Date()}
                  minDate={new Date(1940, 1, 1)}
                  maxDate={new Date()}
                  mode="date"
                  onChange={(res) => {
                    this.setState({age: res})
                  }}
                >
                  <TouchableOpacity>
                    <View style={{
                      ...styles.flexBox,
                      height: ScreenUtils.scaleSize(55),
                      width: ScreenUtils.scaleSize(125),
                      justifyContent: 'flex-end'
                    }}>
                      <Text
                        style={this.state.age ? styles.pleaseSelect2 : styles.pleaseSelect}>{this.state.age ? CommonUtils.UTCDateFormat(this.state.age,'YYYY-MM-DD') : '请选择'}</Text>
                      <Image source={Icons.Public.More} style={styles.listItemMore}/>
                    </View>
                  </TouchableOpacity>
                </DatePicker>
                <View style={styles.borderBottomLine}/>
              </View>
            </View>
            <View style={styles.boxContent}>
              <View style={styles.item}>
                <Text style={styles.itemLable}>学历</Text>
                {
                  this.state.educationList.length > 0 ?
                    <Picker
                      data={[this.state.educationList]}
                      title={'学历'}
                      value={[this.state.educationList[this.state.education > -1 ? this.state.education : 0].value]}
                      cascade={false}
                      onOk={(result) => {
                        console.log(result)
                        // for (let index = 0; index < this.state.educationList.length; index++) {
                        //   const element = this.state.educationList[index]
                        //   if (element.value === result[0]) {
                        //     this.setState({education: index})
                        //     break
                        //   }
                        // }
                        this.setState({
                          education: this.state.educationList.findIndex(item => item.value === result[0])
                        })
                      }}
                      cols={1}
                    >
                      <TouchableOpacity>
                        <View style={{
                          ...styles.flexBox,
                          height: ScreenUtils.scaleSize(55),
                          width: ScreenUtils.scaleSize(125),
                          justifyContent: 'flex-end'
                        }}>
                          <Text
                            style={this.state.education > -1 ? styles.pleaseSelect2 : styles.pleaseSelect}>{this.state.education > -1 ? this.state.educationList[this.state.education].label : '请选择'}</Text>
                          <Image source={Icons.Public.More} style={styles.listItemMore}/>
                        </View>
                      </TouchableOpacity>
                    </Picker> : null
                }

                <View style={styles.borderBottomLine}/>
              </View>
            </View>
            <View style={styles.boxContent}>
              <View style={styles.item}>
                <Text style={styles.itemLable}>参加工作时间</Text>
                <DatePicker
                  value={this.state.wokeAge ? this.state.wokeAge : new Date()}
                  minDate={new Date(1940, 1, 1)}
                  maxDate={new Date()}
                  mode="date"
                  format="YYYY-MM-DD"
                  onChange={(res) => {
                    this.setState({wokeAge: res})
                  }}
                >
                  <TouchableOpacity>
                    <View style={{
                      ...styles.flexBox,
                      height: ScreenUtils.scaleSize(55),
                      width: ScreenUtils.scaleSize(125),
                      justifyContent: 'flex-end'
                    }}>
                      <Text
                        style={this.state.wokeAge ? styles.pleaseSelect2 : styles.pleaseSelect}>{this.state.wokeAge ? CommonUtils.UTCDateFormat(this.state.wokeAge,'YYYY-MM-DD') : '请选择'}</Text>
                      <Image source={Icons.Public.More} style={styles.listItemMore}/>
                    </View>
                  </TouchableOpacity>
                </DatePicker>
                <View style={styles.borderBottomLine}/>
              </View>
            </View>
            <View style={styles.boxContent}>
              <View style={styles.item}>
                <Text style={styles.itemLable}>邀请码</Text>
                <TextInput
                  value={this.state.inviteCode ? this.state.inviteCode : ''}
                  onChangeText={(value: string) => { this.onChangeText(value, 'inviteCode') }}
                  onEndEditing={(value: any) => { this.endEditInviteCode(value) }}
                  style={styles.itemInput}
                  placeholder="邀请码"
                  key="inviteCode"
                  maxLength={11}
                />
                <View style={styles.borderBottomLine}/>
              </View>
            </View>
            <View style={styles.boxContent}>
              <View style={styles.item}>
                <Text style={styles.itemLable}>邀请人</Text>
                <TextInput
                    value={this.state.staffName ? this.state.staffName : ''}
                    style={styles.itemInput}
                    placeholder="邀请人"
                    key="staffName"
                    maxLength={11}
                    editable={false}
                />
                <View style={styles.borderBottomLine}/>
              </View>
            </View>
            <View style={styles.titleBox}>
              <Image style={styles.titleIcon} source={require('../../../assets/icons/job/tel.png')}/>
              <Text style={styles.titleText}>联系方式</Text>
            </View>
            <View style={styles.boxContent}>
              <View style={styles.item}>
                <Text style={styles.itemLable}>邮箱 / QQ</Text>
                <TextInput
                  value={this.state.email + ''}
                  onChangeText={(value: string) => {
                    this.onChangeText(value, 'email')
                  }}
                  style={styles.itemInput}
                  placeholder="请输入邮箱或者QQ号"
                  key="age"
                  maxLength={11}
                />
                <View style={styles.borderBottomLine}/>
              </View>
            </View>
            <View style={styles.boxContent}>
              <View style={styles.item}>
                <Text style={styles.itemLable}>现住地址</Text>
                <TextInput
                  value={this.state.location}
                  onChangeText={(value: string) => {
                    this.onChangeText(value, 'location')
                  }}
                  style={styles.itemInput}
                  placeholder="请输入本人现住地址"
                  key="age"
                  maxLength={11}
                />
                <View style={styles.borderBottomLine}/>
              </View>
            </View>
            <View style={styles.bottomBtns}>
              <TouchableOpacity activeOpacity={0.5} onPress={this.applyForJob.bind(this)}>
                <Text style={styles.btn}>应聘</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Provider>
    )
  }
}

export const UploadPhoto = (props: { def: string, onPhotoTaked?: (res: ImagePickerResponse) => void }) => {
  const [source, setSource] = useState<ImagePickerResponse | undefined>()
  const {showActionSheetWithOptions = () => void {}} = useActionSheet()
  const onPress = () => {
    const options = ['拍照', '从相册选择']
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 3,
        showSeparators: true
      },
      (buttonIndex: number) => {
        if (buttonIndex === 0) {
          ImagePicker.launchCamera(
            {
              mediaType: 'photo',
              includeBase64: false,
              maxHeight: 200,
              maxWidth: 200,
            },
            (response: any) => {
              setSource(response)
              props.onPhotoTaked && props.onPhotoTaked(response)
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
              setSource(response)
              props.onPhotoTaked && props.onPhotoTaked(response)
            },
          )
        }
      }
    )
    // ImagePicker.launchCamera(
    //   {mediaType: 'photo', includeBase64: false},
    //   (response: ImagePickerResponse) => {
    //     setSource(response)
    //     props.onPhotoTaked && props.onPhotoTaked(response)
    //   }
    // )
  }
  const renderImage = () => {
    if (source) {
      return <Image style={{
        ...styles.upload, borderRadius: ScreenUtils.scaleSize(34)
      }} source={source}/>
    }
    if (props.def && props.def.length > 0) {
      return <Image style={{
        ...styles.upload, borderRadius: ScreenUtils.scaleSize(34)
      }} source={{uri: props.def}}/>
    }
    return (
      <Image
        resizeMode="contain"
        style={styles.upload}
        source={require('../../../../src/assets/icons/public/picture.png')}
      />
    )
  }
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.uploadImageView}>
        {
          renderImage()
        }
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  box: {
    display: 'flex',
    flex: 1,
    position: 'relative',
    paddingBottom: ScreenUtils.scaleSize(59),
  },
  titleBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: ScreenUtils.scaleSize(40),
    backgroundColor: '#F3F5F7',
    paddingLeft: ScreenUtils.scaleSize(15),
  },
  titleIcon: {
    width: ScreenUtils.scaleSize(22),
    height: ScreenUtils.scaleSize(22),
  },
  titleText: {
    fontSize: ScreenUtils.scaleSize(15),
    color: '#030014',
    fontWeight: 'bold',
  },
  boxContent: {
    position: 'relative',
    backgroundColor: '#fff',
    paddingHorizontal: ScreenUtils.scaleSize(15),
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: ScreenUtils.scaleSize(55),
  },
  flexBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemLable: {
    fontSize: ScreenUtils.scaleSize(14),
    color: '#545468',
  },
  itemInput: {
    flex: 1,
    marginLeft: ScreenUtils.scaleSize(10),
    // backgroundColor: '#ff00ff',
    textAlign: 'right',
    alignItems: 'center',
    height: ScreenUtils.scaleSize(55),
  },
  pleaseSelect: {
    color: '#A8A8AC',
    marginRight: ScreenUtils.scaleSize(5)
  },
  pleaseSelect2: {
    color: '#545468',
    marginRight: ScreenUtils.scaleSize(5)
  },
  listItemMore: {
    width: ScreenUtils.scaleSize(6),
    height: ScreenUtils.scaleSize(10)
  },
  borderBottomLine: {
    position: 'absolute',
    width: '80%',
    height: ScreenUtils.scaleSize(1),
    backgroundColor: '#E7EBEF',
    bottom: 0,
    left: '20%'
  },
  bottomBtns: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: ScreenUtils.scaleSize(59),
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  btn: {
    width: ScreenUtils.scaleSize(325),
    height: ScreenUtils.scaleSize(39),
    lineHeight: ScreenUtils.scaleSize(39),
    backgroundColor: '#526CDD',
    borderRadius: 50,
    textAlign: 'center',
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(15),
    borderTopColor: 'rgb(0, 0, 0)',
  },
  avatar: {
    width: ScreenUtils.scaleSize(34),
    height: ScreenUtils.scaleSize(34),
  },
  successImg: {
    width: ScreenUtils.scaleSize(175),
    height: ScreenUtils.scaleSize(190),
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: '#526CDD',
    borderRadius: 20,
    elevation: 2,
    width: ScreenUtils.scaleSize(250),
    height: ScreenUtils.scaleSize(39),
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: ScreenUtils.scaleSize(15),
    lineHeight: ScreenUtils.scaleSize(39),
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: ScreenUtils.scaleSize(17),
    fontWeight: 'bold',
  },
  uploadImageView: {
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: ScreenUtils.scaleSize(20),
    width: ScreenUtils.scaleSize(34),
    height: ScreenUtils.scaleSize(34),
    // borderColor: '#526CDD',
    // borderWidth: 1,
    // borderRadius: 10,
    // borderStyle: 'dashed',
    // backgroundColor: '#F8F9FD'

  },
  upload: {
    width: ScreenUtils.scaleSize(34),
    height: ScreenUtils.scaleSize(34),
    // borderRadius: ScreenUtils.scaleSize(34)
  },
})

