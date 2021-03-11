/*
 * @Author: yejianfei
 * @Date: 2020-12-30 10:27:39
 * @LastEditors: lwq
 * @LastEditTime: 2020年12月30日 21:53:18
 * @Description:
 * @Developer:
 */

export type Job = {
  id: string
  name: string
  customer_id: number,
  customer_name?: string //客户名称
  exp_low: string
  exp_high: string
  qualifications: string
  salary: number
  recruit_count: number
  province: any
  city: any
  education: any
  area: string
  place: string
  desc: string
  audit_desc: string
  customer: {
    photos: []
    name: string
    contact: string
    phone: string
    address: string
    desc: string
  }
  user: {
    id: string
    logo?: string
    nickname: string
    username: string
    extras?: {
      person?: {
        phone: string
        wx_qrcode: string
        wx_number: string
        name: string
      }
    }
  }
  person:any
}

// 消息列表
export type Message = {
  id: string
  value_id: string
  type: number
  status: number
  title: string
  user_id: string
  content: string
  creator: number
  create_time: string
  modifier: number
  modify_time: string
}

// 新闻信息
export type News = {
  id?: string, //新闻id
  type?: number, // 新闻类型（0 新闻；1 通告；2 活动）
  channel_id?: string,// 栏目id
  title?: string,// 标题
  author?: string,// 作者
  publish_time?: string,// 发布时间
  content?: string,// 正文
  photos?: string,// 图片
  channel: {
    id: string,// 主键
    name: string,// 栏目名
    icon: string // 栏目图标
  }
}

export type Profile = {
  id?: string
  logo?: string
  nickname?: string
  username?: string
  phone?: string
  sex?: number
  status?: number // 0~4 正常，工作，黑名单，离职
  extras?: {
    invite_code?: string
    team?: string
    address?: string
    id_no?: string
    wechat?: string
    birth?: string
    person?: {
      working_unit: string
      entry_date: string
      phone: string
      wx_qrcode: string
      wx_number: string
      name: string
      gender: number
      birth: string
      id_no: string
      address: string
      province_id: string
      city_id: string
      [x: string]: string | number | any
    }
  }
}
