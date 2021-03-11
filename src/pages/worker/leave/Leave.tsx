import React, { useState } from 'react'
import { StyleSheet, View, Text, Image, ScrollView, TextInput, TouchableOpacity, ImageBackground } from 'react-native'
// @ts-ignore
import Textarea from 'react-native-textarea'
import Tabs from '../../../components/Tabs'
import ScreenUtils from '../../../utils/ScreenUtils'
import Icons from '../../../Icons'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import ScreenUtil from '../../../utils/ScreenUtils'
import LinearGradient from 'react-native-linear-gradient'
import LeaveList from './LeaveList'
import { DatePicker, Portal, Provider, Toast } from '@ant-design/react-native'
import Api from '../../../utils/Api'


type Props = {
  navigation: BottomTabNavigationProp<any>
}

export function formatDate(date: Date) {
  const pad = (n: number) => n < 10 ? `0${n}` : n
  return date ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` : '请选择'
}

function Leave({ navigation }: Props) {
  const [tabKey, setTabKey] = useState('申请离职')
  const [date, setDate] = useState<Date | null>(null)
  const [desc, setDesc] = useState('')
  const loading = React.useRef(false)
  const isU = React.useRef(false)
  React.useEffect(() => {
    return () => {
      isU.current = true
    }
  }, [])
  const onSubmit = async () => {
    if (loading.current) return
    if (!date) return Toast.info('请先选择离职日期')
    loading.current = true
    const key = Toast.loading('loading')
    try {
      const res = await Api.post('/labor/my/jobs/out', { out_date: date, desc })
      console.log(res)

      if (isU.current) return
      loading.current = false
      Toast.success('提交申请')
      Portal.remove(key)
    } catch (error) {
      console.log(error)
      if (isU.current) return
      loading.current = false
      Toast.fail(error.message)
    }
  }

  return (
    <Provider>
      <View style={styles.container}>
        <Tabs
          data={['申请离职', '查看记录']}
          value={tabKey}
          onChange={setTabKey}
        />
        {
          tabKey === '申请离职' ? <View>
            <ScrollView>
              <View style={styles.boxContent}>
                <View style={styles.item}>
                  <Text style={styles.itemLable}>
                    离职日期
                    <Text style={styles.red}> *</Text>
                  </Text>

                  <View style={styles.flexBox}>
                    <DatePicker
                      mode="date"
                      extra="Optional"
                      value={date}
                      onChange={date => setDate(date)}
                    >
                      <Text style={styles.pleaseSelect}>{formatDate(date)}</Text>

                    </DatePicker>
                    <Image source={Icons.Public.More} style={styles.listItemMore} />
                  </View>
                </View>
              </View>
              <View style={styles.boxContent}>
                <View style={styles.item}>
                  <Text style={styles.itemLable}>离职原因</Text>
                </View>
                <View style={styles.textAreaWrapper}>
                  <Textarea
                    placeholder="请填写..."
                    style={styles.textArea}
                    placeholderTextColor="#A8A8AC"
                    onChangeText={(text: string) => { setDesc(text) }}
                  />
                </View>
              </View>
              <TouchableOpacity style={styles.btn} onPress={() => { onSubmit() }}>
                <Text style={styles.btnText}>提  交</Text>
              </TouchableOpacity>
            </ScrollView>
          </View> : <LeaveList navigation={navigation} />
        }
      </View>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tip: {
    height: ScreenUtils.scaleSize(43),
    backgroundColor: '#FFF4EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: ScreenUtils.scaleSize(12),
  },
  tipText: {
    color: '#FE7400',
    fontSize: ScreenUtils.scaleSize(14),
  },
  tipImg: {
    height: ScreenUtils.scaleSize(22),
    width: ScreenUtils.scaleSize(22),
    marginRight: ScreenUtils.scaleSize(5),
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F5F7',
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
    textAlign: 'right',
  },
  pleaseSelect: {
    color: '#A8A8AC'
  },
  listItemMore: {
    width: ScreenUtils.scaleSize(6),
    height: ScreenUtils.scaleSize(14),
    marginLeft: ScreenUtils.scaleSize(11),
  },
  red: {
    color: '#FF4343',
  },
  textAreaWrapper: {
    padding: ScreenUtils.scaleSize(15),
    // flexDirection: "row",
    height: ScreenUtils.scaleSize(104),
    backgroundColor: '#F3F5F7',
    borderRadius: ScreenUtils.scaleSize(5),
    marginBottom: ScreenUtils.scaleSize(24),
  },
  textArea: {
    // backgroundColor:'#ff00ff',
    height: ScreenUtils.scaleSize(104 - 30),
  },
  btn: {
    height: ScreenUtils.scaleSize(42),
    backgroundColor: 'rgba(82, 108, 221, 1)',
    borderRadius: ScreenUtils.scaleSize(21),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ScreenUtils.scaleSize(30),
    marginTop: ScreenUtils.scaleSize(56),
    marginHorizontal: ScreenUtils.scaleSize(31),

  },
  btnText: {
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(15),
  },
  leaveItem: {
    marginTop: ScreenUtils.scaleSize(10),
    marginHorizontal: ScreenUtils.scaleSize(15),
    backgroundColor: '#fff'
  },
  leaveItemTop: {
    flexDirection: 'row',
    height: ScreenUtils.scaleSize(50),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: ScreenUtils.scaleSize(15),
  },
  leaveTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leaveTitle: {
    color: '#030014',
    fontSize: ScreenUtils.scaleSize(16),
    fontWeight: '700'
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
  linearGradient: {
    height: ScreenUtil.scaleSize(19),
    width: ScreenUtil.scaleSize(3.5),
    borderRadius: ScreenUtil.scaleSize(1.5),
    marginRight: ScreenUtil.scaleSize(11),
  },
  leaveItemBottom: {
    marginHorizontal: ScreenUtil.scaleSize(15),
    paddingVertical: ScreenUtil.scaleSize(15),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F3F5F7',
  },
  bottomText: {
    fontSize: ScreenUtils.scaleSize(14),
    color: '#545468'
  },
  dot: {
    height: ScreenUtil.scaleSize(3),
    width: ScreenUtil.scaleSize(3),
    borderRadius: ScreenUtil.scaleSize(1.5),
    backgroundColor: '#545468',
    marginRight: ScreenUtil.scaleSize(14),
  },
  bottomItem: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export default Leave
