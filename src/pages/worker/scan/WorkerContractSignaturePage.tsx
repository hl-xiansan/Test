import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Button
} from 'react-native'
import ScreenUtil from '../../../utils/ScreenUtils'
import page from '../../../components/Page'
import Api from "../../../utils/Api";

type Props = {
  navigation: any;
  route: any;
};
type ItemType = {
  title: string;
  placeholder?: string;
  required: boolean;
  right?: boolean | null;
  onPress?: any;
  children?: any;
}
const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

const SignaturePad = require('@yz1311/react-native-signature-pad').default
const TextItem = (props: ItemType) => {
  const { title = '', placeholder = '', required = false, right = false } = props
  return (
    <View style={styles.textItemView}>
      <View style={styles.flexRowAlignCenter}>
        <Text style={styles.titleStyle}>{title}</Text>
        {required && <Text style={styles.redPoint}>*</Text>}
      </View>
      {props.children || (
        <View style={styles.placeholderView}>
          <Text style={styles.placeholderStyle}>{placeholder}</Text>
          {right && <Image style={styles.icon} source={require('../../../../src/assets/icons/public/more.png')} />}
        </View>
      )}
    </View>
  )
}

@page({
  navigation: {
    headerShown: false
  }
})
export default class SignaturePage extends Component<Props> {
  signaturePad: any = null
  render() {
    return (
      <ScrollView style={styles.background}>
        <TextItem title="请手写签字" required>
          <View style={styles.signatureView}>
            <SignaturePad ref={(ref: any) => this.signaturePad = ref} style={{ height: 100, flex: 1, backgroundColor: '#F3F5F7' }}></SignaturePad>
          </View>
        </TextItem>
        <View style={styles.footerView}>
          <TouchableOpacity style={styles.subBtn} onPress={() => { this.signaturePad.clear() }}>
            <Text style={styles.subText1}>重 签</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.subBtn1} onPress={async () => {
            const res = await this.signaturePad.getDataURL()
            const name = 'sign.png'
            const imgRes: any = await Api.RNUpload('/storage/employee/', res.replace('data:image/png;base64,', ''), name)
            this.props.route.params.getImage(imgRes.data.filename)
            this.props.navigation.goBack()
          }}>
            <Text style={styles.subText}>确 认</Text>
          </TouchableOpacity>
        </View>
      </ScrollView >
    )
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
    zIndex: 0,
    backgroundColor: '#fff',
    paddingTop: ScreenUtil.scaleSize(20)
  },
  textItemView: {
    paddingVertical: ScreenUtil.scaleSize(10),
    paddingHorizontal: ScreenUtil.scaleSize(15),
  },
  titleStyle: {
    fontSize: ScreenUtil.scaleSize(13),
    fontWeight: 'bold',
  },
  redPoint: {
    color: '#FF5B53',
    fontSize: ScreenUtil.scaleSize(16),
    marginLeft: 5
  },
  placeholderView: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    paddingTop: ScreenUtil.scaleSize(20),
    paddingBottom: ScreenUtil.scaleSize(10),
    borderBottomWidth: 1,
    borderBottomColor: '#E3E6EA',
  },
  placeholderStyle: {
    color: '#A8A8AC',
    fontSize: ScreenUtil.scaleSize(12),
  },
  icon: {
    width: ScreenUtil.scaleSize(14),
    height: ScreenUtil.scaleSize(14),
  },
  signatureView: {
    backgroundColor: '#F3F5F7',
    marginTop: ScreenUtil.scaleSize(15),
    height: ScreenUtil.scaleSize(250),
    borderRadius: ScreenUtil.scaleSize(5),
  },
  signText: {
    fontSize: ScreenUtil.scaleSize(22),
    color: '#E8EBED',
    fontWeight: 'bold'
  },
  flexRowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerView: {
    marginTop: ScreenUtil.scaleSize(120),
    marginHorizontal: ScreenUtil.scaleSize(17),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subBtn: {
    flex: 1,
    backgroundColor: '#DBE2FF',
    width: ScreenUtil.scaleSize(154),
    height: ScreenUtil.scaleSize(40),
    alignItems: 'center',
    justifyContent: 'center',
    padding: ScreenUtil.scaleSize(12),
    borderRadius: ScreenUtil.scaleSize(20),
    marginRight: ScreenUtil.scaleSize(19),
  },
  subBtn1: {
    flex: 1,
    backgroundColor: '#526CDD',
    width: ScreenUtil.scaleSize(154),
    height: ScreenUtil.scaleSize(40),
    alignItems: 'center',
    justifyContent: 'center',
    padding: ScreenUtil.scaleSize(12),
    borderRadius: ScreenUtil.scaleSize(20),
  },
  subText: {
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(15)
  },
  subText1: {
    color: '#526CDD',
    fontSize: ScreenUtil.scaleSize(15)
  },
})
