import wepy from "wepy";
import Tips from "../utils/Tips";

export default class http {

    //判断响应码是否成功
    static isSuccess(res) {
        return (res.statusCode == 200);
    }

    //请求异常
    static requestException(res) {
        const error = {};
        error.statusCode = res.statusCode;
        error.wxData = res.data;
        error.serverData = res.data.data;

        if (error.wxData) {
            return error;
        }
    }

    static get(url, data, debug = false, loading = true) {
        return this.request('GET', url, data, debug, loading);
    }

    static post(url, data, debug = false, loading = true) {
        return this.request('POST', url, data, debug, loading);
    }

    //封装微信request后台请求方法
    static async request(method, url, data, debug, loading) {
        var that = this;
        if (loading) {
            Tips.loading();
        }
        data.code = wx.getStorageSync('userCode');
        data.rawData = wx.getStorageSync('userInfo');
        let header = {
            "Content-Type": "applciation/json",
        };
        if (wx.getStorageSync('userToken')) {
            header = {
                "Content-Type": "applciation/json",
                'Authorization': 'Bearer ' + wx.getStorageSync('userToken')
            }
        }

        //构造请求相关参数
        const param = {
            method: method,
            url: url,
            data: data,
            header: header
        };
        console.info(`[http]request url=${url}`);
        if (debug) {
            console.log(data);
        }

        return new Promise((resolve, reject) => {
            wepy.request(param).then(res => {
                //200
                if (this.isSuccess(res)) {
                    if (res.data.data == undefined) {
                        resolve(res.data);
                    } else {
                        resolve(res.data.data);
                    }
                } else {
                    console.log(res);
                    if (wx.getStorageSync("showPopup")) {
                        return;
                    }
                    if (res.data.message == '用户openid没有获取到') {
                        wx.setStorageSync("showPopup", 1);
                        wx.showModal({
                            title: '提示',
                            content: '您当前尚未登陆无法进行相关操作呢',
                            confirmColor: '#ff6b5d',
                            confirmText: '前往登陆',
                            success: (res1 => {
                                if (res1.confirm) {
                                    wx.navigateTo({
                                        url: '/pages/authorize',
                                    })
                                } else {

                                }
                                wx.setStorageSync("showPopup", 0);
                            }),
                        })
                    } else {
                        reject(this.requestException(res));
                    }
                }
                Tips.loadDone();
            })
        })
    }

}