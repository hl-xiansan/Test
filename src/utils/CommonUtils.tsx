import moment from 'moment'
import Api from './Api'
import Config from '../Config'

const aCity: any = {
  11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁",
  22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽",
  35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南",
  44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州",
  53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏",
  65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外"
};

export default class CommonUtils {
  static isCardID(sId: string) {
    let iSum = 0;
    if (!/^\d{17}(\d|x)$/i.test(sId)) return false;
    sId = sId.replace(/x$/i, "a");
    if (aCity[parseInt(sId.substr(0, 2))] == null) return false;
    let sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
    let d = new Date(sBirthday.replace(/-/g, "/"));
    if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) return false;
    for (let i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
    if (iSum % 11 != 1) return false;
    // @ts-ignore
    aCity[parseInt]
    return true;
  }

  static isPhoneAvailable(phone:string) {
    let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    return reg.test(phone);
  }

  static isQQAvailable(qq: string) {
    let reg = /^[1-9][0-9]{4,9}$/
    return reg.test(qq)
  }

  static isEmailAvailable(email: string) {
    let reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
    return reg.test(email)
  }


  // 从文件路径获取文件名
  static getFileName(path:string) {
    const paths = path.split('/');
    if (paths.length > 0)
      return paths[paths.length - 1];
    return '';
  }

  // UTC时间转换
  static UTCChange(utc_datetime: string) {
    const localTime = moment
    .utc(utc_datetime)
    .local()
    .format('YYYY年MM月DD日')
    return localTime
  }

  static UTCDateFormat(date:any,format:string) {
    if (date === null){
      return '-'
    }
    return moment.utc(date).local().format(format)
  }

  static changeUserInfo (params: any) {
    return Api.put('/gateway/profile', params)
  }

  static changePassword (params: any) {
    return Api.put('/gateway/users/change_password', params)
  }

  static changePhone (params: any) {
    return Api.put('/gateway/users/phone', params)
  }

  //比较版本大小
  static haveNewVersion(newVersion:string, old:string) {
    if (newVersion == null || newVersion.length<1 || old == null || old.length<1)
      return false
    let newVersionInt, oldVersion
    let newList = newVersion.split('.')
    let oldList = old.split('.')
    if (newList.length == 0 || oldList.length == 0) {
      return false
    }
    for (let i = 0; i < newList.length; i++) {
      newVersionInt = Number(newList[i])
      oldVersion = Number(oldList[i])
      if (newVersionInt > oldVersion) {
        return true
      } else if (newVersionInt < oldVersion) {
        return false
      }
    }
    return false
  }

  // 检查更新
  static async checkLatest() {
    let response = await fetch(Config.latestUrl, {method: 'GET'})
    return response.json()
  }
}
