// pages/refill/refill.js
const app = getApp();
import { refillPaper, calibratePaper } from '../../lib/printerAlertApi.js';
var load = require('../../lib/load.js');

Page({
  data: {
    deviceId: null,
    deviceName: '',
    refillType: 1, // 1-正常加纸/更换新纸 3-手动校准
    newPaperCount: '', // 新纸数量（直接设置）
    calibrateCount: '', // 校准数量
    remark: '',
    loading: false
  },

  onLoad(options) {
    const navBarHeight = app.globalData.navBarHeight * app.globalData.rpxRatio;

    this.setData({
      deviceId: options.deviceId,
      deviceName: options.deviceName || '设备',
      navBarHeight: navBarHeight
    });
  },

  /**
   * 选择加纸类型
   */
  onRefillTypeChange(e) {
    this.setData({
      refillType: parseInt(e.detail.value)
    });
  },

  /**
   * 输入新纸数量
   */
  onNewPaperCountInput(e) {
    this.setData({
      newPaperCount: e.detail.value
    });
  },

  /**
   * 输入校准数量
   */
  onCalibrateCountInput(e) {
    this.setData({
      calibrateCount: e.detail.value
    });
  },

  /**
   * 输入备注
   */
  onRemarkInput(e) {
    this.setData({
      remark: e.detail.value
    });
  },

  /**
   * 提交加纸
   */
  submitRefill() {
    const that = this;
    const { refillType, newPaperCount, calibrateCount, remark } = that.data;

    // 验证
    if (refillType !== 3 && !newPaperCount) {
      wx.showToast({
        title: '请输入新纸数量',
        icon: 'none'
      });
      return;
    }

    if (refillType === 3 && !calibrateCount) {
      wx.showToast({
        title: '请输入校准数量',
        icon: 'none'
      });
      return;
    }

    that.setData({ loading: true });
    load.showLoading("提交中");

    // 根据类型选择接口
    let apiCall;
    if (refillType === 3) {
      // 手动校准
      apiCall = calibratePaper({
        deviceId: that.data.deviceId,
        paperCount: parseInt(calibrateCount),
        operatorId: app.globalData.managerId,
        operatorName: app.globalData.nickname || '管理员',
        remark: remark
      });
    } else {
      // 正常加纸/更换新纸
      apiCall = refillPaper({
        deviceId: that.data.deviceId,
        newPaperCount: parseInt(newPaperCount),
        operatorId: app.globalData.managerId,
        operatorName: app.globalData.nickname || '管理员',
        remark: remark
      });
    }

    apiCall
      .then((response) => {
        console.log('加纸操作响应:', response);
        load.hideLoading();
        const res = response.result;
        
        if (res.code === 0) {
          // 显示详细的操作结果
          let message = res.message || '操作成功';
          if (res.wasteCount && res.wasteCount > 0) {
            message += `\n作废数量：${res.wasteCount}张`;
          }
          
          wx.showModal({
            title: '操作成功',
            content: message,
            showCancel: false,
            confirmText: '确定',
            success: () => {
              wx.navigateBack();
            }
          });
        } else {
          wx.showToast({
            title: res.msg || '操作失败',
            icon: 'none'
          });
          that.setData({ loading: false });
        }
      })
      .catch((error) => {
        console.error('加纸操作失败', error);
        load.hideLoading();
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
        that.setData({ loading: false });
      });
  },

  onNavButtonTap(){
      wx.navigateBack({delta: 1})
  }
});

