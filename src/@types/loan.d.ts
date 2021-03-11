
// 借款列表
export type LoanList_Staff = {
    id: string   //主键
    customer_id: number // 企业id
    customer_name: string // 企业名
    employee_id: number // 雇员id
    employee_name: string//雇员名
    amount: number // 申请金额
    real_amount: number //实际金额
    audit_batch_no: string //审核批次号
    auditor_id: string // 审核人
    loan_batch_no: string // 打款批次号
    payment_id: string // 打款人
    repay_batch_no: string // 还款批次号
    clear_id: string // 清算人
    desc: string // 备注
    status: '0' | '5' | '6' | '7' | '10' | '11' | '15' | '16' // 状态
    creator: string // 创建者id
    create_time: string // 创建时间
    modifier: string // 修改者
    modify_time: string // 修改时间
}

// 借款列表
export type BankList = {
    id: number //很行卡id
    card_owner: string //持卡人
    bank_name: string //银行
    bank_account: string //银行账户
    location: string //开户
    creator: number //创建者id
    create_time: string //创建时间
    modifier: number //修改者
    modify_time: string //修改时间
}
