// lib/printerAlertApi.js
import apiUrl from '../config.js';

// ==================== 用户认证 API ====================






export const getDate = () => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'gbdistributer/getDate' ,
      method: 'GET',
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e);
        load.hideLoading();
        wx.showToast({
          title: '请检查网络',
          icon: 'none',
        })
      }
    })
  })
}



export const jjshGetMarket = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'syscitymarket/jjshGetMarket',
      method: 'POST',
      data:{
        maId: data.maId,
        cityId: data.cityId,
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



export const disGetPayList = (data) => { 
  return new Promise((resolve, reject) => {
     wx.request({
       url: apiUrl.apiUrl + 'nxdistributerpay/disGetPayList',//演示域
       method: 'POST',
       data: {
        disId: data.disId,
       },
       header: {
         "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
       },
       success: function (res) {
         resolve({ result: res.data })

       },
       fail: function (e) {
         reject(e);
         load.hideLoading();
       },
 
     })
   })
 }
 

 
/**
 * 微信授权登录
 * @param {Object} data 
 * @param {String} data.code - 微信授权码
 */
export const wxLogin = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'marketmanager/managerLogin',
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
 * @param {number} params.managerId - 管理员ID
 * @param {number} params.days - 查询天数，默认2天
 * @returns {Promise} 返回设备列表和未读数量
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
      url: apiUrl.apiUrl + 'machine/print/listPrintRecords',
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
 * 正常加纸/更换新纸
 * @param {Object} params - 参数对象
 * @param {number} params.deviceId - 设备ID
 * @param {number} params.newPaperCount - 新纸数量（直接设置，不累加）
 * @param {number} params.operatorId - 操作人ID
 * @param {string} params.operatorName - 操作人姓名
 * @param {string} params.remark - 备注（可选）
 * @returns {Promise} 返回加纸结果，包含paperCount和wasteCount
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
 * 手动校准纸张数量
 * @param {Object} params - 参数对象
 * @param {number} params.deviceId - 设备ID
 * @param {number} params.paperCount - 校准后的纸张数量（必须 <= 当前数量）
 * @param {number} params.operatorId - 操作人ID
 * @param {string} params.operatorName - 操作人姓名
 * @param {string} params.remark - 备注（可选）
 * @returns {Promise} 返回校准结果，包含paperCount和wasteCount
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
      url: apiUrl.apiUrl + 'machine/refill/listDeviceRecords',
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
 * @param {number} params.managerId - 管理员ID
 * @returns {Promise} 返回未读数量
 */
export const getUnreadCount = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/alert/list',
      method: 'GET',
      data: {
        managerId: params.managerId,
        offset: 0,
        limit: 1000 // 获取足够多的数据来计算未读数量
      },
      success: (res) => {
        const result = res.data;
        if (result.code === 0) {
          // 前端计算未读数量
          const unreadCount = result.list ? result.list.filter(item => item.nxArIsRead === 0).length : 0;
          resolve({ 
            result: { 
              code: 0, 
              count: unreadCount,
              msg: 'success'
            } 
          });
        } else {
          resolve({ result: { code: result.code, count: 0, msg: result.msg } });
        }
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
      url: apiUrl.apiUrl + 'machine/alert/markRead',
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
      url: apiUrl.apiUrl + 'machine/device/manager/listByDevice',
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
 * @param {number} params.managerId - 管理员ID（可选，如果提供则使用ID）
 * @param {string} params.managerName - 管理员姓名（可选，如果提供managerId则不需要）
 * @param {string} params.managerPhone - 管理员手机号（可选，如果提供managerId则不需要）
 * @param {number} params.notifyLevel - 通知级别（1-4）
 * @param {number} params.isPrimary - 是否主要责任人（0-否 1-是）
 * @returns {Promise} 返回添加结果
 */
export const addDeviceManager = (params) => {
  return new Promise((resolve, reject) => {
    // 构建请求数据
    const requestData = {
      deviceId: params.deviceId,
      notifyLevel: params.notifyLevel || 1,
      isPrimary: params.isPrimary || 0
    };
    
    // 如果提供了managerId，使用ID方式；否则使用姓名和手机号方式
    if (params.managerId) {
      requestData.managerId = params.managerId;
    } else if (params.managerName && params.managerPhone) {
      requestData.managerName = params.managerName;
      requestData.managerPhone = params.managerPhone;
    }
    
    wx.request({
      url: apiUrl.apiUrl + 'machine/device/manager/addManager',
      method: 'POST',
      data: requestData,
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
    // 构建请求数据，过滤掉undefined值
    const requestData = {
      id: params.id
    };
    
    // 只有当值不为undefined时才添加到请求数据中
    if (params.notifyLevel !== undefined) {
      requestData.notifyLevel = params.notifyLevel;
    }
    if (params.isPrimary !== undefined) {
      requestData.isPrimary = params.isPrimary;
    }
    if (params.enable !== undefined) {
      requestData.enable = params.enable;
    }
    
    console.log('updateDeviceManager 请求数据:', requestData);
    
    wx.request({
      url: apiUrl.apiUrl + 'machine/device/manager/updateManager',
      method: 'POST',
      data: requestData,
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
      url: apiUrl.apiUrl + 'machine/device/manager/removeManager',
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
      url: apiUrl.apiUrl + 'machine/device/manager/listDevicesByManager',
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
 * 获取所有管理员列表
 * @param {Object} params - 参数对象（可选）
 * @returns {Promise} 返回管理员列表
 */
export const getAllManagers = (params = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/manager/list',
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
 * 获取用户列表
 * @param {Object} params - 参数对象
 * @param {number} params.marketId - 市场ID（必填）
 * @returns {Promise} 返回用户列表
 */
export const getUserList = (params = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/admin/listManagersByMarket',
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

// ==================== 市场换纸管理 API ====================

/**
 * 查询市场换纸记录列表
 * @param {Object} params - 查询参数
 * @param {Number} params.marketId - 市场ID（必填）
 * @param {String} params.startDate - 开始日期，格式：yyyy-MM-dd
 * @param {String} params.stopDate - 结束日期，格式：yyyy-MM-dd
 * @param {Number} params.offset - 分页偏移量
 * @param {Number} params.limit - 每页数量，默认20
 * @returns {Promise} 返回换纸记录列表和汇总统计
 */
export const getRefillStatsMarket = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'machine/refill/listMarketRecords',
      method: 'GET',
      data: params,
      header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      success: (res) => { resolve({ result: res.data }) },
      fail: (e) => { reject(e) }
    })
  })
}

// ==================== 市场充值管理 API ====================

/**
 * 查询市场充值记录列表
 * @param {Object} params - 查询参数
 * @param {Number} params.marketId - 市场ID（必填）
 * @param {String} params.startDate - 开始日期，格式：yyyy-MM-dd
 * @param {String} params.stopDate - 结束日期，格式：yyyy-MM-dd
 * @param {Number} params.offset - 分页偏移量
 * @param {Number} params.limit - 每页数量，默认20
 * @returns {Promise} 返回充值记录列表和汇总统计
 */
export const getRechargeStatsMarket = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdistributerpay/marketRechargeStats',
      method: 'GET',
      data: params,
      header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      success: (res) => { resolve({ result: res.data }) },
      fail: (e) => { reject(e) }
    })
  })
}

// ==================== 市场管理员管理 API ====================

/**
 * 市场管理员注册（带文件上传）
 * @param {Array} filePathList - 头像文件路径数组
 * @param {String} code - 微信小程序授权码
 * @param {Number} marketId - 市场ID
 * @param {String} managerName - 管理员真实姓名
 * @param {String} phone - 手机号
 * @param {Number} role - 角色（1-普通管理员 2-市场主管，默认1）
 * @returns {Promise} 返回注册结果
 */
export const registerMarketManager = (filePathList, code, marketId, managerName, phone, role = 1) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: apiUrl.apiUrl + 'marketmanager/register',
      filePath: filePathList[0], // 取第一个文件
      name: 'file',
      formData: {
        'code': code,
        'marketId': marketId,
        'managerName': managerName,
        'phone': phone,
        'role': role
      },
      success: (res) => {
        try {
          const data = JSON.parse(res.data);
          resolve({ result: data });
        } catch (e) {
          reject(e);
        }
      },
      fail: (e) => {
        reject(e);
      }
    });
  });
}

/**
 * 市场管理员登录
 * @param {Object} params - 参数对象
 * @param {String} params.code - 微信小程序授权码
 * @returns {Promise} 返回登录结果
 */
export const loginMarketManager = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'marketmanager/login',
      method: 'POST',
      data: {
        code: params.code
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        resolve({ result: res.data });
      },
      fail: (e) => {
        reject(e);
      }
    });
  });
}

/**
 * 查询管理员信息
 * @param {Object} params - 参数对象
 * @param {Number} params.managerId - 管理员ID
 * @returns {Promise} 返回管理员详细信息
 */
export const getMarketManagerInfo = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'marketmanager/info',
      method: 'GET',
      data: params,
      success: (res) => {
        resolve({ result: res.data });
      },
      fail: (e) => {
        reject(e);
      }
    });
  });
}

/**
 * 查询市场下所有管理员
 * @param {Object} params - 参数对象
 * @param {Number} params.marketId - 市场ID
 * @returns {Promise} 返回管理员列表
 */
export const getMarketManagerList = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'marketmanager/listByMarket',
      method: 'GET',
      data: params,
      success: (res) => {
        resolve({ result: res.data });
      },
      fail: (e) => {
        reject(e);
      }
    });
  });
}

/**
 * 更新管理员信息（文字信息）
 * @param {Object} params - 参数对象
 * @param {Number} params.managerId - 管理员ID
 * @param {String} params.managerName - 管理员姓名（可选）
 * @param {String} params.phone - 手机号（可选）
 * @returns {Promise} 返回更新结果
 */
export const updateMarketManagerInfo = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'marketmanager/updateInfo',
      method: 'POST',
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        resolve({ result: res.data });
      },
      fail: (e) => {
        reject(e);
      }
    });
  });
}

/**
 * 更新管理员头像
 * @param {Array} filePathList - 头像文件路径数组
 * @param {Number} managerId - 管理员ID
 * @returns {Promise} 返回更新结果
 */
export const updateMarketManagerAvatar = (filePathList, managerId) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: apiUrl.apiUrl + 'marketmanager/updateAvatar',
      filePath: filePathList[0], // 取第一个文件
      name: 'file',
      formData: {
        'managerId': managerId
      },
      success: (res) => {
        try {
          const data = JSON.parse(res.data);
          resolve({ result: data });
        } catch (e) {
          reject(e);
        }
      },
      fail: (e) => {
        reject(e);
      }
    });
  });
}

// 审核/开通管理员账号
export const approveMarketManager = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'marketmanager/approve',
      method: 'POST',
      data: {
        managerId: params.managerId,
        approveStatus: params.approveStatus // 1-通过并开通, 0-拒绝/禁用
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        resolve({ result: res.data });
      },
      fail: (e) => {
        reject(e);
      }
    });
  });
}

// ==================== 价格方案管理 API ====================

/**
 * 获取价格方案列表（管理端）
 * @param {Object} params - 查询参数
 * @param {Number} params.marketId - 市场ID
 * @param {Number} params.type - 方案类型（0-流量方案，1-设备方案）
 * @param {Number} params.pageNum - 页码
 * @param {Number} params.pageSize - 每页数量
 * @returns {Promise} 返回方案列表
 */
export const getPricePlanList = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'marketpriceplan/admin/list',
      method: 'GET',
      data: {
        marketId: params.marketId,
        type: params.type,
        page: params.page || 1,
        limit: params.limit || 10
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        resolve({ result: res.data });
      },
      fail: (e) => {
        reject(e);
      }
    });
  });
}

/**
 * 获取价格方案详情（管理端）
 * @param {Number} id - 方案ID
 * @returns {Promise} 返回方案详情
 */
export const getPricePlanDetail = (id) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + `marketpriceplan/admin/getPlanDetail/${id}`,
      method: 'GET',
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        resolve({ result: res.data });
      },
      fail: (e) => {
        reject(e);
      }
    });
  });
}

/**
 * 新增价格方案（管理端）
 * @param {Object} planData - 方案数据
 * @returns {Promise} 返回新增结果
 */
export const addPricePlan = (planData) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'marketpriceplan/admin/addPlan',
      method: 'POST',
      data: planData,
      header: {
        "Content-Type": "application/json"
      },
      success: (res) => {
        resolve({ result: res.data });
      },
      fail: (e) => {
        reject(e);
      }
    });
  });
}

/**
 * 编辑价格方案（管理端）
 * @param {Object} planData - 方案数据
 * @returns {Promise} 返回编辑结果
 */
export const editPricePlan = (planData) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'marketpriceplan/admin/editPlan',
      method: 'POST',
      data: planData,
      header: {
        "Content-Type": "application/json"
      },
      success: (res) => {
        resolve({ result: res.data });
      },
      fail: (e) => {
        reject(e);
      }
    });
  });
}

/**
 * 删除价格方案（管理端）
 * @param {Number} id - 方案ID
 * @returns {Promise} 返回删除结果
 */
export const deletePricePlan = (id) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'marketpriceplan/admin/deletePlan',
      method: 'POST',
      data: {
        id: id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        resolve({ result: res.data });
      },
      fail: (e) => {
        reject(e);
      }
    });
  });
}

/**
 * 启用/禁用价格方案（管理端）
 * @param {Number} id - 方案ID
 * @param {Number} status - 状态（1-启用，0-禁用）
 * @returns {Promise} 返回操作结果
 */
export const togglePricePlanStatus = (id, status) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'marketpriceplan/admin/togglePlanStatus',
      method: 'POST',
      data: {
        id: id,
        status: status
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        resolve({ result: res.data });
      },
      fail: (e) => {
        reject(e);
      }
    });
  });
}

/**
 * 获取市场价格方案列表（小程序端）
 * @param {Number} marketId - 市场ID
 * @param {Number} type - 方案类型（0-流量方案，1-设备方案）
 * @returns {Promise} 返回方案列表
 */
export const getMarketPricePlans = (marketId, type) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'marketpriceplan/miniprogram/getMarketPlans',
      method: 'GET',
      data: {
        marketId: marketId,
        type: type
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        resolve({ result: res.data });
      },
      fail: (e) => {
        reject(e);
      }
    });
  });
}

/**
 * 新增价格方案（带图片上传）
 * @param {String} filePath - 图片临时路径
 * @param {Object} planData - 方案数据
 * @returns {Promise} 返回上传结果
 */
export const addPlanWithImage = (filePath, planData) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: apiUrl.apiUrl + 'marketpriceplan/admin/addPlanWithImage',
      filePath: filePath,
      name: 'file',
      formData: planData,
      success: (res) => {
        try {
          const data = JSON.parse(res.data);
          resolve({ result: data });
        } catch (error) {
          reject(error);
        }
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
}

/**
 * 修改价格方案（带图片上传）
 * @param {String} filePath - 图片临时路径
 * @param {Object} planData - 方案数据
 * @returns {Promise} 返回上传结果
 */
export const editPlanWithImage = (filePath, planData) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: apiUrl.apiUrl + 'marketpriceplan/admin/editPlanWithImage',
      filePath: filePath,
      name: 'file',
      formData: planData,
      success: (res) => {
        try {
          const data = JSON.parse(res.data);
          resolve({ result: data });
        } catch (error) {
          reject(error);
        }
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
}
