// pages/my/my.js
const config = require('../../utils/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {text:'学习记录', icon:'/images/document.png'},
      {text:'测评记录', icon:'/images/document_edit.png'},
      {text:'错题集', icon:'/images/notice.png'}
    ],
    nickName: "",
    phoneNumber: "",
    avatarUrl: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    wx.request({
      url: `${config.serverRoot}/getUserInfo?openid=${wx.getStorageSync('user').openid}`,
      success: function(res){
        if(res.data.length > 0)
        {
          let avatarUrl = res.data[0].avatarUrl;
          if(avatarUrl[0] == '/') avatarUrl = config.serverRoot + avatarUrl;
          let nickName = res.data[0].nickName;
          if(nickName == "") nickName = "暂无";
          let phoneNumber = res.data[0].phone;
          if(phoneNumber == "") phoneNumber = "暂无";
          that.setData({avatarUrl: avatarUrl});
          that.setData({nickName: nickName});
          that.setData({phoneNumber: phoneNumber});
        }
      }
    });
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

  navigateToSettings: function()
  {
    wx.navigateTo({
      url: '/pages/settings/settings',
    });
  }
})