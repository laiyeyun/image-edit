export declare function getUrlBase64(imgUrl: string): Promise<unknown>;
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
export declare function generateLinePoint(x: number, y: number, wrap: any, translatePointXVal: number, translatePointYVal: number, canvasScale: number): {
    pointX: number;
    pointY: number;
};
/**
 * 生成随机id
 * @param length id长度
 * @returns
 */
export declare function getID(length: any): string;
/**
 * 删除元素下的所有子节点
 * @param event 父节点
 */
export declare function deleteChild(event: any): void;
