
const { PORT  } = require('./constant')
const defualtOptions = {
  webpackConfig: {},
  nodeAuthInfo: { 
    __auth_user_id__: 0, 
    __auth_node_id__: 0, 
    __auth_node_name__: '', 
    __page_build_id: '', 
    __page_build_entity_id: '', 
    __page_build_sub_releases: [] 
  } 
}

module.exports = defualtOptions