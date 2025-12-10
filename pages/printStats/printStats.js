// pages/printStats/printStats.js
const app = getApp();
import { getPrintStats } from '../../lib/printerAlertApi.js';
const dateUtils = require('../../utils/dateUtil.js');
var load = require('../../lib/load.js');

Page({


  onShow() {
    if(this.data.update){
      var myDate = wx.getStorageSync('myDate');
      if(myDate){
        // 如果是自定义日期，传递具体的开始和结束日期
        var dateRange;
        if (myDate.name === 'custom' ) {
          dateRange = dateUtils.getDateRange(myDate.name, myDate.startDate, myDate.stopDate);
        } else {
          dateRange = dateUtils.getDateRange(myDate.name);
        }
        
        this.setData({
          startDate: dateRange.startDate,
          stopDate: dateRange.stopDate,
          dateType: myDate.dateType,
          hanzi: myDate.hanzi || dateRange.name,
          update: false
        })
      }
      
      this.loadAllStats();
    }
  },


  data: {
    marketId: null,
   
    startDate: '',
    stopDate: '',

    update: false,
    
    // 汇总数据
    summary: {
      printCount: 0,
      totalPaper: 0,
      totalAmount: 0
    },
    
    // 设备统计
    deviceStats: [],
    
    // 日期统计（最近7天）
    dailyStats: [],
    
    loading: false
  },

  onLoad() {
    this.setData({
      marketId: app.globalData.marketId
    });
    
    var myDate = wx.getStorageSync('myDate');
    if(myDate){
      // 如果是自定义日期，传递具体的开始和结束日期
      var dateRange;
      if (myDate.name === 'custom' ) {
        dateRange = dateUtils.getDateRange(myDate.name, myDate.startDate, myDate.stopDate);
      } else {
        dateRange = dateUtils.getDateRange(myDate.name);
      }
      
      this.setData({
        startDate: dateRange.startDate,
        stopDate: dateRange.stopDate,
        dateType: myDate.dateType,
        hanzi: myDate.hanzi || dateRange.name,
      })
    }else{
      this.setData({
        dateType: 'month',
        startDate: dateUtils.getFirstDateInMonth(),
        stopDate: dateUtils.getArriveDate(0),
        hanzi: "本月",
      })
    }
    this.loadAllStats();
   
  },

  /**
   * 加载所有统计数据（使用合并后的接口）
   */
  loadAllStats() {
    const that = this;
    that.setData({ loading: true });
    load.showLoading("加载统计数据中");

    console.log('加载统计数据，参数:', {
      marketId: that.data.marketId,
      startDate: that.data.startDate,
      stopDate: that.data.stopDate
    });

    // 使用合并后的接口，一次调用获取所有数据
    getPrintStats({
      marketId: that.data.marketId,
      startDate: that.data.startDate,
      stopDate: that.data.stopDate
    }).then(response => {
      const data = response.result;
      load.hideLoading();
      
      if (data.code === 0) {
        console.log('统计数据加载成功:', data);
        
        that.setData({
          summary: data.summary || { printCount: 0, totalPaper: 0, totalAmount: 0 },
          dailyStats: data.dailyStats || [],
          loading: false
        });
      } else {
        console.error('统计数据加载失败:', data.msg);
        wx.showToast({
          title: data.msg || '加载失败',
          icon: 'none'
        });
        that.setData({ loading: false });
      }
    }).catch(error => {
      console.error('加载统计数据失败', error);
      load.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
      that.setData({ loading: false });
    });
  },

  /**
   * 跳转到打印记录列表
   */
  goToPrintRecords() {
    wx.navigateTo({
      url: `/pages/printRecords/printRecords?startDate=${this.data.startDate}&stopDate=${this.data.stopDate}`
    });
  },

  /**
   * 跳转到设备详情
   */
  goToDeviceDetail(e) {
    const deviceId = e.currentTarget.dataset.deviceId;
    console.log('点击设备，设备ID:', deviceId);
    
    // 检查设备ID是否有效
    if (!deviceId || deviceId === 'null' || deviceId === 'undefined') {
      console.error('设备ID无效:', deviceId);
      wx.showToast({
        title: '设备信息异常',
        icon: 'none'
      });
      return;
    }
    
    // 跳转到打印记录页面，传递设备ID
    wx.navigateTo({
      url: `/pages/printRecords/printRecords?deviceId=${deviceId}&startDate=${this.data.startDate}&stopDate=${this.data.stopDate}`
    });
  },

  /**
   * 格式化日期
   */
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * 格式化金额
   */
  formatAmount(amount) {
    return parseFloat(amount || 0).toFixed(2);
  },

  /**
   * 获取设备状态文本
   */
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
   * 获取设备状态样式类
   */
  getStatusClass(status) {
    const classMap = {
      0: 'status-offline',
      1: 'status-normal',
      2: 'status-error',
      3: 'status-no-paper'
    };
    return classMap[status] || 'status-unknown';
  },

  /**
   * 获取纸张类型文本
   */
  getPaperTypeText(type) {
    const typeMap = {
      1: '整张',
      2: '半张',
      3: '三分之一张'
    };
    return typeMap[type] || '整张';
  },

  /**
   * 格式化时间
   */
  formatDateTime(dateTime) {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${month}-${day} ${hour}:${minute}`;
  },

  /**
   * 格式化日期
   */
  formatDateOnly(dateTime) {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}-${day}`;
  },

  /**
   * 计算纸张余量百分比
   */
  getPaperPercentage(current, max) {
    if (!max || max === 0) return 0;
    return Math.round((current / max) * 100);
  },

  /**
   * 获取纸张余量状态
   */
  getPaperStatus(current, max) {
    const percentage = this.getPaperPercentage(current, max);
    if (percentage < 10) return { level: 'danger', text: '严重不足' };
    if (percentage < 30) return { level: 'warning', text: '不足' };
    if (percentage < 70) return { level: 'normal', text: '正常' };
    return { level: 'good', text: '充足' };
  },

  /**
   * 跳转到日期选择页面
   */
  toDatePage() {
    wx.navigateTo({
      url: '/pages/sel/date/date?dateType=' + this.data.dateType + '&startDate=' + this.data.startDate
       + '&stopDate=' + this.data.stopDate,
    })
  },

  /**
   * 跳转到指定日期的打印记录页面
   */
  goToDailyRecords(e) {
    const date = e.currentTarget.dataset.date;
    if (!date) {
      wx.showToast({
        title: '日期参数错误',
        icon: 'none'
      });
      return;
    }
    
    wx.navigateTo({
      url: `/pages/printRecords/printRecords?startDate=${date}&stopDate=${date}&dateType=customer&hanzi=自定义`
    });
  }
});

