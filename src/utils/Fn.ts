export function calculateAge(birth: string = ''): number {
  const timestamp = Date.parse(birth)
  if (Object.is(timestamp, NaN)) return 0
  const birthDate = new Date(timestamp)
  const now = new Date()
  let age = now.getFullYear() - birthDate.getFullYear()
  if (now.getMonth() < birthDate.getMonth()) {
    age -= 1
  } else if (now.getMonth() === birthDate.getMonth() && now.getDate() < birthDate.getDate()) {
    age -= 1
  }
  return Math.max(age, 0)
}

export function getStatusCn(status: number | string): string {
  // - 0：正常
  // 					- 1：工作
  // 					- 2：黑名单
  // 					- 3：离职
  return {
    '0': '待处理',
    '1': '在职',
    '2': '黑名单',
    '3': '离职',
  }[status] ?? ''
}
