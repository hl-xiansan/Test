import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import React, { Component } from 'react'
import {
  Modal,
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  Image,
  TouchableOpacity,
  Switch,
} from 'react-native'
import Textarea from 'react-native-textarea'
import ScreenUtils from '../../../../utils/ScreenUtils'
import Page from '../../../../components/Page'
import Icons from '../../../../Icons'
import { Picker, Portal, Provider, Toast } from '@ant-design/react-native'
import { getPickerData } from '../LoanManagement/LoanFilter'
import Api from '../../../../utils/Api'

type Props = {
    navigation: BottomTabNavigationProp<any>
    route: any
}

type State = {
    modalVisible: Boolean,
    date: string
    value: string
    switchValue: boolean
}

@Page({
  navigation: {
    title: 'ConfirmTheContract',
  }
})
export default class ConfirmTheTerminationPage extends Component<Props, State> {
    pickerDateData: any = getPickerData()
    loading = false
    readonly state: State = {
      modalVisible: false,
      date: `2021-${new Date().getMonth() + 1}`,
      value: '',
      switchValue: false
    }

    async applyForJob() {
      if (this.loading) return
      this.loading = true
      const key = Toast.loading('loading')

      const status:number = this.state.switchValue ? 2 : 3
      try {
        const data = { desc: this.state.value, status: status }
        await Api.put(`/labor/staff/worker/${this.props.route.params.id}/fire`, data)
        Portal.remove(key)
        this.loading = false
        this.setModalVisible(!this.state.modalVisible)
        if (this.props.route.params.goBack) this.props.route.params.goBack()
      } catch (error) {
        Portal.remove(key)
        this.loading = false
        Toast.fail(error.message)
      }
    }

    setModalVisible = (visible: boolean) => {
      this.setState({ modalVisible: visible })
    }

    render() {
      const { modalVisible } = this.state
      return (
        <Provider>
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
                  <Image style={styles.successImg} source={require('../../../../assets/icons/job/successImg.png')} />
                  <Text style={styles.modalText}>恭喜您解约成功！</Text>
                  <TouchableHighlight
                    style={{
                      ...styles.openButton, backgroundColor: '#526CDD'
                    }}
                    onPress={() => {
                      this.setModalVisible(!modalVisible)
                    }}
                  >
                    <Text style={styles.textStyle}>关闭</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>
            <View style={styles.boxContent}>
              <Picker
                data={this.pickerDateData}
                value={[2021, new Date().getMonth() + 1]}
                cols={2}
                title={'选择日期'}
                onOk={(chooseDate) => {
                  const date = chooseDate.join('-')
                  this.setState({ date })
                }}
              >
                <TouchableOpacity>
                  <View style={styles.item}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.itemLable}>解约日期</Text>
                      <Text style={styles.redPoint}>*</Text>
                    </View>
                    <View style={styles.flexBox}>
                      <Text style={styles.pleaseSelect}>{this.state.date}</Text>
                      <Image source={Icons.Public.More} style={styles.listItemMore} />
                    </View>
                  </View>
                </TouchableOpacity>
              </Picker>
            </View>
            <View style={styles.boxContent}>
              <View style={styles.item}>
                <Text style={styles.itemLable}>解约原因</Text>
              </View>
              <View style={styles.textAreaWrapper}>
                <Textarea
                  value={this.state.value}
                  onChangeText={(value: string) => { this.setState({ value }) }}
                  placeholder="填写解约原因"
                  style={styles.textArea}
                  placeholderTextColor="#A8A8AC"
                />
              </View>
            </View>
            <View style={styles.boxContent}>
              <View style={styles.item}>
                <Text style={styles.itemLable}>是否加入黑名单</Text>
                <Switch
                  onValueChange={(switchValue) => { this.setState({ switchValue }) }}
                  trackColor={{
                    false: '#ccc', true: '#ccc'
                  }}
                  thumbColor={false ? 'blue' : '#ccc'} // 保持这个变量和下面的value变量一致
                  ios_backgroundColor="#3e3e3e"
                  value={this.state.switchValue} // 保持这个变量和上面的thumbColor变量一致
                />
              </View>
            </View>
            <View style={styles.bottomBtns}>
              <TouchableOpacity activeOpacity={0.5} onPress={this.applyForJob.bind(this)}>
                <Text style={styles.btn}>确认解约</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Provider >
      )
    }
}

const styles = StyleSheet.create({
  box: {
    display: 'flex',
    flex: 1,
    position: 'relative',
    paddingBottom: ScreenUtils.scaleSize(59),
  },
  boxContent: {
    position: 'relative',
    backgroundColor: '#fff',
    paddingHorizontal: ScreenUtils.scaleSize(15),
    borderBottomWidth: ScreenUtils.scaleSize(1),
    borderBottomColor: '#F3F5F7',
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: ScreenUtils.scaleSize(55),
  },
  redPoint: {
    color: '#FF5B53',
    fontSize: ScreenUtils.scaleSize(16),
    marginLeft: 5
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
  textAreaWrapper: {
    // paddingLeft: ScreenUtils.scaleSize(15),
    // paddingRight: ScreenUtils.scaleSize(15),
    overflow: 'hidden',
    paddingHorizontal: ScreenUtils.scaleSize(15),
    height: ScreenUtils.scaleSize(134),
    backgroundColor: '#F3F5F7',
    borderRadius: ScreenUtils.scaleSize(5),
    marginBottom: ScreenUtils.scaleSize(15),
  },
  textArea: {
    // flex: 1,
    // width: ScreenUtils.scaleSize(250),
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  }
})
