import { Profile, customNavigation } from '../common/net/base';
import { GetMemberLevels } from '../common/net/api';
import event from '../common/event';
import ctx from './login'

const defaultData = {
  avatar: '/images/my/avatar.png',
  nickname: '登录/注册',
  mobile: '登录可享受更多服务',
  sex: 1,
  wechat: '',
  birthday: '',
  email: '',
  nickname_review: '',
  nickname_status: 0,
  avatar_status: 0,
  level_info: {
    level: '-',
    name: '',
    points: '',
    points_next: '',
  }
}

const UserData = {
  ...defaultData,
  isLogin: false
};

export const BottomMenu = {
  // race: '0',
  // guess: '0',
  // award: '1',
  // my: '0'
}

const getMenuSetting = (function() {
  let isFirst = true;
  return function getMenuSetting() {
    if (!isFirst) return;
    isFirst = false;
    customNavigation('bottom_menu').then((res) => {
      if (res.code== 200) {
        let navList = res.data.nav_list || []
        for (let i = 0; i < navList.length; i++) {
          BottomMenu[navList[i].tpl] = navList[i].is_show
        }
        event.emit('MenuSettingChange');
      }
    })
  };
})()

export const getUserInfo = () => {
  Profile().then((res) => {
    if (res.code== 200) {
      Object.assign(UserData, {
        ...res.data,
        avatar: res.data.avatar || '/images/my/avatar.png',
        isLogin: true
      });
    } else if (res.code == 401) {
      ctx.token = '';
      wx.removeStorageSync('token');

      for (let key in UserData) {
        delete UserData[key];
      }
      Object.assign(UserData, defaultData, {
        isLogin: false,
      });
    } else {
      for (let key in UserData) {
        delete UserData[key];
      }
      Object.assign(UserData, defaultData, {
        isLogin: false,
      });
    }
    event.emit('DataUserChange', UserData);
  }).catch(() => {
    Object.assign(UserData, defaultData, {
      isLogin: false,
    });
    event.emit('DataUserChange', UserData);
  });

  // getMenuSetting()
}

export const Level = {
  data: [],
  getLevel(lv, token) {
    const level = Number(lv);
    if (!token) return { '0': '-' }
    if (!level) return { '0': '0', '1': this.data[0] }
    this.data.map((item, index) => {
      if (level > item.max_points && index == 4) {
        return [index, item]
      }
      if (level > item.min_points && level < item.max_points) {
        return { '0': index, '1': item }
      }
    })
  }
}

export const getMemberLevels = () => {
  return GetMemberLevels().then(res => {
    if (res.code == 200) {
      let data = res.data;
      if (data && data.length) {
        // 去重
        let hash = {};
        data = data.reduce(function (item, next) {
          hash[next.min_points] ? '' : hash[next.min_points] = true && item.push(next);
          return item
        }, []);
        Level.data = data
      }
    } else {

    }
  })
}

export default UserData;

export const Action = {
  indexOpen: '',
  guessOpen: ''
};
