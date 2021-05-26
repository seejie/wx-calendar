import { maxDate } from '../mock'

Page({
  data: {
    sDate: '',
    eDate: '',
    currDate: new Date().getTime(),
    minDate: new Date().getTime(),
    maxDate,
    showDatePopup: false,
    type: ''
  },

  onSelectDate ({target: {id}}) {
    let minDate
    if (id === 'start') {
      minDate = new Date().getTime()
    } else {
      minDate = new Date(this.data.sDate).getTime()
    }
    this.setData({ 
      showDatePopup: true,
      type: id,
      minDate
    })
  },

  onDatePopupClose () {
    this.setData({ showDatePopup: false })
  },

  onconfirmDatePiker({detail}) {
    const curr = new Date(detail)
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

    if (this.data.type === 'start') {
      this.setData({sDate: curr.format('yyyy-MM-dd')})
    } else {
      this.setData({eDate: curr.format('yyyy-MM-dd')})
    }
    this.onDatePopupClose()
  },

  onInput (b) {
    console.log(b)
  }
})