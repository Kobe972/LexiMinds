"use strict";var _baseComponent=_interopRequireDefault(require("../helpers/baseComponent")),_classNames=_interopRequireDefault(require("../helpers/libs/classNames")),_shallowEqual=_interopRequireDefault(require("../helpers/libs/shallowEqual")),_fieldNamesBehavior=_interopRequireDefault(require("../helpers/mixins/fieldNamesBehavior")),_props=require("./props"),_utils=require("./utils");function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function ownKeys(t,e){var r,a=Object.keys(t);return Object.getOwnPropertySymbols&&(r=Object.getOwnPropertySymbols(t),e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),a.push.apply(a,r)),a}function _objectSpread(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(r),!0).forEach(function(e){_defineProperty(t,e,r[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))})}return t}function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_unsupportedIterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,t){var r;if(e)return"string"==typeof e?_arrayLikeToArray(e,t):"Map"===(r="Object"===(r=Object.prototype.toString.call(e).slice(8,-1))&&e.constructor?e.constructor.name:r)||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(e,t):void 0}function _iterableToArray(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,a=new Array(t);r<t;r++)a[r]=e[r];return a}function _defineProperty(e,t,r){return(t=_toPropertyKey(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function _toPropertyKey(e){e=_toPrimitive(e,"string");return"symbol"==_typeof(e)?e:String(e)}function _toPrimitive(e,t){if("object"!=_typeof(e)||!e)return e;var r=e[Symbol.toPrimitive];if(void 0===r)return("string"===t?String:Number)(e);r=r.call(e,t||"default");if("object"!=_typeof(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}(0,_baseComponent.default)({behaviors:[_fieldNamesBehavior.default],properties:_props.props,data:{inputValue:[],cols:[]},observers:_defineProperty({},"value, options",function(e,t){var r=this.getFieldNames(),t=(0,_utils.getRealCols)(t,r);(0,_shallowEqual.default)(this.data.cols,t)||this.setData({cols:t}),this.setValue(e,!0)}),methods:{updated:function(e,t){this.data.inputValue===e&&!t||this.setData({inputValue:e})},setValue:function(e,t){e=this.getValue(e).value;this.updated(e,t)},getValue:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:this.data.inputValue,t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:this.data.cols,r=this.getFieldNames(),e=(0,_utils.getRealValues)(Array.isArray(e)?e:[],t,r),a=_toConsumableArray(e),o=(0,_utils.getIndexesFromValues)(e,t,r);return{value:e,displayValue:(0,_utils.getLabelsFromIndexes)(o,t,r.label),selectedIndex:o,selectedValue:a,cols:t}},onChange:function(e,t,r){var a=_toConsumableArray(this.data.inputValue);a[e]=t,r&&this.triggerEvent(r,_objectSpread(_objectSpread({},this.getValue(a)),{},{index:e}))},onBeforeChange:function(e){var t=e.detail.value,e=e.currentTarget.dataset.index;this.onChange(e,t,"beforeChange")},onValueChange:function(e){var t=e.detail.value,e=e.currentTarget.dataset.index;this.onChange(e,t,"valueChange")},onScrollChange:function(e){var t=e.detail.value,e=e.currentTarget.dataset.index;this.onChange(e,t,"scrollChange")}},attached:function(){var e=this.data,t=e.value,e=e.options,r=this.getFieldNames(),e=(0,_utils.getRealCols)(e,r);this.setData({cols:e}),this.setValue(t)}});