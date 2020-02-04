import { create } from '../../../components/base/index';
import { Login } from '../../../common/net/base';
import utils from '../../../utils/index';
import UrlData from '../../../data/url';

create({
  data: {
    step: 1,
    phone: '',
    pwd: '',

    isPhone: false,
    canSee: false,
    phoneClose: false,
    pwdClose: false,
    backPwd: false,
    change: false,
  },
  methods: {
    gotoPor() {
      utils.gotoURL(UrlData.protocol_license)
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
    bindPwd(e) {
      const val = e.detail.value;
      this.setData({
        pwd: val,
        pwdClose: val ? true : false,
      });
    },
    login() {
      const data = this.data;
      if (!data.phone || !data.pwd) return;
      const json = {
        mobile: data.phone,
        password: data.pwd,
      }
      wx.showToast({
        title: '登陆中',
        icon: 'loading',
      });
      Login(json).then((res) => {
        if (res.code== 200) {
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
          duration: 3000,
        });
      });
    },
    clearInput(e) {
      const key = e.currentTarget.dataset.key;
      const flag = key == 'phone' ? 'phoneClose' : 'pwdClose';
      this.setData({
        [key]: '',
        [flag]: false,
      });
    },
    handleEye() {
      const lastCanSee = this.data.canSee;
      this.setData({
        change: true,
        canSee: !lastCanSee,
        backPwd: lastCanSee ? true : false,
      });
    },
    gotoCode() {
      this.triggerEvent('setLoginType', {
        type: 'phone',
      });
    },
    gotoUpdatePwd() {
      wx.navigateTo({
        url: '/pages/forgetPwd/index'
      });
    },
  }

})
