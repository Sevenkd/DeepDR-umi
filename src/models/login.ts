import { history, Reducer, Effect } from 'umi';
import { loginUser, logOutUser } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';
import { localStorageSet } from '@/utils/utils';

/**
 * LoginStateType, 用户登录的状态
 * 
 * res: 表示用户登录成功或失败, null表示还没有登录过, lated表示登录过期, 需重新登录
 * status: 用户登录的结果码, 如果登录成功则返回success, 否则返回标识失败原因的状态string
 * message: 如果登录失败, 后台返回的描述失败原因的文字
 */
export interface LoginStateType {
  res: 'success' | 'error' | 'lated' | 'null';
  status?: string;
  message: string | null;
}

/**
 * Login model的结构
 */
export interface LoginModelType {
  namespace: string;

  state: LoginStateType;

  effects: {
    login: Effect;
    logout: Effect;
  };

  reducers: {
    changeLoginStatus: Reducer<LoginStateType>;
  };
}

/**
 * 用户登录过程中相关状态的变化
 */
const Model: LoginModelType = {
  namespace: 'login',

  state: {
    res: 'null',
    message: null
  },

  effects: {

    /**
     * 实现向后台提交用户登录请求, 并解析结果后页面重定向的功能
     */
    *login({ payload }, { call, put }) {

      const response = yield call(loginUser, payload); // 异步向服务器发送登录请求
      yield put({ type: 'changeLoginStatus', payload: response, }); // 收到回复后更新登录状态

      // 登录成功
      if (response.res === 'success') {
        // 用户登录时将loginCode保存在localStorage中, 刷新页面时可用从localStorage中找到当前用户
        localStorageSet("loginCode", response.loginCode);

        yield put({ type: 'user/saveUserInfo', payload: { loginCode: response.loginCode }, }); // 登录成功后在model中保存用户信息
        message.success('🎉 🎉 🎉  登录成功！'); // 显示登录成功的消息

        // 实现页面跳转
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        // 下边这段把windoow.location.href解析处理pathname
        // TODO 重新这段或者把这部分代码提出来, 做成utils
        // 重定向的方法要全局统一
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect || '/');
      }
    },

    /**
     * 向后台提交退出登录的请求
     * 请求成功后清空localstorage并跳转到登录页面
     */
    *logout({ payload }, { call, put }) {
      const response = yield call(logOutUser, payload); // 异步向服务器发送登录请求
      if (response.res === 'success') {
        yield put({ type: 'user/deleteUserInfo', }); // 收到回复后更新登录状态

        message.success("您已经退出登录");
        history.replace({ pathname: '/user/login', });
      }
    },
  },

  reducers: {
    /**
     * 用户登录的过程状态, 如未登录, 正在登录, 登录完成, 成功/失败, 登录失败信息等
     * 最初设计的时候没有考虑太多, 后续有机会最好把登录的逻辑再完善一下, 更好的利用起来dva model的逻辑
     */
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.role);
      const message = payload.res === "error" ? payload.message: null;
      return {
        ...state,
        res: payload.res,
        status: payload.status,
        message: message,
      };
    },
  },
};

export default Model;
