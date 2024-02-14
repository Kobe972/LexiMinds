// pages/games/wordle.js
const config = require('../../utils/config.js');
const md5 = require('blueimp-md5');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordle_lines: [["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""]],
    cur_x: 0,
    cur_y: 0,
    feedback: [["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""]],
    show_about: false,
    show_statistics: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    wx.request({
      url: `${config.serverRoot}/getWordleAnswer`,
      success: function(res) {
        that.setData({answer: res.data.toLowerCase()});
      }
    });
    this.getStatistics();
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

  input: function(event) {
    const value = event.currentTarget.dataset.value;
    if(this.data.cur_y < this.data.wordle_lines[0].length && this.data.cur_x < this.data.wordle_lines.length)
    {
      this.setData({[`wordle_lines[${this.data.cur_x}][${this.data.cur_y}]`]: value});
      this.setData({cur_y: this.data.cur_y + 1});
    }
  },

  backspace: function() {
    if(this.data.cur_y > 0)
    {
      this.setData({[`wordle_lines[${this.data.cur_x}][${this.data.cur_y - 1}]`]: ""});
      this.setData({cur_y: this.data.cur_y - 1});
    }
  },

  confirm: function() {
    let that = this;
    if(this.data.cur_y < this.data.wordle_lines[0].length) return;
    let word = "";
    for(var i = 0; i < this.data.wordle_lines[0].length; i++)
    {
      word += this.data.wordle_lines[this.data.cur_x][i];
    }
    wx.request({
      url: `${config.serverRoot}/verifyWord?word=${word}`,
      success: function(res) {
        if(res.data.msg == 'success')
        {
          let all_right = true;
          var answer = that.data.answer;
          for(var i = 0; i < that.data.wordle_lines[0].length; i++)
          {
            if(that.data.wordle_lines[that.data.cur_x][i].toLowerCase() == answer[i])
            {
              that.setData({[`feedback[${that.data.cur_x}][${i}]`]: "green"});
              answer = answer.split('');
              answer[i] = " ";
              answer = answer.join('');
            }
          }
          for(var i = 0; i < that.data.wordle_lines[0].length; i++)
          {
            if(that.data.feedback[that.data.cur_x][i] == 'green') continue;
            if(answer.indexOf(that.data.wordle_lines[that.data.cur_x][i].toLowerCase()) != -1)
            {
              that.setData({[`feedback[${that.data.cur_x}][${i}]`]: "orange"});
              let t = answer.indexOf(that.data.wordle_lines[that.data.cur_x][i].toLowerCase());
              answer = answer.split('');
              answer[t] = " ";
              answer = answer.join('');
              all_right = false;
            }
            else
            {
              that.setData({[`feedback[${that.data.cur_x}][${i}]`]: "gray"});
              all_right = false;
            }
          }
          if(that.data.cur_x < that.data.wordle_lines.length)
          {
            that.setData({cur_y: 0});
            that.setData({cur_x: that.data.cur_x + 1});
          }
          if(that.data.cur_x >= that.data.wordle_lines.length)
          {
            if(!all_right)
            {
              let sign = md5("insertWordleRecord" + that.data.cur_x + wx.getStorageSync('user').openid + "0" + wx.getStorageSync('user').session_key);
              wx.request({
                url: `${config.serverRoot}/insertWordleRecord`,
                method: 'POST',
                data: {'uid': wx.getStorageSync('user').openid, win: 0, guess: that.data.cur_x, sign: sign},
                success: function(res) {
                  that.getStatistics();
                }
              });
              wx.showModal({
                title: '失败',
                content: `很遗憾，没有在规定次数内猜到单词。再接再厉！答案：${that.data.answer}`,
                showCancel: false
              });
            }
          }
          if(all_right)
          {
            let sign = md5("insertWordleRecord" + that.data.cur_x + wx.getStorageSync('user').openid + "1" + wx.getStorageSync('user').session_key);
            wx.request({
              url: `${config.serverRoot}/insertWordleRecord`,
              method: 'POST',
              data: {'uid': wx.getStorageSync('user').openid, win: 1, guess: that.data.cur_x, sign: sign},
              success: function(res) {
                that.getStatistics();
              }
            });
            wx.showModal({
              title: '获胜',
              content: '恭喜你，游戏获胜！',
              showCancel: false
            });
          }
        }
      }
    });
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
            wordle_lines: [["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""]],
            cur_x: 0,
            cur_y: 0,
            feedback: [["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""]],
            show_about: false,
            show_statistics: false
          });
          that.onLoad();
        }
      }
    })
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

  getStatistics: function() {
    let sign = md5("getWordleRecordsCountByUid" + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    let that = this;
    wx.request({
      url: `${config.serverRoot}/getWordleRecordsCountByUid?uid=${wx.getStorageSync('user').openid}&sign=${sign}`,
      method: 'GET',
      success: function(res) {
        that.setData({wordleRecordsCount: res.data.count});
      }
    });
    sign = md5("getWordleRecordsWinRateByUid" + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/getWordleRecordsWinRateByUid?uid=${wx.getStorageSync('user').openid}&sign=${sign}`,
      method: 'GET',
      success: function(res) {
        if(res.data.win_rate == null) that.setData({wordleRecordsWinRate: "NAN"});
        else that.setData({wordleRecordsWinRate: res.data.win_rate + "%"});
      }
    });
    sign = md5("getWordleRecordsAvgGuessByUid" + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/getWordleRecordsAvgGuessByUid?uid=${wx.getStorageSync('user').openid}&sign=${sign}`,
      method: 'GET',
      success: function(res) {
        if(res.data.avg_guess == null) that.setData({wordleRecordsAvgGuess: "NAN"});
        else that.setData({wordleRecordsAvgGuess: res.data.avg_guess});
      }
    });
  }
})