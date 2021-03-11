import React, { Component } from 'react'
import { Text, View, StatusBar, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { ApplicationStoreDispatchProps, ApplicationStoreState } from '../../../../utils/Store'
import Icons from '../../../../Icons'
import Page from '../../../../components/Page'
import ScreenUtils from '../../../../utils/ScreenUtils'
import { BoxShadow } from 'react-native-shadow'
import { Portal, Provider, Toast } from '@ant-design/react-native'
import { calculateAge } from '../../../../utils/Fn'
import Api from '../../../../utils/Api'

export type Props = {
  navigation: BottomTabNavigationProp<any>
  route: any
} & ApplicationStoreState & ApplicationStoreDispatchProps

@Page()
export default class ResumeDetail extends Component<Props> {

  state: any = {
    user: null
  }
  shadowOpt = {
    height: ScreenUtils.scaleSize(234),
    width: ScreenUtils.scaleSize(345),
    color: '#253039',
    border: 4,
    radius: 1,
    opacity: 0.02,
    x: 0,
    y: -1
  }

  componentDidMount() {
    this.getData()
  }
  async getData() {
    const key = Toast.loading('loading')
    try {
      const { id } = this.props.route.params
      const res = await Api.get(`/labor/person/${id}/profiles`, { params: { id } })
      const user = res
      this.setState({ user })
      Portal.remove(key)
    } catch (error) {
      Portal.remove(key)
      Toast.fail(error.message)
    }
  }
  onChangeRolePress = () => {
    this.props.changeToManager()
  }

  onLogoutPress = () => {
    this.props.navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }]
    })
  }

  onBankCardPress = () => {
    this.props.navigation.navigate('BankCard')
  }

  onProfileDetailPress = () => {
    this.props.navigation.navigate('MyProfile')
  }

  toScan = () => {
    this.props.navigation.navigate('Scan')
    // this.props.navigation.navigate('AICustomer')
  }

  render() {
    console.log(this.state.user)
    
    return (
      <Provider>
        <View style={styles.content}>
          <StatusBar barStyle={'light-content'} translucent={true} backgroundColor="rgba(255,255,255,0)" />
          <View style={styles.bgView}>
            <View style={styles.bgViewLeft}>
              <Text style={styles.name}>{this.state.user?.name}</Text>
              <Text style={styles.cardNumber}>身份证号：{this.state.user?.id_no}</Text>
            </View>
            <Image source={this.state.user?.photo ? { uri: 'http://tongtu.juyunfuwu.cn/api/tongtu/storage/' +this.state.user?.photo } : require('../../../../assets/images/login-bg.png')} style={styles.userPhoto} />
          </View>
          <View style={styles.listView}>
            <View style={styles.userInfoView}>
              <Text style={styles.phone}>手机号码：{this.state.user?.telephone}</Text>
              <Image source={Icons.WorkBench.Tel} style={styles.phoneIcon} />
            </View>
            <ScrollView style={{ paddingTop: ScreenUtils.scaleSize(10) }}>
              <View style={styles.item}>
                <Text style={styles.itemTitle}>性别</Text>
                <View style={styles.itemRight}>
                  <Text style={styles.itemText}>{this.state.user?.gender ? ['保密', '男', '女'][this.state.user.gender] : '保密'}</Text>
                </View>
              </View>
              <View style={styles.item}>
                <Text style={styles.itemTitle}>年龄</Text>
                <View style={styles.itemRight}>
                  <Text style={styles.itemText}>{calculateAge(this.state.user?.birth)}</Text>
                </View>
              </View>
              <View style={styles.item}>
                <Text style={styles.itemTitle}>学历</Text>
                <View style={styles.itemRight}>
                  <Text style={styles.itemText}>{ this.state.user?.qualifications }</Text>
                </View>
              </View>
              <View style={styles.item}>
                <Text style={styles.itemTitle}>邮箱/QQ</Text>
                <View style={styles.itemRight}>
                  <Text style={styles.itemText}>{ this.state.user?.qq || this.state.user?.email }</Text>
                </View>
              </View>
              <View style={styles.item}>
                <Text style={styles.itemTitle}>现住地址</Text>
                <View style={styles.itemRight}>
                  <Text style={styles.itemText}>{ this.state.user?.address }</Text>
                </View>
              </View>
              <View style={styles.item}>
                <Text style={styles.itemTitle}>工作年限</Text>
                <View style={styles.itemRight}>
                  <Text style={styles.itemText}></Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#FFF',
    flex: 1,
    position: 'relative'
  },
  bgView: {
    height: ScreenUtils.scaleSize(120),
    backgroundColor: 'rgba(82, 108, 221, 1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ScreenUtils.scaleSize(15),
    paddingBottom: ScreenUtils.scaleSize(32),
  },
  bgViewLeft: {

  },
  name: {
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(15),
    fontWeight: 'bold',
    marginBottom: ScreenUtils.scaleSize(7),
  },
  cardNumber: {
    color: '#C9D3FF',
    fontSize: ScreenUtils.scaleSize(12),
  },
  listView: {
    marginHorizontal: ScreenUtils.scaleSize(15),
    marginTop: ScreenUtils.scaleSize(-33),
    borderRadius: ScreenUtils.scaleSize(5),
  },
  userInfoView: {
    flexDirection: 'row',
    height: ScreenUtils.scaleSize(64),
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: ScreenUtils.scaleSize(5),
    paddingHorizontal: ScreenUtils.scaleSize(10),
    elevation: 6,
    shadowColor: 'rgba(37, 48, 57, 0.08)',  //  阴影颜色
    shadowOffset: { width: 0, height: 5 },  // 阴影偏移
    shadowOpacity: 1,  // 阴影不透明度
    shadowRadius: 10,  //  圆角
  },
  userPhoto: {
    width: ScreenUtils.scaleSize(55),
    height: ScreenUtils.scaleSize(55),
    borderRadius: ScreenUtils.scaleSize(55),
  },
  phone: {
    color: '#545468',
    fontSize: ScreenUtils.scaleSize(14),
  },
  phoneIcon: {
    width: ScreenUtils.scaleSize(32),
    height: ScreenUtils.scaleSize(32)
  },
  item: {
    height: ScreenUtils.scaleSize(55),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    color: '#545468',
    fontSize: ScreenUtils.scaleSize(14),
  },
  itemText: {
    color: '#2C2D30',
    fontSize: ScreenUtils.scaleSize(14),
  },
  itemRight: {
    borderBottomColor: '#E7EBEF',
    borderBottomWidth: ScreenUtils.scaleSize(1),
    width: ScreenUtils.scaleSize(275),
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
})
