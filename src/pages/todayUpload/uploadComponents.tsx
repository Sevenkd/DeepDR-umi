import { Button, Card, message, Upload, Space, Tree } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { uplaodRecordsWCCH } from '@/services/upload';

/**
 * 可接受的文件格式
 */
const uploadAceeptType = [".jpg", ".jpeg", ".png", ".txt"]; 

/**
 * 选择文件按钮
 */
interface UplaodBtnProps { uploading: boolean, addFileList: (file:File)=>void, loading:boolean }
const UplaodBtn:React.FC<UplaodBtnProps> = (props: UplaodBtnProps) => {
  const uploadProps = {
    directory: true,
    disabled: props.uploading,
    showUploadList: false,
    beforeUpload: (file:File) => {
        let fileType = (file.name.substr(file.name.lastIndexOf("."))).toLowerCase();
        if (uploadAceeptType.indexOf(fileType) === -1) {
            message.error(`暂不支持 ${fileType} 格式的文件, 无法上传`);
        } else {
            props.addFileList(file);
        }
        return false;
    },
  };

  return (
    <Upload {...uploadProps}>
      <Button icon={<UploadOutlined />} loading={props.loading} disabled={props.uploading}>上传病例</Button>
    </Upload>
  );
}

/**
 * 确认上传按钮
 */
interface ConfrimUploadButtonProps { uploading: boolean, clearFileList: ()=>void, upload: ()=>void, loading:boolean }
const ConfrimUploadButton: React.FC<ConfrimUploadButtonProps> = (props:ConfrimUploadButtonProps) => {
  if (!props.uploading || props.loading) { return null }; 
  return (
    <Space>
      <Button onClick={ props.upload }> 确认上传 </Button>
      <Button danger onClick={props.clearFileList}> 取消上传 </Button>
    </Space>
  );
};

/**
 * 待上传文件可折叠树形列表
 */
const maxUploadLength = 1024;
interface UploadTreeProps { fileList: File[], clearFileList: ()=>void }
const UploadTree: React.FC<UploadTreeProps> = (props: UploadTreeProps) => {
  const totalFiles = props.fileList.length;
  if (totalFiles === 0){ return null; } 
  else if (totalFiles >= maxUploadLength){
    message.error("待上传文件数量过多(超过1024), 请分批次上传!");
    props.clearFileList();
  }

  /**
   * 根据待上传文件列表计算文件树的数据结构
   * 
   * @param { File[] } fileList 待上传文件列表
   */
  const getTreeData = (fileList: File[]) => {
    interface treeNodeChildren { key: string, title: string, isLeaf: boolean};
    interface treeNodeParent { key: string, title: string, children: treeNodeChildren[]};

    var foldernameSet = new Set();
    var treeData: treeNodeParent[] = [];

    fileList.forEach( (file: File ) => {
      let subPaths = file.webkitRelativePath.split("/")
      let patient = subPaths[subPaths.length-2] // 病例名称
      let fileName = file.name;                 // 文件名

      // 设置父节点
      if ( !foldernameSet.has(patient) ){
        foldernameSet.add(patient);
        let parentNode = {title: patient, key: patient, children: []};
        treeData.push(parentNode);
      }
      
      let leafNode = {title: fileName, key: patient + "-" + fileName, isLeaf: true}
      treeData.forEach( (node:treeNodeParent) => { if (node.key === patient) { node.children.push(leafNode); } })
    });

    let totalFolders = foldernameSet.size; 
    return [treeData, totalFolders];
  };
  const treeDatas = getTreeData(props.fileList);

  const { DirectoryTree } = Tree;
  return (
    <Card 
      title={ "共检测到" + treeDatas[1] + "个病人, 其中包含" + totalFiles + "个文件" } >
      <DirectoryTree multiple height={300} treeData={treeDatas[0]} />
    </Card>
  );
};

/**
 * 文件上传组件
 */
interface UploadCardProps { loginCode: string ,reloadTable: ()=>void }
export const UploadCard: React.FC<UploadCardProps> = (props: UploadCardProps) => {
  const [ uploading, setUploading ] = useState<boolean>(false); //是否开始选择文件
  const [ fileList, setFileList ] = useState<File[]>([]);
  const [ loading, setLoading ] = useState<boolean>(false); // 是否开始上传

  const addFileList = (file:File) => {
    fileList.push(file);
    setUploading(true);
  };

  const clearFileList = ()=> { setFileList([]); setUploading(false); setLoading(false); };
  const upload = () => { 
    setLoading(true);
    uplaodRecordsWCCH({ login_code: props.loginCode, files: fileList })
    .then( (response) => {
      console.log(response);
      if (response.res === "success") {
        if (response.uploadState.length > 0){
          response.uploadState.forEach( (desc:string) => { message.error(`病例${desc}上传失败, ${desc}`) });
        } else {
          message.success("所有文件上传成功!");
        }
      } else {
        message.error("文件上传失败!");
      }
      clearFileList();
      props.reloadTable();
    } );
  };

  return (
    <Card style={ {marginBottom: "20px"} }>
      <Space>
        <UplaodBtn uploading={uploading} addFileList={addFileList} loading={loading} />
        <ConfrimUploadButton uploading={uploading} clearFileList={clearFileList} upload={upload} loading={loading} />
      </Space>
      <UploadTree fileList={fileList} clearFileList={clearFileList} />
    </Card>
  );
};