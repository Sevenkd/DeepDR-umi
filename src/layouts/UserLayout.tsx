/**
 * 用户layout, 主要是用户登录页面的总体布局
 */
import { DefaultFooter, MenuDataItem, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, SelectLang, useIntl, ConnectProps, connect, FormattedMessage } from 'umi';
import React from 'react';
import { ConnectState } from '@/models/connect';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';

export interface UserLayoutProps extends Partial<ConnectProps> {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
}

const UserLayout: React.FC<UserLayoutProps> = (props) => {
  const { route={routes: []} } = props;
  const { routes=[] } = route;
  const { children, location={pathname: ''} } = props;

  const { formatMessage } = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({ pathname: location.pathname, formatMessage, breadcrumb, ...props, });

  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        {/* 
        TODO: 语言选择
        <div className={styles.lang}>
          <SelectLang />
        </div> 
        */}
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to={'/user/login'}>
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>Deep ROP | 登录</span>
              </Link>
            </div>
            <div className={styles.desc}>
              <FormattedMessage id="pages.layouts.userLayout.title" defaultMessage="Deep ROP新生儿眼底智能诊断平台" />
            </div>
          </div>
          
          {children}

        </div>
        <DefaultFooter links={[]} copyright={`${new Date().getFullYear()} 四川大学机器智能实验室`} />
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(UserLayout);
