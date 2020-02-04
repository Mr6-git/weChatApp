// application/pages/index/ticket/index.js
import {
  create
} from '../../../components/base/index';
import event from '../../../common/event';
import utils from '../../../utils/index';
import {
  GetTicketList
} from '../../../common/net/mall';
// import { NAV_KEY } from '../../../common/enum';

create({
  props: {

  },
  data: {
    listData: [],
    page: 1,
    limit: 15,
    data: [],
    loading: false,
  },
  attached() {

  },
  ready() {
    this.getList();
  },
  methods: {
    gotoDetail(e) {
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/index/ticket/detail/index?id=' + id
      });
    },
    getList(callback) {
      let { page, limit, listData } = this.data
      let json = {
        limit,
        page
      }
      GetTicketList(json).then(res => {
        if (callback) callback();
        if (res.code == 200) {
          res.data.map(item=>{
            listData.push(item)
          })
          this.setData({
            listData
          })
        }
      }).catch(rej => {
        console.log(rej)
      })
    },
    loadmore: function() {
      console.log(1)
      if (this.data.loading) return;
      this.data.page++;
      this.data.loading = true;
      this.getList(() => {
        this.data.loading = false;
      });
    },
    refresh: function(e) {
      this.setData({
        page: 1,
        listData: []
      })
      this.getList(e.detail.callback);
    },
  },
});