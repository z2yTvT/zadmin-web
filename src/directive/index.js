import hasPerm from './permission/hasPerm'

const install = function(Vue) {
  Vue.directive('hasPerm', hasPerm)
}

if (window.Vue) {
  window['hasPerm'] = hasPerm
  Vue.use(install);
}

export default install
