var app = getApp();
const APIURL = require('../../utils/api.js');

Page({
    data: {
      cateItems: [],
      foodList:[],
      curNav: 0,
      curIndex: 1,
      imageUrl: "https://mingrui-static.oss-cn-shenzhen.aliyuncs.com/",
      StaticImgUrl: "http://mingrui-static.oss-cn-shenzhen.aliyuncs.com/zq/",
    },
    onLoad: function(e) {
      wx.showToast({
        title: "加载中",
        icon: 'loading',
        duration: 1000
      })
        var that = this;
        
        wx.request({
          url: APIURL.GoodsCategory,
          data: {
            code: wx.getStorageSync("userCode"),
            rawData: wx.getStorageSync("userInfo"),
          },
          method:"GET",
          //请求头
          header: {
            "Content-Type": "applciation/json",
            'Authorization': 'Bearer ' + wx.getStorageSync('userToken')
          },
          success: function (e) {
            console.log(e)
            that.setData({
              cateItems: e.data.data.brotherCategory,
            })
            console.log(that.data.cateItems)
            var currentCategory = that.data.cateItems[0]; 
            that.getFoodList(currentCategory.id);
          }
        })
    },
    //事件处理函数  
    switchRightTab: function(e) {
      var that = this;
      // 获取item项的id，和数组的下标值  
      let id = e.target.dataset.id,
          index = parseInt(e.target.dataset.index);
      // 把点击到的某一项，设为当前index  
      // console.log(id);
      // console.log(index);
      this.setData({
          curNav: id,
          curIndex: index
      })
      var currentCategory = this.data.cateItems[index];
      console.log(currentCategory);
      this.getFoodList(currentCategory.id);
    },
  getFoodList: function (category_id){
    var that = this;
          wx.request({
            url: APIURL.GoodsList,
            data: {
              code: wx.getStorageSync("userCode"),
              rawData: wx.getStorageSync("userInfoInServer"),
              category_id: category_id,
            },
            method: "GET",
            //请求头
            header: {
              "Content-Type": "applciation/json",
              'Authorization': 'Bearer ' + wx.getStorageSync('userToken')
            },
            success: function (e) {
              console.log(e);             
                that.setData({
                  foodList:e.data,
                })
              console.log(that.data.foodList);             
            }
          })
      
    },
    gotoFoodDetail: function(e) {
        console.log(e);
        var foodId = e.currentTarget.dataset.food.id;
        
        wx.navigateTo({
          url: '../foodDetail/index?foodId=' + foodId,
        })
    }

})