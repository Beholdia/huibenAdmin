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

// 书籍列表
export function bookList(params: object) {
  return request({
    url: "/api/v1/system/book/list",
    method: "get",
    params
  })
}
// 下架下架书籍
export function changeSaleStatus(params: object) {
  return request({
    url: "/api/v1/system/book/sale_status/change",
    method: "post",
    data: params,
  })
}
// 书架字典列表
export function bookShelfList() {
  return request({
    url: "/api/v1/system/book/shelf/list",
    method: "get",
  })
}
//普通字典列表
export function bookTagList(params: string) {
  return request({
    url: "/api/v1/system/book/tag/list",
    method: "get",
    params: { dict_type: params }
  })
}
// 修改字典数据状态
export function changeTagStatus(params: object) {
  return request({
    url: "/api/v1/system/dict/data/edit/status",
    method: "put",
    data: params,
  })
}
// 书籍分类详情


export function bookTagDetail(params: string) {
  return request({
    url: "/api/v1/system/book/tag/detail",
    method: "get",
    params: {dict_code:params},
  })
}

// 修改书籍分类字典数据
export function editBookTag(params: object) {
  return request({
    url: "/api/v1/system/book/tag/edit",
    method: "post",
    data: params,
  })
}

//修改字书籍分类字典状态
export function editBookTagSort(params: object) {
  return request({
    url: "/api/v1/system/book/tag/edit/sort",
    method: "post",
    data: params,
  })
}
// 删除书籍分类字典
export function deleteBookTag(params: string) {
  return request({
    url: "/api/v1/system/book/tag/delete",
    method: "delete",
    params: { dict_code: params },
  })
}