import request from '/@/utils/request';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';

/**
 * 书籍信息管理api接口集合
 */
// let loading = null;

// isbn查询信息
export function searchIsbn(params: object) {
  // loading = ElLoading.service();
  return request({
    url: '/api/v1/system/book/search/isbn',
    method: 'post',
    data: params,
    headers: { needLoading: true }
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
    headers: { needLoading: true }

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
    headers: { needLoading: true }
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
    params: { dict_code: params },
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
    method: "post",
    params: { dict_code: params },
  })
}
// 小程序状态修改
export function editBookStatusTagXcx(params: object) {
  return request({
    url: "/api/v1/system/book/tag/edit/tiny_app_status",
    method: "post",
    data: params,
  })

}

// 书架号详情
export function bookShelfDetail(params: string) {
  return request({
    url: "/api/v1/system/book/shelf/detail",
    method: "get",
    params: { biz_bookshelf_id: params },
  })
}
// 修改书架号
export function editBookShelf(params: object) {
  return request({
    url: "/api/v1/system/book/shelf/edit",
    method: "post",
    data: params,
  })
}
//修改书架号状态
export function editBookShelfStatus(params: object) {
  return request({
    url: "/api/v1/system/book/shelf/edit/status",
    method: "post",
    data: params,
  })
}
// 删除书架号
export function deleteBookShelf(params: string) {
  return request({
    url: "/api/v1/system/book/shelf/delete",
    method: "post",
    params: { biz_bookshelf_id: params },
  })
}
// 添加书架号
export function addBookShelf(params: object) {
  return request({
    url: "/api/v1/system/book/shelf/add",
    method: "post",
    data: params,
  })
}

// 获取字典选择框列表
export function optionSelect() {
  return request({
    url: "/api/v1/system/dict/type/optionSelect",
    method: "get",
  })
}
// 批量数据列表
export function batchList(params) {
  return request({
    url: "/api/v1/system/dict/data/many",
    method: "post",
    data:params
  })
}
// 增加库存
export function addBookCount(params) {
  return request({
    url: "/api/v1/system/book/add/stock",
    method: "post",
    data: params,
    headers: { needLoading: true }
  })
}

export function bookDetail(params) {
  return request({
    url: "/api/v1/system/book/detail",
    method: "get",
    params: { biz_books_id: params },
    headers: { needLoading: true }
  })
}

// 修改书本
export function editBook(params) {
  return request({
    url: "/api/v1/system/book/edit",
    method: "post",
    data: params,
  })
}