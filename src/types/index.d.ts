export declare interface Columns {
  width: number;
  height: number;
}

export declare type PrintType = 'A1' | 'A2' | 'A3' | 'A4' | 'A5'

export declare type ElementType = HTMLElement | HTMLCanvasElement

export declare interface PrintOpts {
  el: ElementType | string; // 目标 dom
  type?: PrintType; // 打印规格
  ratio?: number; // 分辨率，默认 1
  emptyWrap?: boolean; // 执行 print 后是否清空 wrap
  removeIframe?: boolean; // 执行 print 后是否移除 iframe
  pageItemStyle?: Partial<CSSStyleDeclaration>; // 每一页的样式
  pageHandler?: (pageEl: HTMLElement) => void; // 每一页的回调
  wrapHandler?: (wrapEl: HTMLElement) => HTMLElement; // wrap 的回调
}
