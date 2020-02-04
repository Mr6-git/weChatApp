// pages/index/expert/index.js
import { create } from '../../../components/base/index';
import ctx, { clearLogin } from '../../../data/login';
import { GetGameList } from '../../../common/net/expert';

create({
  props: {
    noMenu: {
      type: String,
      value: '1',
    },
  },
  data: {
    platform: 'ios',
    nav: [
      {
        desc: '',
        title: '专家',
        key: '10',
        icon: 'http://dev-assets.awtio.com/',
        type: 1,
        link_url: ""
      }
    ],
    menu: [
      {
        _id: '',
        name: '全部游戏',
      }
    ],
    active: '',
  },
  attached: function () {
    const res = wx.getSystemInfoSync();
    this.setData({
      platform: res.platform
    });
  },
  ready() {
    this.getMenu();
  },
  methods: {
    getMenu() {
      GetGameList({
        assort: '10',
        is_finish: 0,
      }).then(res => {
        if (res.code == 200) {
          const menu = [];
          menu.push(...this.data.menu, ...res.data)
          this.setData({
            menu,
          });
        } else {
          this.showError(res.detail);
        }
      })
    },
    handleMenu(e) {
      const id = e.currentTarget.dataset.id;
      if (this.data.active == id) return;
      this.setData({
        active: id
      });
    },
    showError(title) {
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 2000
      })
    },
  },
});