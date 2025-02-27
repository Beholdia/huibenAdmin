import request from '/@/utils/request';

/**
 * 图文 主题 品牌 特色
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
    params: { biz_banner_id: params },
  });
}

// 主题推荐列表
export function themeList(params: object) {
  return request({
    url: '/api/v1/system//book/tag/theme/list',
    method: 'get',
    params
  });
}
// // 特色人物列表
// export function featureList() {
//   return request({
//     url: '/api/v1/system/feature/list',
//     method: 'get',
//   });
// }
// // 品牌专区列表
// export function brandList() {
//   return request({
//     url: '/api/v1/system/brand/list',
//     method: 'get',
//   });
// }
// 分享邀请详情
export function shareDetail(params: object) {
  return request({
    url: '/api/v1/system/share/config/detail',
    method: 'get',
    params: params,
  });
}
// 修改分享邀请详情
export function editShareDetail(params: object) {
  return request({
    url: '/api/v1/system/share/config/edit',
    method: 'post',
    data: params,
  });
}
// 修改分享返现类型
export function editShareType(params: object) {
  return request({
    url: '/api/v1/system/share/config/edit/active_type',
    method: 'post',
    data: params,
    headers: {
      needLoading: true
    }
  });
}