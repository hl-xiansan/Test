import React from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  ImageBackground,
  TouchableOpacity
} from 'react-native'
import moment from 'moment'
import ScreenUtil from '../../../../utils/ScreenUtils'
import Icons from '../../../../Icons'
import { AssessList_Staff } from '../../../../@types/assess'
import { ASSESS_STATUS_ICON_MAP, ASSESS_STATUS_MAP } from '../consts'

type ItemType = {
  data: AssessList_Staff;
  onPress?: any;
}

type Props = {
  navigation: any;
  assessList: any;
}

const formatDate = 'YYYY-MM-DD HH:mm:ss'

export const AssessRecords = (props: Props) => {
  const { navigation, assessList } = props
  const toNextPage = () => {
    navigation && navigation.navigate('ReviewDetail')
  }
  return (
    <ScrollView>
      <View style={styles.content}>
        {
          assessList && assessList.length > 0 && assessList.map((ite: AssessList_Staff, i: number) => {
            return (
              <TextItem key={i} data={ite} onPress={toNextPage} />
            )
          })
        }
        {
          assessList.length === 0 &&
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>暂无数据</Text>
          </View>
        }
      </View>
    </ScrollView>
  )
}

export const TextItem = (props: ItemType) => {
  const { data, onPress } = props
  const { staff_name, customer_name, create_time, result } = data
  return (
    <TouchableOpacity style={styles.textItemView} onPress={() => onPress && onPress(data)}>
      <Image style={styles.avatarImg} source={Icons.Apply.BlueMoney} />
      <View style={{ flex: 1 }}>
        <View style={styles.flexRowAlignCenter}>
          <Text style={styles.nameText}>驻场人员{staff_name}</Text>
          <ImageBackground source={ASSESS_STATUS_ICON_MAP[result]} style={styles.priceView}>
            <Text style={styles.priceViewText}>{ASSESS_STATUS_MAP[result]}</Text>
          </ImageBackground>
        </View>
        <View style={styles.flexRowAlignCenter}>
          <Text style={styles.placeText}>{customer_name}</Text>
          <Text style={styles.placeText}>{moment(create_time).format(formatDate)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    display: 'flex',
    position: 'relative',
    padding: ScreenUtil.scaleSize(15),
  },
  textItemView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: ScreenUtil.scaleSize(15),
    borderRadius: ScreenUtil.scaleSize(5),
    marginBottom: ScreenUtil.scaleSize(12),
  },
  avatarImg: {
    width: ScreenUtil.scaleSize(42),
    height: ScreenUtil.scaleSize(42),
    marginRight: ScreenUtil.scaleSize(15),
  },
  nameText: {
    color: '#030014',
    fontWeight: 'bold',
    fontSize: ScreenUtil.scaleSize(14),
    marginBottom: ScreenUtil.scaleSize(10)
  },
  placeText: {
    color: '#545468',
    fontWeight: '500',
    fontSize: ScreenUtil.scaleSize(12),
  },
  commBtn: {
    backgroundColor: '#526CDD',
    borderRadius: ScreenUtil.scaleSize(15),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: ScreenUtil.scaleSize(80),
    height: ScreenUtil.scaleSize(30),
  },
  commText: {
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(12),
    fontWeight: '500',
    marginRight: ScreenUtil.scaleSize(5)
  },
  rightTriangle: {
    width: ScreenUtil.scaleSize(8),
    height: ScreenUtil.scaleSize(8),
  },
  priceView: {
    width: ScreenUtil.scaleSize(55),
    height: ScreenUtil.scaleSize(20),
    marginBottom: ScreenUtil.scaleSize(10)
  },
  priceViewText: {
    textAlign: 'center',
    lineHeight: ScreenUtil.scaleSize(20),
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(13),
    fontWeight: '500'
  },
  flexRowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }
})
