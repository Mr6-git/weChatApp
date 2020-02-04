// application/pages/ticket/index.js
import { create } from '../../components/base/index';
import event from '../../common/event';
import utils from '../../utils/index';
import { GetOrderLis } from '../../common/net/mall';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    page: 1,
    limit: 15,
    data: [],
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getList();
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
  goBack() {
    wx.navigateBack();
  },
  gotoDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/ticket/orderDetail/index?id=' + id
    });
  },
  getList(callback) {
    let { page, limit, listData } = this.data
    let json = {
      limit,
      page
    }
    GetOrderLis(json).then(res => {
      if (callback) callback();
      if (res.code == 200) {
        res.data.map(item => {
          listData.push(item)
        })
        this.setData({
          listData
        })
      }
    }).catch(rej => {
      console.log(rej)
    })
  },

  loadmore: function () {
    if (this.data.loading) return;
    this.data.page++;
    this.data.loading = true;
    this.getList(() => {
      this.data.loading = false;
    });
  },
  refresh: function (e) {
    this.setData({
      page: 1,
      listData: []
    })
    this.getList(e.detail.callback);
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