// pages/settings/information/information.js
const config = require('../../../utils/config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: "",
    phoneNumber: "",
    avatarUrl: "",
    avatarUrl_converted: "",
    code: "",
    SMSButtonText: "发送验证码",
    SMSButtonDisabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    wx.request({
      url: `${config.serverRoot}/getUserInfo?openid=${wx.getStorageSync('user').openid}`,
      success: function(res){
        let avatarUrl = res.data[0].avatarUrl;
        if(avatarUrl[0] == '/') avatarUrl = config.serverRoot + avatarUrl;
        that.setData({avatarUrl: avatarUrl});
        that.setData({avatarUrl_converted: avatarUrl});
        that.setData({nickName: res.data[0].nickName});
        that.setData({phoneNumber: res.data[0].phone});
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  onChooseAvatar: function(e){
    this.setData({avatarUrl: e.detail.avatarUrl});
    let that = this;
    wx.uploadFile({
      url: `${config.serverRoot}/uploadAvatar`, //仅为示例，非真实的接口地址
      filePath: e.detail.avatarUrl,
      name: "file",	//自定义name
      formData: {openid: wx.getStorageSync('user').openid},
      success: function(res){
        that.setData({avatarUrl_converted: res.data})
      }
    })
  },

  getNickName: function(e){
    this.setData({nickName: e.detail.value});
  },

  getPhoneNumber: function(e){
    this.setData({phoneNumber: e.detail.value});
  },

  getSMSCode: function(e){
    this.setData({code: e.detail.value});
  },

  sendSMSCode: function(){
    if(this.data.phoneNumber.length == 11)
    {
      let openid = wx.getStorageSync('user').openid;
      let that = this;
      wx.request({
        url: `${config.serverRoot}/sendSMSCode`,
        method: 'POST',
        data: {openid: openid, phone: this.data.phoneNumber},
        success: function(res){
          if(res.data.body.code == "OK")
          {
            that.setData({SMSButtonDisabled: true});
            let timer = setInterval(()=>{that.countDown();}, 1000);
            that.setData({timer: timer});
            that.setData({countdown: 60});
            wx.showToast({
              title: '验证码发送成功！',
              icon: 'success',
              duration: 2000,
              mask: true
            });
          }
          else if(res.data.body.code == "isv.BUSINESS_LIMIT_CONTROL")
          {
            wx.showToast({
              title: '频率过高',
              icon: 'error',
              duration: 2000,
              mask: true
            });
          }
          else
          {
            wx.showToast({
              title: '发送失败',
              icon: 'error',
              duration: 2000,
              mask: true
            });
          }
        },
        fail: function(res){
          wx.showToast({
            title: '请检查网络连接',
            icon: 'error',
            duration: 2000,
            mask: true
          });
        }
      })
    }
  },

  countDown: function()
  {
    this.setData({countdown: this.data.countdown - 1});
    this.setData({SMSButtonText: "剩余"+this.data.countdown+"s"});
    if(this.data.countdown <= 0)
    {
      this.setData({SMSButtonText: "发送验证码"});
      this.setData({SMSButtonDisabled: false});
      clearInterval(this.data.timer);
    }
  },

  onSave: function()
  {
    let that = this;
    wx.request({
      url: `${config.serverRoot}/updateUserInfo`,
      method: 'POST',
      data: {uid: wx.getStorageSync('user').openid, avatarUrl: this.data.avatarUrl_converted, nickName: this.data.nickName, phone: this.data.phoneNumber, code: this.data.code},
      success: function(res){
        wx.navigateBack();
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000,
          mask: true
        });
      },
      fail: function(res){
        wx.showToast({
          title: '保存失败',
          icon: 'error',
          duration: 2000,
          mask: true
        });
      }
    })
  }
})