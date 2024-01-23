// pages/my_notification/my_notification.js
const config = require('../../utils/config.js');
const md5 = require('blueimp-md5');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notificationList: [],
    serverRoot: config.serverRoot
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getNotificationList();
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

  getBookInvitationDetail: function() {
    let that = this;
    for(let i = 0; i < this.data.notificationList.length; i++)
    {
      if(this.data.notificationList[i].type == 'book_invitation')
      {
        let sign = md5("getInvitingBookByBookId" + that.data.notificationList[i].content + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
        wx.request({
          url: `${config.serverRoot}/getInvitingBookByBookId?uid=${wx.getStorageSync('user').openid}&book_id=${that.data.notificationList[i].content}&sign=${sign}`,
          method: 'GET',
          success: function(res){
            that.data.notificationList[i].bookname = res.data.bookname;
            that.data.notificationList[i].avatarURL = res.data.avatarURL;
            that.data.notificationList[i].book_id = res.data.id;
            that.setData({notificationList: that.data.notificationList});
          }
        });
      }
    }
  },

  getNotificationList: function () {
    var that = this;
    let sign = md5("getNotificationsByUid" + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/getNotificationsByUid?uid=${wx.getStorageSync('user').openid}&sign=${sign}`, // Replace with your actual endpoint
      method: 'GET',
      success: function (res) {
        // Update the data with the retrieved book list
        that.setData({
          notificationList: res.data,
        });
        that.getBookInvitationDetail();
      },
      fail: function (err) {
        // Handle the failure
        console.error('Failed to get book list', err);
      },
    });
  },

  acceptBookInvitation: function(event) {
    const bookId = event.currentTarget.dataset.bookid;
    let that = this;
    wx.showModal({
      title: '确认接受',
      content: '确认接受此词书邀请？',
      complete: (res) => {
        if (res.cancel) {
          
        }
        if (res.confirm) {
          let sign = md5("acceptBookInvitation" + bookId + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
          wx.request({
            url: `${config.serverRoot}/acceptBookInvitation`,
            method: 'POST',
            data: {uid: wx.getStorageSync('user').openid, book_id: bookId, sign: sign},
            success: function(res) {
              that.getNotificationList();
            }
          })
        }
      }
    })
  },

  declineBookInvitation: function(event) {
    const id = event.currentTarget.dataset.id;
    let that = this;
    wx.showModal({
      title: '确认拒绝',
      content: '确认拒绝此词书邀请？注意：拒绝操作不可逆，该邀请将会删除',
      complete: (res) => {
        if (res.cancel) {
          
        }
        if (res.confirm) {
          let sign = md5("deleteNotificationById" + id + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
          wx.request({
            url: `${config.serverRoot}/deleteNotificationById`,
            method: 'POST',
            data: {id: id, uid: wx.getStorageSync('user').openid, sign: sign},
            success: function(res) {
              that.getNotificationList();
            }
          })
        }
      }
    })
  }
})