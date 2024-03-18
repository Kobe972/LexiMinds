"use strict";var _baseComponent=_interopRequireDefault(require("../helpers/baseComponent")),_classNames2=_interopRequireDefault(require("../helpers/libs/classNames")),_index=require("../index"),_utils=require("./utils");function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function ownKeys(e,t){var r,o=Object.keys(e);return Object.getOwnPropertySymbols&&(r=Object.getOwnPropertySymbols(e),t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),o.push.apply(o,r)),o}function _objectSpread(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?ownKeys(Object(r),!0).forEach(function(t){_defineProperty(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}function _defineProperty(t,e,r){return(e=_toPropertyKey(e))in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function _toPropertyKey(t){t=_toPrimitive(t,"string");return"symbol"==_typeof(t)?t:String(t)}function _toPrimitive(t,e){if("object"!=_typeof(t)||!t)return t;var r=t[Symbol.toPrimitive];if(void 0===r)return("string"===e?String:Number)(t);r=r.call(t,e||"default");if("object"!=_typeof(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}var _toast=null;(0,_baseComponent.default)({useFunc:!0,data:_utils.defaults,computed:{classes:["prefixCls, icon",function(t,e){return{wrap:(0,_classNames2.default)(t),content:(0,_classNames2.default)("".concat(t,"__content"),_defineProperty({},"".concat(t,"__content--has-icon"),e)),icon:"".concat(t,"__icon"),text:"".concat(t,"__text")}}]},methods:{hide:function(){if(this.removed)return!1;this.removed=!0,_toast&&(clearTimeout(_toast.timeout),_toast=null),this.$$setData({in:!1}),this.$wuxBackdrop&&this.$wuxBackdrop.release(),"function"==typeof this.fns.success&&this.fns.success()},show:function(o){function t(){_toast&&_toast.hide.call(n)}var n=this,r=("string"==typeof o&&(o=Object.assign({},{text:arguments[0]},arguments[1])),new Promise(function(t){var e=n.$$mergeOptionsAndBindMethods(Object.assign({},_utils.defaults,o)),r=_utils.iconTypes[e.type]||e.icon;e.icon=r,n.removed=!1,n.$$setData(_objectSpread({in:!0},e)),n.$wuxBackdrop&&n.$wuxBackdrop.retain(),_toast&&(clearTimeout(_toast.timeout),_toast=null),(_toast={hide:n.hide}).timeout=setTimeout(function(){return n.hide(),t(!0)},Math.max(0,e.duration))}));return t.then=function(t,e){return r.then(t,e)},t.promise=r,t},success:function(t){return"string"==typeof t&&(t=Object.assign({},{text:arguments[0]},arguments[1])),this.show(Object.assign(_objectSpread(_objectSpread({},t),{},{type:"success"})))},warning:function(t){return"string"==typeof t&&(t=Object.assign({},{text:arguments[0]},arguments[1])),this.show(Object.assign(_objectSpread(_objectSpread({},t),{},{type:"forbidden"})))},error:function(t){return"string"==typeof t&&(t=Object.assign({},{text:arguments[0]},arguments[1])),this.show(Object.assign(_objectSpread(_objectSpread({},t),{},{type:"cancel"})))},info:function(t){return"string"==typeof t&&(t=Object.assign({},{text:arguments[0]},arguments[1])),this.show(Object.assign(_objectSpread(_objectSpread({},t),{},{type:"text"})))}},created:function(){this.data.mask&&(this.$wuxBackdrop=(0,_index.$wuxBackdrop)("#wux-backdrop",this))}});