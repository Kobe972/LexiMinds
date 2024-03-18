"use strict";var _baseComponent=_interopRequireDefault(require("../helpers/baseComponent")),_classNames4=_interopRequireDefault(require("../helpers/libs/classNames")),_eventsMixin=_interopRequireDefault(require("../helpers/mixins/eventsMixin")),_styleToCssString=_interopRequireDefault(require("../helpers/libs/styleToCssString")),_bound=require("../helpers/shared/bound"),_props=require("./props");function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function ownKeys(t,e){var r,n=Object.keys(t);return Object.getOwnPropertySymbols&&(r=Object.getOwnPropertySymbols(t),e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)),n}function _objectSpread(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(r),!0).forEach(function(e){_defineProperty(t,e,r[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))})}return t}function _defineProperty(e,t,r){return(t=_toPropertyKey(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function _toPropertyKey(e){e=_toPrimitive(e,"string");return"symbol"==_typeof(e)?e:String(e)}function _toPrimitive(e,t){if("object"!=_typeof(e)||!e)return e;var r=e[Symbol.toPrimitive];if(void 0===r)return("string"===t?String:Number)(e);r=r.call(e,t||"default");if("object"!=_typeof(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}var defaultEvents={onChange:function(){},onFocus:function(){},onBlur:function(){},onConfirm:function(){},onClear:function(){},onError:function(){}};(0,_baseComponent.default)({behaviors:[(0,_eventsMixin.default)({defaultEvents:defaultEvents})],relations:{"../field/index":{type:"ancestor"}},properties:_objectSpread(_objectSpread({},_props.nativeInputProps),{},{prefixCls:{type:String,value:"wux-input"},label:{type:String,value:""},extra:{type:String,value:""},defaultValue:{type:String,value:""},value:{type:String,value:"",observer:function(e){this.data.controlled&&this.updated(e)}},controlled:{type:Boolean,value:!1},disabled:{type:Boolean,value:!1},readOnly:{type:Boolean,value:!1},clear:{type:Boolean,value:!1},error:{type:Boolean,value:!1},labelWrap:{type:Boolean,value:!1},requiredMark:{type:Boolean,value:!1},onlyShowClearWhenFocus:{type:Boolean,value:!0},min:{type:Number,value:null},max:{type:Number,value:null},visibilityToggle:{type:Boolean,value:!1}}),data:{inputValue:"",inputFocus:!1,shouldShowClear:!1,internalPlaceholderStyle:"",internalVisible:!1},observers:_defineProperty({placeholderStyle:function(e){this.setInternalPlaceholderStyle(e)}},"clear, disabled, readOnly, inputValue, inputFocus, onlyShowClearWhenFocus",function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var n=t[0],o=t[1],a=t[2],i=t[3],l=t[4],u=t[5];this.setClear({clear:n,disabled:o,readOnly:a,inputValue:i,inputFocus:l,onlyShowClearWhenFocus:u})}),computed:{classes:["prefixCls, disabled, readOnly, inputFocus, error, labelWrap, requiredMark, internalVisible",function(e,t,r,n,o,a,i,l){return{wrap:(0,_classNames4.default)(e,_defineProperty(_defineProperty(_defineProperty(_defineProperty({},"".concat(e,"--focus"),n),"".concat(e,"--disabled"),t),"".concat(e,"--readonly"),r),"".concat(e,"--error"),o)),label:(0,_classNames4.default)("".concat(e,"__label"),_defineProperty(_defineProperty({},"".concat(e,"__label--wrap"),a),"".concat(e,"__label--required"),i)),control:"".concat(e,"__control"),item:"".concat(e,"__item"),clear:"".concat(e,"__clear"),eye:(0,_classNames4.default)("".concat(e,"__eye"),_defineProperty({},"".concat(e,"__eye--invisible"),!l)),error:"".concat(e,"__error"),extra:"".concat(e,"__extra"),keyboardAccessory:"".concat(e,"__keyboardAccessory")}}]},methods:{onInternalVisibleChange:function(){var e;this.data.disabled||(e=!this.data.internalVisible,this.setData({internalVisible:e}))},setInternalPlaceholderStyle:function(e){e=(0,_styleToCssString.default)(e);this.data.internalPlaceholderStyle!==e&&this.setData({internalPlaceholderStyle:e})},setClear:function(e){e=!(!e.clear||!e.inputValue||e.disabled||e.readOnly)&&(!e.onlyShowClearWhenFocus||e.inputFocus);this.data.shouldShowClear!==e&&this.setData({shouldShowClear:e})},checkValue:function(){var e=this.data,t=e.inputValue,r=t;(r="number"!==e.type&&"digit"!==e.type?r:r&&(0,_bound.bound)(parseFloat(r),null!==e.min?e.min:void 0,null!==e.max?e.max:void 0).toString())!==t&&(this.data.controlled||this.updated(r),this.triggerEvent("change",{value:r}))},updated:function(e){this.hasFieldDecorator||this.data.inputValue!==e&&this.setData({inputValue:e})},onChange:function(e){var t=e.detail.value;this.data.controlled||this.updated(t),this.triggerEvent("change",e.detail)},onFocus:function(e){this.clearTimer(),this.setData({inputFocus:!0}),this.triggerEvent("focus",e.detail)},onBlur:function(e){this.setTimer(),this.checkValue(),this.triggerEvent("blur",e.detail)},onConfirm:function(e){this.triggerEvent("confirm",e.detail)},onKeyboardHeightChange:function(e){this.triggerEvent("keyboardheightchange",e.detail)},onNicknameReview:function(e){this.triggerEvent("nicknamereview",e.detail)},onClear:function(){var e={value:""};this.data.controlled||this.updated(e.value),this.triggerEvent("change",e),this.triggerEvent("clear",e)},onError:function(){var e=this.data.inputValue;this.triggerEvent("error",{value:e})},setTimer:function(){var e=this;this.clearTimer(),this.timeout=setTimeout(function(){e.setData({inputFocus:!1})},200)},clearTimer:function(){this.timeout&&(clearTimeout(this.timeout),this.timeout=null)}},attached:function(){var e=this.data,t=e.defaultValue,r=e.value,n=e.controlled,e=e.placeholderStyle,n=n?r:t;this.updated(n),this.setClear(_objectSpread(_objectSpread({},this.data),{},{inputValue:n})),this.setInternalPlaceholderStyle(e)}});