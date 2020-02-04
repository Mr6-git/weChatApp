import net from './index'
import { API } from '../config'
import ctx from '../../data/login'

// ==========   ==========
// 获取全局参数配置
export const GetGlobalParam = (data) => {
  return net.get(`${API}/system/apps/GetParam`, {
    ...data
  });
};