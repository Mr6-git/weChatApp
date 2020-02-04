// application/pages/planDetail/index.js
import { GetPlanInfo, GetEventInfo, Buy } from '../../common/net/expert';
import DataFund from '../../data/fund';
import utils from '../../utils/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    event: {},
    chooseOdd: {
      pOdd: {},
      cOdd: {},
    },
    fund: DataFund,
  },

  getData(id) {
    GetPlanInfo({ id }).then(res => {
      if (res.code == 200) {
        const data = res.data;
        this.getEvent(data.event_id);

        let rate = 0;
        if (Number(data.expert.lately_count) != 0) {
          rate = (data.expert.lately_hit_count / data.expert.lately_count * 100).toFixed(0);
        }
        console.log(rate, 'rate')
        Object.assign(data, {
          price: data.price / 100,
          create_time_str: utils.formatDate(data.create_time, 'YYYY-MM-DD HH:mm'),
          rate,
        });

        this.setData({
          data: res.data,
        });
      } else {
        this.showError(res.detail)
      };
    })
  },
  getEvent(id) {
    GetEventInfo({ id: Number(id) }).then(res => {
      if (res.code == 200) {
        let spItem = null, oItem = null;
        const info = this.data.data;
        res.data.sp.map(item => {
          if (item._id == info.sp_id) {
            spItem = item;
          }
        })
        spItem.op.map(item => {
          if (item._id == info.odds_id) {
            oItem = item;
          }
        })
        let data = res.data;
        Object.assign(data, {
          begin_time: utils.formatDate(data.begin_time, 'hh:mm'),
        });

        this.setData({
          event: data,
          chooseOdd: {
            pOdd: spItem,
            cOdd: oItem,
          }
        });
      } else {
        this.showError(res.detail);
      }
    })
  },
  pay() {
    if (!utils.checkLogin()) return;
    const json = {
      scheme_id: this.data.data._id
    }
    Buy(json).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '购买成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(() => {
          this.getData(this.data.data._id);
        }, 1500)
      } else {
        wx.showToast({
          title: res.detail,
          icon: 'none',
          duration: 2000
        })
      }
    }).catch(err => {
      wx.showToast({
        title: '购买失败',
        icon: 'none',
        duration: 2000
      })
    })
    // wx.showToast({
    //   title: '支付正在申请中',
    //   icon: 'none',
    //   duration: 2000
    // })
  },
  showError(title) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 2000
    })
  },
  goBack() {
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options.id);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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