/*
 * @Author: yejianfei
 * @Date: 2020-12-18 11:24:29
 * @LastEditors: yejianfei
 * @LastEditTime: 2020-12-18 14:26:58
 * @Description: 
 * @Developer: 
 */
/* eslint-disable no-undef */
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      {
        'legacy': true
      }
    ]
  ]
}