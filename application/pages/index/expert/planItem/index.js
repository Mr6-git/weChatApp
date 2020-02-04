// pages/index/expert/planItem/index.js
import { create } from '../../../../components/base/index';
import DataFund from '../../../../data/fund';
import { Level } from '../../../../data/user';
import utils from '../../../../utils/index';

create({
  /**
   * 组件的属性列表
   */
  props: {
    data: {
      value: {},
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    fund: DataFund,
  },

  observers: {
    data: function(data) {
      // this.handleData();
    }
  },
  ready() {
    // this.handleData();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleData() {
      const data = this.data.data;
      const levelItem = this.getLevel(data.price);
      let time = data.create_time_str;
      let rate = 100;
      console.log(data, 'data111');
      if (!(data.expert.lately_count == 0 || data.expert.lately_hit_count == 0)) {
        console.log(data, 'data');
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

      this.setData({
        data,
      })
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
    gotoDetail(e) {
      const id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/planDetail/index?id=' + id,
      })
    }
  }
})
