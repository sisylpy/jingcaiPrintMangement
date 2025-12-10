// pages/messages/messages.js
const app = getApp();
import { getAlertList, getUnreadCount, markAlertAsRead } from '../../lib/printerAlertApi.js';
var load = require('../../lib/load.js');

Page({
  data: {
    messageList: [],
    unreadCount: 0,
    loading: false,
    offset: 0,
    limit: 20,
    hasMore: true
  },

  onLoad() {
    this.loadMessages();
    // this.loadUnreadCount();
  },

  onShow() {
    // 页面显示时刷新
    this.setData({
      offset: 0,
      hasMore: true
    });
    this.loadMessages();
    // this.loadUnreadCount();
  },

  /**
   * 加载消息列表
   */
  loadMessages() {
    const that = this;
    that.setData({ loading: true });
    load.showLoading("加载消息中");

    getAlertList({
      managerId: app.globalData.managerId,
      days: 2,  // 获取2天内的消息
      offset: that.data.offset,
      limit: that.data.limit
    })
      .then((response) => {
        console.log('消息列表响应:', response);
        load.hideLoading();
        const res = response.result;
        
        if (res.code === 0) {
          const newList = that.data.offset === 0 ? res.list : [...that.data.messageList, ...res.list];
          that.setData({
            messageList: newList,
            unReadCount: res.unReadCount,
            loading: false,
            hasMore: res.list.length >= that.data.limit
          });
          // 更新TabBar角标
          if (res.unReadCount > 0) {
            wx.setTabBarBadge({
              index: 1,
              text: String(res.unReadCount)
            });
          } else {
            wx.removeTabBarBadge({
              index: 1
            });
          }
        } else {
          wx.showToast({
            title: res.msg || '加载失败',
            icon: 'none'
          });
          that.setData({ loading: false });
        }
      })
      .catch((error) => {
        console.error('加载消息列表失败', error);
        load.hideLoading();
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
        that.setData({ loading: false });
      });
  },

  /**
   * 加载未读消息数量
   */
  loadUnreadCount() {
    const that = this;
    getUnreadCount({ managerId: app.globalData.managerId })
      .then((response) => {
        console.log('未读消息数量响应:', response);
        const res = response.result;
        
        if (res.code === 0) {
          that.setData({
            unreadCount: res.count
          });
          
          
        }
      })
      .catch((error) => {
        console.error('加载未读消息数量失败', error);
      });
  },

  /**
   * 标记消息为已读
   */
  markAsRead(e) {
    const that = this;
    const recordId = e.currentTarget.dataset.id;
    const index = e.currentTarget.dataset.index;

    markAlertAsRead({ recordId: recordId })
      .then((response) => {
        console.log('标记已读响应:', response);
        const res = response.result;
        
        if (res.code === 0) {
          // 更新列表
          const messageList = that.data.messageList;
          messageList[index].nxArIsRead = 1;
          
          // 手动更新未读数量
          const newUnreadCount = Math.max(0, that.data.unreadCount - 1);
          
          that.setData({
            messageList: messageList,
            unreadCount: newUnreadCount
          });
          
          // 更新TabBar角标
          if (newUnreadCount > 0) {
            wx.setTabBarBadge({
              index: 1,
              text: String(newUnreadCount)
            });
          } else {
            wx.removeTabBarBadge({
              index: 1
            });
          }
        }
      })
      .catch((error) => {
        console.error('标记已读失败', error);
      });
  },

  /**
   * 显示消息详情
   */
  showMessageDetail(e) {
    const item = e.currentTarget.dataset.item;
    const index = e.currentTarget.dataset.index;
    
    console.log('显示消息详情:', item);
    console.log('消息索引:', index);
    
    // 显示消息详情弹窗
    wx.showModal({
      title: `${item.nxPrinterDeviceEntity.nxPdDeviceName} - 耗材提醒`,
      content: `${item.nxArMessage}\n\n当前余量：${item.nxArPaperCount}张\n提醒级别：${item.nxArAlertLevel === 1 ? '低' : item.nxArAlertLevel === 2 ? '中' : item.nxArAlertLevel === 3 ? '高' : '紧急'}\n时间：${this.formatTime(item.nxArCreateTime)}`,
      confirmText: item.nxArIsRead === 0 ? '标记已读' : '知道了',
      cancelText: '关闭',
      success: (res) => {
        if (res.confirm && item.nxArIsRead === 0) {
          // 如果是未读消息且用户点击了"标记已读"
          this.markAsReadById(item.nxArId, index, item);
        }
      }
    });
  },

  /**
   * 根据ID标记消息为已读
   */
  markAsReadById(recordId, index, item) {
    console.log('标记消息为已读:', { recordId, index });
    
    const that = this;
    markAlertAsRead({ recordId: recordId })
      .then((response) => {
        console.log('标记已读响应:', response);
        const res = response.result;
        
        if (res.code === 0) {
          // 更新列表
          const messageList = that.data.messageList;
          messageList[index].nxArIsRead = 1;
          
          // 手动更新未读数量
          const newUnreadCount = Math.max(0, that.data.unreadCount - 1);
          
          that.setData({
            messageList: messageList,
            unreadCount: newUnreadCount
          });
          
          // 更新TabBar角标
          if (newUnreadCount > 0) {
            wx.setTabBarBadge({
              index: 1,
              text: String(newUnreadCount)
            });
          } else {
            wx.removeTabBarBadge({
              index: 1
            });
          }
          
          wx.showToast({
            title: '已标记为已读',
            icon: 'success',
            duration: 1500
          });
          
          // 标记已读成功后，弹出订阅提示
          setTimeout(() => {
            that.showSubscribeDialog(item);
          }, 1500);
        } else {
          wx.showToast({
            title: res.msg || '标记失败',
            icon: 'none'
          });
        }
      })
      .catch((error) => {
        console.error('标记已读失败', error);
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      });
  },


  /**
   * 显示订阅提示对话框
   */
  showSubscribeDialog(item) {
    const deviceName = item.nxPrinterDeviceEntity.nxPdDeviceName;
    const alertLevel = item.nxArAlertLevel === 1 ? '低' : item.nxArAlertLevel === 2 ? '中' : item.nxArAlertLevel === 3 ? '高' : '紧急';
    
    wx.showModal({
      title: '订阅消息提醒',
      content: `订阅后可及时接收【${deviceName}】的纸张余量提醒（${alertLevel}级别），避免设备缺纸影响使用。\n\n是否订阅消息推送？`,
      confirmText: '立即订阅',
      cancelText: '暂不订阅',
      success: (res) => {
        if (res.confirm) {
          this.doSubscribe(item);
        }
      }
    });
  },

  /**
   * 执行订阅操作
   */
  doSubscribe(item) {
    const templateId = 'KRuGq4DSsh7lBc6-hkzo1CQJhFHSifBQ-H9qaI5kNgg'; // 使用你提供的模板ID
    
    console.log('请求订阅消息，设备信息:', item);
    
    wx.requestSubscribeMessage({
      tmplIds: [templateId],
      success: (res) => {
        console.log('订阅结果:', res);
        
        if (res[templateId] === 'accept') {
          wx.showToast({
            title: '订阅成功！',
            icon: 'success',
            duration: 2000
          });
          
          // 这里可以调用后端API保存订阅状态
          // this.saveSubscribeStatus(item, true);
        } else if (res[templateId] === 'reject') {
          wx.showToast({
            title: '已取消订阅',
            icon: 'none',
            duration: 2000
          });
        } else {
          wx.showToast({
            title: '订阅失败，请重试',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: (error) => {
        console.error('订阅请求失败:', error);
        wx.showToast({
          title: '订阅失败，请重试',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  /**
   * 获取级别样式
   */
  getLevelClass(level) {
    const classMap = {
      1: 'level-low',
      2: 'level-medium',
      3: 'level-high',
      4: 'level-urgent'
    };
    return classMap[level] || 'level-low';
  },

  /**
   * 格式化时间
   */
  formatTime(date) {
    // 修复iOS日期格式兼容性问题
    const formattedDate = date.replace(/-/g, '/');
    const d = new Date(formattedDate);
    const now = new Date();
    const diff = now - d;
    
    if (diff < 60000) { // 1分钟内
      return '刚刚';
    } else if (diff < 3600000) { // 1小时内
      return Math.floor(diff / 60000) + '分钟前';
    } else if (diff < 86400000) { // 1天内
      return Math.floor(diff / 3600000) + '小时前';
    } else {
      return `${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
    }
  },

  /**
   * 加载更多消息
   */
  loadMore() {
    if (this.data.loading || !this.data.hasMore) {
      return;
    }
    
    this.setData({
      offset: this.data.offset + this.data.limit
    });
    this.loadMessages();
  },
  onPullDownRefresh() {
    this.setData({
      offset: 0,
      hasMore: true
    });
    this.loadMessages();
    // this.loadUnreadCount();
    wx.stopPullDownRefresh();
  },

});
