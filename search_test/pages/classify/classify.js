var app=getApp();
var classifyUrl ="https://test.mingrui-gz.com/api/goods-category";

Page({
  data: {
    cateItems: [],
    curNav: 0,
    curIndex: 1,
    appRequst:"https://mingrui-static.oss-cn-shenzhen.aliyuncs.com//"
  },
  onLoad:function(e){
    var that=this;
    wx.request({
      url: classifyUrl,
      success:function(e){
        console.log(e)
        that.setData({
          cateItems:e.data.data,
        })
        console.log(that.data.cateItems)
      }
      
    });
    
  },
  //事件处理函数  
  switchRightTab: function (e) {
    // 获取item项的id，和数组的下标值  
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);
    // 把点击到的某一项，设为当前index  
    this.setData({
      curNav: id,
      curIndex: index
    })
  },
  gotoFoodDetail:function(e){
    console.log(e);
    var foodName=
    wx.navigateTo({
      url: '../foodDetail/foodDetail?foodObj='+JSON.stringify(this.data.testData),
    })
  }

}) 