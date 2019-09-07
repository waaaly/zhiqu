var server = require('./data.js');
const groupList = server.groupList;
import http from '../../utils/Base';
import api from '../../utils/API';
Page({
  data: {
    imageUrl: "https://mingrui-static.oss-cn-shenzhen.aliyuncs.com/",
    swiperList:[],
    currentClassify:'全部团购',
    secClass:'',//第二分类
    moreText:'更多分类',
    moreClass:[],//剩余分类列表
    xialaShow:false,
    goodSwiperHeight:250,
    current: 0,
    headlines: [
      "智趣团购火热进行中快来参与吧～",
      "各式各样的团购商品等你来战！妈妈再也不用担心我的钱没处花啦",
      "最后三天，最后三天，错过等一年！"
    ],
    productList: []
  },
  onLoad: function (options) {
   //团购商品轮播
    http.get(api.GroupCarousel,{}).then(res=>{
      this.setData({
        swiperList:res,
      })
    })
  },
  onShow(e){
    //团购列表
    http.get(api.GroupList,{}).then(res=>{
      console.log(res);
      groupList.init(res);
      this.setData({
        productList:groupList.getAll(),
        secClass:groupList.getClassify()[0],
        moreClass:groupList.getClassify().splice(1)
      })
    })
  },
  hideXiala(e){
    this.setData({
      xialaShow:false,
    })
  },
  change: function (e) {
    this.setData({
      current: e.detail.current
    })
  },
  detail: function (e) {
    var currentGroup ={
      goods_id:e.currentTarget.dataset.goodsid,
      group_id: e.currentTarget.dataset.groupid,
    }
    wx.setStorageSync('currentGroup', currentGroup);
    wx.navigateTo({
      url: '/tuangou/pages/product',
    })
  },

  xiala:function(e){
    var that = this;
    that.setData({
      xialaShow:true,
    })
  },
  //选择更多
  changeMore(e){
    this.setData({
      moreText:e.currentTarget.dataset.item,
      xialaShow:false
    })
    this.changeClassify(e); 
  },
  //改变分类
  changeClassify(e){
    this.setData({
      currentClassify:e.currentTarget.dataset.item,
    })
    this.getProducetList(e.currentTarget.dataset.item)
  },
  //获取数据
  getProducetList(name){
    console.log(name)
    console.log(groupList.getClassifyProduct(name));
    this.setData({
      productList:groupList.getClassifyProduct(name),
    })
  }
})