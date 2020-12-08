import request from '@/utils/request';
import baseUrl from './baseUrl';

/**
 * 与后台交互: 用户登录
 * 
 * @param username: 用户名
 * @param password: 密码
 */
export interface LoginParamsType { username: string; password: string; }
export async function loginUser(params: LoginParamsType) {
  return request(baseUrl + '/api/authorizations/login', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 与后台交互: 用户注销登录
 * 
 * @param {string} login_code 用户登录标识
 */
interface LogoutParamsType {login_code: string }
export async function logOutUser(params: LogoutParamsType) {
  return request(baseUrl + '/api/authorizations/logout', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}



