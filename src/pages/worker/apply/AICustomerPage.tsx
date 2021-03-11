import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  Image,
  Button,
} from 'react-native'
import ScreenUtil from '../../../utils/ScreenUtils'
import page from '../../../components/Page'
import Icons from '../../../Icons';

type Props = {
  navigation: any;
};

type Item = {
  title: string;
  width: any;
};

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width


@page()
export default class AICustomerPage extends Component<Props> {

  toNextPage = () => {
    this.props.navigation.navigate('Signature')
  }

  render() {
    return (
      <View style={styles.background}>
        <View style={styles.flexAllCenter}>
          <View style={styles.timeView}>
            <Text style={styles.timeText}>2020年02月15日 20:18</Text>
          </View>
        </View>
        <View style={styles.flexAlignCenter}>
          <Image style={styles.androidImg} source={Icons.Apply.Android} />
          <View style={styles.rectangleIcon}></View>
          <View style={styles.mainCommunitView}>
            <Text style={styles.robotText1}>机器人小途</Text>
            <Text style={styles.robotText2}>您好！我是机器人小途，有什么可以帮助您？</Text>
            <TagView title='工资准时结算' width={ScreenUtil.scaleSize(100)} />
            <TagView title='住宿条件' width={ScreenUtil.scaleSize(72)} />
            <TagView title='交通方便' width={ScreenUtil.scaleSize(72)} />
            <TagView title='吃的好不好' width={ScreenUtil.scaleSize(85)} />
            <View style={styles.communitFooterView}>
              <Text style={styles.communitFooterText1}>回答不满意？</Text>
              <Text style={styles.communitFooterText2}>转人工客服</Text>
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }}></View>
        <View style={styles.footerView}>
          <Image style={styles.footerImg} source={Icons.Apply.VoiceCircle} />
          <View style={styles.commentAreaView}>
            <Text style={styles.commentHeaderText}>请简短描述您的问题</Text>
          </View>
          <Image style={styles.footerImg} source={Icons.Apply.PlusCircle} />
        </View>
        
      </View>
    )
  }
}

const TagView = (props: Item) => {
  const { title = '', width = '' } = props;
  return (
    <View style={[styles.tagView, { width }]}>
      <Text style={styles.tagText}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
    zIndex: 0,
    backgroundColor: '#F3F5F7',
  },
  flexAllCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: ScreenUtil.scaleSize(14),
  },
  timeView: {
    width: ScreenUtil.scaleSize(160),
    height: ScreenUtil.scaleSize(18),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D5DADF',
    borderRadius: ScreenUtil.scaleSize(9),
  },
  timeText: {
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(12),
  },
  flexAlignCenter: {
    flexDirection: 'row',
  },
  androidImg: {
    width: ScreenUtil.scaleSize(35),
    height: ScreenUtil.scaleSize(35),
    marginLeft: ScreenUtil.scaleSize(15),
  },
  rectangleIcon: {
    borderRightColor: '#fff',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderBottomWidth: ScreenUtil.scaleSize(10),
    borderRightWidth: ScreenUtil.scaleSize(10),
    marginLeft: ScreenUtil.scaleSize(10),
    height: ScreenUtil.scaleSize(10),
  },
  mainCommunitView: {
    width: ScreenUtil.scaleSize(240),
    height: ScreenUtil.scaleSize(250),
    backgroundColor: '#fff',
    borderTopRightRadius: ScreenUtil.scaleSize(5),
    borderBottomRightRadius: ScreenUtil.scaleSize(5),
    borderBottomLeftRadius: ScreenUtil.scaleSize(5),
    padding: ScreenUtil.scaleSize(14),
  },
  robotText1: {
    color: "#030014",
    fontSize: ScreenUtil.scaleSize(14),
    fontWeight: 'bold',
  },
  robotText2: {
    color: '#545468',
    fontSize: ScreenUtil.scaleSize(12),
    fontWeight: '500',
    marginTop: ScreenUtil.scaleSize(10),
    marginBottom: ScreenUtil.scaleSize(15),
  },
  tagView: {
    backgroundColor: '#EFF1F8',
    borderColor: '#526CDD',
    borderWidth: 1,
    paddingHorizontal: ScreenUtil.scaleSize(10),
    paddingVertical: ScreenUtil.scaleSize(1),
    borderRadius: ScreenUtil.scaleSize(10),
    maxWidth: ScreenUtil.scaleSize(100),
    marginBottom: ScreenUtil.scaleSize(8)
  },
  tagText: {
    color: '#526CDD',
    fontSize: ScreenUtil.scaleSize(12),
  },
  communitFooterView: {
    paddingTop: ScreenUtil.scaleSize(15),
    borderTopColor: '#E7EBEF',
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  communitFooterText1: {
    color: '#545468',
    fontSize: ScreenUtil.scaleSize(12),
  },
  communitFooterText2: {
    color: '#526CDD',
    fontSize: ScreenUtil.scaleSize(12),
    textDecorationLine: 'underline',
  },
  footerView: {
    flexDirection: 'row',
    alignItems:'center',
    padding: ScreenUtil.scaleSize(14),
    backgroundColor: '#fff',
    height: ScreenUtil.scaleSize(55)
  },
  footerImg: {
    width: ScreenUtil.scaleSize(25),
    height: ScreenUtil.scaleSize(25),
  },
  commentAreaView: {
    flex:1,
    backgroundColor: '#F3F5F7',
    marginHorizontal: ScreenUtil.scaleSize(10),
    paddingVertical: ScreenUtil.scaleSize(10),
    paddingHorizontal: ScreenUtil.scaleSize(15),
  },
  commentHeaderText: {
    color: '#A8A8AC',
    fontSize: ScreenUtil.scaleSize(13),
  },

})
