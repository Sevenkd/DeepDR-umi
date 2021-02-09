import React from 'react';
import CheckPermissions from './CheckPermissions';

/**
 * 默认不能访问任何页面
 * default is "NULL"
 */
const Exception403 = () => 403;

/**
 * 判断传入对象是否是React组件? 用来判断一个对象有没有被实例化?
 */
export const isComponentClass = (component: React.ComponentClass | React.ReactNode): boolean => {
  if (!component) return false;
  const proto = Object.getPrototypeOf(component);
  if (proto === React.Component || proto === Function.prototype) return true;
  return isComponentClass(proto);
};

/**
 * 和PromiseRender里边类似, 也是检测传入的对象有没有被实例化?
 * 没有实例化则把他变成实例以便渲染?
 * 原antd注释如下:
 * Determine whether the incoming component has been instantiated
 * AuthorizedRoute is already instantiated
 * Authorized  render is already instantiated, children is no instantiated
 * Secured is not instantiated
 */
const checkIsInstantiation = (target: React.ComponentClass | React.ReactNode) => {
  if (isComponentClass(target)) {
    const Target = target as React.ComponentClass;
    return (props: any) => <Target {...props} />;
  }
  if (React.isValidElement(target)) {
    return (props: any) => React.cloneElement(target, props);
  }
  return () => target;
};

/**
 * 用于判断是否拥有权限访问此 view 权限
 * authority 支持传入 string, () => boolean | Promise
 * e.g. 'user' 只有 user 用户能访问
 * e.g. 'user,admin' user 和 admin 都能访问
 * e.g. ()=>boolean 返回true能访问,返回false不能访问
 * e.g. Promise  then 能访问   catch不能访问
 * @param {string | function | Promise} authority 可访问的权限
 * @param {ReactNode} error 非必需参数, 如果没有权限访问则(返回)渲染这个组件
 */
const authorize = (authority: string, error?: React.ReactNode) => {
  /**
   * conversion into a class
   * 防止传入字符串时找不到staticContext造成报错
   * String parameters can cause staticContext not found error
   */
  let classError: boolean | React.FunctionComponent = false;
  if (error) {
    classError = (() => error) as React.FunctionComponent;
  }
  if (!authority) {
    throw new Error('authority is required');
  }
  return function decideAuthority(target: React.ComponentClass | React.ReactNode) {
    const component = CheckPermissions(authority, target, classError || Exception403);
    return checkIsInstantiation(component);
  };
};

export default authorize;
