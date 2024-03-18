// pages/select_book_for_learn/select_book_for_learn.js
const config = require('../../utils/config.js');
const md5 = require('blueimp-md5');
import { $wuxDialog } from '../../miniprogram_npm/wux-weapp/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    commonBookList: [],
    privateBookList: [],
    serverRoot: config.serverRoot
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getcommonBookList();
    this.setData({purpose: options.purpose});
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

  getcommonBookList: function () {
    var that = this;

    wx.request({
      url: `${config.serverRoot}/getCommonBooks`, // Replace with your actual endpoint
      method: 'GET',
      success: function (res) {

        // Update the data with the retrieved book list
        that.setData({
          commonBookList: res.data,
        });
      },
      fail: function (err) {
        // Handle the failure
        console.error('Failed to get book list', err);
      },
    });
    let sign = md5("getPrivateBooks" + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/getPrivateBooks?uid=${wx.getStorageSync('user').openid}&sign=${sign}`, // Replace with your actual endpoint
      method: 'GET',
      success: function (res) {

        // Update the data with the retrieved book list
        that.setData({
          privateBookList: res.data,
        });
      },
      fail: function (err) {
        // Handle the failure
        console.error('Failed to get book list', err);
      },
    });
  },

  navigateToSelectChapter: function (event) {
    const bookId = event.currentTarget.dataset.bookid;
    const purpose = this.data.purpose;

    wx.navigateTo({
      url: `/pages/select_chapter/select_chapter?bookId=${bookId}&purpose=${purpose}`,
    });
  },

  onCloseSwipeCell: function(event) {
    const { position, instance } = event.detail;
    const bookId = event.currentTarget.dataset.bookid;
    let that = this;
    switch (position) {
      case 'cell':
        instance.close();
        break;
      case 'right':
        wx.showModal({
          title: '确认删除？',
          content: '此操作不可逆！',
          complete: (res) => {
            if (res.cancel) {
              
            }
            
            if (res.confirm) {
              let sign = md5("deleteBookOwnershipByOwner" + bookId + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
              wx.request({
                url: `${config.serverRoot}/deleteBookOwnershipByOwner`,
                method: 'POST',
                data: {uid: wx.getStorageSync('user').openid, book_id: bookId, sign: sign},
                success: function(res) {
                  that.onLoad(null);
                }
              })
            }
          }
        })
        break;
    }
  },

  onClickAddButton: function() {
    let that = this;
    $wuxDialog().prompt({
      resetOnClose: true,
      title: '输入邀请码',
      content: '输入邀请码加入私有词书',
      defaultText: '',
      maxlength: 30,
      onConfirm(e, response) {
        let sign = md5("activateBook" + response + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
        wx.request({
          url: `${config.serverRoot}/activateBook`,
          method: 'POST',
          data: {uid: wx.getStorageSync('user').openid, activation_code: response, sign: sign},
          success: function(res)
          {
            if(res.data.msg == 'success')
            {
              wx.showToast({
                title: '加入成功',
                duration: 2000
              });
              that.onLoad({purpose: that.data.purpose});
            }
            else
            {
              wx.showToast({
                title: res.data.msg,
                duration: 2000,
                icon: 'error'
              });
            }
          }
        })
      },
    });
  }
})