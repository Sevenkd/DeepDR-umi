import { Button, Tag, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { TableListItem } from './data.d';
import { queryRule } from './service';
import Carousel from "react-images";


const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<any>();

  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]); // 选中的条目

  const [osOpen, setOsOpen] = useState<boolean>(false);
  const [odOpen, setOdOpen] = useState<boolean>(false);
  const [isDis, setIsDia] = useState<boolean>(false)

  const images = [{ source: 'http://192.168.7.181:9005/api/dataManager/getFundusImageByID?login_code=EE0F263BA09519E6B37F1501AA935215&imgID=7' }, { source: require('./imagedata/image3.png') }];

  /**
   * 表格的column配置
   */
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
      order: 60
    },
    {
      title: '检测年龄',
      dataIndex: 'checkAge',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '检查时间',
      dataIndex: 'checkTime',
      sorter: true,
      valueType: 'dateTime',
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      sorter: true,
      valueType: 'dateTime',
    },
    {
      title: '上传医院',
      dataIndex: 'hospitalName',
      filters: true, 
      valueEnum: {
        0: { text: '成都市妇女儿童中心医院', hospitalName: "成都市妇女儿童中心医院" },
        1: { text: '安岳妇女儿童医院', hospitalName: "安岳妇女儿童医院" },
      },
    },
    {
      title: '眼底图片',
      dataIndex: 'images',
      render: () => {
        return(
          <div>
            <div>
              <a onClick={() => setOsOpen(true)}>OS</a>
              <Modal
                title="左眼"
                centered
                maskStyle={{filter: 'Alpha(Opacity=10, Style=0)',opacity: '0.10'}}
                visible={osOpen}
                footer={null}
                onOk={() => setOsOpen(false)}
                onCancel={() => setOsOpen(false)} >
                <Carousel views={images} />
              </Modal>
            </div>
            <br/>
            <div>
              <a onClick={() => setOdOpen(true)}>OD</a>
              <Modal
                centered
                visible={odOpen}
                footer={null}
                onOk={() => setOdOpen(false)}
                onCancel={() => setOdOpen(false)}
                width={1150} >
                <Carousel views={images} />
              </Modal>
            </div>
          </div>
        )
      }
    },
    {
      title: '模型诊断结果',
      dataIndex: 'modelResult',
      render: () => {
        let results = [['正常'], ['ROP轻度', 'ROP重度']]
        return(
          <div>
            {results[0].map( (ele) =>{
              let color = "green";
              switch(ele){
                case "ROP轻度": 
                  color = "orange"; 
                  break;
                case "ROP重度": 
                  color = "red"; 
                  break;
                default: 
                  color = "green";
                  break;
              }
              return( <Tag color={color}> {ele} </Tag> );
            })}
            <br/>
            <br/>
            {results[1].map((ele)=>{
              let color = "green";
              switch(ele){
                case "ROP轻度": color = "orange"; break;
                case "ROP重度": color = "red"; break;
                default: break;
              }
              return( <Tag color={color}> {ele} </Tag> );
            })}
          </div>
        );
      },
    },
    {
      title: '医生诊断',
      dataIndex: 'doctorDiagnose',
      render: () => { return ( <div> <a onClick={() => setIsDia(true)}>诊断</a> </div> ); },
    },
  ];


  return (
    <PageContainer>

      <ProTable<TableListItem>
        headerTitle="今日上传" // 表格标题
        actionRef={actionRef} // 表格操作的索引
        formRef={formRef}     // 搜索表单的索引
        rowKey="key"          // 每一行item的key

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

        search={{ labelWidth: 'auto', defaultCollapsed: false}}

        request={(params: any, sorter: any, filter: any) => {
          console.log("request", params, sorter, filter);
          return queryRule({ ...params, sorter, filter })
        }}

        columns={columns}

        rowSelection={{ onChange: (_:any, selectedRows: TableListItem[]) => setSelectedRows(selectedRows) }} />



      { /**
       * 选中条目后显示footerBar
       */
      selectedRowsState?.length > 0 && ( 
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项&nbsp;&nbsp;
              <span>
                服务调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo, 0)} 万
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}



    </PageContainer>
  );
};

export default TableList;
