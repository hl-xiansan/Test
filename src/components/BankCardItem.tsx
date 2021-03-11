import React from 'react'
import Icons from '../Icons'
import {Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import ScreenUtils from '../utils/ScreenUtils'

export interface IBankItem {
    id: string,
    card_owner:string,
    bank_name:string,
    bank_account: string,
    location:string,
    // creator:long,
    create_time:string,
    // modifier:long,
    modify_time:string
}

interface IProps {
    data: IBankItem,
    onEdit: (i: IBankItem) => void,
    onRemove: (i: IBankItem) => void,
}

function BankCardItem({ data, onEdit, onRemove }: IProps) {
  return (
    <ImageBackground style={styles.bankCard} source={Icons.BankCard.Background}>
      <View style={styles.bankInfo}>
        <View style={styles.bankInfoLeft}>
          <Image source={Icons.BankCard.BankLogo} style={styles.logo} />
          <Text style={styles.bankName}>{data.bank_name}</Text>
        </View>
        <Text style={styles.subBankName}>{data.location}</Text>
      </View>
      <View style={styles.cardNumber}>
        <Text style={styles.cardNumberText}>{data.bank_account.slice(0, 4)}</Text>
        <Text style={styles.cardNumberText}>****</Text>
        <Text style={styles.cardNumberText}>****</Text>
        <Text style={styles.cardNumberText}>****</Text>
        <Text style={styles.cardNumberText}>{data.bank_account.slice(-4, data.bank_account.length)}</Text>
      </View>
      <View style={styles.operate}>
        <TouchableOpacity onPress={onRemove} style={[styles.operateBtn, styles.rightBorder]}>
          <Text style={styles.operateBtnText}>删除</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onEdit} style={styles.operateBtn}>
          <Text style={styles.operateBtnText}>编辑</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  logo: {
    height: ScreenUtils.scaleSize(26),
    width: ScreenUtils.scaleSize(26),
  },
  bankCard: {
    marginTop: ScreenUtils.scaleSize(15),
    marginHorizontal: ScreenUtils.scaleSize(15),
    height: ScreenUtils.scaleSize(175),
    paddingHorizontal: ScreenUtils.scaleSize(15),
    paddingTop: ScreenUtils.scaleSize(23),
  },
  bankInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bankInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    // fontWeight: "200"
  },
  bankName: {
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(17),
    fontWeight: 'bold',
    marginLeft: ScreenUtils.scaleSize(10),
  },
  subBankName: {
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(13),
  },
  cardNumber: {
    marginTop: ScreenUtils.scaleSize(31),
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cardNumberText: {
    fontSize: ScreenUtils.scaleSize(18),
    color: '#fff',
    letterSpacing: ScreenUtils.scaleSize(3),
  },
  operate: {
    marginTop: ScreenUtils.scaleSize(30),
    borderTopColor: 'rgba(255,255,255,0.5)',
    borderTopWidth: StyleSheet.hairlineWidth,
    height: ScreenUtils.scaleSize(42),
    // backgroundColor: '#000',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  operateBtn: {
    height: ScreenUtils.scaleSize(24),
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  operateBtnText: {
    color: '#fff',
    fontSize: ScreenUtils.scaleSize(15),
  },
  rightBorder: {
    borderRightColor: 'rgba(255,255,255,0.5)',
    borderRightWidth: StyleSheet.hairlineWidth,
  },
})

export default BankCardItem
