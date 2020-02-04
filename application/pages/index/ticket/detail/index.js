// application/pages/index/ticket/index.js
import {
  create
} from '../../../../components/base/index';
import event from '../../../../common/event';
import utils from '../../../../utils/index';
import {
  GetTicketInfo,
  GetGearList
} from '../../../../common/net/mall';
GetGlobalParam
import {
  GetGlobalParam
} from '../../../../common/net/system';
import {
  GetInfo
} from '../../../../common/net/media';
// import { NAV_KEY } from '../../../common/enum';
Page({
  data: {
    tab: [{
      value: '简介',
      key: 0
    }, {
      value: '须知',
      key: 1
    }, ],
    active: 0,
    buyFlag: false,
    ticket_id: '',
    ticketInfo: {},
    sessionInfo: [],
    num: 0,
    agreeFlag: 1,
    sessionCheckId: '',
    ticketCheckId: '',
    ticketCheckInfo: '',
    ticketList: [],
    ticketPrice: '',
    totalMoney: utils.formatMoney(0),
    mustKnow: ''
  },
  goBack() {
    wx.navigateBack('/pages/index/index');
  },
  activeTab(e) {
    let id = e.currentTarget.dataset.id;
    if (this.data.active == id) return;
    this.setData({
      active: id
    });
  },
  buyNow() {
    this.setData({
      buyFlag: true
    })
  },
  addNum() {
    this.data.num++;
    this.setData({
      num: this.data.num,
      totalMoney: utils.formatMoney(this.data.ticketPrice * this.data.num),
      /* 增加时候总计要变 */
    })
  },
  minusNum() {
    if (this.data.num <= 0) {
      return
    }
    this.data.num--;
    this.setData({
      num: this.data.num,
      totalMoney: utils.formatMoney(this.data.ticketPrice * this.data.num) /* 减少时候总计要变 */
    })
  },
  closeBuy() {
    this.setData({
      buyFlag: false
    })
  },
  agree() {
    this.setData({
      agreeFlag: 1
    })
  },
  unagree() {
    this.setData({
      agreeFlag: 0
    })
  },
  chooseSession(e) {
    let item = e.currentTarget.dataset.item;
    this.setData({
      sessionCheckId: item.scene_id,
      ticketCheckId: item.gears[0].gear_id,
      ticketCheckInfo: item.gears[0],
      ticketList: item.gears,
      totalMoney: utils.formatMoney((item.gears[0].price / 100) * this.data.num),
      /* 改变选择的场次时候总计要变 */
    })
  },
  chooseTicket(e) {
    let item = e.currentTarget.dataset.item;
    this.setData({
      ticketCheckId: item.gear_id,
      ticketCheckInfo: item,
      ticketPrice: item.price / 100,
      totalMoney: utils.formatMoney((item.price / 100) * this.data.num),
      /* 改变选择的票档时候总计要变 */
    })
  },
  // 获取单个门票详情
  getTicketInfo(id) {
    GetTicketInfo({
      ticket_id: id
    }).then(res => {
      if (res.code == 200) {
        this.setData({
          ticketInfo: res.data
        })
      }
    }).catch(rej => {
      console.log(rej)
    })
  },

  // 获取票档列表
  getGearList(id) {
    GetGearList({
      ticket_id: id
    }).then(res => {
      if (res.code == 200) {
        res.data.map((item, index) => {
          res.data[index].time = utils.formatDate(item.start_time);
        })
        this.setData({
          sessionInfo: res.data,
          sessionCheckId: res.data[0].scene_id,
          ticketCheckId: res.data[0].gears[0].gear_id,
          ticketCheckInfo: res.data[0].gears[0],
          ticketList: res.data[0].gears,
          ticketPrice: res.data[0].gears[0].price / 100,
        })
      }
    }).catch(rej => {
      console.log(rej)
    })
  },

  //打开地图
  openMap() {
    const {
      ticketInfo
    } = this.data,
      latitude = Number(ticketInfo.lat),
      longitude = Number(ticketInfo.lng);
    console.log(latitude, longitude)
    wx.openLocation({
      latitude,
      longitude,
      scale: 18
    })
  },

  // 点击确定
  doIn() {
    if (this.data.num <= 0 || this.data.agreeFlag != 1) {
      return;
    }
    let {
      ticketInfo,
      num,
      ticketCheckInfo,
      ticketPrice,
      totalMoney
    } = this.data
    let json = {
      ticketDetail: ticketInfo,
      num: num,
      totalMoney: totalMoney,
      ticketCheckInfo: ticketCheckInfo
    }
    if (utils.checkLogin()) {
      wx.navigateTo({
        url: '/pages/index/ticket/order/index?info=' + JSON.stringify(json)
      });
    }
    // wx.navigateTo({
    //   url: '/pages/index/ticket/order/index?info=' + JSON.stringify(json)
    // });
  },
  //跳转购票协议
  toProtocol () {
    
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
      ticket_id: options.id
    })
    this.getTicketInfo(options.id);
    this.getGearList(options.id);
    this.getGlobalParam();
  },
})
