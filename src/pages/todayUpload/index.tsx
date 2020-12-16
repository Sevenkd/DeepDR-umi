import { Button, message, Space, Tag } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { TableListItem } from './data.d';
import { queryWeekly } from '@/services/todayUpload';
import { connect, history } from 'umi';
import { ConnectState } from '@/models/connect';
import { FundusLightBox } from '@/components/FundusImages'
import { getFundusImgURL, getReportImgURL } from '@/utils/srcUrls';
import { sendConsultationRequest, rediagnoseRecordByUploadIDs } from '@/services/recordDiagnose';
import { UploadCard } from './uploadComponents';

/**
 * 表格中模型诊断的Tag标签
 */
const ModelDiagnoseTag: React.FC<{}> = (props:any) => {
  const tagList = props.results.map( (ele:string) =>{
    let color = "green";
    switch(ele){
      case "ROP轻度": color = "orange"; break;
      case "ROP重度": color = "red"; break;
      case "诊断中...": color = "blue"; break;
      case "其他异常": color = "yellow"; break;
      default: color = "green"; break;
    }
    return( <Tag key={ele} color={color}> {ele} </Tag> );
  })
  return (
    <div> {tagList} </div>
  );
};

/**
 * 眼底照片列
 */
const FundusColumn: React.FC<{}> = (props:any) => {
  const { images, loginCode } = props;

  const [osOpen, setOsOpen] = useState<boolean>(false);
  const [odOpen, setOdOpen] = useState<boolean>(false);

  const osImages:any[] = images[0].map( (imgId:string) => ( getFundusImgURL(loginCode, imgId) ) )
  const odImages:any[] = images[1].map( (imgId:string) => ( getFundusImgURL(loginCode, imgId) ) )

  return(
    <div>
      <div>
        <a onClick={() => setOsOpen(true)} disabled={osImages.length == 0} >OS</a>
        <FundusLightBox isOpen={osOpen} setOpen={setOsOpen} images={osImages} />
      </div>
      <br/>
      <div>
        <a onClick={() => setOdOpen(true)} disabled={odImages.length == 0} >OD</a>
        <FundusLightBox isOpen={odOpen} setOpen={setOdOpen} images={odImages} />
      </div>
    </div>
  );
};

/**
 * 今日上传表格
 */
const TodayUploadTable: React.FC<{}> = (props:any) => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<any>();

  const { loginCode=null, role="doctor", hospitalEName="MILAB" } = props.currentUser;

  const reloadTable = () => { actionRef.current.reloadAndRest(); } // 刷新表格

  /**
   * 表格的column配置
   */
  const hospitalFilters = role === 'admin' ? [
    { text: '机器智能实验室', value: "1" },
    { text: '成都市妇女儿童中心医院', value: "2" },
    { text: '安岳县妇女儿童医院', value: "3" }
  ] : false;
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '病人编号',
      dataIndex: 'patientNum',
      valueType: 'textarea',
    },
    {
      title: '姓名',
      dataIndex: 'patientName',
      valueType: 'textarea',
    },
    {
      title: '年龄',
      dataIndex: 'checkAge',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '检查时间',
      dataIndex: 'checkTime',
      valueType: 'dateTime',
      //TODO
      // sorter: true, 
      search: false,
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      valueType: 'dateTime',
      //TODO
      // sorter: true,
      search: false,
    },
    {
      title: '上传医院',
      dataIndex: 'hospitalName',
      filters: hospitalFilters,
    },
    {
      title: '眼底图片',
      dataIndex: 'images',
      search: false,
      render: (images:any) => <FundusColumn images={images} loginCode={loginCode} />
    },
    {
      title: 'A.I.初诊结果',
      dataIndex: 'modelResults',
      filters: [
        { text: '诊断中', value: "PROCESSING" },
        { text: '正常', value: "正常" },
        { text: 'ROP轻度', value: "ROP轻度" },
        { text: 'ROP重度', value: "ROP重度" },
        { text: '其他异常', value: "其他异常" }
      ],
      render: (results:any) => {
        return(
          <div>
            < ModelDiagnoseTag results={results[0]} />
            <br/>
            < ModelDiagnoseTag results={results[1]} />
          </div>
        );
      },
    },
    {
      title: '医生诊断',
      dataIndex: 'doctorDiagnose',
      filters: [
        { text: '未诊断', value: "0" },
        { text: '已诊断', value: "1" },
      ],
      search: false,
      render: (diagnose, row, index) => { 
        const toDiagnosePage = () => {
          history.push({
            pathname: '/records/docDiagnose',
            query: {
              uploadID: row.key,
              redirect: props.location.pathname,
            },
          });
        }

        /**
         * TODO 
         * 远程会诊请求发送成功后不能重新点击
         */
        const onConsultationBtnClick = () => { 
          sendConsultationRequest({login_code: loginCode, uploadID: row.key})
          .then( (response) => {
            if (response.res === "success") {
              message.success("会诊请求发送成功"); 
            } else {
              message.error("请求失败, 请稍后重试!"); 
            }
          } )
        }
        const unDiagnosedBtn = (
        <div> <Space>
          <a onClick={toDiagnosePage} >诊断</a> 
          { role === 'admin' ? null : <a onClick={onConsultationBtnClick} >请求远程会诊</a> } 
        </Space></div>);

        const [ boxOpen, setBoxOpen ] = useState<boolean>(false);
        const reportImg = diagnose === "-" ? [] : [ getReportImgURL(loginCode, row.key) ];

        return diagnose === "-" ? unDiagnosedBtn : (
          <div>
            <a onClick={()=>{setBoxOpen(true)}}>查看诊断报告</a>
            <FundusLightBox isOpen={boxOpen} setOpen={setBoxOpen} images={reportImg} ifPrintReport={true} 
                            uploadID={row.key} ifDownloadReport={true} loginCode={loginCode} />
            <br/>
         <p>{diagnose.doctorName}在{diagnose.diagnoseTime}诊断</p>
         </div>
        );
      },
    },
  ];

  const uploadCard = hospitalEName === "WCCH" ? <UploadCard loginCode={loginCode} reloadTable={reloadTable} /> : null;

  return (
    <PageContainer>
      
      {uploadCard}

      
      <ProTable<TableListItem>
        headerTitle="一周上传" // 表格标题
        actionRef={actionRef} // 表格操作的索引
        formRef={formRef}     // 搜索表单的索引
        rowKey="key"          // 每一行item的key
        pagination={{         // 分页设置
            defaultPageSize:10,
            pageSizeOptions: ["5", "10", "20", "50"]
          }}

        beforeSearchSubmit={
          /**
           * 在提交表单之前可以对表单中的参数进行简单操作和渲染
           * 比如把两个时间组合成一个时间段等, 发送给后台
           * 后台会返回这个时间段上传的所有数据
           * 
           * 这个接口只能对搜索表单进行修改, 之后proTable会对这个接口返回的参数进行处理
           * 绑定其他参数, 共同发送给后台
           * 要修改其他参数(current, PageSize等需在request中修改)
           */
          (params:any) => {
            console.log("beforeSearchSubmit", params);
            return params;
          }
        }

        onSubmit={
          (params: any) => {
            console.log("onSubmit", params);
          }
        }

        onReset = {
          /**
           * 点击重置按钮后触发的操作
           */
          () => {console.log("props onReset!")}
        }

        // search={{ labelWidth: 'auto', defaultCollapsed: false}}
        search={false}

        request={(params: any, sorter: any, filter: any) => {
          const response = queryWeekly({ ...params, sorter, filter , login_code:loginCode});
          response.then((response) => {
            if (response.res === "success"){ return response; }
            else if ( response.status ===  "UNAUTHORIZED" ) {
                message.error("登录已过期, 请重新登录!");
                history.replace({ pathname: '/user/login', });
              }
          })
          return response;
        }}

        columns={columns}

        /**
         * 批量操作
         */
        rowSelection={{}} 
        // 左侧操作按钮
        tableAlertRender={( { selectedRowKeys, onCleanSelected } ) => {
          const [ rediagnose, setRediagnose ] = useState<boolean>(false);
          const reDiagnoseRecord = () => { 

            setRediagnose(true);
            rediagnoseRecordByUploadIDs({login_code: loginCode, uploadIDs: JSON.stringify(selectedRowKeys)})
            .then((response) => {
              if (response.res === "success") {
                message.success("请求成功, 请稍后片刻刷新页面获取新的诊断结果!");
              } else {
                message.error("请求异常, 请稍后重试!");
              }
              setRediagnose(false);
              onCleanSelected();
              reloadTable();
            })
           };

          return (
            <Space size={24}>
              <span> 
                已选 {selectedRowKeys.length} 项
                <a style={{ marginLeft: 8 }} disabled={rediagnose} onClick={reDiagnoseRecord}> {rediagnose ? "请求诊断中..." : "请求AI重新诊断"} </a>
              </span>
            </Space>
          );
        }}
        // 右侧操作按钮
        // tableAlertOptionRender={}
        />
      
    </PageContainer>
  );
};
export default connect(({ user }: ConnectState) => ({ 
  currentUser: user.currentUser,
}))(TodayUploadTable);
