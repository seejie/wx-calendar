//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    firstDay: new Date().getTime(),
    lastDay: new Date().getTime(),
    today: new Date().getTime(), 
    formatter: day => day,

    switchTitle1: '年假',
    switchTitle2: '事假',
    itemTitle: '筛选',
    switch1: true,
    switch2: true,

    showPopup: false,
    showDatePopup: false,

    currentDate: new Date().getTime(),
    currYearAndMonth: '',
    minDate: new Date(2016,1,1).getTime()
  },
  onLoad: function () {
    this.initDate()
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
    const arr = ['迟到', '早退', '事假', '病假']

    if (i > 60 && i <= 70) day.bottomInfo = arr[0]
    else if (i > 70 && i <= 80) day.bottomInfo = arr[1]
    else if (i > 80 && i <= 90) day.bottomInfo = arr[2]
    else if (i > 90 && i <= 100) day.bottomInfo = arr[3]
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
      currYearAndMonth: currY + '-' + month,
      formatter: day => this.formatter(day)
    })
  },
  onchangeDate () {
    this.setData({ showDatePopup: true })
  },
  onDatePopupClose () {
    this.setData({ showDatePopup: false })
  },
  onchangePerson (n) {
    
  },
  onPopupClose () {
    this.setData({ showPopup: false })
  },
  oncancelDatePicker () {
    this.onDatePopupClose()
  },
  onconfirmDatePiker ({detail}) {
    this.initDate(detail)
    this.onDatePopupClose()
  },
  getCurrMonth () {
    return '2020-10'
  },
  onfilter () {
    this.setData({ showPopup: true })
  }
})
