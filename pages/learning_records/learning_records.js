// pages/learning_records/learning_records.js
const config = require('../../utils/config.js');
const md5 = require('blueimp-md5');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time_start: "",
    time_end: "",
    resultList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.updateResultData();
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
    this.onLoad(null);
    wx.stopPullDownRefresh();
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

  updateResultData: function(){
    let that = this;
    let sign = md5("getBriefLearningOrReviewRecordItems" + this.data.time_end + this.data.time_start + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/getBriefLearningOrReviewRecordItems?time_start=${this.data.time_start}&time_end=${this.data.time_end}&uid=${wx.getStorageSync('user').openid}&sign=${sign}`,
      success: function(res){
        that.setData({resultList: res.data});
      }
    });
  },

  bindStartDateChange: function(e) {
    this.setData({
      time_start: e.detail.value
    });
    this.updateResultData();
  },

  bindEndDateChange: function(e) {
    this.setData({
      time_end: e.detail.value
    });
    this.updateResultData();
  },

  navigateToRecords: function(e){
    const time = e.currentTarget.dataset.time;
    wx.navigateTo({
      url: `/pages/learning_records/record_details?time=${time}`,
    });
  }
})