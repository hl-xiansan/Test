import React, { useCallback } from 'react'
import {StyleSheet, View, ImageBackground, Text, TouchableOpacity} from 'react-native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import Icons from '../../Icons'
import ScreenUtils from '../../utils/ScreenUtils'
import LinearGradient from 'react-native-linear-gradient'


type Props = {
	navigation: BottomTabNavigationProp<any>
}

export default function Welcome({navigation}: Props) {

  const changeToWorker = useCallback(() => {
    navigation.navigate('Worker')
  }, [])

  const changeToManager = useCallback(() => {
    navigation.navigate('Manager')
  }, [])

  return (
    <View style={styles.container}>
      <ImageBackground style={styles.backgroundImg} source={Icons.Welcome.Background}>
        <View style={styles.title}>
          <Text style={styles.titleText}>欢 迎 您</Text>
          <Text style={styles.titleText}>来 到 锦 绣 通 途</Text>
        </View>
        <View>
          <View style={styles.chooseBox}>
            <Text style={styles.chooseText}>请选择身份登录</Text>
            <LinearGradient
              useAngle={true}
              angle={-90}
              colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.1)']}
              style={[styles.linearGradient, styles.linearGradientLeft]}
            />
            <LinearGradient
              useAngle={true}
              angle={90}
              colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.01)']}
              style={[styles.linearGradient, styles.linearGradientRight]}
            />
          </View>
          <TouchableOpacity
            style={[styles.btn, styles.employeeBtn]}
            onPress={changeToWorker}
          >
            <Text style={styles.btnText}>我是员工</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={changeToManager}
            style={[styles.btn, styles.managerBtn]}
          >
            <Text style={styles.managerBtnText}>我是通途管理员</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImg: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between'
  },
  title: {
    marginTop: ScreenUtils.scaleSize(99.5),
    marginLeft: ScreenUtils.scaleSize(30.5),
  },
  titleText: {
    color: '#ffffff',
    fontSize: ScreenUtils.scaleSize(30),
    lineHeight: ScreenUtils.scaleSize(40),
    fontWeight: 'bold'
  },
  chooseBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: ScreenUtils.scaleSize(43),
    paddingHorizontal: ScreenUtils.scaleSize(14),
  },
  chooseText: {
    fontSize: ScreenUtils.scaleSize(15),
    color: '#fff'
  },
  linearGradient: {
    height: 1,
    width: ScreenUtils.scaleSize(103.5),
    position: 'absolute',
    top: ScreenUtils.scaleSize(7),
  },
  linearGradientLeft: {
    left: ScreenUtils.scaleSize(14),
  },
  linearGradientRight: {
    right: ScreenUtils.scaleSize(14),
  },
  btn: {
    height: ScreenUtils.scaleSize(50),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: ScreenUtils.scaleSize(25),
    marginHorizontal: ScreenUtils.scaleSize(30),
  },
  btnText: {
    fontSize: ScreenUtils.scaleSize(15),
    color: '#545468'
  },
  employeeBtn: {
    marginBottom: ScreenUtils.scaleSize(20),
  },
  managerBtn: {
    backgroundColor: '#1d2e8a',
    color: '#fff',
    marginBottom: ScreenUtils.scaleSize(56),
  },
  managerBtnText: {
    fontSize: ScreenUtils.scaleSize(15),
    color: '#fff'
  }
})
