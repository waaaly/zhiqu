// pages/chooseAddress/chooseAddress.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentAddress:"",
    userAddressInServer:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(!wx.getStorageSync("userAddressInServer")){
      //读取后台的地址数据
      wx.request({
        url: APIURL.AddressList,
        data: {
          code: wx.getStorageSync("userCode"),
          rawData: wx.getStorageSync("userInfoInServer"),
          userId: wx.getStorageSync("userInfoInServer").id,
        },
        method: "GET",
        //请求头
        header: {
          "Content-Type": "applciation/json",
          'Authorization': 'Bearer ' + wx.getStorageSync('userToken')
        },
        success: function (e) {
          console.log(e)
          wx.setStorage({
            key: 'userAddressInServer',
            data: e.data,
            success:function(res){
              that.setData({
                userAddressInServer:e.data,
                currentAddress: options.currentAddress
              })
            }
          })
        },
        fail: function (e) {
          console.log(e);
        }
      }); 
    }else{
      that.setData({
        userAddressInServer: wx.getStorageSync("userAddressInServer"),
        currentAddress: options.currentAddress
      })
    } 
  },
  userChooseAddress:function(e){
    var that = this;
    //打开内置api提供用户手动选择当前地址
    wx.chooseLocation({
        type: 'gcj02', //'wgs84',
        success: function(res) {
            // console.log(res.latitude)
            // console.log(res.longitude)
            console.log(res)
                // console.log(res.address)
            that.setData({
                currentAddress: res.address
            })
        }
    })
  },
  gotoAddress:function(e){
    wx.navigateTo({
      url: '../addAddress/addAddress?currentAddress=' + this.data.currentAddress,
    })
  },
  gotoBack:function(e){
    var clickAddressObj = this.data.userAddressInServer[e.currentTarget.dataset.id];
    // console.log(clickAddressObj);
    wx.setStorage({
      key: 'userClickAddressObj',
      data: clickAddressObj,
    })
    wx.navigateBack({
      
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    var that = this;

    that.setData({
      userAddressInServer: wx.getStorageSync("userAddressInServer"),
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})