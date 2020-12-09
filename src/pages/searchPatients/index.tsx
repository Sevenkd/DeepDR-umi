<<<<<<< HEAD
import { Tag, Modal } from 'antd';
import React, { useState, useRef } from 'react';

/**
 * 表格中模型诊断的Tag标签
 */
const ModelDiagnoseTag: React.FC<{}> = (props) => {
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
 * 今日上传表格
 */
const TodayUploadTable: React.FC<{}> = () => {


  return (
    <p>功能开发中, 敬请期待 ...</p>
  );
};

export default TodayUploadTable;
=======
import { Tag, Modal } from 'antd';
import React, { useState, useRef } from 'react';

/**
 * 表格中模型诊断的Tag标签
 */
const ModelDiagnoseTag: React.FC<{}> = (props) => {
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
 * 今日上传表格
 */
const TodayUploadTable: React.FC<{}> = () => {


  return (
    <p>功能开发中, 敬请期待 ...</p>
  );
};

export default TodayUploadTable;
>>>>>>> 092315422825166727cca4d8c6e39b67f966210b
