/** 
 * @/pages/ListTableList/data.d
 * 数据表格的所有接口
*/

// 普通字典类型
interface Dict{
  [key: string]: [value: string];
}

// 医生诊断结果
interface DictDiagnose{
  diagnoseTime: Date;
  doctorName: string;
}

// 数据表格字段
export interface TableListItem {
  key: number;
  patientNum: string;
  patientName: string;
  checkAge: string;
  checkTime: Date;
  uploadTime: Date;
  hospitalName: string;
  osImages: Array<Dict>;
  odImages: Array<Dict>;
  osModelResult: Array<Array<string>>;
  odModelResult: Array<Array<string>>;
  doctorDiagnose: DictDiagnose | null;
}

// 表格分页用到的字段
export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}


export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}


export interface TableListParams {
  patientNum?: string;
  patientName?: string;
  pageSize?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}