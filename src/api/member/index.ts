import request from '/@/utils/request';

/**
 * 会员价格设置
 */

// 列表
export function vipList() {
  return request({
    url: '/api/v1/system/vip/list',
    method: 'get',
  });
}

/**
 * 删除
 */
export function delVip(params: object) {
  return request({
    url: "/api/v1/system/vip/delete",
    method: "post",
    data: params,
  })
}

/**
 * 修改排序
 */
export function editVipSort(params: object) {
  return request({
    url: '/api/v1/system/vip/edit/sort',
    method: 'post',
    data: params,
  });
}
// 修改状态
export function editVipStatus(params: object) {
  return request({
    url: '/api/v1/system/vip/edit/status',
    method: 'post',
    data: params,
  });
}
// 添加
export function storeVip(params: object) {
  return request({
    url: '/api/v1/system/vip/store',
    method: 'post',
    data: params,
  });
}
// 修改
export function editVip(params: object) {
  return request({
    url: '/api/v1/system/vip/edit',
    method: 'post',
    data: params,
  });
}
// 获取详情
export function vipDetail(params: string) {
  return request({
    url: '/api/v1/system/vip/detail',
    method: 'get',
    params: { biz_vip_id: params },
  });
}