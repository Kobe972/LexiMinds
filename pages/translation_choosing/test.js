// pages/dictation/test.js
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
    let sign = md5("getChoicesByChapterId" + this.data.chapterId + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/getChoicesByChapterId?chapterId=${this.data.chapterId}&uid=${wx.getStorageSync('user').openid}&sign=${sign}`, // Replace with your actual endpoint
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
    audio.stop();
    const URL = "https://dict.youdao.com/dictvoice?audio=" + this.data.problemList[this.data.index].english + "&type=2";
    audio.src = URL;
    audio.play();
  },

  finish: function()
  {
    let correct = 0;
    let success = true;
    for(let i = 0; i < this.data.problemList.length; i++)
    {
      if(this.data.problemList[i].truth == this.data.problemList[i].answer) correct++;
    }
    let sign = md5("postTranslationChoosingResult" + wx.getStorageSync('user').openid + this.data.problemList.length + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/postTranslationChoosingResult`,
      method: 'POST',
      data: {words: this.data.problemList, uid: wx.getStorageSync('user').openid, sign: sign},
      fail: function(err){
        success = false;
        wx.showToast({
          title: '结果上传失败',
          icon: 'error',
          duration: 2000,
          mask: true
        });
      }
    });
    wx.showModal({
      title: '测试结果',
      content: '正确数：' + correct + '/' + this.data.problemList.length + '\n正确率：'  + (correct / this.data.problemList.length*100).toFixed(1) + "%",
      showCancel:false,
      complete: (res) => {
        wx.disableAlertBeforeUnload();
        if(success) wx.navigateBack();
      }
    })
  },

  set_answer: function(e)
  {
    const value = e.detail.value;
    this.data.problemList[this.data.index].answer = value;
    this.setData({'problemList': this.data.problemList});
  },

  download: function() {
    wx.showLoading({
      title: '正在下载',
      mask: true
    });
    wx.request({
      url: `${config.serverRoot}/generateChoosingTestPdf`,
      data: this.data.problemList,
      method: 'POST',
      responseType: 'arraybuffer',
      success: function (res) {
        wx.hideLoading();
        wx.getFileSystemManager().writeFile({
          filePath: wx.env.USER_DATA_PATH + "/test.pdf",
          data: res.data,
          encoding: "binary",
          success: res => {
            wx.openDocument({
              filePath: wx.env.USER_DATA_PATH + "/test.pdf",
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
            });
          }
        });
      }
    });
  },

  onChangeSwitch: function({ detail }) {
    this.setData({dictation: detail})
  },

  showAdd: function() {
    this.pullAdd();
    let that = this;
    wx.showModal({
      title: '提示',
      content: 'PDF的转化需要占用大量服务器资源，为了降低下载频率，需要看广告后下载。是否愿意看激励广告？',
      complete: (res) => {
        if (res.cancel) {
          
        }
    
        if (res.confirm) {
          if (that.data.videoAd) {
            that.data.videoAd.show().catch(() => {
              // 失败重试
              that.data.videoAd.load()
                .then(() => videoAd.show())
                .catch(err => {
                  console.error('激励视频 广告显示失败', err)
                })
            })
          }
        }
      }
    })
  },
  pullAdd: function() {
    let videoAd = null;
    let that = this;

    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-8c6a7e820b3c750e'
      })
      videoAd.onLoad(() => {})
      videoAd.onError((err) => {
        console.error('激励视频光告加载失败', err)
      })
      videoAd.onClose((res) => {
        if (res && res.isEnded) {
          that.download();
        } else {
          // 播放中途退出，不下发游戏奖励
        }
      })
    }
    this.setData({videoAd: videoAd});
  },

  handleTouchstart: function(e)
  {
    this.setData({beginX: e.changedTouches[0].pageX});
    this.setData({beginY: e.changedTouches[0].pageY});
    this.setData({endX: e.changedTouches[0].pageX});
    this.setData({endY: e.changedTouches[0].pageY});
  },

  handleTouchmove: function(e) {
    this.setData({endX: e.changedTouches[0].pageX});
    this.setData({endY: e.changedTouches[0].pageY});
  },

  handleTouchend: function(e) {
    let dx = this.data.endX - this.data.beginX;
    let dy = this.data.endY - this.data.beginY;
    if(Math.abs(dx) - Math.abs(dy) > 10)
    {
      if(dx > 0) this.prev();
      else this.next();
    }
  }
})