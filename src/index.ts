import html2canvas, { Options as html2canvasOptions } from 'html2canvas'
import { generateDiv, generateIframe, generateStyleSheet, getScrollbarHeight, isString } from './utils/index'

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
  pageWrapStyle?: Partial<CSSStyleDeclaration>; // 每一页外壳的样式
  pageContentStyle?: Partial<CSSStyleDeclaration>; // 每一页内容的样式
  pageHandler?: (pageEl: HTMLElement) => void; // 每一页的回调
  wrapHandler?: (wrapEl: HTMLElement) => HTMLElement; // wrap 的回调
}

class PagePrint {
  static readonly printTypeList: PrintType[] = [ 'A1', 'A2', 'A3', 'A4', 'A5' ]
  static readonly printTypeMap: Map<PrintType, Columns> = new Map([
    ['A1', { width: 1685, height: 2384 }],
    ['A2', { width: 1190, height: 1168 }],
    ['A3', { width: 842, height: 1191 }],
    ['A4', { width: 595, height: 842 }],
    ['A5', { width: 420, height: 595 }]
  ])

  private wrap: HTMLElement
  private iframe!: HTMLIFrameElement
  opts!: PrintOpts
  column: Columns = {
    width: 0,
    height: 0
  }
  public scrollbarHeight = getScrollbarHeight()

  constructor () {
    this.wrap = generateDiv()
  }
  
  async setWrap (): Promise<void> {
    let target = this.opts.el
    if (isString(target)) target = document.querySelector(target) as ElementType
    if (!target) throw Error(`未找到 el 元素`)

    const { width, height } = this.column

    !this.wrap && (this.wrap = generateDiv())

    const style: Partial<CSSStyleDeclaration> = {
      width: `${width}px`,
      height: `${height}px`,
      columns: `${width}px auto`
    }

    for (const key in style) this.wrap.style[key] = style[key] as string

    this.wrap.innerHTML = target.innerHTML
    
    return new Promise(resolve => setTimeout(() => resolve(), 400))
  }

  setIframe () {
    const { column: { width, height }, opts: { type, pageWrapStyle, pageContentStyle } } = this
    
    const ifr = generateIframe()
    this.iframe = ifr

    const styleObj = {
      'html, body': { height: '100%', margin: '0', padding: '0' },
      '.page-item': {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box',
        ...pageWrapStyle // 这里是自定义样式
      },
      '.page-item > canvas': {
        width: '100%!important',
        height: '100%!important',
        boxSizing: 'border-box',
        ...pageContentStyle
      },
      '@page': {
        size: `${type} portrait`,
        marks: 'none',
        margin: 'auto'
      }
    }

    const styleSheet = generateStyleSheet(styleObj)
    
    ifr.contentDocument?.head.appendChild(styleSheet)
    
    ifr.style.width = `${width + this.scrollbarHeight}px`
    ifr.style.height = `${height}px`
    
    this.iframe = ifr
  }

  async shot () {
    const { column, opts: { wrapHandler, ratio } } = this

    const el = wrapHandler ? wrapHandler(this.wrap) : this.wrap
    
    const content = { width: el.scrollWidth, height: el.scrollHeight }
    
    const columnCount = Math.floor(content.width / column.width)

    const canvasList: HTMLCanvasElement[] = []

    let currentIndex = 0

    const opts: Partial<html2canvasOptions> = {
      allowTaint: true, // 允许图片
      width: column.width, // 画布宽度
      height: column.height, // 画布高度
      windowWidth: content.width, // 内容区宽度
      windowHeight: content.height + this.scrollbarHeight, // 内容区高度
      scrollX: 0, // x 轴偏移
      scrollY: 0, // y 轴偏移
      scale: window.devicePixelRatio * (ratio as number),
      removeContainer: true
    }
    
    while (currentIndex++ < columnCount) {
      const offset = (currentIndex - 1) * column.width
      el.scrollLeft = offset

      const canvas = await html2canvas(el, opts)

      canvasList.push(canvas)
    }
    
    return canvasList
  }
  
  async print () {
    await this.setWrap()

    this.setIframe()

    const {
      iframe: { contentDocument: doc, contentWindow: win },
      opts: { pageHandler, emptyWrap }
    } = this

    const canvasList = await this.shot()

    const fragment = document.createDocumentFragment()
    canvasList.forEach(item => {
      const div = document.createElement('div')
      div.classList.add('page-item')
      div.appendChild(item)
      fragment.appendChild(div)
      pageHandler && pageHandler(div)
    })
    doc?.body.appendChild(fragment)

    win?.print()
    
    document.body.removeChild(this.iframe)
    emptyWrap && (this.wrap.innerHTML = '')
  }
}

let instance: PagePrint | null = null

const singleton = (opts: PrintOpts) => {
  if (!html2canvas) throw new Error('pagePrint：打印依赖 html2canvas，请先安装 html2canvas。')

  if (opts.type && !PagePrint.printTypeList.includes(opts.type)) {
    throw new TypeError(`pagePrint 的 type 参数应为：${PagePrint.printTypeList.join(' | ')}`)
  }

  const defaultOpts: Partial<PrintOpts> = {
    type: 'A4',
    emptyWrap: true,
    ratio: 1
  }
  opts = Object.assign(defaultOpts, opts)
  
  if (!instance) instance = new PagePrint()

  instance.opts = opts
  instance.column = PagePrint.printTypeMap.get(opts.type!) as Columns
  return instance.print()
}

export default {
  type: PagePrint.printTypeList,
  print: singleton
}