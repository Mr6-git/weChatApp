import net from './index'
import { API } from '../config'
import ctx from '../../data/login'

// ==========   ==========
// 获取文章详情
export const GetInfo = (data) => {
  return net.get(`${API}/media/article/GetInfo`, {
    ...data
  });
};