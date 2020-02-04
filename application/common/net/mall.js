import net from './index'
import { API } from '../config'
import ctx from '../../data/login'

// ========== 商城 ==========
// 获取赛事门票列表
export const GetTicketList = (data) => {
  return net.get(`${API}/mall/ticket/GetList`, {
    ...data
  });
};

// 获取单个门票详情
export const GetTicketInfo = (data) => {
  return net.get(`${API}/mall/ticket/GetInfo`, {
    ...data
  });
};

// 获取单个门票票档列表
export const GetGearList = (data) => {
  return net.get(`${API}/mall/ticket/GetGearList`, {
    ...data
  });
};

// 购买门票
export const Buy = (data) => {
  return net.post(`${API}/mall/ticket/Buy?token=${ctx.token}`, {
    ...data
  });
};

// 获取支付渠道(微信小程序)
export const ChannelPay = (data) => {
  return net.get(`${API}/wallet/fund/GetPayChannelList?token=${ctx.token}&terminal_type=5`, {
    ...data
  });
};

//获取支付状态
// export const GetUnifiedStatus = (data) => {
//   return net.get(`${API}/wallet/fund/GetUnifiedStatus?token=${ctx.token}`, {
//     ...data
//   });
// };

//获取我的票夹
export const GetOrderLis = (data) => {
  return net.get(`${API}/mall/ticket/GetOrderList?token=${ctx.token}`, {
    ...data
  });
};

//获取单个票夹详情
export const GetOrderInfo = (data) => {
  return net.get(`${API}/mall/ticket/GetOrderInfo?token=${ctx.token}`, {
    ...data
  });
};

//取消订单
export const CancelOrder = (data) => {
  return net.post(`${API}/mall/ticket/CancelOrder?token=${ctx.token}`, {
    ...data
  });
};