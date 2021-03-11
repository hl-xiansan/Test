import React, {useState} from 'react'
import {Image, Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Modal, Portal, Provider, Toast,Picker, Flex,PickerView } from '@ant-design/react-native';
import Swipeout from 'react-native-swipeout';
import ScreenUtils from '../../../../utils/ScreenUtils'
import Icons from '../../../../Icons'
import {getDateString} from "../../../worker/jobs/ResumeInfoPage";
import {ApplicationStoreDispatchProps} from "../../../../utils/Store";
import Api from "../../../../utils/Api";
import {Route} from "@react-navigation/routers";
import {NavigationProp} from "@react-navigation/native";
import AsyncStorage from "@react-native-community/async-storage";


import ProfileItem from '../../../../components/ProfileItem'
import SelectPickerView from '../components/SelectPickerView'




type Props = {
  item: any,
  navigation: NavigationProp<any>
  tabKey: string
  refresh: Function
  isManager: boolean
}
const SEX: any = {
  0: '未知',
  1: '男',
  2: '女',
};
const defaultAvatar = require('../../../../assets/images/login-bg.png')

function RegistrationItem({item, navigation, tabKey, refresh, isManager,ReferencesList }: Props) {
  


  ReferencesList.forEach( ( v ) =>{
    v.label = v.modifier
    v.value = v.extras.invite_code,
    v.key = v.org_id
  } )
  const seasons = [[...ReferencesList]];
  // seasons = seasons.push( ReferencesList );
  item.person = item.person || {}
  
  {/* ---------------------------------------------------- */}
  const [showSelect, setShowSelect] = useState(false);
  {/* ---------------------------------------------------- */}
  const [isOpenBtns, setIsOpenBtns] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showThrough, setShowThrough] = useState(false);
  const [showWeedOut, setShowWeedOut] = useState(false);
  {/* ---------------------------------------------------- */}
  const footSelect = [
    {text: '取消', onPress: () => setShowSelect(false)},
    {text: '确认', onPress: () => sureReferences()},
  ]
  {/* ---------------------------------------------------- */}
  const BtnsRight = tabKey === '报名' ? [
    {text: '通过', backgroundColor: '#526CDD', onPress: () => setShowThrough(true)},
    {text: '淘汰', backgroundColor: '#E94444', onPress: () => setShowWeedOut(true)}
  ] : []
  const contactFooterButtons = [
    {text: '取消', onPress: () => setShowContact(false)},
    {text: '呼叫', onPress: () => callItem()},
  ]
  const throughFooterButtons = [
    {text: '取消', onPress: () => setShowThrough(false)},
    {text: '确认', onPress: () => throughTheInterview()},
  ]
  const weedOutFooterButtons = [
    {text: '取消', onPress: () => setShowWeedOut(false)},
    {text: '确认', onPress: () => weedOut()},
  ]

  /** 修改推荐人 */
  function sureReferences(){
    let invite_code = "";
    let invite_person = "";
    AsyncStorage.getItem( "selectore" ).then(res=>{
      invite_code = res;
      ReferencesList.forEach( val =>{
        if( val.extras.invite_code == invite_code ){
          invite_person = val.modifier
        }
      } )
      let params = {
        invite_code,
        invite_person,
        id:item.id
      }     
      setShowThrough(false)
      if (!item?.id) return Toast.fail('数据出现问题，请退出从试！');
      const key = Toast.loading('处理中...');
      Api.put(`/staff/jobs/update/invite`, params).then(res => {
        Portal.remove(key);
        setIsOpenBtns(false);
        refresh();
      }).catch(err => {
        Portal.remove(key);
        Toast.fail(err?.message);
      });     
    });
    
    
    // let params = {
    //   invite_code:'1212',
    //   id:'100',
    //   invite_person:'asdasd'
    // }

    // setShowThrough(false)
    // if (!item?.id) return Toast.fail('数据出现问题，请退出从试！');
    // const key = Toast.loading('处理中...');
    // Api.put(`/staff/jobs/update/invite`, params).then(res => {
    //   Portal.remove(key);
    //   setIsOpenBtns(false);
    //   refresh();
    // }).catch(err => {
    //   Portal.remove(key);
    //   Toast.fail(err?.message);
    // });
  }

  function callItem() { // 呼叫
    setShowContact(false);
    let url = `tel:${item?.person?.phone}`;
    Linking.canOpenURL(url).then((supported) => {
      if (!supported) {
        Toast.fail('您的设备不支持拨打电话，请手动复制进行拨打！');
        console.log('can not handle url:', url);
      } else {
        return Linking.openURL(url);
      }
    })
  }

  function throughTheInterview() { // 通过
    setShowThrough(false)
    if (!item?.id) return Toast.fail('数据出现问题，请退出从试！');
    const params = {id: Number(item.id), status: 1};
    const key = Toast.loading('处理中...');
    Api.put(`/labor/staff/jobs/audit/${item.id}`, params).then(res => {
      Portal.remove(key);
      setIsOpenBtns(false);
      refresh();
    }).catch(err => {
      Portal.remove(key);
      Toast.fail(err?.message);
    });
  }

  function weedOut() { // 淘汰
    setShowWeedOut(false)
    if (!item?.id) return Toast.fail('数据出现问题，请退出从试！');
    const params = {id: Number(item.id), status: 2};
    const key = Toast.loading('处理中...');
    Api.put(`/labor/staff/jobs/audit/${item.id}`, params).then(res => {
      Portal.remove(key);
      setIsOpenBtns(false);
      refresh();
    }).catch(err => {
      Portal.remove(key);
      Toast.fail(err?.message);
    });
  }


  var valueSelect = ["9155"];
  function onChangeSelect( val:string ){
    console.log(1);
  }
  
  return (
    <Swipeout
      right={isManager ? BtnsRight : []}
      openRight={isOpenBtns}
      autoClose={true}
      onClose={() => setIsOpenBtns(false)}
    >
      <View style={styles.positonInfoView}>
        <Image style={styles.itemImg} source={item?.person?.photo ? {uri: item?.person?.photo} : defaultAvatar}/>
        <View style={styles.positionRowTwo}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.rowTwoText}>{item?.person?.name}</Text>
            <Text style={{marginLeft: ScreenUtils.scaleSize(12)}}>{item?.person?.phone}</Text>
            {item?.person?.phone && <TouchableOpacity onPress={() => setShowContact(true)}>
              <Image style={styles.smallItemImg} source={require('../../../../assets/icons/workBench/tel.png')}/>
            </TouchableOpacity>}
          </View>
          <View style={{flexDirection: 'row', marginTop: ScreenUtils.scaleSize(5)}}>
            <Text style={{
              ...styles.rowThreeText
            }}>{SEX[item?.person?.gender || 0]}</Text>
            <Text style={
              styles.rowThreeText
            }>{getDateString(new Date(item.person.birth))}</Text>
            <Text style={{
              ...styles.rowThreeText
            }}>{item?.person?.education?.value}</Text>
            {/* ---------------------------------------------------- */}
            <TouchableOpacity onPress={() => setShowSelect(true)}>
              <Text style={ styles.rowThreeText } >推荐人：{item.invite_person}</Text>
            </TouchableOpacity>
            { item.status === 2 ? <View style={{ marginLeft:40,backgroundColor:'#D9001B',display:'flex',justifyContent:'center',width:40,alignItems:'center' }}>
              <Text style={{ color:'#fff'  }}>黑名单</Text>
            </View>:<></> }
            {/* ---------------------------------------------------- */}
          </View>
        </View>
        <View>
          <Text style={styles.rowTwoTimeText}>{getDateString(new Date(item.create_time))}</Text>
          {tabKey === '报名' ? (<TouchableOpacity onPress={() => setIsOpenBtns(true)}>
            <Text style={{
              color: '#526CDD', fontSize: ScreenUtils.scaleSize(12), textAlign: 'right'
            }}>
              操作
            </Text>
          </TouchableOpacity>) : <Text></Text>}
        </View>
      </View>

      
      {/* ---------------------------------------------------- */}
      <Modal
        visible={showSelect}
        transparent
        footer={footSelect}
        style={styles.dialogContent}>
        <Text style={styles.select}>当前{item?.person?.name}的推荐人是{ item.invite_person },如果推荐人不正确,你可已在此修改推荐人</Text>
        <SelectPickerView ReferencesList={ ReferencesList }  />
      </Modal>
      {/* ---------------------------------------------------- */}
      
      <Modal
        visible={showContact}
        transparent
        footer={contactFooterButtons}
        style={styles.dialogContent}>
        <Text style={styles.contactText}>{item?.person?.phone}</Text>
      </Modal>
      <Modal
        visible={showThrough}
        transparent
        footer={throughFooterButtons}
        style={styles.dialogContent}>
        <Text style={styles.contactText}>确认{item?.person?.name}面试通过？</Text>
      </Modal>
      <Modal
        visible={showWeedOut}
        transparent
        footer={weedOutFooterButtons}
        style={styles.dialogContent}>
        <Text style={styles.contactText}>确认淘汰{item?.person?.name}？</Text>
      </Modal>
    </Swipeout>
  )
}

const styles = StyleSheet.create({
  positonInfoView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: ScreenUtils.scaleSize(62),
    backgroundColor: '#fff',
    position: 'relative',
    borderBottomWidth: ScreenUtils.scaleSize(1),
    borderBottomColor: '#E7EBEF',
    paddingHorizontal: ScreenUtils.scaleSize(15),
    // backgroundColor:'#ff0000',
  },
  itemImg: {
    width: ScreenUtils.scaleSize(32),
    height: ScreenUtils.scaleSize(32),
    borderRadius: ScreenUtils.scaleSize(32),
  },
  smallItemImg: {
    width: ScreenUtils.scaleSize(16),
    height: ScreenUtils.scaleSize(16),
    marginLeft: ScreenUtils.scaleSize(8),
  },
  positionRowTwo: {
    marginLeft: ScreenUtils.scaleSize(10),
    flex: 1
  },
  rowTwoText: {
    color: '#2C2D30',
    fontSize: ScreenUtils.scaleSize(14),
    fontWeight: 'bold',
  },
  rowTwoTimeText: {
    color: '#A8A8AC',
    // backgroundColor:'#ff00ff',
    // marginTop: ScreenUtils.scaleSize(-20),
  },
  rowThreeText: {
    color: 'rgba(168, 168, 172, 1)',
    fontSize: ScreenUtils.scaleSize(12),
    paddingRight: ScreenUtils.scaleSize(14),
  },
  dialogContent: {
    borderRadius: ScreenUtils.scaleSize(12),
  },
  contactText: {
    color: 'rgba(23, 29, 53, 1)',
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: ScreenUtils.scaleSize(4),
    textAlign: 'center',
  },
  select:{
    color: 'rgba(23, 29, 53, 1)',
    fontSize: 18,
    fontWeight: 'bold',
  }
})

export default RegistrationItem
