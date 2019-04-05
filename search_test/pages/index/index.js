//index.js

/*(1)markers属性 标记点用于在地图上显示标记的位置
  id  标记点id marker点击事件回调会返回此id。建议为每个marker设置上Number类型id，保证更新marker时有更好的性能。
  latitude  纬度  浮点数，范围 -90 ~ 90
  longitude   经度  浮点数，范围 -180 ~ 180
  title   标注点名 
  zIndex  显示层级 
  iconPath  显示的图标   项目目录下的图片路径，支持相对路径写法，以'/'开头则表示相对小程序根目录；也支持临时路径和网络图片（2.3.0）
  rotate  旋转角度    顺时针旋转的角度，范围 0 ~ 360，默认为 0
  alpha   标注的透明度  默认1，无透明，范围 0 ~ 1
  width   标注图标宽度    默认为图片实际宽度，单位px（2.4.0起支持rpx）
  height  标注图标高度    默认为图片实际高度，单位px（2.4.0起支持rpx）
  callout   自定义标记点上方的气泡窗口   支持的属性见下表，可识别换行符。 
  label   为标记点旁边增加标签  支持的属性见下表，可识别换行符。 
  anchor  经纬度在标注图标的锚点，默认底边中点  {x, y}，x表示横向(0-1)，y表示竖向(0-1)。{x: .5, y: 1} 表示底边中点   
  aria-label  无障碍访问，（属性）元素的额外描述
*/

/*(2)marker 上的气泡 callout
  content   文本  
  color   文本颜色  
  fontSize  文字大小  
  borderRadius  边框圆角  
  borderWidth   边框宽度 
  borderColor   边框颜色  
  bgColor   背景色    
  padding   文本边缘留白 
  display   'BYCLICK':点击显示; 'ALWAYS':常显    
  textAlign   文本对齐方式。有效值: left, right, center  
*/
//引入sdk核心类
var QQMapWX = require('../../libs/sdk/qqmap-wx-jssdk.js');
//实例化api核心类
var qqmapsdk;
var util=require('../../utils/util.js')
Page({
  data: {
    currentLocation:"您当前的位置：",
    key:"",
    latitude: 23.099994,
    longitude: 113.324520,
    appsecret:"ea426ca5cd19b98868d73d5a6a22cbae",
access_token:"20_19nlbyRFRqHAt76W7WwTX2ES1X2zQst5yq2u1C5bswpKZv-qUda63pQyixrFDMBO6G49APOpgrIRFzAUxHvihFV38GyyaHFkADvFu-5Ny84ZVRTkxjhmvPe2CRvJ1bOftSZgvFLHJhf_QLTEENRfAIAHQU",
  openid:"",
  form_id:""
  },
  //初始化地图
  onReady: function (e) {
    
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

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

//获取用户当前位置
  onLoad: function () {
    
    var that = this;

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
        postion = postion+res.address;
        console.log(res);
        console.log(postion);
        that.setData({
          currentLocation:postion
        })
      }
    });
  },
  chooseLocation:function(){
   // 用户手动选择地址
   var that=this;
    wx.chooseLocation({
      type: 'gcj02',//'wgs84',
      success: function (res) {
        console.log(res.latitude)
        console.log(res.longitude)
        console.log(res.name)
        console.log(res.address)
        that.setData({
          currentLocation:"您当前的位置："+res.address
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


  
        /**
         *  当get_poi为1时，检索当前位置或者location周边poi数据并在地图显示，可根据需求是否使用
         *
            for (var i = 0; i < result.pois.length; i++) {
            mks.push({ // 获取返回结果，放到mks数组中
                title: result.pois[i].title,
                id: result.pois[i].id,
                latitude: result.pois[i].location.lat,
                longitude: result.pois[i].location.lng,
                iconPath: './resources/placeholder.png', //图标路径
                width: 20,
                height: 20
            })
            }
        *
        **/
        //当get_poi为0时或者为不填默认值时，检索目标位置，按需使用
      /*  mks.push({ // 获取返回结果，放到mks数组中
          title: res.address,
          id: 0,
          latitude: res.ad_info.location.lat,
          longitude: res.ad_info.location.lng,
          iconPath: './resources/placeholder.png',//图标路径
          width: 20,
          height: 20,
          callout: { //在markers上展示地址名称，根据需求是否需要
            content: res.address,
            color: '#000',
            display: 'ALWAYS'
          }
        });
        _this.setData({ //设置markers属性和地图位置poi，将结果在地图展示
          markers: mks,
          poi: {
            latitude: res.ad_info.location.lat,
            longitude: res.ad_info.location.lng
          }
        });
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    })*/

    //获取系统时间调用不同的地图样式
    /*var that = this;
    var time = (new Date());
    console.log(time.getHours())
    if(time>18){
      that.setData({
        key:"YT6BZ-YKUWJ-4ONFY-K5WHU-Q6VJ5-QVBM"
      })
    }else{
      that.setData({
        key:"YJRBZ-K45KX-TXS4Z-T56HV-ND632-P7F2S"
      })
    }*/
    //用户手动选择地址
    // wx.chooseLocation({
    //   type: 'gcj02',//'wgs84',
    //   success: function (res) {
    //       console.log(res.latitude)
    //      console.log(res.longitude)
    //     console.log(res.name)
    //     console.log(res.address)
    //     var speed = res.speed
    //     var accuracy = res.accuracy
    //     that.setData({
    //       latitude:res.latitude,
    //       longitude:res.longitude
    //     })
    //   }
    // })
    //用户查看当前位置
    // wx.getLocation({
    //   type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
    //   success(res) {
    //     const latitude = res.latitude
    //     const longitude = res.longitude
    //     wx.openLocation({
    //       latitude,
    //       longitude,
    //       scale: 18
    //     })
    //   }
    // })
  



  


//获取应用实例
/*const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})*/
