var api = require('../../lib/marketplaceApi.js');
Page({
  data: { marketId: '', account: '', password: '', loading: false },
  onLoad: function () { if (wx.getStorageSync('marketplaceMerchantToken')) wx.redirectTo({ url: '/pages/marketplaceMerchantOrders/marketplaceMerchantOrders' }); },
  input: function (e) { var next = {}; next[e.currentTarget.dataset.field] = e.detail.value; this.setData(next); },
  login: function () {
    var that = this;
    if (!that.data.marketId || !that.data.account || !that.data.password) { wx.showToast({ title: '请填写市场、账号和密码', icon: 'none' }); return; }
    that.setData({ loading: true });
    api.login(that.data.marketId, that.data.account, that.data.password).then(function (session) {
      wx.setStorageSync('marketplaceMerchantToken', session.token); wx.setStorageSync('marketplaceMerchantSession', session);
      wx.redirectTo({ url: '/pages/marketplaceMerchantOrders/marketplaceMerchantOrders' });
    }).catch(function (error) { wx.showToast({ title: error.message, icon: 'none' }); }).then(function () { that.setData({ loading: false }); });
  }
});
