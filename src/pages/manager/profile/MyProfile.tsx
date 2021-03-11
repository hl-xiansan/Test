import React, {useEffect, useMemo, useState} from 'react'
import {ScrollView, StyleSheet, View, Image, Text, TouchableOpacity, DeviceEventEmitter} from 'react-native'
import ProfileItem from '../../../components/ProfileItem'
import ScreenUtils from '../../../utils/ScreenUtils'
import Api from '../../../utils/Api'
import {Profile} from '../../../@types'
import {Portal, Provider, Toast} from '@ant-design/react-native'
import {UPDATE_WORKER_INFO, workerInfo} from "../../../utils/worker";
import Picker from "react-native-picker";
import * as ImagePicker from "react-native-image-picker";
import {useActionSheet} from "@expo/react-native-action-sheet";
import CommonUtils from "../../../utils/CommonUtils";

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
  return date.split('T')[0]
}

const defaultAvatar = require('../../../assets/images/login-bg.png')

const baseUrl = 'http://tongtu.juyunfuwu.cn/api/tongtu/storage/user/'

type ViewStyle = {
  backgroundColor: string;
}

function MyProfile() {
  const {showActionSheetWithOptions = () => void {}} = useActionSheet()
  const [data, setData] = useState<Profile>({})
  const [educationList, setEducationList] = useState<any[]>([])
  const isU = React.useRef(false)

  function fetchData() {
    // return Api.get<Profile>('/gateway/profile').then((res) => {
    //     console.log(res)
    //
    //     if (res && !isU.current) setData(res)
    // }).catch((e) => console.log(e))

    return workerInfo.getUser().then((res) => {

      if (res && !isU.current) setData(res)
    })
  }

  // 获取数据字典
  // function fetchBasicData() {
  //   return Api
  //     .get('/gateway/dicts/root/children?group=education')
  //     .then((res) => {
  //       if (Array.isArray(res) && !isU.current) setEducationList(res)
  //     })
  //     .catch((e) => console.log(e))
  // }

  function selectUpdateAvatarOptions() {
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
                  uploadAvatar(response).then()
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
                  uploadAvatar(response).then()
                },
            )
          }
        }
    )
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
    const avatar = await workerInfo.updateManagerAvatar(param)
    // data.logo = baseUrl + avatar.filename

    const body = {...data,logo:baseUrl + avatar.filename}
    setData(body)

    await CommonUtils.changeUserInfo(body)
    await workerInfo.getUser(true)
    DeviceEventEmitter.emit(UPDATE_WORKER_INFO)
  }

  const separatorStyle: ViewStyle = {
    backgroundColor: '#eee'
  }

  const educationString = useMemo(() => {
    if (data?.extras?.person?.education_id && educationList.length) {
      return educationList.find(i => i.id === data?.extras?.person?.education_id)?.name
    }
    return ''
  }, [data, educationList])

  const getData = React.useCallback(async () => {
    const key = Toast.loading('loading')
    await fetchData()
    // await fetchBasicData()
    Portal.remove(key)
  }, [])

  useEffect(() => {
    getData()
    return () => {
      isU.current = true
    }
  }, [])

  return (
    <Provider>
      <ScrollView style={styles.container}>
        <ProfileItem
          label="头像"
          onPress={selectUpdateAvatarOptions}
          value={
            <Image
              source={data?.logo ? {uri: data?.logo} : defaultAvatar}
              style={styles.userPhoto}/>
          }
        />
        <ProfileItem
          label="手机号"
          value={data?.phone}
        />
        <ProfileItem
          label="姓名"
          value={data?.nickname}
        />
        <ProfileItem
          label="性别"
          value={getGender(data?.extras?.person?.gender || data?.sex)}
        />
        {/*<ProfileItem*/}
        {/*  label="学历"*/}
        {/*  value={educationString}*/}
        {/*/>*/}
        <ProfileItem
          label="生日"
          value={renderDate(data?.extras?.birth)}
        />
        <ProfileItem
          label="身份证"
          value={data?.extras?.id_no}
        />
        <ProfileItem
          label="住址"
          value={data?.extras?.address}
        />
        <View style={styles.divide}/>
        <ProfileItem
          label="微信号"
          value={data?.extras?.wechat}
        />
        {/* <ProfileItem
          label="微信二维码"
          value={<Image
            style={styles.userPhoto}
            source={{ uri: data?.extras?.person?.wx_qrcode }}
          />}
        /> */}
      </ScrollView>
    </Provider>
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
