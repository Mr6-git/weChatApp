// components/tab-content/index.js
import { create } from '../../base/index';

create({
  props: {
    activeIndex: {
      value: 0,
      type: Number
    },
    index: {
      value: 0,
      type: Number
    },
  },
  data: {
    activeIndex: 0,
    index: 0
  },
  relations: {
    '../tabs/index': {
      type: 'parent', // 关联的目标节点应为父节点
      linked(target) {
        // 每次被插入到custom-ul时执行，target是custom-ul节点实例对象，触发在attached生命周期之后
        console.log(target, 'target')
      },
      linkChanged(target) {
        // 每次被移动后执行，target是custom-ul节点实例对象，触发在moved生命周期之后
      },
      unlinked(target) {
        // 每次被移除时执行，target是custom-ul节点实例对象，触发在detached生命周期之后
      }
    }
  },
  methods: {
    handleChange() {
    }
  },
  attached: function() {
    const { index, activeIndex } = this.data
    this.setData({
      index,
      activeIndex
    })
  },
  observers: {},
  ready: function () {

  }
});