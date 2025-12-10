var app = getApp()
var load = require('../../../lib/load.js');
var dateUtils = require('../../../utils/dateUtil')

import apiUrl from '../../../config.js'
import {
  disGetPayList,
  disPayUser,
} from '../../../lib/printerAlertApi'


let itemWidth = 0;
let windowWidth = 0;
Page({


  /**
   * 页面的初始数据
   */
  data: {

    tabs: [
      
      {
        name: "用户",
        amount: "",
        amountOk: "",
      }, {
        name: "流量",
        amount: "",
        amountOk: "",
      }, 
    ],
    sliderOffset: 0,
    sliderOffsets: [],
    sliderLeft: 0,

    swipeIndex: 0,
    currentTab: 0,
    quantity: -1,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const globalData = app.globalData;
       console.log("globalDataglobalData=" ,globalData)
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxRatio,
      screenWidth: globalData.windowWidth * globalData.rpxRatio,
      windowHeight: globalData.windowHeight * globalData.rpxRatio,
      rpxRatio: globalData.rpxRatio,
      url: apiUrl.server,
      navBarHeight: globalData.navBarHeight * globalData.rpxRatio,
      type:  options.type,
      startDate: dateUtils.getFirstDateInMonth(),
      stopDate: dateUtils.getArriveDate(0),
      hanzi: "本月",

      disId: options.disId,
    })

   
    this._initData();
  
  },


  _initData(){
    var data = {
      disId: this.data.disId,
    }
   load.showLoading("获取数据中");
    disGetPayList(data).then(res =>{
      load.hideLoading();
      if(res.result.code ==0){
        this.setData({
          payArr: res.result.data,
        })
      }

    })
  },


  
  toPayDetail(){
 console.log("toPayDetail")
  wx.navigateTo({
    url: '../payDetail/payDetail?disId=' + this.data.disId,
  })
  },



  toBack(){
    wx.navigateBack({
      delta: 1
    })
  },


})