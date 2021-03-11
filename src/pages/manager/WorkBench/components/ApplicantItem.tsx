import React from 'react'
import {Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import ScreenUtils from '../../../../utils/ScreenUtils'
import Icons from '../../../../Icons'
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs'

type Props = {
    item: any,
    navigation: BottomTabNavigationProp<any>
}

function ApplicantItem({ item, navigation }: Props) {
  return (
    <TouchableOpacity style={styles.positonInfoView} onPress={() => {
      navigation.navigate('ResumeDetail',{ user:item.employee_id })
    }}>
      <Image style={styles.itemImg} source={require('../../../../assets/icons/workBench/tel.png')} />
      <View style={styles.positionRowTwo}>
        <Text style={styles.rowTwoText}>{item.employee_name}</Text>
        {/* <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: ScreenUtils.scaleSize(5)}}>
          <Text style={{...styles.rowThreeText, paddingLeft: 0}}>{item.customer_name}</Text>
          <Text style={styles.rowThreeText}>经验不限</Text>
          <Text style={{...styles.rowThreeText, borderRightWidth: 0}}>高中</Text>
        </View> */}
      </View>
      <Text style={styles.rowTwoTimeText}>{item.create_time}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  positonInfoView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: ScreenUtils.scaleSize(62),
    backgroundColor: '#fff',
    position: 'relative',
    borderBottomWidth: ScreenUtils.scaleSize(1),
    borderBottomColor: '#E7EBEF',
    // backgroundColor:'#ff0000',
  },
  itemImg: {
    width: ScreenUtils.scaleSize(32),
    height: ScreenUtils.scaleSize(32),
  },
  positionRowTwo:{
    marginLeft: ScreenUtils.scaleSize(10),
    flex:1
  },
  rowTwoText: {
    color: '#2C2D30',
    fontSize: ScreenUtils.scaleSize(14),
    fontWeight: 'bold',
  },
  rowTwoTimeText: {
    color: '#A8A8AC',
    // backgroundColor:'#ff00ff',
    // marginTop: ScreenUtils.scaleSize(-20),
  },
  rowThreeText: {
    color: 'rgba(168, 168, 172, 1)',
    fontSize: ScreenUtils.scaleSize(12),
    borderRightWidth: ScreenUtils.scaleSize(1),
    borderRightColor: '#E3E6EA',
    paddingHorizontal: ScreenUtils.scaleSize(10),
  },
})

export default ApplicantItem
