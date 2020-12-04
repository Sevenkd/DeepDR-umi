import { Reducer, Effect } from 'umi';
import { queryRecordInfo } from '@/services/recordDiagnose';


/**
 * RecordDiagnoseModelState, 病例诊断是需要的相关信息
 * 
 * uplaodID: 病例ID
 * patientInfo: 病人信息
 * osImages: 左眼图像列表
 * odImages: 右眼图像列表
 * typicalImg: 代表性图像
 * osDiagnoseStr: 左眼诊断结论
 * odDiagnoseStr: 右眼诊断结论
 * diagnosticOpinion: 医生诊断意见
 * osDict: 左眼标注
 * odDict: 右眼标注
 */
export interface RecordDiagnoseModelState {
  uploadID: string,
  patientInfo?: {
    patientNum: string,
    patientName: string,
    gender: string,
    gestationAge: string,
    birthDay: string,
    birthWeight: string,
    birthWay: string,
    checkTime: string,
    checkAge: string,
  },
  osImages?: string[],
  odImages?: string[],
  typicalImg?: { os: string, od: string },
  osDiagnoseStr?: string,
  odDiagnoseStr?: string,
  diagnosticOpinion?: string,
  osDict?:{
    stage: number,
    regression: boolean,
    zone: number,
    plus: number,
    other: string[]
  } | null,
  odDict?: {
    stage: number,
    regression: boolean,
    zone: number,
    plus: number,
    other: string[]
  } | null,
}

/**
 * RecordDiagnose Model 的结构
 */
export interface RecordDiagnoseModelType {
namespace: string;

state: RecordDiagnoseModelState;

effects: {
  fetchRecord: Effect,
};

reducers: {
  saveRecordInfo: Reducer<RecordDiagnoseModelState>;
  setTypicalID: Reducer<RecordDiagnoseModelState>;
  setAdvice: Reducer<RecordDiagnoseModelState>;
  setDiagnoseStr: Reducer<RecordDiagnoseModelState>;
  setDiagnoseDict: Reducer<RecordDiagnoseModelState>;
  clearRecord : Reducer<RecordDiagnoseModelState>;
};
}

/**
 * 用户登录过程中相关状态的变化
 */
const RecordDiagnoseInfoModel: RecordDiagnoseModelType = {
namespace: 'recordDiagnoseInfo',

state: {
  uploadID: "-1",
},

effects: {
  *fetchRecord({ payload }, { call, put }) {

    console.log("fetchRecord", payload);
    const uploadID = payload.uploadID;

    const response = yield call(queryRecordInfo, payload); // 异步向服务器发送登录请求
    if (response.res == 'success'){
      yield put({ type: 'saveRecordInfo', payload: {...response.recordInfo, uploadID: uploadID}, }); // 收到回复后更新登录状态
    }
    else{
      // TODO 获取病例失败, 重定向页面
    }
    return response;
  },
},

reducers: {
  // 从后台获取病例信息后将数据保存在本地
  saveRecordInfo(_, { payload }) {
    return { ...payload };
  },

  setTypicalID(state, { payload }){
    return { ...state, ...payload };
  },

  setAdvice(state, { payload }){
    return { ...state, ...payload };
  },

  setDiagnoseStr(state, { payload }){
    const newState = payload.eyeType === "OS" ? {...state, osDiagnoseStr: payload.diagnoseStr}:{...state, odDiagnoseStr: payload.diagnoseStr}
    return newState;
  },

  setDiagnoseDict(state, { payload }){
    const newState = payload.eyeType === "OS" ? {...state, osDict: payload.diagnoseDict}:{...state, odDict: payload.diagnoseDict}
    return newState;
  },

  clearRecord(){
    return { uploadID: "-1" };
  },

},
};

export default RecordDiagnoseInfoModel;
