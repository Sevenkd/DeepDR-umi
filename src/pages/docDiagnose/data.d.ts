import { UserModelState, RecordDiagnoseModelState } from '@/models/connect'

/**
 * 医生诊断页面的状态
 */
export interface DocDiagnoseState {
  isReady: boolean,
  patientInfo: {
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
  osImages: string[],
  odImages: string[],
  typicalImg: { os: string, od: string },
  osDiagnoseStr: string,
  odDiagnoseStr: string,
  diagnosticOpinion: string,
  osDict:{
    stage: number,
    regression: boolean,
    zone: number,
    plus: number,
    other: string[]
  } | null,
  odDict: {
    stage: number,
    regression: boolean,
    zone: number,
    plus: number,
    other: string[]
  } | null,
}

export interface DocDiagnoseProps { currentUser: UserModelState, recordInfo: RecordDiagnoseModelState }


/**
 * 病人信息格式
 */
export interface PatientinfoType {
  patientNum: string,
  patientName: string,
  gender: string,
  birthDay: string,
  birthWay: string,
  gestationAge: string,
  birthWeight: string,
  checkAge: string
}
/**
 * 病人信息模块的props
 */
export interface PatientInfoProps { patientinfo: PatientinfoType }



/**
 * 医生选择诊断模板时的语句对照模板
 */
export const stageStr = {
  1: "ROP1期",
  2: "ROP2期",
  3: "ROP3期",
  4: "ROP4期",
  5: "ROP5期",
}
export const zoneStr = {
  0: "",
  1: "一区",
  2: "二区",
  3: "三区",
}
export const plusStr = {
  0: "",
  1: "前PLUS",
  2: "PLUS",
}
// 分期正常的情况下也有可能发生PLUS改变
export const stage_0PlusStr = {
  0: "",
  1: "未见明显ROP异常, 伴随前PLUS改变",
  2: "未见明显ROP异常, 伴随PLUS改变",
}
export const diseaseStr = {
  '无异常': '无异常', 
  '出血': '眼底出血', 
  '未完全血管化': '眼底未完全血管化', 
  'FEVR': 'FEVR综合征', 
  '牵牛花综合症': '牵牛花综合症', 
  '先天性视网膜劈裂': '先天性视网膜劈裂', 
  '视网膜母细胞瘤': '视网膜母细胞瘤', 
  '白色点状病灶': '眼底具有白色点状病灶',
}

export const adviceStrDict = {
  0: "未见明显异常，建议2-3周复查",
  1: "轻度ROP：建议2周复查",
  2: "建议长期眼科随诊",
  3: "重度ROP：建议立即到小儿眼底病医生处就诊",
  4: "建议终止ROP眼底随访，但应由眼底病医师确认。长期应注意患儿可能出现斜视，弱视，近视等情况。",

} 