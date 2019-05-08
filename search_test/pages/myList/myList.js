var app=getApp();
const APIURL = require('../../utils/api.js');
Page({
  data:{
    tabs: [],
    orderListData: [
      {
        shopName: "王大拿的饺子管",
        orderStatus: "正在配送",
        orderTime: "10:11:23",
        goodName: "黄瓜两个",
        totialPrice: "90.80"
      }, 
      {
        shopName: "王大拿的饺子管",
        orderStatus: "正在配送",
        orderTime: "10:11:23",
        goodName: "黄瓜两个",
        totialPrice: "90.80"
      }, {
      shopName: "王大拿的饺子管",
      orderStatus: "正在配送",
      orderTime: "10:11:23",
      goodName: "黄瓜两个",
      totialPrice: "90.80"
    }, {
      shopName: "小姐姐的混沌点",
      orderStatus: "正在配送",
      orderTime: "10:11:23",
      goodName: "泥鳅三只",
      totialPrice: "90.80"
    }, {
      shopName: "德玛西亚的小商家",
      orderStatus: "已完成",
      orderTime: "10:11:23",
      goodName: "西红柿炒蛋",
      totialPrice: "90.80"
    }],
    stv: {
      windowWidth: 0,
      lineWidth: 0,
      offset: 0,
      tStart: false
    },
    activeTab: 0,
    userAddressInServer:[],
    yijianList://意见列表
    [
        { value: '功能异常：功能故障或不可用', checked: false },
        { value: '产品建议：用的不爽，我有建议', checked: false },
        { value: '安全问题：密码，隐私、欺诈等', checked: false },
        { value: '其他问题意见', checked: false }
    ],
    textareaMes:"",//用户输入的反馈信息
    textareaNum:0,//用户当前输入的字符
    imgArr: [],//用户选择上传的图片
    chooseViewShow: true,//是否可以添加图片
  },

  onLoad:function(options){
    wx.showToast({
      title: "加载中",
      icon: 'loading',
      duration: 1000
    })
    try {
        let {tabs} = this.data; 
        var res = wx.getSystemInfoSync()
        this.windowWidth = res.windowWidth;
        this.data.stv.lineWidth = this.windowWidth / this.data.tabs.length;
        this.data.stv.windowWidth = res.windowWidth;
        this.setData({stv: this.data.stv})
        this.tabsCount = tabs.length;
      } catch (e) {
      }
    //切换顶部tabs
    this._updateSelectedPage(options.childId);
    //修改页面标题
    wx.setNavigationBarTitle({
      title:options.pageName
    })
    var that = this;
    //设置顶部tabs
    that.setData({
      tabs: JSON.parse(options.tabs),
    })
    if(options.pageName=="我的订单"){
      //读取后台订单
      wx.request({
        url: APIURL.OrderList,
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
          console.log(e)
          
        },
        fail: function (e) {
          console.log(e);
        }
      }); 
    }
    if (options.pageName == "常用功能"){
     
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
            that.setData({
              userAddressInServer:e.data,
            })
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
    if (options.pageName == "我的资产") {

    }
    if (options.pageName == "使用指引") {

    }
  },
  onShow: function (options){
    var that = this;
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
        that.setData({
          userAddressInServer:e.data,
        })
        wx.setStorage({
          key: 'userAddressInServer',
          data: e.data,
        })
      }
    })
  },
  _updateSelectedPage(page) {
    let {tabs, stv, activeTab} = this.data;
    activeTab = page;
    this.setData({activeTab: activeTab})
    stv.offset = stv.windowWidth*activeTab;
    this.setData({stv: this.data.stv})
  },
  handlerTabTap(e) {
    this._updateSelectedPage(e.currentTarget.dataset.index);
  },
  gotoAddress:function(e){

    wx.navigateTo({
      url: '../addAddress/addAddress',
    })
  },
  editAddress:function(e){
    
    var that=this;
    var currentIndex = e.currentTarget.dataset.index;
    var currentChooseAddress=
      that.data.userAddressInServer[currentIndex];
    wx.navigateTo({
      url: '../addAddress/addAddress?address='+
        JSON.stringify(currentChooseAddress) + '&title=编辑地址',
    })
  },
  delAddress:function(e){
    var that = this;
    var currentIndex = e.currentTarget.dataset.index;
    var addressId = that.data.userAddressInServer[currentIndex].id;
    var default_address = that.data.userAddressInServer[currentIndex].default_address;
    var user_id = that.data.userAddressInServer[currentIndex].user_id;
    wx.showModal({
      title: '提示',
      content: "确定删除该地址吗？",
      cancelText: "下次再说",
      confirmText: "确定删除",
      confirmColor: "skybule",
      success: function (e) {
        if (e.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          wx.request({
            url: APIURL.AddressDelete,
            data: {
              code: wx.getStorageSync("userCode"),
              rawData: wx.getStorageSync("userInfoInServer"),
              id: addressId,
              default_address: default_address,
              user_id: user_id,
            },
            method: "POST",
            //请求头
            header: {
              "Content-Type": "applciation/json",
              'Authorization': 'Bearer ' + wx.getStorageSync('userToken')
            },
            success: function (e) {
              console.log(e)
              that.onShow();
              wx.showToast({
                title: '删除成功！',
                duration: 500
              })
            },
            fail: function (e) {
              console.log(e);
            }
          });
        }
      }
    })

  },
  setDefaultAddress:function(e){
    var currentChooseIndex = e.currentTarget.dataset.index;
    var that = this;
    var currentAddress = that.data.userAddressInServer[currentChooseIndex];
    wx.showModal({
      title: '提示',
      content: "确定将当前地址设为默认地址？",
      cancelText: "下次再说",
      confirmText: "确定",
      confirmColor: "skybule",
      success: function (e) {
        if (e.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          console.log()
          if (currentAddress.default_address == true){
            wx.showModal({
              title: '提示',
              content: '当前项为默认地址！',
              showCancel:false,
              confirmText:'知道了',
              confirmColor: "skybule",
            })
            return;
          }else{
            wx.request({
              url: APIURL.AddressUpdate,
              data: {
                code: wx.getStorageSync("userCode"),
                rawData: wx.getStorageSync("userInfoInServer"),
              
                user_id: wx.getStorageSync("userInfoInServer").id,
                id: currentAddress.id,
                area_info: currentAddress.area_info,
                address: currentAddress.address,
                contact: currentAddress.contact,
                phone: currentAddress.phone,
                default_address: true,
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
                  title: "设置成功",
                  duration: 500
                })
                that.onShow();
              },
              fail: function (e) {
                console.log(e);
              }
            }); 
          }
         
        }
      }
    })
  },
  /*获取用户文本输入*/
  getInput:function(e){
    console.log(e);
    this.setData({
      textareaNum:e.detail.cursor,
      textareaMes:e.detail.value,
    })
  },
  /** 选择图片 */
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 9 - that.data.imgArr.length,//最多选择4张图片
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths);
        if (res.tempFilePaths.count == 0) {
          return;
        }
        //上传图片
        var imgArrNow = that.data.imgArr;
        imgArrNow = imgArrNow.concat(res.tempFilePaths);
        that.setData({
          imgArr: imgArrNow,
          picNum: that.data.picNum +1,
        })
        that.chooseViewShow();
      }
    })
  },

  /** 删除图片 */
  deleteImv: function (e) {
    var imgArr = this.data.imgArr;
    var itemIndex = e.currentTarget.dataset.id;
    imgArr.splice(itemIndex, 1);
    this.setData({
      imgArr: imgArr
    })
    //判断是否隐藏选择图片
    this.chooseViewShow();
  },


  /** 是否隐藏图片选择 */
  chooseViewShow: function () {
    if (this.data.imgArr.length >= 4) {
      this.setData({
        chooseViewShow: false
      })
    } else {
      this.setData({
        chooseViewShow: true
      })
    }
  },

  /** 显示图片 */
  showImage: function (e) {
    var imgArr = this.data.imgArr;
    var itemIndex = e.currentTarget.dataset.id;

    wx.previewImage({
      current: imgArr[itemIndex], // 当前显示图片的http链接
      urls: imgArr // 需要预览的图片http链接列表
    })
  },
  /*提交意见反馈*/
  submit:function(e){

  }
})


  // handlerStart(e) {
  //   let {clientX, clientY} = e.touches[0];
  //   this.startX = clientX;
  //   this.tapStartX = clientX;
  //   this.tapStartY = clientY;
  //   this.data.stv.tStart = true;
  //   this.tapStartTime = e.timeStamp;
  //   this.setData({stv: this.data.stv})
  // },
  // handlerMove(e) {
  //   let {clientX, clientY} = e.touches[0];
  //   let {stv} = this.data;
  //   let offsetX = this.startX - clientX;
  //   this.startX = clientX;
  //   stv.offset += offsetX;
  //   if(stv.offset <= 0) {
  //     stv.offset = 0;
  //   } else if(stv.offset >= stv.windowWidth*(this.tabsCount-1)) {
  //     stv.offset = stv.windowWidth*(this.tabsCount-1);
  //   }
  //   this.setData({stv: stv});
  // },
  // handlerCancel(e) {

  // },
  // handlerEnd(e) {
  //   let {clientX, clientY} = e.changedTouches[0];
  //   let endTime = e.timeStamp;
  //   let {tabs, stv, activeTab} = this.data;
  //   let {offset, windowWidth} = stv;
  //   //快速滑动
  //   if(endTime - this.tapStartTime <= 300) {
  //     //向左
  //     if(Math.abs(this.tapStartY - clientY) < 50) {
  //       if(this.tapStartX - clientX > 5) {
  //         if(activeTab < this.tabsCount -1) {
  //           this.setData({activeTab: ++activeTab})
  //         }
  //       } else {
  //         if(activeTab > 0) {
  //           this.setData({activeTab: --activeTab})
  //         }
  //       }
  //       stv.offset = stv.windowWidth*activeTab;
  //     } else {
  //       //快速滑动 但是Y距离大于50 所以用户是左右滚动
  //       let page = Math.round(offset/windowWidth);
  //       if (activeTab != page) {
  //         this.setData({activeTab: page})
  //       }
  //       stv.offset = stv.windowWidth*page;
  //     }
  //   } else {
  //     let page = Math.round(offset/windowWidth);
  //     if (activeTab != page) {
  //       this.setData({activeTab: page})
  //     }
  //     stv.offset = stv.windowWidth*page;
  //   }
  //   stv.tStart = false;
  //   this.setData({stv: this.data.stv})
  // },