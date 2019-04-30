//index.js
import myDialog from "../../template/loginDialog/loginDialog"
//引入sdk核心类
var QQMapWX = require('../../libs/sdk/qqmap-wx-jssdk.js');
//实例化api核心类
var qqmapsdk;
var util = require('../../utils/util.js');
    //关联app。js
var app = getApp();
Page({
    data: {
        shangjiaList:[{
                "name": "正新鸡排",
                "star": 5,
                "sales": 1161,
          "src": "http://pic0.gzcfe.net/article/2019/0312/5291556380420181255.jpg",
                "initial_price": 20,
                "distribution_price": 0,
                "distance": "1.5km",
                "time": 30
            },
            {
                "name": "板凳烧烤",
                "star": 4,
                "sales": 330,
              "src": "http://pic0.gzcfe.net/article/2019/0312/5291556380420181255.jpg",
                "initial_price": 50,
                "distribution_price": 3,
                "distance": "3.3km",
                "time": 56
            },
            {
                "name": "味多美炸鸡汉堡",
              "src": "http://pic0.gzcfe.net/article/2019/0312/5291556380420181255.jpg",
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
              "src": "http://pic0.gzcfe.net/article/2019/0312/5291556380420181255.jpg",
                "initial_price": 30,
                "distribution_price": 1,
                "distance": "2.6km",
                "time": 44
            },
            {
                "name": "御膳房",
              "src": "http://pic0.gzcfe.net/article/2019/0312/5291556380420181255.jpg",
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
              "src": "http://pic0.gzcfe.net/article/2019/0312/5291556380420181255.jpg",
                "initial_price": 15,
                "distribution_price": 0,
                "distance": "1.3km",
                "time": 52
            },
            {
                "name": "榴芒先生",
                "star": 4.5,
                "sales": 37,
              "src": "http://pic0.gzcfe.net/article/2019/0312/5291556380420181255.jpg",
                "initial_price": 58,
                "distribution_price": 0,
                "distance": "6.8km",
                "time": 49
            }
        ],
        currentAddress: "",
        key: "",
        latitude: 23.099994,
        longitude: 113.324520,
        appsecret: "ea426ca5cd19b98868d73d5a6a22cbae",
        access_token: "20_19nlbyRFRqHAt76W7WwTX2ES1X2zQst5yq2u1C5bswpKZv-qUda63pQyixrFDMBO6G49APOpgrIRFzAUxHvihFV38GyyaHFkADvFu-5Ny84ZVRTkxjhmvPe2CRvJ1bOftSZgvFLHJhf_QLTEENRfAIAHQU",
        openid: "",
        form_id: "",
        swiper: {
            swiperIndex: 0,
            swiperImgList: [
                "http://pic0.gzcfe.net/article/2019/0312/5291556380420181255.jpg",             "http://pic0.gzcfe.net/article/2019/0312/5291556380420181255.jpg",
                "http://pic0.gzcfe.net/article/2019/0312/5291556380420181255.jpg",
                "http://pic0.gzcfe.net/article/2019/0312/5291556380420181255.jpg",
                "http://pic0.gzcfe.net/article/2019/0312/5291556380420181255.jpg",
            ],
        },
        marqueePace: 1, //滚动速度
        marqueeDistance: 0, //初始滚动距离
        marquee_margin: 30,
        size: 14,
        interval: 20, // 时间间隔
        sortSelected: 0, //商家排序方式
    },

    onReady: function(e) {

    },

    onLoad: function() {
        var that = this;
        //读取本地缓存查看用户是否已经登录
        var userTokenStorage;
        wx.getStorage({
            key: 'userToken',
            success: function(res) {
                console.log(res);
                userTokenStorage = res.data;
            },
            fail: function(res) {
            }
        })

        // wx.openSetting({

        // })
        //引入TX地图SDK
        qqmapsdk = new QQMapWX({
            key: "EJKBZ-W4HKQ-MYR5T-G4BHS-ATA47-QMFLY", // 必填
        });
        //根据当前的经纬度获取用户当前地址信息
        var postion = that.data.currentAddress;
        qqmapsdk.reverseGeocoder({
            success: function(res) {
                //成功后显示当前的地址信息
                var res = res.result;
                postion = postion + res.address_component.district + res.address_component.street_number;
                console.log(res);
                console.log(postion);
                that.setData({
                    currentAddress: postion
                })
            },
            fail: function(e) {
                console.log(e)
              that.setData({
                currentAddress: '出了点问题小趣正在努力处理中～'
              })
            }
        });
    },
    //swiper页面切换事件
    swiperChange: function(e) {
        var that = this;
        //console.log(e);
        that.setData({
            swiperIndex: e.detail.current
        })
    },
    //swiper点击事件
    gotoHotFood: function(e) {
        console.log(e);
        wx.navigateTo({
            url: '../foodDetail/foodDetail',
        })
    },
    // 用户手动选择地址
    userChooseLocation: function() {
      var that = this;
      wx.navigateTo({
        url: '../chooseAddress/chooseAddress?currentAddress='+that.data.currentAddress,
      })
    },
    //切换附近商家排序条件
    onTapTag: function(e) {
        console.log(e)
        var that = this;
        that.setData({
            sortSelected: e.currentTarget.dataset.index,
        })
    }
})