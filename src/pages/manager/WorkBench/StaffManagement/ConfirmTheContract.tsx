import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import React, { Component } from 'react'
import {
  Modal,
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Picker,
} from 'react-native'
import ScreenUtils from '../../../../utils/ScreenUtils'
import Page from '../../../../components/Page'
import Icons from '../../../../Icons'

type Props = {
    navigation: BottomTabNavigationProp<any>
}

type State = {
    modalVisible: Boolean,
}

@Page({
  navigation: {
    title: 'ConfirmTheContract',
  }
})
export default class ConfirmTheContractPage extends Component<Props, State> {
    readonly state: State = {
      modalVisible: false,
    }

    applyForJob = () => {
      this.setModalVisible(!this.state.modalVisible)
    }

    setModalVisible = (visible: boolean) => {
      this.setState({ modalVisible: visible })
    }

    render() {
      const { modalVisible } = this.state
      return (
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
                <Text style={styles.modalText}>恭喜您签约成功！</Text>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: '#526CDD' }}
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
            <View style={styles.item}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.itemLable}>时薪</Text>
                <Text style={styles.redPoint}>*</Text>
              </View>
              <TextInput
                // value={this.state.}
                // onChangeText={(value: string) => {this.onChangeText(value, 'verCode')}}
                style={styles.itemInput}
                placeholder="请输入时薪"
                key="tel"
                keyboardType="numeric"
                maxLength={11}
              />
            </View>
          </View>
          <View style={styles.boxContent}>
            <View style={styles.item}>
              {/*<Picker*/}
              {/*    style={{width:200, height:50}}*/}
              {/*    // selectedValue={this.state.language}*/}
              {/*    // onValueChange={(lang) => this.setState({language: lang})}*/}
              {/*>*/}
              {/*    <Picker.Item label="Java" value="java" />*/}
              {/*    <Picker.Item label="JavaScript" value="js" />*/}
              {/*    <Picker.Item label="Swift" value="swift" />*/}
              {/*    <Picker.Item label="Objective-C" value="oc" />*/}
              {/*</Picker>*/}
              <Text style={styles.itemLable}>计薪日期</Text>
              <View style={styles.flexBox}>
                <Text style={styles.pleaseSelect}>选择日期</Text>
                <Image source={Icons.Public.More} style={styles.listItemMore} />
              </View>
            </View>
          </View>
          <View style={styles.bottomBtns}>
            <TouchableOpacity activeOpacity={0.5} onPress={this.applyForJob}>
              <Text style={styles.btn}>确认签约</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  }
})
