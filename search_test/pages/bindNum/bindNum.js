// import PublicFun from '../../utils/PublicFun.js';
const phoneRexp = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;

Page({
    data: {
        btnTxt: '获取验证码',
        isGetCode: false,
        Loading: false,
        countDown: 60,
        formData: {
            phone: '',
            code: ''
        }
    },
    onLoad(options) {

    },

    formSubmit(e) {
        let that = this,
            formData = e.detail.value,
            errMsg = '';
        that.setData({
            Loading: true
        })
        if (!formData.phone) {
            errMsg = '手机号不能为空！';
        }
        if (!formData.code) {
            errMsg = '验证码不能为空！';
        }
        if (formData.phone) {
            if (!phoneRexp.test(formData.phone)) {
                errMsg = '手机号格式有误！';
            }
        }
        if (errMsg) {
            that.setData({
                Loading: false
            })
            wx.showToast({
                title: errMsg,
                icon: "none",
            })
            return false
        }
        //连接服务器进行验证码手机号验证操作
        setTimeout(() => {
            that.setData({
                Loading: false
            })
        }, 1500)
    },
    getPhoneCode() {
        let that = this,
            formData = that.data.formData,
            errMsg = '';
        errMsg = !formData.phone ? '手机号不能为空！' :
            formData.phone && !phoneRexp.test(formData.phone) ? '手机号格式有误！' :
                '';
        if (errMsg) {
            wx.showToast({
                title: errMsg,
                icon:"none",
            })
            return false
        }
        that.timer();
        //连接服务器进行获取验证码操作
        that.setData({
            isGetCode: true
        })
    },
    //验证码倒计时
    timer() {
        let that = this,
            countDown = that.data.countDown;
        let clock = setInterval(() => {
            countDown--
            if (countDown >= 0) {
                that.setData({
                    countDown: countDown
                })
            } else {
                clearInterval(clock)
                that.setData({
                    countDown: 60,
                    isGetCode: false,
                    btnTxt: '重新获取'
                })
            }
        }, 1000)
    },
    //输入检索
    Input(e) {
        let that = this,
            formData = that.data.formData,
            inputType = e.currentTarget.dataset.id,
            inputValue = e.detail.value;
        inputType === 'phone' ?
            formData.phone = inputValue : formData.code = inputValue;
        that.setData({
            formData
        })

    }
})
