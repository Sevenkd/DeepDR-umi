import request from 'umi-request';
import baseUrl from './baseUrl';

/**
 * 从后台查询病例的详细信息(包括诊断信息和基本信息)
 */
interface queryRecordInfoParams { login_code: string, uploadID: number }
export async function queryRecordInfo(params: queryRecordInfoParams) {
  return  request(baseUrl + '/api/dataManager/getRecordInfo', {
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
  return  request(baseUrl + '/api/dataManager/submitDiagnose', {
            method: 'POST',
            data: params,
            requestType: 'form',
          });
}



/**
 * 向眼科专家请求远程会诊
 */
interface sendConsultationRequestParams { login_code: string, uploadID: number }
export async function sendConsultationRequest(params: sendConsultationRequestParams) {
  return  request(baseUrl + '/api/dataManager/requestConsultation', {
            method: 'POST',
            data: params,
            requestType: 'form',
          });
}

/**
 * 请求AI模型服务器重新诊断当前病例
 */
interface rediagnoseRecordByUploadIDsParams { login_code: string, uploadIDs: string }
export async function rediagnoseRecordByUploadIDs(params: rediagnoseRecordByUploadIDsParams) {
  return  request(baseUrl + '/api/dataManager/rediagnoseRecordByUploadIDs', {
            method: 'POST',
            data: params,
            requestType: 'form',
          });
}