import React, { Component } from 'react'
import {
  Image,
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableHighlight
} from 'react-native'
import { BoxShadow } from 'react-native-shadow'
import moment from 'moment'

import Icons from '../../../../Icons'
import ScreenUtils from '../../../../utils/ScreenUtils'
import { calculateAge, getStatusCn } from '../../../../utils/Fn'
import { TouchableOpacity } from 'react-native-gesture-handler'

type Props = {
  onPress?: Function,
  data: any,
  tabKey: string,
}
const SEXARR = ['未知', '男', '女']
export default class StaffManagementItem extends Component<Props> {

  shadowOpt = {
    width: ScreenUtils.scaleSize(316),
    height: ScreenUtils.scaleSize(52),
    color: '#253039',
    border: 4,
    radius: 1,
    opacity: 0.02,
    style: {
      position: 'absolute',
      bottom: ScreenUtils.scaleSize(2),
      height: ScreenUtils.scaleSize(52),
      marginHorizontal: ScreenUtils.scaleSize(15)
    },
    x: 0,
    y: 2
  }

  render() {
    const { data, onPress } = this.props

    const gender = data.gender ? SEXARR[data.gender] : SEXARR[0]

    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <View style={styles.positionItemView}>
          <View style={styles.positonInfoView}>
            <View style={[styles.positonInfoRow, styles.positonInfoRowOne]}>
              <Text style={styles.positionName}>{data.name}</Text>
              <ImageBackground source={Icons.Public.BgOne} style={styles.priceView}>
                <Text style={styles.priceViewText}>{getStatusCn(data.status)}</Text>
              </ImageBackground>
            </View>
            <View style={[styles.positionRowTwo, styles.positonInfoRow]}>
              <Text style={styles.rowTwoText}>{data.customer_name}</Text>
              {
                // 待处理就显示这个
                data.status === 0 && <Text style={styles.rowTwoTimeText}>{data.entry_date ? moment(data.entry_date).format('YYYY-MM-DD') : ''}</Text>
              }
            </View>
            <View style={[styles.positionInfoRowThree, styles.positonInfoRow]}>
              <Text style={styles.rowThreeText}>性别：{gender}</Text>
              <Text style={styles.rowThreeText}>年龄：{calculateAge(data.birth)}岁</Text>
              {<Text style={styles.rowThreeText}>学历：{data.qualifications}</Text>}
            </View>
          </View>
          <View style={{ height: ScreenUtils.scaleSize(26) }}>
            <BoxShadow setting={this.shadowOpt}>
              <View style={styles.otherInfoRow}>
                <Image source={Icons.WorkBench.Tel} style={styles.promulgatorIcon} />
                <Text style={styles.promulgatorText}>手机号</Text>
                <View style={styles.promulgatorBtn}>
                  <Text style={styles.promulgatorBtnText}>{data.phone ?? data.telephone}</Text>
                </View>
              </View>
            </BoxShadow>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  positionItemView: {
    minHeight: ScreenUtils.scaleSize(160),
    overflow: 'hidden',
  },
  positonInfoView: {
    width: '100%',
    minHeight: ScreenUtils.scaleSize(134),
    backgroundColor: 'rgba(243, 245, 247, 1)',
    borderRadius: ScreenUtils.scaleSize(2),
    paddingHorizontal: ScreenUtils.scaleSize(15),
    position: 'relative',
    paddingBottom: ScreenUtils.scaleSize(40)
  },
  positonInfoRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  positonInfoRowOne: {
    marginTop: ScreenUtils.scaleSize(20)
  },
  positionName: {
    color: 'rgba(3, 0, 20, 1)',
    fontSize: ScreenUtils.scaleSize(15),
    fontWeight: 'bold',
    flex: 1
  },
  priceView: {
    width: ScreenUtils.scaleSize(75),
    height: ScreenUtils.scaleSize(20)
  },
  priceViewText: {
    textAlign: 'center',
    lineHeight: ScreenUtils.scaleSize(20),
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(13),
    fontWeight: '500'
  },
  positionRowTwo: {
    marginTop: ScreenUtils.scaleSize(10),
    justifyContent: 'space-between',
  },
  rowTwoText: {
    color: 'rgba(84, 84, 104, 1)',
    fontSize: ScreenUtils.scaleSize(13),
    fontWeight: '500'
  },
  rowTwoTimeText: {
    color: '#A8A8AC',
  },
  rowCircle: {
    marginHorizontal: ScreenUtils.scaleSize(8),
    width: ScreenUtils.scaleSize(4),
    height: ScreenUtils.scaleSize(4),
    backgroundColor: 'rgba(84, 84, 104, 1)',
    borderRadius: ScreenUtils.scaleSize(4)
  },
  positionInfoRowThree: {
    marginTop: ScreenUtils.scaleSize(15),
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%'
  },
  rowThreeText: {
    color: 'rgba(168, 168, 172, 1)',
    fontSize: ScreenUtils.scaleSize(12),
    paddingHorizontal: ScreenUtils.scaleSize(7),
    paddingVertical: ScreenUtils.scaleSize(4),
    backgroundColor: '#fff',
    borderRadius: ScreenUtils.scaleSize(6),
    marginRight: ScreenUtils.scaleSize(5)
  },
  otherInfoRow: {
    width: ScreenUtils.scaleSize(315),
    height: ScreenUtils.scaleSize(52),
    backgroundColor: '#fff',
    borderRadius: ScreenUtils.scaleSize(5),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ScreenUtils.scaleSize(10),
    zIndex: 11,
  },
  promulgatorIcon: {
    width: ScreenUtils.scaleSize(22),
    height: ScreenUtils.scaleSize(22)
  },
  promulgatorText: {
    marginLeft: ScreenUtils.scaleSize(12),
    fontSize: ScreenUtils.scaleSize(13),
    color: 'rgba(84, 84, 104, 1)',
    flex: 1
  },
  promulgatorBtn: {
    height: ScreenUtils.scaleSize(26),
    justifyContent: 'center',
    alignItems: 'center'
  },
  promulgatorBtnText: {
    fontSize: ScreenUtils.scaleSize(14),
    fontWeight: '500'
  },
  triangleRight: {
    marginLeft: ScreenUtils.scaleSize(6),
    width: ScreenUtils.scaleSize(8),
    height: ScreenUtils.scaleSize(9)
  }
})
