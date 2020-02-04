// components/tabs/index.js
import { create } from '../base/index';

create({
  props: {
    tabs: {
      value: [],
      type: Array
    },
    onTabClick: {
      type: Function
    },
    activeTab: {
      value: 0,
      type: Number
    },
    activeIndex: {
      value: 0,
      type: Number
    },
  },
  data: {
    tabs: [],
    activeTab: 0,
    activeIndex: 0
  },
  methods: {
    _getTabContent() {
      // 使用getRelationNodes可以获得nodes数组，包含所有已关联的tab-content，且是有序的
      const nodes = this.getRelationNodes('path/to/tab-content')
      console.log(nodes, 'nodes')
    },
    handleTabClick(e) {
      const { id, index } = e.currentTarget.dataset;
      this.setData({
        activeTab: id,
        activeIndex: index
      });
      console.log(id, index)
    },
  },
  relations: {
    './tab-content/index': {
      type: 'child', // 关联的目标节点应为子节点
      linked(target) {
        // 每次有custom-li被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
        console.log(target, 'target_tabs')
      },
      linkChanged(target) {
        // 每次有custom-li被移动后执行，target是该节点实例对象，触发在该节点moved生命周期之后
      },
      unlinked(target) {
        // 每次有custom-li被移除时执行，target是该节点实例对象，触发在该节点detached生命周期之后
      }
    }
  },
  attached: function() {
    console.log(this.data, 555)
    this.setData({
      handleTabClick: this.data.onTabClick
    })
  },
  observers: {},
  ready: function () {
    this._getTabContent()
  }
});