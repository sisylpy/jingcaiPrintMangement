var load = require('../../lib/load.js');
const app = getApp();

import {
  registerMarketManager,
  loginMarketManager,
  jjshGetMarket
} from '../../lib/printerAlertApi.js'

Page({

  data: {
    canLogin: false,
    accept: false,
    managerName: null,
    phone: null,
    marketId: -1,
    role: 1, // 默认普通管理员
    roleOptions: [
      { value: 1, label: '普通管理员' },
      { value: 2, label: '市场主管' }
    ],
    showMarket: false,
    code: null
  },

  onLoad: function (options) {
    const globalData = getApp().globalData;
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      navBarHeight: globalData.navBarHeight * globalData.rpxR,
    })
    
    console.log("市场管理员注册页面 onLoad", options);

    // 检查是否从分享链接进入
    if (options.marketId && options.marketName) {
      console.log("从分享链接进入，市场信息:", options);
      this.setData({
        marketId: parseInt(options.marketId),
        marketName: decodeURIComponent(options.marketName),
        selected: true,
        isFromShare: true // 标记来自分享
      });
      
      // 如果是从分享进入，不需要加载市场列表
      wx.showToast({
        title: `欢迎加入${this.data.marketName}`,
        icon: 'none',
        duration: 2000
      });
    } else {
      // 正常进入，加载市场列表
      this._loadMarketList();
    }

    // 获取微信授权码
    this._getWxCode();
  },

  /**
   * 获取微信授权码
   */
  _getWxCode() {
    wx.login({
      success: (res) => {
        console.log('获取微信授权码成功:', res.code);
        this.setData({
          code: res.code
        });
      },
      fail: (res) => {
        console.error('获取微信授权码失败:', res);
        wx.showToast({
          title: '获取授权失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 加载市场列表
   */
  _loadMarketList() {
    load.showLoading("加载市场列表中");
    
    // 使用默认参数加载市场列表
    var data = {
      cityId: -1,
      maId: -1,
    };
    
    jjshGetMarket(data).then(res => {
      load.hideLoading();
      if (res.result.code == 0) {
        this.setData({
          itemsMarket: res.result.data,
        });
      } else {
        wx.showToast({
          title: '加载市场列表失败',
          icon: 'none'
        });
      }
    }).catch(error => {
      load.hideLoading();
      console.error('加载市场列表失败:', error);
      wx.showToast({
        title: '网络请求失败',
        icon: 'none'
      });
    });
  },

  /**
   * 选择市场
   */
  radioChangeMarket: function (e) {
    console.log('radioChangeMarket 被触发:', e.detail);
    var value = e.detail.value;
    console.log('选中的索引:', value);
    console.log('市场数据:', this.data.itemsMarket[value]);
    
    this.setData({
      marketId: this.data.itemsMarket[value].sysCityMarketId,
      selected: true,
      marketName: this.data.itemsMarket[value].sysCmMarketName,
      showMarket: false
    });
    
    console.log('弹窗状态已设置为关闭');
    this._canLogin();
  },

  /**
   * 输入管理员姓名
   */
  getManagerName: function (e) {
    if (e.detail.value.length > 0) {
      this.setData({
        managerName: e.detail.value,
      });
    } else {
      this.setData({
        managerName: null,
      });
    }
    this._canLogin();
  },

  /**
   * 输入手机号
   */
  getPhone(e) {
    if (e.detail.value.length > 0) {
      var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;

      if (!(myreg.test(e.detail.value))) {
        wx.showModal({
          title: '手机号码不正确',
          showCancel: false,
          confirmText: "知道了",
        });
      } else {
        this.setData({
          phone: e.detail.value,
        });
        this._canLogin();
      }
    } else {
      this.setData({
        phone: null,
      });
    }
  },

  /**
   * 选择角色
   */
  onRoleChange(e) {
    // picker返回的是索引(0,1)，需要转换为role值(1,2)
    this.setData({
      role: parseInt(e.detail.value) + 1
    });
    this._canLogin();
  },

  /**
   * 检查是否可以登录/注册
   */
  _canLogin() {
    console.log("_canLogin 检查条件:", {
      managerName: this.data.managerName,
      phone: this.data.phone,
      marketId: this.data.marketId
    });
    
    if (this.data.managerName !== null && this.data.phone !== null && this.data.marketId !== -1) {
      console.log("✅ 所有条件满足，canLogin = true");
      this.setData({
        canLogin: true,
      });
    } else {
      console.log("❌ 条件不满足，canLogin = false");
      this.setData({
        canLogin: false,
      });
    }
  },

  /**
   * 提示用户填写完整信息
   */
  tishi() {
    console.log("tishi 被点击，当前数据:", this.data);
    console.log("当前按钮状态:", {
      canLogin: this.data.canLogin,
      avatarUrl: this.data.avatarUrl,
      managerName: this.data.managerName,
      phone: this.data.phone,
      marketId: this.data.marketId
    });
    
    // 检查缺少哪些信息
    const missing = [];
    if (this.data.marketId === -1) missing.push('批发市场');
    if (!this.data.managerName) missing.push('管理员姓名');
    if (!this.data.phone) missing.push('联系手机');
    
    const message = missing.length > 0 
      ? `请填写: ${missing.join('、')}` 
      : '请确定填写完整信息';
    
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 3000
    });
  },

  /**
   * 微信授权点击"允许"
   */
  getUserInfo: function (e) {
    if (e.currentTarget.dataset.type == "register") {
        this._register(e);
    }
    if (e.currentTarget.dataset.type == "login") {
      this._login(e);
    }
  },

  /**
   * 选择头像并直接注册
   */
  onChooseAvatar(e) {
    console.log("✅ onChooseAvatar 被触发", e);
    const { avatarUrl } = e.detail;
    
    // 开发者工具兼容处理
    if (!avatarUrl) {
      console.warn("⚠️ avatarUrl 为空，使用默认头像");
      this._registerWithDefaultAvatar();
      return;
    }
    
    console.log("头像URL:", avatarUrl);
    
    // 直接使用选择的头像进行注册，不需要额外的授权
    this._registerWithAvatar(avatarUrl);
  },

  /**
   * 使用选择的头像进行注册
   */
  _registerWithAvatar(avatarUrl) {
    // 获取微信授权码
    wx.login({
      success: (res) => {
        console.log('重新获取微信授权码成功:', res.code);
        
        var filePathList = [avatarUrl];
        var managerName = this.data.managerName;
        var phone = this.data.phone;
    var marketId = this.data.marketId;
        var role = this.data.role;
        var code = res.code; // 使用新获取的授权码

        load.showLoading("注册中");
        console.log(filePathList, marketId, managerName, phone, role, code);
   
        registerMarketManager(filePathList, code, marketId, managerName, phone, role).then((res) => {
      load.hideLoading();
    
          console.log('注册响应:', res);
          if (res.result.code == 0) {
            // 注册成功，但不保存登录信息，因为状态是待审核
            
            wx.showModal({
              title: '注册成功',
              content: '您的账号已提交审核，请联系市场管理员开通后即可使用系统',
              showCancel: false,
              confirmText: '我知道了',
              success: () => {
                // 跳转到主页（会自动触发登录验证，发现待审核状态）
                wx.switchTab({
                  url: '/pages/index/index',
                });
              }
            });
          } else {
            wx.showToast({
              title: res.result.msg || "注册失败",
              icon: 'none'
            });
          }
        }).catch((error) => {
        load.hideLoading();
          console.error('注册失败:', error);
          wx.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
        });
      },
      fail: (res) => {
        console.error('重新获取微信授权码失败:', res);
        wx.showToast({
          title: '获取授权失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 使用默认头像注册（用于开发工具兼容）
   */
  _registerWithDefaultAvatar() {
    console.log("📝 使用默认头像注册");
    
    // 获取微信授权码
    wx.login({
      success: (res) => {
        console.log('重新获取微信授权码成功:', res.code);
    
    // 使用本地默认头像路径
    var filePathList = ['uploadImage/r.jpg']; // 默认头像
        var managerName = this.data.managerName;
        var phone = this.data.phone;
    var marketId = this.data.marketId;
        var role = this.data.role;
        var code = res.code; // 使用新获取的授权码

        load.showLoading("注册中");
        console.log(filePathList, marketId, managerName, phone, role, code);
    
        registerMarketManager(filePathList, code, marketId, managerName, phone, role).then((res) => {
      load.hideLoading();
      
          console.log('注册响应:', res);
          if (res.result.code == 0) {
            // 注册成功，但不保存登录信息，因为状态是待审核
            
            wx.showModal({
              title: '注册成功',
              content: '您的账号已提交审核，请联系市场管理员开通后即可使用系统',
              showCancel: false,
              confirmText: '我知道了',
              success: () => {
                // 跳转到主页（会自动触发登录验证，发现待审核状态）
                wx.switchTab({
                  url: '/pages/index/index',
                });
              }
            });
      } else {
            wx.showToast({
              title: res.result.msg || "注册失败",
              icon: 'none'
            });
          }
        }).catch((error) => {
        load.hideLoading();
          console.error('注册失败:', error);
          wx.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
        });
      },
      fail: (res) => {
        console.error('重新获取微信授权码失败:', res);
        wx.showToast({
          title: '获取授权失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 显示市场选择
   */
  showMarket() {
    this.setData({
      showMarket: true
    });
  },

  /**
   * 关闭市场选择
   */
  closeMarket(e) {
    console.log(e);
    this.setData({
      showMarket: false
    });
  },

  /**
   * 市场管理员登录
   */
  _login() {
    console.log("市场管理员登录");
    
    // 先获取用户信息授权
    wx.getUserProfile({
      desc: '用于登录验证',
      success: (resUser) => {
        console.log('获取用户信息成功:', resUser);
        
        // 再获取微信授权码
        wx.login({
          success: (res) => {
            console.log('重新获取微信授权码成功:', res.code);
            
            load.showLoading("登录中");
            
            loginMarketManager({ code: res.code }).then((res) => {
                load.hideLoading();
              
              console.log('登录响应:', res);
              if (res.result.code === 0) {
                // 保存管理员信息到本地存储
                wx.setStorageSync('managerInfo', res.result.data);
                wx.setStorageSync('managerId', res.result.data.managerId);
                
                wx.showToast({
                  title: '登录成功',
                  icon: 'success'
                });
                
                // 跳转到主页
                setTimeout(() => {
                    wx.switchTab({
                    url: '/pages/index/index',
                  });
                }, 1500);
                } else {
                wx.showToast({
                  title: res.result.msg || "登录失败",
                  icon: 'none'
                });
              }
            }).catch((error) => {
              load.hideLoading();
              console.error('登录失败:', error);
              wx.showToast({
                title: '网络请求失败',
                icon: 'none'
              });
            });
        },
        fail: (res) => {
            console.error('重新获取微信授权码失败:', res);
          wx.showToast({
              title: '获取授权失败，请重试',
            icon: 'none'
            });
          }
        });
      },
      fail: (res) => {
        console.error('获取用户信息失败:', res);
      wx.showToast({
          title: '需要授权才能登录，请重试',
        icon: 'none'
        });
      }
    });
  },

  /**
   * 市场管理员注册
   */
  _register(e) {
    console.log("_register 被点击，当前数据:", this.data);
    console.log("注册按钮状态:", {
      canLogin: this.data.canLogin,
      avatarUrl: this.data.avatarUrl,
      managerName: this.data.managerName,
      phone: this.data.phone,
      marketId: this.data.marketId
    });
    
    if (this.data.canLogin && this.data.managerName && this.data.managerName.length > 0) {
      // 直接注册，不需要额外的用户信息授权
      if (this.data.avatarUrl) {
        this._registerWithAvatar(this.data.avatarUrl);
      } else {
        // 否则使用默认头像注册
        this._registerWithDefaultAvatar();
      }
    } else {
      wx.showToast({
        title: '请填写完整注册项',
        icon: 'none'
      });
    }
  }

})