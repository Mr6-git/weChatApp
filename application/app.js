//app.js
import { setLogin } from './data/login';
import { urlInit } from './data/url';

App({
  onLaunch: function (options) {
    // urlInit();
    if (options.scene == 1069) { // 从app来

    }
  },
  onShow: function () {
    // 唤醒的时候重新读取登录信息
    const token = wx.getStorageSync('token');
    setLogin({ token });
  },
  globalData: {
    userInfo: null
  }
})
