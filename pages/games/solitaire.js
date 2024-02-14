// pages/games/solitaire.js
const config = require('../../utils/config.js');
const md5 = require('blueimp-md5');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_about: false,
    show_statistics: false,
    dragon: [],
    input_value: "",
    countdown: 10,
    started: 0,
    finished: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getStatistics();
  },

  start: function() {
    let that = this;
    wx.request({
      url: `${config.serverRoot}/getFirstSolitaireOption`,
      method: 'GET',
      success: function(res) {
        that.setData({started: 1});
        let dragon = that.data.dragon;
        dragon.push(res.data);
        that.setData({dragon: dragon});
        that.setData({prompt: dragon[dragon.length - 1].substring(dragon[dragon.length - 1].length - 1)});
        let timer = setInterval(()=>{that.countDown();}, 1000);
        that.setData({countdown: 10});
        that.setData({timer: timer});
      }
    });
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
    clearInterval(this.data.timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    clearInterval(this.data.timer);
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

  show_about: function() {
    this.setData({show_about: true});
  },

  show_statistics: function() {
    this.setData({show_statistics: true});
  },

  onClose: function() {
    this.setData({show_about: false, show_statistics: false});
  },

  confirm: function(event) {
    const value = event.detail.value;
    let that = this;
    if(this.data.dragon.includes(this.data.prompt + value))
    {
      wx.showToast({
        title: '单词重复',
        icon: 'error'
      });
      return;
    }
    if(value.indexOf(' ') != -1)
    {
      wx.showToast({
        title: '不可输入短语',
        icon: 'error'
      });
      return;
    }
    wx.request({
      url: `${config.serverRoot}/verifyWord?word=${this.data.prompt + value}`,
      success: function(res) {
        if(res.data.msg == "success") {
          let dragon = that.data.dragon;
          dragon.push(that.data.prompt + value);
          that.setData({dragon: dragon, input_value: ""});
          wx.request({
            url: `${config.serverRoot}/postSolitaireSession`,
            method: 'POST',
            data: {'session': that.data.dragon},
            success: function(res) {
              if(res.data == 'no word available')
              {
                let sign = md5("insertSolitaireRecord" + Math.floor(this.data.dragon.length / 2) + wx.getStorageSync('user').openid + "1" + wx.getStorageSync('user').session_key);
                wx.request({
                  url: `${config.serverRoot}/insertSolitaireRecord`,
                  method: 'POST',
                  data: {'uid': wx.getStorageSync('user').openid, rounds: Math.floor(this.data.dragon.length / 2), win: 1, sign: sign},
                  success: function(res) {
                    that.getStatistics();
                  }
                });
                that.setData({finished: 1});
                clearInterval(that.data.timer);
                wx.showModal({
                  title: '恭喜获胜',
                  content: `恭喜你赢得挑战！`,
                  showCancel: false
                });
              }
              else
              {
                clearInterval(that.data.timer);
                let timer = setInterval(()=>{that.countDown();}, 1000);
                that.setData({countdown: 10});
                that.setData({timer: timer});
                that.setData({countdown: 10});
                let dragon = that.data.dragon;
                dragon.push(res.data);
                that.setData({dragon: dragon, input_value: ""});
                that.setData({prompt: dragon[dragon.length - 1].substring(dragon[dragon.length - 1].length - 1)});
              }
            }
          })
        }
        else
        {
          wx.showToast({
            title: '不是英语单词',
            icon: 'error'
          });
          return;
        }
      }
    })
  },

  restart: function()
  {
    let that = this;
    wx.showModal({
      title: '重新开始',
      content: '确认重新开始游戏？本局游戏的记录都将清除',
      complete: (res) => {
        if (res.cancel) {
          
        }
    
        if (res.confirm) {
          that.setData({
            show_about: false,
            show_statistics: false,
            dragon: [],
            input_value: "",
            started: 0,
            finished: 0
          });
          that.onLoad();
        }
      }
    })
  },

  countDown: function ()
  {
    this.setData({countdown: this.data.countdown - 1});
    let that = this;
    if(this.data.countdown == 0)
    {
      let sign = md5("insertSolitaireRecord" + Math.floor(this.data.dragon.length / 2) + wx.getStorageSync('user').openid + "0" + wx.getStorageSync('user').session_key);
      wx.request({
        url: `${config.serverRoot}/insertSolitaireRecord`,
        method: 'POST',
        data: {'uid': wx.getStorageSync('user').openid, rounds: Math.floor(this.data.dragon.length / 2), win: 0, sign: sign},
        success: function(res) {
          that.getStatistics();
        }
      });
      clearInterval(that.data.timer);
      that.setData({finished: 1});
      wx.showModal({
        title: '失败',
        content: `很遗憾，没有在规定次数内猜到单词。再接再厉！`,
        showCancel: false
      });
    }
  },

  getStatistics: function() {
    let sign = md5("getSolitaireRecordsCountByUid" + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    let that = this;
    wx.request({
      url: `${config.serverRoot}/getSolitaireRecordsCountByUid?uid=${wx.getStorageSync('user').openid}&sign=${sign}`,
      method: 'GET',
      success: function(res) {
        that.setData({solitaireRecordsCount: res.data.count});
      }
    });
    sign = md5("getSolitaireRecordsWinRateByUid" + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/getSolitaireRecordsWinRateByUid?uid=${wx.getStorageSync('user').openid}&sign=${sign}`,
      method: 'GET',
      success: function(res) {
        if(res.data.win_rate == null) that.setData({solitaireRecordsWinRate: "NAN"});
        else that.setData({solitaireRecordsWinRate: res.data.win_rate + "%"});
      }
    });
    sign = md5("getSolitaireRecordsAvgRoundByUid" + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/getSolitaireRecordsAvgRoundByUid?uid=${wx.getStorageSync('user').openid}&sign=${sign}`,
      method: 'GET',
      success: function(res) {
        if(res.data.avg_round == null) that.setData({solitaireRecordsAvgRound: "NAN"});
        else that.setData({solitaireRecordsAvgRound: res.data.avg_round});
      }
    });
  }
})