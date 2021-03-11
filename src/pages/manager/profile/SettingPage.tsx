import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'

import Api from '../../../utils/Api'
import Icons from '../../../Icons'
import ScreenUtils from '../../../utils/ScreenUtils'
import Page from '../../../components/Page'
import { Provider, Toast } from '@ant-design/react-native'
import { getCache } from '../../../utils/cache'

type Props = {
  navigation: BottomTabNavigationProp<any>
}

type State = {
  cache: number
}

@Page()
export default class WorkerHomePage extends Component<Props, State> {

  readonly state: State = {
    cache: 120
  }


  async componentDidMount() {
    const cache = await getCache()
    this.setState({ cache })
  }

  onSearch() {

  }

  async onLoginoutPress() {
    await Api.logout(true)
    this.props.navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
  }

  render() {
    return (
      <Provider>
        <View style={styles.content}>
          <TouchableOpacity activeOpacity={0.5} style={styles.itemView} onPress={() => {
            this.props.navigation.navigate('ChangePasswordPageMan')}
          }>
            <Text style={styles.itemTitle}>修改密码</Text>
            <Image source={Icons.Public.More} style={styles.itemMoreIcon} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} style={styles.itemView} onPress={() => {
            this.setState({ cache: 0 })
            Toast.success('清除完成')
          }}>
            <Text style={styles.itemTitle}>清除缓存</Text>
            <Text style={styles.itemTip}>{this.state.cache}KB</Text>
            <Image source={Icons.Public.More} style={styles.itemMoreIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.outBtn} onPress={this.onLoginoutPress.bind(this)} activeOpacity={0.5}>
            <Text style={styles.btnText}>退出登录</Text>
          </TouchableOpacity>
        </View>
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

  }
})

