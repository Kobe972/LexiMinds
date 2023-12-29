// index.js
const config = require('../../utils/config.js');

Page({
  data: {
    use_date_arr:[],
    loaded: false
  },
  onLoad(options) {
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
          }
        });
      }
    });
    let that = this;
    wx.request({
      url: `${config.serverRoot}/getClockIn?uid=${wx.getStorageSync('user').openid}`,
      method: "GET",
      success: function(res){
        let date_arr = [];
        console.log(res.data);
        for(var i = 0; i < res.data.length; i++)
        {
          date_arr.push(res.data[i].day);
        }
        that.setData({use_date_arr: date_arr});
        console.log(that.data.use_date_arr);
        that.setData({loaded: true});
      }
    });
  },
  handleStartNewWords: function () {
    wx.navigateTo({
      url: '/pages/select_book_for_learn/select_book_for_learn',
    });
  },
})
