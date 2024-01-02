// pages/single_word/single_word.js
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
    this.setData({wordId: options.wordId, chapterId: options.chapterId});
    this.getRecordDetail();
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

  getRecordDetail: function(){
    let that = this;
    wx.request({
      url: `${config.serverRoot}/getWordByWordId?word_id=${this.data.wordId}`,
      success: function(res){
        that.setData({recordDetail: res.data});
        if(that.data.chapterId)
        {
          that.getBookName();
          that.getChapterName();
        }
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
  },

  getBookName: function()
  {
    let that = this;
    wx.request({
      url: `${config.serverRoot}/getBookNameByChapterId?chapter_id=${this.data.chapterId}`,
      success: function(res){
        that.setData({book_name: res.data});
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
  },

  getChapterName: function()
  {
    let that = this;
    wx.request({
      url: `${config.serverRoot}/getChapterNameByChapterId?chapter_id=${this.data.chapterId}`,
      success: function(res){
        that.setData({chapter_name: res.data});
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
  },

  play_audio: function()
  {
    audio.pause();
    const URL = "https://dict.youdao.com/dictvoice?audio=" + this.data.recordDetail.english + "&type=2";
    audio.src = URL;
    audio.play();
  },
})