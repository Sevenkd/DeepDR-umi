/**
 * 能感觉到不同文件的编程习惯和风格是不统一的, 应该不是一个人完成的这个脚手架代码, 所以读起来还是挺难受的
 * 辣鸡 -- by HKD
 */
import { reloadAuthorized } from './Authorized';

/**
 * 获取用户的权限(级别)
 * 此处antd将用户权限保存在localStorage中, 用来演示
 * TODO: 实际情况应根据用户login code从后台获取用户的权限
 * 
 * 如果登录的时候把用户权限存在本地, 那么返回一组字符串数组
 * 否则根据login_code从后台获取, 那么得到的权限应该是一个promise?
 */
export function getAuthority(str?: string): string | string[] {
  const authorityString = typeof str === 'undefined' && localStorage ? localStorage.getItem('antd-pro-authority') : str;

  // authorityString could be admin, "admin", ["admin"]
  let authority;

  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }

  if (typeof authority === 'string') {
    return [authority];
  }

  // preview.pro.ant.design only do not use in your production.
  // preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  if (!authority && ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return ['admin'];
  }
  return authority;
}

/**
 * 把当前用户的权限保存在localStorage里边, 并重新加载权限模块
 * TODO: 后期根据自己的项目改一改?
 */
export function setAuthority(authority: string | string[]): void {
  const proAuthority = typeof authority === 'string' ? [authority] : authority; // 把用户权限整理成字符串数组的形式
  localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
  // auto reload
  reloadAuthorized();
}
