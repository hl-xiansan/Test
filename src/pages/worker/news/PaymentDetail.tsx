import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  Switch,
  ScrollView
} from 'react-native'
import ScreenUtils from '../../../utils/ScreenUtils'
import LinearGradient from 'react-native-linear-gradient'
import Page from '../../../components/Page'
import Icons from '../../../Icons'

type Props = {}

type State = {}

@Page()
export default class PaymentDetail extends Component<Props, State> {

    readonly state: State = {}

    render() {
      return (
        <View style={styles.box}>
          <View style={styles.content}>
            <ScrollView style={styles.paddingBox}>
              <View style={styles.titleBox}>
                <View style={styles.titleLeft}>
                  <Switch
                    trackColor={{false: '#ccc', true: '#81b0ff'}}
                    thumbColor={true ? 'blue' : '#ccc'}
                    ios_backgroundColor="#3e3e3e"
                    value={true}
                  />
                  <Text style={styles.titleOne}>借款</Text>
                </View>
                <Text style={styles.titleTime}>借款时间：2019-12-25</Text>
              </View>
              <View style={styles.itemBox}>
                <View style={styles.itemLeftView}>
                  <Text style={styles.title}>借款人：刘涛</Text>
                  <View style={styles.titleLeftBottom}>
                    <Text style={styles.subTitle}>1500</Text>
                    <Text style={styles.unit}>（元）</Text>
                  </View>
                </View>
                <View style={styles.titleRightBtn}>
                  <Text style={styles.titleRightBtnText}>借款记录</Text>
                  <View style={styles.triangle}/>
                </View>
              </View>
              <View style={styles.titleBox}>
                <View style={styles.titleLeft}>
                  <Switch
                    trackColor={{false: '#ccc', true: '#orange'}}
                    thumbColor={true ? 'orange' : '#ccc'}
                    ios_backgroundColor="#3e3e3e"
                    value={false}
                  />
                  <Text style={styles.titleOne}>还款</Text>
                </View>
                <Text style={styles.titleTime}>还款时间：2019-12-25</Text>
              </View>
              <View style={[styles.itemBox, styles.boxExtraStyle]}>
                <View style={styles.itemLeftView}>
                  <Text style={styles.title}>还款人：刘涛</Text>
                  <View style={styles.titleLeftBottom}>
                    <Text style={styles.subTitle}>1500</Text>
                    <Text style={styles.unit}>（元）</Text>
                  </View>
                </View>
                <Text style={{color: '#A8A8AC', fontSize: ScreenUtils.scaleSize(13)}}>全部待还 0.00</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      )
    }
}

const styles = StyleSheet.create({
  box: {
    display: 'flex',
    flex: 1,
    position: 'relative',
    paddingBottom: ScreenUtils.scaleSize(59),
  },
  content: {
    height: '100%',
  },
  paddingBox: {
    paddingHorizontal: ScreenUtils.scaleSize(15)
  },
  itemBox: {
    paddingVertical: ScreenUtils.scaleSize(20),
    paddingHorizontal: ScreenUtils.scaleSize(20),
    overflow: 'hidden',
    marginBottom: ScreenUtils.scaleSize(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: ScreenUtils.scaleSize(2),
  },
  boxExtraStyle: {
    alignItems: 'flex-start',
  },
  itemLeftView: {
    position: 'relative',
  },
  titleLeftBottom: {
    flexDirection: 'row',
    marginTop: ScreenUtils.scaleSize(12),
  },
  title: {
    color: '#545468',
    fontSize: ScreenUtils.scaleSize(13),
    fontWeight: 'bold',
    flex: 1
  },
  subTitle: {
    color: '#030014',
    fontSize: ScreenUtils.scaleSize(24),
    lineHeight: ScreenUtils.scaleSize(30),
    fontWeight: '500'
  },
  unit: {
    color: '#A8A8AC',
    fontSize: ScreenUtils.scaleSize(10),
    lineHeight: ScreenUtils.scaleSize(36),
  },
  titleRightBtn: {
    backgroundColor: '#526CDD',
    width: ScreenUtils.scaleSize(98),
    height: ScreenUtils.scaleSize(26),
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleRightBtnText: {
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(13),
    textAlign: 'center',
    lineHeight: ScreenUtils.scaleSize(26),
  },
  triangle: {
    width: ScreenUtils.scaleSize(10),
    height: ScreenUtils.scaleSize(6),
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#fff',
    borderWidth: ScreenUtils.scaleSize(6),
    marginLeft: ScreenUtils.scaleSize(4),
  },
  titleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: ScreenUtils.scaleSize(60),
  },
  titleLeft: {
    flexDirection: 'row'
  },
  titleOne: {
    color: '#030014',
    fontSize: ScreenUtils.scaleSize(16),
    fontWeight: 'bold'
  },
  titleTime: {
    fontSize: ScreenUtils.scaleSize(13),
    color: '#A8A8AC',
  }
})

