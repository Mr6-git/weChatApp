// components/odds/index.js
import { create } from '../base/index';
import event from '../../common/event';
import utils from '../../utils/index';
import { preBetting, GetBetMax, JackpotBetting } from '../../common/net/api';
import DataFund, { getFundInfo } from '../../data/fund';

create({
  props: {
    source: Object,
    eventName: {
      type: String,
      value: 'default'
    }
  },
  data: {
    postData: void 0,
    info: {},
    value: 0,
    winValue: 0,
    canPool: 0
  },
  methods: {
    stopEvent: function() {

    },
    keydownValue: function(e) {
      let value = this.data.value * 10 + Number(e.currentTarget.dataset.value);
      this.setValue(value);
    },
    mutipleValue: function(e) {
      let value = Math.max(this.data.value, 1) * Number(e.currentTarget.dataset.value);
      this.setValue(value);
    },
    clearValue: function() {
      this.setValue(0);
    },
    allIn: function() {
      this.setValue(Math.floor(Number(DataFund.balance.value) / DataFund.balance.rate));
    },
    sendOrder() {
      let value = this.data.value * DataFund.balance.rate;
      if (value <= 0) return this.showError('请选择下注金额');
      if (value > DataFund.balance.value) {
        wx.navigateTo({
          url: '/pages/charge/bean/index'
        })
        return;
      }
      let Betting = this.data.parentInfo.sp_model == '1' ? JackpotBetting : preBetting;

      Betting({
          ...this.data.postData,
        amount: `${value}`,
        prize_mode: '1'
      })
      .then((res) => {
        if (res.code== 200) {
          getFundInfo();
          this.closeLunch();
          return wx.showToast({
            title: '投注成功',
            icon: 'success',
            duration: 2000
          });
        } 
        this.showError(res.detail);
      });
    },
    showError(title) {
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 2000
      })
    },
    setValue(value) {
      let maxValue = this.data.parentInfo.sp_model == '1' ? this.data.canPool : 999999;
      if (value > maxValue) value = maxValue;
      let winValue = value * Math.round(this.data.info.odds * 100) / 100;
      this.setData({ value, winValue });
    },
    transitionends: function () {
      if (!this.data.lunchShow) {
        this.setData({
          show: false
        });
      }
    },
    changeLunch: function(data) {
      this.openLunch(data);
    },
    openLunch: function(data) {
      if (!utils.checkLogin()) return;
      this.setData({
        show: true,
        value: 0,
        winValue: 0,
        postData: data.postData,
        fundData: DataFund,
        info: data.info,
        parentInfo: data.parentInfo,
        event: data.event,
        canPool: 0
      }, () => {
        if (data.parentInfo.sp_model == '1') {
          GetBetMax(data.info.oid).then((res) => {
            if (res.code== 200) {
              this.setData({ canPool: res.data.bet_max / DataFund.balance.rate });
            }
          })
        }
        this.setData({
          lunchShow: true
        });
      });
    },
    closeLunch: function () {
      this.setData({
        lunchShow: false
      });
    }
  },
  attached: function() {
    this.offEvent = this.changeLunch.bind(this);
    this.fundChangeEvent = () => {
      if (this.data.show) {
        this.setData({
          fundData: DataFund
        })
      }
    };

    event.on(`odd-${this.data.eventName}`, this.offEvent);
    event.on('DataFundChange', this.fundChangeEvent);
  },
  detached: function() {
    event.off(`odd-${this.data.eventName}`, this.offEvent);
    event.off('DataFundChange', this.fundChangeEvent);
  }
});
