// pages/user/address/choseaddress/chose.js
var address = require('../../utils/city.js');
var animation;
var app=getApp();
var addressArray = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // addressData: '',
    // provinces: [],//存储省份的数据
    // citys: [],//存储城市
    // districts: [],//存储区县的数据
    // selProvince: '省/',
    // selCity: '市',
    // selDistrict: '城区',
    // selProvinceIndex: 0,
    // selCityIndex: 0,
    // selDistrictIndex: 0,
    // provinceid: '',//存储获取到省份的id
    // citysid: '',//存储获取到的城市的id
    // streetid: '',//存储获取到的街市id
    // savepid: '',
    // savecid: '',
    // savesid: '',
    // readyid: '',//上一级页面传过来的地址ID
    // url: '',
    // showtitle: '',
    // addressisdeafutl: '',

    isVisible: false,
    animationData: {},
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    addressObj:{
      areaInfo: '',// 地区
      address: '',//详细地址
      mobile: '',//手机👌
      linkMan: '',//姓名
      defaultAddress: true,//是否默认地址
    },
    editAddressIndex:""//上一层传过来的地址信息的数组下标
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
    //修改地址，将修改后的副给原来的
    if(that.data.editAddressIndex!=""){
      addressArray[that.data.editAddressIndex] = that.data.addressObj;
    }else{
      //新增地址，将地址信息插入到页面的数据中
      if (that.data.addressObj.defaultAddress == true) {
        //保证只有一个默认地址
        addressArray[0].defaultAddress = false;
        addressArray.unshift(that.data.addressObj);
      } else {
        addressArray.push(that.data.addressObj);
      }
    }
    
    console.log(addressArray);
    //将地址信息保存成全局变量
    app.globalData.userAddress = addressArray;
    console.log(app.globalData.userAddress);
    wx.showToast({
          title: "保存成功",
        })
    wx.navigateBack({
        })

    // wx.request({
    //   url: that.data.url,
    //   data: {
    //     token: getApp().globalData.token,
    //     provinceId: that.data.savepid,
    //     cityId: that.data.savecid,
    //     districtId: that.data.savesid,
    //     linkMan: linkMan,
    //     address: address,
    //     mobile: mobile,
    //     // code: code,
    //     isDefault: that.data.addressisdeafutl,
    //     id: that.data.readyid
    //   },
    //   success: function (sucs) {
    //     wx.showToast({
    //       title: that.data.showtitle,
    //     })
    //     wx.navigateBack({

    //     })
    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    //读取全局变量中的地址数组
    addressArray=app.globalData.userAddress;
    //接受上一层传过来的地址信息和该数据的数组下标
    this.setData({
      addressObj:JSON.parse(options.addressInfo),
      editAddressIndex:options.currentIndex
    });
    //修改页面标题
    wx.setNavigationBarTitle({
      title: options.title
    })
  },
  //获取input输入的文本
  getInput:function (e){
    // console.log(e.currentTarget.id);
    // console.log(e.detail.value);

    switch (parseInt(e.currentTarget.id)){
        case 1: 
          var str = "addressObj.linkMan";
          this.setData({
            [str]: e.detail.value,
          })
          // console.log(this.data.addressObj.linkMan)
          break;
        case 2:
          var str = "addressObj.mobile";
          this.setData({
            [str]: e.detail.value,
          })
          break;
        case 3:
          var str = "addressObj.address";
          this.setData({
            [str]: e.detail.value,
          })
          break;
      }
  },
  checkboxChange: function (event) {
    var str = "addressObj.defaultAddress";
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
    var dataAreaInfo = "addressObj.areaInfo";
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
  //删除地址
  deleteAddress: function () {
    var that = this
    wx.showModal({
      title: '确认删除地址吗',
      content: '',
      success: function (sure) {
        wx.request({
          url: 'https://api.it120.cc/b4bc6fa88ad298e813c236857ec6f67e/user/shipping-address/delete',
          data: {
            token: getApp().globalData.token,
            id: that.data.readyid
          },
          success: function () {
            wx.navigateBack({

            })
          }
        })
      }
    })


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
