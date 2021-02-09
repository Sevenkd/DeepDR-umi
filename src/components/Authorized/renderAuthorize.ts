/**
 * 这段代码的可读性是真JB烂 -- by HKD
 * 
 * 这段代码是在渲染用户权限, 用户权限通过字符串或者字符串数组来描述, 也可以是一个返回字符串或字符串数组的箭头函数?(或者React函数组件?)
 * 
 * 其他Authorized等文件定义了权限封装的逻辑, 这一步实际上把这个组件给渲染出来?
 * renderAuthorize接受Authorized组件作为输入, 返回一个箭头函数作为新的组件返回给页面逻辑
 * 其返回的函数接收currentAuthority(当前用户的权限作为输入), 将当前用户权限赋值给CURRENT变量(全局变量?), 最终返回一开始输入的Authorized组件
 * 感觉有点像一个装饰器函数?
 * 
 * 这里定义了当前用户权限CURRENT, 这个CURRENT变量很有可能就是一个全局的当前用户权限变量
 */

let CURRENT: string | string[] = 'NULL';

type CurrentAuthorityType = string | string[] | (() => typeof CURRENT);

/**
 * use  authority or getAuthority
 * @param {string|()=>String} currentAuthority
 */
const renderAuthorize = <T>(Authorized: T): ( (currentAuthority: CurrentAuthorityType) => T ) => {
  return ( currentAuthority: CurrentAuthorityType, ): T => {

    if (currentAuthority) {
      if (typeof currentAuthority === 'function') {
        CURRENT = currentAuthority();
      }
      if ( Object.prototype.toString.call(currentAuthority) === '[object String]' || Array.isArray(currentAuthority) ) {
        CURRENT = currentAuthority as string[];
      }
    } else {
      CURRENT = 'NULL';
    }
  
    return Authorized;
  };
};

export { CURRENT };
export default <T>(Authorized: T) => renderAuthorize<T>(Authorized);
