import http from '../../../utils/Base';
import api from '../../../utils/API';
Page({
    data: {
        imageUrl: "https://mingrui-static.oss-cn-shenzhen.aliyuncs.com/",

        orderInfo: {},
        goodInfo: {},
        goOrder: true, //离开当前页面是否跳转到待支付订单页
    },
    onLoad: function(e) {
        var data = JSON.parse(e.orderInfo);
        console.log(data)
        var goodInfo = data.goodsList[0];
        this.setData({
            orderInfo: data,
        })
        for (let index in goodInfo) {
            this.modefiyGoodInfo(index, goodInfo[index]);
        }

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
        // wx.showModal({
        //     title: '温馨提醒',
        //     cancelText: "狠心离开",
        //     confirmText: "留下支付",
        //     confirmColor: "#ff6b5d",
        //     content: "好货不等人,您确认要放弃支付吗？您可在待付款订单中选择继续支付～",
        //     success: (res => {
        //         if (res.confirm) {
        //             return;
        //         } else {
        //             wx.reLaunch({
        //                 url: '/pages/my-order?id=1',
        //             })
        //         }
        //     })
        // })
    },
    toggleMask(e) {

    },
    numberChange(e) {

    },
    changePayType(e) {

    },
    submit(e) {

    },
    payment(e) {
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
                        content: "您已完成支付～",
                        success: function(res2) {
                            // console.log(res2)
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