var api = require('../../lib/marketplaceApi.js');
var statusMap = { PENDING_ACCEPT:'待接单',ACCEPTED:'已接单',PREPARING:'备货中',READY:'已备齐',COMPLETED:'已完成',CANCELLED:'已取消' };
var printStatusMap = { PENDING:'等待设备',CLAIMED:'正在发送',ACCEPTED:'云平台已接收',PRINTED:'已出纸',FAILED:'打印失败',UNKNOWN:'回执未知' };
Page({
  data: { orders: [], printTasks: [], tab: 'orders', loading: true, session: {} },
  onLoad: function () { this.setData({ session: wx.getStorageSync('marketplaceMerchantSession') || {} }); },
  onShow: function () { if (!wx.getStorageSync('marketplaceMerchantToken')) { wx.redirectTo({ url:'/pages/marketplaceMerchantLogin/marketplaceMerchantLogin' }); return; } this.load(); },
  load: function () { var that=this;that.setData({loading:true});Promise.all([api.orders(),api.printTasks()]).then(function(r){var orders=(r[0]||[]).map(function(o){o.statusText=statusMap[o.fulfillmentStatus]||o.fulfillmentStatus;return o});var printTasks=(r[1]||[]).map(function(t){t.statusText=printStatusMap[t.status]||t.status;return t});that.setData({orders:orders,printTasks:printTasks,loading:false})}).catch(function(e){that.setData({loading:false});wx.showToast({title:e.message,icon:'none'})}); },
  setTab: function(e){this.setData({tab:e.currentTarget.dataset.tab});},
  openOrder: function(e){wx.navigateTo({url:'/pages/marketplaceMerchantOrder/marketplaceMerchantOrder?merchantOrderId='+e.currentTarget.dataset.id});},
  retry: function(e){var that=this;wx.showModal({title:'重新打印',content:'仅失败任务可重试；未知状态必须先人工核实，系统不会盲目重打。',success:function(r){if(r.confirm)api.retryPrint(e.currentTarget.dataset.id).then(function(){wx.showToast({title:'已进入安全重试队列'});that.load()}).catch(function(err){wx.showToast({title:err.message,icon:'none'})})}});},
  logout:function(){wx.removeStorageSync('marketplaceMerchantToken');wx.removeStorageSync('marketplaceMerchantSession');wx.redirectTo({url:'/pages/marketplaceMerchantLogin/marketplaceMerchantLogin'});}
});
