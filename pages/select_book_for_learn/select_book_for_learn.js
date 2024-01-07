// pages/select_book_for_learn/select_book_for_learn.js
const config = require('../../utils/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commonBookList: [],
    privateBookList: [],
    serverRoot: config.serverRoot
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getcommonBookList();
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

  getcommonBookList: function () {
    var that = this;

    wx.request({
      url: `${config.serverRoot}/getCommonBooks`, // Replace with your actual endpoint
      method: 'GET',
      success: function (res) {

        // Update the data with the retrieved book list
        that.setData({
          commonBookList: res.data,
        });
      },
      fail: function (err) {
        // Handle the failure
        console.error('Failed to get book list', err);
      },
    });
    wx.request({
      url: `${config.serverRoot}/getPrivateBooks?uid=${wx.getStorageSync('user').openid}`, // Replace with your actual endpoint
      method: 'GET',
      success: function (res) {

        // Update the data with the retrieved book list
        that.setData({
          privateBookList: res.data,
        });
      },
      fail: function (err) {
        // Handle the failure
        console.error('Failed to get book list', err);
      },
    });
  },

  navigateToSelectChapter: function (event) {
    const bookId = event.currentTarget.dataset.bookid;
    const purpose = event.currentTarget.dataset.purpose;

    wx.navigateTo({
      url: `/pages/select_chapter/select_chapter?bookId=${bookId}&purpose=${purpose}`,
    });
  }
})