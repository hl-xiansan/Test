import React from 'react'
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native'
import Icons from '../../../../Icons'
import ScreenUtils from '../../../../utils/ScreenUtils'

export default function AllPositionsHeaderRight(props: { name?: string, navigation: any }) {
  return (
    <View style={styles.headerRightBox}>
      <TouchableOpacity activeOpacity={0.5} onPress={() => {
        props.navigation.navigate('EmployeeScreen')
      }}>
        <Image source={Icons.Public.Screen} style={styles.scanQRImg}/>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.5} onPress={() => {
        props.navigation.navigate('PositionSearch')
      }}>
        <Image source={Icons.Public.Search2} style={styles.scanQRImg}/>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  headerRightBox: {
    flexDirection: 'row',
  },
  scanQRImg: {
    width: ScreenUtils.scaleSize(22),
    height: ScreenUtils.scaleSize(22),
    marginLeft: ScreenUtils.scaleSize(16),
  }
})

