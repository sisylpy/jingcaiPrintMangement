var config = require('../config.js');

function post(path, data, auth) {
  return new Promise(function (resolve, reject) {
    var header = { 'content-type': 'application/json' };
    if (auth) header['X-Marketplace-Merchant-Token'] = wx.getStorageSync('marketplaceMerchantToken');
    wx.request({
      url: config.marketplaceApiUrl + 'marketplace/merchant/' + path,
      method: 'POST', data: data || {}, header: header,
      success: function (res) {
        var body = res.data;
        if (res.statusCode === 200 && body && Number(body.code) === 0) resolve(body.data);
        else reject(new Error((body && body.msg) || '服务暂不可用'));
      },
      fail: function () { reject(new Error('网络连接失败')); }
    });
  });
}

module.exports = {
  login: function (marketId, account, password) { return post('auth/login', { marketId: Number(marketId), account: account, password: password }); },
  orders: function () { return post('orders', {}, true); },
  orderDetail: function (merchantOrderId) { return post('orders/detail', { merchantOrderId: Number(merchantOrderId) }, true); },
  transition: function (merchantOrderId, toStatus) { return post('orders/transition', { merchantOrderId: Number(merchantOrderId), toStatus: toStatus }, true); },
  printTasks: function () { return post('print/tasks', { limit: 50 }, true); },
  retryPrint: function (printTaskId) { return post('print/tasks/retry', { printTaskId: Number(printTaskId) }, true); }
};
