// pages/pricePlanEdit/pricePlanEdit.js
import { getPricePlanDetail, addPricePlan, editPricePlan, addPlanWithImage, editPlanWithImage } from '../../lib/printerAlertApi.js';
import load from '../../lib/load.js';

Page({
  data: {
    isEdit: false, // 是否为编辑模式
    planId: null, // 方案ID（编辑时使用）
    marketId: 0, // 市场ID
    planType: 0, // 方案类型：0-流量方案，1-设备方案
    
    // 表单数据
    formData: {
      nxMppType: 0, // 方案类型
      nxMppPlanName: '', // 方案名称
      nxMppQuantity: '', // 数量规格
      nxMppPrice: '', // 方案价格（分，用于存储）
      nxMppPriceDisplay: '', // 方案价格（元，用于显示和输入）
      nxMppUnitPrice: '', // 单价说明
      nxMppDescription: '', // 方案描述
      nxMppImageUrl: '', // 图片URL
      nxMppSortOrder: 1, // 排序
      nxMppStatus: 1 // 状态：1-启用，0-禁用
    },
    
    // 类型选项
    typeOptions: ['流量方案', '设备方案'],
    
    // 表单验证状态
    canSave: false
  },

  onLoad(options) {
    console.log('页面参数:', options);
    
    this.setData({
      marketId: parseInt(options.marketId) || 0,
      planType: parseInt(options.type) || 0,
      planId: options.id || null,
      isEdit: !!options.id,
      'formData.nxMppType': parseInt(options.type) || 0
    });

    console.log('页面加载完成，planType:', this.data.planType);
    console.log('初始 formData:', this.data.formData);

    if (this.data.isEdit) {
      this.loadPlanDetail();
    } else {
      this.checkFormValidity();
    }
  },

  /**
   * 加载方案详情（编辑模式）
   */
  async loadPlanDetail() {
    if (!this.data.planId) return;

    load.showLoading('加载中...');

    try {
      const response = await getPricePlanDetail(this.data.planId);
      console.log('方案详情响应:', response);
      console.log('response.result:', response.result);
      console.log('response.result.data:', response.result?.data);

      if (response.result && response.result.code === 0) {
        // 根据实际API响应格式调整数据提取
        const planData = response.result.data || response.result;
        console.log('方案详情数据:', planData);
        
        if (planData) {
          // 直接使用后端返回的价格值
          const priceFromBackend = planData.nxMppPrice || 0;
          
          this.setData({
            formData: {
              nxMppType: planData.nxMppType || 0,
              nxMppPlanName: planData.nxMppPlanName || '',
              nxMppQuantity: planData.nxMppQuantity || '',
              nxMppPrice: priceFromBackend, // 直接使用后端价格
              nxMppPriceDisplay: priceFromBackend.toString(), // 显示价格
              nxMppUnitPrice: planData.nxMppUnitPrice || '',
              nxMppDescription: planData.nxMppDescription || '',
              nxMppImageUrl: planData.nxMppImageUrl || '',
              nxMppSortOrder: planData.nxMppSortOrder || 1,
              nxMppStatus: planData.nxMppStatus !== undefined ? planData.nxMppStatus : 1
            }
          });
          console.log('设置后的表单数据:', this.data.formData);
          this.checkFormValidity();
        } else {
          console.log('方案数据为空');
          wx.showToast({
            title: '方案数据为空',
            icon: 'none'
          });
        }
      } else {
        console.log('API响应错误:', response);
        wx.showToast({
          title: response.result?.msg || '加载失败',
          icon: 'none'
        });
      }
    } finally {
      load.hideLoading();
    }
  },

  /**
   * 方案类型选择
   */
  onTypeChange(e) {
    const type = parseInt(e.detail.value);
    console.log('方案类型改变:', type);
    this.setData({
      'formData.nxMppType': type
    });
    this.checkFormValidity();
  },

  /**
   * 方案名称输入
   */
  onPlanNameInput(e) {
    this.setData({
      'formData.nxMppPlanName': e.detail.value
    });
    this.checkFormValidity();
  },

  /**
   * 数量规格输入
   */
  onQuantityInput(e) {
    this.setData({
      'formData.nxMppQuantity': e.detail.value
    });
    this.checkFormValidity();
  },

  /**
   * 方案价格输入
   */
  onPriceInput(e) {
    const value = e.detail.value;
    // 只允许输入正整数
    const numericValue = value.replace(/[^\d]/g, '');
    const price = parseInt(numericValue) || 0;
    
    this.setData({
      'formData.nxMppPriceDisplay': numericValue,
      'formData.nxMppPrice': price // 直接使用输入的值，不转换
    });
    this.checkFormValidity();
  },

  /**
   * 单价说明输入
   */
  onUnitPriceInput(e) {
    this.setData({
      'formData.nxMppUnitPrice': e.detail.value
    });
    this.checkFormValidity();
  },

  /**
   * 方案描述输入
   */
  onDescriptionInput(e) {
    this.setData({
      'formData.nxMppDescription': e.detail.value
    });
    this.checkFormValidity();
  },

  /**
   * 排序输入
   */
  onSortOrderInput(e) {
    this.setData({
      'formData.nxMppSortOrder': parseInt(e.detail.value) || 1
    });
    this.checkFormValidity();
  },

  /**
   * 状态切换
   */
  onStatusChange(e) {
    const status = parseInt(e.detail.value);
    this.setData({
      'formData.nxMppStatus': status
    });
    this.checkFormValidity();
  },

  /**
   * 选择图片
   */
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.setData({
          'formData.nxMppImageUrl': tempFilePath
        });
        this.checkFormValidity();
      },
      fail: (error) => {
        console.error('选择图片失败:', error);
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 检查表单有效性
   */
  checkFormValidity() {
    const { formData, planType } = this.data;
    console.log('=== checkFormValidity 开始 ===');
    console.log('planType:', planType);
    console.log('formData:', formData);
    
    // 基础验证：方案名称和价格
    let isValid = formData.nxMppPlanName.trim() && 
                  formData.nxMppPriceDisplay && 
                  parseInt(formData.nxMppPriceDisplay) > 0;
    
    // 流量方案需要验证数量规格
    if (planType === 0) {
      isValid = isValid && formData.nxMppQuantity.trim();
    }
    
    console.log('基础验证结果（名称+价格）:', isValid);
    console.log('方案名称:', `"${formData.nxMppPlanName.trim()}"`, '是否有效:', !!formData.nxMppPlanName.trim());
    console.log('价格显示:', `"${formData.nxMppPriceDisplay}"`, '是否有效:', !!formData.nxMppPriceDisplay);
    console.log('价格数值:', parseInt(formData.nxMppPriceDisplay), '是否大于0:', parseInt(formData.nxMppPriceDisplay) > 0);
    
    // 流量方案需要验证数量规格
    if (planType === 0) {
      console.log('流量方案，检查数量规格:', `"${formData.nxMppQuantity.trim()}"`);
      console.log('数量规格是否有效:', !!formData.nxMppQuantity.trim());
      isValid = isValid && formData.nxMppQuantity.trim();
      console.log('流量方案最终验证结果:', isValid);
    }
    
    // 设备方案需要验证图片
    if (planType === 1) {
      console.log('设备方案，检查图片:', formData.nxMppImageUrl);
      console.log('图片是否有效:', !!formData.nxMppImageUrl.trim());
      isValid = isValid && formData.nxMppImageUrl.trim();
      console.log('设备方案最终验证结果:', isValid);
    }
    
    console.log('最终 canSave 状态:', isValid);
    console.log('=== checkFormValidity 结束 ===');
    
    this.setData({
      canSave: isValid
    });
  },

  /**
   * 保存方案
   */
  async savePlan() {
    if (!this.data.canSave) {
      wx.showToast({
        title: '请填写必填项',
        icon: 'none'
      });
      return;
    }

    // 验证价格格式（用户输入整数）
    const price = parseInt(this.data.formData.nxMppPriceDisplay);
    if (isNaN(price) || price <= 0) {
      wx.showToast({
        title: '请输入有效的价格（正整数）',
        icon: 'none'
      });
      return;
    }

    load.showLoading('保存中...');

    try {
      const planData = {
        nxMppType: this.data.formData.nxMppType,
        nxMppPlanName: this.data.formData.nxMppPlanName,
        nxMppQuantity: this.data.formData.nxMppQuantity,
        nxMppPrice: this.data.formData.nxMppPrice, // 整数类型，用户输入的值
        nxMppUnitPrice: this.data.formData.nxMppUnitPrice,
        nxMppDescription: this.data.formData.nxMppDescription,
        nxMppImageUrl: this.data.formData.nxMppImageUrl,
        nxMppSortOrder: this.data.formData.nxMppSortOrder,
        nxMppStatus: this.data.formData.nxMppStatus,
        nxMppMarketId: this.data.marketId
      };

      // 如果是编辑模式，添加ID字段
      if (this.data.isEdit) {
        planData.nxMppId = this.data.planId;
      }

      console.log('保存方案数据:', planData);

      let response;
      
      // 根据方案类型选择不同的保存方式
      if (this.data.formData.nxMppType === 1) {
        // 设备方案，使用带图片上传的接口
        response = await this.savePlanWithImage(planData);
      } else {
        // 流量方案，使用普通接口
        response = this.data.isEdit ? 
          await editPricePlan(planData) : 
          await addPricePlan(planData);
      }

      console.log('保存方案响应:', response);

      if (response.result && response.result.code === 0) {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });
        
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        wx.showToast({
          title: response.result?.msg || '保存失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('保存方案失败:', error);
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      });
    } finally {
      load.hideLoading();
    }
  },

  /**
   * 带图片上传的保存方案
   */
  async savePlanWithImage(planData) {
    const { formData } = this.data;
    
    if (!formData.nxMppImageUrl) {
      wx.showToast({
        title: '请上传方案图片',
        icon: 'none'
      });
      return { result: { code: 500, msg: '请上传方案图片' } };
    }

    // 检查是否是本地临时路径（新上传的图片）
    const isLocalImage = formData.nxMppImageUrl.startsWith('http://tmp/') || 
                        formData.nxMppImageUrl.startsWith('wxfile://');

    if (isLocalImage) {
      // 新上传的图片，使用专用API
      if (this.data.isEdit) {
        return await editPlanWithImage(formData.nxMppImageUrl, planData);
      } else {
        return await addPlanWithImage(formData.nxMppImageUrl, planData);
      }
    } else {
      // 已有图片URL，使用普通接口
      if (this.data.isEdit) {
        return await editPricePlan(planData);
      } else {
        return await addPricePlan(planData);
      }
    }
  },

  /**
   * 取消编辑
   */
  cancelEdit() {
    wx.showModal({
      title: '确认取消',
      content: '确定要取消编辑吗？未保存的内容将丢失。',
      success: (res) => {
        if (res.confirm) {
          wx.navigateBack();
        }
      }
    });
  }
});
