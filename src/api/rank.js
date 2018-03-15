
import jsonp from 'common/js/jsonp'
import {commonParams, options} from 'api/config'

export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1
  })

  return jsonp(url, data, options)
}


export function getMusicList(topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, commonParams, {
    topid: topid,
    platform: 'yqq',
    needNewCode: 0,
    type: 'top',
    page: 'detail',
    tpl: 3
  })

  return jsonp(url, data, options)
}


