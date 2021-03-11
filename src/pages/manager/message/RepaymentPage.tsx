import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import React, { Component } from 'react'
import { StatusBar, View, StyleSheet, Image, Text, ScrollView, Button } from 'react-native'
import Icons from '../../../Icons'
import ScreenUtils from '../../../utils/ScreenUtils'
import SearchView from '../../../components/SearchPage'
import Page from '../../../components/Page'

type Props = {
  navigation: BottomTabNavigationProp<any>
}

@Page()
export default class RepaymentPage extends Component<Props> {

  shadowOpt = {
    width: ScreenUtils.scaleSize(345),
    height: ScreenUtils.scaleSize(73),
    color: '#253039',
    border: 6,
    radius: ScreenUtils.scaleSize(5),
    opacity: 0.08,
    style: {
      marginBottom: ScreenUtils.scaleSize(15),
      paddingHorizontal: ScreenUtils.scaleSize(1)
    },
    x: 0,
    y: 2
  }

  renderItem = () => {
    return (
      <View style={styles.itemView}>
        <Text style={styles.itemText}>刘飞</Text>
        <Text style={styles.itemText}>2020-10-15</Text>
        <Text style={[styles.itemText, { marginRight: ScreenUtils.scaleSize(10) }]}>500元</Text>
        <Text style={styles.itemText}>500元</Text>
      </View>
    )
  }

  toNextPage = () =>{
    this.props.navigation.navigate('RepaymentSearch')
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.content}>
          <StatusBar backgroundColor="rgba(82, 108, 221, 1)"></StatusBar>
          <View style={styles.searchView}>
            <SearchView onPress={this.toNextPage} type="navigation" placeholder="搜索员工"></SearchView>
          </View>
          <View style={styles.contentView}>
            <View style={styles.whiteView}>
              <View style={styles.repayAmountView}>
                <Text style={styles.amountText}>75000</Text>
                <Text style={styles.grayText}>还款金额（元）</Text>
              </View>
              <View style={styles.grayView}>
                {/* TODO: 替换icon */}
                <Image style={styles.iconStyle} source={Icons.Job.BaseInfoIcon} />
                <Text style={styles.grayText}>还款人数：150人</Text>
                <View style={styles.diagual}></View>
                <Image style={styles.iconStyle} source={Icons.Apply.Clock} />
                <Text style={styles.grayText}>还款时间：2020-12-05</Text>
              </View>
            </View>

            <View style={styles.whiteView}>
              <View style={styles.paymentListTextView}>
                <Image source={Icons.News.Repayment} style={styles.iconStyle2} />
                <Text style={styles.blackText}>还款名单</Text>
              </View>
              <View style={styles.tableHeader}>
                <Text>借款人</Text>
                <Text>借款时间</Text>
                <Text>借款金额</Text>
                <Text>还款金额</Text>
              </View>
              {
                [1, 2, 3, 4, 5, 6, 7].map(ite => {
                  return <this.renderItem key={ite} />
                })
              }
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    position: 'relative'
  },
  searchView: {
    paddingHorizontal: ScreenUtils.scaleSize(15),
    backgroundColor: 'rgba(82, 108, 221, 1)',
    paddingBottom: ScreenUtils.scaleSize(10)
  },
  contentView: {
    padding: ScreenUtils.scaleSize(15),
  },
  whiteView: {
    padding: ScreenUtils.scaleSize(10),
    borderRadius: ScreenUtils.scaleSize(5),
    backgroundColor: '#fff',
    marginBottom: ScreenUtils.scaleSize(10)
  },
  repayAmountView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: ScreenUtils.scaleSize(7),
    marginBottom: ScreenUtils.scaleSize(10)
  },
  amountText: {
    color: '#030014',
    fontSize: ScreenUtils.scaleSize(25),
    fontWeight: 'bold',
  },
  grayText: {
    color: '#A8A8AC',
    fontSize: ScreenUtils.scaleSize(12),
  },
  grayView: {
    color: '#F3F5F7',
    padding: ScreenUtils.scaleSize(12),
    borderRadius: ScreenUtils.scaleSize(2),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F5F7'
  },
  iconStyle: {
    width: ScreenUtils.scaleSize(15),
    height: ScreenUtils.scaleSize(15),
    marginRight: ScreenUtils.scaleSize(6),
    marginTop: ScreenUtils.scaleSize(1)
  },
  iconStyle2: {
    width: ScreenUtils.scaleSize(22),
    height: ScreenUtils.scaleSize(22),
    marginRight: ScreenUtils.scaleSize(3),
  },
  diagual: {
    marginHorizontal: ScreenUtils.scaleSize(20),
    borderLeftColor: '#E4E7EB',
    borderLeftWidth: 1,
    height: ScreenUtils.scaleSize(15)
  },
  blackText: {
    color: '#030014',
    fontSize: ScreenUtils.scaleSize(12),
    fontWeight: 'bold',
  },
  paymentListTextView: {
    flexDirection: 'row',
    marginBottom: ScreenUtils.scaleSize(10),
    alignItems: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    padding: ScreenUtils.scaleSize(15),
    backgroundColor: '#F3F5F7',
    justifyContent: 'space-between',
  },
  itemView: {
    flexDirection: 'row',
    padding: ScreenUtils.scaleSize(15),
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E7EBEF',
    borderStyle: 'dashed',
    marginHorizontal: ScreenUtils.scaleSize(10)
  },
  itemText: {
    color: '#545468',
    fontSize: ScreenUtils.scaleSize(12),
  },
})

