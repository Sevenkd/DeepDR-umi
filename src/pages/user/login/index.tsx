import { LockTwoTone, UserOutlined } from '@ant-design/icons';
import { Alert } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { connect, Dispatch, useIntl, FormattedMessage } from 'umi';
import { LoginStateType } from '@/models/login';
import { LoginParamsType } from '@/services/login';
import { ConnectState } from '@/models/connect';

import styles from './index.less';


/**
 * 登录页面的消息提示框
 * 
 * @param content: 消息内容
 */
interface LoginMessageProps {content: string|null;}
const LoginMessage: React.FC<LoginMessageProps> = (props) => {
  const { content } = props;
  return (
    <Alert
    style={{ marginBottom: 24, }}
    message={content}
    type="error"
    showIcon
  />
  );
};


/**
 * Login: 用户登录功能框
 * 
 * userLoginStates: 用户登录中的过程状态
 * submitting: 是否正在与后台交互
 */
interface LoginProps {
  dispatch: Dispatch;
  userLoginStates: LoginStateType;
  submitting?: boolean;
}
const Login: React.FC<LoginProps> = (props) => {
  const { userLoginStates = {res: 'null', message: null}, submitting } = props;
  const intl = useIntl();

  /**
   * 用户点击提交, 发起login action
   * 
   * @param values: 登录参数(用户名和密码)
   */
  const handleLogin = (values: LoginParamsType) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values },
    });
  };

  return (
    <div className={styles.main}>
      <ProForm
        submitter={{
          render: (_, dom) => dom.pop(), // antd form默认有两个按钮(重置和提交), 我们只想要提交按钮, 所以把重置按钮pop出去
          submitButtonProps: {
            loading: submitting,
            size: 'large',
            style: {
              width: '100%',
            },
          },
        }}
        onFinish={async (values) => { handleLogin(values); }}
      >

        {userLoginStates.res === 'error' && !submitting && (
          <LoginMessage content={userLoginStates.message} />
        )}

        <ProFormText
          name="username"
          fieldProps={{ size: 'large', prefix: <UserOutlined className={styles.prefixIcon} />, }}
          placeholder={intl.formatMessage({ id: 'pages.login.username.placeholder', defaultMessage: '用户名', })}
          rules={[{ required: true, message: ( <FormattedMessage id="pages.login.username.required" defaultMessage="请输入用户名!" /> ), }]}
        />

        <ProFormText.Password
          name="password"
          fieldProps={{ size: 'large', prefix: <LockTwoTone className={styles.prefixIcon} />, }}
          placeholder={intl.formatMessage({ id: 'pages.login.password.placeholder', defaultMessage: '密码', })}
          rules={[{ required: true, message: ( <FormattedMessage id="pages.login.password.required" defaultMessage="请输入密码！" /> ), }]}
        />

      </ProForm>

    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLoginStates: login,
  submitting: loading.effects['login/login'],
}))(Login);
