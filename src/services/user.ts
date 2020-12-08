import request from '@/utils/request';
import baseUrl from './baseUrl';

/**
 * 通过loginCode查询用户登录信息
 * 
 * @param login_code: loginCode
 */
export interface fetchUserByLoginCodeParamsType { login_code: string; }
export async function fetchUserByLoginCode(params: fetchUserByLoginCodeParamsType) {
  return request(baseUrl + '/api/authorizations/fetchUserByLoginCode', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
