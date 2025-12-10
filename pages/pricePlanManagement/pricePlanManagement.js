// pages/pricePlanManagement/pricePlanManagement.js
import { getPricePlanList, deletePricePlan, togglePricePlanStatus } from '../../lib/printerAlertApi.js';
import load from '../../lib/load.js';
import apiUrl from '../../config.js';


Page({
  data: {
    planList: [], // 流量方案列表
    devicePlanList: [], // 设备方案列表
    currentType: 0, // 当前类型：0-流量方案，1-设备方案
    marketId: 0, // 市场ID
    marketName: '', // 市场名称
    loading: false, // 加载状态
    typeOptions: ['流量方案', '设备方案'] // 类型选项
  },

  onLoad(options) {

    this.setData({
      url: apiUrl.server,

    })
    
    this.loadMarketInfo();
    this.loadAllPlans();
  },

  onShow() {
    // 页面显示时刷新列表
    this.loadAllPlans();
  },

  /**
   * 加载市场信息
   */
  loadMarketInfo() {
    const managerInfo = wx.getStorageSync('managerInfo');
    if (managerInfo) {
      this.setData({
        marketId: managerInfo.marketId,
        marketName: managerInfo.marketName
      });
    }
  },

  /**
   * 加载所有方案（流量方案和设备方案）
   */
  async loadAllPlans() {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    load.showLoading('加载中...');

    try {
      // 并行加载两种类型的方案
      const [flowResponse, deviceResponse] = await Promise.all([
        getPricePlanList({
          marketId: this.data.marketId,
          type: 0, // 流量方案
          page: 1,
          limit: 100
        }),
        getPricePlanList({
          marketId: this.data.marketId,
          type: 1, // 设备方案
          page: 1,
          limit: 100
        })
      ]);

      console.log('流量方案响应:', flowResponse);
      console.log('设备方案响应:', deviceResponse);

      // 处理流量方案
      if (flowResponse.result && flowResponse.result.code === 0) {
        const flowList = flowResponse.result.page?.list || [];
        this.setData({
          planList: flowList
        });
      }

      // 处理设备方案
      if (deviceResponse.result && deviceResponse.result.code === 0) {
        const deviceList = deviceResponse.result.page?.list || [];
        this.setData({
          devicePlanList: deviceList
        });
      }

    } catch (error) {
      console.error('加载方案列表失败:', error);
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
      load.hideLoading();
    }
  },

  /**
   * 加载方案列表（单个类型）
   */
  async loadPlanList() {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    load.showLoading('加载中...');

    try {
      const response = await getPricePlanList({
        marketId: this.data.marketId,
        type: this.data.currentType,
        page: 1,
        limit: 100
      });

      console.log('方案列表响应:', response);

      if (response.result && response.result.code === 0) {
        // 根据实际API响应格式调整数据提取
        const planList = response.result.page?.list || [];
        console.log('提取的方案列表:', planList);
        this.setData({
          planList: planList
        });
      } else {
        wx.showToast({
          title: response.result?.msg || '加载失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('加载方案列表失败:', error);
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
      load.hideLoading();
    }
  },

  /**
   * 切换方案类型（点击切换）
   */
  switchType(e) {
    const type = parseInt(e.currentTarget.dataset.type);
    console.log('点击切换类型:', type);
    this.setData({
      currentType: type
    });
    this.loadPlanList();
  },

  /**
   * 切换方案类型（点击指示器按钮）
   */
  switchType(e) {
    const type = parseInt(e.currentTarget.dataset.type);
    console.log('点击切换类型:', type);
    this.setData({
      currentType: type
    });
  },

  /**
   * 切换方案类型（swiper滑动）
   */
  onSwiperChange(e) {
    const type = e.detail.current;
    console.log('Swiper切换:', type);
    this.setData({
      currentType: type
    });
    // 不需要重新加载数据，因为已经加载了所有数据
  },

  /**
   * 切换方案类型（picker）
   */

  /**
   * 新增方案
   */
  addPlan(e) {
    const type = parseInt(e.currentTarget.dataset.type) || this.data.currentType;
    wx.navigateTo({
      url: `/pages/pricePlanEdit/pricePlanEdit?marketId=${this.data.marketId}&type=${type}`
    });
  },

  /**
   * 编辑方案
   */
  editPlan(e) {
    const planId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/pricePlanEdit/pricePlanEdit?id=${planId}&marketId=${this.data.marketId}&type=${this.data.currentType}`
    });
  },

  /**
   * 删除方案
   */
  deletePlan(e) {
    const planId = e.currentTarget.dataset.id;
    const planName = e.currentTarget.dataset.name;

    wx.showModal({
      title: '确认删除',
      content: `确定要删除方案"${planName}"吗？`,
      success: async (res) => {
        if (res.confirm) {
          await this.confirmDeletePlan(planId);
        }
      }
    });
  },

  /**
   * 确认删除方案
   */
  async confirmDeletePlan(planId) {
    load.showLoading('删除中...');

    try {
      const response = await deletePricePlan(planId);
      console.log('删除方案响应:', response);

      if (response.result && response.result.code === 0) {
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        });
        this.loadPlanList();
      } else {
        wx.showToast({
          title: response.result?.msg || '删除失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('删除方案失败:', error);
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      });
    } finally {
      load.hideLoading();
    }
  },

  /**
   * 切换方案状态
   */
  toggleStatus(e) {
    const planId = e.currentTarget.dataset.id;
    const currentStatus = e.currentTarget.dataset.status;
    const newStatus = currentStatus === 1 ? 0 : 1;
    const action = newStatus === 1 ? '启用' : '禁用';

    wx.showModal({
      title: `确认${action}`,
      content: `确定要${action}此方案吗？`,
      success: async (res) => {
        if (res.confirm) {
          await this.confirmToggleStatus(planId, newStatus);
        }
      }
    });
  },

  /**
   * 确认切换状态
   */
  async confirmToggleStatus(planId, status) {
    load.showLoading('操作中...');

    try {
      const response = await togglePricePlanStatus(planId, status);
      console.log('切换状态响应:', response);

      if (response.result && response.result.code === 0) {
        const action = status === 1 ? '启用' : '禁用';
        wx.showToast({
          title: `${action}成功`,
          icon: 'success'
        });
        this.loadPlanList();
      } else {
        wx.showToast({
          title: response.result?.msg || '操作失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('切换状态失败:', error);
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      });
    } finally {
      load.hideLoading();
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadAllPlans().then(() => {
      wx.stopPullDownRefresh();
    });
  }
});
