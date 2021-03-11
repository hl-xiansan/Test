import React from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  ImageBackground,
  Image,
  ScrollView,
  Dimensions
} from 'react-native'
import moment from 'moment'
import { BoxShadow } from 'react-native-shadow'
import ScreenUtils from '../../../../utils/ScreenUtils'
import Icons from '../../../../Icons'
import { LoanList_Staff } from '../../../../@types/loan'
import { LOAN_STATUS_ICON_MAP, LOAN_STATUS_MAP } from '../consts'

type Item = {
  data: LoanList_Staff
  onPress?: any
}
type Props = {
  navigation: any;
  loanList: any;
}
const height = Dimensions.get('window').height

const formatDate = 'YYYY-MM-DD HH:mm:ss'

export const LoanViewRecordPage = (props: Props) => {
  const { navigation, loanList } = props
  const toPage = (props: LoanList_Staff) => {
    // const { status } = props;
    navigation && navigation.navigate('LoanDetail')
  }
  return (
    <ScrollView>
      <View style={styles.box}>
        <View style={{ backgroundColor: '#fff', paddingTop: ScreenUtils.scaleSize(15) }}>
          {
            loanList && loanList.length > 0 && loanList.map((ite: LoanList_Staff, i: number) => {
              return (
                <View key={i} style={styles.positionItem}>
                  <ListItem data={ite} onPress={toPage} />
                </View>
              )
            })
          }
          {loanList.length === 0 && <View style={{ alignItems: 'center', justifyContent: 'center' }}> <Text>暂无数据</Text></View>}
        </View>
      </View>
    </ScrollView>
  )
}


const shadowOpt = {
  width: ScreenUtils.scaleSize(316),
  height: ScreenUtils.scaleSize(52),
  color: '#253039',
  border: 10,
  radius: 10,
  opacity: 0.05,
  style: {
    position: 'absolute',
    bottom: ScreenUtils.scaleSize(2),
    height: ScreenUtils.scaleSize(52),
    marginHorizontal: ScreenUtils.scaleSize(15)
  },
  x: 0,
  y: 10
}
export const ListItem = (props: Item) => {
  const { data, onPress } = props
  const { status, amount, customer_name, create_time } = data
  return (
    <TouchableWithoutFeedback onPress={() => onPress && onPress(data)}>
      <View style={styles.positionItemView}>
        <View style={styles.positonInfoView}>
          <View style={[styles.positonInfoRow, styles.positonInfoRowOne]}>
            <Text style={styles.positionName}>借款申请</Text>
            <ImageBackground source={LOAN_STATUS_ICON_MAP[status]} style={styles.priceView}>
              <Text style={styles.priceViewText}>{LOAN_STATUS_MAP[status]}</Text>
            </ImageBackground>
          </View>
          <View style={[styles.positionRowTwo, styles.positonInfoRow]}>
            <Text style={styles.rowTwoText}>所属单位：{customer_name}</Text>
          </View>
        </View>
        <View style={{ height: ScreenUtils.scaleSize(12) }}>
          <BoxShadow setting={shadowOpt}>
            <View style={styles.otherInfoRow}>
              <Image source={Icons.Apply.BlueMoney} style={styles.promulgatorIcon} />
              <Text style={styles.promulgatorText}>申请金额-{amount/1000}</Text>
              <View style={styles.promulgatorBtn}>
                <Image style={styles.clockImg} source={Icons.Apply.Clock} />
                <Text style={styles.promulgatorBtnText}>{moment(create_time).format(formatDate)}</Text>
              </View>
            </View>
          </BoxShadow>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    minHeight: height,
    display: 'flex',
    position: 'relative',
    backgroundColor: '#fff',
  },
  searchView: {
    paddingHorizontal: ScreenUtils.scaleSize(15),
    backgroundColor: 'rgba(82, 108, 221, 1)',
    paddingBottom: ScreenUtils.scaleSize(15)
  },
  positionItem: {
    marginBottom: ScreenUtils.scaleSize(15),
    backgroundColor: '#fff',
    paddingHorizontal: ScreenUtils.scaleSize(15)
  },

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
    width: ScreenUtils.scaleSize(55),
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
    height: ScreenUtils.scaleSize(60),
    backgroundColor: '#fff',
    borderRadius: ScreenUtils.scaleSize(5),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ScreenUtils.scaleSize(10),
    zIndex: 11,
  },
  promulgatorIcon: {
    width: ScreenUtils.scaleSize(25),
    height: ScreenUtils.scaleSize(25)
  },
  promulgatorText: {
    marginLeft: ScreenUtils.scaleSize(12),
    fontSize: ScreenUtils.scaleSize(13),
    color: 'rgba(84, 84, 104, 1)',
    flex: 1
  },
  promulgatorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ScreenUtils.scaleSize(26),
    justifyContent: 'center',
  },
  promulgatorBtnText: {
    fontSize: ScreenUtils.scaleSize(14),
    fontWeight: '500'
  },
  triangleRight: {
    marginLeft: ScreenUtils.scaleSize(6),
    width: ScreenUtils.scaleSize(8),
    height: ScreenUtils.scaleSize(9)
  },
  clockImg: {
    width: ScreenUtils.scaleSize(20),
    height: ScreenUtils.scaleSize(20),
    marginRight: ScreenUtils.scaleSize(5),
    marginTop: ScreenUtils.scaleSize(1)
  }
})
