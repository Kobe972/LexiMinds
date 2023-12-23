// pages/test/start_test.js
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
    this.getChoices();
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

    wx.request({
      url: `${config.serverRoot}/getWordsByChapterId?chapterId=${this.data.chapterId}`, // Replace with your actual endpoint
      method: 'GET',
      success: function (res) {

        // Update the data with the retrieved book list
        that.setData({
          problemList: res.data,
        });
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
    if(this.data.problemList[this.data.index].answer == null)
    {
      this.data.problemList[this.data.index].answer = '';
    }
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
    if(this.data.problemList[this.data.index].answer == null) this.data.problemList[this.data.index].answer = '';
    let that = this;
    wx.showLoading({  title: '正在获取分数',})
    wx.request({
      url: `${config.serverRoot}/getTranslationScore`,
      data: this.data.problemList,
      method: 'POST',
      success: function (res) {
        let correct = 0;
        let score = 0;
        for(let i = 0; i < res.data.length; i++)
        {
          correct += (res.data[i].score > 0.85);
          score += res.data[i].score > 0.85;
        }
        wx.hideLoading();
        wx.showModal({
          title: '测试结果',
          content: '正确数：' + correct + '/' + res.data.length + '\n正确率：'  + (correct / res.data.length*100).toFixed(1) + "%" + '\n语言准确度：'  + (score / res.data.length).toFixed(1),
          showCancel:false,
          complete: (res) => {
            wx.navigateBack();
          }
        });
      },
      fail: function (err) {
        // Handle the failure
        console.error('Failed to get chapter list', err);
        wx.navigateBack();
      },
    });
    
    
  },

  set_answer: function(e)
  {
    const value = e.detail.value;
    this.data.problemList[this.data.index].answer = value;
    this.setData({'problemList': this.data.problemList});
  },

  onChangeInputField: function(e)
  {
    this.data.problemList[this.data.index].answer = e.detail;
    this.setData({'problemList': this.data.problemList});
  }
})