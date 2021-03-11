import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View, TextInput } from 'react-native'

import Icons from '../Icons'
import ScreenUtils from '../utils/ScreenUtils'

type Props = {
  onPress?: () => void,
  height?: number,
  searchOnPress?: () => void,
  type?: string,
  keyWord?: string,
  onChangeText?: (value: string) => void,
  placeholder?: string,
  handleClear?: () => void,
  onSubmitEditing?: () => void
}

export default function SearchView(props: Props) {
  let SearchView: any = props.type === 'navigation' ? TouchableOpacity : View

  return (
    <SearchView
      style={[styles.searchView, { height: props.height ? ScreenUtils.scaleSize(props.height) : ScreenUtils.scaleSize(33) }]}
      onPress={() => { props.type === 'navigation' && props.onPress ? props.onPress() : null }}
    >
      <TouchableOpacity style={styles.searchBtnView} onPress={() => { props.searchOnPress ? props.searchOnPress() : null }} activeOpacity={props.searchOnPress ? 0.5 : 1}>
        <Image source={Icons.Public.Search} style={styles.searchBtnIcon} />
      </TouchableOpacity>
      <TextInput
        placeholder={props.placeholder}
        value={props.keyWord}
        onChangeText={(value: string) => { props.onChangeText ? props.onChangeText(value) : null }}
        style={styles.textInput}
        editable={props.type === 'navigation' ? false : true}
        placeholderTextColor="rgba(187, 191, 249, 1)"
        onSubmitEditing={() => { props.onSubmitEditing ? props.onSubmitEditing() : null }}
      ></TextInput>
      {
        props.handleClear ? (
          <View style={styles.cleanView}>
            <View style={styles.cleanLine}></View>
            <TouchableOpacity style={styles.cleanBtn} onPress={props.handleClear}>
              <Image source={Icons.Public.Close} style={styles.cleanBtnIcon} />
            </TouchableOpacity>
          </View>
        ) : null
      }
    </SearchView>
  )
}

const styles = StyleSheet.create({
  searchView: {
    borderRadius: ScreenUtils.scaleSize(4),
    backgroundColor: 'rgba(109, 134, 245, 1)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchBtnView: {
    width: ScreenUtils.scaleSize(22),
    height: ScreenUtils.scaleSize(22),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: ScreenUtils.scaleSize(6)
  },
  searchBtnIcon: {
    width: '100%',
    height: '100%'
  },
  textInput: {
    flex: 1,
    padding: 0,
    fontSize: ScreenUtils.scaleSize(13),
    color: 'rgba(187, 191, 249, 1)',
    marginHorizontal: ScreenUtils.scaleSize(6)
  },
  cleanView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: ScreenUtils.scaleSize(6)
  },
  cleanLine: {
    width: ScreenUtils.scaleSize(1),
    height: ScreenUtils.scaleSize(17),
    backgroundColor: 'rgba(137, 159, 255, 1)'
  },
  cleanBtn: {
    marginLeft: ScreenUtils.scaleSize(6),
    width: ScreenUtils.scaleSize(22),
    height: ScreenUtils.scaleSize(22),
  },
  cleanBtnIcon: {
    width: '100%',
    height: '100%'
  }
})