import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  ImageBackground,
  Image,
  ScrollView,
  Button,
} from 'react-native'
import WebView from 'react-native-webview'
import ScreenUtil from '../../../utils/ScreenUtils'
import page from '../../../components/Page'
import Icons from '../../../Icons'
import { Portal, Provider, Toast } from '@ant-design/react-native'
import Api from '../../../utils/Api'
import { formatDate } from '../leave/Leave'

type Props = {
  navigation: any;
  route: any
};

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width


@page()
export default class NewsDetailPage extends Component<Props> {
  state: any = {
    title: '',
    content: '',
    time: ''
  }
  async componentDidMount() {
    const key = Toast.loading('loading')
    try {
      const id = this.props.route.params.id
      const res:any = await Api.get(`/gateway/news/${id}`, { params: { id } })
      if(res){
        const { title, content, create_time } = res
        this.setState({ title, content, time:formatDate(new Date(create_time)) })
      }
      Portal.remove(key)
    } catch (error) {
      Portal.remove(key)
      Toast.fail(error.message)
    }
  }
  render() {
    return (
      <Provider>
        <ScrollView style={{ backgroundColor: '#fff' }}>
          <View style={styles.background}>
            <View style={styles.applyView}>
              <View style={styles.headerTextView}>
                <Text style={styles.headerText}>{this.state.title}</Text>
                <View style={styles.flexRowAlignCenter}>
                  <Image style={styles.clockImg} source={Icons.Apply.Clock} />
                  <Text style={styles.placeText}>{this.state.time}</Text>
                </View>
              </View>
              {/*<View style={styles.commentView}><Text>{this.state.content}</Text></View>*/}
              <WebView originWhitelist={['*']} source={{html: this.state.content}} scalesPageToFit={false}
                style={styles.commentView} bounces={false} scrollEnabled={true} automaticallyAdjustContentInsets={true}/>
            </View>
          </View>
        </ScrollView>
      </Provider>
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
    justifyContent: 'center',
    padding: ScreenUtil.scaleSize(12),
    borderBottomColor: '#F3F5F7',
    borderBottomWidth: ScreenUtil.scaleSize(10),
  },
  headerText: {
    color: '#000000',
    fontSize: ScreenUtil.scaleSize(15),
    fontWeight: 'bold'
  },
  commentView: {
    padding: ScreenUtil.scaleSize(15),
    paddingBottom: ScreenUtil.scaleSize(50),
    flex:1
  },
  commentImg: {
    marginVertical: ScreenUtil.scaleSize(20),
    width: ScreenUtil.scaleSize(340),
    borderRadius: ScreenUtil.scaleSize(5),
  },
  flexRowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: ScreenUtil.scaleSize(5),
  },
  clockImg: {
    width: ScreenUtil.scaleSize(13),
    height: ScreenUtil.scaleSize(13),
    marginRight: ScreenUtil.scaleSize(5),
    marginTop: ScreenUtil.scaleSize(1)
  },
  placeText: {
    color: '#A8A8AC',
    fontSize: ScreenUtil.scaleSize(12)
  }
})
