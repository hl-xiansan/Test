import React from 'react'
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import ScreenUtils from '../../../../utils/ScreenUtils'
import { BoxShadow } from 'react-native-shadow'
import Api from '../../../../utils/Api'
import { Provider, Portal, Toast } from '@ant-design/react-native'

function ModifyLoanAmount({ navigation, route }: any) {
  const [value, setValue] = React.useState('')
  const isL = React.useRef(false)
  const isU = React.useRef(false)
  React.useEffect(() => {
    // console.log(route)
    
    return () => {
      isU.current = true
    }
  }, [])
  return (
    <Provider>
      <ScrollView style={styles.container}>
        <View style={styles.box}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image style={styles.titleIcon} source={require('../../../../assets/icons/job/edit.png')} />
              <Text style={styles.title}>修改金额</Text>
            </View>
            <Text style={styles.tip}>* 最多可借500元</Text>
          </View>
          <View style={styles.center}>
            <TextInput
              value={value}
              placeholder="输入修改金额"
              style={styles.textInput}
              editable
              keyboardType="numeric"
              onChangeText={(str) => { setValue(str) }}
              placeholderTextColor="#A8A8AC"
            // onSubmitEditing = {() => {props.onSubmitEditing ? props.onSubmitEditing() : null}}
            />
            <TouchableOpacity onPress={async () => {
              if (isL.current) return
              isL.current = true
              const key = Toast.loading('loading')
              try {
                await Api.put(`/labor/staff/loan/${route.params.id}`, { status: 7, real_amount: Number(value) * 1000, desc: '' })
                Portal.remove(key)
                Toast.success('修改成功')
                isL.current = false
                setTimeout(() => {
                  route.params.goBack()
                  navigation.goBack()
                }, 1000)
              } catch (error) {
                Portal.remove(key)
                Toast.fail(error.message)
                isL.current = false
              }
            }} style={styles.btn}>
              <Text style={styles.btnText}>确认</Text>
            </TouchableOpacity>
            <Text style={styles.desc}>确认后，流程流转至借款人</Text>
          </View>
        </View>
      </ScrollView>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F5F7'
  },
  box: {
    marginHorizontal: ScreenUtils.scaleSize(30),
    marginVertical: ScreenUtils.scaleSize(53),
    borderRadius: ScreenUtils.scaleSize(5),
    backgroundColor: '#fff',
    elevation: 6,
    shadowColor: 'rgba(37, 48, 57, 0.08)',  //  阴影颜色
    shadowOffset: { width: 0, height: 5 },  // 阴影偏移
    shadowOpacity: 1,  // 阴影不透明度
    shadowRadius: 10,  //  圆角
  },
  header: {
    height: ScreenUtils.scaleSize(53),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ScreenUtils.scaleSize(20),
    backgroundColor: '#F3F5FF'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: '#030014',
    fontWeight: 'bold',
    fontSize: ScreenUtils.scaleSize(15),
  },
  titleIcon: {
    height: ScreenUtils.scaleSize(20),
    width: ScreenUtils.scaleSize(20),
    marginRight: ScreenUtils.scaleSize(10),
  },
  tip: {
    color: '#526CDD',
    fontSize: ScreenUtils.scaleSize(13),
  },
  center: {
  },
  textInput: {
    textAlign: 'center',
    fontSize: ScreenUtils.scaleSize(25),
    fontWeight: '600',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DFE4EA',
    marginTop: ScreenUtils.scaleSize(90),
    paddingBottom: ScreenUtils.scaleSize(15),
    marginHorizontal: ScreenUtils.scaleSize(46),
  },
  btn: {
    backgroundColor: '#526CDD',
    borderRadius: 20,
    height: ScreenUtils.scaleSize(39),
    marginTop: ScreenUtils.scaleSize(106),
    marginBottom: ScreenUtils.scaleSize(24),
    marginHorizontal: ScreenUtils.scaleSize(24),
    alignItems: 'center'
  },
  btnText: {
    color: 'white',
    fontSize: ScreenUtils.scaleSize(16),
    lineHeight: ScreenUtils.scaleSize(39),
    fontWeight: 'bold'
  },
  desc: {
    color: '#A8A8AC',
    fontSize: ScreenUtils.scaleSize(12),
    textAlign: 'center',
    marginBottom: ScreenUtils.scaleSize(24),
  }
})

export default ModifyLoanAmount
