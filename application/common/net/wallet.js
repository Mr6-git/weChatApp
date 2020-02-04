import net from './index'
import { API } from '../config'
import ctx from '../../data/login'

// ========== 资金 ==========
// 获取充值列表
export const GetRechargeList = (data) => {
  return net.get(`${API}/wallet/fund/GetRechargeList`, {
    token: ctx.token,
    ...data
  });
};
// 获取资金信息
export const GetFundInfo = (data) => {
  return net.get(`${API}/wallet/fund/GetFundInfo`, {
    token: ctx.token,
    ...data
  });
};
// 创建支付请求
export const UnifiedOrder = (data) => {
  return net.post(`${API}/wallet/fund/UnifiedOrder?token=${ctx.token}`, {
    ...data
  });
};
// 获取支付状态
export const GetUnifiedStatus = (data) => {
  return net.get(`${API}/wallet/fund/GetUnifiedStatus`, {
    token: ctx.token,
    ...data
  });
};
