# freelog-markdown-parser

markdown解析器，支持渲染freelog资源（如：图片、视频）

## markdown中的freelog资源
```markdown
![freelog-resource](chtes/image03)
```

## 使用方法
```html
<freelog-markdown-parser presentableId="5ea7f1ef0e7cff0020493fff"></freelog-markdown-parser>
```

```js
import '@freelog/freelog-markdown-parser'
const mdParser = document.createElement('freelog-markdown-parser')
mdParser.setAttribute('presentableId', '5ea7f1ef0e7cff0020493fff')
document.querySelector('#freelog-app').appendChild(mdParser)
```

## 构建与发布

```
npm run build && npm run publish
```