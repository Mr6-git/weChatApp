import utils from '../../utils/index'
import event from '../../common/event'
import { clearLogin } from '../../data/login';
import ctx from '../../data/login';
import { Action } from '../../data/user';
import UserData, { BottomMenu } from '../../data/user';
import { getFundInfo, DataFund } from '../../data/fund';
import BPage from '../BPage';

const getPauseFund = (() => {
  let prevTime = (new Date()).valueOf();
  return function () {
    let nowTime = (new Date()).valueOf()
    if (nowTime - prevTime > 10000) {
      prevTime = nowTime;
      getFundInfo();
    }
  }
})();

BPage({
  data: {
    active: void 0,
    open: {},
    menu: [
      { value: '专家', src: "/images/menu/expert.png", src2: "/images/menu/expert2.png", key: 'expert', type: 'expert' },
      { value: '门票', src: "/images/menu/ticket.png", src2: "/images/menu/ticket2.png", key: 'ticket', type: 'ticket' },
      { value: '我的', src: "/images/menu/my.png", src2: "/images/menu/my2.png", key: "my", type: 'my' },
    ],
    intergral: 0,
    isModal: false,
    noMenu: false,
  },
  switchModal: function (e) {
    this.openTab(e.currentTarget.dataset.index);
  },
  openTab: function (index) {
    Action.indexOpen = index;
    this.data.open[index] = true;
    switch (index) {
      case 'wallet':
        // getPauseFund();
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: '#000000'
        });
        break;
      default:
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: '#ffffff'
        });
    }
    this.setData({
      active: index,
      open: this.data.open
    });
    return true;
  },
  onLoad: function (options) {
    this.openTab('expert');
  },
})
