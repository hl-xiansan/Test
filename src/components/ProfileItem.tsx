import React from 'react'
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native'
import ScreenUtils from '../utils/ScreenUtils'
import Icons from '../Icons'

interface IProps {
    label: React.ReactNode | null,
    value: React.ReactNode | null,
    readOnly?: boolean,
    onPress?: ()=>void
}

function ProfileItem({label, value, readOnly = false, onPress = () => {}}: IProps) {
  return (
    <TouchableOpacity tvParallaxProperties={{enabled: !readOnly}} onPress={onPress} activeOpacity={0.5}>
      <View style={styles.profileItem}>
        <View style={styles.wrapper}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.right}>
            {
              typeof value === 'string' ? <Text style={styles.value}>{value}</Text> : <View>{value}</View>
            }
            <Image source={Icons.Public.More} style={styles.itemMoreIcon}/></View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  profileItem: {
    backgroundColor: '#fff',
    flex: 1,
  },
  label: {
    color: '#030014',
    fontSize: ScreenUtils.scaleSize(15),
  },
  value: {
    color: '#A8A8AC',
    fontSize: ScreenUtils.scaleSize(15),
  },
  wrapper: {
    marginHorizontal: ScreenUtils.scaleSize(15),
    borderBottomWidth: ScreenUtils.scaleSize(1),
    borderBottomColor: '#F3F5F7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    paddingVertical: ScreenUtils.scaleSize(10),
    minHeight: ScreenUtils.scaleSize(58)
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemMoreIcon: {
    width: ScreenUtils.scaleSize(12),
    height: ScreenUtils.scaleSize(20),
    marginLeft: ScreenUtils.scaleSize(10),
  },
})

export default ProfileItem
