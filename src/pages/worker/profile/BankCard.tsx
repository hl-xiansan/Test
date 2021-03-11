import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback, KeyboardAvoidingView, Platform, StatusBar, Keyboard
} from 'react-native'
import ScreenUtils from '../../../utils/ScreenUtils'
import { Provider, Toast, Portal } from '@ant-design/react-native'
import Icons from '../../../Icons'
import ScreenUtil from '../../../utils/ScreenUtils'
import Api from '../../../utils/Api'
import BankCardItem, { IBankItem } from '../../../components/BankCardItem'

interface InputData {
  card_owner: string,
  bank_name: string,
  bank_account: string,
  location: string,
}
const fieldTip: { [x: string]: string } = {
  card_owner: '持卡人',
  bank_name: '银行名称',
  bank_account: '银行卡号',
  location: '开户行',
}

function BankCard() {
  const [visible, setVisible] = useState(false)
  const [dataSource, setDataSource] = useState<IBankItem[]>([])
  const seletRef = React.useRef<string | null>(null)

  const [inputData, setInputData] = useState<InputData>({
    card_owner: '',
    bank_name: '',
    bank_account: '',
    location: '',
  })

  function fetchData() {
    const loadingKey = Toast.loading('加载中...')
    return Api
      .get('/labor/my/bankcard/list')
      .then((res) => {
        if (Array.isArray(res)) {
          console.log(res.length)
          setDataSource(res)
        }
      })
      .catch((e) => console.log(e))
      .finally(() => { Portal.remove(loadingKey) })
  }

  useEffect(() => {
    fetchData()
  }, [])

  function onChange(value = {}) {
    setInputData({
      ...inputData,
      ...value,
    })
  }

  function submit() {
    Keyboard.dismiss()
    const emptyFieldName: string[] = []
    Object.keys(fieldTip).forEach(i => {
      // @ts-ignore
      if (!inputData[i]) emptyFieldName.push(fieldTip[i])
    })
    if (emptyFieldName.length) {
      return Toast.info(`请输入${emptyFieldName.join('、')}`)
    }
    const accountReg = /^\d$/g
    if (inputData['bank_account'].length > 19 || inputData['bank_account'].length < 15 || accountReg.test(inputData['bank_account'])) {
      return Toast.info('银行卡号应为15~19位数字')
    }
    const loadingKey = Toast.loading('保存中...')
    const success = () => {
      fetchData()
      Portal.remove(loadingKey)
      setVisible(false)
      setInputData({
        card_owner: '',
        bank_name: '',
        bank_account: '',
        location: '',
      })
    }
    const error = (e: Error) => setTimeout(() => { Toast.fail(e.message) }, 100)
    if (seletRef.current) {
      console.log('put', `/labor/my/bankcard/${seletRef.current}`)
      console.log(inputData)

      Api
        .put(`/labor/my/bankcard/${seletRef.current}`, inputData)
        .then(success)
        .catch(error)
    }
    else {
      Api
        .post('/labor/my/bankcard', inputData)
        .then(success)
        .catch(error)
    }
  }
  const onCreate = () => {
    setVisible(false)
    seletRef.current = null
    setInputData({
      card_owner: '',
      bank_name: '',
      bank_account: '',
      location: '',
    })
  }
  const onEdit = (i: IBankItem) => {
    setVisible(true)
    seletRef.current = i.id
    const { card_owner, bank_name, bank_account, location } = i
    setInputData({ card_owner, bank_name, bank_account, location })
  }
  const onRemove = (i: IBankItem) => {
    const loadingKey = Toast.loading('删除中...')
    console.log(`/labor/my/bankcard/${i.id}`)

    Api
      .delete(`/labor/my/bankcard/${i.id}`)
      .then(() => {
        fetchData()
        Portal.remove(loadingKey)
        setVisible(false)
      })
      .catch((e) => { setTimeout(() => { Toast.fail(e.message) }, 100) })
  }
  return (
    <Provider>
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          {dataSource.map(i => <BankCardItem onEdit={() => { onEdit(i) }} onRemove={() => { onRemove(i) }} data={i} key={i.id} />)}
          {!dataSource.length ? <Text style={styles.empty}>暂无数据</Text> : null}
          <TouchableOpacity onPress={() => { setVisible(true) }} style={styles.addBtn}>
            <View style={styles.addIconWrapper}>
              <Image source={Icons.BankCard.Add} style={styles.addIcon}></Image>
            </View>
            <Text style={styles.addBtnText}>添加银行卡</Text>
          </TouchableOpacity>
        </ScrollView>
        <View style={[{ zIndex: visible ? 1 : -99 }, styles.maskContainer]} key={String(visible)}>
          <TouchableWithoutFeedback onPress={onCreate}>
            <View style={styles.mask} />
          </TouchableWithoutFeedback>
          <KeyboardAvoidingView enabled behavior="padding" keyboardVerticalOffset={Platform.select({ ios: 0, android: -(StatusBar.currentHeight || 0) - 10 })}>
            <View style={styles.maskContent}>
              <View style={styles.modalTitle}>
                <Text style={styles.modalTitleText}>添加银行卡</Text>
              </View>
              <Item onChange={onChange} value={inputData.card_owner} field="card_owner" title="持卡人" def="请输入姓名" />
              <Item onChange={onChange} value={inputData.bank_name} field="bank_name" title="银行名称" def="请输入银行" />
              <Item onChange={onChange} value={inputData.bank_account} field="bank_account" title="银行卡号" def="输入卡号" />
              <Item onChange={onChange} value={inputData.location} field="location" title="开户行" def="填写开户行" />
              <TouchableOpacity style={styles.subBtn} onPress={submit}>
                <Text style={styles.subText}>{seletRef.current ? '编辑银行卡' : '添加银行卡'}</Text>
              </TouchableOpacity>

            </View>
          </KeyboardAvoidingView>

        </View>
      </View>
    </Provider>
  )
}

const Item = ({ title, value, field, onChange, def }: { def: string, title: string, value: string, field: string, onChange: (value: any) => void }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.itemTitle}>{title}</Text>
      <View style={styles.verticalCenter}>
        <TextInput
          value={value}
          onChangeText={(value: string) => onChange({ [field]: value })}
          style={styles.itemRightText}
          placeholder={def}
          // key="verCode"
          maxLength={16}
        />
        <Image
          source={Icons.Public.More}
          style={styles.more}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  maskContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'flex-end'
  },
  mask: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0, 0.5)',
  },
  maskContent: {
    backgroundColor: '#fff',
  },
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  logo: {
    height: ScreenUtils.scaleSize(26),
    width: ScreenUtils.scaleSize(26),
  },
  empty: {
    marginTop: ScreenUtils.scaleSize(26),
    fontSize: ScreenUtils.scaleSize(16),
    textAlign: 'center'
  },
  addBtn: {
    height: ScreenUtils.scaleSize(50),
    backgroundColor: '#F3F5F7',
    marginHorizontal: ScreenUtils.scaleSize(15),
    borderRadius: ScreenUtils.scaleSize(5),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: ScreenUtils.scaleSize(30),
  },
  addBtnText: {
    color: '#545468',
    fontSize: ScreenUtils.scaleSize(15),

  },
  addIconWrapper: {
    // borderWidth: StyleSheet.hairlineWidth,
    // borderStyle: "dashed",
    // borderColor: '#545468',
    marginRight: ScreenUtils.scaleSize(9),
  },
  addIcon: {
    height: ScreenUtils.scaleSize(15),
    width: ScreenUtils.scaleSize(15),
  },
  modalTitle: {
    borderBottomColor: '#F3F5F7',
    borderBottomWidth: ScreenUtils.scaleSize(1),
    height: ScreenUtils.scaleSize(58),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: ScreenUtils.scaleSize(15)
  },
  modalTitleText: {
    color: '#030014',
    fontSize: ScreenUtils.scaleSize(16),

    textAlign: 'center',
  },
  item: {
    height: ScreenUtils.scaleSize(58),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: ScreenUtils.scaleSize(15),
    borderBottomColor: '#F3F5F7',
    borderBottomWidth: ScreenUtils.scaleSize(1),
  },
  itemTitle: {
    color: '#030014',
    fontSize: ScreenUtils.scaleSize(15),
  },
  verticalCenter: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemRightText: {
    color: '#545468',
    fontSize: ScreenUtils.scaleSize(15),
  },
  more: {
    height: ScreenUtils.scaleSize(16),
    width: ScreenUtils.scaleSize(16),
    marginLeft: ScreenUtils.scaleSize(15),
    // marginRight: ScreenUtils.scaleSize(5),

  },
  subBtn: {
    backgroundColor: '#526CDD',
    width: ScreenUtil.scaleSize(300),
    height: ScreenUtil.scaleSize(40),
    marginHorizontal: ScreenUtil.scaleSize(40),
    marginTop: ScreenUtil.scaleSize(80),
    marginBottom: ScreenUtil.scaleSize(23),
    alignItems: 'center',
    justifyContent: 'center',
    padding: ScreenUtil.scaleSize(12),
    borderRadius: ScreenUtil.scaleSize(20),
  },
  subText: {
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(15)
  }
})

export default BankCard
