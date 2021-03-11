import React, { useCallback, useMemo, useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { createNativeStackNavigator } from 'react-native-screens/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { enableScreens } from 'react-native-screens'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import TokenNavigatorContext, { ScreenOptions } from '../components/TokenNavigatorContext'
import StaffManagementHeaderRight from '../pages/manager/WorkBench/components/StaffManagementHeaderRight'

import store, { ManagerContext } from '../utils/Store'
import Icons from '../Icons'

import ManagerHomePage from '../pages/manager/HomePage'
import ManagerProfilePage from '../pages/manager/profile/ProfilePage'
import MyProfile from '../pages/manager/profile/MyProfile'
import ManagerSettingPage from '../pages/manager/profile/SettingPage'
import ManagerLoginPage from '../pages/manager/LoginPage'
import StaffManagement from '../pages/manager/WorkBench/StaffManagement/StaffManagement'
import RecruitManagement from '../pages/manager/WorkBench/StaffManagement/RecruitManagement'
import ConfirmBatchProcessPage from '../pages/manager/WorkBench/StaffManagement/ConfirmBatchProcessPage'
import EmployeeScreenPage from '../pages/manager/WorkBench/StaffManagement/EmployeeScreenPage'
import EmployeeScreenPage2 from '../pages/manager/WorkBench/StaffManagement/EmployeeScreenPage2'
import EmployeeInfoPage from '../pages/manager/WorkBench/StaffManagement/EmployeeInfo'
import EmployeeDetailPage from '../pages/manager/WorkBench/StaffManagement/EmployeeDetail'
import ConfirmTheContractPage from '../pages/manager/WorkBench/StaffManagement/ConfirmTheContract'
import ConfirmTheTerminationPage from '../pages/manager/WorkBench/StaffManagement/ConfirmTheTermination'
import ConfirmTheDeparturePage from '../pages/manager/WorkBench/StaffManagement/ConfirmTheDeparture'
import EmployeeEvalualuationResPage from '../pages/manager/WorkBench/StaffManagement/EmployeeEvalualuationRes'
import ScreenUtils from '../utils/ScreenUtils'

import QRScanner from '../components/QRScanner'
import { getFocusedRouteNameFromRoute, useNavigation } from '@react-navigation/native'
import PublishJob from '../pages/manager/WorkBench/Recruit/PublishJob'
import AllPositions from '../pages/manager/WorkBench/Recruit/AllPositions'
import RecruitPositions from '../pages/manager/WorkBench/Recruit/RecruitPositions'
import AllPositionsHeaderRight from '../pages/manager/WorkBench/components/AllPositionsHeaderRight'
import PositionSearch from '../pages/manager/WorkBench/Recruit/PositionSearch'
import PositionSearch2 from '../pages/manager/WorkBench/StaffManagement/search'
import ApplicantList from '../pages/manager/WorkBench/Recruit/ApplicantList'
import JobViewQrcodePage from '../pages/worker/jobs/JobViewQrcodePage'
import WorkerJobsViewPage from '../pages/worker/jobs/JobsViewPage'
import LoanManagement from '../pages/manager/WorkBench/LoanManagement/LoanManagement'
import OneClickProcess from '../pages/manager/WorkBench/LoanManagement/OneClickProcess'
import ModifyLoanAmount from '../pages/manager/WorkBench/LoanManagement/ModifyLoanAmount'
import Static from '../pages/manager/WorkBench/Stastic/Static'
import CommentList from '../pages/manager/WorkBench/Comment/CommentList'
import CommentChoose from '../pages/manager/WorkBench/Comment/CommentChoose'
import CommentAdd from '../pages/manager/WorkBench/Comment/CommentAdd'
import ResumeDetail from '../pages/manager/WorkBench/Recruit/ResumeDetail'
import RegistrationDetail from '../pages/manager/WorkBench/Recruit/RegistrationDetails'

import MessagePage from '../pages/manager/message/MessagePage'
import RepaymentPage from '../pages/manager/message/RepaymentPage'
import RepaymentSearchPage from '../pages/manager/message/RepaymentSearchPage'
import RefuseConfirmPage from '../pages/manager/message/RefuseConfirmPage'
import ConfirmTransferPage from '../pages/manager/message/ConfirmTransferPage'
import LoanApplyDetailPage from '../pages/manager/message/LoanApplyDetailPage'
import LoanApplyDetailPage1 from '../pages/manager/message/LoanApplyDetailPage1'
import LoanApplyDetailPage2 from '../pages/manager/message/LoanApplyDetailPage2'
import ScanCodePage from '../pages/manager/qrCode/ScanCodePage'
import QRListPage from '../pages/manager/qrCode/QRListPage'
import MyPositions from '../pages/manager/WorkBench/Recruit/MyPositions'
import BankCard from '../pages/worker/profile/BankCard'
import { useStore } from 'react-redux'
import ChangePasswordPageMan from "../pages/manager/profile/ChangePasswordPageMan";
import VersionPage from "../pages/manager/profile/VersionPage";
// -----------------------------------------
import InterviewersList from '../pages/manager/WorkBench/Recruit/InterviewersList'
// -----------------------------------------


import UserAgreementPage from "../pages/welcome/UserAgreementPage";


enableScreens()

const tabs = [{
  name: 'News',
  label: '消息',
  title: '消息',
  icon: Icons.Tabs.News,
  actived: Icons.Tabs.NewsActived,
  component: MessagePage,
  showTitle: true
}, {
  name: 'WorkPlace',
  title: '工作台',
  icon: Icons.Tabs.Manager,
  actived: Icons.Tabs.Manager,
  component: ManagerHomePage,
  showTitle: true,
}, {
  name: 'Profile',
  label: '我的',
  title: '我的',
  icon: Icons.Tabs.Profile,
  actived: Icons.Tabs.ProfileActived,
  component: ManagerProfilePage,
  showTitle: true
}]

const recruitTab = [{
  name: 'MyPositions',
  label: '我的职位',
  title: '我的职位',
  icon: Icons.RecruitTabs.MyPosition,
  actived: Icons.RecruitTabs.MyPositionActive,
  component: ManagerProfilePage,
  showTitle: true
}, {
  name: 'PublishPositions',
  title: '发布职位',
  icon: Icons.RecruitTabs.Publish,
  actived: Icons.RecruitTabs.Publish,
  component: PublishJob,
  showTitle: true,
}, {
  name: 'AllPositions',
  label: '所有职位',
  title: '所有职位',
  icon: Icons.RecruitTabs.AllPassive,
  actived: Icons.RecruitTabs.All,
  component: ManagerProfilePage,
  showTitle: true
}]

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()
const RecruitTab = createBottomTabNavigator()

function TabPageHeaderTitle(props: { name?: string, tabList?: any[] }) {
  const item = (props.tabList || tabs).find((item) => item.name === props.name)
  return (
    item?.showTitle || props.name === 'Index' ? <Text style={{
      color: '#fff', fontSize: ScreenUtils.scaleSize(18), fontWeight: 'bold'
    }}>
      {props.name === 'Index' ? '工作台' : item?.title || item?.label}
    </Text> : <></>
  )
}
function TabSearch(props: { name?: string, navigation: any }) {
  return props.name && ['AllPositions', 'MyPositions'].includes(props.name) ? <AllPositionsHeaderRight navigation={props.navigation} /> : <></>
}
function TabBarLabel(props: { name: string, focused: boolean, tabList?: any[] }) {
  return (
    <Text style={{ color: props.focused ? 'rgba(82, 108, 221, 1)' : 'rgba(142, 151, 165, 1)', fontSize: ScreenUtils.scaleSize(11), fontWeight: 'bold' }}>
      {(props.tabList || tabs).find((item) => item.name === props.name)?.label}
    </Text>
  )
}

function PageCenter(props: { name: string }) {
  return (
    <Text style={{
      color: '#fff', fontSize: ScreenUtils.scaleSize(18), fontWeight: 'bold'
    }}>{props.name}</Text>
  )
}

function TabBarIcon(props: { name: string, focused: boolean, tabList?: any[] }) {
  const item = (props.tabList || tabs).find((item) => item.name === props.name)
  if (item.name === 'WorkPlace' || item.name === 'PublishPositions') {
    return <Image style={{ marginTop: 10 }} source={props.focused ? item?.actived : item?.icon} />
  }
  return <Image source={props.focused ? item?.actived : item?.icon}></Image>
}

export default function Router() {
  const navigation = useNavigation()
  const { getState, dispatch } = useStore()
  useMemo(() => store.subscribe(() => {
    navigation.reset({
      index: 0,
      // Welcome
      routes: [{ name: 'Welcome' }]
    })
  }), [])

  const [customerFilter, setCustomerFilter] = useState({} as any)

  const contextValue = {
    customerFilter,
    setCustomerFilter,
  }

  return (
    <TokenNavigatorContext home="WorkPlace" login="Login" isManager={true}>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerStyle: {
            backgroundColor: 'rgba(82, 108, 221, 1)',
          },
          headerHideShadow: true,
          headerLeft: (props: any) => {
            return <TouchableOpacity activeOpacity={0.6} onPress={() => { navigation.pop() }}>
              <Image source={Icons.Public.ReturnIcon} style={{ height: ScreenUtils.scaleSize(22), width: ScreenUtils.scaleSize(22) }} />
            </TouchableOpacity>
          }
        })}
      >
        <Stack.Screen name="Index" options={({ route, navigation }) => ({
          headerStyle: {
            backgroundColor: 'rgba(82, 108, 221, 1)'
          },
          headerTitleStyle: {
            fontSize: ScreenUtils.scaleSize(18),
            color: '#fff',
            fontWeight: 'bold'
          },
          headerCenter: () => {
            return <TabPageHeaderTitle name={getFocusedRouteNameFromRoute(route) || route.name} />},
          headerLeft: () => null,
          headerHideShadow: true,
        })}>
          {() => (
            <Tab.Navigator
              tabBarOptions={{
                activeTintColor: 'rgba(82, 108, 221, 1)',
                inactiveTintColor: 'rgba(142, 151, 165, 1)',
                style: { height: ifIphoneX(75, 50), paddingTop: ScreenUtils.scaleSize(5) }
              }}
              screenOptions={({ route }) => ({
                tabBarLabel: (props: { focused: boolean }) => <TabBarLabel name={route.name} focused={props.focused} />,
                tabBarIcon: (props: { focused: boolean }) => <TabBarIcon name={route.name} focused={props.focused} />
              })}
              initialRouteName="WorkPlace"
            >
              <Tab.Screen name="News" component={MessagePage} />
              <Tab.Screen name="WorkPlace" component={ManagerHomePage} />
              <Tab.Screen name="Profile" component={ManagerProfilePage} />
            </Tab.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen name="Recruit" options={({ route, navigation }) => ({
          headerStyle: {
            backgroundColor: 'rgba(82, 108, 221, 1)'
          },
          headerTitleStyle: {
            fontSize: ScreenUtils.scaleSize(18),
            color: '#fff',
            fontWeight: 'bold'
          },
          headerCenter: () => <TabPageHeaderTitle
            name={getFocusedRouteNameFromRoute(route)}
            tabList={recruitTab}
          />,
          headerRight: () => <TabSearch
            name={getFocusedRouteNameFromRoute(route)}
            navigation={navigation}
          />,
          headerHideShadow: true
        })}>
          {() => (
            <RecruitTab.Navigator
              tabBarOptions={{
                activeTintColor: 'rgba(82, 108, 221, 1)',
                inactiveTintColor: 'rgba(142, 151, 165, 1)',
                style: { height: ifIphoneX(75, 50), paddingTop: ScreenUtils.scaleSize(5) }
              }}
              screenOptions={({ route }) => ({
                tabBarLabel: (props: { focused: boolean }) => <TabBarLabel tabList={recruitTab} name={route.name} focused={props.focused} />,
                tabBarIcon: (props: { focused: boolean }) => <TabBarIcon tabList={recruitTab} name={route.name} focused={props.focused} />,
              })}
            >
              <RecruitTab.Screen name="MyPositions" component={MyPositions} />
              <RecruitTab.Screen name="PublishPositions" options={{
                tabBarVisible: false
              }} component={PublishJob} />
              <RecruitTab.Screen name="AllPositions" component={AllPositions} />
            </RecruitTab.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen {...ScreenOptions('StaffManagement', StaffManagement)} options={{
          // 如果是筛选的话就改成false
          headerCenter: () => !customerFilter?.name ? (<PageCenter name="员工管理" />) : (<View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <PageCenter name={customerFilter?.name} />
            <View style={{
              borderRightColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: 'transparent',
              borderTopColor: '#fff', borderWidth: ScreenUtils.scaleSize(8), marginLeft: ScreenUtils.scaleSize(6),
              marginTop: ScreenUtils.scaleSize(6)
            }} />
          </View>),
          headerRight: () => <StaffManagementHeaderRight navigation={navigation} />,
        }} />
        <Stack.Screen {...ScreenOptions('RecruitManagement', RecruitManagement)} options={{
          // 如果是筛选的话就改成false
          headerCenter: () => !customerFilter?.name ? (<PageCenter name="员工管理" />) : (<View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <PageCenter name={customerFilter?.name} />
            <View style={{
              borderRightColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: 'transparent',
              borderTopColor: '#fff', borderWidth: ScreenUtils.scaleSize(8), marginLeft: ScreenUtils.scaleSize(6),
              marginTop: ScreenUtils.scaleSize(6)
            }} />
          </View>),
          headerRight: () => <StaffManagementHeaderRight navigation={navigation} />,
        }} />

        {/* --------------------------------------- */}
        <Stack.Screen {...ScreenOptions('Interviewer', InterviewersList)} options={{ headerCenter: () => (<PageCenter name="面试结果" />) }} />
        {/* --------------------------------------- */}

        <Stack.Screen {...ScreenOptions('ConfirmBatchProcess', ConfirmBatchProcessPage)} options={{ headerCenter: () => (<PageCenter name="批量处理确认" />) }} />
        <Stack.Screen {...ScreenOptions('EmployeeScreen', EmployeeScreenPage)} options={{ headerCenter: () => (<PageCenter name="筛选" />) }} />
        <Stack.Screen {...ScreenOptions('EmployeeScreen2', EmployeeScreenPage2)} options={{ headerCenter: () => (<PageCenter name="筛选" />) }} />
        <Stack.Screen {...ScreenOptions('EmployeeInfo', EmployeeInfoPage)} options={{ headerCenter: () => (<PageCenter name="员工信息" />) }} />
        <Stack.Screen {...ScreenOptions('EmployeeDetail', EmployeeDetailPage)} options={{ headerCenter: () => (<PageCenter name="员工管理" />) }} />
        <Stack.Screen {...ScreenOptions('ResumeDetail', ResumeDetail)} options={{ headerCenter: () => (<PageCenter name="简历详情" />) }} />
        <Stack.Screen {...ScreenOptions('RegistrationDetail', RegistrationDetail)} options={{ headerCenter: () => (<PageCenter name="报名详情" />) }} />
        <Stack.Screen {...ScreenOptions('ConfirmTheContract', ConfirmTheContractPage)} options={{ headerCenter: () => (<PageCenter name="确认签约" />) }} />
        <Stack.Screen {...ScreenOptions('ConfirmTheTermination', ConfirmTheTerminationPage)} options={{ headerCenter: () => (<PageCenter name="确认解约" />) }} />
        <Stack.Screen {...ScreenOptions('ConfirmTheDeparture', ConfirmTheDeparturePage)} options={{ headerCenter: () => (<PageCenter name="确认离职" />) }} />
        <Stack.Screen {...ScreenOptions('EmployeeEvalualuationRes', EmployeeEvalualuationResPage)} options={{ headerCenter: () => (<PageCenter name="评价结果" />) }} />
        <Stack.Screen {...ScreenOptions('PublishJob', PublishJob)} options={{ headerCenter: () => (<PageCenter name="发布职位" />) }} />
        <Stack.Screen {...ScreenOptions('PositionSearch', PositionSearch)} options={{ headerCenter: () => (<PageCenter name="搜索" />) }} />
        <Stack.Screen {...ScreenOptions('PositionSearch2', PositionSearch2)} options={{ headerCenter: () => (<PageCenter name="搜索" />) }} />
        <Stack.Screen {...ScreenOptions('ApplicantList', ApplicantList)} options={{
          headerCenter: () => (<PageCenter name="应聘者" />),
          headerRight: () => <Image style={{ width: ScreenUtils.scaleSize(22), height: ScreenUtils.scaleSize(22) }} source={require('../assets/icons/job/forward.png')} />
        }} />
        <Stack.Screen {...ScreenOptions('ChangePasswordPageMan', ChangePasswordPageMan)} options={{ headerCenter: () => (<PageCenter name="修改密码" />) }} />
        <Stack.Screen {...ScreenOptions('JobViewQrcode', JobViewQrcodePage)} options={{
          headerCenter: () => (<PageCenter name="职位详情" />),
          headerRight: () => <Image style={{ width: ScreenUtils.scaleSize(22), height: ScreenUtils.scaleSize(22) }} source={require('../assets/icons/job/forward.png')} />
        }} />
        <Stack.Screen {...ScreenOptions('JobView', WorkerJobsViewPage)} options={{
          headerCenter: () => (<PageCenter name="职位详情" />),
          headerRight: () => (<Image style={{
            width: ScreenUtils.scaleSize(22),
            height: ScreenUtils.scaleSize(22)
          }} source={require('../assets/icons/job/forward.png')} />),
        }} />
        <Stack.Screen {...ScreenOptions('MyProfile', MyProfile)} options={{
          headerCenter: () => (<PageCenter name="我的资料" />),
        }} />
        <Stack.Screen {...ScreenOptions('Setting', ManagerSettingPage)} options={{ headerCenter: () => (<PageCenter name="设置" />) }} />
        <Stack.Screen {...ScreenOptions('Login', ManagerLoginPage)} />

        <Stack.Screen {...ScreenOptions('Repayment', RepaymentPage)} options={{ headerCenter: () => (<PageCenter name="还款详情" />) }} />
        <Stack.Screen {...ScreenOptions('RepaymentSearch', RepaymentSearchPage)} options={{ headerCenter: () => (<PageCenter name="还款详情" />) }} />
        <Stack.Screen {...ScreenOptions('RefuseConfirm', RefuseConfirmPage)} options={{ headerCenter: () => (<PageCenter name="确认拒绝" />) }} />
        <Stack.Screen {...ScreenOptions('ConfirmTransfer', ConfirmTransferPage)} options={{ headerCenter: () => (<PageCenter name="确认转厂" />) }} />
        <Stack.Screen {...ScreenOptions('LoanApplyDetail', LoanApplyDetailPage)} options={{ headerCenter: () => (<PageCenter name="借款详情" />) }} />
        <Stack.Screen {...ScreenOptions('LoanApplyDetail1', LoanApplyDetailPage1)} options={{ headerCenter: () => (<PageCenter name="离职申请" />) }} />
        <Stack.Screen {...ScreenOptions('LoanApplyDetail2', LoanApplyDetailPage2)} options={{ headerCenter: () => (<PageCenter name="转厂详情" />) }} />
        <Stack.Screen {...ScreenOptions('ScanCode', ScanCodePage)} options={{ headerCenter: () => (<PageCenter name="我的二维码" />) }} />
        <Stack.Screen {...ScreenOptions('QRList', QRListPage)} options={{ headerCenter: () => (<PageCenter name="二维码" />) }} />

        <Stack.Screen {...ScreenOptions('LoanManagement', LoanManagement)} options={{ headerCenter: () => (<PageCenter name="借款管理" />) }} />
        <Stack.Screen {...ScreenOptions('ModifyLoanAmount', ModifyLoanAmount)} options={{ headerCenter: () => (<PageCenter name="修改金额" />) }} />
        <Stack.Screen {...ScreenOptions('OneClickProcess', OneClickProcess)} options={{ headerCenter: () => (<PageCenter name="一键处理" />) }} />
        <Stack.Screen {...ScreenOptions('Static', Static)} options={{ headerCenter: () => (<PageCenter name="数据统计" />) }} />
        <Stack.Screen {...ScreenOptions('CommentList', CommentList)} options={{ headerCenter: () => (<PageCenter name="评价管理" />) }} />
        <Stack.Screen {...ScreenOptions('CommentChoose', CommentChoose)} options={{ headerCenter: () => (<PageCenter name="选择员工" />) }} />
        <Stack.Screen {...ScreenOptions('CommentAdd', CommentAdd)} options={{ headerCenter: () => (<PageCenter name="添加点评" />) }} />
        <Stack.Screen {...ScreenOptions('CommentEdit', CommentAdd)} options={{ headerCenter: () => (<PageCenter name="修改点评" />) }} />
        <Stack.Screen {...ScreenOptions('BankCard', BankCard)} options={{ headerCenter: () => (<PageCenter name="银行卡" />) }} />
        <Stack.Screen {...ScreenOptions('RecruitPositions', RecruitPositions)} options={{ headerCenter: () => (<PageCenter name="全部职位" />) }} />
        <Stack.Screen {...ScreenOptions('VersionPage', VersionPage)} options={{ headerCenter: () => (<PageCenter name="版本信息" />) }} />

        <Stack.Screen {...ScreenOptions('UserAgreement', UserAgreementPage)} options={{ headerCenter: () => (<PageCenter name="用户协议" />) }} />
      </Stack.Navigator>
    </TokenNavigatorContext>
  )
}
