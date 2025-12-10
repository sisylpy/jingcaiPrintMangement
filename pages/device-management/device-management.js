// pages/device-management/device-management.js
const app = getApp();
import { getDeviceList, getDeviceDetail, updateDevice, deleteDevice } from '../../lib/printerAlertApi.js';
var load = require('../../lib/load.js');

Page({
  data: {
    deviceList: []
  },

  onLoad(options) {
    this.loadDeviceList();
  },

  /**
   * 加载设备列表
   */
  loadDeviceList() {
    const that = this;
    load.showLoading("加载设备列表中");
    
    getDeviceList({ marketId: app.globalData.marketId })
      .then((response) => {
        console.log('设备列表响应:', response);
        load.hideLoading();
        const res = response.result;
        if (res.code === 0) {
          that.setData({ deviceList: res.list });
        } else {
          wx.showToast({
            title: res.msg || '加载失败',
            icon: 'none'
          });
        }
      })
      .catch((error) => {
        console.error('加载设备列表失败', error);
        load.hideLoading();
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
      });
  },

  /**
   * 跳转到添加设备页面
   */
  goToAddDevice() {
    wx.navigateTo({
      url: '/pages/addDevice/addDevice'
    });
  },

  /**
   * 编辑设备
   */
  editDevice(e) {
    const item = e.currentTarget.dataset.item;
    const deviceId = item.nxPdId;
    
    // 调试：打印设备数据
    console.log('编辑设备数据:', item);
    console.log('打印价格字段:', item.nxPdPrintPrice);
    
    // 先获取设备详情，确保获取到完整信息包括打印价格
    load.showLoading("获取设备详情中");
    
    getDeviceDetail({ deviceId: deviceId })
      .then((response) => {
        load.hideLoading();
        console.log('设备详情响应:', response);
        const res = response.result;
        
        if (res.code === 0) {
          const device = res.device;
          
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
          
          console.log('编辑参数:', params);
          
          // 构建URL参数
          const queryString = Object.keys(params)
            .map(key => `${key}=${params[key]}`)
            .join('&');
          
          // 跳转到添加设备页面（编辑模式）
          wx.navigateTo({
            url: `/pages/addDevice/addDevice?${queryString}`
          });
        } else {
          wx.showToast({
            title: res.msg || '获取设备信息失败',
            icon: 'none'
          });
        }
      })
      .catch((error) => {
        wx.hideLoading();
        console.error('获取设备详情失败', error);
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
      });
  },


  /**
   * 删除设备
   */
  deleteDevice(e) {
    const deviceId = e.currentTarget.dataset.id;
    const deviceName = e.currentTarget.dataset.item?.nxPdDeviceName || '该设备';
    
    wx.showModal({
      title: '确认删除',
      content: `确定要删除设备【${deviceName}】吗？\n\n⚠️ 注意：删除后将无法恢复，相关数据（阈值、提醒记录等）也会被删除！`,
      confirmText: '删除',
      confirmColor: '#F44336',
      success: (res) => {
        if (res.confirm) {
          this.doDeleteDevice(deviceId);
        }
      }
    });
  },

  /**
   * 执行删除设备
   */
  doDeleteDevice(deviceId) {
    wx.showLoading({
      title: '删除中...'
    });

    deleteDevice({
      deviceId: deviceId
    }).then(response => {
      wx.hideLoading();
      const data = response.result;
      if (data.code === 0) {
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        });
        
        this.loadDeviceList(); // 刷新列表
      } else {
        // 删除失败，显示详细错误信息，延长显示时间
        wx.showModal({
          title: '删除失败',
          content: data.msg || '删除失败，请稍后重试',
          showCancel: false,
          confirmText: '知道了',
          confirmColor: '#F44336'
        });
      }
    }).catch(error => {
      wx.hideLoading();
      console.error('删除设备失败', error);
      wx.showModal({
        title: '删除失败',
        content: '网络请求失败，请检查网络连接后重试',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#F44336'
      });
    });
  },

  /**
   * 添加设备管理人员
   */
  addManagerUser(e) {
    const deviceId = e.currentTarget.dataset.id;
    const deviceItem = e.currentTarget.dataset.item;
    const deviceName = deviceItem.nxPdDeviceName || '该设备';
    const deviceNo = deviceItem.nxPdDeviceNo || '';
    
    console.log('添加管理人员，设备ID:', deviceId, '设备名称:', deviceName);
    
    // 跳转到设备责任人管理页面
    wx.navigateTo({
      url: `/pages/deviceManager/deviceManager?deviceId=${deviceId}&deviceName=${encodeURIComponent(deviceName)}&deviceNo=${encodeURIComponent(deviceNo)}`
    });
  }
});
