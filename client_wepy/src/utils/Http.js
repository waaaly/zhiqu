import wepy from "wepy";
import Tips from "../utils/Tips";

export default class http{

    //判断响应码是否成功
    static isSuccess(res){
        return(res.statusCode == 200);
    }

    //请求异常
    static requestException(res){
        const error = {};
        error.statusCode = res.statusCode;
        error.wxData = res.data;
        error.serverData = res.data.data;
        
        if(error.wxData){
            return error;
        }
    }

    static  get (url, data, loading = true) {
        return this.request('GET', url, data, loading);
    }

    static  post (url, data, loading = true) {
        return this.request('POST', url, data, loading);
    }

    //封装微信request后台请求方法
    static async request(method, url, data, loading = true){
        var that =this;
        if(loading){
            Tips.loading();
        }
        data.code = wx.getStorageSync('userCode');
        data.rawData = wx.getStorageSync('userInfo');
        let header = {
            "Content-Type": "applciation/json",
        };
        if(wx.getStorageSync('userToken')){
            header = {
                "Content-Type": "applciation/json",
                'Authorization': 'Bearer ' + wx.getStorageSync('userToken')
            }
        }
    
        //构造请求相关参数
        const param ={
            method:method,
            url:url,
            data:data,
            header: header
        };
        console.info(`[http]request url=${url}`);
        // console.log(data);

        //异步请求
        return new Promise((resolve,reject)=>{
            wepy.request(param).then(res =>{
                
                if(this.isSuccess(res)){
                    if(res.data.data == undefined){
                        // console.log(1);
                        resolve(res.data); 
                    }    
                    else{
                        // console.log(2);
                        resolve(res.data.data); 
                    }   
                }else{
                    reject(this.requestException(res)); 
                }
                Tips.loadDone();
            })
        })      
    }
    
}