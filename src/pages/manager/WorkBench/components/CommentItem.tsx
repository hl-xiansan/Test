import React from 'react'
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ScreenUtils from '../../../../utils/ScreenUtils'
import Icons from '../../../../Icons'
import ScreenUtil from '../../../../utils/ScreenUtils'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { formatDate } from '../../../worker/leave/Leave'
import { Toast } from '@ant-design/react-native'
import Api from '../../../../utils/Api'
import { Portal, Provider } from '@ant-design/react-native'

type Props = {
  navigation?: BottomTabNavigationProp<any>,
  onPress?: () => void,
  status?: number
  text?: string
  data?: any
  onLoad?: any
}

function renderStatus(status: any) {

  switch (status) {
    case '差评': return <ImageBackground source={Icons.Apply.OrangeRectangle} style={styles.statusTag}>
      <Text style={styles.tagText}>差评</Text>
    </ImageBackground>
    case '中评': return <ImageBackground source={Icons.Apply.OrangeRectangle} style={styles.statusTag}>
      <Text style={styles.tagText}>中评</Text>
    </ImageBackground>
    default: return <ImageBackground source={Icons.Apply.RoundRectangle} style={styles.statusTag}>
      <Text style={styles.tagText}>好评</Text>
    </ImageBackground>

  }
}
const defaultText = '该在职人员工作态度端正，非常好，很满意！'
function CommentItem({ onPress = () => { }, text = defaultText, status = 0 }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.left}>
          <Image source={require('../../../../assets/icons/job/avatar.png')} style={styles.avatar} />
          <View>
            <Text style={styles.name}>XXX</Text>
            <Text style={styles.grayText}>深圳富士康</Text>
          </View>
        </View>
        {renderStatus(status)}
      </View>
      <Text style={styles.commentText}>{text}</Text>
      <View style={styles.bottom}>
        <Text style={styles.date}>2020-10-09</Text>
        <View style={styles.centerBox}>
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>编辑</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>删除</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}
export function CommentItem2({ onPress = () => { }, text = defaultText, status = 0, data, onLoad, navigation }: Props) {
  const deletBtn = async () => {
    const key = Toast.loading('删除中...')
    console.log('删除中...')
    try {
      await Api.delete(`/labor/staff/comment/${data.id}`)
      Portal.remove(key)
      setTimeout(() => {
        if (onLoad) onLoad()
      }, 400)
    } catch (error) {
      Portal.remove(key)
      Toast.fail(error.message)
    }
  }
  const editBtn = () => {
    navigation!.navigate('CommentEdit', {
      item: data,
      goBack: () => {
        if (onLoad) onLoad()
      }
    })
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.left}>
          <Image source={ data.employee_photo ? {uri: data.employee_photo} : require('../../../../assets/icons/job/avatar.png') } style={styles.avatar} />
          <View>
            <Text style={styles.name}>{data?.employee_name}</Text>
            <Text style={styles.grayText}>{data?.customer_name}</Text>
          </View>
        </View>
        {renderStatus(data?.result)}
      </View>
      <Text style={styles.commentText}>{data?.content}</Text>
      <View style={styles.bottom}>
        <Text style={styles.date}>{formatDate(new Date(data.create_time))}</Text>
        <View style={styles.centerBox}>
          <TouchableOpacity style={styles.btn} onPress={editBtn}>
            <Text style={styles.btnText}>编辑</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={deletBtn}>
            <Text style={styles.btnText}>删除</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: ScreenUtils.scaleSize(15),
    paddingTop: ScreenUtils.scaleSize(15),
    borderRadius: ScreenUtils.scaleSize(5),
    marginBottom: ScreenUtils.scaleSize(10),

    elevation: 6,
    shadowColor: 'rgba(37, 48, 57, 0.08)',  //  阴影颜色
    shadowOffset: { width: 0, height: 5 },  // 阴影偏移
    shadowOpacity: 1,  // 阴影不透明度
    shadowRadius: 10,  //  圆角
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: ScreenUtils.scaleSize(14),
    alignItems: 'center'
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    height: ScreenUtils.scaleSize(45),
    width: ScreenUtils.scaleSize(45),
    marginRight: ScreenUtils.scaleSize(10)
  },
  name: {
    color: '#030014',
    fontSize: ScreenUtils.scaleSize(16),
    fontWeight: '700',
    marginBottom: ScreenUtils.scaleSize(7)
  },
  grayText: {
    color: '#A8A8AC',
    fontSize: ScreenUtils.scaleSize(13),
  },
  statusTag: {
    width: ScreenUtil.scaleSize(53),
    height: ScreenUtil.scaleSize(19),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    color: '#fff',
    fontSize: ScreenUtil.scaleSize(12),
  },
  bottom: {
    height: ScreenUtil.scaleSize(47),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: ScreenUtils.scaleSize(1),
    borderTopColor: '#F3F5F7',
    paddingVertical: ScreenUtils.scaleSize(5),
  },
  commentText: {
    color: '#030014',
    fontSize: ScreenUtil.scaleSize(15),
    marginTop: ScreenUtil.scaleSize(8),
    marginBottom: ScreenUtil.scaleSize(19),
    lineHeight: ScreenUtil.scaleSize(22),
  },
  date: {
    color: '#A8A8AC',
    fontSize: ScreenUtil.scaleSize(13),
  },
  btn: {
    height: ScreenUtils.scaleSize(33),
    width: ScreenUtils.scaleSize(65),
    borderColor: '#F3F5F7',
    borderWidth: ScreenUtils.scaleSize(1),
    borderRadius: ScreenUtils.scaleSize(3),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: ScreenUtil.scaleSize(8.5),
  },
  btnText: {
    borderColor: '#545468',
    fontSize: ScreenUtil.scaleSize(13),
  },
  centerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingHorizontal: ScreenUtil.scaleSize(18),
  },
  titleText: {
    color: '#030014',
    fontSize: ScreenUtil.scaleSize(13),
    lineHeight: ScreenUtil.scaleSize(25),
    marginBottom: ScreenUtil.scaleSize(4),
  },
})

export default CommentItem
