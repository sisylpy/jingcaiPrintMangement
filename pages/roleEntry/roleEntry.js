Page({
  openMerchant: function () { wx.navigateTo({ url: '/pages/marketplaceMerchantLogin/marketplaceMerchantLogin' }); },
  openManager: function () { wx.switchTab({ url: '/pages/index/index' }); }
});
