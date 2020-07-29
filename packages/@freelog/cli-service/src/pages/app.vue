<template>
  <div class="freelog-alpha-markdownviewer-index">
    <div class="wrapper js-wrapper md-error-wrap">
      <!-- <div class="md-titles">
        <ul class="js-md-titles">
          <li class="md-title"
              @click="setCurrentPresentable(presentable)"
              :class="{selected: current.presentableId === presentable.presentableId}"
              v-for="(presentable, index) in presentables"
              :key="index">
            {{presentable.mdTitle}}
          </li>
        </ul>
      </div> -->
      <div class="md-viewer-wrap article-item">
        <div class="js-md-title">
          <div class="article-title" v-if="presentable">
            <time :datetime="presentable.date">{{presentable.date}}</time>
            <h2>{{presentableName}}</h2>
          </div>
        </div>
        <div class="md-content-viewer article-content">
          <template v-if="presentable == null">
            没有找到文章...
          </template>
          <template v-else-if="errorInfo">
            <span class="error-tip">{{errorInfo.desc}}</span>
            <button class="action-btn" @click="errorHandler">{{errorInfo.tip}}</button>
          </template>
          <div ref="viewer" v-show="presentableId && !errorInfo">
            <img src="//visuals.oss-cn-shenzhen.aliyuncs.com/loading.gif" class="loading-img" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import MarkdownParser from '@freelog/freelog-markdown-parser'
import MarkdownParser from '@freelog/freelog-markdown-parser/markdown/index'
export default {
  name: 'app',

  data() {
    return {
      presentables: [],
      presentablesMap: {},
      presentableSubReleases: {},
      presentable: null,
      presentableId: '',
      presentableName: '',
      entityNid: '',
      current: {},
      authErrorData: null,
      errorInfo: null,
      isMobile: window.FreelogApp.Env.isMobile
    }
  },

  mounted() {
    this.presentableId = this.$root.presentableId
    this.presentableName = this.$root.presentableName
    this.init()
  },

  methods: {
    init() {
      window.FreelogApp.QI.getPresentable(this.presentableId)
        .then(res => {
          if(res.errcode === 0) {
            this.presentable = res.data
            this.setCurrentPresentable()
          }
        })
    },
    setCurrentPresentable() {
      this.loadPresentableData(this.presentableId)
        .then(data => {
          this.renderMarkdown(data)
        })
    },
    loadPresentableData(presentableId) {
      return window.FreelogApp.QI.getPresentableData(presentableId).then((res) => {
        var isError = !res.headers.get('freelog-resource-type')
        var subReleasesText = res.headers.get('freelog-sub-dependencies')
        this.entityNid = res.headers.get('freelog-entity-nid')
        try {
          let subReleases = Buffer.from(subReleasesText,'base64').toString('utf-8')
          subReleases = JSON.parse(subReleases) 
          this.presentableSubReleases[presentableId] = subReleases
        }catch(e) {
          console.error(e)
        }
          
        return isError ? res.json() : res.text()
      })
    },
    renderMarkdown(presentableData) {
      if(typeof presentableData === 'string') {
        this.errorInfo = null
        this.$refs.viewer.innerHTML = ''
        const presentableId = this.presentableId
        const entityNid = this.entityNid

        var markdownParser = new MarkdownParser({
          container: this.$refs.viewer,
          showToc: !this.isMobile,
          presentableId,
          entityNid,
          subReleases: this.presentableSubReleases[presentableId] || [],
          renderImageError($el, data) {
            if ($el) {
              $el.src = ''
              //todo
              if (typeof data === 'string') {
                $el.src = ''
              } else {

              }
            }
            console.log('renderImageError', arguments)
          }
        })
        markdownParser.render(presentableData)
      }else {
        // auth不通过
        this.authErrorData = presentableData
        this.errorInfo = this.resolveErrorInfo(presentableData)
      }
    },
    resolveErrorInfo(resp) {
      var App = window.FreelogApp
      return {
        desc: '存在授权问题',
        tip: resp.msg
      }
    },
    errorHandler() {
      var self = this
      window.FreelogApp.trigger('HANDLE_INVALID_RESPONSE', {
        response: self.authErrorData,
        callback: function () {
          self.loadPresentableData(self.presentableId).then(data => {
            this.renderMarkdown(data)
          })
        }
      })
    },
    changeMarkdownView() {},
  }
}
</script>


<style lang="less" scoped>
  .freelog-alpha-markdownviewer-index {
    .wrapper {
      padding: 15px 0;
      background: white;
      min-height: 100vh;
    }

    .md-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      line-height: 1.5;
      transition: all .2s;
      margin: 4px 0 8px 0;
      padding: 10px 10px 10px 28px;
      font-size: 14px;
      &.selected {
        border-right: 3px solid #1890ff;
        font-weight: 600;
        color: #1890ff;
        background-color: #e6f7ff;
        span {
          color: #007bff;
        }
      }
    }

    .md-title:hover {
      color: #1890ff;
    }

    .md-titles {
      width: 300px;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      overflow: auto;
      background: #fafafa;
      z-index: 1;
      padding: 10px 0;
      border-right: 1px solid rgba(0, 0, 0, 0.07);
      border-radius: 2px;
    }

    .md-viewer-wrap {
      background: #fff;
      margin-left: 35px;
      margin-right: 330px;
      overflow: auto;
    }

    .md-error-wrap {
      // margin-right: 30px;
    }

    .article-title {
      margin-bottom: 5px;
      padding: 20px 30px;
      border-bottom: 1px solid #e2edf9;

      h2 { font-size: 30px; }
    }

    .article-title time {
      font-size: 16px;
      color: #aaa;
      float: right;
      height: 58px;
      line-height: 58px;
      padding-right: 40px;
    }

    .article-item {
      border: 1px solid #ddd;
      border-radius: 3px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    }

    .article-content {
      padding: 20px 30px;
      overflow: auto;
    }

    .error-tip {
      color: #E6A23C;
    }

    .action-btn {
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      border: 1px solid #b3d8ff;
      text-align: center;
      box-sizing: border-box;
      outline: none;
      padding: 6px 9px;
      font-size: 14px;
      border-radius: 4px;
      color: #409eff;
      background: #ecf5ff;
      cursor: pointer;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }

    .fadeIn {
      -webkit-animation-name: fadeIn;
      animation-name: fadeIn;
      -webkit-animation-duration: 1s;
      animation-duration: 1s;
      -webkit-animation-fill-mode: both;
      animation-fill-mode: both;
    }
  }

@media screen and (max-width: 768px) {
  .freelog-alpha-markdownviewer-index {
    .md-viewer-wrap { margin-right: 15px; }
  }
}
</style>
