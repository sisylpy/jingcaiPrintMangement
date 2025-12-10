// lib/printerAlertApi.js
import apiUrl from '../config.js';

// ==================== 用户认证 API ====================


/**
 * 微信授权登录
 * @param {Object} data 
 * @param {String} data.code - 微信授权码
 */
export const wxLogin = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/auth/wxLogin',
      method: 'POST',
      data: {
        code: data.code
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e);
        load.hideLoading();
        wx.showToast({
          title: '请检查网络',
          icon: 'none'
        })
      }
    })
  })
}
// ==================== 设备管理 API ====================

/**
 * 获取设备列表
 * @param {Object} params - 参数对象
 * @param {number} params.marketId - 市场ID
 * @returns {Promise} 返回设备列表
 */
export const getDeviceList = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/device/list',
      method: 'GET',
      data: params,
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

/**
 * 获取设备详情
 * @param {Object} params - 参数对象
 * @param {number} params.deviceId - 设备ID
 * @returns {Promise} 返回设备详情
 */
export const getDeviceDetail = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/device/detail',
      method: 'GET',
      data: params,
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

/**
 * 添加设备
 * @param {Object} params - 参数对象
 * @returns {Promise} 返回添加结果
 */
export const addDevice = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/admin/addDevice',
      method: 'POST',
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

/**
 * 更新设备
 * @param {Object} params - 参数对象
 * @returns {Promise} 返回更新结果
 */
export const updateDevice = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/admin/updateDevice',
      method: 'POST',
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

/**
 * 删除设备
 * @param {Object} params - 参数对象
 * @param {number} params.deviceId - 设备ID
 * @returns {Promise} 返回删除结果
 */
export const deleteDevice = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/admin/deleteDevice',
      method: 'POST',
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

// ==================== 打印统计 API ====================

/**
 * 获取打印统计
 * @param {Object} params - 参数对象
 * @param {number} params.marketId - 市场ID
 * @param {string} params.startDate - 开始日期
 * @param {string} params.stopDate - 结束日期
 * @returns {Promise} 返回统计数据
 */
export const getPrintStats = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/print/stats/print',
      method: 'GET',
      data: params,
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

/**
 * 获取打印记录列表
 * @param {Object} params - 参数对象
 * @param {number} params.marketId - 市场ID
 * @param {string} params.startDate - 开始日期
 * @param {string} params.stopDate - 结束日期
 * @param {number} params.offset - 偏移量
 * @param {number} params.limit - 限制数量
 * @returns {Promise} 返回打印记录列表
 */
export const getPrintRecordList = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/print/list',
      method: 'GET',
      data: params,
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

/**
 * 获取设备打印统计
 * @param {Object} params - 参数对象
 * @param {number} params.marketId - 市场ID
 * @param {string} params.startDate - 开始日期
 * @param {string} params.stopDate - 结束日期
 * @returns {Promise} 返回设备统计数据
 */
export const getPrintDeviceStats = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/print/stats/device',
      method: 'GET',
      data: params,
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

// ==================== 纸张管理 API ====================

/**
 * 加纸
 * @param {Object} params - 参数对象
 * @param {number} params.deviceId - 设备ID
 * @param {number} params.paperCount - 纸张数量
 * @returns {Promise} 返回加纸结果
 */
export const refillPaper = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/device/refill',
      method: 'POST',
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

/**
 * 校准纸张
 * @param {Object} params - 参数对象
 * @param {number} params.deviceId - 设备ID
 * @param {number} params.paperCount - 纸张数量
 * @returns {Promise} 返回校准结果
 */
export const calibratePaper = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/device/calibrate',
      method: 'POST',
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

/**
 * 获取设备加纸历史
 * @param {Object} params - 参数对象
 * @param {number} params.deviceId - 设备ID
 * @returns {Promise} 返回加纸历史列表
 */
export const getRefillListByDevice = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/device/refill/history',
      method: 'GET',
      data: params,
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

// ==================== 阈值管理 API ====================

/**
 * 获取阈值列表
 * @param {Object} params - 参数对象
 * @param {number} params.deviceId - 设备ID
 * @returns {Promise} 返回阈值列表
 */
export const getThresholdList = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/threshold/list',
      method: 'GET',
      data: params,
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

/**
 * 批量更新阈值
 * @param {Object} params - 参数对象
 * @param {number} params.deviceId - 设备ID
 * @param {Array} params.thresholds - 阈值列表
 * @returns {Promise} 返回更新结果
 */
export const updateThresholdBatch = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/threshold/updateBatch',
      method: 'POST',
      data: params,
      header: {
        "Content-Type": "application/json"
      },
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

// ==================== 配送商管理 API ====================

/**
 * 获取配送商列表
 * @param {Object} params - 参数对象
 * @param {number} params.marketId - 市场ID
 * @returns {Promise} 返回配送商列表
 */
export const getDistributerList = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/distributer/list',
      method: 'GET',
      data: params,
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

/**
 * 获取配送商详情
 * @param {Object} params - 参数对象
 * @param {number} params.distributerId - 配送商ID
 * @returns {Promise} 返回配送商详情
 */
export const getDistributerDetail = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/distributer/detail',
      method: 'GET',
      data: params,
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

// ==================== 消息管理 API ====================

/**
 * 获取提醒列表
 * @param {Object} params - 参数对象
 * @param {number} params.marketId - 市场ID
 * @returns {Promise} 返回提醒列表
 */
export const getAlertList = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/alert/list',
      method: 'GET',
      data: params,
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

/**
 * 获取未读数量
 * @param {Object} params - 参数对象
 * @param {number} params.marketId - 市场ID
 * @returns {Promise} 返回未读数量
 */
export const getUnreadCount = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/alert/unread/count',
      method: 'GET',
      data: params,
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

/**
 * 标记为已读
 * @param {Object} params - 参数对象
 * @param {number} params.alertId - 提醒ID
 * @returns {Promise} 返回标记结果
 */
export const markAlertAsRead = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/alert/read',
      method: 'POST',
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

// ==================== 设备责任人管理 API ====================

/**
 * 查询设备的所有责任人
 * @param {Object} params - 参数对象
 * @param {number} params.deviceId - 设备ID
 * @returns {Promise} 返回责任人列表
 */
export const getDeviceManagers = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/device/manager/list',
      method: 'GET',
      data: params,
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

/**
 * 为设备添加责任人
 * @param {Object} params - 参数对象
 * @param {number} params.deviceId - 设备ID
 * @param {number} params.managerId - 管理员ID
 * @param {number} params.notifyLevel - 通知级别（1-4）
 * @param {number} params.isPrimary - 是否主要责任人（0-否 1-是）
 * @returns {Promise} 返回添加结果
 */
export const addDeviceManager = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/device/manager/add',
      method: 'POST',
      data: {
        deviceId: params.deviceId,
        managerId: params.managerId,
        notifyLevel: params.notifyLevel || 1,
        isPrimary: params.isPrimary || 0
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

/**
 * 更新责任人配置
 * @param {Object} params - 参数对象
 * @param {number} params.id - 绑定ID
 * @param {number} params.notifyLevel - 通知级别
 * @param {number} params.isPrimary - 是否主要责任人
 * @param {number} params.enable - 是否启用（0-禁用 1-启用）
 * @returns {Promise} 返回更新结果
 */
export const updateDeviceManager = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/device/manager/update',
      method: 'POST',
      data: {
        id: params.id,
        notifyLevel: params.notifyLevel,
        isPrimary: params.isPrimary,
        enable: params.enable
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

/**
 * 删除责任人
 * @param {Object} params - 参数对象
 * @param {number} params.id - 绑定ID
 * @returns {Promise} 返回删除结果
 */
export const deleteDeviceManager = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/device/manager/delete',
      method: 'POST',
      data: {
        id: params.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

/**
 * 查询管理员负责的所有设备
 * @param {Object} params - 参数对象
 * @param {number} params.managerId - 管理员ID
 * @returns {Promise} 返回设备列表
 */
export const getManagerDevices = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/device/manager/devices',
      method: 'GET',
      data: params,
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}