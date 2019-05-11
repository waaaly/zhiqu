var WxParse = require('../wxParse/wxParse.js');
const APIURL = require("../../utils/api.js");
// import ajax from '../../utils/data'
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    moredata: false,
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    currentTab: 0,// tab切换
    detalimg: [],
    bigtitle: '',
    smalltitle: '',
    smallprice: '',
    bigprice: '',
    active: true,
    chose: [],
    
    goodsId: '',
    chosename: '',
    propertyChildIds: "",
    propertyChildNames: "",
    paycar: false,
    maxnum: 0,//能购买的最大库存
    chosebox: '',//选中的商品属性
    carlist:[],
    
    goodsId:'',
    start:false,

    showEvote:false,//是否显示商品评价
    foodObj:{},//商品对象
    imageUrl: "https://mingrui-static.oss-cn-shenzhen.aliyuncs.com/",
    isDelOutCar:false,//商品是否可以移除购物车
    jionInCarId:0,//当前商品加入的购物车id
    detailnumber: 1,//当前选择购买的商品个数
    totalnum: 0,//购物车中所有的商品数量
    cartList: [],//后台返回的购物车列表
    cartTotal: {},//购物车的商品总数量，全部价格
  
  },

  onLoad: function (options) {
    var that = this;
    // that.total();
    wx.showToast({
      title: "加载中",
      icon: 'loading',
      duration: 1500
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
    
    wx.request({
      url: APIURL.GoodsDetail,
      data: {
        code: wx.getStorageSync("userCode"),
        rawData: wx.getStorageSync("userInfo"),
        gid: options.foodId,
      },
      method: "GET",
      //请求头
      header: {
        "Content-Type": "applciation/json",
        'Authorization': 'Bearer ' + wx.getStorageSync('userToken')
      },
      success: function (e) {
        console.log(e.data.data);
        if(e.data.data.length!=0){
          that.setData({
            foodObj:e.data.data[0],      
          })  
          //解析富文本
          WxParse.wxParse('imgcontent', 'html', e.data.data[0].html, that, 5);
        }
      }
    }); 
           
    var check = that.data.chose
    for (var i = 0; i < check.length; i++) {
      var checksize = check[i].childsCurGoods[0].checked
      check[i].childsCurGoods[0].checked = true
      that.setData({
        chose: check
      })
    } that.getchose()
      
  },
  onShow:function(e){
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
        
        })
        //查看当前商品是否在购物车列表中
        let currentGoodId = that.data.foodObj.id;
       console.log(currentGoodId);
        for(let item of that.data.cartList){
          if (item.goods_id == currentGoodId){
            that.setData({
              isDelOutCar:true,
            })
          }
        }
      }
    });
  
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  onReachBottom: function () {
    setTimeout(() => {
      this.setData({
        isHideLoadMore: true,
      })
    }, 1500)

  },
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current })
  },
  //购买选择规格价格
  labelItemTap: function () {
  },
  clickSkuValue: function (event) {
    var that = this;
    var specNameId = event.currentTarget.dataset.nameId;
    var specValueId = event.currentTarget.dataset.valueId;
    //TODO 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环
    var _specificationList = this.data.chose;
    for (var i = 0; i < _specificationList.length; i++) {
      if (_specificationList[i].id == specNameId) {
        for (var j = 0; j < _specificationList[i].childsCurGoods.length; j++) {
          if (_specificationList[i].childsCurGoods[j].id == specValueId) {
            //如果已经选中，则反选
            if (_specificationList[i].childsCurGoods[j].checked) {
              _specificationList[i].childsCurGoods[j].checked = true;
            } else {
              _specificationList[i].childsCurGoods[j].checked = true;
            }
          } else {
            _specificationList[i].childsCurGoods[j].checked = false;
          }
        }
      }
    }
    this.setData({
      'chose': _specificationList
    });
    this.getchose()
  },
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  total:function(){
    var len = wx.getStorageSync("addcart")
    var total=0
    for(var i=0;i<len.length;i++){
      total+=len[i].number
    }
    this.setData({
      totalnum:total
    })
  },
  gotocart:function() {
    wx.switchTab({
      url: '../car/index',
    })
  },
  //数量减
  cutnumber: function () {
    if (this.data.detailnumber == 1){
      return 
    }
    this.setData({
      detailnumber: this.data.detailnumber - 1,
    })
  },
  //数量加
  addnumber: function () {
    this.setData({
      detailnumber: this.data.detailnumber + 1,
    })
  },
  //加入购物车
  addcart: function () {
    var that = this;
    wx.request({
      url: APIURL.CartAdd,
      data: {
        code: wx.getStorageSync("userCode"),
        rawData: wx.getStorageSync("userInfo"),
        goods_id:that.data.foodObj.id,
        product_id: that.data.foodObj.primary_product_id,
        number:that.data.detailnumber
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
          
          isDelOutCar: true,
          cartList: e.data.data.cartList,
          cartTotal: e.data.data.cartTotal,
          
        });
        wx.showToast({
          title: '添加成功',
        });
      }
    })
   
  },
  //移除购物车
  delOutcart:function(e){  
    var that= this;
    console.log(that.data.isDelOutCar)
    var currentGoodId = that.data.foodObj.id;
    var currentCartId = 0;
    for(let item of that.data.cartList){
      if(item.goods_id == currentGoodId){
        currentCartId = item.id;
        break;
      }
    }
    if(!that.data.isDelOutCar){
      return;
    }
    wx.showModal({
      title: '提示',
      content: '确认将当前商品移出购物车吗?',
      success: function (res) {
        wx.request({
          url: APIURL.CartDelete,
          data: {
            code: wx.getStorageSync("userCode"),
            rawData: wx.getStorageSync("userInfo"),
            id: currentCartId,
            goods_id: currentGoodId,
          },
          method: "POST",
          //请求头
          header: {
            "Content-Type": "applciation/json",
            'Authorization': 'Bearer ' + wx.getStorageSync('userToken')
          },
          success: function (e) {
            console.log(e.data.data);
            wx.showToast({
              title: '移出成功',
            })
            that.setData({
              isDelOutCar: false,
              cartList: e.data.data.cartList,
              cartTotal: e.data.data.cartTotal,
            })
          }
      })
    }
    })
  },
  //收藏商品
  Collection:function(){
    var that=this
    var colldata={}
    colldata.url ="shop/goods/fav/add"
    colldata.data={}
    colldata.data.token =getApp().globalData.token
    colldata.data.goodsId = that.data.goodsId

  },
  //获取所有选中的商品规格数据
  getchose() {
    var that = this
    var needSelectNum = that.data.chose.length;
    var curSelectNum = 0;
    var propertyChildIds = "";
    var propertyChildNames = "";
    for (var i = 0; i < that.data.chose.length; i++) {
      var childs = that.data.chose[i].childsCurGoods;
      for (var j = 0; j < childs.length; j++) {
        if (childs[j].checked == true) {
          curSelectNum++;
          propertyChildIds = propertyChildIds + that.data.chose[i].id + ":" + childs[j].id + ",";
          propertyChildNames = propertyChildNames + childs[j].name;
        }
        that.setData({
          chosename: propertyChildNames,
          chosebox: propertyChildIds
        })
        var parcar = false
        if (
          curSelectNum == needSelectNum//规格选项必须选中
        ) {
          parcar = true
        }
        if (
          parcar
        ) {
          var detail = {}
          detail.data = {}
          detail.data.goodsId = that.data.goodsId
          detail.data.propertyChildIds = propertyChildIds
          detail.url = "shop/goods/price"
          detail.method = "GET"
        }
      }
    }

  },
})