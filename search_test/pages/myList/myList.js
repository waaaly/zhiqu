var app=getApp();

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
    userAddress:[],

  },
  onShow:function(e){
    console.log(app.globalData.userAddress)
    this.setData({
      userAddress: app.globalData.userAddress,
    })
  },
  onLoad:function(options){
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
    //
    that.setData({
      tabs: JSON.parse(options.tabs),
    })
    console.log(options);
    //读取全局的地址数据
    this.setData({
      userAddress: app.globalData.userAddress,
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
      that.data.userAddress[currentIndex];
    wx.navigateTo({
      url: '../addAddress/addAddress?addressInfo='+
        JSON.stringify(currentChooseAddress) + '&currentIndex='+
        currentIndex + '&title=编辑地址',
    })
  },
  delAddress:function(e){
    var that = this;
    var currentIndex = e.currentTarget.dataset.index;
    var addressArray = app.globalData.userAddress;
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
          addressArray.splice(currentIndex,1);
          //位于数组第一的为默认地址
          if (addressArray.length != 0 &&
              addressArray[0].defaultAddress == false){
            addressArray[0].defaultAddress=true;
          };
          app.globalData.userAddress = addressArray;
          that.onShow();
          wx.showToast({
            title: '删除成功！',
          })
        }
      }
    })

  },
  setDefaultAddress:function(e){
    var currentChooseIndex = e.currentTarget.dataset.index;
    var that = this;
    var addressArray = app.globalData.userAddress;
    var currentDefaultIndex = 0;
    console.log(addressArray[currentDefaultIndex].defaultAddress)
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
          //找到当前默认地址的数组下标
          while (addressArray[currentDefaultIndex].defaultAddress!=true){
            currentDefaultIndex ++;
            if (currentDefaultIndex == addressArray.length){
              break;
            }
          }
          if (currentDefaultIndex == currentChooseIndex){
            wx.showModal({
              title: '提示',
              content: '当前项为默认地址！',
              showCancel:false,
              confirmText:'知道了',
              confirmColor: "skybule",
            })
            return;
          }
          if (currentDefaultIndex < addressArray.length){
            //取消当前的默认地址
            addressArray[currentDefaultIndex].defaultAddress = false;
          }
          //设置当前选中的为默认地址并移到第一位
          var currentObj = addressArray[currentChooseIndex];
          currentObj.defaultAddress = true;
          addressArray.splice(currentChooseIndex,1);
          addressArray.unshift(currentObj);
          //同步到全局变量
          app.globalData.userAddress = addressArray;
          that.onShow();
          wx.showToast({
            title: '设置成功！',
          })
        }
      }
    })
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