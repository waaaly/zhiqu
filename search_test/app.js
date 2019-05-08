//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  globalData: {
    // userInfo: null,
    requstUrl: "https://test.mingrui-gz.com",

    userAddress:[
      {
        areaInfo: "北京市-市辖区-东城区", 
        address: "南京中路十八乡星光小区十九栋1024室", 
        mobile: "13567678989", 
        linkMan: "rocky", 
        defaultAddress: 1,
      },
      { 
        areaInfo: "北京市-市辖区-东城区", 
        address: "safefv", 
        mobile: "18978004262", 
        linkMan: "tanghauf", 
        defaultAddress: 0 
      },
      { 
        areaInfo: "北京市-市辖区-东城区", 
        address: "南京中路十八乡星光小区十九栋1024室", 
        mobile: "13567678989", 
        linkMan: "rocky", 
        defaultAddress: 0 
      },
      {
        areaInfo: "北京市-市辖区-东城区",
        address: "南京中路十八乡星光小区十九栋1024室",
        mobile: "13567678989",
        linkMan: "rocky",
        defaultAddress: 0
      },
      {
        areaInfo: "北京市-市辖区-东城区",
        address: "南京中路十八乡星光小区十九栋1024室",
        mobile: "13567678989",
        linkMan: "rocky",
        defaultAddress: 0
      },
      {
        areaInfo: "北京市-市辖区-东城区",
        address: "南京中路十八乡星光小区十九栋1024室",
        mobile: "13567678989",
        linkMan: "rocky",
        defaultAddress: 0
      }

],
  }
})