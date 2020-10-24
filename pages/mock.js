export const minDate = new Date(2016, 0, 1).getTime()
const year = new Date().getFullYear()
export const maxDate = new Date(year + 3, 11, 1).getTime()

export const staffList = [{
  userid: '20200512', 
  username: '张三',
  level: 1,
  seq: 1
}, {
  userid: '20200514', 
  username: '王五',
  level: 1, 
  seq: 2
}, {
  userid: '20200513', 
  username: '李四',
  level: 2, 
  seq: 3
}, {
  userid: '20200515', 
  username: '赵六',
  level: 1,
  seq: 4
}, {
  userid: '202008', 
  username: 'waefawef',
  level: 1, 
  seq: 5
}, {
  userid: '202009', 
  username: '哇嘎违规',
  level: 2, 
  seq: 6
},{
  userid: '202010', 
  username: '安慰法',
  level: 1,
  seq: 7
}, {
  userid: '202011', 
  username: '发多少',
  level: 1, 
  seq: 8
}, {
  userid: '202012', 
  username: 'asdf',
  level: 2, 
  seq: 9
},{
  userid: '202013', 
  username: '二哥',
  level: 1,
  seq: 10
}, {
  userid: '202014', 
  username: '二哥吃饭',
  level: 1, 
  seq: 11
}, {
  userid: '202015', 
  username: '爱未发生',
  level: 2, 
  seq: 12
},{
  userid: '202016', 
  username: '韦芳',
  level: 1,
  seq: 13
}, {
  userid: '202017', 
  username: '是大V',
  level: 1, 
  seq: 14
}, {
  userid: '202018', 
  username: '阿道夫',
  level: 2, 
  seq: 15
}]

export const schedules = [{
  YMonth: '202010', 
  event: '年假', 
  userid: '20200512', 
  username: '张三', 
  eventstart: '20201005', 
  eventend: '20201007'
}, {
  YMonth: '202010', 
  event: '年假', 
  userid: '20200515', 
  username: '赵六', 
  eventstart: '20201020', 
  eventend: '20201020'
}, {
  YMonth: '202010', 
  event: '事假', 
  userid: '20200514', 
  username: '王五', 
  eventstart: '20201020', 
  eventend: '20201020'
}, {
  YMonth: '202010', 
  event: '事假', 
  userid: '20200513', 
  username: '李四', 
  eventstart: '20201025', 
  eventend: '20201025'
}]
