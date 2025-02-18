import request from '/@/utils/request';

/**
 * 用户
 */

// 用户列表
export function userList(params: object) {
  return request({
    url: '/api/v1/system/user/list',
    method: 'get',
    params,
    headers: {
      needLoading: true
    }
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
    headers: {
      needLoading: true
    }
  });
}
// 设置体验会员
export function setUserTrial(params: object) {
  return request({
    url: '/api/v1/system/user/set/trial',
    method: 'post',
    data: params,
  });
}

// 借阅记录
export function borrowList(params: object) {
  return request({
    url: '/api/v1/system/user/borrow/list',
    method: 'get',
    params
  });
}
// 邀请记录

export function inviteList(params: object) {
  return request({
    url: '/api/v1/system/user/invite/list',
    method: 'get',
    params
  });
}
// 设置书箱
export function setUserBox(params: object) {
  return request({
    url: '/api/v1/system/user/set/box',
    method: 'post',
    data: params,
  });
}
export function addExpired(params: object) {
  return request({
    url: '/api/v1/system/vip/expired_day/increase',
    method: 'post',
    data: params,
  });
}