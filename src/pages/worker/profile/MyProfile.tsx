import React, {useEffect, useMemo, useState} from 'react'
import {ScrollView, StyleSheet, View, Image, Text, TouchableOpacity, DeviceEventEmitter} from 'react-native'
import ProfileItem from '../../../components/ProfileItem'
import ScreenUtils from '../../../utils/ScreenUtils'
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs'
import {useIsFocused} from '@react-navigation/native'
import {Profile} from '../../../@types'
import {UPDATE_WORKER_INFO, workerInfo} from '../../../utils/worker'
import * as ImagePicker from 'react-native-image-picker'
import {useActionSheet} from '@expo/react-native-action-sheet'
import Picker from 'react-native-picker'
import Api from "../../../utils/Api";
import CommonUtils from "../../../utils/CommonUtils";
import {Portal, Toast} from "@ant-design/react-native";
import moment from "moment";

type Props = {
  navigation: BottomTabNavigationProp<any>;
  route: any;
}

const defaultAvatar = require('../../../assets/images/login-bg.png')

const base = 'http://tongtu.juyunfuwu.cn/api/tongtu/storage/employee/'

type ViewStyle = {
  backgroundColor: string;
}

function getGender(gender: number | undefined) {
  switch (gender) {
    case 0:
      return '保密'
    case 1:
      return '男'
    case 2:
      return '女'
    default: {
      return ''
    }
  }
}

function renderDate(date: string | undefined) {
  if (!date) return ''
  return CommonUtils.UTCDateFormat(date,'YYYY-MM-DD')
}

const separatorStyle: ViewStyle = {
  backgroundColor: '#eee'
}

// {navigation, route}
function MyProfile(props: Props) {
  const isFocused = useIsFocused()
  const {showActionSheetWithOptions = () => void {}} = useActionSheet()
  const [data, setData] = useState<Profile>({})
  const [educationList, setEducationList] = useState<any[]>([])
  const [birthDayData, setBirthDayData] = useState<any[]>()
  const [avatar, setAvatar] = useState('')
  useEffect(() => {
    const emitter = DeviceEventEmitter.addListener(UPDATE_WORKER_INFO, () => {
      setUserData()
    })
    setUserData()
    fetchBasicData()
    return () => {
      emitter.remove()
    }
  }, [props.route?.params?.key])

  useEffect(() => {
    setBirthDayData(birthDayDataHandle())
  }, [])

  useEffect(() => {
    return componentWillUnmount
  }, [])

  const setUserData = async () => {
    const res = await workerInfo.getProfile()
    if (res) setData(res)
  }
  // 获取数据字典
  const fetchBasicData = async () => {
    try {
      const res = await workerInfo.getEducationList()
      setEducationList(res as any[])
    } catch (error) {
      console.log(error)
    }
  }

  function componentWillUnmount() {
    Picker.hide()
  }

  const birthDayDataHandle = () => {
    let date = []
    for (let i = 1970; i < 2020; i++) {
      let month = []
      for (let j = 1; j < 13; j++) {
        let day = []
        if (j === 2) {
          for (let k = 1; k < 29; k++) {
            day.push(k + '日')
          }
          //Leap day for years that are divisible by 4, such as 2000, 2004
          if (i % 4 === 0) {
            day.push(29 + '日')
          }
        } else if (j in {1: 1, 3: 1, 5: 1, 7: 1, 8: 1, 10: 1, 12: 1}) {
          for (let k = 1; k < 32; k++) {
            day.push(k + '日')
          }
        } else {
          for (let k = 1; k < 31; k++) {
            day.push(k + '日')
          }
        }
        let _month: any = {}
        _month[j + '月'] = day
        month.push(_month)
      }
      let _date: any = {}
      _date[i + '年'] = month
      date.push(_date)
    }
    return date
  }
  const educationString = useMemo(() => {
    // console.log(educationList)

    if (data?.extras?.person?.education_id && educationList.length) {
      return educationList.find(i => i.id === data?.extras?.person?.education_id)?.name
    }
    return ''
  }, [data, educationList])


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
    const body = {...data}
    body.logo = base + avatar.filename
    CommonUtils.changeUserInfo(body).then(async () => {
      await workerInfo.getUser(true)
      await workerInfo.getPerson(true)
      DeviceEventEmitter.emit(UPDATE_WORKER_INFO)
    })
  }

  const updateGender = async (index: number) => {
    const key = Toast.loading('正在保存...', 0)
    let param = {...data,sex: index}
    // if (param.extras) {
    //   if (param.extras.person) {
    //     param.extras.person.gender = index
    //   }
    // }
    setData(param)
    CommonUtils.changeUserInfo(param).then(async () => {
      Portal.remove(key)
      await workerInfo.getUser(true)
      await workerInfo.getPerson(true)
      DeviceEventEmitter.emit(UPDATE_WORKER_INFO)
    })
  }

  const updateEducation = async (education: any) => {
    const key = Toast.loading('正在保存...', 0)
    const {id} = educationList.find(item => item.name === education[0])
    let param = {...data}
    if (param.extras) {
      if (param.extras.person) {
        param.extras.person.education_id = id
      }
    }
    setData(param)
    CommonUtils.changeUserInfo(param).then(async () => {
      await workerInfo.getUser(true)
      await workerInfo.getPerson(true)
      DeviceEventEmitter.emit(UPDATE_WORKER_INFO)
      Portal.remove(key)
    })
  }

  const addZero = (num: string) => {
    const result = Number(num)
    return result > 10 ? result : '0' + result.toString()
  }

  const updateBirthday = async (birthday: any) => {
    const key = Toast.loading('正在保存...', 0)
    let birthdayString = addZero(birthday[0].slice(0, -1)) + '-' + addZero(birthday[1].slice(0, -1)) + '-' + addZero(birthday[2].slice(0, -1))
    let param = {...data}
    if (param.extras) {
      if (param.extras.person) {
        param.extras.person.birth = birthdayString
      }
    }
    setData(param)
    CommonUtils.changeUserInfo(param).then(async () => {
      await workerInfo.getUser(true)
      await workerInfo.getPerson(true)
      DeviceEventEmitter.emit(UPDATE_WORKER_INFO)
      Portal.remove(key)
    })
  }

  console.log(data)
  return (
    <ScrollView style={styles.container}>
      <ProfileItem
        onPress={() => {
          const options = ['拍照', '从相册选择']
          showActionSheetWithOptions(
            {
              options,
              cancelButtonIndex: 3,
              showSeparators: true, separatorStyle
            },
            (buttonIndex: number) => {
              Picker.hide()
              if (buttonIndex === 0) {
                ImagePicker.launchCamera(
                  {
                    mediaType: 'photo',
                    includeBase64: false,
                    maxHeight: 200,
                    maxWidth: 200,
                  },
                  (response: any) => {
                    uploadAvatar(response)
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
                    uploadAvatar(response)
                  },
                )
              }
              // Do something here depending on the button index selected
            }
          )
        }}
        label="头像"
        value={<Image
          source={data?.logo ? {uri: data?.logo} : defaultAvatar}
          style={styles.userPhoto}/>}
      />
      <ProfileItem
        label="手机号"
        value={data?.phone}
      />
      <ProfileItem
        label="姓名"
        value={data?.nickname}
        onPress={() => {
          props.navigation.navigate('ChangeUserInfo', {
            changType: 'name',
            name: data?.nickname
          })
        }
        }
      />
      <ProfileItem
        label="性别"
        onPress={() => {
          Picker.hide()
          const options = ['保密', '男', '女']
          const cancelButtonIndex = 4
          showActionSheetWithOptions({
            options,
            cancelButtonIndex,
            title: '性别',
            showSeparators: true,
            separatorStyle
          }, (index: number) => {
            if(index === 4) return
            updateGender(index)
          })
        }}
        value={getGender(data?.sex)}
      />
      <ProfileItem
        onPress={() => {
          const educationList = ['小学', '初中', '高中', '大专', '本科']
          Picker.init({
            pickerData: educationList,
            pickerTitleText: '学历',
            selectedValue: [educationString],
            pickerToolBarBg: [245, 245, 245, 1],
            pickerCancelBtnText: '取消',
            pickerBg: [255, 255, 255, 1],
            pickerConfirmBtnText: '确认',
            onPickerConfirm: data => {
              updateEducation(data)
            },
            onPickerCancel: data => {
              console.log(data)
            },
            onPickerSelect: data => {
            }
          })
          Picker.show()
        }}
        label="学历"
        value={educationString}
      />
      <ProfileItem
        onPress={() => {
          Picker.init({
            pickerData: birthDayData,
            pickerTitleText: '生日',
            selectedValue: [
              data?.extras?.person?.birth.split('-')[0] + '年',
              parseInt(data?.extras?.person?.birth.split('-')[1] as string) + '月',
              parseInt(data?.extras?.person?.birth.split('-')[2] as string) + '日'],
            pickerToolBarBg: [245, 245, 245, 1],
            pickerCancelBtnText: '取消',
            pickerBg: [255, 255, 255, 1],
            pickerConfirmBtnText: '确认',
            onPickerConfirm: data => {
              updateBirthday(data)
            },
            onPickerCancel: data => {
              console.log(data)
            },
            onPickerSelect: data => {

            }
          })
          Picker.show()
        }}
        label="生日"
        value={renderDate(data?.extras?.person?.birth) ? renderDate(data?.extras?.person?.birth) : ''}
      />
      <ProfileItem
        label="身份证"
        value={data?.extras?.person?.id_no}
        onPress={() => {
          Picker.hide()
          props.navigation.navigate('ChangeUserInfo', {changType: 'id_no', id_no: data?.extras?.person?.id_no})
        }
        }
      />
      <ProfileItem
        label="住址"
        value={data?.extras?.person?.address}
        onPress={() => {
          props.navigation.navigate('ChangeUserInfo', {
            changType: 'address',
            address: data?.extras?.person?.address
          })
        }
        }
      />
      <View style={styles.divide}/>
      <ProfileItem
        label="所在单位"
        value={data?.extras?.person?.position || data?.extras?.team}
      />
      <ProfileItem
        label="入职日期"
        value={renderDate(data?.extras?.person?.entry_date)}
      />
      {

        data?.extras?.person?.status === 1 ? <TouchableOpacity style={styles.btn} onPress={() => {
          props.navigation.navigate('Leave')
        }}>
          <Text style={styles.btnText}>申请离职</Text>
        </TouchableOpacity> : null
      }

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F5F7',
    flex: 1
  },
  userPhoto: {
    height: ScreenUtils.scaleSize(55),
    width: ScreenUtils.scaleSize(55),
    borderRadius: ScreenUtils.scaleSize(27.5),
  },
  divide: {
    height: 0,
    marginBottom: ScreenUtils.scaleSize(10),
  },
  btn: {
    height: ScreenUtils.scaleSize(42),
    backgroundColor: 'rgba(82, 108, 221, 1)',
    borderRadius: ScreenUtils.scaleSize(21),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ScreenUtils.scaleSize(30),
    marginTop: ScreenUtils.scaleSize(35),
    marginHorizontal: ScreenUtils.scaleSize(31),

  },
  btnText: {
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(15),
  }
})

export default MyProfile
