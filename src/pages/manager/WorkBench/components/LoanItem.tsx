import React from 'react'
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ScreenUtils from '../../../../utils/ScreenUtils'
import Icons from '../../../../Icons'
import ScreenUtil from '../../../../utils/ScreenUtils'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { getDateString } from '../../../worker/jobs/ResumeInfoPage'
type Props = {
  navigation?: BottomTabNavigationProp<any>,
  onPress?: () => void,
  status?: number
  item?: any
}
const STATUS: any = {
  0: '正常',
  1: '工作',
  2: '黑名单',
  3: '离职',
}

function renderStatus(status: number) {
  switch (status) {
    case 0: return <ImageBackground source={Icons.Apply.RoundRectangle} style={styles.statusTag}>
      <Text style={styles.tagText}>待确认</Text>
    </ImageBackground>

    case 5: return <ImageBackground source={Icons.Apply.RoundRectangle} style={styles.statusTag}>
      <Text style={styles.tagText}>已通过</Text>
    </ImageBackground>
    case 6: return <ImageBackground source={Icons.Apply.OrangeRectangle} style={styles.statusTag}>
      <Text style={styles.tagText}>已拒绝</Text>
    </ImageBackground>
    case 7: return <ImageBackground source={Icons.Apply.OrangeRectangle} style={styles.statusTag}>
      <Text style={styles.tagText}>驳回</Text>
    </ImageBackground>
    case 10: return <ImageBackground source={Icons.Apply.RoundRectangle} style={styles.statusTag}>
      <Text style={styles.tagText}>同意修改</Text>
    </ImageBackground>
    case 15: return <ImageBackground source={Icons.Apply.RoundRectangle} style={styles.statusTag}>
      <Text style={styles.tagText}>待还款</Text>
    </ImageBackground>
    case 16: return <ImageBackground source={Icons.Apply.OrangeRectangle} style={styles.statusTag}>
      <Text style={styles.tagText}>拒绝转账</Text>
    </ImageBackground>


    case 20: return <Text style={styles.returnMoney}>已还款</Text>


  }
}

function LoanItem({ onPress = () => { }, item = null, status = 0 }: Props) {
  const ele = React.useMemo(() => {
    return <React.Fragment>
      <View style={styles.header}>
        <View style={styles.left}>
          <Image source={item.employee_photo ? { uri: 'http://tongtu.juyunfuwu.cn/api/tongtu/storage/' +item.employee_photo } : require('../../../../assets/icons/job/avatar.png')} style={styles.avatar} />
          <View>
            <Text style={styles.name}>{item.employee_name}</Text>
            <Text style={styles.grayText}>{item.customer_name}</Text>
          </View>
        </View>
        {renderStatus(item.status)}
      </View>
      <View style={styles.bottom}>
        <View style={styles.box}>
          <Text style={styles.money}>{item.amount?(item.amount/1000): ''}</Text>
          <Text style={styles.grayText}>借款金额（元）</Text>
        </View>
        <View style={styles.centerBox}>
          <View style={styles.lineLeft}></View>
          <View>
            <Text style={styles.titleText}>{STATUS[item.employee_status]}</Text>
            <Text style={styles.grayText}>员工状态</Text>
          </View>
          <View style={styles.lineRight}></View>
        </View>
        <View style={styles.box}>
          <Text style={styles.titleText}>{getDateString(new Date(item.create_time))}</Text>
          <Text style={styles.grayText}>提交时间</Text>
        </View>
      </View>
    </React.Fragment>
  }, [item])
  if (item.status) return <View style={styles.container}>{ele}</View>
  return <TouchableOpacity onPress={onPress} style={styles.container}>{ele}</TouchableOpacity>
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: ScreenUtils.scaleSize(15),
    padding: ScreenUtils.scaleSize(15),
    borderRadius: ScreenUtils.scaleSize(5),

    elevation: 6,
    shadowColor: 'rgba(37, 48, 57, 0.08)',  //  阴影颜色
    shadowOffset: { width: 0, height: 5 },  // 阴影偏移
    shadowOpacity: 1,  // 阴影不透明度
    shadowRadius: 10,  //  圆角
    // marginTop:20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: ScreenUtils.scaleSize(14),
    alignItems: 'center'
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    height: ScreenUtils.scaleSize(45),
    width: ScreenUtils.scaleSize(45),
    marginRight: ScreenUtils.scaleSize(10)
  },
  name: {
    color: '#030014',
    fontSize: ScreenUtils.scaleSize(16),
    fontWeight: '700',
    marginBottom: ScreenUtils.scaleSize(7)
  },
  grayText: {
    color: '#A8A8AC',
    fontSize: ScreenUtils.scaleSize(13),
  },
  statusTag: {
    width: ScreenUtil.scaleSize(53),
    height: ScreenUtil.scaleSize(19),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(12),
  },
  bottom: {
    height: ScreenUtil.scaleSize(83),
    backgroundColor: '#F3F5F7',
    flexDirection: 'row',
    borderRadius: ScreenUtils.scaleSize(5),
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: ScreenUtils.scaleSize(15),
  },
  box: {
    justifyContent: 'center'
  },
  centerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingHorizontal: ScreenUtil.scaleSize(18),
  },
  lineLeft: {
    height: ScreenUtil.scaleSize(21),
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#D8DEE5',
    marginRight: ScreenUtil.scaleSize(17),
  },
  lineRight: {
    height: ScreenUtil.scaleSize(21),
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#D8DEE5',
    marginLeft: ScreenUtil.scaleSize(17),
  },
  titleText: {
    color: '#030014',
    fontSize: ScreenUtil.scaleSize(13),
    lineHeight: ScreenUtil.scaleSize(25),
    marginBottom: ScreenUtil.scaleSize(4),
  },
  money: {
    color: '#F25959',
    fontSize: ScreenUtil.scaleSize(25),
    lineHeight: ScreenUtil.scaleSize(25),
    marginBottom: ScreenUtil.scaleSize(4),
    overflow: 'visible',
    fontWeight: '700'
  },
  returnMoney: {
    color: '#526CDD',
    fontSize: ScreenUtil.scaleSize(16),
  }
})

export default LoanItem
