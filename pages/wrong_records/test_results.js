// pages/wrong_records/test_results.js
const config = require('../../utils/config.js');
const md5 = require('blueimp-md5');
import Dialog from '../../vant-weapp/dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordItems: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({recordItems: JSON.parse(options.recordItems)});
    let count = 0
    for(var i = 0; i < this.data.recordItems.length; i++)
    {
      if(this.data.recordItems[i].answer != this.data.recordItems[i].truth) count++;
    }
    this.setData({count: count});
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
    this.onLoad();
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

  navigateToDetails: function(e){
    const wordId = e.currentTarget.dataset.wordid;
    wx.navigateTo({
      url: `/pages/wrong_records/record_detail?wordId=${wordId}&hide_enabled=${true}`,
    });
  }
})