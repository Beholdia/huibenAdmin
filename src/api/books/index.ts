import request from '/@/utils/request';

/**
 * 书籍信息管理api接口集合
 */

// isbn查询信息
export function searchIsbn(params: object) {
  return request({
    url: '/api/v1/system/book/search/isbn',
    method: 'post',
    data: params,
  });
}

/**
 * isbn手工添加
 */
export function isbnStore(params: object) {
  return request({
    url: "/api/v1/system/book/isbn/store",
    method: "post",
    data: params,
  })
}

/**
 * 新书入库
 */
export function bookStore(params: object) {
  return request({
    url: '/api/v1/system/book/store',
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