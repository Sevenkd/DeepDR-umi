/**
 * @/utils/srcUrls
 * 
 * 根据 ID, loginCode 等字段统一拼接资源的url, 方便统一管理
 */
import baseUrl from '@/services/baseUrl';



/**
 * 获取诊断报告图像的资源路径
 * @param { string } loginCode 用户登录标识
 * @param { string|number } uploadID  病例ID
 */
export const getReportImgURL = (loginCode: string, uploadID:string|number) => {
  return baseUrl + "/api/dataManager/getReportByUploadID?login_code=" + loginCode + "&uploadID="+uploadID;
}

/**
 * 获取眼底图像的资源路径
 * @param { string } loginCode 用户登录标识
 * @param { string|number } imgId  图像ID
 */
export const getFundusImgURL = (loginCode: string, imgId:string|number) => {
  return baseUrl + "/api/dataManager/getFundusImageByID?login_code=" + loginCode + "&imgID="+imgId;
}

/**
 * 获取诊断报告PDF文件资源路径
 * @param { string } loginCode 用户登录标识
 * @param { string|number } imgId  图像ID
 */
export const getReportPDFURL = (loginCode: string, uploadID:string|number) => {
  return baseUrl + "/api/dataManager/downloadReportByUploadID?login_code=" + loginCode + "&uploadID="+uploadID;
}