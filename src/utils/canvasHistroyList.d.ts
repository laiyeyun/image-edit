import { operateType } from "./operateTypeEnum";
export default class CanvasHistroyList<T> {
    private canvasHistroys;
    private canvasHistroyList;
    constructor();
    reset(): void;
    set(key: string, type: operateType, valitem: any): void;
    /**校验绘制的线条是否已存储 */
    has(key: string): boolean;
    /**返回所有绘制点 */
    all(): Array<any>;
    getlistLength(): number;
    getCanvasHistroyAccordingIndex(index: number): any;
    setCanvasHistroyListAccordingIndex(index: number): any;
}
