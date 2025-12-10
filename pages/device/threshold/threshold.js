// pages/threshold/threshold.js
const app = getApp();
import * as printerApi from '../../utils/printerAlertApi.js';

Page({
  data: {
    deviceId: null,
    deviceName: '',
    thresholds: [
      { level: 1, threshold: 500, message: '纸张剩余不足500张', enable: 1, levelText: '低', color: '#52c41a' },
      { level: 2, threshold: 200, message: '纸张即将用尽，请及时补充', enable: 1, levelText: '中', color: '#faad14' },
      { level: 3, threshold: 50, message: '纸张严重不足，请立即加纸！', enable: 1, levelText: '高', color: '#ff7a45' },
      { level: 4, threshold: 10, message: '紧急！纸张即将耗尽！', enable: 1, levelText: '紧急', color: '#f5222d' }
    ],
    loading: false,
    saving: false
  },

  onLoad(options) {
    if (options.deviceId) {
      this.setData({
        deviceId: parseInt(options.deviceId),
        deviceName: options.deviceName || '设备'
      });
      this.loadThresholds();
    }
  },

  /**
   * 加载阈值配置
   */
  loadThresholds() {
    const that = this;
    that.setData({ loading: true });

    printerApi.getThresholdList({ deviceId: that.data.deviceId }).then(response => {
      const data = response.result;
      if (data.code === 0 && data.list && data.list.length > 0) {
        // 合并级别文本和颜色
        const thresholds = data.list.map(item => {
          const config = that.getLevelConfig(item.nxAtLevel);
          return {
            level: item.nxAtLevel,
            threshold: item.nxAtThreshold,
            message: item.nxAtMessage,
            enable: item.nxAtEnable,
            thresholdId: item.nxAtId,
            levelText: config.levelText,
            color: config.color
          };
        });
        that.setData({ thresholds, loading: false });
      } else {
        wx.showToast({
          title: data.msg || '加载失败',
          icon: 'none'
        });
        that.setData({ loading: false });
      }
    }).catch(error => {
      console.error('加载阈值失败', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
      that.setData({ loading: false });
    });
  },

  /**
   * 获取级别配置
   */
  getLevelConfig(level) {
    const configs = {
      1: { levelText: '低', color: '#52c41a' },
      2: { levelText: '中', color: '#faad14' },
      3: { levelText: '高', color: '#ff7a45' },
      4: { levelText: '紧急', color: '#f5222d' }
    };
    return configs[level] || configs[1];
  },

  /**
   * 阈值输入
   */
  onThresholdInput(e) {
    const index = e.currentTarget.dataset.index;
    const value = parseInt(e.detail.value) || 0;
    this.setData({
      [`thresholds[${index}].threshold`]: value
    });
  },

  /**
   * 切换启用状态
   */
  onEnableChange(e) {
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value ? 1 : 0;
    this.setData({
      [`thresholds[${index}].enable`]: value
    });
  },

  /**
   * 使用推荐值（根据最大容量计算）
   */
  useRecommended() {
    const that = this;
    wx.showModal({
      title: '使用推荐值',
      content: '将根据标准容量设置推荐阈值\n低：500张\n中：200张\n高：50张\n紧急：10张',
      success(res) {
        if (res.confirm) {
          const recommended = [
            { level: 1, threshold: 500, message: '纸张剩余不足500张', enable: 1 },
            { level: 2, threshold: 200, message: '纸张即将用尽，请及时补充', enable: 1 },
            { level: 3, threshold: 50, message: '纸张严重不足，请立即加纸！', enable: 1 },
            { level: 4, threshold: 10, message: '紧急！纸张即将耗尽！', enable: 1 }
          ];
          
          const thresholds = that.data.thresholds.map((item, index) => {
            return {
              ...item,
              threshold: recommended[index].threshold,
              message: recommended[index].message,
              enable: recommended[index].enable
            };
          });
          
          that.setData({ thresholds });
          
          wx.showToast({
            title: '已应用推荐值',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 保存阈值配置
   */
  saveThresholds() {
    const that = this;

    // 验证阈值递减
    const values = that.data.thresholds.map(t => t.threshold);
    for (let i = 0; i < values.length - 1; i++) {
      if (values[i] <= values[i + 1]) {
        wx.showModal({
          title: '阈值设置错误',
          content: '阈值必须递减！\n低 > 中 > 高 > 紧急',
          showCancel: false
        });
        return;
      }
    }

    that.setData({ saving: true });

    // 转换为后端需要的格式
    const thresholds = that.data.thresholds.map(item => ({
      level: item.level,
      threshold: item.threshold,
      message: item.message,
      enable: item.enable
    }));

    printerApi.updateThresholdBatch({
      deviceId: that.data.deviceId,
      thresholds: thresholds
    }).then(response => {
      const data = response.result;
      if (data.code === 0) {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });
        
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        wx.showToast({
          title: data.msg || '保存失败',
          icon: 'none'
        });
      }
      that.setData({ saving: false });
    }).catch(error => {
      console.error('保存失败', error);
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
      that.setData({ saving: false });
    });
  }
});

