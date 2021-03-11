import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import React, { Component } from 'react'
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
// @ts-ignore
import Textarea from 'react-native-textarea'
import ScreenUtils from '../../../../utils/ScreenUtils'
import Page from '../../../../components/Page'
import Icons from '../../../../Icons'
import Api from '../../../../utils/Api'
import { Profile } from '../../../../@types'
import { Picker, Provider, Portal, Toast } from '@ant-design/react-native'
import {Route} from "@react-navigation/routers";

type Props = {
  navigation: BottomTabNavigationProp<any>
  route: Route<string, { job?: any, isEdit?: boolean }>
}

type State = {
  modalVisible: Boolean,
  list: any[]
  educationList: any[],
  education: number
  company: number
  name: string,
  salary: string,
  recruit_count: string,
  place: string,
  desc: string
  recruitment_range: any[]
}

@Page({
  navigation: {
    title: 'Jobs',
    headerLeft: () => null
  }
})
export default class PublishJob extends Component<Props, State> {
  loading = false
  readonly state: State = {
    modalVisible: false,
    educationList: [],
    list: [],
    company: -1,
    education: -1,
    name: this.props.route.params?.job?.name || '',
    salary: this.props.route.params?.job?.salary || '',
    recruit_count: this.props.route.params?.job?.recruit_count || '',
    place: this.props.route.params?.job?.place || '',
    desc: this.props.route.params?.job?.desc || '',
    recruitment_range: []
  }
  // 获取数据字典
  async fetchBasicData() {
    try {
      const arr: any = await Api.get('/labor/staff/customer/list/all')
      const res: any = await Api.get('/gateway/dicts/root/children?group=education')
      const list = arr.map((item: any) => { return { label: item.name, value: item.id } })
      const educationList: any[] = res.map((item: any) => { return { label: item.name, value: item.id } })
      this.setState({ educationList, list,
        company: list.findIndex((ite: any) => ite.value === this.props.route.params?.job?.customer_id),
        education: educationList.findIndex((ite: any) => ite.value === this.props.route.params?.job?.education_id),
        recruitment_range: arr.filter((ite: any) => (this.props.route.params?.job?.recruitment_range || []).includes(ite.id)),
      })
    }
    catch (error) {
      console.log(error)
    }
  }
  componentDidMount() {
    this.fetchBasicData()
  }
  async applyForJob() {
    if (this.loading) return
    if (this.state.company === -1) {
      Toast.fail('单位名称不能为空')
      return
    }
    if (this.state.name.length === 0) {
      Toast.fail('职位名称不能为空')
      return
    }
    if (this.state.education === -1) {
      Toast.fail('最低学历不能为空')
      return
    }
    if (this.state.salary.length === 0) {
      Toast.fail('薪酬范围不能为空')
      return
    }
    if (this.state.recruit_count.length === 0) {
      Toast.fail('招聘人数不能为空')
      return
    }
    if (this.state.place.length === 0) {
      Toast.fail('工作地点不能为空')
      return
    }
    const data = {
      customer_id: this.state.list[this.state.company].value,
      name: this.state.name,
      education_id: this.state.educationList[this.state.education].value,
      salary: this.state.salary,
      recruit_count: this.state.recruit_count,
      desc: this.state.desc,
      place: this.state.place,
      user_id: '',
      wx_qrcode: '',
      recruitment_range: this.state.recruitment_range.map((item)=>item.id)
    }
    console.log('data: ', data)

    this.loading = true
    const key = Toast.loading('loading')
    if (!!this.props.route.params?.isEdit) {
      if (!this.props.route.params?.job?.id) {
        Portal.remove(key);
        return Toast.fail('数据丢失，请退出从进！')
      }
      delete data.user_id;
      delete data.wx_qrcode;
      try {
        // TODO 多选范围
        const res = await Api.put('/labor/staff/jobs/republish', { ...data, id: this.props.route.params?.job?.id })
        Portal.remove(key)
        Toast.success('重新发布成功')
        this.loading = false
        this.props.navigation.navigate('MyPositions', { tabKey: '待审核' })
      } catch (error) {
        Toast.fail(error.message)
        this.loading = false
        Portal.remove(key)
      }
    } else {
      try {
        // TODO 多选范围
        const res = await Api.post('/labor/staff/jobs', { ...data })
        Portal.remove(key)
        Toast.success('发布成功')
        this.props.navigation.navigate('MyPositions', { tabKey: '待审核' })
        this.loading = false
      } catch (error) {
        Toast.fail(error.message)
        this.loading = false
        Portal.remove(key)
      }
    }
  }

  setModalVisible = (visible: boolean) => {
    this.setState({ modalVisible: visible })
  }
  onChangeText(value: string, type: string) {
    if (type === 'name') this.setState({ name: value })
    if (type === 'salary') this.setState({ salary: value })
    if (type === 'recruit_count') this.setState({ recruit_count: value })
    if (type === 'place') this.setState({ place: value })
    if (type === 'desc') this.setState({ desc: value })
  }

  render() {
    return (
      <Provider>
        <ScrollView style={styles.box}>
          <View style={styles.titleBox}>
            <Image style={styles.titleIcon} source={require('../../../../assets/icons/job/edit.png')} />
            <Text style={styles.titleText}>编辑职位信息</Text>
          </View>
          <View style={styles.boxContent}>
            {
              this.state.educationList.length > 0 ?
                <Picker
                  data={[this.state.list]}
                  title={'单位'}
                  value={[this.state.list[this.state.company > -1 ? this.state.company : 0]?.value]}
                  cascade={false}
                  onOk={(result: any) => {
                    for (let index = 0; index < this.state.list.length; index++) {
                      const element = this.state.list[index]
                      if (element.value === result[0]) {
                        this.setState({ company: index })
                        break
                      }
                    }
                  }}
                  cols={1}
                >
                  <TouchableOpacity>
                    <View style={styles.item}>
                      <Text style={styles.itemLable}>单位名称</Text>
                      <View style={styles.flexBox}>
                        <Text style={this.state.company > -1 ? styles.pleaseSelect2 : styles.pleaseSelect}>{this.state.company > -1 ? this.state.list[this.state.company]?.label : '请选择'}</Text>
                        <Image source={Icons.Public.More} style={styles.listItemMore} />
                      </View>
                      <View style={styles.borderBottomLine} />
                    </View>
                  </TouchableOpacity>
                </Picker> : null
            }
          </View>
          <View style={styles.boxContent}>
            <View style={styles.item}>
              <Text style={styles.itemLable}>职位名称</Text>
              <TextInput
                value={this.state.name}
                onChangeText={(value: string) => { this.onChangeText(value, 'name') }}
                style={styles.itemInput}
                placeholder="请输入职位名称"
                key="sex"
                maxLength={11}
                placeholderTextColor="#A8A8AC"
              />
              <View style={styles.borderBottomLine} />
            </View>
          </View>
          <View style={styles.boxContent}>
            {
              this.state.educationList.length > 0 ?
                <Picker
                  data={[this.state.educationList]}
                  title={'学历'}
                  value={[this.state.educationList[this.state.education > -1 ? this.state.education : 0].value]}
                  cascade={false}
                  onOk={(result: any) => {
                    for (let index = 0; index < this.state.educationList.length; index++) {
                      const element = this.state.educationList[index]
                      if (element.value === result[0]) {
                        this.setState({ education: index })
                        break
                      }
                    }
                  }}
                  cols={1}
                >
                  <TouchableOpacity>
                    <View style={styles.item}>
                      <Text style={styles.itemLable}>最低学历</Text>
                      <View style={styles.flexBox}>
                        <Text style={this.state.education > -1 ? styles.pleaseSelect2 : styles.pleaseSelect}>{this.state.education > -1 ? this.state.educationList[this.state.education].label : '请选择'}</Text>
                        <Image source={Icons.Public.More} style={styles.listItemMore} />
                      </View>
                      <View style={styles.borderBottomLine} />
                    </View>
                  </TouchableOpacity>
                </Picker> : null
            }
          </View>
          <View style={styles.boxContent}>
            <View style={styles.item}>
              <Text style={styles.itemLable}>薪资范围</Text>
              <TextInput
                value={this.state.salary}
                onChangeText={(value: string) => { this.onChangeText(value, 'salary') }}
                style={styles.itemInput}
                placeholder="请输入薪资范围"
                keyboardType="numeric"
                placeholderTextColor="#A8A8AC"
                key="age"
                maxLength={11}
              />
              <View style={styles.borderBottomLine} />
            </View>
          </View>
          <View style={styles.boxContent}>
            <View style={styles.item}>
              <Text style={styles.itemLable}>招聘人数</Text>
              <TextInput
                value={this.state.recruit_count}
                onChangeText={(value: string) => { this.onChangeText(value, 'recruit_count') }}
                style={styles.itemInput}
                placeholder="请输入招聘人数"
                keyboardType="numeric"
                placeholderTextColor="#A8A8AC"
                key="age"
                maxLength={11}
              />
              <View style={styles.borderBottomLine} />
            </View>
          </View>
          <View style={styles.boxContent}>
            <View style={styles.item}>
              <Text style={styles.itemLable}>工作地点</Text>
              <TextInput
                value={this.state.place}
                onChangeText={(value: string) => { this.onChangeText(value, 'place') }}
                style={styles.itemInput}
                placeholder="请输入工作地点"
                placeholderTextColor="#A8A8AC"
                key="age"
                maxLength={11}
              />
              <View style={styles.borderBottomLine} />
            </View>
          </View>
          <TouchableOpacity onPress={() => {
            this.props.navigation.navigate('EmployeeScreen2', {
              ids: this.state.recruitment_range, goBack: (res: any) => {
                this.setState({ recruitment_range: res })
              }
            })
          }} style={styles.boxContent}>
            <View style={styles.item}>
              <Text style={styles.itemLable}>招聘范围</Text>
              <View style={styles.flexBox}>
                <Text style={styles.pleaseSelect}>{this.state.recruitment_range.length > 0 ? '已选择' :'请选择厂家'}</Text>
                <Image source={Icons.Public.More} style={styles.listItemMore} />
              </View>
              <View style={styles.borderBottomLine} />
            </View>
          </TouchableOpacity>

          {/* <View style={styles.boxContent}>
            {
              this.state.educationList.length > 0 ?
                <Picker
                  data={[this.state.list]}
                  title={'招聘范围'}
                  value={[this.state.list[this.state.company > -1 ? this.state.company : 0].value]}
                  cascade={false}
                  onOk={(result: any) => {
                    for (let index = 0; index < this.state.list.length; index++) {
                      const element = this.state.list[index]
                      if (element.value === result[0]) {
                        this.setState({ company: index })
                        break
                      }
                    }
                  }}
                  cols={1}
                >
                  <TouchableOpacity>

                  </TouchableOpacity>
                </Picker> : null
            }
          </View> */}
          <View style={styles.boxContent}>
            <View style={styles.item}>
              <Text style={styles.itemLable}>职位描述</Text>
              <View style={styles.flexBox}>
                <Text style={styles.pleaseSelect}>最多300字</Text>
              </View>
            </View>
            <View style={styles.textAreaWrapper}>
              <Textarea
                value={this.state.desc}
                onChangeText={(value: string) => { this.onChangeText(value, 'desc') }}
                placeholder="请输入职位描述信息"
                style={styles.textArea}
                placeholderTextColor="#A8A8AC"
              />
            </View>
          </View>
          <View style={styles.bottomBtns}>
            <TouchableOpacity style={styles.btn} activeOpacity={0.5} onPress={this.applyForJob.bind(this)}>
              <Text style={styles.btnText}>提  交</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </Provider >
    )
  }
}

const styles = StyleSheet.create({
  pleaseSelect2: {
    color: '#545468',
    marginRight: ScreenUtils.scaleSize(5)
  },
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
    justifyContent: 'flex-start',
    height: ScreenUtils.scaleSize(40),
    backgroundColor: '#F3F5F7',
    paddingLeft: ScreenUtils.scaleSize(11),
  },
  titleIcon: {
    width: ScreenUtils.scaleSize(22),
    height: ScreenUtils.scaleSize(22),
    marginRight: ScreenUtils.scaleSize(6),
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
    textAlign: 'right',
  },
  pleaseSelect: {
    color: '#A8A8AC'
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

    backgroundColor: '#fff',
    display: 'flex',
    paddingBottom: ScreenUtils.scaleSize(20),

  },
  btn: {
    justifyContent: 'space-around',
    alignItems: 'center',
    height: ScreenUtils.scaleSize(39),
    lineHeight: ScreenUtils.scaleSize(39),
    backgroundColor: '#526CDD',
    borderRadius: ScreenUtils.scaleSize(20),
    marginHorizontal: ScreenUtils.scaleSize(25),

  },
  btnText: {
    fontSize: ScreenUtils.scaleSize(15),
    color: '#fff',
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
  textAreaWrapper: {
    padding: ScreenUtils.scaleSize(15),
    // flexDirection: "row",
    height: ScreenUtils.scaleSize(104),
    backgroundColor: '#F3F5F7',
    borderRadius: ScreenUtils.scaleSize(5),
    marginBottom: ScreenUtils.scaleSize(47),
    overflow: 'hidden',
  },
  textArea: {
    // flex: 1,
    // width: ScreenUtils.scaleSize(250),
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  }
})

