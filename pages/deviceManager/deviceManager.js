// pages/deviceManager/deviceManager.js
const app = getApp();
import { getDeviceManagers, addDeviceManager, updateDeviceManager, deleteDeviceManager, getUserList, wxLogin } from '../../lib/printerAlertApi.js';
var load = require('../../lib/load.js');

Page({
  data: {
    deviceId: null,
    deviceInfo: {},
    managerList: [],
    
    // 弹窗相关
    showEditModal: false,
    editMode: 'add', // 'add' | 'edit'
    currentEdit: {},
    
    // 可选管理员列表
    availableManagers: [],
    selectedManagerIndex: -1,
    
    // 通知级别选项
    notifyLevels: [
      { value: 1, label: '1级及以上 (≤500张)' },
      { value: 2, label: '2级及以上 (≤200张)' },
      { value: 3, label: '3级及以上 (≤50张)' },
      { value: 4, label: '4级 (≤10张)' }
    ]
  },

  onLoad(options) {
    const deviceId = parseInt(options.deviceId);
    const deviceName = options.deviceName ? decodeURIComponent(options.deviceName) : '打印设备';
    const deviceNo = options.deviceNo ? decodeURIComponent(options.deviceNo) : '';
    
    this.setData({
      deviceId,
      deviceInfo: {
        deviceName,
        deviceNo
      }
    });
    
    // 优先从缓存中获取marketId
    const cachedMarketId = wx.getStorageSync('marketId');
    if (cachedMarketId) {
      app.globalData.marketId = cachedMarketId;
      console.log('从缓存获取marketId:', cachedMarketId);
    }
    
    // 检查登录状态
    if (!app.globalData.managerId) {
      this.wxLogin();
    } else {
      this.loadManagerList();
      this.loadAvailableManagers();
    }
  },

  onPullDownRefresh() {
    this.loadManagerList();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  /**
   * 微信登录
   */
  wxLogin() {
    const that = this;
    wx.login({
      success: (res) => {
        if (res.code) {
          console.log('发送登录请求，code:', res.code);
          
          // 使用API文件的登录接口
          wxLogin({ code: res.code })
            .then((response) => {
              console.log('登录响应:', response);
              const loginRes = response.result;
              
              if (loginRes.code === 0) {
                // 保存用户信息到全局数据和本地存储
                app.globalData.managerId = loginRes.managerId;
                app.globalData.marketId = loginRes.marketId;
                app.globalData.openId = loginRes.openId;
                app.globalData.nickname = loginRes.nickname;
                app.globalData.subscribeStatus = loginRes.subscribeStatus;
                
                wx.setStorageSync('managerId', loginRes.managerId);
                wx.setStorageSync('marketId', loginRes.marketId);
                wx.setStorageSync('openId', loginRes.openId);
                wx.setStorageSync('nickname', loginRes.nickname);
                wx.setStorageSync('subscribeStatus', loginRes.subscribeStatus);
                
                // 登录成功后加载数据
                that.loadManagerList();
                that.loadAvailableManagers();
              } else {
                wx.showToast({
                  title: loginRes.msg || '登录失败',
                  icon: 'none'
                });
              }
            })
            .catch((error) => {
              console.error('登录请求失败', error);
              wx.showToast({
                title: '网络请求失败',
                icon: 'none'
              });
            });
        } else {
          console.error('登录失败', res.errMsg);
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          });
        }
      },
      fail: (error) => {
        console.error('微信登录失败', error);
        wx.showToast({
          title: '微信登录失败',
          icon: 'none'
        });
      }
    });
  },

  // 加载责任人列表
  async loadManagerList() {
    try {
      load.showLoading("加载责任人列表中");
      
      const res = await getDeviceManagers({ deviceId: this.data.deviceId });
      load.hideLoading();
      
      if (res.result.code === 0) {
        console.log('获取责任人列表成功:', res.result.list);
        this.setData({
          managerList: res.result.list || []
        });
      } else {
        wx.showToast({
          title: res.result.msg || '加载失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('加载责任人列表失败', error);
      load.hideLoading();
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      });
    }
  },

  // 加载可选用户列表
  async loadAvailableManagers() {
    try {
      // 获取marketId
      const marketId = app.globalData.marketId;
      if (!marketId) {
        console.error('marketId为空，无法获取用户列表');
        this.setData({
          availableManagers: []
        });
        wx.showToast({
          title: '市场信息缺失，无法获取用户列表',
          icon: 'none'
        });
        return;
      }
      
      console.log('调用getUserList，marketId:', marketId);
      load.showLoading("加载用户列表中");
      const res = await getUserList({ marketId });
      console.log('getUserList响应:', res);
      load.hideLoading();
      
      if (res.result.code === 0) {
        console.log('获取用户列表成功:', res.result.list);
        this.setData({
          availableManagers: res.result.list || []
        });
      } else {
        console.error('获取用户列表失败:', res.result.msg);
        // 如果API失败，使用空数组
        this.setData({
          availableManagers: []
        });
        wx.showToast({
          title: res.result.msg || '获取用户列表失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('加载用户列表失败', error);
      // 网络错误时也使用空数组
      this.setData({
        availableManagers: []
      });
      wx.showToast({
        title: '网络错误，无法获取用户列表',
        icon: 'none'
      });
    }
  },

  // 添加责任人
  onAdd() {
    this.setData({
      showEditModal: true,
      editMode: 'add',
      currentEdit: {
        nxDmIsPrimary: 0,
        nxDmNotifyLevel: 1
      },
      selectedManagerIndex: -1
    });
  },

  // 编辑责任人
  onEdit(e) {
    const item = e.currentTarget.dataset.item;
    console.log('编辑责任人，item数据:', item);
    this.setData({
      showEditModal: true,
      editMode: 'edit',
      currentEdit: { 
        ...item,
        // 确保字段名正确映射
        nxDmId: item.nxDmId || item.nx_dm_id,
        nxDmNotifyLevel: item.nxDmNotifyLevel || item.nx_dm_notify_level || 1,
        nxDmIsPrimary: item.nxDmIsPrimary !== undefined ? item.nxDmIsPrimary : (item.nx_dm_is_primary !== undefined ? item.nx_dm_is_primary : 0),
        enable: item.nxDmEnable !== undefined ? item.nxDmEnable : (item.nx_dm_enable !== undefined ? item.nx_dm_enable : 1)
      }
    });
    console.log('设置后的currentEdit:', this.data.currentEdit);
  },

  // 切换启用/禁用
  onToggleEnable(e) {
    const id = e.currentTarget.dataset.id;
    const enable = e.currentTarget.dataset.enable;
    const newEnable = enable === 1 ? 0 : 1;
    
    wx.showModal({
      title: '确认操作',
      content: `确定要${newEnable === 1 ? '启用' : '禁用'}该责任人吗？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            wx.showLoading({ title: '处理中...' });
            
            const result = await updateDeviceManager({
              id,
              enable: newEnable
            });
            
            if (result.result.code === 0) {
              wx.showToast({
                title: newEnable === 1 ? '已启用' : '已禁用',
                icon: 'success'
              });
              this.loadManagerList();
            } else {
              wx.showToast({
                title: result.result.msg || '操作失败',
                icon: 'none'
              });
            }
          } catch (error) {
            console.error('切换状态失败', error);
            wx.showToast({
              title: '网络错误',
              icon: 'none'
            });
          } finally {
            wx.hideLoading();
          }
        }
      }
    });
  },

  // 删除责任人
  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    const name = e.currentTarget.dataset.name;
    
    wx.showModal({
      title: '确认删除',
      content: `确定要删除责任人"${name}"吗？`,
      confirmColor: '#fa5151',
      success: async (res) => {
        if (res.confirm) {
          try {
            wx.showLoading({ title: '删除中...' });
            
            const result = await deleteDeviceManager({ id });
            
            if (result.result.code === 0) {
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              });
              this.loadManagerList();
            } else {
              wx.showToast({
                title: result.result.msg || '删除失败',
                icon: 'none'
              });
            }
          } catch (error) {
            console.error('删除失败', error);
            wx.showToast({
              title: '网络错误',
              icon: 'none'
            });
          } finally {
            wx.hideLoading();
          }
        }
      }
    });
  },

  // 选择用户
  onManagerChange(e) {
    const index = e.detail.value;
    this.setData({
      selectedManagerIndex: index
    });
  },

  // 切换主要责任人
  onPrimaryChange(e) {
    const isPrimary = e.detail.value ? 1 : 0;
    this.setData({
      'currentEdit.nxDmIsPrimary': isPrimary
    });
  },

  // 选择通知级别
  onLevelChange(e) {
    const level = this.data.notifyLevels[e.detail.value].value;
    this.setData({
      'currentEdit.nxDmNotifyLevel': level
    });
  },

  // 确认添加/编辑
  async onConfirm() {
    const { editMode, currentEdit, selectedManagerIndex, availableManagers } = this.data;
    
    console.log('onConfirm - editMode:', editMode);
    console.log('onConfirm - currentEdit:', currentEdit);
    
    // 验证
    if (editMode === 'add' && selectedManagerIndex < 0) {
      wx.showToast({
        title: '请选择用户',
        icon: 'none'
      });
      return;
    }
    
    try {
      wx.showLoading({ title: '保存中...' });
      
      let result;
      if (editMode === 'add') {
        // 添加 - 使用选中的用户ID
        const user = availableManagers[selectedManagerIndex];
        result = await addDeviceManager({
          deviceId: this.data.deviceId,
          managerId: user.nxMmId,
          notifyLevel: currentEdit.nxDmNotifyLevel,
          isPrimary: currentEdit.nxDmIsPrimary
        });
      } else {
        // 编辑
        console.log('编辑模式 - currentEdit:', currentEdit);
        console.log('编辑模式 - id:', currentEdit.nxDmId);
        console.log('编辑模式 - notifyLevel:', currentEdit.nxDmNotifyLevel);
        console.log('编辑模式 - isPrimary:', currentEdit.nxDmIsPrimary);
        console.log('编辑模式 - enable:', currentEdit.enable);
        
        // 构建更新参数，过滤掉undefined值
        const updateParams = {
          id: currentEdit.nxDmId
        };
        
        // 只有当值不为undefined时才添加到参数中
        if (currentEdit.nxDmNotifyLevel !== undefined) {
          updateParams.notifyLevel = currentEdit.nxDmNotifyLevel;
        }
        if (currentEdit.nxDmIsPrimary !== undefined) {
          updateParams.isPrimary = currentEdit.nxDmIsPrimary;
        }
        if (currentEdit.enable !== undefined) {
          updateParams.enable = currentEdit.enable;
        }
        
        console.log('更新参数:', updateParams);
        
        result = await updateDeviceManager(updateParams);
      }
      
      if (result.result.code === 0) {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });
        this.setData({ showEditModal: false });
        this.loadManagerList();
      } else {
        wx.showToast({
          title: result.result.msg || '保存失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('保存失败', error);
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 关闭弹窗
  onCloseModal() {
    this.setData({
      showEditModal: false
    });
  },

  // 阻止冒泡
  stopPropagation() {}
});
