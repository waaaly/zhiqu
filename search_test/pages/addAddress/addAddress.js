// pages/user/address/choseaddress/chose.js
var address = require('../../utils/city.js');
const APIURL = require("../../utils/api.js");
var animation;
var app=getApp();
var addressArray = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isVisible: false,
    animationData: {},
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    addressEdit:{
      id:0,//地址id从1开始自增
      user_id:wx.getStorageSync("userInfoInServer").id,//用户id
      area_info: '',// 地区
      address: '',//详细地址
      phone: '',//手机👌
      contact: '',//姓名
      default_address: true,//是否默认地址
    },
    editAddressId:"",//上一层传过来的地址信息的数组下标
    userInfoInServer:{},//后台数据库中的用户信息
    userAddressInServer:[],//后台保存的地址数组
  },
  selectCity: function () {

  },
  bindCancel: function () {
    wx.navigateBack({})
  },
  bindSave: function (e) {
    var that = this;
    console.log(that.data );
    var linkMan = e.detail.value.linkMan;
    var address = e.detail.value.address;
    var mobile = e.detail.value.mobile;
    
    if (linkMan == "") {
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        showCancel: false
      })
      return
    }
    else if (mobile == '') {
      wx.showModal({
        title: '请输入手机号！',
        icon: 'success',
        duration: 1500
      })
      return false;
    }
    else if (mobile.length != 11) {
      wx.showModal({
        title: '手机号长度有误！',
        icon: 'success',
        duration: 1500
      })
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(mobile)) {
      wx.showModal({
        title: '手机号有误！',
        icon: 'success',
        duration: 1500
      })
      return false;
    }
    else if (this.data.selProvince == "请选择") {
      wx.showModal({
        title: '提示',
        content: '请选择省份',
        showCancel: false
      })
      return
    }
    else if (this.data.areaInfo === "") {
      wx.showModal({
        title: '提示',
        content: '请选择所在地区',
        showCancel: false
      })
      return
    }
    else if (address == "") {
      wx.showModal({
        title: '提示',
        content: '请填写详细地址',
        showCancel: false
      })
      return
    }

    console.log(that.data.addressEdit);
    //新增地址
    if(this.data.addressEdit.id==0){
      wx.request({
        url: APIURL.AddressSave,
        data: {
          code: wx.getStorageSync("userCode"),
          rawData: wx.getStorageSync("userInfoInServer"),
          userAddress: [that.data.addressEdit],
        },
        method: "POST",
        //请求头
        header: {
          "Content-Type": "applciation/json",
          'Authorization': 'Bearer ' + wx.getStorageSync('userToken')
        },
        success: function (e) {
          console.log(e)
          wx.showToast({
            title: "添加成功",
          })
          wx.navigateBack({
          })
        },
        fail: function (e) {
          console.log(e);
        }
      }); 
      /*修改并保存地址*/
    }else{
      console.log(that.data.addressEdit);
      wx.request({
        url: APIURL.AddressUpdate,
        data: {
          code: wx.getStorageSync("userCode"),
          rawData: wx.getStorageSync("userInfoInServer"),
          // userAddress: [that.data.addressEdit],
          user_id: wx.getStorageSync("userInfoInServer").id,
          id: that.data.addressEdit.id,
          area_info: that.data.addressEdit.area_info,
          address: that.data.addressEdit.address,
          contact: that.data.addressEdit.contact,
          phone: that.data.addressEdit.phone,
          default_address:that.data.addressEdit.default_address,
        },
        method: "POST",
        //请求头
        header: {
          "Content-Type": "applciation/json",
          'Authorization': 'Bearer ' + wx.getStorageSync('userToken')
        },
        success: function (e) {
          console.log(e)
          wx.showToast({
            title: "修改成功",
            duration: 1000
          })
          if (e.data.msg =="修改成功"){
            wx.navigateBack({
            })
          }           
        },
        fail: function (e) {
          console.log(e);
        }
      }); 
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      title: "加载中",
      icon: 'loading',
      duration: 1000
    })
    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    // 默认联动显示北京
    var id = address.provinces[0].id
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id],
    })

    if (!wx.getStorageSync("userAddressInServer")) {
      //读取后台的地址数据
      wx.request({
        url: APIURL.AddressList,
        data: {
          code: wx.getStorageSync("userCode"),
          rawData: wx.getStorageSync("userInfoInServer"),
          user_id: wx.getStorageSync("userInfoInServer").id,
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
          })
        },
        fail: function (e) {
          console.log(e);
        }
      });
    } 
    this.setData({
      userAddressInServer:wx.getStorageSync("userAddressInServer")
    })
    if(options.title){
      //修改页面标题
      wx.setNavigationBarTitle({
        title: options.title
      })
    }
    /*编辑地址*/
    if(options.address){
      var temp = JSON.parse(options.address);
      this.setData({
        addressEdit: temp,
      })
    }
    /*用户携带当前地址传过来*/
    if (options.currentAddress){
      var str = "addressEdit.address";
      this.setData({
        [str]: options.currentAddress
      })
    }

  },
  //获取input输入的文本
  getInput:function (e){
    // console.log(e.currentTarget.id);
    // console.log(e.detail.value);

    switch (parseInt(e.currentTarget.id)){
        case 1: 
        var str = "addressEdit.contact";
          this.setData({
            [str]: e.detail.value,
          })
          // console.log(this.data.addressObj.linkMan)
          break;
        case 2:
        var str = "addressEdit.phone";
          this.setData({
            [str]: e.detail.value,
          })
          break;
        case 3:
        var str = "addressEdit.address";
          this.setData({
            [str]: e.detail.value,
          })
          break;
      }
  },
  checkboxChange: function (event) {
    var str = "addressEdit.default_address";
    console.log(event)
    if (event.detail.value.length==0){
      this.setData({
        [str]: false,
      });
    }
    else{
      this.setData({
        [str]: true,
      });
    } 
  },
  // 点击所在地区弹出选择框
  selectDistrict: function (e) {
    var that = this;
    if (that.data.addressMenuIsShow) {
      return
    }
    that.startAddressAnimation(true);
  },
  // 执行动画
  startAddressAnimation: function (isShow) {
    console.log(isShow);
    var that = this;
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(40 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    var that = this;
    var city = that.data.city;
    var value = that.data.value;
    that.startAddressAnimation(false);
 
    // 将选择的城市信息显示到输入框
    var areaInfo = that.data.provinces[value[0]].name + '-' + that.data.citys[value[1]].name + '-' + that.data.areas[value[2]].name;
    var dataAreaInfo = "addressEdit.area_info";
    //保存城市选择结果
    that.setData({
      [dataAreaInfo]: areaInfo,
    })
  },
  hideCitySelected: function (e) {
    console.log(e)
    this.startAddressAnimation(false)
  },
  // 处理省市县联动逻辑
  cityChange: function (e) {
    console.log(e)
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      })
    } else {
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
    console.log(this.data)
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
    //读取后台的地址数据
      wx.request({
        url: APIURL.AddressList,
        data: {
          code: wx.getStorageSync("userCode"),
          rawData: wx.getStorageSync("userInfoInServer"),
          user_id:wx.getStorageSync("userInfoInServer").id,
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
          })
        },
        fail: function (e) {
          console.log(e);
        }
      }); 
  },
  bindCancel: function () {
    wx.navigateBack({})
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
  choseaddress() {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
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

  },
  switch1Change: function (e) {
    var that = this
    that.setData({
      addressisdeafutl: e.detail.value
    })

  }
})
