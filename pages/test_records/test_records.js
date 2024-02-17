// pages/test_records/test_records.js
const config = require('../../utils/config.js');
const md5 = require('blueimp-md5');
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
    this.setData({resultId: options.resultId, type: options.type});
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
    this.onLoad({resultId: this.data.resultId});
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
    let sign = md5("getTestRecords" + this.data.resultId + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/getTestRecords?result_id=${this.data.resultId}&uid=${wx.getStorageSync('user').openid}&sign=${sign}`,
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
  },

  go_rating: function() {
    let sign = md5("startTestResultQueue" + this.data.resultId + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/startTestResultQueue`,
      method: 'POST',
      data: {uid: wx.getStorageSync('user').openid, result_id: this.data.resultId, sign: sign},
      success: function(res) {
        if(res.data == 'success')
        {
          wx.showModal({
            title: '已排队',
            content: '正在排队，请稍等片刻！',
            showCancel: false,
            complete: (res) => {
              wx.navigateBack();
            }
          });
        }
        else
        {
          wx.showModal({
            title: '错误',
            content: '排队失败，请检测网络，稍后再试',
            showCancel: false
          });
        }
      },
      fail: function(err) {
        wx.showModal({
          title: '错误',
          content: '排队失败，请检测网络，稍后再试',
          showCancel: false
        });
      }
    });
  },

  delete: function() {
    let that = this;
    wx.showModal({
      title: '确认删除',
      content: '是否删除结果？此操作不可逆！',
      complete: (res) => {
        if (res.cancel) {
          
        }
    
        if (res.confirm) {
          let sign = md5("deleteTestResult" + that.data.resultId + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
          wx.request({
            url: `${config.serverRoot}/deleteTestResult`,
            method: 'POST',
            data: {uid: wx.getStorageSync('user').openid, result_id: this.data.resultId, sign: sign},
            success: function(res) {
              if(res.data == 'success')
              {
                wx.showModal({
                  title: '删除成功',
                  content: '已删除！可上拉刷新结果表格查看当前记录',
                  showCancel: false,
                  complete: (res) => {
                    wx.navigateBack();
                  }
                });
              }
              else
              {
                wx.showModal({
                  title: '删除失败',
                  content: '删除失败！请检测网络设置',
                  showCancel: false
                });
              }
            },
            fail: function(err) {
              wx.showModal({
                title: '删除失败',
                content: '删除失败！请检测网络设置',
                showCancel: false
              });
            }
          });
        }
      }
    });
  }
})