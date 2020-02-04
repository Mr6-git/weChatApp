export default function(data) {
  return Page({
    onShareAppMessage(froms, target, webViewUrl) {
      return {
        title: '浮光数据',
        path: '/pages/index/index'
      };
    },
    ...data
  });
}
