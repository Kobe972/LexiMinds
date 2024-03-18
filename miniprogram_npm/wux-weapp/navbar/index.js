"use strict";var _baseComponent=_interopRequireDefault(require("../helpers/baseComponent")),_classNames2=_interopRequireDefault(require("../helpers/libs/classNames"));function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _defineProperty(e,t,r){return(t=_toPropertyKey(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function _toPropertyKey(e){e=_toPrimitive(e,"string");return"symbol"==_typeof(e)?e:String(e)}function _toPrimitive(e,t){if("object"!=_typeof(e)||!e)return e;var r=e[Symbol.toPrimitive];if(void 0===r)return("string"===t?String:Number)(e);r=r.call(e,t||"default");if("object"!=_typeof(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}(0,_baseComponent.default)({properties:{prefixCls:{type:String,value:"wux-navbar"},theme:{type:String,value:"light"},title:{type:String,value:""},leftText:{type:String,value:""},rightText:{type:String,value:""}},computed:{classes:["prefixCls, theme",function(e,t){return{wrap:(0,_classNames2.default)(e,_defineProperty({},"".concat(e,"--").concat(t),t)),left:"".concat(e,"__left"),text:"".concat(e,"__text"),title:"".concat(e,"__title"),right:"".concat(e,"__right")}}]},methods:{onClick:function(e){e=e.currentTarget.dataset.type;this.triggerEvent("click",{type:e})}}});