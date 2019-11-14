import http from '../../../utils/Base';
import api from '../../../utils/API';
var noPayOrder;
Page({
    data: {
        imageUrl: "https://mingrui-static.oss-cn-shenzhen.aliyuncs.com/",

        orderInfo: {},
        goodInfo: {},
        group_id: null,
    },
    onLoad: function(e) {
        console.log(e)
        var data = JSON.parse(e.orderInfo);
        console.log(data)

        var goodInfo = data.goodsList[0];
        this.setData({
            orderInfo: data,
            group_id: data.group_id
        })
        for (let index in goodInfo) {
            this.modefiyGoodInfo(index, goodInfo[index]);
        }
        //记录团购id订单id，团购id作为字段名，订单id作为值
        noPayOrder = wx.getStorageSync('noPayOrder');
        if (!noPayOrder) {
            noPayOrder = new Object();
        }
        console.log(noPayOrder);
        noPayOrder[this.group_id] = data.id;
        wx.setStorageSync('noPayOrder', noPayOrder);
    },

    modefiyGoodInfo(name, value) {
        var key = `goodInfo.${name}`;
        this.setData({
            [key]: value,
        })
    },
    onShow(e) {

    },
    onUnload(e) {

    },
    payment(e) {
        var that = this;
        http.get(api.WechatPay, {
            order_id: e.currentTarget.dataset.id,
            user_id: wx.getStorageSync('userInfoInServer').id
        }).then(res => {
            console.log(res);
            wx.requestPayment({
                timeStamp: res.timeStamp,
                nonceStr: res.nonceStr,
                package: res.package,
                signType: res.signType,
                paySign: res.paySign,
                success: function(res1) {
                    wx.showModal({
                        title: '支付成功',
                        cancelText: "返回首页",
                        confirmText: "继续拼团",
                        confirmColor: "#ff6b5d",
                        content: "您已完成拼团支付～",
                        success: function(res2) {
                            noPayOrder[that.group_id] = null;
                            wx.setStorageSync('noPayOrder', noPayOrder);
                            if (res2.confirm) {
                                wx.reLaunch({
                                    url: '/pages/tuangou/index',
                                })
                            } else {
                                wx.reLaunch({
                                    url: '/pages/index',
                                })
                            }
                        }
                    })
                },
                fail: function(res) {
                    console.log(res)
                    wx.showToast({
                        icon: 'none',
                        title: '支付未完成'
                    })
                }
            })
        })
    }
})