import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity} from 'react-native'
import Icons from '../Icons'
import ScreenUtils from '../utils/ScreenUtils'

type Props = {
  onPress: ()=>void
}

export default class QRScanner extends Component<Props> {

  // 获取头部导航栏的扫码图标
  render () {
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={() => this.props.onPress()}>
        <Image source={Icons.Public.Scan} style={styles.scanQRImg}/>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  scanQRImg: {
    width: ScreenUtils.scaleSize(22),
    height: ScreenUtils.scaleSize(22),
  }
})