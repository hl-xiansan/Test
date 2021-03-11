
// 评价列表
export type AssessList_Staff = {
    id: number //评价id
    customer_id: number //企业id
    customer_name: string // 企业名
    name: string // 职位
    staff_id: string // 驻场人员id
    staff_name: string // 驻场人员
    employee_id: number // 雇员id
    employee_name: string // 雇员名
    server: number // 服务
    attitude: number // 态度
    ability: number // 能力
    result: '0' | '1' | '2' // 结果
    content: string // 内容
    creator: number // 创建者id
    create_time: string // 创建时间
    modifier: number // 修改者
    modify_time: string // 修改时间
}
