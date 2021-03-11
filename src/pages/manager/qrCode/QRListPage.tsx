import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'
import Icons from '../../../Icons'
import ScreenUtils from '../../../utils/ScreenUtils'
import Page from '../../../components/Page'
import Api from '../../../utils/Api'
import { Provider, Toast,Portal } from '@ant-design/react-native'

type Props = {
  navigation: BottomTabNavigationProp<any>,
  route: any
}


@Page()
export default class QRListPage extends Component<Props> {
  isU = false
  readonly state: any = {
    list: [1]
  }
  componentWillUnmount() {
    this.isU = true
  }
  async componentDidMount() {
    const key = Toast.loading('loading')
    // 请求接口
    try {
      const res = await Api.get('/labor/staff/customer/list/all')
      Portal.remove(key)
      if (Array.isArray(res) && !this.isU) {

        this.setState({ list: res })
      }

    } catch (error) {
      Portal.remove(key)
      Toast.fail(error.message)
      console.log(error)

    }
  }
  renderList() {
    if (Array.isArray(this.state.list)) {
      return this.state.list.map((item: any, index: number) => {
        return (
          <TouchableOpacity key={index} activeOpacity={0.5} style={styles.itemView} onPress={() => { this.props.navigation.navigate('ScanCode', {
            id: this.props.route.params.id,
            customerId: item.id,
            customerName: item.name,
            inviteCode: this.props.route.params.inviteCode,
          }) }}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Image source={Icons.QR.QRcode} style={styles.qrcodeImg} />
            <Image source={Icons.Public.More} style={styles.itemMoreIcon} />
          </TouchableOpacity>
        )
      })
    }
    return null
  }

  render() {
    return (
      <Provider>
        <View style={styles.content}>{this.renderList()}</View>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'rgba(243, 245, 247, 1)',
    flex: 1,
    position: 'relative',
    height: '100%'
  },
  itemView: {
    height: ScreenUtils.scaleSize(58),
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ScreenUtils.scaleSize(15)
  },
  itemTitle: {
    color: 'rgba(3, 0, 20, 1)',
    fontSize: ScreenUtils.scaleSize(15),
    flex: 1
  },
  itemTip: {
    color: 'rgba(168, 168, 172, 1)',
    fontSize: ScreenUtils.scaleSize(15),
    marginRight: ScreenUtils.scaleSize(15)
  },
  itemMoreIcon: {
    width: ScreenUtils.scaleSize(12),
    height: ScreenUtils.scaleSize(20)
  },
  outBtn: {
    marginHorizontal: ScreenUtils.scaleSize(30),
    height: ScreenUtils.scaleSize(42),
    borderRadius: ScreenUtils.scaleSize(21),
    backgroundColor: 'rgba(82, 108, 221, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: ScreenUtils.scaleSize(80)
  },
  btnText: {
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(15),
  },
  qrcodeImg: {
    width: ScreenUtils.scaleSize(21),
    height: ScreenUtils.scaleSize(21),
    marginRight: ScreenUtils.scaleSize(10),
  },
})

