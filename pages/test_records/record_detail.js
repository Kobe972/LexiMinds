// pages/test_records/record_detail.js
const config = require('../../utils/config.js');
const md5 = require('blueimp-md5');
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
    this.setData({recordId: options.recordId, type: options.type});
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
    let sign = md5("getRecordItemWithWord" + this.data.recordId + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/getRecordItemWithWord?record_id=${this.data.recordId}&uid=${wx.getStorageSync('user').openid}&sign=${sign}`,
      success: function(res){
        that.setData({recordDetail: res.data});
        that.getBookName();
        that.getChapterName();
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
    let sign = md5("getBookNameByChapterId" + this.data.recordDetail.chapter_id + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/getBookNameByChapterId?chapter_id=${this.data.recordDetail.chapter_id}&uid=${wx.getStorageSync('user').openid}&sign=${sign}`,
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
    let sign = md5("getChapterNameByChapterId" + this.data.recordDetail.chapter_id + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/getChapterNameByChapterId?chapter_id=${this.data.recordDetail.chapter_id}&uid=${wx.getStorageSync('user').openid}&sign=${sign}`,
      success: function(res){
        if(res.data != null) that.setData({chapter_name: res.data});
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

  feedback: function()
  {
    let that = this;
    wx.showModal({
      title: '确认反馈',
      content: '是否确认反馈？如果AI评分有误，请点击确认。',
      complete: (res) => {
        if (res.confirm) {
          let judge;
          if(that.data.recordDetail.score <= 0.85) judge = 1;
          else judge = 0;
          let sign = md5("insertFeedback" + that.data.recordDetail.answer + that.data.recordDetail.english + judge + that.data.recordId + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
          wx.request({
            url: `${config.serverRoot}/insertFeedback`,
            method: 'POST',
            data: {uid: wx.getStorageSync('user').openid, record_id: that.data.recordId, english: that.data.recordDetail.english, answer: that.data.recordDetail.answer, judge: judge, sign: sign},
            success: function(res){
              wx.navigateBack();
              wx.showToast({
                title: '反馈成功！',
                icon: 'success',
                duration: 2000,
                mask: true
              });
            },
            fail: function(err){
              wx.showToast({
                title: '反馈失败！',
                icon: 'error',
                duration: 2000,
                mask: true
              });
            }
          })
        }
      }
    })
  }
})