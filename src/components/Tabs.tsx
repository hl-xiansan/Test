import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native'
import ScreenUtils from '../utils/ScreenUtils'

type Props = {
    data: string[],
    dataCount?: string[] | number[],
    onChange?: Function,
    value?: string,
    tabStyle?: any, // 未选中的tab样式
    activityTabStyle?: any, // 选中的tab样式
    tabBoxStyle?: any,  // tab容器样式
    triangleSize?: number,  // 下方三角形大小
}

export default class Tabs extends Component<Props> {

  render() {
    const {
      data, value = data[0], dataCount, onChange = () => { },
      tabStyle, activityTabStyle, tabBoxStyle = {}, triangleSize = 6,
    } = this.props
    const tabStyles = tabStyle ? tabStyle : styles.tab
    const activityTabStyles = activityTabStyle ? activityTabStyle : styles.activityTab
    return (
      <View
        style={{
          ...styles.tabBox,
          ...tabBoxStyle,
        }}
      >
        {data.map((ite, index) => (
          <TouchableOpacity key={index} onPress={() => onChange(ite)} activeOpacity={0.5}>
            <View style={styles.tabItemBox}>
              <Text
                style={value === ite ? [
                  tabStyles,
                  activityTabStyles
                ] : [
                  tabStyles
                ]}
              >
                {ite}
                {dataCount ? `(${dataCount[index]})` : ''}
              </Text>
              {value === ite ? <View
                  style={{...styles.triangle, borderWidth: ScreenUtils.scaleSize(triangleSize)}}
              /> : <View style={{...styles.noTriangle, borderWidth: ScreenUtils.scaleSize(triangleSize)}} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  tabBox: {
    flexDirection: 'row',
    height: ScreenUtils.scaleSize(47),
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#526CDD',
  },
  tabItemBox: {
    alignItems: 'center',
  },
  activityTab: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tab: {
    color: '#C9D3FF',
    fontSize: ScreenUtils.scaleSize(15),
  },
  triangle: {
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderBottomColor: '#fff',
  },
  noTriangle: {
    borderColor: 'transparent',
  }
})
