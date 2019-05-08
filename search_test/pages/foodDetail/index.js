var WxParse = require('../wxParse/wxParse.js');
const APIURL = require("../../utils/api.js");
// import ajax from '../../utils/data'
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 0,
    detalimg: [],
    bigtitle: '',
    smalltitle: '',
    smallprice: '',
    bigprice: '',
    active: true,
    chose: [],
    moredata: false,
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    detailnumber: 1,
    goodsId: '',
    chosename: '',
    propertyChildIds: "",
    propertyChildNames: "",
    paycar: false,
    maxnum: 0,//能购买的最大库存
    chosebox: '',//选中的商品属性
    carlist:[],
    totalnum:0,
    goodsId:'',
    start:false,

    showEvote:false,//是否显示商品评价
    foodObj:{},//商品对象
    imageUrl: "https://mingrui-static.oss-cn-shenzhen.aliyuncs.com/"
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  onLoad: function (options) {
    var that = this;
    that.total();
    wx.showToast({
      title: "加载中",
      icon: 'loading',
      duration: 1000
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
    // console.log(option);
    wx.request({
      url: APIURL.GoodsDetail,
      data: {
        code: wx.getStorageSync("userCode"),
        rawData: wx.getStorageSync("userInfo"),
        // gid: option.foodId,
        gid:10,
      },
      method: "GET",
      //请求头
      header: {
        "Content-Type": "applciation/json",
        'Authorization': 'Bearer ' + wx.getStorageSync('userToken')
      },
      success: function (e) {
        console.log(e)
        if(e.data.data.length!=0){
          that.setData({
            foodObj:e.data.data[0],
            
          })
          WxParse.wxParse('imgcontent', 'html', e.data.data[0].html, that, 5)
        }
      },
      fail: function (e) {
        console.log(e);
      }
    }); 
    // var wdata={}
        // wdata.data={}
        // wdata.data.id = options.id
        // wdata.url="shop/goods/detail"
        // wdata.method="GET"
        // ajax.wxdata(wdata,function(res){
        //   console.log(res);
        //   that.setData({
        //     goodsId: res.data.data.basicInfo.id,
        //     bigtitle: res.data.data.basicInfo.name,
        //     smalltitle: res.data.data.basicInfo.characteristic,
        //     smallprice: res.data.data.basicInfo.minPrice,
        //     bigprice: res.data.data.basicInfo.originalPrice,
        //     detalimg: res.data.data.pics,
        //     chose: res.data.data.properties,
        //     goodsId:options.id
        //   })
           
          var check = that.data.chose
          for (var i = 0; i < check.length; i++) {
            var checksize = check[i].childsCurGoods[0].checked
            check[i].childsCurGoods[0].checked = true
            that.setData({
              chose: check
            })
          } that.getchose()
      
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
  total(){
    var len = wx.getStorageSync("addcart")
    var total=0
    for(var i=0;i<len.length;i++){
      total+=len[i].number
    }
    this.setData({
      totalnum:total
    })
  },
  gotocart() {
    wx.switchTab({
      url: '../car/index',
    })
  },
  cutnumber: function () {//数量减
    this.setData({
      detailnumber: (this.data.detailnumber - 1 > 1) ? this.data.detailnumber - 1 :1
    })
  },
  addnumber: function () {//数量加
    this.setData({
      detailnumber: (this.data.detailnumber + 1 < this.data.maxnum) ? this.data.detailnumber + 1 : this.data.maxnum
    })
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
          var detail={}
              detail.data={}
              detail.data.goodsId=that.data.goodsId
              detail.data.propertyChildIds=propertyChildIds
              detail.url="shop/goods/price"
              detail.method="GET"
              // ajax.wxdata(detail,function(chose){
              //   if (
              //     chose.data.data.stores < 1
              //   ) {
              //     wx.showModal({
              //       title: '提示',
              //       content: '商品库存不足,请重新选择商品',
              //     })
              //     that.setData({
              //       detailnumber:0
              //     })
              //     return
              //   }
              //   else {
              //     that.setData({
              //       detailnumber: 1
              //     })
              //   }
              //   that.setData({
              //     maxnum: chose.data.data.stores,
              //     smallprice: chose.data.data.price
              //   })
              // });
        }
      }
    }

  },
  addcart: function () {//加入购物车
    if (
      this.data.detailnumber < 1
    ) {
      wx.showModal({
        title: '提示',
        content: '该商品库存不足,请重新选择',

      })
      return false
    }
    else {
      var cardetails = {}
      cardetails.goodsId = this.data.goodsId//商品ID
      cardetails.title = this.data.bigtitle//商品标题
      cardetails.price = this.data.smallprice//商品价格
      cardetails.propertyChildIds = this.data.chosebox//选中的规格ID
      cardetails.chosename = this.data.chosename//选中的规格名称
      cardetails.number = this.data.detailnumber//商品购买数量
      cardetails.maxnum = this.data.maxnum//商品最大购买数量
      cardetails.logisticsType =1
      cardetails.inviter_id = 0
      var pics = this.data.detalimg
      for (var i = 0; i < pics.length; i++) {
        var bigpic = pics[0].pic
        cardetails.pic = bigpic //商品图片
      }
      var showcar = wx.getStorageSync("addcart")
      if(showcar==undefined||showcar.length==0){
        this.data.carlist.push(cardetails)
      }
      else{
        showcar.push(cardetails)
        this.data.carlist=showcar
      }
      var list = this.data.carlist
      function merge(list) {
        var result = []
        var cache = {}
        list.forEach(item => {
          var key = `id:${item.goodsId},title${item.propertyChildIds}`
          var index = cache[key]
          if (index !== undefined) {
            result[index].number += item.number
          } else {
            result.push(Object.assign({}, item))
            cache[key] = result.length - 1
          }
        })
        return result
      }
      wx.setStorageSync("addcart", merge(list))
      this.total()
     wx.showToast({
       title: '加入购物车成功',
     })
    }
  },
  gocart: function () {//立即购买
    if (
      this.data.detailnumber < 1
    ) {
      wx.showModal({
        title: '提示',
        content: '该商品库存不足,请重新选择',

      })
      return false
    }
    else {
      var list=[]
      var cardetails = {}
      cardetails.goodsId = this.data.goodsId//商品ID
      cardetails.title = this.data.bigtitle//商品标题
      cardetails.price = this.data.smallprice//商品价格
      cardetails.propertyChildIds = this.data.chosebox//选中的规格ID
      cardetails.chosename = this.data.chosename//选中的规格名称
      cardetails.number = this.data.detailnumber//商品购买数量
      cardetails.maxnum = this.data.maxnum//商品最大购买数量
      cardetails.logisticsType = 0
      cardetails.inviter_id =0
      var pics = this.data.detalimg
      for (var i = 0; i < pics.length; i++) {
        var bigpic = pics[0].pic
        cardetails.pic = bigpic //商品图片
      }
      list.push(cardetails)
      wx.setStorageSync("paygoods",list)
      wx.navigateTo({
          url: '../pay/index',
      })
    }
  },
  Collection:function(){
    var that=this
    var colldata={}
    colldata.url ="shop/goods/fav/add"
    colldata.data={}
    colldata.data.token =getApp().globalData.token
    colldata.data.goodsId = that.data.goodsId
    // ajax.wxdata(colldata,function(res){
     
    //   if(res.data.code==0){
    //     wx.showToast({
    //       title: '收藏成功'
    //     })
    //   }
    //   else{
    //     wx.showToast({
    //       title: res.data.msg
    //     })
    //   }
    // })
  },
})
