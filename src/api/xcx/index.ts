import request from '/@/utils/request';

/**
 * 图文
 */

// 图片列表
export function bannerList() {
  return request({
    url: '/api/v1/system/banner/list',
    method: 'get',
  });
}

/**
 * 删除图文
 */
export function delBanner(params: object) {
  return request({
    url: "/api/v1/system/banner/delete",
    method: "post",
    data: params,
  })
}

/**
 * 修改图文排序
 */
export function editBannerSort(params: object) {
  return request({
    url: '/api/v1/system/banner/edit/sort',
    method: 'post',
    data: params,
  });
}
// 修改图文状态
export function editBannerStatus(params: object) {
  return request({
    url: '/api/v1/system/banner/edit/status',
    method: 'post',
    data: params,
  });
}
// 添加图文
export function storeBanner(params: object) {
  return request({
    url: '/api/v1/system/banner/store',
    method: 'post',
    data: params,
  });
}
// 修改图文
export function editBanner(params: object) {
  return request({
    url: '/api/v1/system/banner/edit',
    method: 'post',
    data: params,
  });
}
// 获取图文详情
export function bannerDetail(params: string) {
  return request({
    url: '/api/v1/system/banner/detail',
    method: 'get',
    params:{ biz_banner_id: params },
  });
}