import request from '/@/utils/request';

/**
 * 书籍信息管理api接口集合
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