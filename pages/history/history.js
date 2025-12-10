// pages/history/history.js
const app = getApp();
import { getRefillListByDevice } from '../../lib/printerAlertApi.js';
var load = require('../../lib/load.js');

Page({
  data: {
    deviceId: null,
    historyList: [],
    loading: false,
    offset: 0,
    limit: 20,
    hasMore: true
  },

  onLoad(options) {
    this.setData({
      deviceId: options.deviceId,
    });
  
    this.loadHistory();
  },

  /**
   * 加载加纸历史
   */
  loadHistory() {
    const that = this;
    that.setData({ loading: true });
    load.showLoading("加载历史记录中");

    getRefillListByDevice({
      deviceId: that.data.deviceId,
      offset: that.data.offset,
      limit: that.data.limit
    })
      .then((response) => {
        console.log('加纸历史响应:', response);
        load.hideLoading();
        const res = response.result;
        
        if (res.code === 0) {
          const newList = that.data.offset === 0 ? res.list : [...that.data.historyList, ...res.list];
          that.setData({
            historyList: newList,
            loading: false,
            hasMore: res.list.length >= that.data.limit
          });
        } else {
          wx.showToast({
            title: res.msg || '加载失败',
            icon: 'none'
          });
          that.setData({ loading: false });
        }
      })
      .catch((error) => {
        console.error('加载加纸历史失败', error);
        load.hideLoading();
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
        that.setData({ loading: false });
      });
  },

  /**
   * 获取加纸类型文本
   */
  getRefillTypeText(type) {
    const typeMap = {
      1: '正常加纸',
      2: '初始化',
      3: '手动校准'
    };
    return typeMap[type] || '未知';
  },

  /**
   * 格式化时间
   */
  formatTime(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.setData({
      offset: 0,
      hasMore: true
    });
    this.loadHistory();
    wx.stopPullDownRefresh();
  },

  /**
   * 上拉加载更多
   */
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({
        offset: this.data.offset + this.data.limit
      });
      this.loadHistory();
    }
  }
});

