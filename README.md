# page-print
> page-print 是一个自动分页内容并调用浏览器打印 API 的库。

## 原理
所谓的分页，实际上就是拷贝一份目标 dom 的内容到一个 div 中，然后使用的 CSS3 的列布局（[CSS3 Multiple column layout](https://developer.mozilla.org/zh-cn/docs/web/css/columns)），计算每一页的宽度进行偏移，然后用 [html2canvas](http://html2canvas.hertzen.com/) 进行截图，再把一个个截图（canvas）塞进 iframe 里边，最后调用 iframe.contentWindow.print()。

## 引入
**1. cdn**
``` html
<!-- 需要 html2canvas 截图，所以引入 html2canvas 是必要的 -->
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.7/dist/html2canvas.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/page-print@1.0.1/dist/lib/index.min.js"></script>
```
**2. npm**
 - 安装
 ``` cmd
 npm install --save-dev html2canvas page-print
 ```
 - 导入
 ``` javascript
 import pagePrint from 'page-print'
 ```

## 使用
> page-print 导出了一个对象，如下：

``` javascript
const {
  type, // 是几个内置的打印纸规格数组 [ A1, A2, A3, A4, A5 ]
  print // 方法，主要就是调用这个方法，返回值为 promise
} = pagePrint
```
> pagePrint.print 参数为对象，具体如下：

``` typescript
// 这些参数是根据我之前负责的项目的实际需求来写的，所以可能会觉得有点奇怪，因为项目需求就很奇怪

interface PrintOpts {
  el: HTMLElement | string; // 目标 dom 或者 选择器，必要参数

  type?: PrintType; // 打印规格，默认 A4

  ratio?: number; // 分辨率，默认 1 决定了清晰度

  emptyWrap?: boolean; // 执行 print 后是否清空 wrap

  pageWrapStyle?: Partial<CSSStyleDeclaration>; // 每一页外壳（div.page-item）的样式（可以加点内边距或者边框 e.g. { padding: '2px', border: '2px solid #333' }）

  pageContentStyle?: Partial<CSSStyleDeclaration>; // 每一页内容（canvas）的样式

  pageHandler?: (pageEl: HTMLElement) => void; // 每一页的回调

  wrapHandler?: (wrapEl: HTMLElement) => HTMLElement; // wrap 的回调
}
```

## 最后
我作为一个刚毕业不久的，经验就一年的，喜欢开源的，有点"玻璃心"的小白前端，希望各位大佬轻点喷我的代码。当然如果大佬肯不吝赐教，愿意指点一二的话，打我一顿都行。毕竟“基友易寻，良师难觅”
