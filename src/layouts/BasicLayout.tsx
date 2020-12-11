/**
 * 页面最基本的布局
 * 
 * 这里渲染了基本的header, 菜单等全局内容
 * 从@/utils/Authorized获取了权限封装模块, 并在这里对路径和组件的权限进行了封装, 从而实现了权限管理?
 * 
 * TODO: 权限管理
 */
import ProLayout, { MenuDataItem, BasicLayoutProps as ProLayoutProps, Settings, DefaultFooter, } from '@ant-design/pro-layout';
import React, { useMemo, useRef } from 'react';
import { Link, useIntl, connect, Dispatch, history } from 'umi';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import { getMatchMenu } from '@umijs/route-utils';
import logo from '../assets/logo.svg';


/**
 * 用户无权限访问时渲染的模块
 */
const noMatch = ( <Result status={403} title="403" subTitle="抱歉, 您无权限访问此页面!" extra={ <Button type="primary"> <Link to="/user/login">用户登录</Link> </Button> }/> );

/**
 * 面包屑?
 */
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & { breadcrumbNameMap: { [path: string]: MenuDataItem; }; };

/**
 * 渲染每个菜单选项, 为菜单选项绑定访问权限
 * 迭代地调用menuDataRender函数, 对菜单Item的每一个子项绑定权限
 */
const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>{
  return menuList.map((item) => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : undefined, };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });
};

/**
 * Footer
 */
const defaultFooterDom = ( <DefaultFooter links={[]} copyright={`${new Date().getFullYear()} 四川大学机器智能实验室`} /> );

/**
 * 主业务界面的基本布局
 * 包括左侧菜单栏, 标题和面包屑, 右上角用户菜单等
 */
export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: { [path: string]: MenuDataItem; };
  route: ProLayoutProps['route'] & { authority: string[]; };
  settings: Settings;
  dispatch: Dispatch;
}
const BasicLayout: React.FC<BasicLayoutProps> = (props) => {

  const { dispatch, children, settings, location = { pathname: '/', }, } = props;

  // 菜单项引用列表
  const menuDataRef = useRef<MenuDataItem[]>([]); 
  /**
   * 左侧菜单折叠收起操作
   */
  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };
  /**
   * 获取子组件的访问权限?
   */
  const authorized = useMemo( 
    () => getMatchMenu(location.pathname || '/', menuDataRef.current).pop() || { authority: undefined, },
    [location.pathname], 
    );
  /**
   * 格式化字符串
   */
  const { formatMessage } = useIntl();


  console.log("BasicLayout render");
  console.log("logo", logo);

  
  return (
    <ProLayout
      logo={logo}
      formatMessage={formatMessage}
      onCollapse={handleMenuCollapse} //菜单收起选项
      breakpoint={false}
      onMenuHeaderClick={() => history.push('/')}

      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || !menuItemProps.path) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}

      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({ id: 'menu.home' }),
        },
        ...routers,
      ]}

      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}

      footerRender={() => defaultFooterDom}

      menuDataRender={menuDataRender}

      rightContentRender={() => <RightContent />} // 全局Header右侧用户菜单

      postMenuData={(menuData) => {
        menuDataRef.current = menuData || [];
        return menuData || [];
      }}

      {...props}
      {...settings}
    >
      
      <Authorized authority={authorized!.authority} noMatch={noMatch}>
        {children}
      </Authorized>

    </ProLayout>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
