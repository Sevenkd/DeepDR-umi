import request from 'umi-request';

/**
 * 从后台查询病例的详细信息(包括诊断信息和基本信息)
 */
interface queryRecordInfoParams { login_code: string, uploadID: number }
export async function queryRecordInfo(params: queryRecordInfoParams) {
  return  request('/api/dataManager/getRecordInfo', {
            method: 'POST',
            data: params,
            requestType: 'form',
          });
}

/**
 * 提交诊断结果
 */
interface submitDiagnoseParams { 
  login_code: string, 
  uploadID: string,
  osTipical: string,
  odTipical: string,
  osDict: string,
  osDiagnoseStr: string,
  odDict: string,
  odDiagnoseStr: string,
  diagnosticOpinion: string,
}
export async function submitDiagnose(params: submitDiagnoseParams) {
  console.log("submitDiagnose", params);
  return  request('/api/dataManager/submitDiagnose', {
            method: 'POST',
            data: params,
            requestType: 'form',
          });
}