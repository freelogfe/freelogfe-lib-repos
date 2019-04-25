{{#if enableShadowDom}}
var cssStr = require('./index.less')
{{else}}
import './index.less'
{{/if}}
var htmlStr = require('./index.html')

class {{widgetName}} extends HTMLElement {
  constructor() {
    super()
    {{#if enableShadowDom}}
    let self = this;
    let shadowRoot = self.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = `<style>${cssStr}</style>` + htmlStr
    self.root = shadowRoot
    {{else}}
    this.innerHTML = htmlStr
    {{/if}}
  }

  connectedCallback (){
    
  }
}


customElements.define('{{name}}', {{widgetName}});
