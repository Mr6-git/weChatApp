import { GetFundInfo } from '../common/net/wallet';
import event from '../common/event';

const fund = {
  balance: { value: '0.00', name: '鱼苗', rate: '100' },
  points: { value: '0.00', name: '锦鲤分', rate: '100' }
}

const DataFund = {
  isLogin: false,
  ...fund
};

export const getFundInfo = () => {
  GetFundInfo().then((res) => {
    let isLogin = false;
    if (res.code== 200) {
      isLogin = true;
    } else {
      for (let key in DataFund) {
        delete DataFund[key];
      }
    }
    Object.assign(DataFund, { ...fund, ...res.data, isLogin });
    event.emit('DataFundChange', DataFund)
  }).catch(() => {
    Object.assign(DataFund, {
      ...fund,
      isLogin: false
    });
    event.emit('DataFundChange', DataFund);
  });
}

export default DataFund;
