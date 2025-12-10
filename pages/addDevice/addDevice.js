// pages/addDevice/addDevice.js
const app = getApp();
import { addDevice, updateDevice } from '../../lib/printerAlertApi.js';
var load = require('../../lib/load.js');

Page({
  data: {
    mode: 'add', // 'add' 或 'edit'
    deviceId: null,
    marketId: null,
    deviceName: '',
    model: 'Epson LQ-730K',
    paperType: 1,  // 默认1-整张
    paperTypeOptions: [
      { value: 1, label: '整张' },
      { value: 2, label: '半张' },
      { value: 3, label: '三分之一张' }
    ],
    location: '',
    paperCount: 1000,
    paperMax: 1000,
    printPrice: 0.00, // 打印单据价格（元/张）
    loading: false,
    navBarHeight: 0
  },

  onLoad(options) {
    const { mode, deviceId, deviceName, model, paperType, location, paperCount, paperMax, printPrice } = options;
    
    // 使用全局数据中的导航栏高度（转换为rpx）
    const navBarHeight = app.globalData.navBarHeight * app.globalData.rpxRatio;
    
    // 调试：打印接收到的参数
    console.log('添加设备页面接收到的参数:', options);
    console.log('打印价格参数:', printPrice);
    console.log('导航栏高度:', navBarHeight, 'px');
    console.log('全局导航栏高度:', app.globalData.navBarHeight, 'px');
    console.log('rpx比例:', app.globalData.rpxRatio);
    
    if (mode === 'edit') {
      // 编辑模式
      this.setData({
        mode: 'edit',
        deviceId: deviceId ? parseInt(deviceId) : null,
        deviceName: deviceName ? decodeURIComponent(deviceName) : '',
        model: model ? decodeURIComponent(model) : 'Epson LQ-730K',
        paperType: paperType ? parseInt(paperType) : 1,
        location: location ? decodeURIComponent(location) : '',
        paperCount: paperCount ? parseInt(paperCount) : 1000,
        paperMax: paperMax ? parseInt(paperMax) : 1000,
        printPrice: printPrice ? parseFloat(printPrice) : 0.00,
        navBarHeight: navBarHeight
      });
    } else {
      // 添加模式
      this.setData({
        mode: 'add',
        marketId: app.globalData.marketId,
        navBarHeight: navBarHeight
      });
    }
  },

  /**
   * 导航栏按钮点击事件
   */
  onNavButtonTap() {
    wx.navigateBack();
  },

  /**
   * 输入设备名称
   */
  onDeviceNameInput(e) {
    this.setData({
      deviceName: e.detail.value
    });
  },

  /**
   * 输入设备型号
   */
  onModelInput(e) {
    this.setData({
      model: e.detail.value
    });
  },

  /**
   * 选择纸张类型
   */
  onPaperTypeChange(e) {
    this.setData({
      paperType: parseInt(e.detail.value)
    });
  },

  /**
   * 输入设备位置
   */
  onLocationInput(e) {
    this.setData({
      location: e.detail.value
    });
  },

  /**
   * 输入初始纸张数量
   */
  onPaperCountInput(e) {
    this.setData({
      paperCount: parseInt(e.detail.value) || 0
    });
  },

  /**
   * 输入最大容量
   */
  onPaperMaxInput(e) {
    this.setData({
      paperMax: parseInt(e.detail.value) || 0
    });
  },

  /**
   * 输入打印价格
   */
  onPrintPriceInput(e) {
    const value = e.detail.value;
    // 验证输入：只允许数字和小数点
    const validValue = value.replace(/[^\d.]/g, '');
    // 确保只有一个小数点
    const parts = validValue.split('.');
    const formattedValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : validValue;
    
    this.setData({
      printPrice: formattedValue
    });
  },

  /**
   * 提交添加/编辑设备
   */
  submitAdd() {
    const that = this;
    const { mode, deviceName, model, paperType, location, paperCount, paperMax, printPrice, marketId, deviceId } = that.data;

    // 验证并格式化打印价格
    const formattedPrintPrice = parseFloat(printPrice) || 0.00;

    // 验证必填字段
    if (!deviceName || deviceName.trim() === '') {
      wx.showToast({
        title: '请输入设备名称',
        icon: 'none'
      });
      return;
    }

    // 添加模式需要验证纸张数量
    if (mode === 'add') {
      if (!paperCount || paperCount <= 0) {
        wx.showToast({
          title: '请输入初始纸张数量',
          icon: 'none'
        });
        return;
      }

      if (!paperMax || paperMax <= 0) {
        wx.showToast({
          title: '请输入最大容量',
          icon: 'none'
        });
        return;
      }

      if (paperCount > paperMax) {
        wx.showToast({
          title: '初始数量不能超过最大容量',
          icon: 'none'
        });
        return;
      }
    }

    // 验证打印价格
    if (!printPrice || printPrice.trim() === '' || formattedPrintPrice <= 0) {
      wx.showToast({
        title: '请输入有效的打印价格',
        icon: 'none'
      });
      return;
    }

    // 获取纸张类型文本
    const getPaperTypeText = (type) => {
      const typeMap = { 1: '整张', 2: '半张', 3: '三分之一张' };
      return typeMap[type] || '整张';
    };

    // 确认操作
    const title = mode === 'edit' ? '确认修改' : '确认添加';
    const content = mode === 'edit' 
      ? `设备名称：${deviceName}\n设备型号：${model || '未设置'}\n纸张类型：${getPaperTypeText(paperType)}\n设备位置：${location || '未设置'}\n当前纸张：${paperCount}张\n最大容量：${paperMax}张\n打印价格：${formattedPrintPrice}元/张`
      : `设备名称：${deviceName}\n初始纸张：${paperCount}张\n最大容量：${paperMax}张\n打印价格：${formattedPrintPrice}元/张`;
    
    wx.showModal({
      title: title,
      content: content,
      success(res) {
        if (res.confirm) {
          if (mode === 'edit') {
            that.doUpdateDevice();
          } else {
            that.doAddDevice();
          }
        }
      }
    });
  },

  /**
   * 执行添加设备
   */
  doAddDevice() {
    const that = this;
    that.setData({ loading: true });
    load.showLoading("添加设备中");

    // 验证并格式化打印价格
    const formattedPrintPrice = parseFloat(that.data.printPrice) || 0.00;

    addDevice({
      marketId: that.data.marketId,
      deviceName: that.data.deviceName,
      model: that.data.model,
      paperType: that.data.paperType,
      location: that.data.location,
      paperCount: that.data.paperCount,
      paperMax: that.data.paperMax,
      printPrice: formattedPrintPrice
    }).then(response => {
      const data = response.result;
      load.hideLoading();
      
      if (data.code === 0) {
        wx.showToast({
          title: '添加成功',
          icon: 'success'
        });
        
        // 刷新上一页的设备列表
        const pages = getCurrentPages();
        const prevPage = pages[pages.length - 2];
        if (prevPage && prevPage.loadDeviceList) {
          prevPage.loadDeviceList();
        }
        
        // 延迟返回
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        wx.showToast({
          title: data.msg || '添加失败',
          icon: 'none'
        });
        that.setData({ loading: false });
      }
    }).catch(error => {
      console.error('添加设备失败', error);
      load.hideLoading();
      that.setData({ loading: false });
    });
  },

  /**
   * 执行更新设备
   */
  doUpdateDevice() {
    const that = this;
    that.setData({ loading: true });
    load.showLoading("更新设备中");

    // 验证并格式化打印价格
    const formattedPrintPrice = parseFloat(that.data.printPrice) || 0.00;

    console.log('更新设备参数:', {
      deviceId: that.data.deviceId,
      deviceName: that.data.deviceName,
      model: that.data.model,
      paperType: that.data.paperType,
      location: that.data.location,
      paperCount: that.data.paperCount,
      paperMax: that.data.paperMax,
      printPrice: formattedPrintPrice
    });

    updateDevice({
      deviceId: that.data.deviceId,
      deviceName: that.data.deviceName,
      model: that.data.model,
      paperType: that.data.paperType,
      location: that.data.location,
      paperCount: that.data.paperCount,
      paperMax: that.data.paperMax,
      printPrice: formattedPrintPrice
    }).then(response => {
      const data = response.result;
      load.hideLoading();
      
      if (data.code === 0) {
        wx.showToast({
          title: '修改成功',
          icon: 'success'
        });
        
        // 刷新上一页的设备列表
        const pages = getCurrentPages();
        const prevPage = pages[pages.length - 2];
        if (prevPage && prevPage.loadDeviceList) {
          prevPage.loadDeviceList();
        }
        
        // 延迟返回
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        wx.showToast({
          title: data.msg || '修改失败',
          icon: 'none'
        });
        that.setData({ loading: false });
      }
    }).catch(error => {
      console.error('修改设备失败', error);
      load.hideLoading();
      that.setData({ loading: false });
    });
  }
});

