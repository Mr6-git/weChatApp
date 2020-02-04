import { getUserInfo, getMemberLevels } from './user';
import { getFundInfo } from './fund';

const ctx = {
  token: '',
}

export const setLogin = (data) => {
  ctx.token = data.token;
  wx.setStorageSync('token', data.token);
  getMemberLevels();
  if (data.token != '') {
    getUserInfo();
    // getFundInfo();
  }
}

export const clearLogin = () => {
  ctx.token = '';
  wx.removeStorageSync('token');
  getUserInfo();
  // getFundInfo();
}

export default ctx;