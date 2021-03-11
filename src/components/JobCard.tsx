import React from 'react'
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ImageBackground,
  TouchableHighlight
} from 'react-native'
import { BoxShadow, BoxShadowSettingOptions } from 'react-native-shadow'
import { Job } from '../@types'

import Icons from '../Icons'
import ScreenUtils from '../utils/ScreenUtils'

type Props = {
  data: Job
  onPress?: Function
  onBtnPress?: Function
}


export default function JobCard(props: Props) {
  const shadowOpt: BoxShadowSettingOptions = {
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

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => props.onPress && props.onPress()}>
      <View style={styles.positionItemView}>
        <View style={styles.positonInfoView}>
          <View style={[styles.positonInfoRow, styles.positonInfoRowOne]}>
            <Text style={styles.positionName}>{props.data?.name}</Text>
            <ImageBackground source={Icons.Public.BgOne} style={styles.priceView}>
              <Text style={styles.priceViewText}>{props.data?.salary}/小时</Text>
            </ImageBackground>
          </View>
          <View style={[styles.positionRowTwo, styles.positonInfoRow]}>
            <Text style={styles.rowTwoText}>{props.data?.customer_name || props.data.customer?.name}</Text>
          </View>
          <View style={[styles.positionInfoRowThree, styles.positonInfoRow]}>
            <Text style={styles.rowThreeText}>
              {props.data.province && props.data.city ? `${props.data.province?.name}-${props.data.city?.name}` : props.data.place}
            </Text>
            {props.data?.exp_low || props.data?.exp_high ? <Text style={styles.rowThreeText}>{props.data?.exp_low}年{props.data?.exp_high ? `-${props.data?.exp_high}年` : '或以上'}</Text> : null}
            {props.data.education ? <Text style={styles.rowThreeText}>{props.data?.education?.name}</Text> : null}
            <Text style={[styles.rowThreeText, { marginRight: ScreenUtils.scaleSize(0) }]}>招聘{props.data?.recruit_count}人</Text>
          </View>
        </View>
        <View style={{ height: ScreenUtils.scaleSize(26) }}>
          <BoxShadow setting={shadowOpt}>
            <View style={styles.otherInfoRow}>
              <Image source={Icons.Public.Promulgator} style={styles.promulgatorIcon} />
              <Text style={styles.promulgatorText}>发布者-{props.data?.creator}</Text>
              <TouchableOpacity style={styles.promulgatorBtn} onPress={() => { if (props.onBtnPress) props.onBtnPress() }}>
                <Text style={styles.promulgatorBtnText}>去应聘</Text>
                <Image source={Icons.Public.TriangleRight} style={styles.triangleRight} />
              </TouchableOpacity>
            </View>
          </BoxShadow>
        </View>
      </View>
    </TouchableOpacity>
  )
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
  },
  rowTwoText: {
    color: 'rgba(84, 84, 104, 1)',
    fontSize: ScreenUtils.scaleSize(13),
    fontWeight: '500'
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
    width: ScreenUtils.scaleSize(78),
    height: ScreenUtils.scaleSize(26),
    backgroundColor: 'rgba(82, 108, 221, 1)',
    borderRadius: ScreenUtils.scaleSize(13),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  promulgatorBtnText: {
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(13),
    fontWeight: '500'
  },
  triangleRight: {
    marginLeft: ScreenUtils.scaleSize(6),
    width: ScreenUtils.scaleSize(8),
    height: ScreenUtils.scaleSize(9)
  }
})
