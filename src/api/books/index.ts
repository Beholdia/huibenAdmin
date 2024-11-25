import request from '/@/utils/request';

/**
 * 书籍信息管理api接口集合
 */

export function searchIsbn(params: object) {
  return request({
    url: '/api/v1/system/book/search/isbn',
    method: 'post',
    data: params,
  });
}

/**
 * 获取验证码
 */
export function captcha() {
  return request({
    url: "/api/v1/system/captcha/get",
    method: "get"
  })
}

/**
 * 退出登录
 */
export function logout() {
  return request({
    url: '/api/v1/system/user/logout',
    method: 'get',
  });
}
