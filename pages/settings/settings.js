// pages/settings/settings.js
const app = getApp();

Page({
  data: {
    userInfo: {}
  },

  onLoad(options) {
    this.loadUserInfo();
    var managerInfo = wx.getStorageSync('managerInfo');
    if(managerInfo){
      this.setData({
        managerInfo: managerInfo
      })
    }
  },

  /**
   * 加载用户信息
   */
  loadUserInfo() {
    const userInfo = {
      nickname: app.globalData.nickname || '管理员',
      managerId: app.globalData.managerId
    };
    this.setData({ userInfo });
  },

  /**
   * 跳转到设备管理页面
   */
  goToDeviceManagement() {
    wx.navigateTo({
      url: '/pages/device-management/device-management'
    });
  },

  /**
   * 跳转到人员管理页面
   */
  goToUserManagement() {
    wx.navigateTo({
      url: '/pages/user-management/user-management'
    });
  },

  /**
   * 跳转到打印统计页面
   */
  goToDeviceStats() {
    wx.navigateTo({
      url: '/pages/deviceStats/deviceStats'
    });
  },
  goToPrintStats() {
    wx.navigateTo({
      url: '/pages/printStats/printStats'
    });
  },

  /**
   * 跳转到换纸管理页面
   */
  goToRefillManagement() {
    wx.navigateTo({
      url: '/pages/refill-management/refill-management'
    });
  },

  /**
   * 跳转到充值管理页面
   */
  goToRechargeManagement() {
    wx.navigateTo({
      url: '/pages/recharge-management/recharge-management'
    });
  },


  /**
   * 跳转到打印记录页面
   */
  goToPrintRecords() {
    wx.navigateTo({
      url: '/pages/printRecords/printRecords'
    });
  },

  /**
   * 跳转到价格管理页面
   */
  goToPriceManagement() {
    wx.navigateTo({
      url: '/pages/pricePlanManagement/pricePlanManagement'
    });
  },

  /**
   * 跳转到配送商管理页面
   */
  goToDistributerManagement() {
    wx.navigateTo({
      url: '/pages/distributer-management/distributer-management'
    });
  },

  /**
   * 跳转到关于页面
   */
  goToAbout() {
    wx.showModal({
      title: '关于我们',
      content: '农批市场多联针式打印机票据自助打印中心\n版本：1.0.0\n联系电话：13910825707',
      showCancel: false,
      confirmText: '确定'
    });
    
  }
});
