// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate);
    });

    updateManager.onUpdateReady(function () {
      updateManager.applyUpdate();
    });
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
