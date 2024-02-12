// pages/learning_records/record_details.js
const config = require('../../utils/config.js');
const md5 = require('blueimp-md5');
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
    this.onLoad({time: this.data.time});
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

  loadRecordItems: function(){
    let that = this;
    let sign = md5("getLearnedWordsByTime" + this.data.time + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/getLearnedWordsByTime?time=${this.data.time}&uid=${wx.getStorageSync('user').openid}&sign=${sign}`,
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
    sign = md5("getReviewedWordsByTime" + this.data.time + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/getReviewedWordsByTime?time=${this.data.time}&uid=${wx.getStorageSync('user').openid}&sign=${sign}`,
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
    const chapterId = e.currentTarget.dataset.chapterid;
    let contentId = -1;
    wx.request({
      url: `${config.serverRoot}/getBookContentIdByWordIdAndChapterId?wordId=${wordId}&chapterId=${chapterId}`,
      success: function(res) {
        contentId = res.data.book_content_id;
        let sign = md5("insertLearningOrReviewRecord"  + contentId + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
        wx.request({
          url: `${config.serverRoot}/insertLearningOrReviewRecord`,
          method: 'POST',
          data: {uid: wx.getStorageSync('user').openid, content_id: contentId, sign: sign}
        });
      }
    });
    wx.navigateTo({
      url: `/pages/single_word/single_word?wordId=${wordId}&chapterId=${chapterId}`,
    });
  }
})