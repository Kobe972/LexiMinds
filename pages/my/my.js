// pages/my/my.js
const config = require('../../utils/config.js');
const md5 = require('blueimp-md5');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {text:'学习记录', icon:'/images/document.png', action: 'navigateToLearningRecords'},
      {text:'测评记录', icon:'/images/document_edit.png', action: 'navigateToTestResults'},
      {text:'错题集', icon:'/images/notice.png', action: 'navigateToWrongRecords'},
      {text:'我的收藏', icon:'bookmark-o', action: 'navigateToMyFavorite'},
      {text:'我的笔记', icon:'comment-o', action: 'navigateToMyNote'},
      {text:'我的通知', icon:'chat-o', action: 'navigateToMyNotification'},
      {text:'浏览官网', icon:'link-o', action: 'navigateToWebsite'},
      {text:'体验评价', icon:'star-o', action: 'comment'},
      {text:'常见问题', icon:'question-o', action: 'faq'}
    ],
    nickName: "未设置昵称",
    phoneNumber: "未设置手机号",
    avatarUrl: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    let sign = md5("getUserInfo" + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/getUserInfo?openid=${wx.getStorageSync('user').openid}&sign=${sign}`,
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

  onPullDownRefresh: function() {
    this.onLoad(null);
    wx.stopPullDownRefresh();
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
  },

  navigateToTestResults: function()
  {
    wx.navigateTo({
      url: '/pages/test_results/test_results',
    });
  },

  navigateToWrongRecords: function()
  {
    wx.navigateTo({
      url: '/pages/wrong_records/wrong_records',
    });
  },

  navigateToLearningRecords: function()
  {
    wx.navigateTo({
      url: '/pages/learning_records/learning_records',
    });
  },

  navigateToMyFavorite: function()
  {
    wx.navigateTo({
      url: '/pages/my_favorite/my_favorite',
    });
  },

  navigateToMyNote: function()
  {
    wx.navigateTo({
      url: '/pages/my_note/my_note',
    });
  },

  navigateToMyNotification: function()
  {
    wx.navigateTo({
      url: '/pages/my_notification/my_notification',
    });
  },

  navigateToWebsite: function()
  {
    wx.navigateTo({
      url: '/pages/website/website',
    });
  },

  comment: function()
  {
    var plugin = requirePlugin("wxacommentplugin");
    plugin.openComment({
      success: (res)=>{
        console.log('plugin.openComment success', res);
      },
      fail: (res) =>{
        console.log('plugin.openComment fail', res);
      }
    });
  },

  faq: function()
  {
    wx.navigateTo({
      url: '/pages/faq/faq',
    });
  },
})