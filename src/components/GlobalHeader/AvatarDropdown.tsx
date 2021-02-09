import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React from 'react';
import { ConnectProps, connect } from 'umi';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export interface GlobalHeaderRightProps extends Partial<ConnectProps> {
  currentUser?: CurrentUser;
}

/**
 * 主页右上角下来菜单
 * 主要用来显示用户信息
 * 目前只有一个退出登录
 * TODO 完善用户登录功能
 */
class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {

  /**
   * 菜单点击事件处理
   */
  onMenuClick = (event: { key: React.Key; keyPath: React.Key[]; item: React.ReactInstance; domEvent: React.MouseEvent<HTMLElement>; }) => {
    const { key } = event;
    switch (key) {
      case 'logout':
        const { dispatch, currentUser } = this.props;
        if (dispatch) {
          dispatch({ type: 'login/logout', payload:{login_code: currentUser.loginCode} });
        }
        break;
      default:
        break;
    }
    return;
  };

  render(): React.ReactNode {

    const { currentUser = { doctorName: '测试人员', }, } = this.props;

    const menuHeaderDropdown = (
      <Menu className={styles.menu} onClick={this.onMenuClick}>
        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    );

    const welcomeStr = currentUser.doctorName ? '欢迎您: ' + currentUser.doctorName : "";
    const avatar = (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} icon={<UserOutlined />} />
          <span className={`${styles.name} anticon`}>{welcomeStr}</span>
        </span>
      </HeaderDropdown>
    );

    const avatarLoading = (
      <span className={`${styles.action} ${styles.account}`}>
        <Spin size="small" style={{ marginLeft: 8, marginRight: 8, }} />
      </span>
    );

    return currentUser && currentUser.doctorName ? avatar : avatarLoading;
  }
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
