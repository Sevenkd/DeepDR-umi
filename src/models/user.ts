import { Effect, Reducer } from 'umi';

import { fetchUserByLoginCode } from '@/services/user';
import { localStorageGet } from '@/utils/utils'

/**
 * 前端保存的用户信息
 */
interface CurrentUser {
  loginCode: string | null;
  doctorName?: string;
  hospitalId?: number;
  hospitalName?: string;
  role?: string;
  [otherKey: string]: any;
}

/**
 * dva 用户model保存的字段
 */
export interface UserModelState {
  currentUser: CurrentUser;
}

/**
 * UserModel的结构
 */
interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchCurrent: Effect;
  };
  reducers: {
    saveUserInfo: Reducer<UserModelState>;
    deleteUserInfo: Reducer;
  };
}

/**
 * UserModel
 * 用户相关的数据流
 */
const UserModel: UserModelType = {
  namespace: 'user',

  /**
     * loginCode === null : 没有登录, 需要跳转到登录页面
     * loginCode === "-1" : 初始状态, 正在查询登录信息
     * loginCode === other : 用户已经登录
     */
  state: {
    currentUser: { loginCode: "-1" }, 
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const loginCode = localStorageGet("loginCode");
      if (loginCode !== null) { // 如果localStorage中保存了loginCode, 那么接下来通过loginCode查询用户信息
        const response = yield call(fetchUserByLoginCode, { login_code: loginCode }); // 异步向服务器发送登录请求
        if (response.res === "success"){
          yield put({ type: 'saveUserInfo', payload: { ...response, loginCode: loginCode } });
          return;
        }
      }
      /**
       * localStorage中没有保存loginCode, 或者loginCode错误, 都会到这一步
       * 将localStorage设置为null, 父组件将跳转到登录页面
       */
      yield put({ type: 'deleteUserInfo' });
    }
  },

  reducers: {

    // 用户登录后保存用户信息
    saveUserInfo(state, action) {
      const payload = action.payload;
      const currentUser = {
        loginCode: payload.loginCode,
        doctorName: payload.doctorName,
        hospitalEName: payload.hospitalEName,
        role: payload.role,
      }
      return { ...state, currentUser: currentUser };
    },

    // 用户退出登录时清空用户信息
    deleteUserInfo() {
      localStorage.removeItem("loginCode");
      return { currentUser: { loginCode: null } };
    },

  },
};

export default UserModel;
export { CurrentUser, UserModelType };
