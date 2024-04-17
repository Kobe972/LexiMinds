// pages/learn/learn.js
const config = require('../../utils/config.js');
const md5 = require('blueimp-md5');
const audio = wx.createInnerAudioContext();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverRoot: config.serverRoot,
    is_favored: false,
    notes: "",
    show_edit_note: false,
    show_detail: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({index: 0, chapterId: options.chapterId});
    this.getWordList();
    let sign = md5("setClockIn" + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/setClockIn`,
      method: "POST",
      data: {uid: wx.getStorageSync('user').openid, sign: sign}
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
    let sign = md5("getWordsByChapterId" + this.data.chapterId + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/getWordsByChapterId?chapterId=${this.data.chapterId}&uid=${wx.getStorageSync('user').openid}&sign=${sign}`, // Replace with your actual endpoint
      method: 'GET',
      success: function (res) {
        console.log(res.data);

        // Update the data with the retrieved book list
        that.setData({
          wordList: res.data,
        });

        that.getWordMarks();
        that.play_audio();
      },
      fail: function (err) {
        // Handle the failure
        console.error('Failed to get chapter list', err);
      },
    });
  },

  next: function()
  {
    let sign = md5("insertLearningOrReviewRecord"  +this.data.wordList[this.data.index].id + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/insertLearningOrReviewRecord`,
      method: 'POST',
      data: {uid: wx.getStorageSync('user').openid, content_id: this.data.wordList[this.data.index].id, sign: sign}
    });
    if(this.data.index < this.data.wordList.length - 1)
    {
      this.setData({index: this.data.index + 1});
    }
    this.getWordMarks();
    this.play_audio();
  },

  prev: function()
  {
    if(this.data.index > 0)
    {
      this.setData({index: this.data.index - 1});
    }
    this.getWordMarks();
    this.play_audio();
  },

  play_audio: function()
  {
    audio.stop();
    const URL = "https://dict.youdao.com/dictvoice?audio=" + this.data.wordList[this.data.index].english + "&type=2";
    audio.src = URL;
    audio.play();
  },

  finish: function()
  {
    let sign = md5("insertLearningOrReviewRecord"  +this.data.wordList[this.data.index].id + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/insertLearningOrReviewRecord`,
      method: 'POST',
      data: {uid: wx.getStorageSync('user').openid, content_id: this.data.wordList[this.data.index].id, sign: sign}
    });
    wx.navigateBack();
  },

  getWordMarks: function()
  {
    let that = this;
    let sign = md5("getWordMarkByContentId"  +this.data.wordList[this.data.index].id + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/getWordMarkByContentId?uid=${wx.getStorageSync('user').openid}&content_id=${this.data.wordList[this.data.index].id}&sign=${sign}`,
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
    let sign = md5("updateWordMarkByContentId" + this.data.wordList[this.data.index].id + "favor" + wx.getStorageSync('user').openid + this.data.is_favored + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/updateWordMarkByContentId`,
      method: 'POST',
      data: {uid: wx.getStorageSync('user').openid, content_id: this.data.wordList[this.data.index].id, type: "favor", value: this.data.is_favored, sign: sign}
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
    let sign = md5("updateWordMarkByContentId"  +this.data.wordList[this.data.index].id + "note" + wx.getStorageSync('user').openid + this.data.notes + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/updateWordMarkByContentId`,
      method: 'POST',
      data: {uid: wx.getStorageSync('user').openid, content_id: this.data.wordList[this.data.index].id, type: "note", value: this.data.notes, sign: sign}
    });
  },

  onChangeSwitch: function({ detail }) {
    this.setData({show_detail: detail})
  },

  handleTouchstart: function(e)
  {
    this.setData({beginX: e.changedTouches[0].screenX});
    this.setData({beginY: e.changedTouches[0].screenY});
    this.setData({endX: e.changedTouches[0].screenX});
    this.setData({endY: e.changedTouches[0].screenY});
  },

  handleTouchmove: function(e) {
    this.setData({endX: e.changedTouches[0].screenX});
    this.setData({endY: e.changedTouches[0].screenY});
  },

  handleTouchend: function(e) {
    let dx = this.data.endX - this.data.beginX;
    let dy = this.data.endY - this.data.beginY;
    if(Math.abs(dx) - Math.abs(dy) > 50)
    {
      if(dx > 0) this.prev();
      else this.next();
    }
  }
})