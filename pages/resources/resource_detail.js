// pages/resources/resource_detail.js
const config = require('../../utils/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({resourceId: options.resourceId});
    let that = this;
    wx.request({
      url: `${config.serverRoot}/getResourceById?id=${this.data.resourceId}`,
      success: function(res) {
        that.setData({resource: res.data});
        wx.request({
          url: `${config.serverRoot}/getTeacherNameByPhone?phone=${that.data.resource.uploader}`,
          success: function(res) {
            that.setData({uploader: res.data});
          }
        })
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

  copy: function() {
    wx.setClipboardData({
      data: this.data.resource.link,
      success: function(res) {
        wx.showToast({
          title: '已复制到剪切板'
        });
      },
      fail: function(res) {
        wx.showToast({
          title: '复制失败',
          icon: 'error'
        })
      }
    });
  }
})