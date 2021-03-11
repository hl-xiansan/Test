import {Portal, Provider, Toast} from '@ant-design/react-native'
import React, {useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  TouchableHighlight,
  Modal
} from 'react-native'
import Api from '../../../../utils/Api'
import ScreenUtils from '../../../../utils/ScreenUtils'

function Item({label, required = false, inputType = 'INPUT', value, setValue}: any) {
  return (
    <View style={styles.itemBox}>
      <View style={styles.label}>
        <Text style={styles.labelText}>{label}</Text>
        {required && <Text style={styles.required}>*</Text>}
      </View>
      {inputType === 'INPUT' ? (
        <TextInput
          //   style={styles.itemInput}
          value={value}
          onChangeText={(str) => {
            setValue(str)
          }}
          placeholder={`请输入${label}`}
          key="num"
          keyboardType="numeric"
        />
      ) : null}
    </View>
  )
}

export default function ConfirmBatchProcessPage(props: any) {
  const [modalVisible, setModalVisible] = useState(false)
  const [value1, setValue1] = useState('')
  const [value2, setValue2] = useState('')
  const isL = React.useRef(false)
  const sentData = async () => {
    if (value1 === '') {
      Toast.fail('日薪不能为空')
      return
    }
    if (isL.current) return
    isL.current = true
    const key = Toast.loading('loading')

    try {
      const data = {
        ids: props.route.params.ids,
        salary: Number(value1),
        salary_date: value2
      }
      await Api.put('/labor/staff/worker/sign', JSON.stringify({...data}))
      Portal.remove(key)
      setModalVisible(true)
      setTimeout(() => {
        if (props.route.params.goBack) props.route.params.goBack()
        props.navigation.goBack()
        setModalVisible(!modalVisible)
      }, 1000)
      isL.current = false
    } catch (error) {
      console.log('re', error)
      Portal.remove(key)
      Toast.fail(error.message)
      isL.current = false
    }
  }

  const transfer = async () => {
    if (value1 === '') {
      Toast.fail('日薪不能为空111')
      return
    }
    const data = {
      salary: Number(value1),
      salary_date: value2
    }
    const key = Toast.loading('loading',0)

    try {
      await Api.post(`/labor/staff/worker/transfer/${props.route.params.id}`,data)
      Portal.remove(key)
      setModalVisible(true)
      setTimeout(() => {
        if (props.route.params.goBack) props.route.params.goBack()
        props.navigation.goBack()
        setModalVisible(!modalVisible)
      }, 1000)
    } catch (error) {
      console.log('re', error)
      Portal.remove(key)
      Toast.fail(error.message)
    }
  }

  return (
    <Provider>
      <View style={styles.content}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            console.log(props.route.params.goBack)
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image style={styles.successImg}
                     source={require('../../../../assets/icons/workBench/processIsComplete.png')}/>
              <Text style={styles.modalText}>处理已完成</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  ...styles.openButton, backgroundColor: '#526CDD'
                }}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>关闭</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Item
          label={'日薪（元）'}
          required
          value={value1}
          setValue={setValue1}
        />
        <Item
          label={'计薪日期'}
          value={value2}
          setValue={setValue2}
        />
        <View style={styles.bottomBtns}>
          <TouchableOpacity activeOpacity={0.5} onPress={() => {
            if (typeof props.route.params.transfer !== 'undefined') {
              transfer().then()
              return
            }
            sentData().then()
          }}>
            <Text style={styles.btn}>确认</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Provider>
  )
}

const styles = StyleSheet.create({
  content: {
    height: '100%',
    position: 'relative',
  },
  itemBox: {
    height: ScreenUtils.scaleSize(75),
    borderBottomWidth: ScreenUtils.scaleSize(1),
    borderBottomColor: '#E7EBEF',
    paddingHorizontal: ScreenUtils.scaleSize(15),
    paddingVertical: ScreenUtils.scaleSize(15),
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    color: '#030014',
    fontSize: ScreenUtils.scaleSize(15),
    fontWeight: 'bold',
  },
  required: {
    color: '#FF5749',
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    height: ScreenUtils.scaleSize(235),
    paddingTop: ScreenUtils.scaleSize(120),
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
  successImg: {
    width: ScreenUtils.scaleSize(200),
    height: ScreenUtils.scaleSize(135),
    position: 'absolute',
    top: ScreenUtils.scaleSize(-50)
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: ScreenUtils.scaleSize(15),
    lineHeight: ScreenUtils.scaleSize(39),
  },
  modalText: {
    marginBottom: ScreenUtils.scaleSize(25),
    textAlign: 'center',
    fontSize: ScreenUtils.scaleSize(18),
  }
})
