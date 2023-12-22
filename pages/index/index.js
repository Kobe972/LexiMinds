// index.js
const config = require('../../utils/config.js');

Page({
  data: {
    use_date_arr:['2023-12-1','2023-12-2','2023-12-3','2023-12-5','2023-12-8']
  },
  onLoad(options) {
    console.log("ok");
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
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      },
      fail: (err) => {
        console.error('Failed to get user profile:', err);
      },
    })
  },
  handleStartNewWords: function () {
    wx.navigateTo({
      url: '/pages/select_book_for_learn/select_book_for_learn',
    });
  },
})
