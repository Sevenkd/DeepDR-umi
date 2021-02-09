/**
 * 一些杂七杂八的工具?
 */
import { parse } from 'querystring';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);


/**
 * 将名为{name}的数据{data}保存在localStorage中, 并设置过期时间
 * 默认过期时间是
 * @param {string} name 变量名, 如 loginCode
 * @param {any} data 变量的值
 * @param {number} expire 过期的时间, 默认1000 * 60 * 30 (30min)
 */
export const localStorageSet = (name: string, data:any, expire=1000 * 60 * 30) => {
  const obj = {
      data,
      expire: new Date().getTime() + expire
  };
  localStorage.setItem(name, JSON.stringify(obj));
};

/**
 * 读取localStorage中的变量, 并比较变量是否过期
 * 如果过期则返回null
 * @param {string} name 变量名
 */
export const localStorageGet = (name:string) => {
  const storage = localStorage.getItem(name);
  const time = new Date().getTime();
  let result = null;
  if (storage) {
      const obj = JSON.parse(storage);
      if (time < obj.expire) {
          result = obj.data;
      } else {
          localStorage.removeItem(name);
      }
  }
  return result;
};