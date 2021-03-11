import React from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import ScreenUtils from '../../../../utils/ScreenUtils'
import Icons from '../../../../Icons'
import { Picker, Provider, Toast,Portal } from '@ant-design/react-native'
import Api from '../../../../utils/Api'
import {workerInfo} from "../../../../utils/worker";

type Props = {
    navigation: BottomTabNavigationProp<any>
}

const useCompany = (title: string): any => {
  const [list, setList] = React.useState<any[]>([])
  const [company, setCompany] = React.useState(-1)
  const [value, setValue] = React.useState('')
  React.useEffect(() => {
    getList()
  }, [])
  const getList = async () => {
    try {
      const arr: any = await Api.get('/labor/staff/customer/list/all')
      const list = arr.map((item: any) => { return { label: item.name, value: item.id } })
      setList(list)
      setCompany(0)
    } catch (error) {
      Toast.fail(error.message)
    }
  }
  const companyRender = () => {
    return list.length > 0 ?
      <Picker
        data={[list]}
        title={title}
        value={[list[company > -1 ? company : 0].value]}
        cascade={false}
        onOk={(result: any) => {
          for (let index = 0; index < list.length; index++) {
            const element = list[index]
            if (element.value === result[0]) {
              setValue(element.value)
              setCompany(index)
              break
            }
          }
        }}
        cols={1}
      >
        <TouchableOpacity>
          <View style={styles.title}>
            <View style={styles.verticalCenter}>
              <Image style={styles.titleIcon} source={Icons.Comment.Company} />
              <Text style={styles.titleLeftText}>单位名称</Text>
            </View>
            <View style={styles.verticalCenter}>
              <Text style={styles.titleRightText}>{company > -1 ? list[company].label : ''}</Text>
              <Image
                source={Icons.Public.More}
                style={styles.more}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Picker> : null
  }
  return [company, companyRender,value]
}
function CommentChoose({ navigation }: Props) {
  const [company, companyRender,value] = useCompany('单位名称')
  const [list, setList] = React.useState<any[]>([])
  const [select, setSelect] = React.useState(0)
  React.useEffect(() => {
    if (company > -1) getList()
  }, [company])
  const getList = async () => {
    const key = Toast.loading('loading')
    try {
      const res: any = await Api.get('/labor/staff/comment/uncomment/list/1', { params: { page: 1, size: 1000,customer_id:value } })
      console.log(res)

      setList(res.list)
      setSelect(0)
      Portal.remove(key)
    } catch (error) {
      Toast.fail(error.message)
      Portal.remove(key)
    }
  }
  const renderList = () => {
    return list.map((item, index) => {
      return <TouchableOpacity onPress={()=>{ setSelect(index) }} activeOpacity={0.8} key={index} style={select === index ? [styles.name, styles.activeName] : styles.name}>
        <Text style={[styles.nameText, styles.activeNameText]}>{item.name}</Text>
      </TouchableOpacity>
    })
  }
  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>本评价为保密性评价，仅供管理人员查看</Text>
        </View>
        <ScrollView>
          {companyRender()}
          <View style={styles.employeeBox}>
            <View style={styles.employeeTitle}>
              <Image style={styles.titleIcon} source={Icons.Comment.Employee} />
              <Text style={styles.titleLeftText}>员工</Text>
            </View>
            <View style={styles.employeeList}>
              {renderList()}
            </View>
          </View>
        </ScrollView>
        <View style={styles.bottomBtns}>
          <TouchableOpacity style={styles.btn} activeOpacity={0.5} onPress={() => {
            if (list.length === 0) {
              return
            }
            navigation.navigate('CommentAdd',{ id:list[select].id,goBack:()=>{ getList() } })
          }}>
            <Text style={styles.btnText}>评  价</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    position: 'relative',
  },
  header: {
    height: ScreenUtils.scaleSize(40),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerText: {
    color: '#545468',
    fontSize: ScreenUtils.scaleSize(13),
  },
  title: {
    height: ScreenUtils.scaleSize(45),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ScreenUtils.scaleSize(15),
    backgroundColor: '#fff',
    borderRadius: ScreenUtils.scaleSize(5),
    marginHorizontal: ScreenUtils.scaleSize(15),
    marginTop: ScreenUtils.scaleSize(15),
  },
  verticalCenter: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleIcon: {
    height: ScreenUtils.scaleSize(22),
    width: ScreenUtils.scaleSize(22),
    marginRight: ScreenUtils.scaleSize(6),
  },
  titleLeftText: {
    color: '#030014',
    fontSize: ScreenUtils.scaleSize(15),
  },
  titleRightText: {
    color: '#545468',
    fontSize: ScreenUtils.scaleSize(15),
  },
  more: {
    height: ScreenUtils.scaleSize(16),
    width: ScreenUtils.scaleSize(16),
    marginLeft: ScreenUtils.scaleSize(15),
    // marginRight: ScreenUtils.scaleSize(5),

  },
  employeeBox: {
    backgroundColor: '#fff',
    borderRadius: ScreenUtils.scaleSize(5),

    marginTop: ScreenUtils.scaleSize(15),
    paddingHorizontal: ScreenUtils.scaleSize(15),
    marginHorizontal: ScreenUtils.scaleSize(15),
  },
  employeeTitle: {
    height: ScreenUtils.scaleSize(45),
    flexDirection: 'row',
    alignItems: 'center',
  },
  employeeList: {
    borderTopWidth: ScreenUtils.scaleSize(1),
    borderTopColor: '#F3F5F7',
    paddingTop: ScreenUtils.scaleSize(15),
    paddingBottom: ScreenUtils.scaleSize(3),
    flexDirection: 'row',
    // justifyContent:'space-around',
    flexWrap: 'wrap'
  },
  name: {
    // width: ScreenUtils.scaleSize(94),
    paddingHorizontal:ScreenUtils.scaleSize(10),
    height: ScreenUtils.scaleSize(33),
    borderWidth: ScreenUtils.scaleSize(1),
    borderColor: '#F3F5F7',
    borderRadius: ScreenUtils.scaleSize(5),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ScreenUtils.scaleSize(12),
    marginRight: ScreenUtils.scaleSize(12),
  },
  activeName: {
    borderColor: '#526CDD',
    backgroundColor: '#f1f3fc'
  },
  activeNameText: {
    color: '#526CDD',
  },
  nameText: {
    color: '#545468',
    fontSize: ScreenUtils.scaleSize(14),
  },
  bottomBtns: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: ScreenUtils.scaleSize(59),
    // backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  btn: {
    width: ScreenUtils.scaleSize(325),
    height: ScreenUtils.scaleSize(39),
    lineHeight: ScreenUtils.scaleSize(39),
    backgroundColor: '#526CDD',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: 'rgb(0, 0, 0)',
    borderRadius: ScreenUtils.scaleSize(20),
  },
  btnText: {
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(16),
  }
})

export default CommentChoose
