import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import React, { Component } from 'react'
import {
  StatusBar,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Text,
  ImageBackground,
  ScrollView, TextInput
} from 'react-native'
import Icons from '../../../Icons'
import ScreenUtils from '../../../utils/ScreenUtils'
import SearchView from '../../../components/SearchPage'
import LinearGradient from 'react-native-linear-gradient'
import Page from '../../../components/Page'
import {BoxShadow} from 'react-native-shadow'

type Props = {
    navigation: BottomTabNavigationProp<any>
}

@Page()
export default class NewsView extends Component<Props> {

  render() {
    return (
      <View style={styles.content}>
        <LinearGradient colors={['rgba(82, 108, 221, 1)', 'rgba(82, 108, 221, 0.5)', 'rgba(82, 108, 221, 0.1)']} style={styles.linearGradient} />
        <View>
          <View style={styles.backColor} />
          <View style={styles.progress}>
            <View style={styles.progressItemBox}>
              <Text style={{ ...styles.baseStatus, ...styles.applying }}>1</Text>
              <Text style={{ ...styles.baseStatusText, ...styles.applyingText }}>刘涛-发起申请</Text>
              <Text style={{ ...styles.baseStatusText, ...styles.applyingText }}>2020-10-12 12:23</Text>
            </View>
            <View style={styles.line} />
            <View style={styles.progressItemBox}>
              <Text style={{ ...styles.baseStatus, ...styles.agreed }}>2</Text>
              <Text style={{ ...styles.baseStatusText, ...styles.agreedText }}>龙凤飞-已同意</Text>
              <Text style={{ ...styles.baseStatusText, ...styles.agreedText }}>2020-10-13 12:23</Text>
            </View>
          </View>
        </View>
        <View style={styles.titleBox}>
          <View style={styles.leftBox}>
            <Text style={styles.leftTitle}>刘涛提交的借款申请</Text>
            <Text style={styles.leftSubTitle}>深圳富士康</Text>
          </View>
          <ImageBackground source={Icons.Public.BgOne} style={styles.priceView}>
            <Text style={styles.priceViewText}>已通过</Text>
          </ImageBackground>
        </View>
        <ScrollView style={{ backgroundColor: 'rgba(220, 223, 226, 0.3)', zIndex: -2, position: 'relative' }}>
          <View style={styles.contentBox}>
            <View style={styles.boxContent}>
              <View style={styles.item}>
                <Text style={styles.itemLable}>审批编号</Text>
                <Text>202011031025000307932</Text>
              </View>
            </View>
            <View style={styles.boxContent}>
              <View style={styles.item}>
                <Text style={styles.itemLable}>申请人</Text>
                <Text>刘涛</Text>
              </View>
            </View>
            <View style={styles.boxContent}>
              <View style={styles.item}>
                <Text style={styles.itemLable}>所在单位</Text>
                <Text>深圳富士康</Text>
              </View>
            </View>
            <View style={styles.boxContent}>
              <View style={styles.item}>
                <Text style={styles.itemLable}>银行卡号</Text>
                <Text>12145124412054540</Text>
              </View>
            </View>
            <View style={styles.boxContent}>
              <View style={styles.item}>
                <Text style={styles.itemLable}>申请金额（元）</Text>
                <Text>500</Text>
              </View>
            </View>
            <View style={styles.boxContent}>
              <View style={styles.item}>
                <Text style={styles.itemLable}>事由</Text>
                <Text>购买生活用品</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'rgba(252, 253, 253, 1)',
    flex: 1,
    position: 'relative',
  },
  paddingBox: {
    paddingHorizontal: ScreenUtils.scaleSize(15)
  },
  backColor: {
    width: '100%',
    height: ScreenUtils.scaleSize(35),
    backgroundColor: 'rgba(82, 108, 221, 1)',
  },
  linearGradient: {
    position: 'absolute',
    zIndex: -1,
    top: ScreenUtils.scaleSize(35),
    width: '100%',
    height: ScreenUtils.scaleSize(150)
  },
  progress: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingLeft: ScreenUtils.scaleSize(20),
    paddingRight: ScreenUtils.scaleSize(20),
  },
  progressItemBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: ScreenUtils.scaleSize(-35),
  },
  line: {
    backgroundColor: '#95A8FD',
    width: ScreenUtils.scaleSize(71),
    height: ScreenUtils.scaleSize(2),
    marginTop: ScreenUtils.scaleSize(-20),
  },
  baseStatus: {
    width: ScreenUtils.scaleSize(32),
    height: ScreenUtils.scaleSize(32),
    lineHeight: ScreenUtils.scaleSize(32),
    borderRadius: 50,
    textAlign: 'center',
    color: '#526CDD',
    fontSize: ScreenUtils.scaleSize(16),
    fontWeight: 'bold',
  },
  applying: {
    backgroundColor: '#95A8FD',
  },
  agreed: {
    backgroundColor: '#fff',
    borderWidth: ScreenUtils.scaleSize(3),
    width: ScreenUtils.scaleSize(36),
    height: ScreenUtils.scaleSize(36),
    lineHeight: ScreenUtils.scaleSize(36),
    borderColor: '#95A8FD',
  },
  baseStatusText: {
    fontSize: ScreenUtils.scaleSize(12),
    lineHeight: ScreenUtils.scaleSize(24),
  },
  applyingText: {
    color: '#C9D3FF'
  },
  agreedText: {
    color: '#fff'
  },
  titleBox: {
    backgroundColor: '#fff',
    borderRadius: ScreenUtils.scaleSize(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: ScreenUtils.scaleSize(15),
    marginLeft: ScreenUtils.scaleSize(15),
    marginRight: ScreenUtils.scaleSize(15),
  },
  priceView: {
    width: ScreenUtils.scaleSize(65),
    height: ScreenUtils.scaleSize(20)
  },
  priceViewText: {
    textAlign: 'center',
    lineHeight: ScreenUtils.scaleSize(20),
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(13),
    fontWeight: '500'
  },
  leftBox: {

  },
  leftTitle: {
    fontWeight: 'bold',
    fontSize: ScreenUtils.scaleSize(15),
    lineHeight: ScreenUtils.scaleSize(30),
    color: '#030014',
  },
  leftSubTitle: {
    fontSize: ScreenUtils.scaleSize(12),
    lineHeight: ScreenUtils.scaleSize(30),
    color: '#545468',
  },
  contentBox: {
    marginTop: ScreenUtils.scaleSize(-4),
    padding: ScreenUtils.scaleSize(15),
  },
  boxContent: {
    backgroundColor: '#fff',
    paddingHorizontal: ScreenUtils.scaleSize(15),
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: ScreenUtils.scaleSize(55),
    borderBottomWidth: ScreenUtils.scaleSize(1),
    borderColor: '#ccc'
  },
  itemLable: {
    fontSize: ScreenUtils.scaleSize(14),
    color: '#545468',
  },
})

