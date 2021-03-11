import React, { useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ScreenUtils from '../../../../utils/ScreenUtils'
import { Picker } from '@ant-design/react-native'
import Icons from '../../../../Icons'
import Api from '../../../../utils/Api'

export const getPickerData = () => {
  let firstYear = 2000
  let month = Array(12)
    .fill(null)
    .map((_, index) => ({
      value: index + 1, label: index + 1
    }))
  let years = Array(30)
    .fill(null)
    .map((_, index) => ({
      value: index + firstYear, label: index + firstYear,
      children: month
    }))
  return years
}



function LoanFilter(props: any) {
  const pickerDateData: any = getPickerData()
  const [date, setDate] = useState(`2021-${new Date().getMonth() + 1}`)
  const [company, setCompany] = useState(0)
  const [list, setList] = useState<any[]>([])
  
  React.useEffect(() => {
    fetchBasicData()
  }, [])
  // 获取数据字典
  const fetchBasicData = async () => {
    try {
      const arr: any = await Api.get('/labor/staff/customer/list/all')
      const list = [{ label: '全部', value: 0 }]
      arr.map((item: any) => { list.push({ label: item.name, value: item.id }) })
      setList(list)
    }
    catch (error) {
      console.log(error)
    }
  }
  return (
    <View style={styles.filter}>
      <Picker
        data={pickerDateData}
        value={[2021, new Date().getMonth() + 1]}
        cols={2}
        title={'选择时间'}
        onOk={(chooseDate) => {
          const date = chooseDate.join('-')
          setDate(date)
          props.onChange(date, list[company].value)
        }}
      >
        <TouchableOpacity style={styles.item}>
          <Text style={styles.date}>{date}</Text>
          <Image style={styles.downIcon} source={Icons.Loan.Down} />
        </TouchableOpacity>
      </Picker>
      {
        list.length > 0 ? <Picker
          data={[list]}
          title={'选择工厂'}
          value={[list[company].value]}
          cascade={false}
          onOk={(result: any) => {
            for (let index = 0; index < list.length; index++) {
              const element = list[index]
              if (element.value === result[0]) {
                console.log(element.value)
                
                props.onChange(date, element.value)
                setCompany(index)
                break
              }
            }
          }}
          cols={1}
        >
          <TouchableOpacity style={styles.item}>
            <Text style={styles.date}>{list[company].label}</Text>
            <Image style={styles.downIcon} source={Icons.Loan.Down} />
          </TouchableOpacity>
        </Picker>
          : null
      }

    </View>
  )
}

const styles = StyleSheet.create({

  filter: {
    backgroundColor: '#fff',
    height: ScreenUtils.scaleSize(45),
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    overflow: 'hidden'
  },
  date: {
    color: '#030014',
    fontSize: ScreenUtils.scaleSize(14)
  },
  chooseFactory: {
    color: '#A8A8AC',
    fontSize: ScreenUtils.scaleSize(14)
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downIcon: {
    width: ScreenUtils.scaleSize(7),
    height: ScreenUtils.scaleSize(4.5),
    marginLeft: ScreenUtils.scaleSize(10)
  }
})

export default LoanFilter
