export default {
  http: {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*'
    },
    credentials: 'include',
    mode: 'cors',
    baseURL: 'http://tongtu.juyunfuwu.cn/api/tongtu',
  },
  projectName: 'tongtu-labor-app',
  appVersion: '1.0.0',
  hostUrl: 'http://tongtu.juyunfuwu.cn/api/tongtu',
  latestUrl: 'http://tongtu.juyunfuwu.cn/dist/latest.json',
}
