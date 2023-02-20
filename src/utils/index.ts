export function getUrlBase64(imgUrl: string) {
  return new Promise((resolve, reject) => {
    let canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    let img = new Image();
    img.crossOrigin = "Anonymous";// 开启img的“跨域”模式
    img.src = imgUrl;
    img.onload = function() {
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0, img.width, img.height);// 参数可自定义
      const dataUrl = canvas.toDataURL("image/jpeg", 1);// 获取Base64编码
      resolve(dataUrl);
      canvas = null;// 清除canvas元素
      img = null;// 清除img元素
    };
    img.onerror = function() {
      reject(new Error("Could not load image at " + imgUrl));
    };
  });
}
/**
 * 利用公式转换一下坐标
 * @param x 要转换的x轴坐标
 * @param y 要转换的y轴坐标
 * @param wrap 容器的dom
 * @param translatePointXVal canvas的x轴偏移
 * @param translatePointYVal canvas的y轴偏移
 * @param canvasScale 缩放比例
 * @returns
 */
export function generateLinePoint(x: number, y: number, wrap: any, translatePointXVal: number, translatePointYVal: number, canvasScale: number) {
  const wrapWidth: number = wrap?.offsetWidth || 0;
  const wrapHeight: number = wrap?.offsetHeight || 0;
  // 缩放位移坐标变化规律
  // (transformOrigin - downX) / scale * (scale-1) + downX - translateX = pointX
  const pointX: number = ((wrapWidth / 2) - x) / canvasScale * (canvasScale - 1) + x - translatePointXVal;
  const pointY: number = ((wrapHeight / 2) - y) / canvasScale * (canvasScale - 1) + y - translatePointYVal;

  return {
    pointX,
    pointY
  };
}
/**
 * 生成随机id
 * @param length id长度
 * @returns
 */
export function getID(length) {
  return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
}

/**
 * 删除元素下的所有子节点
 * @param event 父节点
 */
export function deleteChild(event:any) {
  var first = event.firstElementChild;
  while (first) {
    first.remove();
    first = event.firstElementChild;
  }
}
