import request from '@/utils/request';
import { TableTodayParams } from './data.d';


/**
 * 查询表格条目
 * 
 * TODO:
 * 这里附加login_code
 */
export async function queryItems(params?: TableTodayParams) {
  return request('/api/searchManager/tableToday', {
    method: 'POST',
    data: {
      ...params, 
      login_code: "EE0F263BA09519E6B37F1501AA935215"
    },
    requestType: 'form',
  });
}