// pages/chooseAddress/chooseAddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentAddress:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      currentAddress:options.currentAddress,
    })
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
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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