
import AsyncStorage from '@react-native-community/async-storage'
import RNFetchBlob from 'rn-fetch-blob'
import qs from 'query-string'
import Global from '../Config'
import {workerInfo} from "./worker";

type RequestOptions = {
  params?: { [key: string]: any }
} & RequestInit

const events: { [key: string]: ((...args: any[]) => void)[] } = {}

class GenericHttpInstance {
  // authorization: string | null = 'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ0b25ndHUubGFib3IuYXBwLndvcmtlciIsImV4dHJhcyI6eyJuYW1lIjoi55So5oi3MDExMDk4OTQifSwiaWQiOiIxMzE4NTM5MzI1NjAzODkxODgiLCJleHAiOiIxNjExNzI4ODA1MDk2IiwiaWF0IjoiMTYxMDAyMzc3MjM5MiJ9.4_fVe1TwFnCorwMNVCrHYrOapOeVLdDC5uIWoo0kW98'

  private authorization: string | null = null;
  isManager = false

  constructor(private uri?: string) { }

  on(name: string, cb: (...args: any) => void) {
    if (!events[name]) {
      events[name] = []
    }
    events[name].push(cb)
  }

  un(name: string, cb?: (...args: any) => void) {
    if (!cb) {
      events[name] = []
    } else {
      const index = events[name].findIndex((item) => item === cb)
      if (index >= 0) {
        events[name].splice(index, 1)
      }
    }
  }

  emit(name: string, ...args: any[]) {
    events[name].forEach((cb) => cb(args))
  }

  async request<T>(url: string, init?: RequestOptions): Promise<T> {

    if (!this.authorization) {
      this.authorization = await AsyncStorage.getItem('Authorization')
    }

    if (Global.http.baseURL) {
      url = `${Global.http.baseURL}${url}`
    }
    const headers = new Headers(init?.headers)
    if (this.authorization) {
      headers.set('Authorization', this.authorization)
    }

    for (let key in Global.http.headers) {
      if (!headers.has(key)) {
        headers.set(key, (Global.http.headers as any)[key])
      }
    }

    const body = typeof (init?.body) === 'object'
      && headers.get('content-type')?.startsWith('application/json') ? JSON.stringify(init.body) : init?.body


    if (body instanceof FormData) {
      headers.delete('content-type')
    }
    init = Object.assign(init || {}, {
      body: body,
      headers: headers,
      credentials: Global.http.credentials,
      mode: Global.http.mode
    })

    if (init.params) {
      url = url.indexOf('?') >= 0 ? `${url}&${qs.stringify(init.params)}` : `${url}?${qs.stringify(init.params)}`
    }
    console.log('url', url)
    // console.log('token', this.authorization)

    const res = await fetch(url, init)
    const authorization = res.headers.get('authorization')

    if (authorization) {
      if (this.isManager) {
        await AsyncStorage.setItem('ManagerAuthorization', authorization)
        this.authorization = authorization
      }
      else {
        await AsyncStorage.setItem('Authorization', authorization)
        this.authorization = authorization
      }
    }

    if (!res.headers.get('content-type')?.startsWith('application/json')) {
      return res as unknown as T
    }

    if (res.status === 401) {
      this.emit('NotAuthorization', res)
    }

    if (res.status >= 300) {
      throw new Error(`${res.status}`)
    }

    const data = await res.json()
    if (data.success === undefined && data.code === undefined) {
      return res as unknown as T
    }

    if (!data.success) {
      if (data.code == 500) throw new Error('登录失败')
      if (data.code == 5005101) throw new Error('验证码过期')
      if (data.code == 5005102) throw new Error('密码错误')
      if (data.code == 5005103) throw new Error('用户已存在')
      if (data.code == 5005104) throw new Error('用户不存在')
      if (data.code == 5005108) throw new Error('session 过期')
      throw new Error(data.msg || data.code)
    }

    return data.data

  }

  get<T>(url: string, init?: RequestOptions): Promise<T> {
    return this.request(url, Object.assign(init || {}, {
      method: 'GET'
    }))
  }


  delete<T>(url: string, init?: RequestOptions): Promise<T> {
    return this.request(url, Object.assign(init || {}, {
      method: 'DELETE'
    }))
  }


  head<T>(url: string, init?: RequestOptions): Promise<T> {
    return this.request(url, Object.assign(init || {}, {
      method: 'HEAD'
    }))
  }

  options<T>(url: string, init?: RequestOptions): Promise<T> {
    return this.request(url, Object.assign(init || {}, {
      method: 'OPTIONS'
    }))
  }

  post<T>(url: string, data?: any, init?: RequestOptions): Promise<T> {
    return this.request(url, Object.assign(init || {}, {
      method: 'POST',
      body: data
    }))
  }

  put<T>(url: string, data?: any, init?: RequestOptions): Promise<T> {
    return this.request(url, Object.assign(init || {}, {
      method: 'PUT',
      body: data
    }))
  }

  patch<T>(url: string, data?: any, init?: RequestOptions): Promise<T> {
    return this.request(url, Object.assign(init || {}, {
      method: 'PATCH',
      body: data
    }))
  }

  upload(url: string, data: { [key: string]: string | { path: string, name?: string } }, init?: RequestOptions) {
    const form = new FormData()
    for (let key in data) {
      if (typeof (data[key]) !== 'object') form.append(key, data[key])
      else {
        const item = data[key] as { path: string, name?: string }
        form.append(key, {
          uri: item.path,
          type: 'multipart/form-data',
          name: item.name || item.path.substring(item.path.lastIndexOf('/') + 1)
        })
      }
    }

    return this.request(url, Object.assign(init || {}, {
      method: 'post',
      body: form,
      headers: {
        'content-type': 'multipart/form-data'
      }
    }))
  }
  myUpload(url: string, data: any, init?: RequestOptions) {
    const form = new FormData()
    for (let key in data) form.append(key, data[key])
    // console.log(form)
    return this.request(url, Object.assign(init || {}, {
      method: 'post',
      body: form,
      headers: {
        'content-type': 'multipart/form-data'
      }
    }))
  }
  RNUpload(url: string, base64: string, name: string) {
    return new Promise((resolve, reject) => {
      const u = `${Global.http.baseURL}${url}`
      RNFetchBlob.fetch('POST', u, {
        Authorization: this.authorization as string,
        'content-type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*'
      }, [
        { name: 'file', filename: 'sign.png', data: base64, type: 'image/png' }
      ])
        .then((res) => {
          resolve(res.json())
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  async token(isManager = false): Promise<string | undefined | null | void> {
    this.isManager = isManager
    let res = null
    if (this.isManager) res = await AsyncStorage.getItem('ManagerAuthorization')
    else res = await AsyncStorage.getItem('Authorization')

    if (res) this.authorization = res
    return res
  }
  async logout(isManager = false) {
    this.authorization = null

    await AsyncStorage.removeItem('appRoleFactory')
    await AsyncStorage.removeItem('appRoleRecruit')

    await workerInfo.clear()

    if (isManager) return AsyncStorage.removeItem('ManagerAuthorization')
    else return AsyncStorage.removeItem('Authorization')
  }
}

export type PageResult<T> = {
  count: number
  list: T[]
}
export default new GenericHttpInstance()
