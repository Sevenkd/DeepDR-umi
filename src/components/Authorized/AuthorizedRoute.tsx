/**
 * 感觉是对路由权限的管理
 * 外层就是 Authorized 组件, 里层 children 其实就是一个Route
 * noMatch 也改成了 Redirect
 * 相当于如果无权限访问该路径, 则跳转到报错路径
 */
import { Redirect, Route } from 'umi';

import React from 'react';
import Authorized from './Authorized';
import { IAuthorityType } from './CheckPermissions';

interface AuthorizedRouteProps {
  currentAuthority: string;
  component: React.ComponentClass<any, any>;
  render: (props: any) => React.ReactNode;
  redirectPath: string;
  authority: IAuthorityType;
}

/**
 * 对用户的路径进行权限判断, 返回一个Authorized权限组件
 * 返回的Authorized权限组件对一个Route组件进行的封装, 如果用户有权限则继续访问目标路径
 * 没有权限则Redirect跳转到报错路径
 */
const AuthorizedRoute: React.FC<AuthorizedRouteProps> = ({
  component: Component,
  render,
  authority,
  redirectPath,
  ...rest
}) => (
  <Authorized authority={authority} noMatch={<Route {...rest} render={() => <Redirect to={{ pathname: redirectPath }} />} />} >
    <Route {...rest} render={(props: any) => (Component ? <Component {...props} /> : render(props))} />
  </Authorized>
);

export default AuthorizedRoute;
