// pages/index/race/index.js
import { create } from '../../../components/base/index';
import event from '../../../common/event';
import utils from '../../../utils/index';
import DataUser from '../../../data/user';
// import { NAV_KEY } from '../../../common/enum';

create({
  props: {
    noMenu: {
      type: String,
      value: '1',
    }
  },
  data: {
    menu: [
      {
        id: 0,
        icon: '/images/my/icon-1.png',
        name: '充值鱼苗',
        key: 'charge'
      },
      // {
      //   id: 1,
      //   icon: '/images/my/icon-2.png',
      //   name: '我的账单',
      //   key: 'bill'
      // },
      {
        id: 2,
        icon: '/images/my/icon-9.png',
        name: '我的票夹',
        key: 'ticket'
      }, 
      {
        id: 3,
        icon: '/images/my/icon-3.png',
        name: '我的方案',
        key: 'plan'
      }, {
        id: 4,
        icon: '/images/my/icon-4.png',
        name: '账户与安全',
        key: 'account'
      }, {
        id: 5,
        icon: '/images/my/icon-6.png',
        name: '用户协议',
        key: 'protocol'
      }, {
        id: 6,
        icon: '/images/my/icon-7.png',
        name: '隐私政策',
        key: 'agree'
      }, {
        id: 7,
        icon: '/images/my/icon-8.png',
        name: '联系我们',
        key: 'contact'
      },
    ],
    data: DataUser,
  },
  attached() {
    const res = wx.getSystemInfoSync();
    this.setData({
      platform: res.platform
    });
  },
  ready() {
    this.getUserInfo();

    event.on('DataUserChange', (data) => {
      this.getUserInfo();
    });
  },
  methods: {
    getUserInfo() {
      this.setData({
        data: DataUser,
      });
    },
    gotoUrl(e) {
      const key = e.currentTarget.dataset.key;
      switch (key) {
        case 'charge': this.gotoCharge(); break;
        case 'bill': this.gotoBill(); break;
        case 'ticket': this.gotoTicket(); break;
        case 'plan': this.gotoPlan(); break;
        case 'account': this.gotoAccount(); break;
        case 'protocol': this.gotoProtocol(); break;
        case 'agree': this.gotoAgree(); break;
        case 'contact': this.contact(); break;
      }
    },
    gotoPersonal() {
      if (utils.checkLogin()) {
        
      }
    },
    gotoCharge() {
      if (utils.checkLogin()) {
        wx.navigateTo({
          url: '/pages/charge/index'
        });
      }
    },
    gotoBill() {
      if (utils.checkLogin()) {
        wx.navigateTo({
          url: '/pages/bill/index'
        });
      }
    },
    gotoTicket() {
      if (utils.checkLogin()) {
        wx.navigateTo({
          url: '/pages/ticket/index'
        });
      }
    },
    gotoPlan() {
      if (utils.checkLogin()) {
        wx.navigateTo({
          url: '/pages/plan/index'
        });
      }
    },
    gotoOrder() {
      if (utils.checkLogin()) {
        wx.navigateTo({
          url: '/pages/order/index'
        });
      }
    },
    gotoAccount() {
      if (utils.checkLogin()) {
        wx.navigateTo({
          url: '/pages/account/index'
        });
      }
    },
    gotoProtocol() {
      wx.navigateTo({
        url: '/pages/about/license/index'
      });
    },
    gotoAgree() {
      wx.navigateTo({
        url: '/pages/about/privacy/index'
      });
    },
    contact() {
      wx.makePhoneCall({
        phoneNumber: '089832885180',
      });
    }
  },
});