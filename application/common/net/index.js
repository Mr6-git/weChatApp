import ctx from '../../data/login'

// 正式
// let AppKey = '43a58de05457647be46cf5ee';
// let ServicerId = '1145874434909802496';

// 测试
let AppKey = '64a080de0cbad36ab607f5d6';
let ServicerId = '1134625846519140352';

const headers = {
  'Content-Type': 'application/json',
  'Device': 'web',
  'IMEI': '',
  'Bundle-ID': 'im.awt.events',
  'Version': '1.0',
  // 'Timestamp': Math.floor((new Date()).getTime() / 1000),
  'App-Key': AppKey,
  'Servicer-Id': ServicerId
}

const request = (dataInfo, showLoading = false) => {
  dataInfo = {
    method: 'get',
    url: '',
    header: dataInfo.header,
    ...dataInfo
  }

  // if (dataInfo.method.toLocaleLowerCase() != 'get') {
  //   if (dataInfo.data) {
  //     dataInfo.data.ctx = ctx;
  //   } else {
  //     dataInfo.data = { ctx };
  //   }
  // }

  return new Promise((resolve, reject) => {
    if (showLoading) {
      wx.showLoading({
        title: '加载中',
        mask: true
      });
    }
    return wx.request({
      url: dataInfo.url,
      data: dataInfo.data,
      header: dataInfo.header,
      method: dataInfo.method,
      success: (res) => {
        resolve(res.data);
      },
      fail: (res) => {
        reject(res);
      },
      complete: () => {
        if (showLoading) {
          wx.hideLoading()
        }
      }
    });
  })
}

export default {
  get: (url, data, showLoading, header) => {
    return request({ url, data, method: 'GET', header: header || headers }, showLoading)
  },
  post: (url, data, showLoading, header) => {
    return request({ url, data, method: 'POST', header: header || headers }, showLoading)
  },
  put: (url, data, showLoading, header) => {
    return request({ url, data, method: 'PUT', header }, showLoading)
  },
  delete: (url, data, showLoading, header) => {
    return request({ url, data, method: 'DELETE', header }, showLoading)
  },
  request
}
