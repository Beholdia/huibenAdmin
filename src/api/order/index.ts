import request from '/@/utils/request';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';

/**
 * 订单管理
 */

// 会员购买订单

export function paylist(params: object) {
  return request({
    url: '/api/v1/system/pay/order/list',
    method: 'get',
    params,
  });
}
// 押金退款
export function refund(params: object) {
  return request({
    url: '/api/v1/system/pay/order/refund',
    method: 'post',
    data: params,
  });
}
// 提现订单
export function withdrawallist(params: object) {
  return request({
    url: '/api/v1/system/withdrawal/list',
    method: 'get',
    params,
  });
}

// 确认提现
export function confirmWithdrawal(params: object) {
  return request({
    url: '/api/v1/system/withdrawal/confirm',
    method: 'post',
    data: params,
  });
}
// 打包订单
export function orderlist(params: object) {
  return request({
    url: '/api/v1/system/book/order/list',
    method: 'get',
    params,
    headers: {
      needLoading: true
    }
  });
}
// 确认打包
export function confirmPack(params: object) {
  return request({
    url: '/api/v1/system/book/order/pack',
    method: 'post',
    data: params,
  });
}