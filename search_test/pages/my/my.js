var app = getApp();
import loginDialog from "../../template/loginDialog/loginDialog";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    menuItems:{
      order:{
        text: '我的订单', 
        url: '../../pages/order/order?id=0', 
        icon: '../../image/wodedingdan.png', 
        tips: '查看全部订单',
        items:[
          { text: '代付款', url: '../../pages/order/order?id=1', icon: '../../image/daifukuan.png' },
          { text: '待送货', url: '../../pages/order/order?id=2', icon: '../../image/daifahuo.png' },
          { text: '待收货', url: '../../pages/order/order?id=3', icon: '../../image/daishouhuo.png' },
          { text: '待评价', url: '../../pages/order/order?id=4', icon: '../../image/daipingjia.png' },
        ]
      },
      funcs:{
        text: '常用功能', 
        url: '../../pages/order/order&id=3', 
        icon: '../../image/gongnengfuwu.png', 
        tips: '查看全部功能',
        items:[
          {text: '我的收藏', url: '../../pages/order/order?id=1', icon: '../../image/wodeshoucang.png'},
          {text: '我的地址', url: '../../pages/order/order?id=2', icon: '../../image/wodedizhi.png'},
          {text: '我的足迹', url: '../../pages/order/order?id=3', icon: '../../image/wodezuji.png'},
          {text: '帮助反馈', url: '../../pages/order/order?id=4', icon: '../../image/bangzhufankui.png'},
        ]
      },
      property:{
        text: '我的资产', 
        url: '../../pages/order/order&id=2', 
        icon: '../../image/wodezichan.png', 
        tips: '查看所有资产',
        items:[
          { text: '我的积分', url: '../../pages/order/order?id=1', icon: '../../image/wodejifen.png' },
          { text: '我的卡券', url: '../../pages/order/order?id=1', icon: '../../image/wodekaquan.png' },
        ]
      },
      setting:{
        text: '系统设置', 
        url: '../../pages/order/order&id=4', 
        icon: '../../image/xitongshezhi.png', 
        tips: '进入系统设置',
        items:[
          { text: '清除缓存', url: '../../pages/order/order?id=1', icon: '../../image/qingchuhuancun.png' },
          { text: '版本信息', url: '../../pages/order/order?id=1', icon: '../../image/banbenxinxi.png' },
        ]
      }
    },
    
    userInfo:null,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(app.globalData.userInfo);
    if(app.globalData.userInfo==null){
      console.log(1111)
      loginDialog.showModal({
        title: "提示",
        content: "确定使用当前微信号登录小程序？",
        confirmOpenType: "getUserInfo",  //如果不设置就是普通弹框
        success: (e) => {
          console.log("e", e);
          let userInfo = e.detail.userInfo;
          // wx.setStorageSync("userInfo", userInfo);
          getApp().globalData.userInfo = userInfo;
          console.log(app.globalData.userInfo);
          that.setData({
            userinfo: app.globalData.userInfo,
          })
        },
        fail: (err) => {
          用户不小必点到拒绝,提示登录失败
          wx.showToast({
            title: "登录失败",
            icon: "none"
          });
        }
      });
    }else{
      that.setData({
        userinfo: app.globalData.userInfo,
      })
    }
    // })
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
    let that = this
    // app.getUserInfo(function (userinfo) {
    //   console.log(userinfo)
    //   console.log(getApp().globalData.userSign)
    //   that.setData({
    //     userinfo: userinfo,
    //     userSign: getApp().globalData.userSign,
    //   })
    // })
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
