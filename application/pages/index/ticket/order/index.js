// application/pages/index/ticket/index.js
import {
  create
} from '../../../../components/base/index';
import event from '../../../../common/event';
import utils from '../../../../utils/index';
import {
  Buy,
  GetTicketInfo,
  ChannelPay,
  GetOrderInfo,
  GetUnifiedStatus
} from '../../../../common/net/mall';
import {
  ThirdAuthToken
} from '../../../../common/net/base';
import {
  UnifiedOrder
} from '../../../../common/net/wallet';
// import { NAV_KEY } from '../../../common/enum';
Page({
  data: {
    popupFlag: false,
    info: {},
    order_number: '',
  },
  goBack() {
    // wx.showModal({
    //   content: '支付尚未完成，确定离开？',
    //   success(res) {
    //     if (res.confirm) {
    //       wx.navigateBack();
    //     } else if (res.cancel) {}
    //   }
    // })
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
  checkStatus() {
    let id = this.data.order_number;
    wx.redirectTo({
      url: '/pages/ticket/orderDetail/index?id=' + id
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      info: JSON.parse(options.info)
    })
  },
})