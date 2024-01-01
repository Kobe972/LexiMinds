Page({

  data: {
    appIcon: 'https://testchu-7gy8occc8dcc14c3-1304825656.tcloudbaseapp.com/platform-console/assets/favicon.svg',
    appName: 'LexiMinds',
    checkedAgree: false,
    loginSuccess: false, // 标记是否登录成功
  },

  /**
   * 退出页面时触发基础库回调，由基础库内部处理系统登录态。
   */
  onUnload() {
    const eventChannel = this.getOpenerEventChannel();
    if (eventChannel) {
      eventChannel.emit('__donutLogin__', { success: this.data.loginSuccess });
    }
  },

  /**
   * 触发小程序登录，登录成功后自动退出页面
   */
  onTapWeixinMiniProgramLogin() {
    wx.weixinMiniProgramLogin({
      success: () => {
        this.setData({ loginSuccess: true });
        wx.navigateBack();
      },
      fail: (res) => {
        wx.showToast({
          title: '小程序登录失败',
          icon: 'none'
        });
        console.log('登录失败！' + res.errMsg);
      }
    })
  },

  onCheckboxChange() {
    this.setData({ checkedAgree: !this.data.checkedAgree });
  },

  /**
   * 
   * 使用单独的 webview 页面展示用户协议
   */
  onShowAgreement(e) {
    const urls = [
      'link1',
      'link2'
    ];
    const url = urls[e.target.dataset.idx];
    // wx.navigateTo({
    //   url: `/pages/webview/index?url=${url}`,
    // });
  },
})