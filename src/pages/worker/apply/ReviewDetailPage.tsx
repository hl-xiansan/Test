import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  Image,
  ImageBackground,
  Button,
} from 'react-native'
import ScreenUtil from '../../../utils/ScreenUtils'
import page from '../../../components/Page'
import Icons from '../../../Icons'
import { ScoreItem } from './ReviewsPage'

type Props = {
  navigation: any;
  route: any;
};

type ItemType = {
  title: string;
}
const height = Dimensions.get('window').height
const width = Dimensions.get('window').width


@page()
export default class ReviewDetailPage extends Component<Props> {



  render() {
    console.log(this.props.router)
    const { server, attitude, ability, result, content } = this.props.route?.params?.item
    return (
      <View style={styles.background}>
        <View style={styles.applyView}>
          <View style={styles.headerTextView}>
            <Text style={styles.headerText}>本评价为保密性评价，仅供管理人员查看</Text>
          </View>
          <View style={styles.commentContentView}>
            <View style={styles.commentHeaderView}>
              <Image source={Icons.Apply.Comment} style={styles.commentImg} />
              <Text style={styles.commentHeaderText}>评价</Text>
              <View style={{ flex: 1 }}></View>
              <ImageBackground source={Icons.Apply.GreenRectangle} style={styles.statusTag}>
                <Text style={styles.tagText}>{result}</Text>
              </ImageBackground>
            </View>
            <ScoreItem title="服务" star={server} />
            <ScoreItem title="态度" star={attitude} />
            <ScoreItem title="能力" star={ability} />
          </View>

          <View style={styles.commentContentView}>
            <View style={styles.commentHeaderView}>
              <Image style={styles.commentImg} source={Icons.Apply.Edit} />
              <Text style={styles.commentHeaderText}>评价内容</Text>
            </View>
            <View style={styles.commentView}>
              <Text>{content}</Text>
            </View>
          </View>
        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
    zIndex: 0,
  },
  applyView: {
    flex: 1,
  },
  headerTextView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: ScreenUtil.scaleSize(12),
    backgroundColor: '#fff',
  },
  headerText: {
    color: '#545468',
    fontSize: ScreenUtil.scaleSize(12)
  },
  commentImg: {
    width: ScreenUtil.scaleSize(21),
    height: ScreenUtil.scaleSize(21),
    marginRight: ScreenUtil.scaleSize(6),
  },
  rectangleIcon: {
    borderRightColor: 'transparent',
    borderTopColor: '#526CDD',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderWidth: ScreenUtil.scaleSize(6),
    marginTop: ScreenUtil.scaleSize(7),
    marginLeft: ScreenUtil.scaleSize(10),
  },
  commentContentView: {
    backgroundColor: '#fff',
    marginHorizontal: ScreenUtil.scaleSize(15),
    borderRadius: ScreenUtil.scaleSize(5),
    marginTop: ScreenUtil.scaleSize(15),
    paddingBottom: ScreenUtil.scaleSize(15),
  },
  commentHeaderView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: ScreenUtil.scaleSize(15),
    paddingVertical: ScreenUtil.scaleSize(15),
    borderBottomColor: '#E7EBEF',
    borderBottomWidth: 1,
    marginBottom: ScreenUtil.scaleSize(20),
  },
  commentHeaderText: {
    color: '#030014',
    fontSize: ScreenUtil.scaleSize(14),
  },
  commentHeaderText2: {
    color: '#526CDD',
    fontSize: ScreenUtil.scaleSize(12),
  },
  scoreItemView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: ScreenUtil.scaleSize(15),
    marginBottom: ScreenUtil.scaleSize(20)
  },
  starImg: {
    width: ScreenUtil.scaleSize(19),
    height: ScreenUtil.scaleSize(19),
    marginLeft: ScreenUtil.scaleSize(15),
  },
  commentView: {
    marginHorizontal: ScreenUtil.scaleSize(15),
    paddingBottom: ScreenUtil.scaleSize(100)
  },
  commentHeaderText3: {
    color: '#A8A8AC',
    fontSize: ScreenUtil.scaleSize(12),
  },
  commentAreaView: {
    backgroundColor: '#F3F5F7',
    marginHorizontal: ScreenUtil.scaleSize(15),
    padding: ScreenUtil.scaleSize(15),
    height: ScreenUtil.scaleSize(130)
  },
  subBtn: {
    backgroundColor: '#526CDD',
    width: ScreenUtil.scaleSize(300),
    height: ScreenUtil.scaleSize(40),
    marginHorizontal: ScreenUtil.scaleSize(40),
    marginTop: ScreenUtil.scaleSize(20),
    marginBottom: ScreenUtil.scaleSize(15),
    alignItems: 'center',
    justifyContent: 'center',
    padding: ScreenUtil.scaleSize(12),
    borderRadius: ScreenUtil.scaleSize(20),
  },
  subText: {
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(15)
  },
  statusTag: {
    width: ScreenUtil.scaleSize(53),
    height: ScreenUtil.scaleSize(19),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(12),
  },
})
