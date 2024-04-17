// index.js
const config = require('../../utils/config.js');
const md5 = require('blueimp-md5');

Page({
  data: {
    use_date_arr:[],
    loaded: false,
    statistics: {},
    current_book: null,
    current_chapterid: null,
    current_wordid: null
  },
  onLoad(options) {
    let that = this;
    wx.login({
      //成功放回
      success:(res)=>{
        wx.request({
          url: config.serverRoot+'/getOpenId?js_code=' + res.code,
          success:(res)=>{
            var obj = {};
            obj.openid = res.data.openid;
            obj.session_key = res.data.session_key;
            //存储openid
            wx.setStorageSync('user', obj);
            let sign = md5("getClockIn" + obj.openid + obj.session_key);
            wx.request({
              url: `${config.serverRoot}/getClockIn?uid=${wx.getStorageSync('user').openid}&sign=${sign}`,
              method: "GET",
              success: function(res){
                let date_arr = [];
                console.log(res.data);
                for(var i = 0; i < res.data.length; i++)
                {
                  let parts = res.data[i].day.split('-');
                  if(parts[1][0] == '0') parts[1] = parts[1].substring(1);
                  if(parts[2][0] == '0') parts[2] = parts[2].substring(1);
                  date_arr.push(parts[0] + '-' + parts[1] + '-' + parts[2]);
                }
                that.setData({use_date_arr: date_arr});
                that.setData({loaded: true});
              }
            });
            sign = md5("getLearningStatistics" + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
            wx.request({
              url: `${config.serverRoot}/getLearningStatistics?uid=${wx.getStorageSync('user').openid}&sign=${sign}`,
              success: function(res){
                that.setData({statistics: res.data});
              }
            });
            sign = md5("getCurrentBook" + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
            wx.request({
              url: `${config.serverRoot}/getCurrentBook?uid=${wx.getStorageSync('user').openid}&sign=${sign}`,
              success: function(res){
                if(res.data)
                {
                  if(res.data.avatarURL[0]=='/') res.data.avatarURL = config.serverRoot + res.data.avatarURL;
                  that.setData({current_book: res.data});
                } 
              }
            });
            sign = md5("getCurrentWordId" + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
            wx.request({
              url: `${config.serverRoot}/getCurrentWordId?uid=${wx.getStorageSync('user').openid}&sign=${sign}`,
              success: function(res){
                if(res.data)
                {
                  that.setData({current_wordid: res.data});
                } 
              }
            });
            sign = md5("getCurrentChapterId" + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
            wx.request({
              url: `${config.serverRoot}/getCurrentChapterId?uid=${wx.getStorageSync('user').openid}&sign=${sign}`,
              success: function(res){
                if(res.data)
                {
                  that.setData({current_chapterid: res.data});
                } 
              }
            });
          },
          fail: function(res) {
            wx.showModal({
              title: '网络错误',
              content: '未能连接到服务器，请检查网络或等待服务器重启',
              showCancel: false,
              complete: (res) => {
                wx.exitMiniProgram();
              }
            });
          }
        });
      }
    });
  },
  onPullDownRefresh: function() {
    this.onLoad(null);
    wx.stopPullDownRefresh();
  },
  handleStartNewWords: function () {
    wx.navigateTo({
      url: '/pages/select_book/select_book?purpose=learn',
    });
  },
  navigateToLearn: function(e){
    wx.navigateTo({
      url: `/pages/learn/learn?chapterId=${this.data.current_chapterid}&wordId=${this.data.current_wordid}&purpose=learn`,
    });
  },
  onShareAppMessage() {
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title: 'LexiMinds：更快地背单词！'
        })
      }, 2000)
    })
    return {
      title: 'LexiMinds：更快地背单词！',
      path: '/page/index',
      promise 
    }
  }
})
