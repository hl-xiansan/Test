import React, { useMemo } from 'react'
import { Image, Text, TouchableOpacity } from 'react-native'
import { getFocusedRouteNameFromRoute, NavigationProp, useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from 'react-native-screens/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { enableScreens } from 'react-native-screens'
import ScreenUtils from '../utils/ScreenUtils'

import TokenNavigatorContext, { ScreenOptions } from '../components/TokenNavigatorContext'

import store from '../utils/Store'
import Icons from '../Icons'

import WorkerHomePage from '../pages/worker/HomePage'
import WorkerProfilePage from '../pages/worker/profile/ProfilePage'
import WorkerLoginPage from '../pages/worker/LoginPage'
import WorkerJobsPage from '../pages/worker/jobs/JobsPage'
import WorkerJobsViewPage from '../pages/worker/jobs/JobsViewPage'
import JobViewQrcodePage from '../pages/worker/jobs/JobViewQrcodePage'
import ResumeInfoPage from '../pages/worker/jobs/ResumeInfoPage'
import WorkerNewsPage from '../pages/worker/news/NewsPage'
import NewsViewPage from '../pages/worker/news/NewsView'
import PaymentViewPage from '../pages/worker/news/PaymentDetail'
import WorkerScanPage from '../pages/worker/scan/ScanPage'
import WorkerContractFormPage from '../pages/worker/scan/WorkerContractFormPage'


import WorkerSearchPositionPage from '../pages/worker/jobs/JobsSearchPage'
import QRScanner from '../components/QRScanner'
import WorkerSettingPage from '../pages/worker/profile/SettingPage'

import SignaturePage from '../pages/worker/scan/WorkerContractSignaturePage'
import TransferApplyPage from '../pages/worker/apply/TransferApplyPage'
import ApplyDetailPage from '../pages/worker/apply/ApplyDetailPage'
import LoanPage from '../pages/worker/apply/LoanPage'
import LoanDetailPage from '../pages/worker/apply/LoanDetailPage'
import LoanDetailPage1 from '../pages/worker/apply/LoanDetailPage1'
import AssessPage from '../pages/worker/apply/AssessPage'
import ReviewsPage from '../pages/worker/apply/ReviewsPage'
import ReviewDetailPage from '../pages/worker/apply/ReviewDetailPage'
import NewsDetailPage from '../pages/worker/apply/NewsDetailPage'
import AICustomerPage from '../pages/worker/apply/AICustomerPage'

import BankCard from '../pages/worker/profile/BankCard'
import MyProfile from '../pages/worker/profile/MyProfile'
import ChangeUserInfoPage from '../pages/worker/profile/ChangeUserInfoPage'
import ChangePhonePage from '../pages/worker/profile/ChangePhonePage'
import ChangePasswordPage from '../pages/worker/profile/ChangePasswordPage'
import VersionPage from '../pages/worker/profile/VersionPage'
import Leave from '../pages/worker/leave/Leave'
import LeaveDetail from '../pages/worker/leave/LeaveDetail'

import UserAgreementPage from '../pages/welcome/UserAgreementPage'

enableScreens()

const tabs = [{
  name: 'Home',
  label: '首页',
  title: '锦绣通途',
  icon: Icons.Tabs.Home,
  actived: Icons.Tabs.HomeActived,
  component: WorkerHomePage,
  showTitle: false,
}, {
  name: 'Jobs',
  label: '职位',
  icon: Icons.Tabs.Jobs,
  actived: Icons.Tabs.JobsActived,
  component: WorkerJobsPage,
  showTitle: true
}, {
  name: 'News',
  label: '消息',
  icon: Icons.Tabs.News,
  actived: Icons.Tabs.NewsActived,
  component: WorkerNewsPage,
  showTitle: true
}, {
  name: 'Profile',
  label: '我的',
  icon: Icons.Tabs.Profile,
  actived: Icons.Tabs.ProfileActived,
  component: WorkerProfilePage,
  showTitle: true
}]
const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function TabPageHeaderTitle(props: { name?: string }) {
  const item = tabs.find((item) => item.name === props.name)
  return (
    item?.showTitle ? <Text style={{ color: '#fff', fontSize: ScreenUtils.scaleSize(18), fontWeight: 'bold' }}>
      {item?.title || item?.label}
    </Text> : <></>
  )
}

function TabPageHeaderLeft(props: { name?: string }) {
  return !props.name || props.name === 'Home'
    ? <Text style={{ color: '#fff', fontSize: ScreenUtils.scaleSize(18), fontWeight: 'bold', }}>锦绣通途</Text>
    : <Text></Text>
}

function TabBarLabel(props: { name: string, focused: boolean }) {
  return (
    <Text style={{ color: props.focused ? 'rgba(82, 108, 221, 1)' : 'rgba(142, 151, 165, 1)', fontSize: ScreenUtils.scaleSize(11), fontWeight: 'bold' }}>
      {tabs.find((item) => item.name === props.name)?.label}
    </Text>
  )
}

function TabBarIcon(props: { name: string, focused: boolean }) {
  const item = tabs.find((item) => item.name === props.name)
  return <Image source={props.focused ? item?.actived : item?.icon}></Image>
}

function TabPageQRScanner(props: { name?: string, navigation: NavigationProp<any> }) {
  return props.name && ['Home', 'Profile'].includes(props.name) ? <QRScanner onPress={() => {
    props.navigation.navigate('Scan')
  }} /> : <></>
}

function PageCenter(props: { name: string }) {
  return (
    <Text style={{
      color: '#fff', fontSize: ScreenUtils.scaleSize(18), fontWeight: 'bold'
    }}>{props.name}</Text>
  )
}

export default function Router() {
  const navigation = useNavigation()

  useMemo(() => store.subscribe(() => {
    navigation.reset({
      index: 0,
      // Welcome
      routes: [{ name: 'Welcome' }]
    })
  }), [])

  return (
    <TokenNavigatorContext home="Home" login="Login" isManager={false}>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerStyle: {
            backgroundColor: 'rgba(82, 108, 221, 1)'
          },
          headerHideShadow: true,
          headerLeft: () =>
            <TouchableOpacity activeOpacity={0.6} onPress={() => { navigation.pop() }}>
              <Image source={Icons.Public.ReturnIcon} style={{
                height: ScreenUtils.scaleSize(22), width: ScreenUtils.scaleSize(22)
              }} />
            </TouchableOpacity>
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
          headerCenter: () => <TabPageHeaderTitle name={getFocusedRouteNameFromRoute(route)} />,
          headerRight: () => <TabPageQRScanner name={getFocusedRouteNameFromRoute(route)} navigation={navigation} />,
          headerLeft: () => <TabPageHeaderLeft name={getFocusedRouteNameFromRoute(route)} />,
          headerHideShadow: true
        })}>
          {() => (
            <Tab.Navigator
              tabBarOptions={{
                activeTintColor: 'rgba(82, 108, 221, 1)',
                inactiveTintColor: 'rgba(142, 151, 165, 1)'
              }}

              screenOptions={({ route }) => ({
                tabBarLabel: (props: { focused: boolean }) => <TabBarLabel name={route.name} focused={props.focused} />,
                tabBarIcon: (props: { focused: boolean }) => <TabBarIcon name={route.name} focused={props.focused} />
              })}
            >
              <Tab.Screen name="Home" component={WorkerHomePage} />
              <Tab.Screen name="Jobs" component={WorkerJobsPage} />
              <Tab.Screen name="News" component={WorkerNewsPage} />
              <Tab.Screen name="Profile" component={WorkerProfilePage} />
            </Tab.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen {...ScreenOptions('JobView', WorkerJobsViewPage)} options={{
          headerCenter: () => (<PageCenter name="职位详情" />),
          headerRight: () => (<Image style={{
            width: ScreenUtils.scaleSize(22),
            height: ScreenUtils.scaleSize(22)
          }} source={require('../assets/icons/job/forward.png')} />),
        }} />
        <Stack.Screen {...ScreenOptions('JobViewQrcode', JobViewQrcodePage)} options={{
          headerCenter: () => (<PageCenter name="职位详情" />),
          headerRight: () => (<Image style={{
            width: ScreenUtils.scaleSize(22),
            height: ScreenUtils.scaleSize(22)
          }} source={require('../assets/icons/job/forward.png')} />),
        }} />
        <Stack.Screen {...ScreenOptions('ResumeInfo', ResumeInfoPage)} options={{headerCenter: () => (<PageCenter name="简历信息" />) }} />
        <Stack.Screen {...ScreenOptions('NewsView', NewsViewPage)} options={{ headerCenter: () => (<PageCenter name="消息详情" />) }} />
        <Stack.Screen {...ScreenOptions('PaymentView', PaymentViewPage)} options={{ headerCenter: () => (<PageCenter name="还款详情" />) }} />

        <Stack.Screen {...ScreenOptions('Scan', WorkerScanPage)} />
        {/* ------------------------- */}
        <Stack.Screen {...ScreenOptions('WorkerContractForm', WorkerContractFormPage)} options={{ headerCenter: () => (<PageCenter name="申请签约" />) }} />


        <Stack.Screen name="SearchPosition" component={WorkerSearchPositionPage} options={{ headerCenter: () => (<PageCenter name="搜索" />) }} />
        <Stack.Screen {...ScreenOptions('Setting', WorkerSettingPage)} options={{ headerCenter: () => (<PageCenter name="设置" />) }} />
        <Stack.Screen {...ScreenOptions('BankCard', BankCard)} options={{ headerCenter: () => (<PageCenter name="银行卡" />) }} />
        <Stack.Screen {...ScreenOptions('MyProfile', MyProfile)} options={{ headerCenter: () => (<PageCenter name="我的资料" />) }} />
        <Stack.Screen {...ScreenOptions('ChangeUserInfo', ChangeUserInfoPage)} options={{ headerCenter: () => null }} />
        <Stack.Screen {...ScreenOptions('ChangePasswordPage', ChangePasswordPage)} options={{ headerCenter: () => (<PageCenter name="修改密码" />) }} />
        <Stack.Screen {...ScreenOptions('ChangePhonePage', ChangePhonePage)} options={{ headerCenter: () => (<PageCenter name="更换手机号" />) }} />
        <Stack.Screen {...ScreenOptions('VersionPage', VersionPage)} options={{ headerCenter: () => (<PageCenter name="版本信息" />) }} />


        <Stack.Screen {...ScreenOptions('Signature', SignaturePage)} options={{ headerCenter: () => (<PageCenter name="签字" />) }} />
        <Stack.Screen {...ScreenOptions('TransferApply', TransferApplyPage)} options={{ headerCenter: () => (<PageCenter name="详情" />) }} />
        <Stack.Screen {...ScreenOptions('ApplyDetail', ApplyDetailPage)} options={{ headerCenter: () => (<PageCenter name="详情" />) }} />
        <Stack.Screen {...ScreenOptions('Loan', LoanPage)} options={{ headerCenter: () => (<PageCenter name="借款" />) }} />
        <Stack.Screen {...ScreenOptions('LoanDetail', LoanDetailPage)} options={{ headerCenter: () => (<PageCenter name="借款详情" />) }} />
        <Stack.Screen {...ScreenOptions('LoanDetail1', LoanDetailPage1)} options={{ headerCenter: () => (<PageCenter name="借款详情" />) }} />
        <Stack.Screen {...ScreenOptions('Leave', Leave)} options={{ headerCenter: () => (<PageCenter name="离职" />) }} />
        <Stack.Screen {...ScreenOptions('LeaveDetail', LeaveDetail)} options={{ headerCenter: () => (<PageCenter name="详情" />) }} />
        {/* <Stack.Screen {...ScreenOptions('LoanViewRecord', LoanViewRecord)}options={{headerCenter: () => (<PageCenter name="借款"/>)}}/> */}
        <Stack.Screen {...ScreenOptions('Assess', AssessPage)} options={{ headerCenter: () => (<PageCenter name="评价" />) }} />
        <Stack.Screen {...ScreenOptions('Reviews', ReviewsPage)} options={{ headerCenter: () => (<PageCenter name="添加点评" />) }} />
        <Stack.Screen {...ScreenOptions('ReviewDetail', ReviewDetailPage)} options={{ headerCenter: () => (<PageCenter name="评价结果" />) }} />
        <Stack.Screen {...ScreenOptions('NewsDetail', NewsDetailPage)} options={{ headerCenter: () => (<PageCenter name="详情" />) }} />
        <Stack.Screen {...ScreenOptions('AICustomer', AICustomerPage)} options={{ headerCenter: () => (<PageCenter name="AI客服" />) }} />
        <Stack.Screen {...ScreenOptions('UserAgreement', UserAgreementPage)} options={{ headerCenter: () => (<PageCenter name="用户协议" />) }} />

        <Stack.Screen {...ScreenOptions('Login', WorkerLoginPage)} />
      </Stack.Navigator>
    </TokenNavigatorContext>
  )
}
