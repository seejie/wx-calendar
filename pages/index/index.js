//index.js
//获取应用实例
const app = getApp()
import { minDate, maxDate } from '../mock'
import { api } from '../api'
import { post } from '../http'

Page({
  data: {
    activeTab: 'calendar',
    user: {
      name: '',
      id: '',
      posi: '',
      sys: '',
    },

    firstDay: new Date().getTime(),
    lastDay: new Date().getTime(),
    today: new Date().getTime(), 
    formatter: day => day,

    showPopup: false,
    showDatePopup: false,

    currDate: new Date().getTime(),
    yearMonth: '',
    minDate,
    maxDate,

    schedules: [],
    subordinates: []
  },
  onLoad () {
    this.userLogin()
    this.initDate()
  },
  userLogin () {
    wx.showLoading({ mask: true })
    wx.login({
      success: res => {
        this.login(res.code)
      },
      fail: res => {
        console.log('用户登录失败：', res)
      },
      complete() {
        wx.hideLoading()
      }
    })
  },
  login (code) {
    post({
      url: api.WXLogin + code,
      success: res => {
        // console.log(res, 111)
      }
    })
    this.myData()
    this.getSubData()
  },
  getSubData () {
    const month = '2021-04'
    const code = 'C002551'

    post({
      url: api.LoadSubCalendar + `?month=${month}&userCode=${code}`,
      success: res => {
        const arr = []
        res.forEach(el => {
          el.SubCalendar.forEach(item => {
            const exist = arr.find(obj => obj.UserId === item.UserId)
            if (exist) return
            arr.push(item)
          })
        })
        // console.log(arr)
        this.setData({
          subordinates: arr
        })
      }
    })
  },
  onTagSelected ({ detail }) {
    const arr = this.data.subordinates
    const curr = arr.find(el => el.UserId === detail)

    arr.forEach(el => {
      el.selected = el.UserId === detail
    })
    console.log(curr.Calendar)
    this.setData({ 
      subordinates: arr,
      showPopup: false,
      schedules: curr ? curr.Calendar : this.data.schedules
    })
  },
  onSelect ({ detail }) {
    this.setData({ today: new Date(detail).getTime() })
  },
  // 自定义过滤器
  formatter (day) {
    const { schedules } = this.data
    schedules.forEach(el => {
      const {EndDate, StartDate, Source} = el
      const eDate = new Date(EndDate.substr(0, 10)).getTime()
      const sDate = new Date(StartDate.substr(0, 10)).getTime()
      const today = new Date(day.date.format('yyyy-MM-dd')).getTime()
      if (sDate <= today && today <= eDate) {
        if (Source == 1) day.qj = true
        else if (Source == 2) day.cc = true
        else day.wc = true
        day.bottomInfo = true
      }
    })
    
    return day
  },
  // 初始化日期范围
  initDate (date = new Date().getTime()) {
    const now = new Date(date)
    const currY = now.getFullYear()
    const currM = now.getMonth() + 1

    const firstDay = new Date(currY, currM - 1, 1).getTime()
    let last
    if ([1,3,5,7,8,10,12].includes(currM)) {
      last = 31
    } else if ([4,6,9,11].includes(currM)) {
      last = 30
    } else if (currY % 4 === 0) {
      last = 29
    } else {
      last = 28
    }

    const lastDay = new Date(currY, currM - 1, last).getTime()
    const month = currM < 10 ? `0${currM}` : currM

    this.setData({
      firstDay,
      lastDay,
      yearMonth: currY + '-' + month
    })

    Date.prototype.format = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "H+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    }
  },
  onchangeDate () {
    this.setData({ showDatePopup: true })
  },
  onDatePopupClose () {
    this.setData({ showDatePopup: false })
  },
  onPopupClose () {
    this.setData({ showPopup: false })
  },
  onconfirmDatePiker ({ detail }) {
    this.initDate(detail)
    this.onDatePopupClose()
  },
  onfilter () {
    this.setData({ showPopup: true })
  },

  // 切换日历和我标签页
  onTabChange ({detail}) {
    this.setData({ activeTab: detail })
  },
  // 我的日程
  myData () {
    const month = '2021-04'
    const code = 'C002551'

    post({
      url: api.LoadCalendar + `?month=${month}&userCode=${code}`,
      success: res => {
        // console.log(res.ViewList, 22)
        const {UserName, UserCode, Position, Calendar} = res.ViewList
        const arr = this.data.subordinates
        arr.forEach(el => (el.selected = false))

        this.setData({
          schedules: Calendar,
          formatter: day => this.formatter(day),
          subordinates: arr
        })

        wx.getSystemInfo({
          success: res => {
            // console.log(res)
            this.setData({
              user: {
                name: UserName,
                id: UserCode,
                posi: Position,
                sys: res.model + ` ${res.system}`
              }
            })
          }
        })
      }
    })
  },
  // 申请
  apply () {
    wx.navigateTo({
      url: '/pages/apply/index',
    })
  }
})
