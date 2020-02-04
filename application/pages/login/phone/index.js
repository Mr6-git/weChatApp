import { create } from '../../../components/base/index';
import { SMSSend, QuickLogin, GetSessionKey, DecryptPhone } from '../../../common/net/base';
import utils from '../../../utils/index';
import UrlData from '../../../data/url';

create({
  data: {
    step: 1,
    phone: '',
    code: '',
    codeArr: ['', '', '', '', '', ''],

    canKeyBoard: false,
    isFull: false, // code > 6
    isPhone: false,
    canCode: true,
    count: 179,
    timer: null,

    isRegister: '1',
    phoneClose: false,

    key: '',
  },
  attached() {
    // this.getCode();
  },
  methods: {
    gotoPor() {
      utils.gotoURL(UrlData.protocol_license)
    },
    getPhoneNumber(e) {
      const json = {
        encrypted_data: e.detail.encryptedData,
        iv: e.detail.iv,
        key: this.data.key,
      }
      DecryptPhone(json).then((res) => {
        if (res.code== 200) {
          this.setData({
            phone: res.data.phone_number,
            isPhone: true,
            phoneClose: true,
          });
        }
      });
    },
    getCode() {
      wx.login({
        success: (el) => {
          this.getKey(el.code);
        }
      })
    },
    getKey(code) {
      const json = {
        js_code: code
      }
      GetSessionKey(json).then((res) => {
        switch (res.status) {
          case '200': {
            this.data.key = res.data.key;
          } break;
          case '1': {
            this.getCode();
            wx.showToast({
              title: '登录失效，请稍后重试！',
              icon: 'none'
            });
          } break;
          default: {
            wx.showToast({
              title: '获取SessionKey失败！',
              icon: 'none'
            });
          } break;
        }
      });
    },
    bindPhone(e) {
      const val = e.detail.value;
      const isPhone = val && utils.checkPhone(val) ? true : false;
      this.setData({
        phone: val,
        isPhone,
        phoneClose: val ? true : false,
      });
    },
    bindCode(e) {
      const val = e.detail.value;
      const codeArr = [];
      for (let i = 0; i < val.length; i++) {
        codeArr[i] = val.substr(i, 1);
      }
      for (var i = codeArr.length; i < 6; i++) {
        codeArr.push("");
      }
      this.setData({
        code: val,
        codeArr: codeArr,
        isFull: val.length >= 6 ? true : false,
      });
    },
    callKeyBoard() {
      this.setData({
        canKeyBoard: !this.data.canKeyBoard,
      });
    },
    counting() {
      this.setData({
        canCode: false,
      });
      this.data.timer = setInterval(() => {
        if (this.data.count < 1) {
          this.setData({
            canCode: true,
          })
          clearInterval(this.data.timer);
          return;
        }
        this.setData({
          count: this.data.count - 1,
        })
      }, 1000)
    },
    getVCode() {
      if (!this.data.isPhone || !this.data.canCode) return;
      const data = {
        mobile: this.data.phone,
        type: 1,
      }
      SMSSend(data).then((res) => {
        if (res.code== 200) {
          this.setData({
            step: 2,
            canKeyBoard: true,
            isRegister: res.data.is_register,
          }, () => {
            wx.showToast({
              title: res.detail,
              icon: 'none',
              duration: 2500,
            });
            this.counting();
          })
          return;
        }
        wx.showToast({
          title: res.detail,
          icon: 'none',
          duration: 2500,
        });
      });
    },
    login() {
      const data = this.data;
      const inviteObj = {};
      if (data.isRegister == '0') {
        inviteObj.invite_code = wx.getStorageSync('invite');
      }
      if (data.code.length < 6) return;
      const json = {
        mobile: data.phone,
        code: data.code,
        source: 0,
        is_receive: 0,
        ...inviteObj
      }

      wx.showLoading({
        title: '登陆中',
      })
      QuickLogin(json).then((res) => {
        wx.hideLoading();
        if (res.code== 200) {
          clearInterval(this.data.timer);
          this.triggerEvent('setUserInfo', {
            ...res.data
          });
          return wx.showToast({
            title: res.detail,
            icon: 'success',
            duration: 2000,
            complete: () => {
              setTimeout(() => {
                utils.navigateBack('/pages/index/index');
              }, 500)
            }
          });
        }
        wx.showToast({
          title: res.detail,
          icon: 'none',
          duration: 3000
        });
      }).catch(() => {
        wx.hideLoading();
      });
    },
    clearInput() {
      this.setData({
        phone: '',
        phoneClose: false,
      });
    },
    gotoAccount() {
      this.triggerEvent('setLoginType', {
        type: 'account',
      });
    },
  },
})
