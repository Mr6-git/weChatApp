import { globalUrl } from '../common/config';
import UserData from '../data/user'

export default {
  checkLogin() {
    if (UserData.isLogin) return true;
    this.gotoLogin()
    return false;
  },
  getParams(strs) {
    let res = {};
    strs = strs.split("&");
    for (var i = 0; i < strs.length; i++) {
      res[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
    return res;
  },
  navigateBack(url = '') {
    let pages = getCurrentPages();
    if (pages.length == 1) return wx.redirectTo({ url: url });
    wx.navigateBack();
  },
  getDiffData(level0) {
    level0 = (Math.abs(level0) / 1000) >> 0;

    let oneDay = 86400;
    let day = Math.floor(level0 / oneDay);
    let leave1 = level0 % oneDay;

    let oneHour = 3600;
    let hours = Math.floor(leave1 / oneHour);

    let oneMinutes = 60;
    let leave2 = leave1 % oneHour
    let minutes = Math.floor(leave2 / oneMinutes)

    let leave3 = leave2 % oneMinutes
    let seconds = Math.floor(leave3);
    return {
      day,
      hours,
      minutes,
      seconds
    };
  },
  checkUrl(url) {
    return /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/.test(url);
  },
  dataReplace(str, data) {
    return str.replace(/{([^}]+)}/g, function (item, $1) {
      if (data[$1]) return data[$1];
      return item
    });
  },
  formatDate(datetime, format = 'YYYY-MM-DD HH:mm') {
    if (typeof (datetime) == 'string') {
      datetime = datetime.replace(/\-/g, '/');
      datetime = new Date(datetime);
    } else if (typeof (datetime) == 'number') {
      datetime = new Date(datetime * 1000);
    } else if (!(datetime instanceof Date)) {
      datetime = new Date();
    }

    var week = ['日', '一', '二', '三', '四', '五', '六'];
    return format.replace(/YYYY|YY|MM|DD|HH|hh|mm|SS|ss|week/g, function (key) {
      switch (key) {
        case 'YYYY': return datetime.getFullYear();
        case 'YY': return (datetime.getFullYear() + '').slice(2);
        case 'MM': return datetime.getMonth() + 1 < 10 ? '0' + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        case 'DD': return datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate();
        case 'HH':
        case 'hh': return datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours();
        case 'mm': return datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes();
        case 'SS':
        case 'ss': return datetime.getSeconds() < 10 ? '0' + datetime.getSeconds() : datetime.getSeconds();
        case 'week': return week[datetime.getDay()];
      }
    });
  },
  addPrev(url, bt = '') {
    if (!this.checkUrl(url)) {
      return `${globalUrl}${bt}/${url}`
    }
    return url
  },
  gotoURL(url) {
    url = this.dataReplace(url, {
      token: UserData.token,
      uid: UserData.uid,
      nonceStr: (new Date).valueOf()
    });
    url = encodeURIComponent(this.addPrev(url, '/#'));
    wx.navigateTo({
      url: `/pages/webview/index?url=${url}`
    });
  },
  gotoLogin() {
    wx.navigateTo({
      url: '/pages/login/index'
    });
  },
  formatMoney(val, dotLength = 2) {
    if (isNaN(val)) val = 0;
    const exp = /\B(?=(?:\d{3})+$)/g;
    val = Number(val);
    var str = val.toFixed(dotLength);

    if (dotLength == 0) {
      return (str + '').replace(exp, ',');
    }
    
    var intSum = str.substring(0, str.indexOf('.')).replace(exp, ',');
    var dot = str.substring(str.length, str.indexOf('.'));
    return intSum + dot
  },
  doubleNumber(n) {
    if (Number(n) < 10) return '0' + n;
    return n;
  },
  getIcon(id, type = 1) {
    switch (type) {
      case 2:
        // 游戏类型图标 sport_id
        return `${globalUrl}/sport/${id}.png`
      case 1:
      default:
        // 游戏队伍图标 team_id
        return `${globalUrl}/soccer/team/${id}.png`
    }
  },
  pxtorpx(px) {
    return Math.round(px * 750 / wx.getSystemInfoSync().windowWidth);
  },
  textEllipsis(str, num) {
    if (!str) return '-'
    const _str = str.substr(0, num);
    console.log(str, 'str', _str)
    return _str + '...'
  },
  checkPhone(str) {
    return /^\d{11}$/.test(str)
  },
  checkEmail(str) {
    return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(str);
  },
  checkPwd(str) {
    const len = str.length;
    return len >= 6 && len <= 8;
  }
}