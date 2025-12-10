// pages/refill-device/refill-device.js
const app = getApp();
import { getRefillListByDevice } from '../../lib/printerAlertApi.js';
const dateUtils = require('../../utils/dateUtil.js');
var load = require('../../lib/load.js');

Page({
  data: {
    deviceId: null,
    deviceName: '',
    deviceNo: '',
    recordList: [],
    summary: {
      totalRefill: 0,
      totalWaste: 0,
      refillWaste: 0,
      calibrateWaste: 0
    },
    startDate: '',
    stopDate: '',
    dateType: '',
    hanzi: '',
    update: false,
    loading: false,
    hasMore: true,
    offset: 0,
    limit: 20
  },

  onLoad(options) {
    // 获取设备信息
    const deviceId = options.deviceId;
    const deviceName = options.deviceName ? decodeURIComponent(options.deviceName) : '设备';
    const deviceNo = options.deviceNo ? decodeURIComponent(options.deviceNo) : '';
    
    this.setData({
      deviceId: deviceId,
      deviceName: deviceName,
      deviceNo: deviceNo
    });
    
    // 初始化日期
    this.initDateRange();
    // 加载数据
    this.loadRefillRecords();
  },

  /**
   * 初始化日期范围
   */
  initDateRange() {
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
  },

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
      
      this.loadRefillRecords();
    }
  },

  /**
   * 加载换纸记录
   */
  async loadRefillRecords() {
    const { startDate, stopDate, offset, limit, recordList } = this.data;
   
    this.setData({ loading: true });
    load.showLoading("加载换纸记录中");

    try {
      const params = {
        deviceId: this.data.deviceId,
        startDate: startDate || undefined,
        stopDate: stopDate || undefined,
        offset: offset,
        limit: limit
      };

      console.log('加载换纸记录，参数:', params);
      
      const response = await getRefillListByDevice(params);
      console.log('换纸记录响应:', response);
      load.hideLoading();

      if (response.result.code === 0) {
        const { list = [], summary = {}, total = 0 } = response.result;
        
        // 如果是第一页，直接设置数据；否则追加数据
        const newRecordList = offset === 0 ? list : [...recordList, ...list];
        
        this.setData({
          recordList: newRecordList,
          summary: summary,
          hasMore: newRecordList.length < total,
          loading: false
        });

        // 如果是第一页且有数据，显示成功提示
        // if (offset === 0 && list.length > 0) {
        //   wx.showToast({
        //     title: `加载了${list.length}条记录`,
        //     icon: 'success',
        //     duration: 1500
        //   });
        // }
      } else {
        wx.showToast({
          title: response.result.msg || '加载失败',
          icon: 'none'
        });
        this.setData({ loading: false });
      }
    } catch (error) {
      console.error('加载换纸记录失败:', error);
      load.hideLoading();
      wx.showToast({
        title: '网络请求失败',
        icon: 'none'
      });
      this.setData({ loading: false });
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.setData({
      offset: 0,
      recordList: [],
      hasMore: true
    });
    this.loadRefillRecords().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 上拉加载更多
   */
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({
        offset: this.data.offset + this.data.limit
      });
      this.loadRefillRecords();
    }
  },

  /**
   * 页面显示时刷新数据
   */
  onShow() {
    // 如果是从其他页面返回，可能需要刷新数据
    if (this.data.recordList.length > 0) {
      this.loadRefillRecords();
    }
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
   * 刷新数据
   */
  refreshData() {
    this.setData({
      offset: 0,
      recordList: [],
      hasMore: true
    });
    this.loadRefillRecords();
  },


});
