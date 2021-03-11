import React, {Component, useState} from 'react'
import {NavigationProp, Route} from '@react-navigation/native'
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList
} from 'react-native'

import Api from '../../../../utils/Api'
import ScreenUtils from '../../../../utils/ScreenUtils'
import LinearGradient from 'react-native-linear-gradient'
import Page from '../../../../components/Page'
import RegistrationItem from './RegistrationItem'
import Icons from '../../../../Icons'
import Tabs from '../../../../components/Tabs'
import {Portal, Provider, Toast} from '@ant-design/react-native'
import {workerInfo} from "../../../../utils/worker";

type Props = {
  navigation: NavigationProp<any>
  route: Route<string, { job: any,isManager: number | null }>
}

type State = {
  info?: any
  tabKey: string
  list: any[]
  counts: number[]
}

const STATUS: any = {
  '姓名': 0,
  '面试': 1,
  '入职': 5,
  '淘汰': 2,
};

@Page()
export default class RegistrationDetailsPage extends Component<Props, State> {

  state: State = {
    info: {},
    tabKey: '姓名',
    list: [],
    counts: [0, 0, 0, 0],
    ReferencesList:[],
  }

  componentDidMount() {
    this.getListAndCountsData()
  }

  getListAndCountsData = async () => {
    const id = this.props.route.params.job.id;
    const key = Toast.loading('loading');

    if (typeof this.props.route.params.isManager === 'undefined') {
      let inviteCode = workerInfo.getInviteCode();
      const listRes: any = await Api.get(`/labor/staff/jobs/apply/${inviteCode}/list/1`, {
        params: {page: 1, size: 1000000, id, status: STATUS[this.state.tabKey]}
      });
      
      
      const countRes: any = await Api.get(`/labor/staff/jobs/apply/invite/count/${inviteCode}`);
      this.setState({
        list: listRes.list || [],
        counts: [countRes?.apply_quantity || 0, countRes?.interview_quantity || 0,
          countRes?.entry_quantity || 0, countRes?.die_out_quantity || 0],
      }, () => Portal.remove(key));
      return
    }

    const listRes: any = await Api.get(`/labor/staff/jobs/${id}/apply/list/1`, {
      params: {page: 1, size: 1000000, id, status: STATUS[this.state.tabKey]}
    });

    console.log( listRes );
    
    const countRes: any = await Api.get(`/labor/staff/jobs/apply/count/${id}`, {params: {id}});
    this.setState({
      list: listRes.list || [],
      counts: [countRes?.apply_quantity || 0, countRes?.interview_quantity || 0,
        countRes?.entry_quantity || 0, countRes?.die_out_quantity || 0],
    }, () => Portal.remove(key));

    const References: any = await Api.get("/gateway/users/list/extras", {
      params:{ keywords:'invite_code',orgCode:'tongtu.labor.boss' }
    });



    this.setState({
      ReferencesList: References
    }, () => Portal.remove(key));

  }

  render() {
    const {job} = this.props.route.params;
    if (!job) return <View></View>
    return (
      <Provider>
        <View style={styles.box}>
          <View style={styles.content}>
            <View style={styles.backColor}/>
            <LinearGradient colors={['rgba(82, 108, 221, 1)', 'rgba(82, 108, 221, 0.5)', 'rgba(82, 108, 221, 0.1)']} style={styles.linearGradient}/>
            <ScrollView style={styles.paddingBox}>
              <View style={styles.positionItemView}>
                <View style={styles.positonInfoView}>
                  <View style={[styles.positonInfoRow, styles.positonInfoRowOne]}>
                    <Text style={styles.positionName}>{job.name}</Text>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => {
                      this.props.navigation.navigate('JobViewQrcode', {job: this.props.route.params.job})
                    }}>
                      <Image
                        source={Icons.Job.QrCodeIcon}
                        style={{
                          height: ScreenUtils.scaleSize(22),
                          width: ScreenUtils.scaleSize(22),
                          marginRight: ScreenUtils.scaleSize(10)
                        }}
                      />
                    </TouchableOpacity>
                    <ImageBackground source={Icons.Public.BgOne} style={styles.priceView}>
                      <Text style={styles.priceViewText}>{job.salary}/小时</Text>
                    </ImageBackground>
                  </View>
                  <View style={[styles.positionRowTwo, styles.positonInfoRow]}>
                    <Text style={styles.rowTwoText}>{job.customer_name || job.customer?.name}</Text>
                  </View>
                  <View style={[styles.positionInfoRowThree, styles.positonInfoRow]}>
                    <Image source={require('../../../../assets/icons/job/location.png')}/>
                    <Text style={styles.rowThreeText}>
                      {job.province && job.city ? `${job.province?.name}-${job.city?.name}` : job.place}
                    </Text>
                    {job.exp_low || job.exp_high ?
                      <React.Fragment>
                        <Image source={require('../../../../assets/icons/job/experience.png')}/>
                        <Text style={styles.rowThreeText}>
                          <Text style={styles.rowThreeText}>{job.exp_low}年{job.exp_high ? `-${job.exp_high}年` : '或以上'}</Text>
                        </Text>
                      </React.Fragment>
                      : null
                    }
                    {job.education ? <><Image source={require('../../../../assets/icons/job/schoolRecord.png')}/>
                      <Text style={styles.rowThreeText}>{job.education?.name}</Text></> : null}
                  </View>
                </View>
              </View>
              <Tabs
                data={Object.keys(STATUS)}
                dataCount={this.state.counts}
                tabStyle={{
                  fontSize: ScreenUtils.scaleSize(12), color: '#C9D3FF'
                }}
                tabBoxStyle={{marginBottom: ScreenUtils.scaleSize(16)}}
                triangleSize={4}
                value={this.state.tabKey}
                onChange={(tabKey: any) => this.setState({tabKey}, () => this.getListAndCountsData())}
              />
              {this.state.list && this.state.list.length > 0
                ? <View style={styles.paddingBox2}>
                  {this.state.list.map(ite => <RegistrationItem
                    ReferencesList={ this.state.ReferencesList }
                    key={ite.id}
                    navigation={this.props.navigation}
                    isManager={typeof this.props.route.params.isManager !== 'undefined'}
                    item={ite}
                    tabKey={this.state.tabKey}
                    refresh={() => {
                      this.componentDidMount()
                    }}
                  />)}
                </View>
                : <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: ScreenUtils.scaleSize(200),
                  backgroundColor: '#fff',
                }}><Text>暂无数据</Text></View>}
            </ScrollView>
          </View>
        </View>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  box: {
    display: 'flex',
    flex: 1,
    position: 'relative',
  },
  content: {
    height: '100%',
  },
  bottomBtns: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: ScreenUtils.scaleSize(59),
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  btn: {
    width: ScreenUtils.scaleSize(152),
    height: ScreenUtils.scaleSize(39),
    lineHeight: ScreenUtils.scaleSize(39),
    backgroundColor: '#526CDD',
    borderRadius: 50,
    textAlign: 'center',
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(15),
    borderTopColor: 'rgb(0, 0, 0)',
  },
  backColor: {
    width: '100%',
    height: ScreenUtils.scaleSize(33),
    backgroundColor: 'rgba(82, 108, 221, 1)',
    position: 'absolute',
  },
  paddingBox: {
    paddingHorizontal: ScreenUtils.scaleSize(15)
  },
  paddingBox2: {
    borderRadius: ScreenUtils.scaleSize(4),
    backgroundColor: '#fff',
  },
  linearGradient: {
    position: 'absolute',
    zIndex: -1,
    top: ScreenUtils.scaleSize(33),
    width: '100%',
    height: ScreenUtils.scaleSize(150)
  },
  positionItemView: {
    minHeight: ScreenUtils.scaleSize(140),
    overflow: 'hidden',
    marginBottom: ScreenUtils.scaleSize(15),
  },
  positonInfoView: {
    width: '100%',
    minHeight: ScreenUtils.scaleSize(134),
    backgroundColor: '#fff',
    borderRadius: ScreenUtils.scaleSize(2),
    paddingHorizontal: ScreenUtils.scaleSize(15),
    position: 'relative',
    paddingBottom: ScreenUtils.scaleSize(15)
  },
  positonInfoRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  positonInfoRowOne: {
    marginTop: ScreenUtils.scaleSize(20)
  },
  positionName: {
    color: 'rgba(3, 0, 20, 1)',
    fontSize: ScreenUtils.scaleSize(15),
    fontWeight: 'bold',
    flex: 1
  },
  priceView: {
    width: ScreenUtils.scaleSize(75),
    height: ScreenUtils.scaleSize(20)
  },
  priceViewText: {
    textAlign: 'center',
    lineHeight: ScreenUtils.scaleSize(20),
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(13),
    fontWeight: '500'
  },
  positionRowTwo: {
    marginTop: ScreenUtils.scaleSize(10),
  },
  rowTwoText: {
    color: 'rgba(84, 84, 104, 1)',
    fontSize: ScreenUtils.scaleSize(13),
    fontWeight: '500'
  },
  rowCircle: {
    marginHorizontal: ScreenUtils.scaleSize(8),
    width: ScreenUtils.scaleSize(4),
    height: ScreenUtils.scaleSize(4),
    backgroundColor: 'rgba(84, 84, 104, 1)',
    borderRadius: ScreenUtils.scaleSize(4)
  },
  positionInfoRowThree: {
    marginTop: ScreenUtils.scaleSize(15),
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%'
  },
  rowThreeText: {
    color: 'rgba(168, 168, 172, 1)',
    fontSize: ScreenUtils.scaleSize(12),
    paddingHorizontal: ScreenUtils.scaleSize(7),
    paddingVertical: ScreenUtils.scaleSize(4),
    backgroundColor: '#fff',
    borderRadius: ScreenUtils.scaleSize(6),
    marginRight: ScreenUtils.scaleSize(5)
  },
  titleHeader: {
    height: ScreenUtils.scaleSize(45),
    borderBottomWidth: ScreenUtils.scaleSize(1),
    borderBottomColor: '#E7EBEF',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: ScreenUtils.scaleSize(12),
    marginBottom: ScreenUtils.scaleSize(15),
  },
  titleHeaderLeftBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleHeaderLeftImg: {
    width: ScreenUtils.scaleSize(22),
    height: ScreenUtils.scaleSize(22),
  },
  titleHeaderLeft: {
    color: '#030014',
    fontWeight: 'bold',
    fontSize: ScreenUtils.scaleSize(14),
  },
  titleHeaderRight: {
    color: '#A8A8AC'
  },
  itemContentText: {
    fontSize: ScreenUtils.scaleSize(15),
    lineHeight: ScreenUtils.scaleSize(30),
    color: '#545468',
  },
  twoContent: {
    display: 'flex',
    flexDirection: 'row',
  },
  contentImage: {
    width: ScreenUtils.scaleSize(115),
    height: ScreenUtils.scaleSize(64),
    backgroundColor: 'orange',
    marginLeft: ScreenUtils.scaleSize(10),
    borderRadius: 5,
  },
  threeBoxContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scanImg: {
    width: ScreenUtils.scaleSize(73),
    height: ScreenUtils.scaleSize(73),
    backgroundColor: 'orange',
  },
})

