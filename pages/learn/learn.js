// pages/learn/learn.js
const config = require('../../utils/config.js');
const audio = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverRoot: config.serverRoot
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({index: 0, chapterId: options.chapterId});
    this.getWordList();
    wx.request({
      url: `${config.serverRoot}/setClockIn`,
      method: "POST",
      data: {uid: wx.getStorageSync('user').openid}
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

  getWordList: function () {
    var that = this;

    wx.request({
      url: `${config.serverRoot}/getWordsByChapterId?chapterId=${this.data.chapterId}`, // Replace with your actual endpoint
      method: 'GET',
      success: function (res) {
        console.log(res.data);

        // Update the data with the retrieved book list
        that.setData({
          wordList: res.data,
        });
      },
      fail: function (err) {
        // Handle the failure
        console.error('Failed to get chapter list', err);
      },
    });
  },

  next: function()
  {
    wx.request({
      url: `${config.serverRoot}/insertLearningOrReviewRecord`,
      method: 'POST',
      data: {uid: wx.getStorageSync('user').openid, word_id: this.data.wordList[this.data.index].id}
    });
    if(this.data.index < this.data.wordList.length - 1)
    {
      this.setData({index: this.data.index + 1});
    }
  },

  prev: function()
  {
    if(this.data.index > 0)
    {
      this.setData({index: this.data.index - 1});
    }
  },

  play_audio: function()
  {
    audio.pause();
    const URL = "https://dict.youdao.com/dictvoice?audio=" + this.data.wordList[this.data.index].english + "&type=2";
    audio.src = URL;
    audio.play();
  },

  finish: function()
  {
    wx.request({
      url: `${config.serverRoot}/insertLearningOrReviewRecord`,
      method: 'POST',
      data: {uid: wx.getStorageSync('user').openid, word_id: this.data.wordList[this.data.index].id}
    });
    wx.navigateBack();
  }
})