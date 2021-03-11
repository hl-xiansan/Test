import { connect } from 'react-redux'
import { createStore, Action } from 'redux'
import {createContext} from 'react'

export interface ApplicationStoreState {
  token?: string
  role: string
}

export interface ApplicationStoreDispatchProps {
  changeToWelcome: () => void
  changeToManager: () => void
  changeToWorker: () => void
}

const InitStoreState: ApplicationStoreState = {
  role: ''
}

const InitStoreProps = (state:ApplicationStoreState) => ({...state})

const InitStoreDispatch = (dispatch: any): ApplicationStoreDispatchProps => ({
  changeToWelcome: () => {
    dispatch({type: 'Change_To_Welcome'})
  },
  changeToManager: () => {
    dispatch({type: 'Change_To_Manager'})
  },
  changeToWorker: () => {
    dispatch({type: 'Change_To_Worker'})
  }
})


function reducer(state:ApplicationStoreState = InitStoreState, action: Action<string>) {
  switch(action.type) {
    case 'Change_To_Welcome':
      return {...state, role: 'manager'}
    case 'Change_To_Manager':
      return {...state, role: 'manager'}
    case 'Change_To_Worker':
      return {...state, role: 'worker'}
    case 'Save':
      return {...state, ...action.payload}
    default:
      return state
  }
}

export function appliction(options?: {mapStateToProps: any, mapDispatchToProps?: any}) {
  return (Component: any): any => {
    return connect(
      options?.mapStateToProps || InitStoreProps,
      options?.mapDispatchToProps || InitStoreDispatch)(Component)
  }
}


const store = createStore(reducer)
export default store

export const ManagerContext = createContext({});
