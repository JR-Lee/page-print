export declare interface Columns {
    width: number;
    height: number;
}
export declare type PrintType = 'A1' | 'A2' | 'A3' | 'A4' | 'A5';
export declare type ElementType = HTMLElement | HTMLCanvasElement;
export declare interface PrintOpts {
    el: ElementType | string;
    type?: PrintType;
    ratio?: number;
    emptyWrap?: boolean;
    pageWrapStyle?: Partial<CSSStyleDeclaration>;
    pageContentStyle?: Partial<CSSStyleDeclaration>;
    pageHandler?: (pageEl: HTMLElement) => void;
    wrapHandler?: (wrapEl: HTMLElement) => HTMLElement;
}
declare const _default: {
    type: PrintType[];
    print: (opts: PrintOpts) => Promise<void>;
};
export default _default;
