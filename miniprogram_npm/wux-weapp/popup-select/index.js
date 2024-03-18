"use strict";var _baseComponent=_interopRequireDefault(require("../helpers/baseComponent")),_popupMixin=_interopRequireDefault(require("../helpers/mixins/popupMixin")),_useNativeAPI=require("../helpers/hooks/useNativeAPI"),_utils=require("./utils");function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function ownKeys(t,e){var r,n=Object.keys(t);return Object.getOwnPropertySymbols&&(r=Object.getOwnPropertySymbols(t),e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)),n}function _objectSpread(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(r),!0).forEach(function(e){_defineProperty(t,e,r[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))})}return t}function _defineProperty(e,t,r){return(t=_toPropertyKey(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function _toPropertyKey(e){e=_toPrimitive(e,"string");return"symbol"==_typeof(e)?e:String(e)}function _toPrimitive(e,t){if("object"!=_typeof(e)||!e)return e;var r=e[Symbol.toPrimitive];if(void 0===r)return("string"===t?String:Number)(e);r=r.call(e,t||"default");if("object"!=_typeof(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}(0,_baseComponent.default)({behaviors:[(0,_popupMixin.default)(_utils.POPUP_SELECTOR)],properties:_objectSpread({prefixCls:{type:String,value:_utils.POPUP_SELECTOR.substring(1)},virtualized:{type:Boolean,value:!1},notFoundContent:{type:null,value:_objectSpread({},_utils.notFoundContent)}},(0,_utils.getDefaultProps)()),data:{mergedOptions:[],mergedOptionsValueMap:new Map,mergedNotFoundContent:_objectSpread({},_utils.notFoundContent)},observers:_defineProperty(_defineProperty({},"options, multiple",function(e,t){var e=(0,_utils.flattenOptions)(e),r=new Map;e.forEach(function(e,t){r.set(e.value,{option:e,index:t})}),this.setData({mergedOptions:e,mergedOptionsValueMap:r})}),"notFoundContent",function(e){this.renderEmpty(e)}),methods:{renderEmpty:function(e){e=(0,_utils.getNotFoundContent)(e);this.data.mergedNotFoundContent!==e&&this.setData({mergedNotFoundContent:e})},updated:function(e,t){this.hasFieldDecorator&&!t||this.data.inputValue!==e&&this.setData({inputValue:e})},getIndexRef:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:this.data;if(e.multiple){var t=e.value.length;if(0<e.value.length&&e.mergedOptionsValueMap.has(e.value[t-1]))return e.mergedOptionsValueMap.get(e.value[t-1]).index}else if(e.value&&e.mergedOptionsValueMap.has(e.value))return e.mergedOptionsValueMap.get(e.value).index;return-1},scrollToItem:function(e){var t=this.querySelector(_utils.POPUP_SELECTOR);t&&t.scrollToItem(e)},onShow:function(){var t=this,e=this.data.value,r=this.data.inputValue;r!==e&&(r=e),this.hasFieldDecorator&&(e=this.getFieldContext())&&(r=e.data.value,e.changeValue(r)),this.data.inputValue!==r&&this.updated(r),(0,_useNativeAPI.nextTick)(function(){var e=t.getIndexRef(_objectSpread(_objectSpread({},t.data),{},{value:r}));-1!==e&&t.scrollToItem(e)})},getPickerValue:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:this.data.inputValue,t=this.data,r=t.virtualized,t=t.mergedOptions,r=r?t:void 0;return this.picker=this.picker||this.querySelector(_utils.POPUP_SELECTOR),this.picker&&this.picker.getValue(e,r)},onSelectChange:function(e){var t;this.mounted&&(t=e.detail.value,this.updated(t,!0),this.triggerEvent("valueChange",this.formatPickerValue(_objectSpread({},e.detail))))}},ready:function(){this.renderEmpty(this.data.notFoundContent)}});