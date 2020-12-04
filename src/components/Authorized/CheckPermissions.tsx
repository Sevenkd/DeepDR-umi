/**
 * 判断用户对某个组件的访问权限
 */
import React from 'react';
import { CURRENT } from './renderAuthorize';
import PromiseRender from './PromiseRender';

/**
 * 描述用户权限的几个基本类型
 */
export type IAuthorityType =
  | undefined
  | string
  | string[]
  | Promise<boolean>
  | ((currentAuthority: string | string[]) => IAuthorityType);

/**
 * 通用权限检查方法
 * 检测用户是否有权限访问当前组件
 * 返回用户将要看到的那个组件
 * 
 * 传入允许的权限, 用户的权限, 待检测权限的组件, 异常报警的组件
 * 对比组件的访问权限(可能是列表, 字符串, Promise甚至函数)和用户的权限
 * 如果用户有权限访问当前组件(比如访问权限列表中包含用户的权限等级), 则返回待访问的组件
 * 否则返回异常报错组件
 * 
 * 结合前边的脚手架代码, 当前的用户权限只能是字符串或字符串数组的形式, 但是用户的访问权限有可能要通过后台来获取
 * 所以有对函数和Promise的处理逻辑
 * 
 * @param { 权限判定 | Permission judgment } authority (运行访问此组件的权限)
 * @param { 你的权限 | Your permission description } currentAuthority (当前用户的权限)
 * @param { 通过的组件 | Passing components } target (用户传入的待检测组件, 如果检测通过, 则返回该组件, 后续逻辑可继续渲染该组件)
 * @param { 未通过的组件 | no pass components } Exception (用户传入的异常组件, 例如Alert403, message组件等, 如果检测未通过, 则返回此组件)
 */
const checkPermissions = <T, K>(
  authority: IAuthorityType,
  currentAuthority: string | string[],
  target: T,
  Exception: K,
): T | K | React.ReactNode => {
  // 没有判定权限.默认查看所有
  if (!authority) {
    return target;
  }

  // 数组处理
  if (Array.isArray(authority)) {
    if (Array.isArray(currentAuthority)) {
      if (currentAuthority.some((item) => authority.includes(item))) {
        return target;
      }
    } else if (authority.includes(currentAuthority)) {
      return target;
    }

    return Exception;
  }

  // string 处理
  if (typeof authority === 'string') {
    if (Array.isArray(currentAuthority)) {
      if (currentAuthority.some((item) => authority === item)) {
        return target;
      }
    } else if (authority === currentAuthority) {
      return target;
    }
    return Exception;
  }


  /**
   * 后两个处理方式应该是为了后台交互而准备的, 比如说有些权限是必须通过后台来确认的, 所以会有Promise的处理方式
   * 
   * PromiseRender是一个React组件, 会根据promise的解析结果异步地渲染组件, 这里直接把PromiseRender组件返回给权限组件
   * 可直接将这个组件挂载到页面上
   */

  // Promise 处理
  if (authority instanceof Promise) {
    return <PromiseRender<T, K> ok={target} error={Exception} promise={authority} />;
  }
  // Function 处理
  if (typeof authority === 'function') {
    const bool = authority(currentAuthority);
    // 如果函数执行后返回值是 Promise
    if (bool instanceof Promise) {
      return <PromiseRender<T, K> ok={target} error={Exception} promise={bool} />;
    }
    if (bool) {
      return target;
    }
    return Exception;
  }

  throw new Error('unsupported parameters');
};
export { checkPermissions };

/**
 * 同样是检测用户对某个组件的访问权限的函数, 内部就是使用了上边checkPermissions这个函数
 * 只是对参数封装了一下, 使用全局的当前用户权限作为判断依据
 * 返回一个React组件
 * 
 * @param authority 
 * @param target 
 * @param Exception 
 */
function check<T, K>(authority: IAuthorityType, target: T, Exception: K): T | K | React.ReactNode {
  return checkPermissions<T, K>(authority, CURRENT, target, Exception);
}
export default check;
