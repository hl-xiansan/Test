import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Button
} from 'react-native'
import ScreenUtil from '../../../utils/ScreenUtils'
import Page from '../../../components/Page'

type Props = {
  navigation: any;
};

type ItemType = {
  title: string;
  placeholder?: string;
  required?: boolean;
}
const height = Dimensions.get('window').height
const width = Dimensions.get('window').width


const TextItem = (props: ItemType) => {
  const { title = '', placeholder = '', required = false } = props
  return (
    <TouchableWithoutFeedback>
      <View style={styles.textItemView}>
        <View style={styles.flexRowAlignCenter}>
          <Text style={styles.titleStyle}>{title}</Text>
          {required && <Text style={styles.redPoint}>*</Text>}
        </View>
        <View style={styles.placeholderView}>
          <Text style={styles.placeholderStyle}>{placeholder}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

@Page({
  navigation: {
    headerShown: false
  }
})
export default class ConfirmTransferPage extends Component<Props> {

  toNextPage = () => {
    this.props.navigation.navigate('LoanApplyDetail')
  }

  render() {
    return (
      <ScrollView style={styles.background}>
        <TextItem title="日薪（元）" placeholder="请输入日薪" required />
        <TextItem title="记薪日期" placeholder="请输入计薪日期" />
        <TouchableOpacity style={styles.subBtn} onPress={this.toNextPage}>
          <Text style={styles.subText}>确认转厂</Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingTop: ScreenUtil.scaleSize(10)
  },
  textItemView: {
    paddingVertical: ScreenUtil.scaleSize(10),
    paddingHorizontal: ScreenUtil.scaleSize(15),
  },
  titleStyle: {
    fontSize: ScreenUtil.scaleSize(14),
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
    paddingTop: ScreenUtil.scaleSize(15),
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
  flexRowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subBtn: {
    backgroundColor: '#526CDD',
    width: ScreenUtil.scaleSize(300),
    height: ScreenUtil.scaleSize(40),
    marginHorizontal: ScreenUtil.scaleSize(40),
    marginBottom: ScreenUtil.scaleSize(15),
    alignItems: 'center',
    justifyContent: 'center',
    padding: ScreenUtil.scaleSize(12),
    borderRadius: ScreenUtil.scaleSize(20),
    marginTop: ScreenUtil.scaleSize(280),
  },
  subText: {
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(15)
  }
})
