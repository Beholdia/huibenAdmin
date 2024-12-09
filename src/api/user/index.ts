import request from '/@/utils/request';

/**
 * 用户
 */

// 用户列表
export function userList(params: object) {
  return request({
    url: '/api/v1/system/user/list',
    method: 'get',
    params
  });
}

// /**
//  * 删除用户
//  */
// export function delUser(params: object) {
//   return request({
//     url: "/api/v1/system/user/delete",
//     method: "post",
//     data: params,
//   })
// }

// /**
//  * 修改用户排序
//  */
// export function editUserSort(params: object) {
//   return request({
//     url: '/api/v1/system/user/edit/sort',
//     method: 'post',
//     data: params,
//   });
// }
// 修改用户状态
export function editUserStatus(params: object) {
  return request({
    url: '/api/v1/system/user/edit/status',
    method: 'post',
    data: params,
  });
}
// // 添加用户
// export function storeUser(params: object) {
//   return request({
//     url: '/api/v1/system/user/store',
//     method: 'post',
//     data: params,
//   });
// }
// // 修改用户
// export function editUser(params: object) {
//   return request({
//     url: '/api/v1/system/user/edit',
//     method: 'post',
//     data: params,
//   });
// }
// 获取用户详情
export function userDetail(params: string) {
  return request({
    url: '/api/v1/system/user/detail',
    method: 'get',
    params: { biz_user_id: params },
  });
}