import React, { Component } from 'react'
import {
	Text,
	StyleSheet,
	Dimensions,
	View,
	ImageBackground,
	TouchableOpacity,
	Button, Image
} from 'react-native'
import ScreenUtil from '../../../utils/ScreenUtils'
import page from '../../../components/Page'
import Icons from '../../../Icons';
import Api from "../../../utils/Api";
import CommonUtils from "../../../utils/CommonUtils";
import moment from "moment";

type Props = {
	navigation: any;
	route: any;
};
type ItemType = {
	title: string;
	value: string;
};
type State = {
	loanDetail:any
}

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

@page({
	navigation: {
		headerShown: false
	}
})

export default class LoanDetailPage1 extends Component<Props> {

	readonly state: State = {
		loanDetail: {}
	}

	toSign = () => {
		this.props.navigation.navigation('');
	}

	componentDidMount() {
		this.props.navigation.setOptions({
			headerLeft: () => <TouchableOpacity activeOpacity={0.6} onPress={() => { this.props.navigation.reset({ index: 0, routes: [{ name: 'Index' }] })}}>
				<Image source={Icons.Public.ReturnIcon} style={{
					height: ScreenUtil.scaleSize(22), width: ScreenUtil.scaleSize(22)
				}}/>
			</TouchableOpacity>
		});

		Api.get<any>('/labor/my/loan/' + this.props.route.params.id).then(res => {
			this.setState({
				loanDetail: res
			})
		})
	}

	render() {
		const loanType:string = this.state.loanDetail.type === 0 ? '银行卡' :
				this.state.loanDetail.type === 1 ? '支付宝' : '现金'

		return (
			<View style={styles.background}>
				<ImageBackground source={require('../../../assets/icons/apply/rectangle.png')} style={styles.topBg}>
					<ProcessView detail={this.state.loanDetail}/>
					<ApplyStatusView detail={this.state.loanDetail}/>
				</ImageBackground>
				<View style={styles.applyInfoView}>
					<TextItem title='借款方式' value={loanType} />
					<TextItem title='编号' value={this.state.loanDetail.employee_name} />
					<TextItem title='申请人' value={this.state.loanDetail.loan_no} />
					<TextItem title='所在单位' value={this.state.loanDetail.customer_name} />
					{
						loanType === '银行卡' ? <TextItem title='银行卡号' value={this.state.loanDetail.bankcard?.bank_account} /> :
								loanType === '支付宝' ? <TextItem title='支付宝账号' value={this.state.loanDetail.account_number} /> : null
					}
					<TextItem title='申请金额（元）' value={Number(this.state.loanDetail.amount)/1000 + ''} />
					<TextItem title='事由' value={this.state.loanDetail.desc} />
				</View>
				<View style={{ flex: 1 }}></View>
			</View>
		)
	}
}

const ProcessView = ({detail}: any) => {
	return (
		<View style={styles.processView}>
			<View style={styles.stepView}>
				<ImageBackground source={Icons.Apply.CircleFill} style={styles.circleBg}>
					<Text>1</Text>
				</ImageBackground>
				<Text style={styles.step1Name}>{detail.employee_name + '-发起申请'}</Text>
				<Text style={styles.step1Time}>{UTCDateFormat(detail.create_time)}</Text>
			</View>
			<View style={styles.centerBar}></View>
			<View style={styles.stepView}>
				<ImageBackground source={Icons.Apply.CircleEmpty} style={styles.circleBg}>
					<Text>2</Text>
				</ImageBackground>
				<Text style={styles.step2Name}>--</Text>
				<Text style={styles.step2Time}>待审批</Text>
			</View>
		</View>
	)
}

const UTCDateFormat = (date:string) => {
	return moment.utc(date).local().format('YYYY-MM-DD HH:MM')
}

const ApplyStatusView = ({detail}: any) => {
	return (
		<View style={styles.applyStatusView}>
			<View style={styles.statusView}>
				<Text style={styles.applyText}>{detail.employee_name + '提交的签约申请'}</Text>
				<ImageBackground source={Icons.Apply.RoundRectangle} style={styles.statusTag}>
					<Text style={styles.tagText}>待处理</Text>
				</ImageBackground>
			</View>
			<Text style={styles.applyDesText}>{detail.customer_name}</Text>
		</View>
	)
}

const TextItem = (props: ItemType) => {
	const { title = '', value = '' } = props;
	return (
		<View style={styles.textItemView}>
			<Text style={styles.nameStyle}>{title}</Text>
			<Text style={styles.valueStyle}>{value}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	background: {
		flex: 1,
		width: width,
		height: height,
		zIndex: 0,
	},
	topBg: {
		width: width,
		height: ScreenUtil.scaleSize(200),
	},
	processView: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		paddingHorizontal: ScreenUtil.scaleSize(60),
		marginTop: ScreenUtil.scaleSize(15),
	},
	stepView: {
		alignItems: 'center'
	},
	circleBg: {
		alignItems: 'center',
		justifyContent: 'center',
		width: ScreenUtil.scaleSize(35),
		height: ScreenUtil.scaleSize(35),
		marginBottom: ScreenUtil.scaleSize(8)
	},
	step1Name: {
		color: '#C9D3FF',
		fontSize: ScreenUtil.scaleSize(12)
	},
	step1Time: {
		color: '#C9D3FF',
		fontSize: ScreenUtil.scaleSize(10)
	},
	step2Name: {
		color: '#fff',
		fontSize: ScreenUtil.scaleSize(12)
	},
	step2Time: {
		color: '#fff',
		fontSize: ScreenUtil.scaleSize(10)
	},
	centerBar: {
		backgroundColor: '#95A8FD',
		height: ScreenUtil.scaleSize(2),
		width: ScreenUtil.scaleSize(68),
	},
	applyStatusView: {
		backgroundColor: '#fff',
		padding: ScreenUtil.scaleSize(15),
		borderRadius: ScreenUtil.scaleSize(5),
		marginTop: ScreenUtil.scaleSize(10),
		marginHorizontal: ScreenUtil.scaleSize(15),
	},
	statusView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: ScreenUtil.scaleSize(10),
	},
	applyText: {
		color: '#030014',
		fontWeight: 'bold',
		fontSize: ScreenUtil.scaleSize(14)
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
	applyDesText: {
		color: '#545468',
		fontSize: ScreenUtil.scaleSize(12),
	},
	applyInfoView: {
		marginHorizontal: ScreenUtil.scaleSize(15),
		borderRadius: ScreenUtil.scaleSize(5),
		backgroundColor: '#fff',
		height: ScreenUtil.scaleSize(330),
		marginTop: -ScreenUtil.scaleSize(15),
	},
	textItemView: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: ScreenUtil.scaleSize(10),
		marginHorizontal: ScreenUtil.scaleSize(15),
		borderBottomWidth: 1,
		borderBottomColor: '#E7EBEF',
		borderStyle: 'dashed',
	},
	nameStyle: {
		color: '#545468',
		fontSize: ScreenUtil.scaleSize(12),
	},
	valueStyle: {
		color: '#030014',
		fontSize: ScreenUtil.scaleSize(12),
	},
	footerView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#fff',
		paddingVertical: ScreenUtil.scaleSize(12),
		paddingHorizontal: ScreenUtil.scaleSize(14),
	},
	loanAmountText: {
		color: '#030014',
		fontSize: ScreenUtil.scaleSize(14),
		fontWeight: 'bold',
		marginBottom:ScreenUtil.scaleSize(3)
	},
	loanInfoText:{
		color:'#545468',
		fontSize:ScreenUtil.scaleSize(12)
	},
	footerBtnView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	footerBtn: {
		alignItems: 'center',
		justifyContent: 'center',
		width: ScreenUtil.scaleSize(70),
		height: ScreenUtil.scaleSize(37),
		borderRadius: ScreenUtil.scaleSize(20),
		backgroundColor: '#FE9B16',
		marginRight: ScreenUtil.scaleSize(10)
	},
	footerBtn1: {
		alignItems: 'center',
		justifyContent: 'center',
		width: ScreenUtil.scaleSize(70),
		height: ScreenUtil.scaleSize(37),
		borderRadius: ScreenUtil.scaleSize(20),
		backgroundColor: '#526CDD',
	},
	footerText: {
		color: '#fff',
		fontSize: ScreenUtil.scaleSize(15)
	}


})
