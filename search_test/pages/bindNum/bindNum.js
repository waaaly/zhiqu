const APIURL=require('../../utils/api.js');
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
        },
        token:'',
      userInfoInServer:{},
    },
    onLoad(options) {
      var that =this;
      console.log(APIURL.GetPhoneCode);
      //读缓存token
      wx.getStorage({
        key: 'userToken',
        success: function(res) {
          that.setData({
            token:res.data,
          })
        },
        fail:function(e){
          console.log(e)
        }
      }),
      //读缓存userInfoInServer
      wx.getStorage({
        key: 'userInfoInServer',
        success: function(res) {
          console.log(res);
          
          that.setData({
            userInfoInServer:res.data,
          })
        },
      })
},
 //获取验证码
getPhoneCode() {
    let that = this,
        formData = that.data.formData,
        errMsg = '';
        errMsg = !formData.phone ? '手机号不能为空！' :
        formData.phone && !phoneRexp.test(formData.phone) ? '手机号格式有误！' :'';
    if (errMsg) {
        wx.showToast({
            title: errMsg,
            icon:"none",
        })
        return false
    }
    that.timer();
    //连接服务器进行获取验证码操作
  console.log(that.data.token);
  console.log(that.data.userInfoInServer.id);
  console.log(formData.phone);
    wx.request({
      url: APIURL.GetPhoneCode,
      header: {//请求头
        "Content-Type": "applciation/json",
        'Authorization': 'Bearer ' + that.data.token
      },
      data:{
        userId: that.data.userInfoInServer.id,
        phone: formData.phone,
      },
      success:function(e){
        console.log(e);
      }
    })
    
    that.setData({
        isGetCode: true
    })
},
//点击确定提交绑定
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
      return false;
    }
    //连接服务器进行验证码手机号验证操作
    console.log(formData.code);
    wx.request({
      url: APIURL.CheckPhoneCode,
      header: {//请求头
        "Content-Type": "applciation/json",
        'Authorization': 'Bearer ' + that.data.token
      },
      data: {
        userId: that.data.userInfoInServer.id,
        phone: formData.phone,
        verificationCode: formData.code 
      },
      success:function(e){
        var msg = e.data.msg;
        console.log(e);
        wx.showToast({
          title: msg,
        });
        if(msg=="绑定成功"){
          var temp = that.data.userInfoInServer;
          console.log(temp);
          temp.phone = formData.phone;
          that.setData({
            userInfoInServer:temp,
          })
          //绑定成功后更新到本地缓存
          wx.setStorage({
            key: 'userInfoInServer',
            data: that.userInfoInServer,
          })
          //返回上一级
          wx.navigateBack({
            
          })
        }
        
      }
    });
    setTimeout(() => {
      that.setData({
        Loading: false
      })
    }, 1500)
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
