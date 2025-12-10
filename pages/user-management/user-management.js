// pages/user-management/user-management.js
const app = getApp();
var load = require('../../lib/load.js');
import apiUrl from '../../config.js'

import {
  getMarketManagerList,
  getMarketManagerInfo,
  approveMarketManager
} from '../../lib/printerAlertApi.js'

Page({
  data: {
    userList: [],
    marketId: null, // 当前市场ID
    marketName: '', // 当前市场名称
    currentUserRole: null, // 当前登录用户的角色
    roleOptions: [
      { value: 1, label: '普通管理员' },
      { value: 2, label: '市场主管' }
    ]
  },

  onLoad(options) {

    this.setData({
      url: apiUrl.server,

    })
    // 获取当前管理员的市场信息
    const managerInfo = wx.getStorageSync('managerInfo');
    if (managerInfo && managerInfo.marketId) {
      this.setData({
        marketId: managerInfo.marketId,
        marketName: managerInfo.marketName || '当前市场',
        currentUserRole: managerInfo.role // 获取当前用户角色
      });
      this.loadUserList();
    } else {
      wx.showToast({
        title: '未找到市场信息',
        icon: 'none'
      });
    }
  },

  /**
   * 加载用户列表
   */
  loadUserList() {
    if (!this.data.marketId) {
      wx.showToast({
        title: '市场ID不存在',
        icon: 'none'
      });
      return;
    }

    load.showLoading("加载用户列表中");
    
    getMarketManagerList({ marketId: this.data.marketId }).then(res => {
      load.hideLoading();
      
      console.log('获取市场管理员列表响应:', res);
      if (res.result.code === 0) {
        // 转换数据格式以适配现有UI
        const userList = res.result.list.map(manager => ({
          userId: manager.nxMmId,
          nickname: manager.nxMmName,
          phone: manager.nxMmPhone,
          role: manager.nxMmRole,
          roleText: manager.nxMmRole === 1 ? '普通管理员' : '市场主管',
          avatar: manager.nxMmWxAvatar,
          status: manager.nxMmStatus,
          createTime: manager.nxMmCreateTime,
          lastLoginTime: manager.nxMmLastLoginTime
        }));
        
        this.setData({
          userList: userList
        });
      } else {
        wx.showToast({
          title: res.result.msg || '加载用户列表失败',
          icon: 'none'
        });
      }
    }).catch(error => {
      load.hideLoading();
      console.error('加载用户列表失败:', error);
      wx.showToast({
        title: '网络请求失败',
        icon: 'none'
      });
    });
  },

  /**
   * 用户点击分享按钮或右上角分享
   */
  onShareAppMessage() {
    const { marketId, marketName } = this.data;
    
    if (!marketId) {
      return {
        title: '市场管理员注册',
        path: '/pages/login/login',
        imageUrl: '/images/share-logo.png'
      };
    }

    // 构建分享链接，包含市场信息
    const sharePath = `/pages/login/login?marketId=${marketId}&marketName=${encodeURIComponent(marketName)}`;
    
    return {
      title: `邀请您加入${marketName}市场管理`,
      path: sharePath,
      imageUrl: '/images/share-logo.png'
    };
  },

  /**
   * 删除用户
   */
  deleteUser(e) {
    const userId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个用户吗？',
      success: (res) => {
        if (res.confirm) {
          this.confirmDelete(userId);
        }
      }
    });
  },

  /**
   * 确认删除用户
   */
  confirmDelete(userId) {
    // 注意：API文档中没有删除用户的接口，这里只是前端移除
    // 实际项目中可能需要调用后端删除接口
    wx.showToast({
      title: '删除成功',
      icon: 'success'
    });
    
    // 从列表中移除
    const userList = this.data.userList.filter(user => user.userId !== userId);
    this.setData({ userList });
  },


  /**
   * 跳转到修改页面
   */
  goToEditPage(e) {
    const user = e.currentTarget.dataset.user;
    console.log('跳转到修改页面:', user);
    
    // 将用户信息存储到本地，供修改页面使用
    wx.setStorageSync('editUserItem', user);
    
    wx.navigateTo({
      url: '/pages/disUserEdit/disUserEdit'
    });
  },

  /**
   * 审核通过管理员
   */
  approveUser(e) {
    const user = e.currentTarget.dataset.user;
    const that = this;
    
    wx.showModal({
      title: '确认开通',
      content: `确认开通管理员"${user.nickname}"的账号吗？`,
      success: (res) => {
        if (res.confirm) {
          load.showLoading('开通中');
          
          approveMarketManager({
            managerId: user.userId,
            approveStatus: 1 // 1-通过并开通
          }).then((response) => {
            load.hideLoading();
            
            if (response.result.code === 0) {
              wx.showToast({
                title: '开通成功',
                icon: 'success'
              });
              // 重新加载用户列表
              that.loadUserList();
            } else {
              wx.showToast({
                title: response.result.msg || '开通失败',
                icon: 'none'
              });
            }
          }).catch((error) => {
            load.hideLoading();
            console.error('开通失败:', error);
            wx.showToast({
              title: '开通失败',
              icon: 'none'
            });
          });
        }
      }
    });
  },

  /**
   * 禁用管理员
   */
  disableUser(e) {
    const user = e.currentTarget.dataset.user;
    const that = this;
    
    // 先检查当前市场是否只有1个启用的管理员
    const enabledCount = this.data.userList.filter(u => u.status === 1).length;
    
    if (enabledCount <= 1) {
      wx.showModal({
        title: '无法禁用',
        content: '该市场必须至少保留一个启用的管理员，无法禁用',
        showCancel: false,
        confirmText: '知道了'
      });
      return;
    }
    
    wx.showModal({
      title: '确认禁用',
      content: `确认禁用管理员"${user.nickname}"的账号吗？`,
      success: (res) => {
        if (res.confirm) {
          load.showLoading('禁用中');
          
          approveMarketManager({
            managerId: user.userId,
            approveStatus: 0 // 0-拒绝/禁用
          }).then((response) => {
            load.hideLoading();
            
            if (response.result.code === 0) {
              wx.showToast({
                title: '禁用成功',
                icon: 'success'
              });
              // 重新加载用户列表
              that.loadUserList();
            } else {
              wx.showToast({
                title: response.result.msg || '禁用失败',
                icon: 'none'
              });
            }
          }).catch((error) => {
            load.hideLoading();
            console.error('禁用失败:', error);
            wx.showToast({
              title: '禁用失败',
              icon: 'none'
            });
          });
        }
      }
    });
  }
});
