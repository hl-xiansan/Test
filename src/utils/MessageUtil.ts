import {DeviceEventEmitter} from 'react-native'
import {Profile} from '../@types'
import Api from './Api'
import AsyncStorage from '@react-native-community/async-storage'
import JPush from 'jpush-react-native'

export const UPDATE_MSG_JPUSH = 'JPushMsgUpdate'

export type Msg = {
  messageID:string
  id:string
  type:number
  content:string
  time:string
}

export type Message ={
  messageID:string
  content:string
  title:string
  extras:{
    id:string
    type:number
  }
}

class MessageUtil {

  async setMessage(message:Message) {
    let msg:string | null = await AsyncStorage.getItem('JPushMsg')

    if (msg === null) {
      const list:Msg[] = []
      list.push(await this.getMsgObj(message))
      await this.setMsg(list)
      return
    }

    let msgObj:Msg[] = JSON.parse(msg);

    if (await this.findIndexByMsgId(message.messageID,msgObj) === -1) {
      msgObj.push(await this.getMsgObj(message))
      await this.setMsg(msgObj)
    }
  }

  async setMsg(item:Msg[]) {
    await AsyncStorage.setItem('JPushMsg', JSON.stringify(item))
    DeviceEventEmitter.emit(UPDATE_MSG_JPUSH)
  }

  async removeMsg(msgId:string) {
    let msg:string | null = await AsyncStorage.getItem('JPushMsg')
  }

  async removeAllMsg() {
    await AsyncStorage.removeItem('JPushMsg')
  }

  async findIndexByMsgId(msgId:string,obj:Msg[]) {
    return obj.findIndex(item => item.messageID === msgId)
  }

  async getMsgObj(message:Message) {
    return {
      messageID: message.messageID,
      id: message.extras.id,
      type: message.extras.type,
      content: message.content,
      time: new Date().toUTCString()
    }
  }

}

export const MsgUtil = new MessageUtil()
