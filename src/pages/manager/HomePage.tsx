import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import React, { Component } from 'react'
import {StyleSheet, View, Text, Image, TouchableOpacity, ScrollView} from 'react-native'
import page from '../../components/Page'
import LinearGradient from 'react-native-linear-gradient'
import ScreenUtils, {screenW} from '../../utils/ScreenUtils'
import { Carousel } from '@ant-design/react-native'
import Icons from '../../Icons'
import AsyncStorage from "@react-native-community/async-storage";
import {workerInfo} from "../../utils/worker";


type Props = {
  navigation: BottomTabNavigationProp<any>
}

@page({
  token: true,
  navigation: {
    title: 'Home'
  }
})
export default class ManagerHomePage extends Component<Props> {

  readonly state: {roleAuthority:string | null} = {
    roleAuthority:  ''
  }

  async componentDidMount() {
    workerInfo.init();

    let auth:string | null = await AsyncStorage.getItem('appRoleFactory')
    if (auth != null) {
      this.state.roleAuthority = auth
      this.setState({
        roleAuthority: this.state.roleAuthority
      })
      return
    }

    this.state.roleAuthority = await AsyncStorage.getItem('appRoleRecruit')
    this.setState({
      roleAuthority: this.state.roleAuthority
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Carousel
          autoplay
          infinite
          style={styles.carousel}
          dotStyle={styles.dotStyle}
        >
          <Image source={Icons.ManagerHomePage.Banner} style={styles.banner}></Image>
          <Image source={Icons.ManagerHomePage.Banner} style={styles.banner}></Image>
          <Image source={Icons.ManagerHomePage.Banner} style={styles.banner}></Image>
        </Carousel>
        <LinearGradient colors={['rgba(82, 108, 221, 1)', 'rgba(82, 108, 221, 0.5)', 'rgba(82, 108, 221, 0.1)']} style={styles.linearGradient}></LinearGradient>
        <ScrollView style={styles.list}>
          <TouchableOpacity
            onPress={() => {
              if (this.state.roleAuthority === '1') {
                this.props.navigation.navigate('Recruit', { screen: 'AllPositions' })
                return
              }
              this.props.navigation.navigate('RecruitPositions')
            }}
            style={styles.item}
          >
            <Image source={Icons.ManagerHomePage.Recruit} style={styles.itemIcon} />
            <View style={styles.left}>
              <Text style={styles.title}>招聘管理</Text>
              <View style={styles.go}>
                <Text style={styles.goText}>进入</Text>
                <Image source={Icons.ManagerHomePage.More} style={styles.more} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => {
            if (this.state.roleAuthority === '1') {
              this.props.navigation.navigate('StaffManagement')
              return
            }
            this.props.navigation.navigate('RecruitManagement')
          }}>
            <Image source={Icons.ManagerHomePage.Employee} style={styles.itemIcon} />
            <View style={styles.left}>
              <Text style={styles.title}>员工管理</Text>
              <View style={styles.go}>
                <Text style={styles.goText}>进入</Text>
                <Image source={Icons.ManagerHomePage.More} style={styles.more} />
              </View>
            </View>
          </TouchableOpacity>
          {
            this.state.roleAuthority === '1' ?
              <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('LoanManagement')
              }} style={styles.item}>
                <Image source={Icons.ManagerHomePage.Loan} style={styles.itemIcon} />
                <View style={styles.left}>
                  <Text style={styles.title}>借款管理</Text>
                  <View style={styles.go}>
                    <Text style={styles.goText}>进入</Text>
                    <Image source={Icons.ManagerHomePage.More} style={styles.more} />
                  </View>
                </View>
              </TouchableOpacity> : null
          }
          {
            this.state.roleAuthority === '1' ?
              <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('CommentList')
              }} style={styles.item}>
                <Image source={Icons.ManagerHomePage.Comment} style={styles.itemIcon} />
                <View style={styles.left}>
                  <Text style={styles.title}>评价管理</Text>
                  <View style={styles.go}>
                    <Text style={styles.goText}>进入</Text>
                    <Image source={Icons.ManagerHomePage.More} style={styles.more} />
                  </View>
                </View>
              </TouchableOpacity> : null
          }
          {/*{*/}
          {/*  this.state.roleAuthority === '1' ?*/}
          {/*    <TouchableOpacity onPress={() => {*/}
          {/*      this.props.navigation.navigate('Static')*/}
          {/*    }} style={styles.item}>*/}
          {/*      <Image source={Icons.ManagerHomePage.Statics} style={styles.itemIcon} />*/}
          {/*      <View style={[styles.left, { borderBottomWidth: 0 }]}>*/}
          {/*        <Text style={styles.title}>数据统计</Text>*/}
          {/*        <View style={styles.go}>*/}
          {/*          <Text style={styles.goText}>进入</Text>*/}
          {/*          <Image source={Icons.ManagerHomePage.More} style={styles.more} />*/}
          {/*        </View>*/}
          {/*      </View>*/}
          {/*    </TouchableOpacity> : null*/}
          {/*}*/}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {},
  linearGradient: {
    position: 'absolute',
    zIndex: -1,
    // top: ScreenUtils.scaleSize(33),
    width: '100%',
    height: ScreenUtils.scaleSize(70)
  },
  carousel: {
    marginHorizontal: ScreenUtils.scaleSize(15),
    height: ScreenUtils.scaleSize(137),
    marginBottom: ScreenUtils.scaleSize(15),
  },
  banner: {
    height: ScreenUtils.scaleSize(137),
    width: screenW - ScreenUtils.scaleSize(30),
    borderRadius: ScreenUtils.scaleSize(5),
  },
  dotStyle: {
    height: ScreenUtils.scaleSize(5),
    width: ScreenUtils.scaleSize(5),
    marginBottom: 10
  },
  list: {
    paddingHorizontal: ScreenUtils.scaleSize(15),
    backgroundColor: '#fff',
    marginHorizontal: ScreenUtils.scaleSize(15),
    borderRadius: ScreenUtils.scaleSize(5),
  },
  item: {
    height: ScreenUtils.scaleSize(68),
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    height: ScreenUtils.scaleSize(44),
    width: ScreenUtils.scaleSize(44),
  },
  left: {
    flex: 1,
    borderBottomColor: '#E7EBEF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    marginLeft: ScreenUtils.scaleSize(15),
  },
  title: {
    color: '#030014',
    fontSize: ScreenUtils.scaleSize(14),
  },
  go: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goText: {
    color: '#A8A8AC',
    fontSize: ScreenUtils.scaleSize(13),
  },
  more: {
    height: ScreenUtils.scaleSize(16),
    width: ScreenUtils.scaleSize(16),
    marginLeft: ScreenUtils.scaleSize(6),
  }
})
