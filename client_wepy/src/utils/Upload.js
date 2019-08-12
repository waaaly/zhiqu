require('./HMAC.js');
require('./SHA1.js');

const Base64 = require('./Base64.js');
const Crypto = require('./Crypto.js');

const aliyunServerURL = 'https://mingrui-static.oss-cn-shenzhen.aliyuncs.com'; //阿里云oss存储地址
const accessId        = 'LTAIbwoe3A9AUrLH';

const timeOut         = 87600;
const accessKey       = 'v7xMOM5LUksFEw203DvnZIb5tLjBtx';


const getPolicyBase64 = function () {
    let date = new Date();
    date.setHours(date.getHours() + timeOut);
    let srcT = date.toISOString();
    const policyText = {
      "expiration": srcT, //设置该Policy的失效时间
      "conditions": [
        ["content-length-range", 0, 5 * 1024 * 1024] // 设置上传文件的大小限制,5mb
      ]
    };
  
    const policyBase64 = Base64.encode(JSON.stringify(policyText));
    return policyBase64;
}
  
const getSignature = function (policyBase64) {
  
    const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accessKey, {
      asBytes: true
    });
    const signature = Crypto.util.bytesToBase64(bytes);
  
    return signature;
}

const uploadFile = function(localFilePath,userId){
    const policyBase64    = getPolicyBase64 ();//加密签证超时时间
    const signature       = getSignature(policyBase64);//加密计算出签名
    const perfix          = 'front/' + userId + '/';//oss上存储位置
    var   aliyunFileKey;//oss文件名
    //模拟器
    if(localFilePath.indexOf('http://tmp')!=-1){
        aliyunFileKey = localFilePath.replace('http://tmp/', perfix)
    //真机
    }else{
        aliyunFileKey = localFilePath.replace('wxfile://tmp_', perfix)
    }
    wx.uploadFile({
        url: aliyunServerURL,
        filePath: localFilePath,
        name: 'file',//必须填file
        
        formData: {
            'key': aliyunFileKey,
            'policy': policyBase64,           
            'OSSAccessKeyId': accessId,
            'signature': signature,           
            'success_action_status': '200',
        },
        success: function (res) {
            console.log(res)
        },
        fail: function (err) {
            console.log(err)
        },
    })
}

module.exports = uploadFile;