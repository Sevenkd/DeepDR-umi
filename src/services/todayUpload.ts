import request from '@/utils/request';
import baseUrl from '@/services/baseUrl';

/**
 * 表格查询字段
 * 不仅包含查询用的params
 * 还包含sorter和filter
 */
export interface TableTodayParams {
  login_code: string;
  pageSize: number;
  current: number;
  filter: { [key: string]: any[] };
  sorter: { [key: string]: any };
}
export async function queryItems(params: TableTodayParams, ) {
  return request(baseUrl + '/api/searchManager/tableToday', {
    method: 'POST',
    data: {
      login_code: params.login_code,
      pageSize: params.pageSize,
      current: params.current,
      filter: params.filter ? JSON.stringify(params.filter) : null,
      sorter: params.sorter ? JSON.stringify(params.sorter) : null,
    },
    requestType: 'form',
  });
}

/**
 * 表格查询字段
 * 不仅包含查询用的params
 * 还包含sorter和filter
 */
export interface TableWeeklyParams {
  login_code: string;
  pageSize: number;
  current: number;
  filter: { [key: string]: any[] };
  sorter: { [key: string]: any };
}
export async function queryWeekly(params: TableWeeklyParams, ) {
  return request(baseUrl + '/api/searchManager/tableWeeklyUploads', {
    method: 'POST',
    data: {
      login_code: params.login_code,
      pageSize: params.pageSize,
      current: params.current,
      filter: params.filter ? JSON.stringify(params.filter) : null,
      sorter: params.sorter ? JSON.stringify(params.sorter) : null,
    },
    requestType: 'form',
  });
}