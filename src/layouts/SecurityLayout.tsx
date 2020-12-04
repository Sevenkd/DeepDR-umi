/**
 * 系统入口Layout
 * 
 * 判断页面是否完成加载, 判断用户是否登录等
 */
import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect, connect, ConnectProps } from 'umi';
import { stringify } from 'querystring';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';

import 'react-image-lightbox/style.css'; // 灯箱插件样式 This only needs to be imported once in your app

/**
 * SecurityLayout传入的props
 */
interface SecurityLayoutProps extends ConnectProps {
  loading?: boolean;
  currentUser?: CurrentUser;
}
/**
 * SecurityLayout自身的states
 */
interface SecurityLayoutState {
  isReady: boolean;
}

/**
 * isReady: 页面是否加载完成, 页面加载完成后才进行接下来的操作, 初始化为false
 * currentUser: model.user.currentUser, 当前用户信息, 如果没有登录则为{}
 * loading: model.loading.model.user, 是否正在登录当中?
 */
class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {

  state: SecurityLayoutState = { isReady: false, };

  /**
   * 页面加载完成, 请求用户登录
   */
  componentDidMount() {
    this.setState({ isReady: true, });

    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({ type: 'user/fetchCurrent', });
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, currentUser } = this.props;

    if (!currentUser || !isReady || currentUser.loginCode === "-1") {
      return <PageLoading />;
    }

    // 如果用户没有登录, 跳转到登录页面, 并保存用户当前访问的路径
    if ( (currentUser && currentUser.loginCode === null) && window.location.pathname !== '/user/login') {
      const queryString = stringify({
        redirect: window.location.href,
      });
      console.log(queryString);
      return <Redirect to={`/user/login?${queryString}`} />;
    }

    return children;
  }
}

export default connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
