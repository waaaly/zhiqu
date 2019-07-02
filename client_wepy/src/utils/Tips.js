/*
 *提示与加载工具类
 */
export default class Tips{
    static isLoading = false;
    static pause = false;

    //弹出成功提示框
    static showSuccess(title,durationTime = 500){
        wx.wx.showModal({
            title: title,
            icon:'success',
            mask:true,
            duration:durationTime
        });
        if(durationTime > 0){
            return new Promise((resolve,reject) =>{
                setTimeout(() => {
                    reject();
                },durationTime);
            });
        }
    }

    //弹出确认操作窗口不含取消
    static showComfire(text, title='提示'){
        return new Promise((resolve,reject) =>{
            wx.showModal({
                title:title,
                content:text,
                showCancel:false,
                success:res =>{
                    resolve(res);
                },
                fail:(res) =>{
                    reject(res);
                }
            });
        });
    }

    //弹出确认窗口包含取消操作
    static showModel(text, payload = {}, title='提示'){
        return new promise((resolve,reject) =>{
            wx.showModal({
                title:title,
                content:text,
                showCancel:true,
                success:(res) =>{
                    if(res.comfire){
                        resolve(payload);
                    }else if(res.cancel){
                        reject(payload);
                    }
                },
                fail:(res) =>{
                    reject(payload);
                }
            });
        });
    }

    //弹出toast默认显示成功图标
    static showToast(title, onHide=true, icon = 'success'){
        wx.showToast({
            title:title,
            icon:icon,
            mask:true,
            duration:500
        });
        if(onHide){
            setTimeout(() =>{
                onHide();
            },500);
        }
    }

    //警告框
    static alert (title='非法操作'){
        wx.showToast({
            icon:'/images/icons/alert.png',
            title:title,
            mask:true,
            duration:500
        });
        return new promise((resolve,reject) =>{
            setTimeout(() =>{
                resolve();
            },500)
        });
    }

    //错误框
    static error (title,onHide = 'true'){
        wx.showToast({
            title:title,
            image:'/images/icons/error.png',
            mask:true,
            duration:500
        });
        if(onHide){
            setTimeout(() =>{
                onHide();
            },500)
        }
    }

    //弹出加载提示
    static loading (title='加载中'){
        if(this.isLoading){
            return;
        }
        this.isLoading = true;
        if(wx.showLoading){
            wx.showLoading({
                title:title,
                mask:true
            });
        }else{
            wx.showNavigationBarLoading();
        }
    }

    //加载完成
    static loadDone(){
        
        if(this.isLoading){
            this.isLoading = false;
            if(wx.hideLoading)
                wx.hideLoading();
            else{
                wx.hideNavigationBarLoading();
            }  
        }
    }

    //
}