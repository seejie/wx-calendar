export const deepCopy = obj => JSON.parse(JSON.stringify(obj))

export const toast = title => {
  wx.showToast({
    title,
    icon: 'none',
    duration: 2000
  })
}
