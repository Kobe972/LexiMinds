// pages/learn/learn.js
const config = require('../../utils/config.js');
const audio = wx.createInnerAudioContext();
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
      url: `${config.serverRoot}/getWordsByChapterId?chapterId=${this.data.chapterId}&uid=${wx.getStorageSync('user').openid}`, // Replace with your actual endpoint
      method: 'GET',
      success: function (res) {
        console.log(res.data);

        // Update the data with the retrieved book list
        that.setData({
          wordList: res.data,
        });

        that.getWordMarks();
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
      data: {uid: wx.getStorageSync('user').openid, content_id: this.data.wordList[this.data.index].id}
    });
    if(this.data.index < this.data.wordList.length - 1)
    {
      this.setData({index: this.data.index + 1});
    }
    this.getWordMarks();
  },

  prev: function()
  {
    if(this.data.index > 0)
    {
      this.setData({index: this.data.index - 1});
    }
    this.getWordMarks();
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
      data: {uid: wx.getStorageSync('user').openid, content_id: this.data.wordList[this.data.index].id}
    });
    wx.navigateBack();
  },

  getWordMarks: function()
  {
    let that = this;
    wx.request({
      url: `${config.serverRoot}/getWordMarkByContentId?uid=${wx.getStorageSync('user').openid}&content_id=${this.data.wordList[this.data.index].id}`,
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
    wx.request({
      url: `${config.serverRoot}/updateWordMarkByContentId`,
      method: 'POST',
      data: {uid: wx.getStorageSync('user').openid, content_id: this.data.wordList[this.data.index].id, type: "favor", value: this.data.is_favored}
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
    wx.request({
      url: `${config.serverRoot}/updateWordMarkByContentId`,
      method: 'POST',
      data: {uid: wx.getStorageSync('user').openid, content_id: this.data.wordList[this.data.index].id, type: "note", value: this.data.notes}
    });
  },
})