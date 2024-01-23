// index.js
const config = require('../../utils/config.js');
const md5 = require('blueimp-md5');

Page({
  data: {
    use_date_arr:[],
    loaded: false,
    statistics: {},
    current_book: null
  },
  onLoad(options) {
    let that = this;
    wx.login({
      //成功放回
      success:(res)=>{
        let code=res.code;
        wx.request({
          url: config.serverRoot+'/getOpenId?appid=wx8d575aef47f48989&secret=4a5102802c1f7a700824ae29adfeed0e&js_code=' + res.code,
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
                console.log(that.data.use_date_arr);
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
            })
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
      url: '/pages/select_book_for_learn/select_book_for_learn',
    });
  },
  navigateToSelectChapter: function(e){
    const bookId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/select_chapter/select_chapter?bookId=${bookId}&purpose=learn`,
    });
  }
})
