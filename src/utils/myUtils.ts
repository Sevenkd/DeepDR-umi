

/**
 * 把从后台得到的图像id列表组合成url的形式, 按照数组的方式返回
 * 
 * @param { string[] } imgIDs 图像id列表
 * @param { string } loginCode 用户登录标识
 */
export const getImgListFromIDs = (imgIDs: string[], loginCode: string): string[] => {
  const imgList: string[] = imgIDs.map( (imgID: string) => "http://192.168.7.181:9005/api/dataManager/getFundusImageByID?login_code=" + loginCode + "&imgID=" + imgID );
  return imgList;
}


