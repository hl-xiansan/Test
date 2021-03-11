import { NavigationProp } from '@react-navigation/native'
import React from 'react'

export default React.createContext<NavigationProp<any> | undefined>(undefined)
