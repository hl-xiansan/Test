import React from 'react'
import { NavigationProp, useFocusEffect } from '@react-navigation/native'
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { NativeStackNavigationOptions } from 'react-native-screens/lib/typescript'
import TabNavigatorContext from '../components/TabNavigatorContext'

type PageOptions = {
  token?: boolean
  navigation?: NativeStackNavigationOptions
  bottomTabNavigation?: BottomTabNavigationOptions
}

type Props = {
  navigation: NavigationProp<any>
}

// let last: any = {}

function Navigation(props: {navigation: NavigationProp<any>, tab?: NavigationProp<any>, options?: PageOptions, children: any}) {
  useFocusEffect(() => {
    // const options = Object.entries(last).reduce((previous, [key]) => {
    //   previous[key] = undefined
    //   return previous
    // }, {} as any)

    // const value = props.options?.navigation || {}
    // last = {...options, ...value}
    // console.log(last)
    // props.tab
    //   ? props.tab.setOptions(last)
    //   : props.navigation.setOptions(last)
  })


  return props.children
}

export default (options?: PageOptions) => (Component: any): any => class Page extends React.Component<Props> {
  static options = options?.navigation
  static contextType = TabNavigatorContext
  context!: React.ContextType<typeof TabNavigatorContext>

  render() {
    return (
      <Navigation navigation={this.props.navigation} tab={this.context} options={options}>
        <Component {...this.props}/>
      </Navigation>
    )
  }
}
