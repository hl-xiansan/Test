class CustomerFilter {
  selectID: any = null
  name: any = null
  callBack: any = []

  action() {
    if (this.callBack && Array.isArray(this.callBack)) {
      this.callBack.map((item) => { item() })
    }
  }
}
export default new CustomerFilter()