import net from './index'
import { API } from '../config'
import ctx from '../../data/login'

// ========== 应用管理 ==========
// 获取导航配置
export const GetNavigation = (data) => {
  return net.get(`${API}/system/apps/GetNavigation`, {
    ...data
  });
};
// 获取参数配置
export const GetParam = () => {
  return net.get(`${API}/system/apps/GetParam`, {
    ...data
  });
}
// 获取广告列表
export const GetAdvertList = (data) => {
  return net.get(`${API}/system/apps/GetAdvertList`, {
    ...data
  });
}

// ========== 其他 ==========
// 获取会员等级列表
export const GetMemberLevels = (data) => {
  return net.get(`${API}/system/commons/GetMemberLevels`, {
    ...data
  });
}
