import { create } from '../base/index';

create({
  props: {
    wrap: {
      type: String,
      value: 'noList-wrap'
    },
    tips: {
      type: String,
      value: '暂无数据',
    },
    img: {
      type: String,
      value: '/images/nodata/noData.png'
    }
  },
  ready: function () {
    
  }
});