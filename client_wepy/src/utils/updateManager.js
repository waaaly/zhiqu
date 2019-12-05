//获取全局唯一的版本更新管理器
const updateManager = wx.getUpdateManager();

//向微信后台检查是否有新版本
const checkUpdate = function() {
    return new Promise((resolve, reject) => {
        updateManager.onCheckForUpdate(res => {
            if (res.hasUpdate) {
                resolve();
            } else {
                reject();
            }
        })
    })
}

//下载新版本
const dowloadNewVersion = function() {
    console.log('正在下载新版本。。。');
    wx.showLoading({ title: '正在下载新版本' });
    return new Promise((resolve, reject) => {
        //下载成功
        updateManager.onUpdateReady(() => {
            console.log('新版下载成功！');
            wx.hideLoading();
            resolve();
        })

        //下载失败
        updateManager.onUpdateFailed(() => {
            console.log('新版下载失败！');
            wx.hideLoading();
            reject();
        })
    })
}

const restart = function() {
    updateManager.applyUpdate();
}
module.exports = checkUpdate, dowloadNewVersion, restart;