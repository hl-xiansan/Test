import React, { useCallback, useState } from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity, View, Text, FlatList, RefreshControl, DeviceEventEmitter } from 'react-native'
import ScreenUtils from '../../../../utils/ScreenUtils'
import ScreenUtil from '../../../../utils/ScreenUtils'
import {CommentItem2} from '../components/CommentItem'
import Icons from '../../../../Icons'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import Api from '../../../../utils/Api'
import { useRequest } from 'ahooks'
import { Provider, Toast } from '@ant-design/react-native'

type Props = {
  navigation: BottomTabNavigationProp<any>
}
//  list view hook
const useListView = (url: string): any => {
  const hasMore = React.useRef(true)
  const page = React.useRef(1)
  const [refreshing, setRefreshing] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [list, setList] = React.useState<any[]>([])

  const fetchtList = async (flag = false) => {
    if (refreshing || loading || (!flag && !hasMore.current)) return
    if (flag) {
      page.current = 1
      hasMore.current = true
      setRefreshing(true)
    }
    else setLoading(true)
    try {
      const params: any = { page:page.current, size: 10 }
      const res: any = await Api.get(url + page.current, { params })
      let datas = list
      if (page.current == 1) datas = res.list
      else datas = datas.concat(res.list)

      hasMore.current = !(datas && datas.length >= res.count)
      page.current += 1
      setLoading(false)
      setRefreshing(false)
      setList(datas)

    } catch (error) {
      Toast.fail(error.message)
      setLoading(false)
      setRefreshing(false)
    }
  }
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent?.contentOffset?.y
    const contentHeight = event.nativeEvent?.contentSize?.height
    const height = event.nativeEvent?.layoutMeasurement?.height
    if (offsetY + height > contentHeight - 100 && contentHeight > height) fetchtList()
  }
  return [refreshing, list, handleScroll, fetchtList]
}
function CommentList({ navigation }: Props) {
  const [refreshing, list, handleScroll, fetchtList] = useListView('/labor/staff/comment/list/')
  const emitter = React.useRef<any>(null)
  React.useEffect(() => {
    emitter.current = DeviceEventEmitter.addListener('mannager_comment_sent', () => { fetchtList(true) })
    fetchtList(true)
    return ()=>{
      if(emitter.current) emitter.current.remove()
    }
  }, [])
  return (
    <Provider>
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          scrollEventThrottle={200}
          onScroll={handleScroll}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { fetchtList(true) }} />} >
          {(!refreshing && list?.length === 0) ? <Text style={{ textAlign: 'center', marginTop: 20 }}>{'暂无数据'}</Text> : null}
          <FlatList
            data={list}
            renderItem={(item) => <CommentItem2 navigation={navigation} onLoad={()=>{ fetchtList(true) }} data={item.item as any} status={0} />}
            keyExtractor={(item: any, index: number) => item + index}
            style={{
              flex: 1, marginTop: ScreenUtils.scaleSize(15)
            }}
          />
        </ScrollView >
        <TouchableOpacity onPress={() => { navigation.navigate('CommentChoose') }} style={styles.add}>
          <Image style={styles.addIcon} source={Icons.Comment.Add} />
          <Text style={styles.addText}>点评</Text>
        </TouchableOpacity>
      </View>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    paddingTop: ScreenUtils.scaleSize(15),
    paddingHorizontal: ScreenUtils.scaleSize(15),
  },
  add: {
    height: ScreenUtils.scaleSize(62),
    width: ScreenUtils.scaleSize(62),
    borderRadius: ScreenUtils.scaleSize(31),
    backgroundColor: '#526CDD',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: ScreenUtils.scaleSize(15),
    bottom: ScreenUtils.scaleSize(38),
  },
  addIcon: {
    height: ScreenUtils.scaleSize(23),
    width: ScreenUtils.scaleSize(21),
    marginBottom: ScreenUtils.scaleSize(3),
  },
  addText: {
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(12),
  }
})

export default CommentList
