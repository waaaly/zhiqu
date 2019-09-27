var server = require('./data.js');
const groupList = server.groupList;
import http from '../../utils/Base';
import api from '../../utils/API';
Page({
    data: {
        init: false,
        noInfo: false,
        noSwiper: false, //没有推荐团购
        imageUrl: "https://mingrui-static.oss-cn-shenzhen.aliyuncs.com/",
        swiperList: [],
        currentClassify: '全部团购',
        secClass: '', //第二分类
        moreText: '更多分类',
        moreClass: [], //剩余分类列表
        xialaShow: false,
        goodSwiperHeight: 250,
        current: 0,
        headlines: [
            "智趣团购火热进行中快来参与吧～",
            "各式各样的团购商品等你来战！妈妈再也不用担心我的钱没处花啦",
            "最后三天，最后三天，错过等一年！"
        ],
        productList: [],
        isShoper: false, //用户不是商家才显示成为团长
    },
    onLoad: function(options) {
        //团购商品轮播
        http.get(api.GroupCarousel, {}).then(res => {
            if (res) {
                this.setData({
                    swiperList: res,
                    noSwiper: true,
                })
            } else {
                this.setData({
                    noSwiper: true,
                })
            }
        })
        if (wx.getStorageSync("userInfoInServer").role) {
            this.setData({
                isShoper: true
            })
        }
        this.refresh('全部团购', true);
    },
    //刷新数据
    refresh(classifyName, init) {
        //获取团购列表
        http.get(api.GroupList, {}).then(res => {
            console.log(res);
            if (res.msg == '暂无团购') {
                this.setData({
                    noInfo: true,
                })
                return;
            }
            //获取新数据
            groupList.init(res);
            //初始化
            if (init) {
                this.setData({
                    productList: groupList.getAll(),
                    secClass: groupList.getClassify()[0],
                    moreClass: groupList.getClassify().splice(1),
                    init: true,
                    noInfo: false,
                })
            } else {
                this.getProducetList(classifyName);
            }
        })
    },
    //前往个人信息
    goMyInfo(e) {
        wx.navigateTo({
            url: '/pages/myInfo?newOrder=' + false,
        })
    },
    hideXiala(e) {
        this.setData({
            xialaShow: false,
        })
    },
    //swiper
    change: function(e) {
        this.setData({
            current: e.detail.current
        })
    },
    detail: function(e) {
        var currentGroup = {
            goods_id: e.currentTarget.dataset.goodsid,
            group_id: e.currentTarget.dataset.groupid,
            shop_id: e.currentTarget.dataset.shopid,
        }
        wx.setStorageSync('currentGroup', currentGroup);
        wx.navigateTo({
            url: '../product',
        })
    },
    //下拉框显示
    xiala: function(e) {
        var that = this;
        that.setData({
            xialaShow: true,
        })
    },
    //选择更多
    changeMore(e) {
        this.setData({
            moreText: e.currentTarget.dataset.item,
            xialaShow: false
        })
        this.changeClassify(e);
    },
    //改变分类
    changeClassify(e) {
        this.setData({
            currentClassify: e.currentTarget.dataset.item,
            productList: [],
        })
        this.refresh(e.currentTarget.dataset.item, false)
    },
    // 根据团购分类获取数据
    getProducetList(name) {
        this.setData({
            productList: groupList.getClassifyProduct(name),
        })
    }
})