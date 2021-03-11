import React from 'react'
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import ScreenUtils from '../../../../utils/ScreenUtils'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { Provider, Toast,Portal } from '@ant-design/react-native'
import Api from '../../../../utils/Api'

type Props = {
    navigation: BottomTabNavigationProp<any>
    route: any
}

function OneClickProcess({ navigation, route }: Props) {
  const isL = React.useRef(false)
  const isU = React.useRef(false)
  const [all, setAll] = React.useState(0)
  const ids = React.useRef([])
  React.useEffect(() => {
    return () => {
      isU.current = true
    }
  }, [])
  const renderList = React.useMemo(() => {
    const obj: any = {}
    const arr = []
    ids.current = []
    route.params.list.map((item: any) => {
      let count = 0
      let money = 0
      ids.current.push(item.id)
      if (obj[item.customer_id]) {
        count = obj[item.customer_id].count + 1
        money = obj[item.customer_id].money + (item.amount/1000)
        obj[item.customer_id].count = count
        obj[item.customer_id].money = money
      }
      else {
        obj[item.customer_id] = { name: item.customer_name }
        obj[item.customer_id].count = 1
        obj[item.customer_id].money = (item.amount/1000)
      }

    })
    let arrNumber = 0
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const { name, count, money } = obj[key]
        arrNumber += money
        arr.push({ name, count, money })
      }
    }
    setAll(arrNumber)
    return arr.map((item, index) => {
      return (
        <View key={index} style={styles.item}>
          <Text style={[styles.headerText, styles.firstCell]}>{item.name}</Text>
          <Text style={styles.headerText}>{item.count}</Text>
          <Text style={styles.headerText}>{item.money}元</Text>
        </View>
      )
    })

  }, [route])
  return (
    <Provider>
      <View style={styles.container}>
        <ScrollView style={styles.listWrapper}>
          <View style={styles.header}>
            <Text style={[styles.headerText, styles.firstCell]}>单位</Text>
            <Text style={styles.headerText}>借款人数</Text>
            <Text style={styles.headerText}>借款金额</Text>
          </View>
          <View style={styles.white}>
            {renderList}
          </View>
        </ScrollView>
        <View style={styles.bottom}>
          <View style={styles.left}>
            <View style={styles.textWrapper}>
              <Text style={styles.leftText}>总计:</Text>
              <Text style={styles.symbol}>￥</Text>
              <Text style={styles.money}>{all}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={async () => {
            if (isL.current || ids.current.length === 0) return
            isL.current = true
            const key = Toast.loading('loading')
            try {
              await Api.put('/labor/staff/loan/batch/handle', { status: 5, ids: ids.current })
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
        </View>
      </View>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listWrapper: {
    flex: 1,
  },
  white: {
    backgroundColor: '#fff'
  },
  header: {
    height: ScreenUtils.scaleSize(41),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: ScreenUtils.scaleSize(15),
    paddingRight: ScreenUtils.scaleSize(43),
    backgroundColor: '#F3F5F7'
  },
  headerText: {
    color: '#030014',
    fontSize: ScreenUtils.scaleSize(13),
  },
  item: {
    backgroundColor: '#fff',
    height: ScreenUtils.scaleSize(43),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingLeft: ScreenUtils.scaleSize(15),
    paddingRight: ScreenUtils.scaleSize(28),
    marginHorizontal: ScreenUtils.scaleSize(15),
    borderBottomColor: '#E7EBEF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    // borderStyle: 'dashed',
  },
  firstCell: {
    width: '33%'
  },
  bottom: {
    height: ScreenUtils.scaleSize(59),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: ScreenUtils.scaleSize(10),
    paddingHorizontal: ScreenUtils.scaleSize(15),
    backgroundColor: '#fff'
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ScreenUtils.scaleSize(26),
  },
  leftText: {
    color: '#A8A8AC',
    fontSize: ScreenUtils.scaleSize(12),
    // lineHeight: ScreenUtils.scaleSize(25),
    alignSelf: 'flex-end'
  },
  symbol: {
    color: '#F25959',
    fontSize: ScreenUtils.scaleSize(12),
    marginBottom: ScreenUtils.scaleSize(1),
    alignSelf: 'flex-end'
  },
  money: {
    color: '#F25959',
    fontSize: ScreenUtils.scaleSize(25),
  },
  btn: {
    backgroundColor: '#526CDD',
    borderRadius: 20,
    width: ScreenUtils.scaleSize(119),
    height: ScreenUtils.scaleSize(39),
    alignItems: 'center'
  },
  btnText: {
    color: 'white',
    fontSize: ScreenUtils.scaleSize(16),
    lineHeight: ScreenUtils.scaleSize(39),
    fontWeight: 'bold'
  },
})

export default OneClickProcess
