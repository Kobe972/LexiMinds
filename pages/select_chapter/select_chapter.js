// pages/select_chapter/select_chapter.js
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
    this.data.bookId = options.bookId;
    this.data.purpose = options.purpose;
    this.getChapterList();
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

  getChapterList: function () {
    var that = this;

    wx.request({
      url: `${config.serverRoot}/getChaptersByBookId?bookId=${this.data.bookId}`, // Replace with your actual endpoint
      method: 'GET',
      success: function (res) {
        // Update the data with the retrieved book list
        that.setData({
          chapterList: res.data,
        });
      },
      fail: function (err) {
        // Handle the failure
        console.error('Failed to get chapter list', err);
      },
    });
  },

  navigateToNextStep: function (event) {
    const chapterId = event.currentTarget.dataset.chapterid;
    if(this.data.purpose == 'learn')
    {
      wx.navigateTo({
        url: `/pages/learn/learn?chapterId=${chapterId}`,
      });
    }
    else if(this.data.purpose == 'dictation')
    {
      wx.navigateTo({
        url: `/pages/dictation/test?chapterId=${chapterId}`,
      });
    }
    else if(this.data.purpose == 'test')
    {
      wx.navigateTo({
        url: `/pages/test/start_test?chapterId=${chapterId}`,
      });
    }
  }
})