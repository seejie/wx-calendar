//index.js
//获取应用实例
const app = getApp()
import { staffList, minDate, maxDate, schedules } from '../mock'
import { api } from '../api'
import { post } from '../http'
import { deepCopy } from '../utils'

Page({
  data: {
    activeTab: 'calendar',
    user: {
      name: '1',
      id: '2',
      posi: '3',
      sys: '4',
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

    level1: [],
    level2: [],
    level1Back: [],
    level2Back: [],
    schedules: [],
  },
  onLoad () {
    this.userLogin()
    this.initDate()
    this.getStaffLst()
    this.getSchedules()
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
        console.log(res, 111)
      }
    })
    this.getData()
    this.getSubData()
  },
  getData () {
    const month = '2021-04'
    const code = 'C002551'

    post({
      url: api.LoadCalendar + `?month=${month}&userCode=${code}`,
      success: res => {
        console.log(res, 22)
      }
    })
  },
  getSubData () {
    const month = '2021-04'
    const code = 'C002551'

    post({
      url: api.LoadSubCalendar + `?month=${month}&userCode=${code}`,
      success: res => {
        console.log(res, 33)
      }
    })
  },
  onTagSelected ({ target: { id }, detail }) {
    const arr = this.data[id]
    const idx = arr.findIndex(el => el.id === detail)
    arr[idx].selected = !arr[idx].selected
  
    this.setData({ [id]: arr })
  },
  onSelect ({ detail }) {
    this.setData({ today: new Date(detail).getTime() })
    this.initEventList()
  },
  // 自定义过滤器
  formatter (day) {
    const curr = day.date
    const date = curr.getDate()

    day.text = day.text === new Date().getDate() ? '今天' : day.text

    const { schedules, yearMonth, level1, level2 } = this.data
    const YMStr = yearMonth.replace('-', '')
    const events = schedules.filter(el => el.YMonth === YMStr)
    const staffs = level1.concat(level2).filter(el => el.selected).map(el => el.id)

    if (!staffs) return day
    let sDate = false, eDate = false, mDate = false
    const item = events.filter(el => {
      const { eventstart, eventend } = el
      const start = eventstart.replace(YMStr, '') * 1
      const end = eventend.replace(YMStr, '') * 1
      sDate = start === date
      eDate = end === date
      mDate = (start < date) && (date < end)
      if (sDate || eDate || mDate) return el
    })

    let tag
    if (staffs.length === 1) {
      item[0] && (day.bottomInfo = item[0].event)
      tag = `${sDate ? 'sDate ' : ''}${eDate ? 'eDate ' : ''}${mDate ? 'mDate ' : ''}`.trim()
      tag && console.log(tag, '-----tag-----')
    } else {
      const len = item.length
      if (!len) return day
      // const 
      day.topInfo = len === 1 ? item[0].event : ''
      day.bottomInfo = len === 1 ? item[0].username : `+ ${len} 更多`
    }

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
    const staffs = staffList
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
  getSchedules () {
    // wx.request({
    //   url: '', 
    //   success (res) {
    //     console.log(res, '-----res-----')
    //   }
    // })
    const { yearMonth, level1, level2 } = this.data
    const staffs = level1.concat(level2)
    const userrange = staffs.find(el => !el.selected) ? ['range'] : ['all']
    const userlist = staffs.filter(el => el.selected).map(el => el.id)

    // if (!userlist.length) return
    
    const params = {
      yearmonth: yearMonth.replace('-', ''),
      userrange,
      userlist
    }

    console.log(params, '-----params-----')
    const events = schedules.filter(el => userlist.includes(el.userid))
    console.log(events, '-----events-----') 
    
    this.setData({ 
      // schedules, 
      schedules: events,
      formatter: day => this.formatter(day)
    })
    this.initEventList()
  },
  initEventList () {
    const { level1, level2, yearMonth, today, schedules } = this.data
    const staffs = level1.concat(level2).filter(el => el.selected)
    const YMStr = yearMonth.replace('-', '')
    const currD = new Date(today).getDate()

    const list = []
    staffs.forEach(el => {
      const arr = schedules.filter(obj => obj.userid === el.id)
      console.log(arr, '-----arr-----')
      if (!arr.length) return
      arr.forEach(obj => {
        const { eventstart, eventend, event, username} = obj
        const start = eventstart.replace(YMStr, '') * 1
        const end = eventend.replace(YMStr, '') * 1
        const inRange = start <= currD && currD <= end
        const sameday = start === currD && currD === end
        
        if (!inRange && !sameday) return
        list.push({
          name: username,
          type: event,
          // val: '11',
          // note: '备注。。。'
        })
      })
    })

  },
  // 切换日历和我标签页
  onTabChange ({detail}) {
    this.setData({ activeTab: detail })
  },
  // 我的日程
  myData () {

  },
  // 申请
  apply () {
    wx.navigateTo({
      url: '/pages/apply/index',
    })
  }
})
