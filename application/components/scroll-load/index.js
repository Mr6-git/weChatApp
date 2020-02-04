// components/scroll-load/index.js
import { create } from '../base/index';
import utils from '../../utils/index';

create({
  props: {
  },
  data: {
    scrollTop: '100rpx',
    status: '0',
    hasAnimation: false,
    inited: false,
    refreshing: false
  },
  nowScrollTop: 100,
  touched: false,
  isScrolling: false,
  timeline: null,
  methods: {
    fire() {
      if (this.nowScrollTop < 50) {
        if (this.data.refreshing) return;
        this.data.refreshing = true;
        this.setData({
          status: 2
        })
        this.triggerEvent('refresh', {
          callback: () => {
            this.data.refreshing = false;
            this.setData({
              scrollTop: '100rpx'
            })
            setTimeout(() => {
              this.setData({
                status: 0
              });
            }, 300);
          }
        });
      } else if (this.nowScrollTop < 100) {
          this.setData({
            scrollTop: '100rpx'
          });
      }
    },
    changeStatus() {
      if (this.nowScrollTop < 50) {
        if (this.data.status >= 1) return;
        this.setData({
          status: 1
        })
      } else if (this.nowScrollTop < 100) {
        if (this.data.status == 0) return;
        this.setData({
          status: 0
        })
      }
    },
    toLower(e) {
      if (!this.data.inited) return;
      this.triggerEvent('loadmore');
    },
    touchStart() {
      this.touched = true;
    },
    touchEnd() {
      this.touched = false;
      this.isScrolling = false;
      clearTimeout(this.timeline);
      this.timeline = setTimeout(() => {
        if (this.isScrolling) return;
        this.fire();
      }, 50);
    },
    toScroll(e) {
      this.nowScrollTop = utils.pxtorpx(e.detail.scrollTop);
      this.isScrolling = true;
      this.changeStatus();
      clearTimeout(this.timeline);
      this.timeline = setTimeout(() => {
        if (this.touched) return;
        this.fire();
      }, 50);
    }
  },
  ready: function () {
    this.setData({
      hasAnimation: true
    })

    setTimeout(() => {
      this.data.inited = true;
    }, 100)
  }
});