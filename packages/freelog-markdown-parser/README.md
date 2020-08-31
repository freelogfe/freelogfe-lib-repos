# freelog-markdown-parser

markdown解析器，支持渲染freelog资源（如：图片、视频）

### 使用方法
```html
<freelog-markdown-parser presentableId="5ea7f1ef0e7cff0020493fff"></freelog-markdown-parser>
```

```js
import '@freelog/freelog-markdown-parser'
const mdParser = document.createElement('freelog-markdown-parser')
mdParser.setAttribute('presentableId', '5ea7f1ef0e7cff0020493fff')
document.querySelector('#freelog-app').appendChild(mdParser)
```