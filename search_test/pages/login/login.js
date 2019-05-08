var app = getApp();
const APIURL=require("../../utils/api.js");
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showSkeleton: false
  },
  onLoad:function(){ 
    var that = this;
    setTimeout(() => {
      that.setData({
        showSkeleton: false    
      })
    }, 2000)
  },
  onShow:function(){
    var userInfo = wx.getStorageSync("userInfo");
    if (userInfo){
      wx.reLaunch({
        url: '../index/index',
      })
    }
  },
  onAuth() {
    wx.getSetting({
      success: (res) => {
        console.log(res);
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success:function(e){
              console.log(e);
              var rawData = e.rawData;
              var code;
              //保存用户信息
              wx.setStorage({
                key: 'userInfo',
                data: rawData,
              });
              //登录微信获取code
              wx.login({
                success:function(e){
                  console.log(e);
                  code=e.code;
                  wx.setStorage({
                    key: 'userCode',
                    data: code,
                  })
              //登录后台获取token
                  wx.request({
                    url: APIURL.AuthLoginByWeixin,
                    method: "GET",
                    data: {
                      code: code,
                      rawData: rawData,
                    },
                    //请求头
                    header: {
                      "Content-Type": "applciation/json",
                    },
                    success: function (res) {
                      console.log(res);
                      var loginReturnData = res.data.data;
                      //缓存token
                      wx.setStorage({
                        key: 'userToken',
                        data: loginReturnData.token,
                        success: function (res) {
                          console.log('异步保存成功')
                        }
                      });
                      wx.setStorage({
                        key: 'userInfoInServer',
                        data: loginReturnData.userInfo,
                        success: function (res) {
                          console.log('异步保存后台用户数据成功')
                        }
                      });
                    }
                  });
              },
            });
          }
        });
          wx.reLaunch({
            url: '../index/index',
          })
        }
      }
    })
  }
})