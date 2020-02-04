// application/pages/charge/index.js
import { GetRechargeList, UnifiedOrder, GetUnifiedStatus } from '../../common/net/wallet';
import { ThirdAuthToken } from '../../common/net/base';
import { setLogin } from '../../data/login';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    platform: 'ios',
    data: [],
    active: null,
    count: 1,
    total: 0,

    channel_id: '',
    goods_id: '',
    goods_amount: '',
    order_number: '',

    status: '', // 0失败 1成功
    showCover: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (options.scene == '1069') { // 从app来

      setLogin({
        token: options.token
      });

      this.setData({
        channel_id: options.channel_id,
        goods_id: options.goods_id,
        goods_amount: options.goods_amount,
        wx_user_id: options.wx_user_id,
      }, () => {
        this.handlePay();
      })
    }

    this.getData();
    
    const res = wx.getSystemInfoSync();
    this.setData({
      platform: res.platform
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getData() {
    const json = {
      funds_type: 21,
    }
    // wx.showToast({
    //   title: '加载中',
    //   icon: 'loading',
    // });
    GetRechargeList(json).then(res => {
      if (res.code == 200) {
        this.setData({
          data: res.data,
        })
        // wx.hideToast()
        return;
      }
      wx.showToast({
        title: 'res.detail',
        icon: 'none',
        duration: 3000,
      });
    });
  },
  choose(e) {
    const id = e.currentTarget.dataset.id;
    const { count, data, active } = this.data;
    if (id == active) return;
    this.setData({
      count: 1,
      active: id,
      total: count * data[Number(id)].price / 100
    })
  },
  minus() {
    const { count, data, active } = this.data;
    if (active == null || count < 1) return;
    console.log(data[Number(active)], 'data[Number(active)]')
    this.setData({
      count: count - 1,
      total: (count - 1) * data[Number(active)].price / 100
    })
  },
  add() {
    const { count, data, active } = this.data;
    if (active == null) return;
    this.setData({
      count: count + 1,
      total: (count + 1) * data[Number(active)].price / 100
    })
  },
  charge() {
    wx.showToast({
      title: '小程序暂不支持',
      icon: 'none',
      duration: 2000,
    });
  },
  goBack() {
    wx.navigateBack('/pages/index/index');
  },
  handlePay() {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: Number.MAX_VALUE,
    });

    const data = this.data;
    // if (!data.channel_id) return;
    if (data.wx_user_id && data.wx_user_id == '1') {
      this.createOrder();
      return;
    }
    this.getWxCode();
  },
  getWxCode() {
    wx.login({
      success: (res) => {
        if (res.code) {
          const json = {
            third: 3,
            grant_type: 1,
            auth_code: res.code
          }
          ThirdAuthToken(json).then(res => {
            if (res.code == 200) {
              this.createOrder();
            } else {
              wx.showToast({
                title: res.detail,
                icon: 'none',
                duration: 2000
              });
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  createOrder() {
    const data = this.data;
    const json = {
      return_url: '',
      channel_id: data.channel_id,
      goods_id: data.goods_id,
      goods_amount: Number(data.goods_amount),
    }
    UnifiedOrder(json).then(res => {
      if (res.code == 200) {
        wx.hideToast();
        this.setData({
          order_number: res.data.order_number,
        });
        this.pay(res.data.object);
      } else {
        wx.showToast({
          title: res.detail,
          icon: 'none',
          duration: 2000
        });
      }
    }).catch(err => {
      wx.showToast({
        title: '支付请求创建失败',
        icon: 'none',
        duration: 2000
      });
    })
  },
  pay(data) {
    wx.requestPayment({
      timeStamp: data.timestamp,
      nonceStr: data.nonce_str,
      package: data.package,
      signType: data.sign_type,
      paySign: data.sign,
      success: (res) => {
        this.checkStatus();
      },
      fail: (res) => {
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 1500
        });
        setTimeout(() => {
          this.setData({
            status: '0',
            showCover: false,
          });
        }, 1500)
      }
    })
  },
  checkStatus() {
    const json = {
      id: this.data.order_number,
    }
    GetUnifiedStatus(json).then(res => {
      if (res.data.status == 2) {
        wx.showToast({
          title: '支付成功',
          icon: 'none',
          duration: 1500
        });
        setTimeout(() => {
          this.setData({
            status: '1',
            showCover: true,
          });
        }, 1500);
        return;
      }
      wx.showToast({
        title: '支付订单处理中',
        icon: 'none',
        duration: 1500
      });
      setTimeout(() => {
        this.setData({
          status: '1',
          showCover: true,
        });
      }, 1500);
    }).catch(err => {
      wx.showToast({
        title: '支付失败',
        icon: 'none',
        duration: 1500
      });
      setTimeout(() => {
        this.setData({
          status: '0',
          showCover: true,
        });
      }, 1500)
    })
  },
  launchAppError(e) {
    console.log(e.detail.errMsg);
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