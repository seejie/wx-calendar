//index.js
//获取应用实例
const app = getApp()
import mock from './mock'
import constant from '../constant/index'
import { deepCopy } from '../utils'

Page({
  data: {
    firstDay: new Date().getTime(),
    lastDay: new Date().getTime(),
    today: new Date().getTime(), 
    formatter: day => day,

    showPopup: false,
    showDatePopup: false,

    currentDate: new Date().getTime(),
    currYearAndMonth: '',
    minDate: new Date(2016,1,1).getTime(),

    types: constant.eventTypes,
    level1: [],
    level2: [],
    level1Back: [],
    level2Back: [],
  },
  onLoad () {
    this.initDate()
    this.getStaffLst()
  },
  onSelect (date) {
    console.log(date)
  },
  // 自定义过滤器
  formatter (day) {
    const {date} = day
    const month = date.getMonth() + 1;
    const num = date.getDate();
    const week = date.getDay()

    if (day.text === new Date().getDate()) {
      day.text = '今天'
    }

    const i = Math.floor(Math.random()*100+1)
    const arr = ['事假', '病假']

    if (i > 60 && i <= 70) day.bottomInfo = arr[0]
    else if (i > 70 && i <= 80) day.bottomInfo = arr[1]
    console.log(1)
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

    const day = new Date(firstDay)
    const lastDay = new Date(currY, currM - 1, last).getTime()
    const month = currM < 10 ? `0${currM}` : currM

    this.setData({
      firstDay,
      lastDay,
      currYearAndMonth: currY + '-' + month
    })
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
  // oncancelDatePicker () {
  //   this.onDatePopupClose()
  // },
  onconfirmDatePiker ({ detail }) {
    this.initDate(detail)
    this.onDatePopupClose()
  },
  onfilter () {
    this.setData({ showPopup: true })
  },
  // 取消筛选
  oncancelFilter () {
    this.onPopupClose()
    const { level1Back, level2Back } = this.data
    this.setData({
      level1: deepCopy(level1Back),
      level2: deepCopy(level2Back)
    })
  },
  // 确认筛选
  onconfirmFilter () {
    this.onPopupClose()
    const { level1, level2 } = this.data
    this.setData({
      level1Back: deepCopy(level1),
      level2Back: deepCopy(level2)
    })
    this.getSchedules()
  },
  getStaffLst () {
    // wx.request({
    //   url: '', 
    //   success (res) {
    //     console.log(res, '-----res-----')
    //   }
    // })
    const staffs = mock.staffList
    console.log(staffs, '-----staffs-----')
    let level1 = [], level2 = []
    staffs.forEach(el => {
      const { userid, username, level } = el
      const obj = {
        id: userid,
        val: username,
        selected: false
      }

      if (level === 1) level1.push(obj)
      else level2.push(obj)
    })

    this.setData({
      level1, 
      level2,
      level1Back: deepCopy(level1),
      level2Back: deepCopy(level2)
    })
  },
  onTagSelected ({ target: { id }, detail }) {
    const arr = this.data[id]
    const idx = arr.findIndex(el => el.id === detail)
    arr[idx].selected = !arr[idx].selected

    this.setData({
      [id]: arr
    })
  },
  getSchedules () {
    // wx.request({
    //   url: '', 
    //   success (res) {
    //     console.log(res, '-----res-----')
    //   }
    // })
    const { currYearAndMonth, types, level1, level2 } = this.data
    const eventlist = types.filter(el => el.selected).map(el => el.val)
    const eventrange = eventlist.length === types.length ? ['all'] : ['range']
    const staffs = level1.concat(level2)
    const userrange = staffs.find(el => !el.selected) ? ['range'] : ['all']
    const userlist = staffs.filter(el => el.selected).map(el => el.id)

    if (!userlist.length) return
    
    const params = {
      yearmonth: currYearAndMonth.replace('-', ''),
      userrange,
      userlist,
      eventrange,
      eventlist
    }

    console.log(params, '-----params-----')
  }
})
