import net from './index'
import { API } from '../config'
import ctx from '../../data/login'

// ========== 用户 ==========
// 注册
export const Register = (data) => {
  return net.post(`${API}/base/user/Reg`, {
    ...data
  });
};
// 登录
export const Login = (data) => {
  return net.post(`${API}/base/user/Login`, {
    ...data
  });
};
// 快捷登录
export const QuickLogin = (data) => {
  return net.post(`${API}/base/user/QuickLogin`, {
    ...data
  });
};
// 短信验证码登录
export const SmsLogin = (data) => {
  return net.post(`${API}/base/user/SmsLogin`, {
    ...data
  });
};
// 获取用户信息
export const Profile = (data) => {
  return net.get(`${API}/base/user/Profile`, {
    token: ctx.token,
    ...data
  });
};
// 第三方授权
export const ThirdAuthToken = (data) => {
  return net.post(`${API}/base/user/ThirdAuthToken?token=${ctx.token}`, {
    // token: ctx.token,
    ...data
  });
};


// ========== 安全 ==========
// 发送短信验证码
export const SMSSend = (data) => {
  return net.post(`${API}/base/security/SMSSend`, {
    ...data
  });
};

export const GetSessionKey = () => {

}

export const DecryptPhone = () => {

}

