// pages/learning_records/record_details.js
const config = require('../../utils/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    learnedRecordItems: [],
    reviewedRecordItems: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({time: options.time});
    this.loadRecordItems();
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

  loadRecordItems: function(){
    let that = this;
    wx.request({
      url: `${config.serverRoot}/getLearnedWordsByTime?time=${this.data.time}&uid=${wx.getStorageSync('user').openid}`,
      success: function(res){
        let learnedRecordItems = res.data;
        for(var i = 0; i < learnedRecordItems.length; i++)
        {
          learnedRecordItems[i].translation.replace("\r\n", "; ");
          learnedRecordItems[i].translation.replace("\n", "; ");
          if(learnedRecordItems[i].translation.length > 11)
          {
            learnedRecordItems[i].translation = learnedRecordItems[i].translation.substring(0, 11) + "...";
          }
        }
        that.setData({learnedRecordItems: learnedRecordItems});
      },
      fail: function(error){
        wx.showToast({
          title: '加载失败',
          icon: 'error',
          duration: 2000,
          mask: true
        });
      }
    });
    wx.request({
      url: `${config.serverRoot}/getReviewedWordsByTime?time=${this.data.time}&uid=${wx.getStorageSync('user').openid}`,
      success: function(res){
        let reviewedRecordItems = res.data;
        for(var i = 0; i < reviewedRecordItems.length; i++)
        {
          reviewedRecordItems[i].translation.replace("\r\n", "; ");
          reviewedRecordItems[i].translation.replace("\n", "; ");
          if(reviewedRecordItems[i].translation.length > 11)
          {
            reviewedRecordItems[i].translation = reviewedRecordItems[i].translation.substring(0, 11) + "...";
          }
        }
        that.setData({reviewedRecordItems: reviewedRecordItems});
      },
      fail: function(error){
        wx.showToast({
          title: '加载失败',
          icon: 'error',
          duration: 2000,
          mask: true
        });
      }
    })
  },

  navigateToDetails: function(e){
    const wordId = e.currentTarget.dataset.wordid;
    wx.navigateTo({
      url: `/pages/single_word/single_word?wordId=${wordId}`,
    });
  }
})