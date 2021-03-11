import Icons from '../../../Icons'

export const LOAN_STATUS_MAP = {
  '0': '待审核',
  '5': '同意借款',
  '6': '不同意借款',
  '7': '驳回',
  '10': '同意修改',
  '11': '不同意修改',
  '15': '待还款',
  '16': '拒绝转账',
  '20': '已还款',
}
export const LOAN_STATUS_ICON_MAP = {
  '0': Icons.Apply.RoundRectangle,
  '5': Icons.Apply.GreenRectangle,
  '6': Icons.Apply.OrangeRectangle,
  '7': Icons.Apply.OrangeRectangle,
  '10': Icons.Apply.GreenRectangle,
  '11': Icons.Apply.OrangeRectangle,
  '15': Icons.Apply.RoundRectangle,
  '16': Icons.Apply.GreenRectangle,
  '20': Icons.Apply.GreenRectangle,
}


export const ASSESS_STATUS_MAP = {
  '0': '中评',
  '1': '好评',
  '2': '差评',
}
export const ASSESS_STATUS_ICON_MAP = {
  '0': Icons.Apply.RoundRectangle,
  '1': Icons.Apply.GreenRectangle,
  '2': Icons.Apply.OrangeRectangle,
}