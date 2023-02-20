import { generateLinePoint, getID, deleteChild } from "./utils/index";
import CanvasHistroyList from "./utils/canvasHistroyList";
import { operateType } from "./utils/operateTypeEnum";
class pictureEditor {
  private _wrapDom: any;
  private _canvas: any;
  private _signCanvas: any;
  private _imgeUrl: string;
  private _canvasScale: number = 1;
  private _lineWidth: number = 1;
  // 定义一些变量，来保存当前/最新的移动状态
  // 当前位移的距离
  private translatePointXVal: number = 0;
  private translatePointYVal: number = 0;
  // 上一次位移结束的位移距离
  private fillStartPointXVal: number = 0;
  private fillStartPointYVal: number = 0;
  private canvasHistroyList: any;
  public canvasHistroySub: number = 0;
  constructor(options: any) {
    if (options) {
      this._imgeUrl = options.imgUrl;
      this._wrapDom = document.getElementById(options.id);
      this._wrapDom.style.overflow = `hidden`;
      this._wrapDom.style.backgroundColor = `#333`;
      this._wrapDom.style.position = "relative";
      this.canvasHistroyList = new CanvasHistroyList<ImageData>();
      this.initCanvas();
      this._wrapDom.onmousedown = (event: any) => {
        if (options.onmousedownCallBack) options.onmousedownCallBack(event);
      };
      this._wrapDom.onwheel = (event: any) => {
        if (options.onwheelCallBack) options.onwheelCallBack(event);
      };
    }
  }
  /**
   * 初始化canvas
   */
  initCanvas() {
    const canvasHistroyId = getID(8);
    this._canvas = document.createElement("canvas");
    this._signCanvas = document.createElement("canvas");

    this._signCanvas.width = this._canvas.width = this._wrapDom.offsetWidth;
    this._signCanvas.height = this._canvas.height = this._wrapDom.offsetHeight;

    const canvas_ctx: CanvasRenderingContext2D | undefined | null = this._canvas?.getContext("2d");
    const signCanvas_ctx: CanvasRenderingContext2D | undefined | null = this._signCanvas?.getContext("2d");

    this._signCanvas.style.position = "absolute";
    this._signCanvas.style.top = "0";
    this._signCanvas.style.left = "0";

    const img: HTMLImageElement = new Image();
    img.src = this._imgeUrl;
    img.setAttribute("crossOrigin", "Anonymous");
    img.onload = () => {
      const imgWidth = img.width;
      const imgHeight = img.height;
      const wrapDomWidth = this._wrapDom?.offsetWidth;
      const wrapDomHeight = this._wrapDom?.offsetHeight;
      const _transformOriginVal = `${wrapDomWidth / 2}px ${wrapDomHeight / 2}px`;
      let _transformVal = "";

      this._signCanvas.width = this._canvas.width = imgWidth;
      this._signCanvas.height = this._canvas.height = imgHeight;

      canvas_ctx.drawImage(img, 0, 0);// 参数可自定义
      // 设置变化基点，为画布容器中央
      this._signCanvas.style.transformOrigin = this._canvas.style.transformOrigin = _transformOriginVal;
      if (imgWidth < wrapDomWidth || imgHeight < wrapDomHeight) {
        if (imgWidth < wrapDomWidth) this.fillStartPointXVal = this.translatePointXVal = (wrapDomWidth - imgWidth) / 2;
        if (imgHeight < wrapDomHeight) this.fillStartPointYVal = this.translatePointYVal = (wrapDomHeight - imgHeight) / 2;
        _transformVal = `translate(${this.translatePointXVal}px,${this.translatePointYVal}px)`;
      }
      // 清除上一次变化的效果
      this._signCanvas.style.transform = this._canvas.style.transform = _transformVal;
      // 重置图形历史记录，并且将初始化图片进行存储
      this.canvasHistroyList.reset();
      const imageData: ImageData = signCanvas_ctx.getImageData(0, 0, img.width, img.height);
      this.setCanvasHistroyList(canvasHistroyId, operateType.DOODLE, imageData);
    };
    deleteChild(this._wrapDom);
    this._wrapDom.appendChild(this._canvas);
    this._wrapDom.appendChild(this._signCanvas);
    this.handleMouseModeChange("MOVE_MODE");
  }
  setCanvasHistroyList(key: string, type: operateType, valitem?: any) {
    this.canvasHistroyList.set(key, type, valitem);
    this.canvasHistroySub = this.canvasHistroyList.getlistLength();
  }
  /**
   * 放大缩小
   * @param newScale 设置的canvas的放大倍数
   */
  setCanvasScale(newScale) {
    if (newScale < 0.1) newScale = 0.1;
    if (newScale > 2) newScale = 2;
    const canvas = this._canvas;
    const signCanvas = this._signCanvas;
    this._canvasScale = newScale;
    // 更新画布的css变化
    canvas.style.transform = `scale(${newScale},${newScale}) translate(${this.translatePointXVal}px,${this.translatePointYVal}px)`;
    signCanvas.style.transform = `scale(${newScale},${newScale}) translate(${this.translatePointXVal}px,${this.translatePointYVal}px)`;
  }
  /**
   * 设置画笔宽度
   * @param newLineWidth
   */
  setLineWidth(newLineWidth) {
    if (newLineWidth <= 0) newLineWidth = 1;
    this._lineWidth = newLineWidth;
  }
  /**
   * 拖动图片
   * @param downX 鼠标点击的X轴坐标
   * @param downY 鼠标点击的Y轴坐标
   * @returns
   */
  handleMoveMode(downX: number, downY: number) {
    const wrap = this._wrapDom;
    const canvas = this._canvas;
    const signCanvas = this._signCanvas;
    const canvasScale = this._canvasScale;
    if (!canvas || !wrap) return;
    // 为容器添加移动事件，可以在空白处移动图片
    wrap.onmousemove = (event: MouseEvent) => {
      const moveX: number = event.pageX;
      const moveY: number = event.pageY;

      // 更新现在的位移距离，值为：上一次位移结束的坐标+移动的距离
      this.translatePointXVal = this.fillStartPointXVal + (moveX - downX);
      this.translatePointYVal = this.fillStartPointYVal + (moveY - downY);

      // 更新画布的css变化
      canvas.style.transform = `scale(${canvasScale},${canvasScale}) translate(${this.translatePointXVal}px,${this.translatePointYVal}px)`;
      signCanvas.style.transform = `scale(${canvasScale},${canvasScale}) translate(${this.translatePointXVal}px,${this.translatePointYVal}px)`;
    };
    wrap.onmouseup = (event: MouseEvent) => {
      const upX: number = event.pageX;
      const upY: number = event.pageY;

      // 取消事件监听
      wrap.onmousemove = null;
      wrap.onmouseup = null;

      // 鼠标抬起时候，更新“上一次唯一结束的坐标”
      this.fillStartPointXVal += (upX - downX);
      this.fillStartPointYVal += (upY - downY);
    };
  }
  /**
   * 画线涂鸦
   * @param downX 鼠标点击的X轴坐标
   * @param downY 鼠标点击的Y轴坐标
   * @returns
   */
  handleLineMode(downX: number, downY: number) {
    const wrap = this._wrapDom;
    const canvas = this._signCanvas;
    const canvasHistroyId = getID(8);
    const canvasScale = this._canvasScale;
    const context: CanvasRenderingContext2D | undefined | null = canvas?.getContext("2d");
    if (!canvas || !wrap || !context) return;

    const offsetLeft: number = canvas.offsetLeft;
    const offsetTop: number = canvas.offsetTop;

    // 减去画布偏移的距离（以画布为基准进行计算坐标）
    downX = downX - offsetLeft;
    downY = downY - offsetTop;
    const { pointX, pointY } = generateLinePoint(downX, downY, wrap, this.translatePointXVal, this.translatePointYVal, canvasScale);
    context.globalCompositeOperation = "source-over";
    context.beginPath();
    // 设置画笔起点
    context.moveTo(pointX, pointY);
    canvas.onmousemove = null;

    if (this.canvasHistroySub !== this.canvasHistroyList.getlistLength()) this.canvasHistroyList.setCanvasHistroyListAccordingIndex(this.canvasHistroySub);
    this.setCanvasHistroyList(canvasHistroyId, operateType.DOODLE);

    canvas.onmousemove = (event: MouseEvent) => {
      const moveX: number = event.pageX - offsetLeft;
      const moveY: number = event.pageY - offsetTop;
      // console.log(moveX,moveY)
      const { pointX, pointY } = generateLinePoint(moveX, moveY, wrap, this.translatePointXVal, this.translatePointYVal, canvasScale);
      context.lineWidth = this._lineWidth;
      console.log(this._lineWidth);
      // 开始绘制画笔线条~
      context.lineTo(pointX, pointY);
      context.stroke();
    };
    canvas.onmouseup = () => {
      context.closePath();
      const imageData: ImageData = context.getImageData(0, 0, canvas.width, canvas.height);
      this.setCanvasHistroyList(canvasHistroyId, operateType.DOODLE, imageData);
      canvas.onmousemove = null;
      canvas.onmouseup = null;
    };
  }
  /**
   * 框选矩形来进行擦除
   * @param downX
   * @param downY
   */
  handleRectCleanMode(downX: number, downY: number) {
    console.log(1111);
    const wrap = this._wrapDom;
    const signCanvas = this._signCanvas;
    const canvasScale = this._canvasScale;
    const context: CanvasRenderingContext2D | undefined | null = signCanvas?.getContext("2d");
    if (!signCanvas || !wrap || !context) return;

    const offsetLeft: number = signCanvas.offsetLeft;
    const offsetTop: number = signCanvas.offsetTop;
    const { pointX, pointY } = generateLinePoint(downX, downY, wrap, this.translatePointXVal, this.translatePointYVal, canvasScale);
    const startX = pointX;
    const startY = pointY;
    const canvasWidth = signCanvas.width;
    const canvasHeight = signCanvas.height;
    const canvasHistroyItem = this.canvasHistroyList.getLastCanvasHistroy();
    let imageData: ImageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
    window.onmousemove = (event: MouseEvent) => {
      context?.putImageData(canvasHistroyItem.value, 0, 0);
      const moveX: number = event.pageX - offsetLeft;
      const moveY: number = event.pageY - offsetTop;
      const { pointX, pointY } = generateLinePoint(moveX, moveY, wrap, this.translatePointXVal, this.translatePointYVal, canvasScale);
      const width = pointX - startX;
      const height = pointY - startY;
      context.fillStyle = "violet";
      context.globalAlpha = 0.5;
      context.fillRect(startX, startY, width, height);
      context.stroke();
    };
    window.onmouseup = (event: MouseEvent) => {
      context?.putImageData(imageData, 0, 0);
      // const moveX: number = event.pageX - offsetLeft;
      // const moveY: number = event.pageY - offsetTop;
      // const { pointX, pointY } = generateLinePoint(moveX, moveY, wrap, this.translatePointXVal, this.translatePointYVal, canvasScale);
      // const width = pointX - startX;
      // const height = pointY - startY;
      // context.clearRect(startX, startY, width, height);
      // const saveimgData: ImageData = context.getImageData(0, 0, canvas.width, canvas.height);
      // this.setCanvasHistroyList(getID(8), operateType.DOODLE, saveimgData);
      imageData = null;
      window.onmousemove = null;
      window.onmouseup = null;
    };
  }
  /**
   * 擦除
   * @param downX 鼠标点击的X轴坐标
   * @param downY 鼠标点击的Y轴坐标
   * @returns
   */
  handleEraserMode(downX: number, downY: number) {
    const wrap = this._wrapDom;
    const canvas = this._signCanvas;
    const canvasScale = this._canvasScale;
    const context: CanvasRenderingContext2D | undefined | null = canvas?.getContext("2d");
    if (!canvas || !wrap || !context) return;

    const offsetLeft: number = canvas.offsetLeft;
    const offsetTop: number = canvas.offsetTop;
    const { pointX, pointY } = generateLinePoint(downX, downY, wrap, this.translatePointXVal, this.translatePointYVal, canvasScale);

    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    // 设置画笔起点
    context.moveTo(pointX, pointY);
    canvas.onmousemove = null;
    canvas.onmousemove = (event: MouseEvent) => {
      const moveX: number = event.pageX - offsetLeft;
      const moveY: number = event.pageY - offsetTop;

      const { pointX, pointY } = generateLinePoint(moveX, moveY, wrap, this.translatePointXVal, this.translatePointYVal, canvasScale);
      context.lineWidth = this._lineWidth;
      context.lineTo(pointX, pointY);
      context.stroke();
    };
    canvas.onmouseup = () => {
      console.log(JSON.stringify(this.canvasHistroyList.itemList), "handleEraserMode");
      context.closePath();
      canvas.onmousemove = null;
      canvas.onmouseup = null;
    };
  }
  /**
   * 保存图片
   * @param name
   */
  canvasSaveImage(name: string) {
    const mergeCanvas = document.createElement("canvas");
    const canvas = this._canvas;
    const signCanvas = this._signCanvas;
    mergeCanvas.width = this._canvas.width;
    mergeCanvas.height = this._canvas.height;
    const ctx = mergeCanvas.getContext("2d");
    ctx.drawImage(canvas, 0, 0);// 参数可自定义
    ctx.drawImage(signCanvas, 0, 0);// 参数可自定义
    const aLink = document.createElement("a");
    aLink.href = mergeCanvas.toDataURL("image/png");
    if (name) {
      aLink.download = `${name}.png`;
    } else {
      aLink.download = `${new Date().getTime()}.png`;
    }
    aLink.click();
  }
  /**
   * 撤销回滚
   */
  handleRollBack() {
    const signCanvas = this._signCanvas;
    const _canvasHistroySub = this.canvasHistroySub - 1;
    const context: CanvasRenderingContext2D | undefined | null = signCanvas?.getContext("2d");
    if (!signCanvas || !context || _canvasHistroySub < 0) return;
    const canvasHistroyItem = this.canvasHistroyList.getCanvasHistroyAccordingIndex(_canvasHistroySub);
    if (canvasHistroyItem.type === operateType.DOODLE && canvasHistroyItem.value) {
      context?.putImageData(canvasHistroyItem.value, 0, 0);
    }
    this.canvasHistroySub = _canvasHistroySub;
  }
  /**
   * 恢复
   */
  handleRollForward() {
    const signCanvas = this._signCanvas;
    const canvasHistroyLength = this.canvasHistroyList.getlistLength();
    if (this.canvasHistroySub === canvasHistroyLength) return;

    const _canvasHistroySub = this.canvasHistroySub + 1;
    const context: CanvasRenderingContext2D | undefined | null = signCanvas?.getContext("2d");
    if (!signCanvas || !context) return;

    const canvasHistroyItem = this.canvasHistroyList.getCanvasHistroyAccordingIndex(_canvasHistroySub);
    if (canvasHistroyItem.type === operateType.DOODLE && canvasHistroyItem.value) {
      context?.putImageData(canvasHistroyItem.value, 0, 0);
    }

    this.canvasHistroySub = _canvasHistroySub;
  }
  /**
   * 设置鼠标样式
   */
  handleMouseModeChange(value) {
    const wrap = this._wrapDom;
    const signCanvas = this._signCanvas;
    if (!signCanvas || !wrap) return;
    switch (value) {
      case "MOVE_MODE":
        signCanvas.style.cursor = "move";
        wrap.style.cursor = "move";
        break;
      case "LINE_MODE":
        signCanvas.style.cursor = `url('http://cdn.algbb.cn/pencil.ico') 0 16, pointer`;
        wrap.style.cursor = "default";
        break;
      case "ERASER_MODE":
        signCanvas.style.cursor = `url('http://cdn.algbb.cn/eraser.ico') 0 16, pointer`;
        wrap.style.cursor = "default";
        break;
      default:
        signCanvas.style.cursor = "default";
        wrap.style.cursor = "default";
        break;
    }
  }
}

module.exports = pictureEditor;
