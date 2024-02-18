// pages/select_chapter/select_chapter.js
const config = require('../../utils/config.js');
const md5 = require('blueimp-md5');
import Dialog from '../../vant-weapp/dist/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_download_dialog: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.bookId = options.bookId;
    this.data.purpose = options.purpose;
    this.getChapterList();
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

  getChapterList: function () {
    var that = this;
    let sign = md5("getChaptersByBookId" + this.data.bookId + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/getChaptersByBookId?bookId=${this.data.bookId}&uid=${wx.getStorageSync('user').openid}&sign=${sign}`, // Replace with your actual endpoint
      method: 'GET',
      success: function (res) {
        // Update the data with the retrieved book list
        that.setData({
          chapterList: res.data,
        });
      },
      fail: function (err) {
        // Handle the failure
        console.error('Failed to get chapter list', err);
      },
    });
  },

  navigateToNextStep: function (event) {
    const chapterId = event.currentTarget.dataset.chapterid;
    if(this.data.purpose == 'learn')
    {
      wx.navigateTo({
        url: `/pages/learn/learn?chapterId=${chapterId}`,
      });
    }
    else if(this.data.purpose == 'translation_choosing')
    {
      wx.navigateTo({
        url: `/pages/translation_choosing/test?chapterId=${chapterId}`,
      });
    }
    else if(this.data.purpose == 'translation_filling')
    {
      wx.navigateTo({
        url: `/pages/translation_filling/test?chapterId=${chapterId}`,
      });
    }
    else if(this.data.purpose == 'word_filling')
    {
      wx.navigateTo({
        url: `/pages/word_filling/test?chapterId=${chapterId}`,
      });
    }
  },

  getDownloadLink: function() {
    let sign = md5("getBookDownloadLink" + this.data.bookId + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    let that = this;
    wx.request({
      url: `${config.serverRoot}/getBookDownloadLink?bookId=${this.data.bookId}&uid=${wx.getStorageSync('user').openid}&sign=${sign}`,
      method: 'GET',
      success: function(res) {
        if(res.data.msg == 'success') {
          that.setData({link: res.data.link, full_link: `${config.serverRoot}/generateBookPdf?link=${res.data.link}`, show_download_dialog: true});
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
    });
    wx.downloadFile({
      url: `${config.serverRoot}/generateBookPdf?link=${this.data.link}`,
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
  }
})