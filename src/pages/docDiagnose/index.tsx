/**
 * 医生诊断界面
 * 
 * TODO: 权限管理
 */
import { Card, Col, Divider, Row, Button, Space, message } from 'antd';
import React from 'react';
import { connect, history } from 'umi';
import { ConnectState } from '@/models/connect';
import { submitDiagnose } from '@/services/recordDiagnose';
import { PageLoading } from '@ant-design/pro-layout';
import { DocDiagnoseState, DocDiagnoseProps } from './data.d';
import { PatientInfo, FundusImagesBox, EyeDiagnose, DiagnoseAdvice } from './component'


/**
 * 医生诊断页面
 */
class DocDiagnose extends React.Component<DocDiagnoseProps, DocDiagnoseState> {
  state: DocDiagnoseState = { 
    isReady: false,
    patientInfo: {},
    osImages: [],
    odImages: [],
    typicalImg: {os: "-1", od: "-1"},
    osDiagnoseStr: "",
    odDiagnoseStr: "",
    diagnosticOpinion: "",
    osDict: null,
    odDict: null
  }

  componentDidMount() {
    const { currentUser, dispatch } = this.props;
    const { uploadID } = this.props.location.query;
    // // TODO: 检查是否有uploadID

    dispatch({
      type: 'recordDiagnoseInfo/fetchRecord',
      payload: { login_code: currentUser.loginCode, uploadID:uploadID },
    })
    this.setState({isReady: true});
  }

  // 退出页面时清空病例数据
  componentWillUnmount() {
    const { dispatch } = this.props; 
    dispatch({ type: 'recordDiagnoseInfo/clearRecord' });
  }

  render() {
    const { currentUser, recordInfo, dispatch } = this.props; 
    const { isReady } = this.state;
    
    if (!isReady || recordInfo.uploadID === "-1"){ return <PageLoading />; }

    console.log(recordInfo);

    // 病人信息模块
    const { patientInfo } = recordInfo;

    // 眼底照片模块
    const { typicalImg={os:"-1", od:"-1"}, osImages=[], odImages=[] } = recordInfo;
    const osBox = <FundusImagesBox typicalID={typicalImg.os} imageIDs={osImages} loginCode={currentUser.loginCode}
                   setTypical={(id)=> ( dispatch({type: "recordDiagnoseInfo/setTypicalID", payload: { typicalImg:{...typicalImg, os: id} } }) ) } />;
    const odBox = <FundusImagesBox typicalID={typicalImg.od} imageIDs={odImages} loginCode={currentUser.loginCode} 
                   setTypical={(id)=> ( dispatch({type: "recordDiagnoseInfo/setTypicalID", payload: { typicalImg:{...typicalImg, od: id} } }) ) } />;

    const { osDiagnoseStr, osDict } = recordInfo; // 左眼诊断
    const { odDiagnoseStr, odDict } = recordInfo; // 右眼诊断
    const { diagnosticOpinion="" } = recordInfo;  // 医生诊断意见

    const onSubmitDiagnose = ()=> {
      const { redirect } = this.props.location.query;

      const params = {
        login_code: currentUser.loginCode, 
        uploadID: recordInfo.uploadID,
        osTipical: typicalImg.os,
        odTipical: typicalImg.od,
        osDict: JSON.stringify(osDict),
        osDiagnoseStr: osDiagnoseStr,
        odDict: JSON.stringify(odDict),
        odDiagnoseStr: odDiagnoseStr,
        diagnosticOpinion: diagnosticOpinion,
      }
      const response = submitDiagnose(params);
      response.then( (response) => {
        console.log(response);
        if (response.res === "error"){
          message.error(response.message);
        } else {
          // 重定向到原来的页面
          message.success("诊断成功!");
          history.replace(redirect || '/');
        }
      });
      

    }

    return (
      <Row>
        <Col span={5}><Space /></Col>
        <Col span={14}>
          <Card bordered={false}>
            <PatientInfo patientinfo={patientInfo} />
            <Divider style={{ marginBottom: 32 }} />
            <div> 
              <Row>
              <Col span={11}>
                <div style={{ margin: 30 }}> {osBox} </div>
                <Divider style={{ marginBottom: 32 }}>左眼诊断</Divider>
                <EyeDiagnose eyeType={"OS"} diagnoseStr={osDiagnoseStr} diagnoseDict={osDict} dispatch={dispatch} />
              </Col>

              <Col span={2}> <Space /> </Col>

              <Col span={11}>
                <div style={{ margin: 30 }}> {odBox} </div>
                <Divider style={{ marginBottom: 32 }}>右眼诊断</Divider>
                <EyeDiagnose eyeType={"OD"} diagnoseStr={odDiagnoseStr} diagnoseDict={odDict} dispatch={dispatch} />
              </Col> 
              </Row>

              <Divider style={{ marginBottom: 32 }}>处理意见</Divider>
              <DiagnoseAdvice diagnosticOpinion={diagnosticOpinion} dispatch={dispatch} />
            </div>
          </Card>

          <Card>
            <Row>
              {/* <a>上一例</a> <a>下一例</a> */}
              <Col span={4}>  </Col>
              <Col span={1} push={6}> <Space>
                <Button type="primary" onClick={onSubmitDiagnose} >提交诊断</Button>
                <Button onClick={()=>{history.goBack()}} >返回</Button> 
              </ Space> </Col>
              <Col span={5} push={15}>  </Col>
            </Row>
          </Card>
        </Col>
        <Col span={5}> <Space /> </Col>
      </Row>
    );
  }

  
}
export default connect(({ user, recordDiagnoseInfo }: ConnectState) => ({ 
  currentUser: user.currentUser,
  recordInfo: recordDiagnoseInfo,
}))(DocDiagnose);