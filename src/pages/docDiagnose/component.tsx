/**
 * @/pages/docDiagnose/component
 * 医生诊断页面用到的一些组件
 */

import { Descriptions, Row, Input, Modal, Button, Radio, Checkbox } from 'antd';
import React, { useState, useEffect, Dispatch } from 'react';
import { PatientInfoProps, stageStr, zoneStr, plusStr, stage_0PlusStr, diseaseStr, adviceStrDict} from './data.d';
import { FundusLightBox } from '@/components/FundusImages';
import { getFundusImgURL } from '@/utils/srcUrls';


/**
 * 病人基本信息显示模块
 */
export const PatientInfo: React.FC<PatientInfoProps> = (props:PatientInfoProps) => {
  const { patientinfo } = props;
  return(
    <Descriptions column={4} title="患者信息" style={{ marginBottom: 32 }}>
      <Descriptions.Item label="编号">{patientinfo.patientNum}</Descriptions.Item>
      <Descriptions.Item label="婴儿姓名">{patientinfo.patientName}</Descriptions.Item>
      <Descriptions.Item label="婴儿性别">{patientinfo.gender}</Descriptions.Item>
      <Descriptions.Item label="出生日期">{patientinfo.birthDay}</Descriptions.Item>
      <Descriptions.Item label="出生方式">{patientinfo.birthWay ? patientinfo.birthWay : "未知"}</Descriptions.Item>
      <Descriptions.Item label="孕周">{patientinfo.gestationAge}</Descriptions.Item>
      <Descriptions.Item label="出生体重">{patientinfo.birthWeight}g</Descriptions.Item>
      <Descriptions.Item label="检查年龄">{patientinfo.checkAge}天</Descriptions.Item>
    </Descriptions>
  );
}

/**
 * 眼底图像显示模块
 */
interface FundusImagesBoxProps { typicalID: string, imageIDs: string[], loginCode: string, setTypical:(id:string)=>void }
export const FundusImagesBox: React.FC<FundusImagesBoxProps> = (props) => {
  const {typicalID, imageIDs, loginCode, setTypical} = props;

  const [ boxOpen, setBoxOpen ] = useState<boolean>(false);

  const imgList: string[] = imageIDs.map( (imgID:string) => getFundusImgURL(loginCode, imgID) );
  const tpicalImg: string = getFundusImgURL(loginCode, typicalID)

  const setTypicalID = (index:number) => { setTypical(imageIDs[index]) }

  return (
    <div>
      <img style={ {width:"100%"} } src={tpicalImg} onClick={()=> {setBoxOpen(true)}}  />
      <FundusLightBox isOpen={boxOpen} setOpen={setBoxOpen} images={imgList} stopOnEdge={true} ifSetTypicalImg={true} setTypicalID={setTypicalID} />
    </div>
  );
};


/**
 * 医生对单眼诊断时的选择模板
 */
interface EyeDiagnoseModelProps { 
  isOpen: boolean, 
  setOpen: (isOpen: boolean)=>void, 
  diagnoseDict: object, 
  setDiagnoseDict: (diagnoseDict:object)=>void,
  diagnoseStr: string, 
  setDiagnoseStr: (diagnoseStr:string)=>void,
}
const EyeDiagnoseModel: React.FC<EyeDiagnoseModelProps> = (props:EyeDiagnoseModelProps) => {
  const CheckboxGroup = Checkbox.Group;
  const { TextArea } = Input;

  const { isOpen=false, setOpen } = props; // 控制组件显示的开关
  const { diagnoseDict={}, setDiagnoseDict } = props; // 医生诊断标注
  const { diagnoseStr="", setDiagnoseStr } = props; // 医生诊断字符串

  const [ stage, setStage ] = useState<number>(diagnoseDict.stage ? diagnoseDict.stage : 0); // 分期
  const [ regression, setRegression ] = useState<boolean>(diagnoseDict.regression ? diagnoseDict.regression : false) // 退行
  const [ zone, setZone ] = useState<number>(diagnoseDict.zone ? diagnoseDict.zone : 0); // 分区
  const [ plus, setPlus ] = useState(diagnoseDict.plus ? diagnoseDict.plus : 0); // plus
  const [ otherDiagnoseCheckedList, setOtherDiagnoseList ] = useState<string[]>(diagnoseDict.other ? diagnoseDict.other : ['无异常']); // 其他异常病变
  // 组件内部的诊断字符串变量和外部不同, 只有点击确认后才会更新到外界, 方便用户取消操作
  const [ _diagnoseStr, _setDiagnoseStr ] = useState<string>(diagnoseStr); // 显示在诊断报告上的字符串

  /**
   * 将医生诊断的选项转换成字符串显示在诊断报告中
   * 
   * 字符串生成的逻辑分成两部分, ROP部分和其他病变部分:
   *  先写ROP部分, 分期, 分区, plus
   *  之后在后边补充其他病变的内容
   */
  const generateDiagnoseStr = ():string => {
    // 正常情况
    if ( stage === 0 && plus === 0 && otherDiagnoseCheckedList[0] === '无异常') { return "无异常"; }

    // ROP部分描述文本
    let ropStr = ""
    if ( stage === 0 ) { ropStr = stage_0PlusStr[plus] } // 分期正常的情况下也有可能发生PLUS改变
    else if ( stage === 6 ) { ropStr = "急进型后极部ROP"; }
    else { ropStr = stageStr[stage] + (regression ? "（退行期）" : "") + zoneStr[zone] + (plus === 0 ? "" : "，"+plusStr[plus]); } 

    // 其他病变部分
    let otherDisease = ""
    if (otherDiagnoseCheckedList[0] === '无异常') { return ropStr; } // 如果没有其他病变, 只返回ROP相关的描述
    else { 
      const diseaseStrList = otherDiagnoseCheckedList.map((item:string)=>diseaseStr[item]);
      otherDisease = diseaseStrList.join("，");
    }

    // 组合诊断语句
    const finalStr = ropStr === "" ? otherDisease : ropStr + "，" + otherDisease;
    return finalStr;
  }

  // while states updates
  useEffect( ()=> { _setDiagnoseStr(generateDiagnoseStr()); }, [stage, regression, zone, plus, otherDiagnoseCheckedList]);

  /**
   * 分期选择器
   */
  const StageSelector = () => {
    const onChangeStage = (e) => {
      const stageChecked = e.target.value;
      // 当分期被选中为正常的时候, 退行应当无法被选中, 分区应该也是正常
      if (stageChecked === 0) {
        setRegression(false);
        setZone(0);
      }
      setStage(stageChecked);
    };

    return (
      <>
        <Radio.Group onChange={ onChangeStage } value={stage}>
        <Radio value={0}>正常</Radio>
        <Radio value={1}>一期</Radio>
        <Radio value={2}>二期</Radio>
        <Radio value={3}>三期</Radio>
        <Radio value={4}>四期</Radio>
        <Radio value={5}>五期</Radio>
        <Radio value={6}>APROP</Radio>
      </Radio.Group>
      <br />
      <br />
      <CheckboxGroup disabled={stage === 0} options={["退行期"]} value={regression ? ["退行期"] : []} onChange={() => {setRegression(!regression)}} />
      </>
      
    );
  };

  /**
   * 分区选择器
   */
  const ZoneSelector = () => {

    return (
      <Radio.Group onChange={ (e) => { setZone(e.target.value) } } value={zone}>
        <Radio value={0}>正常</Radio>
        <Radio value={1}>一区</Radio>
        <Radio value={2}>二区</Radio>
        <Radio value={3}>三区</Radio>
      </Radio.Group>
    );
  };

  /**
   * Plus选择器
   */
  const PlusSelector = () => {

    return (
      <Radio.Group onChange={ (e) => { setPlus(e.target.value); } } value={plus}>
        <Radio value={0}>无plus</Radio>
        <Radio value={1}>Pre Plus</Radio>
        <Radio value={2}>Plus</Radio>
      </Radio.Group>
    );
  };

  /**
   * 其他病变选择器
   */
  const OtherDiagnoseSelector = () => {
    const otherDiagnoseOptions = ['无异常', '出血', '未完全血管化', 'FEVR', '牵牛花综合症', '先天性视网膜劈裂', '视网膜母细胞瘤', '白色点状病灶', ];

    /**
     * 医生选择诊断选项
     * 这里要实现正常和病变互斥的功能, 即当用户选择正常时, 自动取消选择其他选项
     * 当用户选择其他病变时, 自动取消选择正常
     * 
     * @param { string[] } newList 医生当前选择的诊断内容 
     */
    const onChooseDiagnose = (newList: string[]) => {
      // 如果啥都没选, 那么默认为无异常
      if ( newList.length === 0 ) { setOtherDiagnoseList(['无异常']); return; } 

      // 如果用户取消选择某个诊断, 此时不涉及互斥问题, 直接返回新选项列表
      if (newList.length < otherDiagnoseCheckedList.length) { 
        setOtherDiagnoseList(newList);
        return;
      }

      // 用户新增一个选项标签, 检查互斥
      const newValue = newList.filter( (item) => otherDiagnoseCheckedList.indexOf(item) === -1 );

      // 如果用户新选中正常选项, 而旧列表中有值, 说明一起选中过病变选项, 取消其他选项, 只保留正常选项
      if (newValue[0] === '无异常' && otherDiagnoseCheckedList.length > 0) {
        setOtherDiagnoseList(['无异常']);
        return;
      }
      // 如果新选项是异常, 但旧列表中包含正常选项, 则去掉正常选项, 只保留异常项
      else if (newValue[0] != '无异常' && otherDiagnoseCheckedList.indexOf('无异常') != -1) {
        newList.splice(otherDiagnoseCheckedList.indexOf('无异常'), 1);
        setOtherDiagnoseList(newList);
        return;
      }
      // 其他情况说明都是异常选项, 正常添加内容即可
      else {
        setOtherDiagnoseList(newList);
      }
    };

    return <CheckboxGroup options={otherDiagnoseOptions} value={otherDiagnoseCheckedList} onChange={onChooseDiagnose} />;
  };

  /**
   * 点击确认按钮后将诊断结果提交给上层组件
   */
  const confirmDiagnose = () => {
    setDiagnoseDict({
      stage: stage,
      regression: regression,
      zone: zone,
      plus: plus,
      otherDiagnoseCheckedList: otherDiagnoseCheckedList
    });
    setDiagnoseStr(_diagnoseStr);
    setOpen(false)
  }

  return (
    <Modal
        title="诊断模板"
        centered
        width={700}
        visible={isOpen}
        mask={false}
        onOk={ confirmDiagnose }
        onCancel={() => setOpen(false)}
      >
        <p>分期</p>
        <StageSelector />
        <br />
        <br />
        <p>分区</p>
        <ZoneSelector />
        <br />
        <br />
        <p>PLUS</p>
        <PlusSelector />
        <br />
        <br />
        <p>其他病变</p>
        <OtherDiagnoseSelector />
        <br />
        <br />
        <TextArea value={_diagnoseStr} rows={4} onChange={ (e)=>( _setDiagnoseStr(e.target.value) ) } onPressEnter={ (e) => (e.preventDefault()) } />
      </Modal>
  );


}


/**
 * OS/OD诊断(具体病变)模块
 */
interface EyeDiagnoseProps { eyeType: string, diagnoseDict: object, diagnoseStr: string, dispatch: Dispatch<any> }
export const EyeDiagnose: React.FC<EyeDiagnoseProps> = (props: EyeDiagnoseProps) => {
  const { TextArea } = Input;

  const [ isOpen, setOpen ] = useState(false); // 控制组件的开关

  // const [ diagnoseStr, setDiagnoseStr ] = useState<string>('无异常'); // 显示在诊断报告上的字符串
  const { eyeType, diagnoseDict, diagnoseStr, dispatch } = props;

  // 修改诊断意见字符串
  const setDiagnoseStr = (diagnoseStr:string) => {
    dispatch({
      type: "recordDiagnoseInfo/setDiagnoseStr",
      payload: {diagnoseStr: diagnoseStr, eyeType: eyeType}
    });
  };

  // 修改诊断标注
  const setDiagnoseDict = (diagnoseDict: object) => {
    dispatch({
      type: "recordDiagnoseInfo/setDiagnoseDict",
      payload: {diagnoseDict: diagnoseDict, eyeType: eyeType}
    });
  };

  return (
    <>
      <TextArea value={diagnoseStr} rows={4} onChange={ (e)=>( setDiagnoseStr(e.target.value) ) } onPressEnter={ (e) => (e.preventDefault()) } />
      <Button type="primary" onClick={() => setOpen(true)}> 选择诊断模板 </Button>
      <EyeDiagnoseModel isOpen={isOpen} setOpen={setOpen} diagnoseDict={diagnoseDict} diagnoseStr={diagnoseStr} 
                        setDiagnoseStr={setDiagnoseStr} setDiagnoseDict={setDiagnoseDict} />
    </>
  );

}


/**
 * 医生诊断意见组件
 */
interface DiagnoseAdviceProps { diagnosticOpinion: string, dispatch: Dispatch<any> }
export const DiagnoseAdvice: React.FC<DiagnoseAdviceProps> = (props: DiagnoseAdviceProps) => {
  const [isOpen, setOpen] = useState(false);
  const [ adviceValue, setAdviceValue ] = useState<number>(-1);
  const { diagnosticOpinion, dispatch } = props;
  const { TextArea } = Input;

  const setAdvice = (advice:string) => {
    dispatch({
      type: "recordDiagnoseInfo/setAdvice", 
      payload:{ diagnosticOpinion: advice }
    });
  }

  /**
   * 医生选择模板
   */
  const SelectDia = () => {
    
    const onChange = (e) => { 
      setAdvice(adviceStrDict[e.target.value]);
      setAdviceValue(e.target.value);
    };

    return (
      <Radio.Group onChange={onChange} value={adviceValue}>
        <Row> <Radio value={0}>未见明显异常，建议2-3周复查</Radio> </Row>
        <Row> <Radio value={1}>轻度ROP：建议2周复查</Radio> </Row>
        <Row> <Radio value={2}>建议长期眼科随诊</Radio> </Row>
        <Row> <Radio value={3}>重度ROP：建议立即到小儿眼底病医生处就诊</Radio> </Row>
        <Row> <Radio value={4}>建议终止ROP眼底随访，但应由眼底病医师确认。长期应注意患儿可能出现斜视，弱视，近视等情况。</Radio> </Row>
      </Radio.Group>
    );
  };

  return (
    <Row> 
      <TextArea value={diagnosticOpinion} onChange={(e)=>(setAdvice(e.target.value))} onPressEnter={ (e) => (e.preventDefault()) } rows={4} /> 
      
      <Button type="primary" onClick={() => setOpen(true)}> 诊断模板 </Button>
      <Modal
        title="诊断模板"
        centered
        visible={isOpen}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={800}
      >
        <SelectDia />
      </Modal>
      
    </Row>
  );
}