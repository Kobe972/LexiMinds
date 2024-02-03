// pages/wrong_records/wrong_records.js
const config = require('../../utils/config.js');
const md5 = require('blueimp-md5');
import Dialog from '../../vant-weapp/dist/dialog/dialog';
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
    let sign = md5("getWrongRecordsByUserId" + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/getWrongRecordsByUserId?uid=${wx.getStorageSync('user').openid}&sign=${sign}`,
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
      url: `/pages/wrong_records/record_detail?wordId=${wordId}&record`,
    });
  },

  getDownloadLink: function() {
    let sign = md5("getWrongRecordDownloadLink" + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    let that = this;
    wx.request({
      url: `${config.serverRoot}/getWrongRecordDownloadLink?uid=${wx.getStorageSync('user').openid}&sign=${sign}`,
      method: 'GET',
      success: function(res) {
        if(res.data.msg == 'success') {
          that.setData({link: res.data.link, full_link: `${config.serverRoot}/generateWrongRecordPdf?link=${res.data.link}`, show_download_dialog: true});
        }
        else
        {
          wx.showModal({
            title: '下载失败',
            content: res.data.msg,
            showCancel: false
          });
        }
      },
      fail: function(res) {
        wx.showModal({
          title: '下载失败',
          content: res.errno,
          showCancel: false
        });
      }
    });
  },

  downloadByLink: function () {
    wx.showLoading({
      title: '正在下载',
      mask: true
    })
    wx.downloadFile({
      url: `${config.serverRoot}/generateWrongRecordPdf?link=${this.data.link}`,
      success: function (res) {
        wx.hideLoading();
        const filePath = res.tempFilePath
        wx.openDocument({
            filePath: filePath,
            showMenu: true
        })
      },
      fail: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: '下载失败！',
          icon: 'error',
          duration: 2000,
          mask: true
        })
      }
    });
  },

  copyDownloadLink: function() {
    wx.setClipboardData({
      data: this.data.full_link,
      success: function(res) {
        wx.showToast({
          title: '已复制到剪切板'
        });
      },
      fail: function(res) {
        wx.showToast({
          title: '复制失败',
          icon: 'error'
        })
      }
    });
  },

  evaluate: function () {
    if(this.data.recordItems.length < 4)
    {
      wx.showToast({
        title: '至少需4个错题',
        icon: 'error'
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/wrong_records/test_wrong_record',
    });
  }
})