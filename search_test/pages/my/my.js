var app = getApp();
import loginDialog from "../../template/loginDialog/loginDialog";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    menuItems:{
      order:{
        id:0,
        text: '我的订单', 
        tabs: ['全部订单', '待付款', '待送货', '待收货', '待评价'],
        icon: '../../image/wodedingdan.png', 
        tips: '查看全部订单',
        items:[
          { text: '代付款', url: '../../pages/myList/myList?id=1', icon: '../../image/daifukuan.png' },
          { text: '待送货', url: '../../pages/myList/myList?id=2', icon: '../../image/daifahuo.png' },
          { text: '待收货', url: '../../pages/myList/myList?id=3', icon: '../../image/daishouhuo.png' },
          { text: '待评价', url: '../../pages/myList/myList?id=4', icon: '../../image/daipingjia.png' },
        ]
      },
      funcs:{
        id:1,
        text: '常用功能', 
        tabs: ['我的收藏', "我的地址", "信用体系","帮助反馈"],
        url: '../../pages/myList/myList?pageName=常用功能', 
        icon: '../../image/gongnengfuwu.png', 
        tips: '查看全部功能',
        items:[
          {text: '我的收藏', url: '../../pages/myList/myList?id=1', icon: '../../image/wodeshoucang.png'},
          {text: '我的地址', url: '../../pages/myList/myList?id=2', icon: '../../image/wodedizhi.png'},
          { text: '信用体系', url: '../../pages/myList/myList?id=3', icon: '../../image/wodezuji.png'},
          {text: '帮助反馈', url: '../../pages/myList/myList?id=4', icon: '../../image/bangzhufankui.png'},
        ]
      },
      property:{
        id:2,
        text: '我的资产', 
        tabs: ['我的积分', '我的卡券'],
        url: '../../pages/myList/myList?pageName=我的资产', 
        icon: '../../image/wodezichan.png', 
        tips: '查看所有资产',
        items:[
          { text: '我的积分', url: '../../pages/myList/myList?id=1', icon: '../../image/wodejifen.png' },
          { text: '我的卡券', url: '../../pages/myList/myList?id=1', icon: '../../image/wodekaquan.png' },
        ]
      },
      setting:{
        id:3,
        text: '系统设置', 
        tabs: ['使用指引','清除缓存', '版本信息'],
        url: '../../pages/useGuide/useGuide', 
        icon: '../../image/xitongshezhi.png', 
        tips: '',
        items:[
          { text: '使用指引', url: '../../pages/myList/myList?id=1', icon: '../../image/qingchuhuancun.png' },
          {text: '清除缓存', url: '../../pages/myList/myList?id=2', icon: '../../image/qingchuhuancun.png' },
          { text: '版本信息', url: '../../pages/myList/myList?id=3', icon: '../../image/banbenxinxi.png' },
        ]
      }
    },
    
    userInfo:null,
  },
  useWxLogin(){
    var that=this;
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
        wx.showToast({
          title: "登录失败",
          icon: "none"
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(app.globalData.userInfo);
    if(app.globalData.userInfo==null){
      console.log(1111)
      that.useWxLogin();
    }else{
      that.setData({
        userinfo: app.globalData.userInfo,
      })
    }
    // })
  },

  naviTo:function(e){
    console.log(e)
    var item = e.currentTarget.dataset.item;
    var childId = e.currentTarget.dataset.childid;
    if(item==="setting"){
      switch(childId){
        case 1:
          wx.navigateTo({
            url: '../../pages/useGuide/useGuide',
          })
          break;
        case 2: 
          wx.showModal({
            title: '提示',
            content: "确定清除系统全部缓存？",
            cancelText:"下次再说",
            confirmText:"确定清除",
            confirmColor:"skybule",
            success: function (e) {
              if(e.cancel){

              }else{
                wx.showToast({
                  title: '清除成功',//提示文字
                  duration: 2000,//显示时长
                  mask: true,//是否显示透明蒙层，防止触摸穿透，默认：false  
                  icon: 'success', //图标，支持"success"、"loading"  
                  success: function () { },//接口调用成功
                  fail: function () { },  //接口调用失败的回调函数  
                  complete: function () { } //接口调用结束的回调函数  
                })
              }
            }
          });
          break;
        case 3:
          wx.showModal({
            title: '当前系统版本',
            showCancel:false,
            confirmText:"知道了",
            confirmColor:"skybule",
            content: "V0.0.0.0",
          })
          break;
      }
      return;
    }

    var pageName = this.data.menuItems[item].text;
    if(item!="order"){
      childId=childId-1;
    }
    console.log(pageName)
    wx.navigateTo({
      url: '../../pages/myList/myList?pageName=' + pageName + "&childId=" + childId + "&tabs=" + JSON.stringify(this.data.menuItems[item].tabs),
    })
  } ,
  gotoSetting:function(e){
    if (app.globalData.userInfo == null) {
      console.log(1111)
      this.useWxLogin();
    } else {
    wx.navigateTo({
        url: '../../pages/personSet/setting',
      })
    }
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
