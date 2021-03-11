/*
 * @Author: yejianfei
 * @Date: 2020-12-24 10:27:34
 * @LastEditors: yejianfei
 * @LastEditTime: 2020-12-30 10:36:53
 * @Description: 
 * @Developer: 
 */
declare type RNComponent<P = {}, S = {}, SS = any> = import('react').Component<P, S, SS>;
declare type RNConstructor<T> = import('react-native').Constructor<T>;
declare type RNViewProps = import('react-native').ViewProps;
declare type RNViewStyle = import('react-native').ViewStyle;

declare module 'react-native-shadow' {
  interface BoxShadowSettingOptions {
    width: number,
    height: number,
    color: string,
    border: number,
    radius: number,
    opacity: number,
    x: number,
    y: number,
    style?: RNViewStyle,
  }

  interface BorderShadowType {
    width: number,
    color: string,
    border: number,
    opacity: number,
    style?: RNViewStyle,
    side: 'top' | 'bottom' | 'left' | 'right',
    inset: boolean,
  }
  export const BoxShadow : RNConstructor<RNComponent<RNViewProps & {setting?: BoxShadowSettingOptions}>>
  export const BorderShadow : RNConstructor<RNComponent<RNViewProps & {setting?: BorderShadowType}>>
}