// pages/games/vocabulary.js
const config = require('../../utils/config.js');
const md5 = require('blueimp-md5');
const audio = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverRoot: config.serverRoot,
    problemList: [],
    started: 0,
    show_about: false,
    show_statistics: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({index: 0});
    this.getStatistics();
  },

  start: function() {
    this.getChoices();
    wx.enableAlertBeforeUnload({message: "当前单据有未保存的数据，是否返回"});
    this.setData({started: 1});
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

  getChoices: function () {
    var that = this;
    wx.showLoading({  title: '正在生成题目', mask: true})
    let sign = md5("getVocabularyTestChoice" + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/getVocabularyTestChoice?uid=${wx.getStorageSync('user').openid}&sign=${sign}`, // Replace with your actual endpoint
      method: 'GET',
      success: function (res) {
        wx.hideLoading();
        // Update the data with the retrieved book list
        for(var i = 0; i < res.data.length; i++)
        {
          res.data[i].answer = 'undefined';
        }
        that.data.problemList = that.data.problemList.concat(res.data);
        that.setData({
          problemList: that.data.problemList,
        });
        that.play_audio();
      },
      fail: function (err) {
        // Handle the failure
        wx.hideLoading();
        wx.disableAlertBeforeUnload();
        wx.navigateBack();
        wx.showToast({
          title: '题目生成失败',
          icon: 'error',
          duration: 2000,
          mask: true
        });
      },
    });
  },

  next: function()
  {
    if(this.data.index < this.data.problemList.length - 1)
    {
      this.setData({index: this.data.index + 1});
    }
    else if(this.data.index == this.data.problemList.length - 1 && this.data.problemList.length == 50)
    {
      this.setData({index: this.data.index + 1});
      this.getChoices();
    }
    this.play_audio();
  },

  prev: function()
  {
    if(this.data.index > 0)
    {
      this.setData({index: this.data.index - 1});
    }
    this.play_audio();
  },

  play_audio: function()
  {
    audio.pause();
    const URL = "https://dict.youdao.com/dictvoice?audio=" + this.data.problemList[this.data.index].english + "&type=2";
    audio.src = URL;
    audio.play();
  },

  finish: function()
  {
    let correct = 0;
    let success = true;
    for(let i = 0; i < this.data.problemList.length; i++)
    {
      if(this.data.problemList[i].truth == this.data.problemList[i].answer) correct++;
    }
    let vocabulary = Math.floor(correct / 100 * 45816);
    let sign = md5("insertVocabularyTestRecord" + wx.getStorageSync('user').openid + vocabulary + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/insertVocabularyTestRecord`,
      method: 'POST',
      data: {vocabulary: vocabulary, uid: wx.getStorageSync('user').openid, sign: sign},
      fail: function(err){
        success = false;
        wx.showToast({
          title: '结果上传失败',
          icon: 'error',
          duration: 2000,
          mask: true
        });
      }
    });
    wx.showModal({
      title: '测试结果',
      content: '您大约掌握' + vocabulary + '个单词',
      showCancel:false,
      complete: (res) => {
        wx.disableAlertBeforeUnload();
        if(success) wx.navigateBack();
      }
    })
  },

  set_answer: function(e)
  {
    const value = e.detail.value;
    this.data.problemList[this.data.index].answer = value;
    this.setData({'problemList': this.data.problemList});
  },

  show_about: function() {
    this.setData({show_about: true});
  },

  show_statistics: function() {
    this.setData({show_statistics: true});
  },

  onClose: function() {
    this.setData({show_about: false, show_statistics: false});
  },

  getStatistics: function() {
    let sign = md5("getVocabularyTestRecordByUid" + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    let that = this;
    wx.request({
      url: `${config.serverRoot}/getVocabularyTestRecordByUid?uid=${wx.getStorageSync('user').openid}&sign=${sign}`,
      method: 'GET',
      success: function(res) {
        if(res.data == null) that.setData({lastRecord: "NAN"});
        else that.setData({lastRecord: res.data});
      }
    });
  }
})