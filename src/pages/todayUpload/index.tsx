import { Tag, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { TableListItem } from './data.d';
import { queryItems } from './service';
import Carousel from "react-images";

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

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
      default: color = "green"; break;
    }
    return( <Tag key={ele} color={color}> {ele} </Tag> );
  })
  return (
    <div> {tagList} </div>
  );
};


/**
 * 眼底图像显示模块
 * 
 * 有点问题, 弃用
 */
const FundusImgModel: React.FC<{}> = (props:any) => {
  const { images, isOpen, setOpen} = props;
  return(
    <Modal
      title="左眼眼底图像"
      centered
      maskStyle={{filter: 'Alpha(Opacity=10, Style=0)',opacity: '0.10'}}
      visible={isOpen}
      footer={null}
      onOk={() => setOpen(false)}
      onCancel={() => setOpen(false)} >
      <Carousel views={images} />
    </Modal>
  );
};


/**
 * 显示眼底图像的灯箱插件
 * 
 * 插件名称为 React Image Lightbox
 */
const FundusLightBox: React.FC<{}> = (props:any) => {
  const {images, isOpen, setOpen} = props
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  // const [isOpen, setOpen] = useState<boolean>(false);

  console.log("nextSrc", images[(photoIndex + 1) % images.length]);

  const lightBox = isOpen ? (
    <Lightbox
      mainSrc={images[photoIndex]}
      nextSrc={images[(photoIndex + 1) % images.length]}
      prevSrc={images[(photoIndex + images.length - 1) % images.length]}
      onCloseRequest={ () => setOpen(false) }
      onMovePrevRequest={ () => setPhotoIndex((photoIndex + images.length - 1) % images.length) }
      onMoveNextRequest={ () => setPhotoIndex((photoIndex + 1) % images.length) } 
    />
  ) : null;

  return lightBox;
}


/**
 * 今日上传表格
 */
const TodayUploadTable: React.FC<{}> = () => {

  const actionRef = useRef<ActionType>();
  const formRef = useRef<any>();

  /**
   * 这个地方有一个BUG
   * 你对所有Carousel都使用一个变量来控制开合, 理论上是有错误的
   * 
   * 从表现上来看, 我点击多个不同病例的OS按钮, 显示的图片是相同的, 都是最后一组病例的OS图像
   * 可以在父组件用数组来控制, 或者让自组件单独管理自己的开闭状态, 然后用父组件用ref来调用
   * 或者其他更好的方法?
   * 
   * 我改用React Image Lightbox插件, 效果暂时还行, 你之后看看能不能再优化一下
   */
  // const [osOpen, setOsOpen] = useState<boolean>(false);
  // const [odOpen, setOdOpen] = useState<boolean>(false);
  const [isDis, setIsDia] = useState<boolean>(false)

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
      /**
       * TODO
       * 按照用户权限区分
       * 如果是admin则显示筛选, 否则不显示(因为非admin用户只能看到自己医院的数据)
       */
      filters: [
        { text: '机器智能实验室', value: "MILAB" },
        { text: '成都市妇女儿童中心医院', value: "WCCH" }
      ],
    },
    {
      title: '眼底图片',
      dataIndex: 'images',
      search: false,
      render: (images:any) => {
        const osImages:any[] = images[0].map( (imgId:string) => ( "http://192.168.7.181:9005/api/dataManager/getFundusImageByID?login_code=EE0F263BA09519E6B37F1501AA935215&imgID=" + imgId ) )
        const odImages:any[] = images[1].map( (imgId:string) => ( "http://192.168.7.181:9005/api/dataManager/getFundusImageByID?login_code=EE0F263BA09519E6B37F1501AA935215&imgID=" + imgId ) )

        // const osImages:any[] = images[0].map((imgId:string) => ({ source: "http://192.168.7.181:9005/api/dataManager/getFundusImageByID?login_code=EE0F263BA09519E6B37F1501AA935215&imgID=" + imgId }) )
        // const odImages:any[] = images[1].map((imgId:string) => ({ source: "http://192.168.7.181:9005/api/dataManager/getFundusImageByID?login_code=EE0F263BA09519E6B37F1501AA935215&imgID=" + imgId }) )
        
        const [osOpen, setOsOpen] = useState<boolean>(false);
        const [odOpen, setOdOpen] = useState<boolean>(false);

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
        )
      }
    },
    {
      title: '模型诊断结果',
      dataIndex: 'modelResults',
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
      search: false,
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

        // search={{ labelWidth: 'auto', defaultCollapsed: false}}
        search={false}

        request={(params: any, sorter: any, filter: any) => {
          console.log("request", params, sorter, filter);
          return queryItems({ ...params, sorter, filter })
        }}

        columns={columns}

        rowSelection={{ onChange: () => {} }} 
        />

    </PageContainer>
  );
};

export default TodayUploadTable;
