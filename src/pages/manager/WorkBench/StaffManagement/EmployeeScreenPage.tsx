import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import React, { Component, useContext } from 'react'
import { Text, View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import page from '../../../../components/Page'
import ScreenUtils from '../../../../utils/ScreenUtils'
import Api from '../../../../utils/Api'
import { ManagerContext } from '../../../../utils/Store'
import customerFilter from '../../../../utils/customerFilter'
import { Portal, Provider, Toast } from '@ant-design/react-native'


type Props = {
  navigation: BottomTabNavigationProp<any>,
  customerFilter: any,
  setCustomerFilter: Function,
}

type State = {
  customerList: any[],
  selectCustomer: any,
}

@page({
  navigation: {
    title: 'EmployeeScreenPage',
  },
})
class EmployeeScreenPage extends Component<Props, State> {
  readonly state: State = {
    customerList: [],
    selectCustomer: null,
  }
  componentDidMount() {
    this.getCustomerList()
  }
  getCustomerList = async () => {
    const key = Toast.loading('loading')
    try {
      const list: any[] = await Api.get('/labor/staff/customer/list/all')
      let selectCustomer: any = null
      if (customerFilter.selectID) {
        for (let index = 0; index < list.length; index++) {
          const element = list[index]
          if (element.id === customerFilter.selectID) {
            selectCustomer = element
            break
          }
        }
      }
      this.setState({ customerList: list ?? [], selectCustomer })
      Portal.remove(key)
    } catch (e) {
      Portal.remove(key)
      Toast.fail(e.message)
      console.error(e)
    }
  }
  render() {
    return (
      <Provider>
        <View style={styles.content}>
          <ScrollView style={styles.paddingBox}>
            <View>
              <View style={styles.historyBoxTitle}>
                <View style={styles.historyTitleLeftBox}>
                  <Image style={styles.icon} source={require('../../../../assets/icons/workBench/unitName.png')} />
                  <Text style={styles.titleHeaderLeft}>单位名称</Text>
                </View>
              </View>
              <View style={styles.historyContent}>
                {this.state.customerList.map((x: any) => {
                  return <TouchableOpacity activeOpacity={0.8} key={x.id} onPress={() => { this.setState({ selectCustomer: x, }) }}>
                    <View style={[styles.historyItem, this.state.selectCustomer?.id === x.id ? styles.historyActivityItem : null,]}>
                      <Text style={styles.historyActivityItemText}>{x.name}</Text>
                    </View>
                  </TouchableOpacity>
                })}
              </View>
            </View>
          </ScrollView>
          <View style={styles.bottomBtns}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                this.setState({ selectCustomer: {}, })
                customerFilter.selectID = null
              }}
            >
              <Text style={[styles.btn, styles.cleanBtn]}>清除</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.5} onPress={() => {
              if (this.state.selectCustomer) customerFilter.selectID = this.state.selectCustomer.id
              if (customerFilter.callBack) customerFilter.action()
              if (customerFilter.name) this.props.navigation.navigate(customerFilter.name)
              if (this.props.setCustomerFilter) this.props.setCustomerFilter(this.state.selectCustomer)
            }}>
              <Text style={styles.btn}>确定</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Provider>
    )
  }
}

function Container(props: any) {
  const ctx = useContext(ManagerContext)
  return <EmployeeScreenPage {...props} {...ctx} />
}

export default Container

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#fff',
    flex: 1,
    position: 'relative'
  },
  paddingBox: {
    paddingHorizontal: ScreenUtils.scaleSize(15)
  },
  historyBoxTitle: {
    borderBottomColor: '#E7EBEF',
    borderBottomWidth: ScreenUtils.scaleSize(1),
    height: ScreenUtils.scaleSize(60),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    width: ScreenUtils.scaleSize(22),
    height: ScreenUtils.scaleSize(22),
  },
  historyTitleLeftBox: {
    display: 'flex',
    flexDirection: 'row',
  },
  titleHeaderLeft: {
    color: '#030014',
    fontWeight: 'bold',
    fontSize: ScreenUtils.scaleSize(14),
    marginLeft: ScreenUtils.scaleSize(3),
  },
  historyContent: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  historyActivityItem: {
    backgroundColor: '#526CDD',
  },
  historyItem: {
    backgroundColor: '#33333355',
    height: ScreenUtils.scaleSize(28),
    borderRadius: 4,
    margin: ScreenUtils.scaleSize(8),
    paddingHorizontal: ScreenUtils.scaleSize(8),
    paddingVertical: ScreenUtils.scaleSize(6),
  },
  historyActivityItemText: {
    color: '#fff',
  },
  historyItemText: {
    color: '#545468'
  },
  bottomBtns: {
    borderTopColor: '#eee',
    borderTopWidth: ScreenUtils.scaleSize(1),
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: ScreenUtils.scaleSize(59),
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  cleanBtn: {
    backgroundColor: '#FE9B16',
  },
  btn: {
    width: ScreenUtils.scaleSize(152),
    height: ScreenUtils.scaleSize(39),
    lineHeight: ScreenUtils.scaleSize(39),
    backgroundColor: '#526CDD',
    borderRadius: 50,
    textAlign: 'center',
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(15),
    borderTopColor: 'rgb(0, 0, 0)',
  },
})

