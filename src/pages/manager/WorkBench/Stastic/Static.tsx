import React, {useEffect} from 'react'
import {ScrollView, StyleSheet, View, Text} from 'react-native'
import ScreenUtils from '../../../../utils/ScreenUtils'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import StaticTodoList from '../components/StaticTodoList'
import Api from '../../../../utils/Api'

function Static() {
  function fetchData() {
    return Api
      .get('/labor/staff/count')
      .then((res) => {
        // if(Array.isArray(res)) setDataSource(res);
      })
      .catch((e) => console.log(e))
  }

  useEffect(() => {
    fetchData()
  }, [])
  return (
    <ScrollView style={styles.container}>
      <View style={styles.bgView} />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={[styles.headerTopLeft, styles.headerTopItem]}>
            <Text style={styles.headerTopText}>当前员工数</Text>
          </View>
          <View style={[styles.headerTopRight, styles.headerTopItem]}>
            <Text style={styles.headerTopText}>本月人员变动数</Text>
          </View>
        </View>
        <View style={styles.headerBottom}>
          <View style={styles.headerItem}>
            <Text style={styles.headerItemNum}>80</Text>
            <Text style={styles.headerItemText}>A厂</Text>
          </View>
          <View style={styles.headerItem}>
            <Text style={styles.headerItemNum}>80</Text>
            <Text style={styles.headerItemText}>B厂</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.headerItem}>
            <Text style={styles.headerItemNum}>3</Text>
            <Text style={styles.headerItemText}>转岗</Text>
          </View>
          <View style={styles.headerItem}>
            <Text style={styles.headerItemNum}>10</Text>
            <Text style={styles.headerItemText}>离职</Text>
          </View>
          <View style={styles.headerItem}>
            <Text style={styles.headerItemNum}>40</Text>
            <Text style={styles.headerItemText}>在职</Text>
          </View>
        </View>

      </View>
      <View style={styles.center}>
        <View style={styles.centerItem}>
          <View style={styles.centerItemHeader}>
            <Text style={styles.centerItemHeaderText}>入职率</Text>
          </View>
          <View style={styles.centerItemBottom}>
            <AnimatedCircularProgress
              size={ScreenUtils.scaleSize(72)}
              width={ScreenUtils.scaleSize(8)}
              fill={70}
              tintColor="#ffffff"
              backgroundColor="#8a9be8">
              {
                (fill) => (
                  <Text style={styles.centerItemBottomText}>
                                        86%
                  </Text>
                )
              }
            </AnimatedCircularProgress>
          </View>
        </View>
        <View style={styles.centerItem}>
          <View style={[styles.centerItemHeader, styles.orangeHeader]}>
            <Text style={styles.centerItemHeaderText}>离职率</Text>
          </View>
          <View style={[styles.centerItemBottom, styles.orangeBody]}>
            <AnimatedCircularProgress
              size={ScreenUtils.scaleSize(72)}
              width={ScreenUtils.scaleSize(8)}
              fill={70}
              tintColor="#ffffff"
              backgroundColor="#FFB670">
              {
                (fill) => (
                  <Text style={styles.centerItemBottomText}>
                                        86%
                  </Text>
                )
              }
            </AnimatedCircularProgress>
          </View>
        </View>
        <View style={styles.centerItem}>
          <View style={[styles.centerItemHeader, styles.blueHeader]}>
            <Text style={styles.centerItemHeaderText}>借款比例</Text>
          </View>
          <View style={[styles.centerItemBottom, styles.blue]}>
            <AnimatedCircularProgress
              size={ScreenUtils.scaleSize(72)}
              width={ScreenUtils.scaleSize(8)}
              fill={70}
              tintColor="#ffffff"
              backgroundColor="#78C3FDFF">
              {
                (fill) => (
                  <Text style={styles.centerItemBottomText}>
                                        86%
                  </Text>
                )
              }
            </AnimatedCircularProgress>
          </View>
        </View>
      </View>
      <StaticTodoList />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F5F7'
  },
  bgView: {
    height: ScreenUtils.scaleSize(100),
    backgroundColor: 'rgba(82, 108, 221, 1)',
  },
  header: {
    paddingHorizontal: ScreenUtils.scaleSize(10),
    paddingVertical: ScreenUtils.scaleSize(13),
    backgroundColor: '#fff',
    borderRadius: ScreenUtils.scaleSize(5),
    marginHorizontal: ScreenUtils.scaleSize(15),

    marginTop: ScreenUtils.scaleSize(-73),

    elevation: 6,
    shadowColor: 'rgba(37, 48, 57, 0.08)',  //  阴影颜色
    shadowOffset: { width: 0, height: 5 },  // 阴影偏移
    shadowOpacity: 1,  // 阴影不透明度
    shadowRadius: 10,  //  圆角
  },
  headerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerItem: {
    alignItems: 'center',
    flex: 1
  },
  divider: {
    width: 0,
    borderRightColor: '#BFC6CC',
    borderRightWidth: ScreenUtils.scaleSize(1),
    height: ScreenUtils.scaleSize(40),
  },
  headerItemNum: {
    color: '#030014',
    fontSize: ScreenUtils.scaleSize(18),
    marginBottom: ScreenUtils.scaleSize(10)
  },
  headerItemText: {
    color: '#545468',
    fontSize: ScreenUtils.scaleSize(12)
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ScreenUtils.scaleSize(15)
  },
  headerTopItem: {
    height: ScreenUtils.scaleSize(34),
    borderRadius: ScreenUtils.scaleSize(3),
    backgroundColor: '#F3F5F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTopText: {
    color: '#A8A8AC',
    fontSize: ScreenUtils.scaleSize(13)
  },
  headerTopLeft: {
    flex: 2,
    marginRight: ScreenUtils.scaleSize(4)
  },
  headerTopRight: {
    flex: 3,
    marginLeft: ScreenUtils.scaleSize(4)
  },
  center: {
    zIndex: -1,
    marginTop: ScreenUtils.scaleSize(-50),
    paddingTop: ScreenUtils.scaleSize(75),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: ScreenUtils.scaleSize(15),
    backgroundColor: '#fff',
    paddingBottom: ScreenUtils.scaleSize(25),
  },
  centerItem: {
    width: '31%',
    borderRadius: 5,
    overflow: 'hidden'
  },
  centerItemHeader: {
    backgroundColor: '#617BEC',
    height: ScreenUtils.scaleSize(36),
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerItemHeaderText: {
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(15),
    borderRadius: ScreenUtils.scaleSize(15),
  },
  centerItemBottom: {
    backgroundColor: '#526CDDFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: ScreenUtils.scaleSize(17),
  },
  centerItemBottomText: {
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(17),
  },
  orangeHeader: {
    backgroundColor: '#FFB670FF'
  },
  orangeBody: {
    backgroundColor: '#F89F49FF'
  },
  blueHeader: {
    backgroundColor: '#78C3FDFF',
  },
  blue: {
    backgroundColor: '#6AB7F3FF'
  }
})

export default Static
