<<<<<<< HEAD:src/pages/searchRecords/service.ts
import request from '@/utils/request';

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
  [propName: string]: any;
}
export async function query_SearchRecords(params: TableTodayParams, ) {
  console.log("query record", params);
  return request('/api/searchManager/searchRecords', {
    method: 'POST',
    data: {
      ...params,
      filter: params.filter ? JSON.stringify(params.filter) : {},
      sorter: params.sorter ? JSON.stringify(params.sorter) : {},
    },
    requestType: 'form',
  });
}
=======
import request from '@/utils/request';
import baseUrl from './baseUrl';

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
  [propName: string]: any;
}
export async function query_SearchRecords(params: TableTodayParams, ) {
  return request(baseUrl + '/api/searchManager/searchRecords', {
    method: 'POST',
    data: {
      ...params,
      filter: params.filter ? JSON.stringify(params.filter) : {},
      sorter: params.sorter ? JSON.stringify(params.sorter) : {},
    },
    requestType: 'form',
  });
}
>>>>>>> 092315422825166727cca4d8c6e39b67f966210b:src/services/searchRecords.ts
