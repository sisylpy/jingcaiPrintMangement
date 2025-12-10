// pages/distributer-management/distributer-management.js
const app = getApp();
import { getDistributerList, getDistributerDetail } from '../../lib/printerAlertApi.js';
var load = require('../../lib/load.js');

Page({
  data: {
    marketId: null,
    
    // 配送商列表
    distributerList: [],
    total: 0,
    
    // 加载状态
    loading: false,
    
    // 搜索
    searchKeyword: '',
    filteredList: []
  },

  onLoad(options) {
    this.setData({
      marketId: app.globalData.marketId
    });
    
    if (!this.data.marketId) {
      wx.showToast({
        title: '未获取到市场ID',
        icon: 'none'
      });
      return;
    }
    
    this.loadDistributerList();
  },

  onShow() {
    // 刷新数据
    if (this.data.marketId) {
      this.loadDistributerList();
    }
  },

  /**
   * 加载配送商列表
   */
  loadDistributerList() {
    const that = this;
    that.setData({ loading: true });
    load.showLoading("加载配送商列表中");

    getDistributerList({
      marketId: that.data.marketId
    }).then(response => {
      const data = response.result;
      load.hideLoading();
      
      if (data.code === 0) {
        that.setData({
          distributerList: data.list || [],
          total: data.total || 0,
          filteredList: data.list || [],
          loading: false
        });
      } else {
        wx.showToast({
          title: data.msg || '加载失败',
          icon: 'none'
        });
        that.setData({ loading: false });
      }
    }).catch(error => {
      console.error('加载配送商列表失败', error);
      load.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
      that.setData({ loading: false });
    });
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadDistributerList();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  /**
   * 搜索输入
   */
  onSearchInput(e) {
    const keyword = e.detail.value.toLowerCase();
    this.setData({ searchKeyword: keyword });
    this.filterDistributers();
  },

  /**
   * 筛选配送商
   */
  filterDistributers() {
    const keyword = this.data.searchKeyword;
    if (!keyword) {
      this.setData({ filteredList: this.data.distributerList });
      return;
    }

    const filtered = this.data.distributerList.filter(item => {
      return item.nxDistributerName.toLowerCase().includes(keyword) ||
             item.nxDistributerShowName.toLowerCase().includes(keyword) ||
             item.nxDistributerManager.toLowerCase().includes(keyword) ||
             item.nxDistributerPhone.includes(keyword);
    });

    this.setData({ filteredList: filtered });
  },

  /**
   * 查看配送商详情
   */
  viewDistributerDetail(e) {
    const distributerId = e.currentTarget.dataset.id;
    console.log('点击查看详情按钮，配送商ID:', distributerId);
    wx.navigateTo({
      url: `/pages/printRecords/printRecords?distributerId=${distributerId}`,
      success: function(res) {
        console.log('跳转到打印记录页面成功');
      },
      fail: function(err) {
        console.error('跳转失败:', err);
      }
    });
  },

  /**
   * 拨打电话
   */
  makePhoneCall(e) {
    const phone = e.currentTarget.dataset.phone;
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone,
        fail: () => {
          wx.showToast({
            title: '拨号失败',
            icon: 'none'
          });
        }
      });
    }
  },


  toPayList(e){
    wx.navigateTo({
      url: '/pages/distributer/payList/payList?disId=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 格式化配送商类型
   */
  getDistributerTypeText(type) {
    const typeMap = {
      1: '果蔬配送',
      2: '肉类配送',
      3: '海鲜配送',
      4: '其他'
    };
    return typeMap[type] || '未知';
  }
});
