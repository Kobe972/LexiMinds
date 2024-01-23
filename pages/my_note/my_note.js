// pages/my_note/my_note.js
const config = require('../../utils/config.js');
const md5 = require('blueimp-md5');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordItems: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadRecordItems();
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
    this.onLoad();
    wx.stopPullDownRefresh();
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

  loadRecordItems: function(){
    let that = this;
    let sign = md5("getWordsWithNoteByUserId" + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/getWordsWithNoteByUserId?uid=${wx.getStorageSync('user').openid}&sign=${sign}`,
      success: function(res){
        let recordItems = res.data;
        for(var i = 0; i < recordItems.length; i++)
        {
          recordItems[i].translation.replace("\r\n", "; ");
          recordItems[i].translation.replace("\n", "; ");
          if(recordItems[i].translation.length > 11)
          {
            recordItems[i].translation = recordItems[i].translation.substring(0, 11) + "...";
          }
        }
        for(var i = 0; i < recordItems.length; i++)
        {
          if(recordItems[i].value.length > 11)
          {
            recordItems[i].value = recordItems[i].value.substring(0, 11) + "...";
          }
        }
        that.setData({recordItems: recordItems});
      },
      fail: function(error){
        wx.showToast({
          title: '加载失败',
          icon: 'error',
          duration: 2000,
          mask: true
        });
      }
    })
  },

  navigateToDetails: function(e){
    const wordId = e.currentTarget.dataset.wordid;
    wx.navigateTo({
      url: `/pages/single_word/single_word?wordId=${wordId}`,
    });
  }
})