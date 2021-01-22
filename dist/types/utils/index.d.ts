/**
 * 获取浏览器 x 轴滚动条高度
 */
export declare const getScrollbarHeight: () => number;
/**
 * 是否为字符串
 * @param val unknown
 */
export declare const isString: (val: unknown) => val is string;
/**
 * 创建 div
 */
export declare const generateDiv: () => HTMLElement;
/**
 * 创建 iframe
 */
export declare const generateIframe: () => HTMLIFrameElement;
/**
 * 驼峰转横杠
 * @param val string
 * e.g. borderRadius -> border-radius
 */
export declare const humpToHyphen: (val: string) => string;
/**
 * 创建 styleSheet
 */
interface StyleObj {
    [selector: string]: Partial<CSSStyleDeclaration>;
}
export declare const generateStyleSheet: (styleObj: StyleObj) => HTMLStyleElement;
export {};
