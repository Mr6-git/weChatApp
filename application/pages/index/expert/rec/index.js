// pages/index/expert/rec/index.js
import { create } from '../../../../components/base/index';
import { GetAdvertList } from '../../../../common/net/api';
import { GetPlanList } from '../../../../common/net/expert';
import { Level } from '../../../../data/user';
import utils from '../../../../utils/index';

create({
  /**
   * 组件的属性列表
   */
  props: {
    gameId: {
      value: '',
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tab: [
      {
        id: 0,
        name: '最新',
        sort_field: 'latest'
      }, {
        id: 1,
        name: '价格',
        sort_field: 'price'
      }, {
        id: 2,
        name: '连红',
        sort_field: 'lately_red'
      }, {
        id: 3,
        name: '命中',
        sort_field: 'lately_hit_count'
      }, {
        id: 4,
        name: '免费',
        sort_field: 'free'
      }
    ],
    activeTab: 0,

    adv: null,

    page: 1,
    limit: 15,
    data: [],
    loading: false,
    hasNext: true,
    hasData: true,
  },

  /**
   * 组件的方法列表
   */

  attached() {
    this.getAdv();
    this.getData();
  },
  methods: {
    getData(callback) {
      let { gameId, page, limit, tab, activeTab, data } = this.data;
      const sort_field = tab[activeTab].sort_field;
      const json = {
        limit,
        page,
        game_id: gameId,
        sale_status: 1,
        // is_top: sort_field == 'latest' ? 1 : 0,
        is_free: sort_field == 'free' ? 1 : 0,
        sort_field: sort_field != 'latest' && sort_field != 'free' ? sort_field : '',
        sort_type: 'descend',
      }
      GetPlanList(json).then(res => {
        if (callback) callback();
        if (res.code == 200) {
          let hasNext = this.data.hasNext;

          if (!res.data) return;
          if (res.data && (res.data.length < limit)) {
            hasNext = false;
          }
          if (!res.data) res.data = [];
          if (page == 1) data = [];
          let resData = this.handleData(res.data);
          data.push(...resData);

          this.setData({
            data,
            hasNext,
            hasData: data && data.length ? true : false,
          });
        } else {
          this.showError(res.detail);
        }
      }).catch(err => {
        this.showError('获取方案失败');
      })
    },
    getAdv() {
      GetAdvertList({ position: 'awt.adverts.scheme' }).then(res => {
        if (res.code == 200) {
          this.setData({
            adv: res.data,
          })
        } else {
          this.showError(res.detail);
        }
      })
    },
    handleData(list) {
      if (!list || !list.length) return list;
      const _list = list.map(data => {
        const levelItem = this.getLevel(data.price);
        let time = data.create_time_str;
        let rate = 100;
        if (!(data.expert.lately_count == 0 || data.expert.lately_hit_count == 0)) {
          rate = (Number(data.expert.lately_hit_count) / Number(data.expert.lately_count) * 100).toFixed(0);
        }
        if (time.indexOf('天') > -1) {
          time = utils.formatDate(data.create_time)
        }

        Object.assign(data, {
          price: data.price / 100,
          levelItem,
          create_time_str: time,
          rate,
        });

        return data;
      })
      return _list;
    },
    handleTab(e) {
      const id = e.currentTarget.dataset.id;
      if (this.data.activeTab == id) return;
      this.setData({
        page: 1,
        activeTab: id,
      }, () => {
        this.getData();
      });
    },
    getLevel(price) {
      let result = {}
      for (let i = 0; i < Level.data.length; i++) {
        const item = Level.data[i];
        if (price <= item.scheme_limit) {
          result = item;
          break
        }
      }
      return result;
    },
    loadmore: function () {
      if (this.data.loading || !this.data.hasNext) return;
      this.data.page++;
      this.data.loading = true;
      this.getData(() => {
        this.data.loading = false;
      });
    },
    refresh: function (e) {
      this.data.page = 1;
      this.data.data = [];
      this.getData(e.detail.callback);
    },
    showError(title) {
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 2000
      })
    },
  }
})
