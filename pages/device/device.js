// pages/device/device.js
const app = getApp();
import { getDeviceDetail } from '../../lib/printerAlertApi.js';
var load = require('../../lib/load.js');

Page({
  data: {
    deviceId: null,
    device: null,
    loading: false
  },

  onLoad(options) {
    this.setData({
      deviceId: options.deviceId
    });
    this.loadDeviceDetail();
  },

  /**
   * 加载设备详情
   */
  loadDeviceDetail() {
    const that = this;
    that.setData({ loading: true });
    load.showLoading("加载设备详情中");

    getDeviceDetail({ deviceId: that.data.deviceId })
      .then((response) => {
        console.log('设备详情响应:', response);
        load.hideLoading();
        const res = response.result;
        
        if (res.code === 0) {
          that.setData({
            device: res.device,
            loading: false
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
        console.error('加载设备详情失败', error);
        load.hideLoading();
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
        that.setData({ loading: false });
      });
  },

  /**
   * 跳转到加纸历史
   */
  goToHistory() {
    wx.navigateTo({
      url: `/pages/history/history?deviceId=${this.data.deviceId}`
    });
  },

  /**
   * 获取阈值级别文本
   */
  getThresholdLevelText(level) {
    const levelMap = {
      1: '低',
      2: '中',
      3: '高',
      4: '紧急'
    };
    return levelMap[level] || '未知';
  },

  /**
   * 获取阈值级别样式
   */
  getThresholdLevelClass(level) {
    const classMap = {
      1: 'level-low',
      2: 'level-medium',
      3: 'level-high',
      4: 'level-urgent'
    };
    return classMap[level] || 'level-low';
  },

  /**
   * 获取纸张余量状态样式
   */
  getPaperCountClass(paperCount, paperMax) {
    const ratio = paperCount / paperMax;
    if (ratio < 0.1) return 'status-danger';
    if (ratio < 0.3) return 'status-warning';
    return 'status-normal';
  },

  /**
   * 跳转到阈值设置页面
   */
  goToThresholdSetting() {
    const deviceId = this.data.deviceId;
    const deviceName = this.data.device?.nxPdDeviceName || '设备';
    
    wx.navigateTo({
      url: `/pages/threshold/threshold?deviceId=${deviceId}&deviceName=${encodeURIComponent(deviceName)}`
    });
  },

  /**
   * 编辑设备
   */
  editDevice() {
    const device = this.data.device;
    if (!device) return;
    
    // 将设备信息转换为URL参数
    const params = {
      mode: 'edit',
      deviceId: device.nxPdId,
      deviceName: encodeURIComponent(device.nxPdDeviceName || ''),
      model: encodeURIComponent(device.nxPdModel || ''),
      paperType: device.nxPdPaperType || 1,
      location: encodeURIComponent(device.nxPdLocation || ''),
      paperCount: device.nxPdPaperCount || 0,
      paperMax: device.nxPdPaperMax || 0,
      printPrice: device.nxPdPrintPrice || 0.00
    };
    
    // 构建URL参数
    const queryString = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    // 跳转到添加设备页面（编辑模式）
    wx.navigateTo({
      url: `/pages/addDevice/addDevice?${queryString}`
    });
  },

  /**
   * 跳转到设备责任人管理页面
   */
  goToDeviceManager() {
    const device = this.data.device;
    if (!device) {
      wx.showToast({
        title: '设备信息加载中',
        icon: 'none'
      });
      return;
    }
    
    wx.navigateTo({
      url: `/pages/deviceManager/deviceManager?deviceId=${device.nxPdId}&deviceName=${encodeURIComponent(device.nxPdDeviceName || '打印设备')}&deviceNo=${encodeURIComponent(device.nxPdDeviceNo || '')}`
    });
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadDeviceDetail();
    wx.stopPullDownRefresh();
  }
});

