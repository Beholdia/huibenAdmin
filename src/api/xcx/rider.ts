import request from '/@/utils/request';

/**
 * 配送
 */

// 列表
export function riderList(params: object) {
  return request({
    url: '/api/v1/system/rider/list',
    method: 'get',
    params: params,
  });
}

/**
 * 删除配送
 */
export function delRider(params: object) {
  return request({
    url: "/api/v1/system/rider/delete",
    method: "post",
    data: params,
  })
}

// /**
//  * 修改配送排序
//  */
// export function editRiderSort(params: object) {
//   return request({
//     url: '/api/v1/system/rider/edit/sort',
//     method: 'post',
//     data: params,
//   });
// }
// 修改配送状态
export function editRiderStatus(params: object) {
  return request({
    url: '/api/v1/system/rider/edit/status',
    method: 'post',
    data: params,
  });
}
// 添加配送
export function storeRider(params: object) {
  return request({
    url: '/api/v1/system/rider/store',
    method: 'post',
    data: params,
  });
}
// 修改配送
export function editRider(params: object) {
  return request({
    url: '/api/v1/system/rider/edit',
    method: 'post',
    data: params,
  });
}
// 获取配送详情
export function riderDetail(params: string) {
  return request({
    url: '/api/v1/system/rider/detail',
    method: 'get',
    params: { biz_rider_id: params },
  });
}