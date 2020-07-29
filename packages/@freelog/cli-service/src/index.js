

var template = require('./index.html');

class FreelogAlphaMarkdownviewer extends HTMLElement {
  constructor() {
    super()
    this.presentableId = this.dataset.presentableId
  }

  connectedCallback() {
    this.innerHTML = template
  }
}

console.log('-sdfad212112fasdfasdfa+', window.__auth_info__)

customElements.define('freelog-alpha-markdownviewer', FreelogAlphaMarkdownviewer);

