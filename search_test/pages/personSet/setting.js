// pages/1.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    userInfoInServer:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var jsonStr = wx.getStorageSync("userInfo");
    var obj = JSON.parse(jsonStr);
    console.log(obj);
    that.setData({
      userInfo: obj,
      userInfoInServer: wx.getStorageSync("userInfoInServer")
    })
  },
  loginOut:function(e){
    wx.showModal({
      title: '提示',
      content: "确定退出当前账号？",
      cancelText: "下次再说",
      confirmText: "确定登出",
      confirmColor: "skybule",
      success:function(e){
        if (e.cancel) {

        } else {
          wx.showToast({
            title: '用户登出！', //提示文字
            duration: 2000, //显示时长
            icon: 'none',
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  bindPhone:function(e){
      wx.navigateTo({
          url: '../bindNum/bindNum',
      })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})