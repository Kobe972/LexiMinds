// pages/test_records/test_records.js
const config = require('../../utils/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wrongRecordItems: [],
    correctRecordItems: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({resultId: options.resultId});
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
    wx.request({
      url: `${config.serverRoot}/getTestRecords?result_id=${this.data.resultId}`,
      success: function(res){
        let recordItems = res.data;
        let wrongRecordItems = [];
        let correctRecordItems = [];
        let not_rated = [];
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
          if(recordItems[i].score == -1) not_rated.push(recordItems[i]);
          else if(recordItems[i].score <= 0.85) wrongRecordItems.push(recordItems[i]);
          else correctRecordItems.push(recordItems[i]);
        }
        that.setData({wrongRecordItems: wrongRecordItems, correctRecordItems: correctRecordItems, not_rated: not_rated});
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
    const recordId = e.currentTarget.dataset.recordid;
    wx.navigateTo({
      url: `/pages/test_records/record_detail?recordId=${recordId}`,
    });
  }
})