// pages/distributer-detail/distributer-detail.js
import { getDistributerDetail } from '../../lib/printerAlertApi.js';
var load = require('../../lib/load.js');

Page({
  data: {
    distributerId: null,
    distributerInfo: null,
    loading: false
  },

  onLoad(options) {
    const distributerId = options.distributerId;
    if (distributerId) {
      this.setData({ distributerId: parseInt(distributerId) });
      this.loadDistributerDetail();
    } else {
      wx.showToast({
        title: '参数错误',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  /**
   * 加载配送商详情
   */
  loadDistributerDetail() {
    const that = this;
    that.setData({ loading: true });
    load.showLoading("加载配送商详情中");

    getDistributerDetail({
      distributerId: that.data.distributerId
    }).then(response => {
      const data = response.result;
      load.hideLoading();
      
      if (data.code === 0) {
        that.setData({
          distributerInfo: data.distributer,
          loading: false
        });
      } else {
        wx.showToast({
          title: data.msg || '加载失败',
          icon: 'none'
        });
        that.setData({ loading: false });
      }
    }).catch(error => {
      console.error('加载配送商详情失败', error);
      load.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
      that.setData({ loading: false });
    });
  },

  /**
   * 拨打电话
   */
  makePhoneCall() {
    const phone = this.data.distributerInfo?.nxDistributerPhone;
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone,
        fail: () => {
          wx.showToast({
            title: '拨号失败',
            icon: 'none'
          });
        }
      });
    }
  },

  /**
   * 复制地址
   */
  copyAddress() {
    const address = this.data.distributerInfo?.nxDistributerAddress;
    if (address) {
      wx.setClipboardData({
        data: address,
        success: () => {
          wx.showToast({
            title: '地址已复制',
            icon: 'success'
          });
        }
      });
    }
  },

  /**
   * 格式化配送商类型
   */
  getDistributerTypeText(type) {
    const typeMap = {
      1: '果蔬配送',
      2: '肉类配送',
      3: '海鲜配送',
      4: '其他'
    };
    return typeMap[type] || '未知';
  }
});
