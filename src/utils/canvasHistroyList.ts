// eslint-disable-next-line no-unused-vars
import { operateType } from "./operateTypeEnum";
export default class CanvasHistroyList<T> {
    private canvasHistroys: { [key: string]: CanvasHistroyValue<T> };
    private canvasHistroyList: Array<any>;
    // public canvasHistroySub:number;
    constructor() {
      // super();
      this.canvasHistroys = {};
      this.canvasHistroyList = [];
    }
    reset() {
      this.canvasHistroys = {};
      this.canvasHistroyList = [];
    }
    set(key: string, type: operateType, valitem: any): void {
      let tempVal = new CanvasHistroyValue<T>();
      tempVal.key = key;
      tempVal.type = type;
      tempVal.value = valitem;
      let sub = this.canvasHistroyList.length;
      if (this.has(key)) {
        sub = this.canvasHistroys[key].index;
        tempVal = this.canvasHistroys[key];
        tempVal.value = valitem;
      }
      tempVal.index = sub;
      this.canvasHistroyList[sub] = tempVal;
      this.canvasHistroys[key] = tempVal;
      // this.operateActionSub = this.canvasHistroyList.length;
    }
    /** 校验绘制的线条是否已存储 */
    has(key: string): boolean {
      return key in this.canvasHistroys;
    }
    /** 返回所有绘制点 */
    all(): Array<any> {
      return this.canvasHistroyList;
    }
    getlistLength(): number {
      return this.canvasHistroyList.length - 1;
    }
    getLastCanvasHistroy():any {
      return this.canvasHistroyList[this.canvasHistroyList.length - 1];
    }
    getCanvasHistroyAccordingIndex(index: number): any {
      return this.canvasHistroyList[index];
    }
    setCanvasHistroyListAccordingIndex(index: number): any {
      const deleteCount = this.canvasHistroyList.length - index;
      if (deleteCount < 0) return;
      this.canvasHistroyList.splice(index + 1, deleteCount);
    }
}
class CanvasHistroyValue<T> {
    public key: string;
    public value: T;
    public index: number;
    public type: operateType;
}
