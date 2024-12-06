import request from '/@/utils/request';

/**
 * 栏目
 */

// 图片列表
export function columnList() {
  return request({
    url: '/api/v1/system/column/list',
    method: 'get',
  });
}

/**
 * 删除栏目
 */
export function delColumn(params: object) {
  return request({
    url: "/api/v1/system/column/delete",
    method: "post",
    data: params,
  })
}

/**
 * 修改栏目排序
 */
export function editColumnSort(params: object) {
  return request({
    url: '/api/v1/system/column/edit/sort',
    method: 'post',
    data: params,
  });
}
// 修改栏目状态
export function editColumnStatus(params: object) {
  return request({
    url: '/api/v1/system/column/edit/status',
    method: 'post',
    data: params,
  });
}
// 添加栏目
export function storeColumn(params: object) {
  return request({
    url: '/api/v1/system/column/store',
    method: 'post',
    data: params,
  });
}
// 修改栏目
export function editColumn(params: object) {
  return request({
    url: '/api/v1/system/column/edit',
    method: 'post',
    data: params,
  });
}
// 获取栏目详情
export function columnDetail(params: string) {
  return request({
    url: '/api/v1/system/column/detail',
    method: 'get',
    params:{ biz_column_id: params },
  });
}