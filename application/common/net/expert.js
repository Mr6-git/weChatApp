import net from './index'
import { API } from '../config'
import ctx from '../../data/login'

// ========== 专家 ==========
// 获取专家列表
export const GetList = (data) => {
  return net.get(`${API}/scheme/expert/GetList`, {
    ...data
  });
};
// 获取专家分类
export const GetCategoryList = (data) => {
  return net.get(`${API}/scheme/expert/GetCategoryList`, {
    ...data
  });
}
// 获取专家详情
export const GetInfo = (data) => {
  return net.get(`${API}/scheme/expert/GetInfo`, {
    ...data
  });
}
// 获取专家个人方案列表
export const GetSchemeList = (data) => {
  return net.get(`${API}/scheme/expert/GetSchemeList`, {
    ...data
  });
}
// 获取专家排行榜
export const GetRankingList = (data) => {
  return net.get(`${API}/scheme/expert/GetRankingList`, {
    ...data
  });
}

// ========== 方案 ==========
// 获取方案列表
export const GetPlanList = (data) => {
  return net.get(`${API}/scheme/scheme/GetList`, {
    ...data
  });
}
// 获取方案详情
export const GetPlanInfo = (data) => {
  return net.get(`${API}/scheme/scheme/GetInfo?token=${ctx.token}`, {
    ...data
  });
}
// 获取我已购买的方案
export const GetPurchasedList = (data) => {
  return net.get(`${API}/scheme/scheme/GetPurchasedList?token=${ctx.token}`, {
    ...data
  });
}
// 购买方案
export const Buy = (data) => {
  return net.post(`${API}/scheme/scheme/Buy?token=${ctx.token}`, {
    ...data
  });
}


// 获取游戏列表
export const GetGameList = (data) => {
  return net.get(`${API}/market/event/GetGameList?token=${ctx.token}`, {
    ...data
  });
}
// 获取赛事信息
export const GetEventInfo = (data) => {
  return net.get(`${API}/market/event/GetInfo`, {
    ...data
  });
}
