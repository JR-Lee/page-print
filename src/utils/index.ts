/**
 * 获取浏览器 x 轴滚动条高度
 */
export const getScrollbarHeight = (): number => {
  const div = document.createElement('div')
  const styleList: Partial<CSSStyleDeclaration> = {
    position: 'fixed',
    zIndex: '-1000',
    width: '0px',
    height: 'auto',
    visibility: 'hidden',
    overflowX: 'scroll'
  }
  for (const key in styleList) div.style[key] = styleList[key] as string
  document.body.appendChild(div)
  const height = div.getBoundingClientRect().height
  document.body.removeChild(div)
  return height
}

/**
 * 是否为字符串
 * @param val unknown
 */
export const isString = (val: unknown): val is string => typeof val === 'string'

/**
 * 创建 div
 */
export const generateDiv = (): HTMLElement => {
  const div: HTMLElement = document.createElement('div')

  const style: Partial<CSSStyleDeclaration> = {
    position: 'fixed',
    top: '0px',
    left: '0px',
    zIndex: '-1000',
    padding: '0px',
    overflowX: 'auto',
    columnGap: '0px',
    columnFill: 'auto',
    background: 'rgb(255, 255, 255)',
    boxSizing: 'border-box'
  }

  for (const key in style) div.style[key] = style[key] as string

  document.body.appendChild(div)
  
  return div
}

/**
 * 创建 iframe
 */
export const generateIframe = (): HTMLIFrameElement => {
  const ifr = document.createElement('iframe')

  const inlineStyle: Partial<CSSStyleDeclaration> = {
    position: 'fixed',
    zIndex: '-1000',
    top: '0px',
    left: '0px',
    display: 'none',
    border: 'none'
  }

  for (const key in inlineStyle) ifr.style[key] = inlineStyle[key] as string

  document.body.appendChild(ifr)

  return ifr
}

/**
 * 驼峰转横杠
 * @param val string
 * e.g. borderRadius -> border-radius 
 */
export const humpToHyphen = (val: string): string => {
  const reg = /[A-Z]/g
  return val.replace(reg, match => '-' + match.toLowerCase())
}

/**
 * 创建 styleSheet
 */
interface StyleObj {
  [selector: string]: Partial<CSSStyleDeclaration>;
}
export const generateStyleSheet = (styleObj: StyleObj): HTMLStyleElement => {
  const style = document.createElement('style')

  let innerHTML = ''

  for (const selector in styleObj) {
    const ruleArr = []
    for (const prop in styleObj[selector]) {
      ruleArr.push(`${ humpToHyphen(prop) }: ${ styleObj[selector][prop] }`)
    }

    innerHTML += `${ selector } { ${ ruleArr.join('; ') } } `
  }

  style.innerText = innerHTML

  return style
}