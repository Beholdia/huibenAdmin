import request from '/@/utils/request';

/**
 * 图文
 */

// 图片列表
export function columnList() {
  return request({
    url: '/api/v1/system/column/list',
    method: 'get',
  });
}

/**
 * 删除图文
 */
export function delColumn(params: object) {
  return request({
    url: "/api/v1/system/column/delete",
    method: "post",
    data: params,
  })
}

/**
 * 修改图文排序
 */
export function editColumnSort(params: object) {
  return request({
    url: '/api/v1/system/column/edit/sort',
    method: 'post',
    data: params,
  });
}
// 修改图文状态
export function editColumnStatus(params: object) {
  return request({
    url: '/api/v1/system/column/edit/status',
    method: 'post',
    data: params,
  });
}
// 添加图文
export function storeColumn(params: object) {
  return request({
    url: '/api/v1/system/column/store',
    method: 'post',
    data: params,
  });
}
// 修改图文
export function editColumn(params: object) {
  return request({
    url: '/api/v1/system/column/edit',
    method: 'post',
    data: params,
  });
}
// 获取图文详情
export function columnDetail(params: string) {
  return request({
    url: '/api/v1/system/column/detail',
    method: 'get',
    params:{ biz_column_id: params },
  });
}