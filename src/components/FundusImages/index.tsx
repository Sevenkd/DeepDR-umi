import React, { useState } from 'react';
import Lightbox from 'react-image-lightbox';
import { Button } from 'antd';
import { history } from 'umi';



/**
 * 眼底图像灯箱组件
 * 
 * @param { string[] } images 图像url列表
 * @param { boolean } isOpen  控制灯箱开关的变量
 * @param { ()=>boolean } setOpen 改变灯箱开关变量的函数
 * 
 * 可选参数
 * @param { boolean } stopOnEdge 是否在边界图像停下来, 默认 true
 * @param { boolean } ifSetTypicalImg 是否显示一个按钮把图像设置为诊断报告上的图像, 默认 false
 * @param { (inx: number) => void } setTypicalID 设置诊断报告图像的上层回调函数, 输入当前图像的索引, 由上层函数根据索引获取图像ID, 如果ifSetTypicalImg为真, 则必须
 * @param { boolean } outsideToClose 点击图像外界是否关闭组件, 默认 false
 * @param { boolean } ifPrintReport 是否显示打印报告的按钮
 */
interface FundusLightBoxProps { 
  images: string[], 
  isOpen: boolean, 
  setOpen: ()=>boolean, 
  
  stopOnEdge?: boolean,
  ifSetTypicalImg?: boolean
  setTypicalID?: React.ReactNode[]
  outsideToClose?: boolean
  ifPrintReport?: boolean
}
export const FundusLightBox: React.FC<FundusLightBoxProps> = (props:any) => {
  const { images, isOpen, setOpen, stopOnEdge=true, outsideToClose=false } = props;
  const { ifPrintReport=false, uploadID="-1" } = props; // 打印诊断报告按钮
  const { ifSetTypicalImg=false, setTypicalID=()=>{} } = props; // 设为报告图像按钮
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  // 当数组越界的时候返回undefined, 自动无法跳跃到下一张或上一张, 所以无须再做验证
  const nextIndex = stopOnEdge ? photoIndex + 1 : (photoIndex + 1) % images.length;
  const prevIndex = stopOnEdge ? photoIndex - 1 : (photoIndex + images.length - 1) % images.length;

  /**
   * 将图像设为报告图像的操作
   */
  const onTypicalImgButtonClick = () => {
    setTypicalID(photoIndex)
    setOpen(false);
  };
  /**
   * 将图像设为报告图像的操作
   */
  const onPrintReportButtonClick = () => {
    history.push({
      pathname: '/records/printReport',
      query: {
        uploadID: uploadID
      },
    });
    setOpen(false)
  };

  const typicalImgButton = ifSetTypicalImg ? [<Button type="primary" onClick={onTypicalImgButtonClick} >设为报告图像</Button>] : [];
  const downloadButton = ifPrintReport ? [<Button type="primary" onClick={onPrintReportButtonClick} >打印诊断报告</Button>] : [];

  const lightBox = isOpen ? (
    <Lightbox
      mainSrc={images[photoIndex]}
      nextSrc={images[nextIndex]}
      prevSrc={images[prevIndex]}
      onCloseRequest={ () => setOpen(false) }
      onMovePrevRequest={ () => setPhotoIndex(prevIndex) }
      onMoveNextRequest={ () => setPhotoIndex(nextIndex) } 
      animationOnKeyInput={true}
      toolbarButtons={ [ ...typicalImgButton, ...downloadButton] } // 工具栏按钮
      clickOutsideToClose={outsideToClose}

    />
  ) : null;

  return lightBox;
};



/**
 * 
 * 
@page {
    size: A4;
    margin: 0;
}
 
@media print {
    html, body {
        min-width: 0;
        width: 210mm; 
        height: 297mm;
    }
    .print-hide {
        visibility: hidden!important;
        display: none!important;
    }
}

 */
  
