import React from 'react';
import { Result } from 'antd';
import check, { IAuthorityType } from './CheckPermissions';

import AuthorizedRoute from './AuthorizedRoute';
import Secured from './Secured';


/**
 * Authorized组件的props
 */
interface AuthorizedProps {
  authority: IAuthorityType; // 用户权限
  noMatch?: React.ReactNode; // 异常报错组件
}
/**
 * 对Authorized组件的props进行了扩充?
 */
type IAuthorizedType = React.FunctionComponent<AuthorizedProps> & {
  Secured: typeof Secured;
  check: typeof check; // 进行权限检验的函数
  AuthorizedRoute: typeof AuthorizedRoute;
};
/**
 * Authorized是一个React 组件(component)
 * 其对正常的业务逻辑组件进行了一层权限封装
 * 在用户访问时对用户权限进行检测, 如果用户无权访问则返回异常报警组件(noMatch)
 * 
 * @param { 子组件, 或者说用户将要访问的组件, 需要进行权限验证的组件 } children 
 * @param { 组件的访问权限 } authority 
 * @param { 当无权访问的时候渲染的报警组件 } noMatch 
 */
const Authorized: React.FC<AuthorizedProps> = ({
  children,
  authority,
  noMatch = ( <Result status="403" title="403" subTitle="抱歉, 您没有权限访问此页面!" /> ),
}) => {
  const childrenRender: React.ReactNode = typeof children === 'undefined' ? null : children;
  const dom = check(authority, childrenRender, noMatch);
  return <>{dom}</>;
};


export default Authorized as IAuthorizedType;
