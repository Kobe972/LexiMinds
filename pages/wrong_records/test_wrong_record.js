// pages/wrong_records/test_wrong_record.js
const config = require('../../utils/config.js');
const md5 = require('blueimp-md5');
const audio = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverRoot: config.serverRoot,
    dictation: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({index: 0, chapterId: options.chapterId});
    this.getChoices();
    let sign = md5("setClockIn" + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/setClockIn`,
      method: "POST",
      data: {uid: wx.getStorageSync('user').openid, sign: sign}
    });
    wx.enableAlertBeforeUnload({message: "当前单据有未保存的数据，是否返回"});
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
    let sign = md5("getWrongRecordTestChoices" + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/getWrongRecordTestChoices?uid=${wx.getStorageSync('user').openid}&sign=${sign}`, // Replace with your actual endpoint
      method: 'GET',
      success: function (res) {
        wx.hideLoading();
        // Update the data with the retrieved book list
        for(var i = 0; i < res.data.length; i++)
        {
          res.data[i].answer = 'undefined';
        }
        that.setData({
          problemList: res.data,
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
    let that = this;
    let correct = 0;
    let success = true;
    for(let i = 0; i < this.data.problemList.length; i++)
    {
      if(this.data.problemList[i].truth == this.data.problemList[i].answer) correct++;
    }
    wx.showModal({
      title: '测试结果',
      content: '正确数：' + correct + '/' + this.data.problemList.length + '\n正确率：'  + (correct / this.data.problemList.length*100).toFixed(1) + "%",
      showCancel:false,
      complete: (res) => {
        wx.disableAlertBeforeUnload();
        if(success) wx.redirectTo({
          url: `/pages/wrong_records/test_results?recordItems=${JSON.stringify(that.data.problemList)}`
        });
      }
    })
  },

  set_answer: function(e)
  {
    const value = e.detail.value;
    this.data.problemList[this.data.index].answer = value;
    this.setData({'problemList': this.data.problemList});
  },

  onChangeSwitch: function({ detail }) {
    this.setData({dictation: detail})
  }
})