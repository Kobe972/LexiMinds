// pages/single_word/single_word.js
const config = require('../../utils/config.js');
const md5 = require('blueimp-md5');
const audio = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverRoot: config.serverRoot,
    is_favored: false,
    notes: "",
    show_edit_note: false
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
        that.getWordMarks();
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
    let sign = md5("getBookNameByChapterId" + this.data.chapterId + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/getBookNameByChapterId?chapter_id=${this.data.chapterId}&uid=${wx.getStorageSync('user').openid}&sign=${sign}`,
      success: function(res){
        if(res.data) that.setData({book_name: res.data});
        else that.setData({book_name: "已删除词书"});
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
    let sign = md5("getChapterNameByChapterId" + this.data.chapterId + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/getChapterNameByChapterId?chapter_id=${this.data.chapterId}&uid=${wx.getStorageSync('user').openid}&sign=${sign}`,
      success: function(res){
        if(res.data) that.setData({chapter_name: res.data});
        else that.setData({chapter_name: "已删除章节"});
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

  getWordMarks: function()
  {
    let that = this;
    let sign = md5("getWordMarkByWordId" + wx.getStorageSync('user').openid + this.data.wordId + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/getWordMarkByWordId?uid=${wx.getStorageSync('user').openid}&word_id=${this.data.wordId}&sign=${sign}`,
      success: function(res){
        let favored = false;
        let notes = "";
        for(var i = 0; i < res.data.length; i++)
        {
          if(res.data[i].type == 'favor' && res.data[i].value == 'true') favored = true;
          if(res.data[i].type == 'note') notes = res.data[i].value;
        }
        that.setData({is_favored: favored, notes: notes});
      }
    })
  },

  change_favor: function()
  {
    this.setData({is_favored: !this.data.is_favored});
    let sign = md5("updateWordMarkByWordId" + "favor" + wx.getStorageSync('user').openid + this.data.is_favored + this.data.wordId + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/updateWordMarkByWordId`,
      method: 'POST',
      data: {uid: wx.getStorageSync('user').openid, word_id: this.data.wordId, type: "favor", value: this.data.is_favored, sign: sign}
    });
  },

  onClickShow() {
    this.setData({ show_edit_note: true });
  },

  onClickHide() {
    this.setData({ show_edit_note: false });
  },

  onNoteChange: function(e){
    this.setData({notes: e.detail});
  },

  change_note: function()
  {
    let sign = md5("updateWordMarkByWordId" + "note" + wx.getStorageSync('user').openid + this.data.notes + this.data.wordId + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/updateWordMarkByWordId`,
      method: 'POST',
      data: {uid: wx.getStorageSync('user').openid, word_id: this.data.wordId, type: "note", value: this.data.notes, sign: sign}
    });
  },
})