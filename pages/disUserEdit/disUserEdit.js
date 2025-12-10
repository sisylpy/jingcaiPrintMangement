// pages/disUserEdit/disUserEdit.js - 市场管理员信息修改页面
var load = require('../../lib/load.js');
import apiUrl from '../../config.js'

import {
  updateMarketManagerInfo,
  updateMarketManagerAvatar,
  loginMarketManager
} from '../../lib/printerAlertApi.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    canSave: false,
    imgChanged: false,
    managerInfo: null,
    managerName: '',
    phone: '',
    avatar: '',
    managerId: null,
    currentUserRole: null, // 当前登录用户的角色
    isEditingOtherUser: false // 是否在编辑其他用户
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const app = getApp();
    const globalData = app.globalData;

    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      navBarHeight: globalData.navBarHeight * globalData.rpxR,
      url: apiUrl.server,
    })

    // 优先获取传递的用户信息（从用户管理页面跳转）
    var editUserItem = wx.getStorageSync('editUserItem');
    var managerInfo = null;
    
    if (editUserItem) {
      // 从用户管理页面跳转，使用传递的用户信息
      console.log('从用户管理页面获取用户信息:', editUserItem);
      
      // 转换数据格式以适配API
      managerInfo = {
        managerId: editUserItem.userId,
        managerName: editUserItem.nickname,
        phone: editUserItem.phone,
        avatar: editUserItem.avatar,
        role: editUserItem.role,
        marketName: '当前市场' // 这里可能需要从其他地方获取
      };
    } else {
      // 没有传递信息，使用当前登录管理员信息
      managerInfo = wx.getStorageSync('managerInfo');
      console.log('使用当前登录管理员信息:', managerInfo);
    }

    if (managerInfo) {
      console.log('设置页面数据:', managerInfo);
      
      // 获取当前登录用户的角色信息
      const currentManagerInfo = wx.getStorageSync('managerInfo');
      const currentUserRole = currentManagerInfo ? currentManagerInfo.role : null;
      const isEditingOtherUser = !!editUserItem;
      
      this.setData({
        managerInfo: managerInfo,
        managerName: managerInfo.managerName,
        currentUserRole: currentUserRole,
        isEditingOtherUser: isEditingOtherUser,
        phone: managerInfo.phone,
        avatar: managerInfo.avatar,
        managerId: managerInfo.managerId
      })
      
      console.log('页面数据设置完成:', {
        managerName: managerInfo.managerName,
        phone: managerInfo.phone,
        avatar: managerInfo.avatar,
        managerId: managerInfo.managerId
      });
      
      // 设置头像显示
      if (managerInfo.avatar) {
        if (managerInfo.avatar.startsWith('http')) {
          this.setData({
            src: managerInfo.avatar
          })
        } else {
          this.setData({
            src: apiUrl.server + managerInfo.avatar
          })
        }
      } else {
        // 如果没有头像，设置默认头像
        this.setData({
          src: '/images/avatar.png'
        })
      }
    } else {
      wx.showToast({
        title: '未找到管理员信息',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  /**
   * 选择头像
   */
  choiceImg: function (e) {
    var _this = this;

    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        _this.setData({
          src: res.tempFilePaths[0],
          imgChanged: true,
          canSave: true
        })
        
        // 立即上传头像
        var filePathList = [res.tempFilePaths[0]];
        var managerId = _this.data.managerId;
        
        load.showLoading("更新头像中");
        updateMarketManagerAvatar(filePathList, managerId).then(res => {
          load.hideLoading();
          if (res.result.code === 0) {
            wx.showToast({
              title: '头像更新成功',
              icon: 'success'
            });
            
            // 更新本地存储的头像路径
            let managerInfo = wx.getStorageSync('managerInfo');
            managerInfo.avatar = res.result.data.avatar;
            wx.setStorageSync('managerInfo', managerInfo);
            
            _this.setData({
              avatar: res.result.data.avatar,
              imgChanged: false
            });
          } else {
            wx.showToast({
              title: res.result.msg || '头像更新失败',
              icon: 'none'
            });
          }
        }).catch(error => {
          load.hideLoading();
          console.error('头像更新失败:', error);
          wx.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
        });
      },
      fail: function () {
        wx.showToast({
          title: '选择头像失败',
          icon: 'none'
        });
      }
    })
  },

  /**
   * 获取管理员姓名
   */
  getManagerName(e) {
    const newName = e.detail.value;
    if (newName !== this.data.managerInfo.managerName) {
      this.setData({
        managerName: newName,
        canSave: true,
      })
    } else {
      this.setData({
        canSave: false
      });
    }
  },

  /**
   * 获取手机号
   */
  getPhone(e) {
    const newPhone = e.detail.value;
    if (newPhone !== this.data.managerInfo.phone) {
      this.setData({
        phone: newPhone,
        canSave: true,
      })
    } else {
      this.setData({
        canSave: false
      });
    }
  },

  /**
   * 角色选择处理
   */
  onRoleChange(e) {
    const newRole = parseInt(e.detail.value);
    console.log('角色选择:', newRole);
    
    if (newRole !== this.data.managerInfo.role) {
      // 更新managerInfo中的角色
      const managerInfo = { ...this.data.managerInfo };
      managerInfo.role = newRole;
      
      this.setData({
        managerInfo: managerInfo,
        canSave: true
      });
    } else {
      this.setData({
        canSave: false
      });
    }
  },

  /**
   * 手机号码验证（失去焦点时调用）
   */
  validatePhone(e) {
    const phone = e.detail.value;
    console.log("validatePhone", phone);
    
    if (phone.length > 0) {
      // 手机号码验证正则表达式
      var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;

      if (!(myreg.test(phone))) {
        wx.showModal({
          title: '手机号码不正确',
          showCancel: false,
          confirmText: "知道了",
        });
        this.setData({
          phoneValid: false
        });
      } else {
        this.setData({
          phoneValid: true
        });
      }
    } else {
      this.setData({
        phoneValid: false
      });
    }
  },

  /**
   * 保存修改内容
   */
  save() {
    const { managerName, phone, managerId } = this.data;
    
    // 验证必填字段
    if (!managerName.trim()) {
      wx.showToast({
        title: '请输入管理员姓名',
        icon: 'none'
      });
      return;
    }

    if (!phone.trim()) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      });
      return;
    }

    // 验证手机号格式
    var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    if (!(myreg.test(phone))) {
      wx.showToast({
        title: '手机号码格式不正确',
        icon: 'none'
      });
      return;
    }

    const updateData = {
      managerId: managerId,
      managerName: managerName,
      phone: phone,
      role: this.data.managerInfo.role // 添加角色信息
    };

    load.showLoading("保存修改内容");
    
    updateMarketManagerInfo(updateData).then(res => {
      load.hideLoading();
      
      if (res.result.code === 0) {
        wx.showToast({
          title: '修改成功',
          icon: 'success'
        });
        
        // 更新本地存储
        let managerInfo = wx.getStorageSync('managerInfo');
        managerInfo.managerName = managerName;
        managerInfo.phone = phone;
        wx.setStorageSync('managerInfo', managerInfo);
        
        // 更新页面数据
        this.setData({
          managerInfo: managerInfo,
          canSave: false
        });
        
        // 通知上一页刷新用户列表
        const pages = getCurrentPages();
        const prevPage = pages[pages.length - 2]; // 获取上一页
        
        if (prevPage && prevPage.route === 'pages/user-management/user-management') {
          // 如果上一页是用户管理页面，调用其刷新方法
          if (prevPage.loadUserList) {
            prevPage.loadUserList();
          }
        }
        
        // 返回上一页
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        wx.showToast({
          title: res.result.msg || '修改失败',
          icon: 'none'
        });
      }
    }).catch(error => {
      load.hideLoading();
      console.error('修改失败:', error);
      wx.showToast({
        title: '网络请求失败',
        icon: 'none'
      });
    });
  },

  /**
   * 页面卸载时清理数据
   */
  onUnload() {
    wx.removeStorageSync('editUserItem');
  },

  /**
   * 返回上一页
   */
  toBack() {
    wx.navigateBack({
      delta: 1,
    })
  }
})