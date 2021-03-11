
import {
  PixelRatio,
  Dimensions,
} from 'react-native'

export let screenW = Dimensions.get('window').width
export let screenH = Dimensions.get('window').height
const fontScale = PixelRatio.getFontScale()
export let pixelRatio = PixelRatio.get()
//像素密度
export const DEFAULT_DENSITY = 2
//px转换成dp
//以iphone6为基准,如果以其他尺寸为基准的话,请修改下面的defaultWidth和defaultHeight为对应尺寸即可.
const defaultWidth = 375
const defaultHeight = 667
const w2 = defaultWidth / DEFAULT_DENSITY
//px转换成dp
const h2 = defaultHeight / DEFAULT_DENSITY

// iPhoneX
const X_WIDTH = 375
const X_HEIGHT = 812
export default class ScreenUtils {
  constructor(){

  }


  /**
   * 屏幕适配,缩放size
   * @param size
   * @returns {number}
   */
  static scaleSize(size: number) {
    return size / defaultWidth * screenW
  }


  // // 最初版本尺寸适配方案 也许你会更喜欢这个
  // scaleSize(size: Number) {
  //     let scaleWidth = screenW / w2
  //     let scaleHeight = screenH / h2
  //     let scale = Math.min(scaleWidth, scaleHeight)
  //     size = Math.round((size * scale + 0.5))
  //     return size / DEFAULT_DENSITY
  // }

  /**
   * 设置字体的size（单位px）
   * @param size 传入设计稿上的px
   * @returns {number} 返回实际sp ,会随系统缩放比例改变，如不需要请去掉 * fontScale
   */
  setSpText(size: number) {
    // return size / defaultWidth * screenW * fontScale;
    return size
  }

  setSpText2(size: number) {
    let scaleWidth = screenW / w2
    let scaleHeight = screenH / h2
    let scale = Math.min(scaleWidth, scaleHeight)
    size = Math.round((size * scale + 0.5))

    return size / DEFAULT_DENSITY * fontScale
  }

}





