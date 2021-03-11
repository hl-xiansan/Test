import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import Api from '../utils/Api'

function SplashScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Loading...</Text>
    </View>
  )
}

export function ScreenOptions(name: string, component: React.ComponentType<any> & { options?: any }): {
  name: string
  component: React.ComponentType
  options?: any
} {
  return {
    name: name,
    component: component,
    options: component.options
  }
}

export default function TokenNavigatorContext(props: { home: string, login: string, children: any, isManager?: boolean }) {

  const [prepare, setPrepare] = useState({
    isLoading: true,
    hasToken: false
  })

  useEffect(() => {
    const bootstrap = async () => {
      const token = await Api.token(props.isManager)
      prepare.isLoading && setPrepare({
        isLoading: false,
        hasToken: !!token
      })
    }

    bootstrap()
  }, [])
  return (
    !prepare.isLoading ? (
      React.Children.map(props.children, (item) => (
        React.createElement(item.type, {
          ...item.props,
          initialRouteName: prepare.hasToken ? props.home : props.login
        })
      ))
    ) : (
      <SplashScreen />
    )
  )
}




