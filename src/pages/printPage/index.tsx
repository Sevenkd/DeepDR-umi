import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { connect, history } from 'umi';
import { ConnectState } from '@/models/connect';
import { Col, Row, Button, Space } from 'antd';

const PrintComponet: React.FC<{}> = (props:any) => {
  const componentRef = useRef();

  const { currentUser } = props;
  const { loginCode } = currentUser;
  const { uploadID } = props.location.query;

  return (
    <div>
      <Row><Space>
        <ReactToPrint trigger={() => <Button type="primary">打印病例</Button>} content={() => componentRef.current} />
        <Button type="primary" onClick={ ()=>{history.goBack()} }>返回</Button>
      </Space></Row>
      <Row>
        <Col span={5}><Space /></Col>
        <Col span={14}>
          <img 
            src={"http://192.168.7.181:9005/api/dataManager/getReportByUploadID?login_code=" + loginCode + "&uploadID="+uploadID} 
            ref={componentRef} 
            style={{
              width: "21cm",
              height: "29.7cm",
            }}
          />
        </Col>
        <Col span={5}> <Space /> </Col>
      </Row>
    </div>
  );
}

export default connect(({ user }: ConnectState) => ({ 
  currentUser: user.currentUser,
}))(PrintComponet);


