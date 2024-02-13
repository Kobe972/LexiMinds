// pages/resources/resour.js
const config = require('../../utils/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resources: [],
    active: 0,
    search: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    wx.request({
      url: `${config.serverRoot}/getOfficialResources?offset=0&limit=10&search=${this.data.search}`,
      success: function(res) {
        that.setData({resources: res.data});
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
    let that = this;
    if(this.data.active == 0)
    {
      wx.request({
        url: `${config.serverRoot}/getOfficialResources?offset=${this.data.resources.length}&limit=10&search=${this.data.search}`,
        success: function(res) {
          that.data.resources = that.data.resources.concat(res.data);
          that.setData({resources: that.data.resources});
        }
      });
    }
    else
    {
      wx.request({
        url: `${config.serverRoot}/getUserResources?offset=${this.data.resources.length}&limit=10&search=${this.data.search}`,
        success: function(res) {
          that.data.resources = that.data.resources.concat(res.data);
          that.setData({resources: that.data.resources});
        }
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  onChange(e) {
    this.setData({
      search: e.detail,
    });
  },

  onSearch: function() {
    let that = this;
    if(this.data.active == 0)
    {
      wx.request({
        url: `${config.serverRoot}/getOfficialResources?offset=0&limit=10&search=${this.data.search}`,
        success: function(res) {
          that.setData({resources: res.data});
        }
      });
    }
    else
    {
      wx.request({
        url: `${config.serverRoot}/getUserResources?offset=0&limit=10&search=${this.data.search}`,
        success: function(res) {
          that.setData({resources: res.data});
        }
      });
    }
  },

  onTabChange: function(event) {
    let that = this;
    this.setData({active: event.detail.name});
    if(this.data.active == 0)
    {
      wx.request({
        url: `${config.serverRoot}/getOfficialResources?offset=0&limit=10&search=${this.data.search}`,
        success: function(res) {
          that.setData({resources: res.data});
        }
      });
    }
    else
    {
      wx.request({
        url: `${config.serverRoot}/getUserResources?offset=0&limit=10&search=${this.data.search}`,
        success: function(res) {
          that.setData({resources: res.data});
        }
      });
    }
  },

  navigateToResourceDetail: function(event) {
    const resourceId = event.currentTarget.dataset.resourceid;
    wx.navigateTo({
      url: `/pages/resources/resource_detail?resourceId=${resourceId}`,
    });
  }
})