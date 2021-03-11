import {DeviceEventEmitter} from 'react-native'
import {Profile} from '../@types'
import Api from './Api'

export const UPDATE_WORKER_INFO = 'updateWorkerInfo'

class WorkerInfo {
  info: Profile | null = null
  educationList: any[] = []
  avatar: any
  user: Profile | null = null
  person: any = null

  // constructor() { this.init() }

  init() {
    console.log('init workerInfo --------------');
    this.getUser().then()
    this.getPerson().then()
  }

  async getEducationList() {
    if (this.educationList.length > 0) return this.educationList
    try {
      const res = await Api.get('/gateway/dicts/root/children?group=education')
      if (Array.isArray(res)) this.educationList = res as any[]
      return res
    }
    catch (error) { console.log(error) }
    return []
  }

  // async getInfo(needUpdate = false) {
  //   if (this.info && !needUpdate) return this.info
  //   try {
  //     this.info = await Api.get<Profile>('/gateway/profile')
  //     const person:any = await Api.get('/labor/person/profiles')
  //     this.info.extras = { person }
  //
  //
  //     DeviceEventEmitter.emit(UPDATE_WORKER_INFO)
  //     return this.info
  //   }
  //   catch (error) { console.log(error) }
  //   return null
  // }

  getProfile() {
    if (this.user && this.person) {
      const person:any = this.person
      this.user.extras = { person }
      return this.user
    }
  }

  async getUser(needUpdate = false) {
    if (this.user && !needUpdate) return this.user

    try {
      this.user = await Api.get<Profile>('/gateway/profile')
      return this.user
    }
    catch (error) { console.log(error) }
  }

  async getPerson(needUpdate = false) {
    if (this.person && !needUpdate) return this.person

    try {
      this.person = await Api.get('/labor/person/profiles')
      return this.person
    }
    catch (error) { console.log(error) }
  }

  getInviteCode() {
    return this.user?.extras?.invite_code! || null
  }

  async updateAvatar(res: any) {
    try {
      this.avatar = await Api.myUpload('/storage/employee', res)
      return this.avatar
    } catch (error) {
      console.log(error)
    }
    return null
  }

  async updateManagerAvatar(res: any) {
    try {
      this.avatar = await Api.myUpload('/storage/user', res)
      return this.avatar
    } catch (error) {
      console.log(error)
    }
    return null
  }

  async clear() {
    this.user = null
    this.person = null
    this.info = null
    this.educationList = []
    this.avatar = null
  }
}


export const workerInfo = new WorkerInfo()
