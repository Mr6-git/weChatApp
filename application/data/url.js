import { CustomConfig } from '../common/net/api';

const URLData = {
  vip: 'https://events.duokong.com/#/user/userlevel?uid={uid}&token={token}&minWX=true', // vip
  exchange: '' //领奖
};

export const urlInit = () => {
  CustomConfig({
    config_keys: [
      'protocol_license',
      'protocol_privacyagree',
      'protocol_releasenotes'
    ]}).then((res) => {
      if (res.code== 200) {        
        Object.assign(URLData, res.data);
      }
  });
}

export default URLData;
