// pages/test_results/test_results.js
const config = require('../../utils/config.js');
const md5 = require('blueimp-md5');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    submission_time_start: "",
    submission_time_end: "",
    resultList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.updateResultData();
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
    this.onLoad(null);
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

  updateResultData: function(){
    let p_submission_time_start = this.data.submission_time_start;
    if(p_submission_time_start != "") p_submission_time_start += " 00:00:00";
    let p_submission_time_end = this.data.submission_time_end;
    if(p_submission_time_end != "") p_submission_time_end += " 23:59:59";
    let that = this;
    let sign = md5("getTestResults" + p_submission_time_end + p_submission_time_start + wx.getStorageSync('user').openid + wx.getStorageSync('user').session_key);
    wx.request({
      url: `${config.serverRoot}/getTestResults?submission_time_start=${p_submission_time_start}&submission_time_end=${p_submission_time_end}&uid=${wx.getStorageSync('user').openid}&sign=${sign}`,
      success: function(res){
        let resultList = res.data;
        for(var i = 0; i < resultList.length; i++)
        {
          if(resultList[i].type == 'translation_choosing') resultList[i].type = '词义选择';
          else if(resultList[i].type == 'translation_filling') resultList[i].type = '词义填写';
          else if(resultList[i].type == 'word_filling') resultList[i].type = '单词拼写';
          if(resultList[i].accuracy == -1) resultList[i].accuracy = '排队中';
          else if(resultList[i].accuracy == -1.5) resultList[i].accuracy = '未评测';
          else if(resultList[i].accuracy == -0.5) resultList[i].accuracy = '评分中';
          else resultList[i].accuracy = resultList[i].accuracy.toFixed(2);
        }
        that.setData({resultList: resultList});
      }
    });
  },

  bindStartDateChange: function(e) {
    this.setData({
      submission_time_start: e.detail.value
    });
    this.updateResultData();
  },

  bindEndDateChange: function(e) {
    this.setData({
      submission_time_end: e.detail.value
    });
    this.updateResultData();
  },

  navigateToRecords: function(e){
    const resultId = e.currentTarget.dataset.resultid;
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/pages/test_records/test_records?resultId=${resultId}&type=${type}`,
    });
  }
})