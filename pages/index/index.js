// pages/index/index.js
const app = getApp();
var load = require('../../lib/load.js');
import apiUrl from '../../config.js'

import { loginMarketManager, getDeviceList } from '../../lib/printerAlertApi.js';

Page({
  data: {
    deviceList: [],
    loading: false,
    marketId: null,
    userAvatar: '/images/avatar.png', // 用户头像，默认为默认头像
    loginFailed: false, // 登录失败状态
    loginErrorMsg: '', // 登录错误信息
    loginErrorType: '', // 登录错误类型：'not_registered', 'pending_approval', 'disabled', 'other'
    unReadCount: 0 // 未读消息数量
  },

  onLoad() {
    // 计算页面内容区域的padding-top
    const { statusBarHeight, navBarHeight, rpxRatio } = app.globalData;
    const paddingTop = (statusBarHeight + navBarHeight + 20) * rpxRatio;
    
    this.setData({
      pageContentPaddingTop: `${paddingTop}rpx`
    });

    // 获取用户头像
    this.loadUserAvatar();
    
    // 检查登录状态
    if (!app.globalData.managerId) {
      this.wxLogin();
    } else {
    this.setData({
        marketId: app.globalData.marketId
      });
      this.loadDeviceList();
    }
  },

  onShow() {
    // 页面显示时检查登录状态
    const managerInfo = wx.getStorageSync('managerInfo');
    if (managerInfo && managerInfo.managerId) {
      // 用户已登录，清除登录失败状态
      this.setData({
        loginFailed: false,
        loginErrorMsg: '',
        marketId: managerInfo.marketId
      });
      
      // 更新用户头像
      this.loadUserAvatar();
      
      // 刷新设备列表
      this.loadDeviceList();
    } else if (this.data.loginFailed) {
      // 如果还在登录失败状态，重新尝试登录
      this.wxLogin();
    }
  },

  /**
   * 加载用户头像
   */
  loadUserAvatar() {
    const managerInfo = wx.getStorageSync('managerInfo');
    if (managerInfo && managerInfo.avatar) {
      let avatarUrl = managerInfo.avatar;
      
      // 如果头像不是完整URL，添加服务器地址
      if (!avatarUrl.startsWith('http')) {
        avatarUrl = apiUrl.server + avatarUrl;
      }
      
      this.setData({
        userAvatar: avatarUrl
      });
      
      console.log('设置用户头像:', avatarUrl);
    } else {
      console.log('未找到用户头像，使用默认头像');
      this.setData({
        userAvatar: '/images/avatar.png'
      });
    }
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
          loginMarketManager({ code: res.code })
            .then((response) => {
              console.log('登录响应:', response);
              const loginRes = response.result;
              
              if (loginRes.code === 0) {
                const userData = loginRes.data; // 用户数据在data字段中
                console.log('用户数据:', userData);
                
                // 保存用户信息到全局数据和本地存储
                app.globalData.managerId = userData.managerId;
                app.globalData.marketId = userData.marketId;
                app.globalData.managerName = userData.managerName;
                app.globalData.phone = userData.phone;
                app.globalData.role = userData.role;
                app.globalData.avatar = userData.avatar;
                app.globalData.marketName = userData.marketName;
                
                // 保存完整的managerInfo对象
                wx.setStorageSync('managerInfo', userData);
                wx.setStorageSync('managerId', userData.managerId);
                wx.setStorageSync('marketId', userData.marketId);
                
                // 设置页面数据并加载设备列表
                that.setData({
                  marketId: userData.marketId
                });
                that.loadDeviceList();
                
                // 更新用户头像
                that.loadUserAvatar();
               
              } else {
                // 检查是否是未注册用户
                if (loginRes.code === 500 && loginRes.msg.includes('还未注册')) {
                  // 用户未注册，显示登录失败状态
                  that.setData({
                    loginFailed: true,
                    loginErrorMsg: '您还未注册为市场管理员',
                    loginErrorType: 'not_registered'
                  });
                } else if (loginRes.code === 500 && loginRes.msg.includes('待审核')) {
                  // 用户待审核状态
                  that.setData({
                    loginFailed: true,
                    loginErrorMsg: '您的账号待审核，请联系市场管理员开通',
                    loginErrorType: 'pending_approval'
                  });
                } else if (loginRes.code === 500 && loginRes.msg.includes('已禁用')) {
                  // 用户账号被禁用
                  that.setData({
                    loginFailed: true,
                    loginErrorMsg: '账号已被禁用，请联系系统管理员',
                    loginErrorType: 'disabled'
                  });
                } else {
                  // 其他登录错误
                  that.setData({
                    loginFailed: true,
                    loginErrorMsg: loginRes.msg || '登录失败',
                    loginErrorType: 'other'
                  });
                }
              }
            })
            .catch((error) => {
              console.error('登录请求失败', error);
              wx.showToast({
                title: '网络请求失败',
                icon: 'none',
                duration: 3000
              });
            });
        } else {
          console.error('登录失败', res.errMsg);
        }
      },
      fail: (error) => {
        console.error('wx.login失败', error);
      }
    });
  },

  /**
   * 跳转到注册页面
   */
  goToRegister() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },

  /**
   * 重新登录
   */
  retryLogin() {
    this.setData({
      loginFailed: false,
      loginErrorMsg: '',
      loginErrorType: ''
    });
    this.wxLogin();
  },

  /**
   * 加载设备列表
   */
  loadDeviceList() {
    const that = this;
    that.setData({ loading: true });
    load.showLoading("获取设备中");
    
    wx.request({
      url: apiUrl.apiUrl + 'machine/device/list',
      data: {
        marketId: that.data.marketId,
        managerId: app.globalData.managerId,
        days: 2
      },
      success: (res) => {
        console.log('设备列表响应:', res);
        load.hideLoading();
        
        if (res.data.code === 0) {
          // 1. 设置设备列表
          that.setData({
            deviceList: res.data.list,
            unReadCount: res.data.unReadCount || 0,
            loading: false
          });
          
          // 2. 显示未读徽章
          const unReadCount = res.data.unReadCount || 0;
          if (unReadCount > 0) {
            // 显示红点
            wx.showTabBarRedDot({
              index: 1  // 消息tab的索引
            });
            
            // 或者显示数字徽章
            wx.setTabBarBadge({
              index: 1,
              text: unReadCount > 99 ? '99+' : String(unReadCount)
            });
          } else {
            // 隐藏红点和徽章
            wx.hideTabBarRedDot({
              index: 1
            });
            wx.removeTabBarBadge({
              index: 1
            });
          }
        } else {
          wx.showToast({
            title: res.data.msg || '加载失败',
            icon: 'none'
          });
          that.setData({ loading: false });
        }
      },
      fail: (error) => {
        console.error('加载设备列表失败', error);
        load.hideLoading();
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
        that.setData({ loading: false });
      }
    });
  },

  getStatusText(status) {
    const statusMap = {
      0: '离线',
      1: '正常',
      2: '故障',
      3: '缺纸'
    };
    return statusMap[status] || '未知';
  },

  /**
   * 获取设备状态样式
   */
  getStatusClass(status) {
    const classMap = {
      0: 'status-offline',
      1: 'status-normal',
      2: 'status-danger',
      3: 'status-danger'
    };
    return classMap[status] || 'status-offline';
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
   * 跳转到加纸页面
   */
  goToRefill(e) {
    const deviceId = e.currentTarget.dataset.item.nxPdId;
    const deviceName = e.currentTarget.dataset.item.nxPdDeviceName;

    wx.navigateTo({
      url: `/pages/refill/refill?deviceId=${deviceId}&deviceName=${deviceName}`
    });
  },

  /**
   * 跳转到设备详情
   */
  goToDeviceDetail(e) {
    const deviceId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/device/device?deviceId=${deviceId}`
    });
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadDeviceList();
    wx.stopPullDownRefresh();
  },

  /**
   * 跳转到设置页面或用户修改页面
   */
  goToSettings() {
    // 获取当前用户角色
    const managerInfo = wx.getStorageSync('managerInfo');
    const userRole = managerInfo ? managerInfo.role : null;
    
    console.log('当前用户角色:', userRole);
    
    if (userRole === 1) {
      // 普通用户：跳转到用户修改页面
      console.log('普通用户，跳转到用户修改页面');
      wx.navigateTo({
        url: '/pages/disUserEdit/disUserEdit'
      });
    } else {
      // 市场主管或其他角色：跳转到设置页面
      console.log('市场主管，跳转到设置页面');
      wx.navigateTo({
        url: '/pages/settings/settings'
      });
    }
  },

  /**
   * 搜索输入事件
   */
  onSearchInput(e) {
    console.log('搜索输入:', e.detail.value);
    // TODO: 实现设备搜索功能
  },

  /**
   * 取消搜索事件
   */
  onSearchCancel() {
    console.log('取消搜索');
    // TODO: 清除搜索状态
  },

  /**
   * 排序事件
   */
  onSortBy(e) {
    console.log('排序类型:', e.detail.type);
    // TODO: 实现设备排序功能
  }
});

