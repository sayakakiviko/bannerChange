import bannerChange from './index.vue';

export function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('bannerChange', bannerChange);
}
const plugin = {
  install
};

let GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

// 导出组件
export default bannerChange;
export { plugin };
