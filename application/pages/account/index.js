// application/pages/account/index.js
import DataUser from '../../data/user';
import event from '../../common/event';
import { clearLogin } from '../../data/login';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    platform: 'ios',
    data: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    const res = wx.getSystemInfoSync();
    this.setData({
      platform: res.platform
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getUserInfo();

    event.on('DataUserChange', (data) => {
      this.getUserInfo();
    });
  },
  getUserInfo() {
    this.setData({
      data: DataUser,
    });
  },
  goBack() {
    wx.navigateBack('/pages/index/index');
  },
  logout() {
    clearLogin();
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})