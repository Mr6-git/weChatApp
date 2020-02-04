// application/pages/index/ticket/index.js
import {
  create
} from '../../../components/base/index';
import event from '../../../common/event';
import utils from '../../../utils/index';
// import utils from '../../../utils/index';
import {
  Buy,
  ChannelPay,
  GetOrderInfo,
  CancelOrder
} from '../../../common/net/mall';
import {
  ThirdAuthToken
} from '../../../common/net/base';
import {
  UnifiedOrder
} from '../../../common/net/wallet';
import {
  GetGlobalParam
} from '../../../common/net/system';
import {
  GetInfo
} from '../../../common/net/media';
// import { NAV_KEY } from '../../../common/enum';
Page({
  data: {
    popupFlag: false,
    info: {},
    order_number: '',
    order_id: '',
    countDown: '',
    minutes: '', //分
    seconds: '', //秒
    mustKnow: ''
  },
  goBack() {
    wx.navigateBack();
  },
  openPopup() {
    this.setData({
      popupFlag: true
    })
  },
  closePopup() {
    this.setData({
      popupFlag: false
    })
  },
  onReady: function() {
    this.getOrderInfo();
  },
  getOrderInfo() {
    GetOrderInfo({
      order_id: this.data.order_id
    }).then(res => {
      if (res.code == 200) {
        res.data.createTime = utils.formatDate(res.data.create_time);
        // format
        res.data.formatAmount = utils.formatMoney(res.data.amount / 100);
        res.data.formatGive = utils.formatMoney(res.data.give / 100);
        res.data.formatPrice = utils.formatMoney(res.data.price / 100);
        this.setData({
          info: res.data,
          countDown: res.data.over_time
        });
        this.countTime(res.data.over_time)
      }
    })
  },
  //待支付超时倒计时
  countTime(maxtime) {
    let that = this,
      minutes,
      seconds,
      msg;
    if (maxtime >= 0) {
      minutes = Math.floor(maxtime / 60);
      seconds = Math.floor(maxtime % 60);
      that.setData({
          minutes: minutes,
          seconds: seconds
        })
        --maxtime;
    } else {
      clearInterval();
      that.setData({
        minutes: 0,
        seconds: 0
      })
    }

    setTimeout(function() {
      that.countTime(maxtime)
    }, 1000)
  },
  //复制
  copyOrderNum(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  //拨打电话
  callPhone() {
    wx.makePhoneCall({
      phoneNumber: ''
    })
  },
  doIn() {
    /* 请求包 */
    const {
      info
    } = this.data;
    let json = {
      ticket_id: info.ticketDetail._id,
      gear_id: info.ticketCheckInfo.gear_id,
      number: info.num
    }
    Buy(json).then(res => {
      if (res.code == 200) {
        this.setData({
          order_number: res.data.order_number
        })
        this.getWxCode();
      } else {
        wx.showToast({
          title: res.detail,
          icon: 'none',
          duration: 2000
        })
      }
    }).catch(rej => {

    })
  },
  /**获取微信Code信息 */
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
              this.getChannelPay();
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
  /** 获取支付渠道 */
  getChannelPay() {
    ChannelPay({
      version: 2,
      terminal_type: 5
    }).then(res => {
      if (res.code == 200) {
        this.createOrder(res.data[0]._id);
      } else {
        wx.showToast({
          title: res.detail,
          icon: 'none',
          duration: 2000
        });
      }
    })
  },
  createOrder(id) {
    const {
      info,
      order_number
    } = this.data;
    const json = {
      return_url: '',
      channel_id: id,
      goods_id: order_number,
      goods_amount: Number(info.num),
      payment_type: 1
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
  //取消订单
  cancerOeder() {
    let {
      info
    } = this.data;
    let json = {
      order_id: info._id
    }
    wx.showModal({
      content: '订单取消后将自动关闭，确认取消？',
      success(res) {
        if (res.confirm) {
          CancelOrder(json).then(res => {
            if (res.code == 200) {
              wx.showToast({
                title: res.detail,
                icon: 'success',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: res.detail,
                icon: 'none',
                duration: 2000
              })
            }
          })
        } else if (res.cancel) {}
      }
    })

  },
  checkStatus() {
    let id = this.data.order_number;
    wx.navigateTo({
      url: '/pages/ticket/orderDetail/index?id=' + id
    });
  },
  //获取全局参数配置
  getGlobalParam() {
    GetGlobalParam({}).then(res => {
      if (res.code == 200) {
        this.getInfo(res.data['awt.ticket.notice.article']);
      }
    })
  },
  //获取须知详情
  getInfo(id) {
    GetInfo({
      id: id
    }).then(res => {
      if (res.code == 200) {
        this.setData({
          mustKnow: res.data.content
        })
      }

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      order_id: options.id
    });
    this.getGlobalParam();
  },
})