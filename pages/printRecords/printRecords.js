// pages/printRecords/printRecords.js
const app = getApp();
import { getPrintRecordList } from '../../lib/printerAlertApi.js';
const dateUtils = require('../../utils/dateUtil.js');
var load = require('../../lib/load.js');

Page({



  onShow(){
   
    if(this.data.update){
      // 如果使用了自定义传入的日期，不更新日期设置
      if(this.data.hasCustomDate){
        this.setData({
          update: false
        });
      } else {
        // 如果没有使用自定义日期，则从本地存储读取
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
      }
     
     this.loadRecords();
    }
     
    
    
   },

   

  data: {
    marketId: null,
    deviceId: null, // 设备ID，用于筛选特定设备的打印记录
    deviceName: null, // 设备名称，用于显示标题
    title: '打印记录', // 页面标题
    startDate: '',
    stopDate: '',
    hasCustomDate: false, // 标记是否使用了自定义传入的日期
    
    // 筛选条件
    distributerId: null,
    
    // 记录列表
    recordList: [],
    total: 0,
    offset: 0,
    limit: 20,
    hasMore: true,
    
    loading: false,
    loadingMore: false
  },

  onLoad(options) {
    console.log('printRecords页面加载，接收到的参数:', options);
    console.log('app.globalData.marketId:', app.globalData.marketId);
    console.log('设备ID:', options.deviceId);
    console.log('设备名称:', options.deviceName);
    
    // 设置标题：如果有设备名称则显示设备名称，否则显示日期
    let title = '打印记录';
    if (options.deviceName) {
      title = decodeURIComponent(options.deviceName);
    } else if (options.startDate) {
      title = options.startDate + ' 打印记录';
    }
    
    this.setData({
      navBarHeight: app.globalData.navBarHeight * app.globalData.rpxRatio,
      marketId: app.globalData.marketId,
      deviceId: options.deviceId || null, // 接收设备ID参数
      deviceName: options.deviceName ? decodeURIComponent(options.deviceName) : null, // 接收设备名称参数
      startDate: options.startDate || '',
      stopDate: options.stopDate || '',
      hanzi: options.hanzi,
      title: title
    });

    // 如果传入了日期参数，优先使用传入的日期
    if (options.startDate && options.stopDate) {
      this.setData({
        startDate: options.startDate,
        stopDate: options.stopDate,
        dateType: options.dateType,
        hanzi: options.hanzi || options.startDate,
        hasCustomDate: true, // 标记使用了自定义日期
      });
    } 
    // else {
    //   // 如果没有传入日期参数，则从本地存储读取
    //   var myDate = wx.getStorageSync('myDate');
    //   if(myDate){
    //     // 如果是自定义日期，传递具体的开始和结束日期
    //     var dateRange;
    //     if (myDate.name === 'custom' ) {
    //       dateRange = dateUtils.getDateRange(myDate.name, myDate.startDate, myDate.stopDate);
    //     } else {
    //       dateRange = dateUtils.getDateRange(myDate.name);
    //     }
        
    //     this.setData({
    //       startDate: dateRange.startDate,
    //       stopDate: dateRange.stopDate,
    //       dateType: myDate.dateType,
    //       hanzi: myDate.hanzi || dateRange.name,
    //     })
    //   }else{
    //     this.setData({
    //       dateType: 'month',
    //       startDate: dateUtils.getFirstDateInMonth(),
    //       stopDate: dateUtils.getArriveDate(0),
    //       hanzi:  "本月",
    //     })
    //   }
    // }
    
    
    console.log('设置的数据:', {
      marketId: this.data.marketId,
    });
    
    // 如果是从配送商页面跳转过来的，更新页面标题
    if (options.distributerId) {
      wx.setNavigationBarTitle({
        title: '配送商打印记录'
      });
    }
    
    this.loadRecords();
  },

  /**
   * 加载打印记录
   */
  loadRecords() {
    const that = this;
    
    if (that.data.loading || that.data.loadingMore) {
      return;
    }
    
    // 检查marketId是否为空
    if (!that.data.marketId) {
      console.error('marketId为空，无法加载打印记录');
      wx.showToast({
        title: '市场ID缺失',
        icon: 'none'
      });
      return;
    }
    
    console.log('加载打印记录，参数:', {
      marketId: that.data.marketId,
      startDate: that.data.startDate,
      stopDate: that.data.stopDate
    });
    
    const isRefresh = that.data.offset === 0;
    that.setData({ 
      loading: isRefresh,
      loadingMore: !isRefresh
    });

    if (isRefresh) {
      load.showLoading("加载打印记录中");
    }

    // 构建请求参数，只有当deviceId有效时才传递
    const params = {
      marketId: that.data.marketId,
      startDate: that.data.startDate,
      stopDate: that.data.stopDate,
      offset: that.data.offset,
      limit: that.data.limit
    };
    
    // 只有当deviceId有效时才添加到参数中
    if (that.data.deviceId && that.data.deviceId !== 'null' && that.data.deviceId !== 'undefined') {
      params.deviceId = that.data.deviceId;
    }
    
    getPrintRecordList(params).then(response => {
      const data = response.result;
      if (isRefresh) {
        load.hideLoading();
      }
      
      if (data.code === 0) {
        const newList = data.list || [];
        const recordList = that.data.offset === 0 ? newList : [...that.data.recordList, ...newList];
        
        that.setData({
          recordList,
          total: data.total || 0,
          hasMore: recordList.length < (data.total || 0),
          loading: false,
          loadingMore: false
        });
      } else {
        wx.showToast({
          title: data.msg || '加载失败',
          icon: 'none'
        });
        that.setData({ loading: false, loadingMore: false });
      }
    }).catch(error => {
      console.error('加载打印记录失败', error);
      if (isRefresh) {
        load.hideLoading();
      }
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
      that.setData({ loading: false, loadingMore: false });
    });
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.setData({ offset: 0 });
    this.loadRecords();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  /**
   * 上拉加载更多
   */
  onReachBottom() {
    if (this.data.hasMore && !this.data.loadingMore) {
      this.setData({
        offset: this.data.offset + this.data.limit
      });
      this.loadRecords();
    }
  },

  /**
   * 格式化纸张类型
   */
  getPaperTypeText(type) {
    const typeMap = {
      1: '整张',
      2: '半张',
      3: '三分之一张'
    };
    return typeMap[type] || '整张';
  },


  toDatePageSearch(){
    wx.navigateTo({
      url: '/pages/sel/date/date?dateType=' + this.data.dateType + '&startDate=' + this.data.startDate
      + '&stopDate=' + this.data.stopDate,
    })
  },

  toBack(){
    wx.navigateBack({delta : 1})
  }
});

