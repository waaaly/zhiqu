//index.js
import myDialog from "../../template/loginDialog/loginDialog"
//引入sdk核心类
var QQMapWX = require('../../libs/sdk/qqmap-wx-jssdk.js');
//实例化api核心类
var qqmapsdk;
var util=require('../../utils/util.js')
//关联app。js
var app = getApp();
Page({
  data: {
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marquee_margin: 30,
    size: 14,
    interval: 20, // 时间间隔
    shangjiaList: [
      {
        "name": "正新鸡排",
        "star": 5,
        "sales": 1161,
        "src": "http://i4.piimg.com/601998/a88338a6d392a569.jpg",
        "initial_price": 20,
        "distribution_price": 0,
        "distance": "1.5km",
        "time": 30
      },
      {
        "name": "板凳烧烤",
        "star": 4,
        "sales": 330,
        "src": "http://i4.piimg.com/601998/473847a250bb0186.jpg",
        "initial_price": 50,
        "distribution_price": 3,
        "distance": "3.3km",
        "time": 56
      },
      {
        "name": "味多美炸鸡汉堡",
        "src": "http://i4.piimg.com/601998/a014d6160fd7b504.jpg",
        "star": 0,
        "sales": 39,
        "initial_price": 35,
        "distribution_price": 3,
        "distance": "3.1km",
        "time": 44
      },
      {
        "name": "精武鸭脖",
        "star": 0,
        "sales": 24,
        "src": "http://i4.piimg.com/601998/23f361491b45ddf2.jpg",
        "initial_price": 30,
        "distribution_price": 1,
        "distance": "2.6km",
        "time": 44
      },
      {
        "name": "御膳房",
        "src": "http://i2.kiimg.com/601998/a955867016875a41.jpg",
        "star": 4.5,
        "sales": 641,
        "initial_price": 0,
        "distribution_price": 0,
        "distance": "156m",
        "time": 33
      },
      {
        "name": "韩式炸鸡啤酒屋",
        "star": 4.5,
        "sales": 731,
        "src": "http://i4.piimg.com/601998/9ce47f2f19d7717d.jpg",
        "initial_price": 15,
        "distribution_price": 0,
        "distance": "1.3km",
        "time": 52
      },
      {
        "name": "榴芒先生",
        "star": 4.5,
        "sales": 37,
        "src": "http://i4.piimg.com/601998/da9e00c0bccd6fb0.jpg",
        "initial_price": 58,
        "distribution_price": 0,
        "distance": "6.8km",
        "time": 49
      }
    ],
    currentLocation:"您当前的位置：",
    key:"",
    latitude: 23.099994,
    longitude: 113.324520,
    appsecret:"ea426ca5cd19b98868d73d5a6a22cbae",
access_token:"20_19nlbyRFRqHAt76W7WwTX2ES1X2zQst5yq2u1C5bswpKZv-qUda63pQyixrFDMBO6G49APOpgrIRFzAUxHvihFV38GyyaHFkADvFu-5Ny84ZVRTkxjhmvPe2CRvJ1bOftSZgvFLHJhf_QLTEENRfAIAHQU",
  openid:"",
  form_id:"",
  swiper:{
    swiperBackground:"../../image/swiperBackground.png",
    swiperIndex: 0,
    swiperImgList: [
      "../../image/swiper-1.jpg",
      "../../image/swiper-2.jpg",
      "../../image/swiper-3.jpg",
      "../../image/swiper-4.jpg",
      "../../image/swiper-5.jpg",
    ],
  },
  

  },
  //初始化地图
  onReady: function (e) {
    console.log(app.globalData.userInfo);
    if (app.globalData.userInfo==null){
      myDialog.showModal({
        title: "提示",
        content: "确定使用当前微信号登录小程序？",
        confirmOpenType: "getUserInfo",  //如果不设置就是普通弹框
        success: (e) => {
          console.log("e", e);
          let userInfo = e.detail.userInfo;
          // wx.setStorageSync("userInfo", userInfo);
          getApp().globalData.userInfo = userInfo;
          console.log(app.globalData.userInfo)
        },
        fail: (err) => {
          // 用户不小必点到拒绝,提示登录失败
          wx.showToast({
            title: "登录失败",
            icon: "none"
          });
        }
      });
    }
  },
  
  onLoad: function () {
    var that = this;
//获取用户当前位置
    wx.login({
      //获取code
      success: function (res) {
        var code = res.code; //返回code
        console.log(code);
        var appId = 'wx5000fdec864c14f2';
        var secret = that.data.appsecret;
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
          data: {},
          header: {
            'content-type': 'json'
          },
          success: function (res) {
            that.setData({
              openid: res.data.openid
            })

            console.log('openid为' + that.data.openid);
          }
        })
      }
    });
 
    qqmapsdk = new QQMapWX({
      key: "EJKBZ-W4HKQ-MYR5T-G4BHS-ATA47-QMFLY", // 必填
    });

    var postion = that.data.currentLocation;
    qqmapsdk.reverseGeocoder({
      //位置坐标，不填为为默认当前位置，非必须参数
      /**
       * 
       //Object格式
        location: {
          latitude: 39.984060,
          longitude: 116.307520
        },
      */
      /**
       *
       //String格式
        location: '39.984060,116.307520',
      *///获取表单传入的位置坐标,不填默认当前位置,示例为string格式
      //get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
      success: function (res) {//成功后的回调

        var res = res.result;
        postion = postion + res.address_component.district + res.address_component.street_number;
        console.log(res);
        console.log(postion);
        that.setData({
          currentLocation: postion
        })
      }
    });
  },
  //swiper页面切换事件
  swiperChange: function (e) {
    var that = this;
    //console.log(e);
    that.setData({
      swiperIndex: e.detail.current
    })
  },
  //获取位置
  getCenterLocation: function () {
    var that = this
    that.mapCtx.getCenterLocation({
      success: function (res) {
        console.log('经度', res.longitude)
        console.log('纬度', res.latitude)
        that.setData({
          location: '经度:' + res.longitude + '纬度:' + res.latitude
        })

      }
    })

  },
  scaleClick: function () {
    this.setData({
      scale: 10,
    })
  },
  // 移动位置
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  // 移动标注
  translateMarker: function () {
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude: 23.10229,
        longitude: 113.3345211,
      },
      animationEnd() {
        console.log('动画结束')
      }
    })
  },
  //缩放视野展示所有经纬度
  includePoints: function () {
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude: 23.10229,
        longitude: 113.3345211,
      }, {
        latitude: 23.00229,
        longitude: 113.3345211,
      }]
    })
  },

  chooseLocation:function(){
   // 用户手动选择地址
   var that=this;
    wx.chooseLocation({
      type: 'gcj02',//'wgs84',
      success: function (res) {
        console.log(res.latitude)
        console.log(res.longitude)
        console.log(res)
        console.log(res.address)
        that.setData({
          currentLocation:"您当前的位置："+res.name
        })
      }
    })
  },
  getFormID: function (e) {
    var that = this;
    console.log(e)
    console.log("formid=",e.detail.formId)
    that.setData({
      form_id:e.detail.formId
    })
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx5000fdec864c14f2&secret=ea426ca5cd19b98868d73d5a6a22cbae',
      success(a) {
        console.log(a)
        console.log("token=",a.data.access_token)
        that.setData({
          access_token: a.data.access_token
        })

        let url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + that.data.access_token;
        let _jsonData = {
          access_token: that.data.access_token,
          touser: "o4Vuf4tmsIjXCmdi4PTTXvEKQHWU",//that.data.openid,
          template_id: '7_9wNAhHrjwRnEOANNRf9yZDLVFdzKJTurHLBgRMhko',
          form_id: that.data.form_id,
          page: "pages/index/index",
          data: {
            "keyword1": { "value": "测试数据一", "color": "#173177" },
            "keyword2": { "value": "测试数据二", "color": "#173177" },
            "keyword3": { "value": "测试数据三", "color": "#173177" },
            "keyword4": { "value": "测试数据四", "color": "#173177" },
          }
        }
        wx.request({
          url: url,
          data: _jsonData,
          method:"POST",
          success: function (res) {
            console.log("sent succes!", res)
          },
          fail: function (err) {
            console.log('request fail ', err);
          },
          complete: function (res) {
            console.log("request completed!", res);
          }
        })
        console.log(that.data.access_token)
      }
    });
  }
})
