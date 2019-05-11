// pages/car/index.js
const APIURL = require("../../utils/api.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    StaticImgUrl: "http://mingrui-static.oss-cn-shenzhen.aliyuncs.com/zq/",
    pronum: [],
    num: 1,
    car: [],
    
    totalPrice: 0,
    totalnum: 0,
    pic: '',

    cartList:[],//后台返回的购物车列表
    cartTotal:{},//购物车的商品总数量，全部价格
    selectedAll: true,//商品全选
    checkedNumInCart:0,//当前购物车中勾选的商品个数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function(options) {
    var that = this;
    wx.showToast({
      title: "加载中",
      icon: 'loading',
      duration: 1500
    })
    this.refreshCartList();
    //缓存购物车数据到本地
    wx.setStorageSync("userCartListInServer", that.data.cartList);
    wx.setStorageSync("userCartTotalInServer", that.data.cartTotal);
    //设置tabbar

    if (that.data.cartList.length){
      wx.setTabBarBadge({
        index: 3,
        text: that.data.cartList.length.toString(),
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    //离开购物车页面前把本地的购物车上传到后台

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    setTimeout(function() {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  gotoindex() {
    wx.switchTab({
      url: '../index/index',
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //改变勾选
  selectedlist: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var goods_id = that.data.cartList[index].goods_id;
    var product_id = that.data.cartList[index].product_id;
    var checked = that.data.cartList[index].checked;//当前商品勾选值
    if(checked){
      checked = 0;
      that.setData({
        selectedAll:false,
        checkedNumInCart:parseInt(that.data.checkedNumInCart) - 1,
      })
    }else{
      checked = 1;
      console.log(that.data.checkedNumInCart);
      let numTemp = parseInt(that.data.checkedNumInCart) + 1;
      console.log(numTemp);
      if(numTemp >= that.data.cartList.length){
        that.setData({
          checkedNumInCart: numTemp,
          selectedAll: true
        })
      }else{
        that.setData({
          checkedNumInCart: numTemp,
        })
      }  
    }

    wx.request({
      url: APIURL.CartChecked,
      data: {
        code: wx.getStorageSync("userCode"),
        rawData: wx.getStorageSync("userInfo"),
        goods_id: goods_id,
        product_id: product_id,
        checked: checked
      },
      method: "POST",
      //请求头
      header: {
        "Content-Type": "applciation/json",
        'Authorization': 'Bearer ' + wx.getStorageSync('userToken')
      },
      success: function (e) {
        console.log(e);
        that.setData({
          cartList: e.data.data.cartList,
          cartTotal: e.data.data.cartTotal
        })
      }
    })
},
  //购物车加
  addnum: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var cartId = that.data.cartList[index].id;
    var number = that.data.cartList[index].number + 1;
    if(number >=99){
      return
    }
    that.changeFoodNum(cartId,number);
  },
  //购物减
  subnum: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var cartId = that.data.cartList[index].id;
    var number = that.data.cartList[index].number - 1;
    if(number < 0){
      return 
    }
    that.changeFoodNum(cartId, number);

  },
  //提交商品数量到后台
  changeFoodNum:function(cartId,number){
    var that = this;
    wx.request({
      url: APIURL.CartUpdate,
      data: {
        code: wx.getStorageSync("userCode"),
        rawData: wx.getStorageSync("userInfo"),
        id:cartId,
        number:number
      },
      method: "POST",
      //请求头
      header: {
        "Content-Type": "applciation/json",
        'Authorization': 'Bearer ' + wx.getStorageSync('userToken')
      },
      success: function (e) {
        console.log(e.data.data);
        that.setData({
          cartList: e.data.data.cartList,
          cartTotal: e.data.data.cartTotal
        })
      }
    })
  },
  //购物车删除
  delecart: function (e) { 
    var that = this;
    var index = e.currentTarget.dataset.index;
    var cartId = that.data.cartList[index].id;
    var goods_id = that.data.cartList[index].goods_id;

    wx.showModal({
      title: '提示',
      content: '确认将该商品移出购物车吗?',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: APIURL.CartDelete,
            data: {
              code: wx.getStorageSync("userCode"),
              rawData: wx.getStorageSync("userInfo"),
              id: cartId,
              goods_id:goods_id,
            },
            method: "POST",
            //请求头
            header: {
              "Content-Type": "applciation/json",
              'Authorization': 'Bearer ' + wx.getStorageSync('userToken')
            },
            success: function (e) {
              console.log(e.data.data);
              that.setData({
                cartList: e.data.data.cartList,
                cartTotal: e.data.data.cartTotal,
              })
              //判断剩余的商品是否已经全部勾选
              var beLeftCheckedNum = 0;
              for (let item of that.data.cartList) {
                if (item.checked) {
                  beLeftCheckedNum += 1;
                  if (beLeftCheckedNum >= that.data.cartList.length) {
                    console.log(that.data.cartList.length);
                    that.setData({
                      selectedAll: true,
                    })
                  }
                }
                that.setData({
                  checkedNumInCart: beLeftCheckedNum,
                })
              }
            }
          });
          wx.showToast({
            title: '删除成功',
          })
        }
      }
    })
    
  },
  //购物车全选事件
  selectedAll: function() {
    var that = this;
    var checked_all = that.data.selectedAll;//当前值
    if (checked_all){
      checked_all = 0;
      that.setData({
        checkedNumInCart:that.data.cartList.length,
      })
    }else{
      checked_all = 1;
      that.setData({
        checkedNumInCart: 0,
      })
    }
    wx.request({
      url: APIURL.CartChechedAll,
      data: {
        code: wx.getStorageSync("userCode"),
        rawData: wx.getStorageSync("userInfo"),
        checked_all: checked_all,
      },
      method: "POST",
      //请求头
      header: {
        "Content-Type": "applciation/json",
        'Authorization': 'Bearer ' + wx.getStorageSync('userToken')
      },
      success: function (e) {
        console.log(e);
        that.setData({
          selectedAll:checked_all,
          cartList: e.data.data.cartList,
          cartTotal: e.data.data.cartTotal
        })
      }
    });
  },
  goOrder:function(e){
    wx.navigateTo({
      url: '../comfireOrder/comfireOrder',
    })
  },
  //重新读取后台购物车列表
  refreshCartList:function(e){
    var that = this;

    wx.request({
      url: APIURL.CartList,
      data: {
        code: wx.getStorageSync("userCode"),
        rawData: wx.getStorageSync("userInfo"),
      },
      method: "GET",
      //请求头
      header: {
        "Content-Type": "applciation/json",
        'Authorization': 'Bearer ' + wx.getStorageSync('userToken')
      },
      success: function (e) {
        console.log(e.data.data);
        that.setData({
          cartList: e.data.data.cartList,
          cartTotal: e.data.data.cartTotal,
          checkedNumInCart:0,
        })

        for (let item of that.data.cartList) {
          console.log(item);
          if (item.checked) {
            that.setData({
              checkedNumInCart: that.data.checkedNumInCart + 1,
            })
          }else{
            that.setData({
              selectedAll: false
            })
          }
        }
        console.log(that.data.checkedNumInCart);
        if (that.data.checkedNumInCart > that.data.cartList.length){
          that.setData({
            selectedAll:true,
          })
        }
      } 
    });
  }
})