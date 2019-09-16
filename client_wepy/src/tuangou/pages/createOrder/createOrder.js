import http from '../../../utils/Base';
import api from '../../../utils/API';
Page({
    data: {
        imageUrl: "https://mingrui-static.oss-cn-shenzhen.aliyuncs.com/",
        orderId: '',
        address: '',
        consignee: '',
        mobile: '',
        goodInfo: {

        },
    },
    onLoad: function(e) {
        var data = JSON.parse(e.orderInfo);
        console.log(data)
        var goodInfo = data.goodsList[0];
        this.setData({
            orderId: data.id,
            address: data.address,
            consignee: data.consignee,
            mobile: data.mobile,
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
                        cancelText: "返回",
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
                        title: res.errMsg
                    })
                },
            })
        })
    }
})