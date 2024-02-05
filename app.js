// app.js
const config = require('./utils/config.js');
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
  },
  globalData: {
    userInfo: null
  },
  onShareAppMessage() {
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title: 'LexiMinds：更快地背单词！'
        })
      }, 2000)
    })
    return {
      title: 'LexiMinds：更快地背单词！',
      path: '/page/index',
      promise 
    }
  }
})
