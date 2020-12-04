import { MenuDataItem, Settings as ProSettings } from '@ant-design/pro-layout';
import { GlobalModelState } from './global';
import { UserModelState } from './user';
import { StateType } from './login';
import { RecordDiagnoseModelType, RecordDiagnoseModelState } from './recordDiagnose';


export { GlobalModelState, UserModelState, RecordDiagnoseModelState };

/**
 * 组件加载状态
 * by dva-loading组件
 */
export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
    recordDiagnoseInfo? : boolean
  };
}

/**
 * 项目中所以用到的全局状态
 */
export interface ConnectState {
  global: GlobalModelState;
  loading: Loading;
  settings: ProSettings;
  user: UserModelState;
  login: StateType;
  recordDiagnoseInfo: RecordDiagnoseModelState; 
}


export interface Route extends MenuDataItem {
  routes?: Route[];
}
