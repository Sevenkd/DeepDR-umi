/**
 * 用户权限管理
 */
import RenderAuthorize from '@/components/Authorized';
import { getAuthority } from './authority';

/**
 * RenderAuthorize是@/component/Authorized中定义的权限封装组件
 * 
 * 接受用户的当前权限作为输入, 返回一个封装了用户权限的React模块, 每次会根据用户的当前权限渲染对应的模块
 */
let Authorized = RenderAuthorize(getAuthority());

/**
 * 此处应该是比如用户重新登录后重新来注册用户权限?
 */
const reloadAuthorized = (): void => {
  Authorized = RenderAuthorize(getAuthority());
};

/**
 * hard code
 * block need it。
 * 
 * 没看懂..
 */
window.reloadAuthorized = reloadAuthorized;

export { reloadAuthorized };
export default Authorized;
