// app.js
const config = require('./config.js');

App({
  config: config,

  onLaunch() {
    console.log('小程序启动');
    
    // 获取设备信息和窗口信息
    const windowInfo = wx.getWindowInfo();
    const device = wx.getDeviceInfo();
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    
    console.log('窗口信息:', windowInfo);
    console.log('设备信息:', device);
    console.log('胶囊按钮信息:', menuButtonInfo);
    
    // 计算导航栏高度
    const isIOS = device.system.indexOf('iOS') > -1;
    const navBarContentHeight = isIOS ? 44 : 48;
    const statusBarHeight = windowInfo.statusBarHeight;
    const navBarHeight = menuButtonInfo.bottom + menuButtonInfo.top - statusBarHeight;
    
    // 存储到 globalData
    this.globalData = {
      ...this.globalData,
      windowWidth: windowInfo.windowWidth,
      windowHeight: windowInfo.windowHeight,
      screenHeight: windowInfo.screenHeight,
      screenWidth: windowInfo.screenWidth,
      statusBarHeight: statusBarHeight,
      navBarContentHeight: navBarContentHeight,
      navBarHeight: navBarHeight,
      menuButtonInfo: menuButtonInfo,
      rpxRatio: 750 / windowInfo.windowWidth,
      deviceInfo: device
    };
    
    this.checkUpdate();
  },

  onShow() {
    console.log('小程序显示');
  },

  onHide() {
    console.log('小程序隐藏');
  },

  // 检查更新
  checkUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      
      updateManager.onCheckForUpdate((res) => {
        console.log('检查更新结果:', res.hasUpdate);
      });

      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: (res) => {
            if (res.confirm) {
              updateManager.applyUpdate();
            }
          }
        });
      });

      updateManager.onUpdateFailed(() => {
        console.log('新版本下载失败');
      });
    }
  },

  // 获取用户信息
  getUserInfo() {
    return {
      managerId: this.globalData.managerId,
      marketId: this.globalData.marketId,
      openId: this.globalData.openId,
      nickname: this.globalData.nickname
    };
  },

  globalData: {
    // 用户信息
    managerId: null,
    marketId: null,
    openId: null,
    nickname: null,
    
    // 设备信息
    windowWidth: 375,
    windowHeight: 667,
    screenHeight: 667,
    screenWidth: 375,
    statusBarHeight: 20,
    navBarContentHeight: 44,
    navBarHeight: 64,
    menuButtonInfo: null,
    rpxRatio: 2,
    deviceInfo: null
  }
})
