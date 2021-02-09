import request from '@/utils/request';
import baseUrl from '@/services/baseUrl';

/**
 * 妇儿中心接口
 * 向后台上传病例
 * 
 * @param { string } login_code 用户登录凭证
 * @param { File[] } files 待上传文件列表
 */
export interface uplaodRecordsWCCHParams { login_code: string; files: File[]; }
export async function uplaodRecordsWCCH( params: uplaodRecordsWCCHParams ) {
  var formData = new FormData();
  formData.append('login_code', params.login_code);
  params.files.forEach( file => { formData.append(file.uid, file); } )
  return request(baseUrl + '/api/dataManager/uploadInWeb_WCCH', {
    method: 'POST',
    data: formData,
  });
}
