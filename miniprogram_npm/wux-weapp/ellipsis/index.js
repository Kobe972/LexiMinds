"use strict";var _baseComponent=_interopRequireDefault(require("../helpers/baseComponent")),_classNames=_interopRequireDefault(require("../helpers/libs/classNames")),_styleToCssString=_interopRequireDefault(require("../helpers/libs/styleToCssString")),_runes=_interopRequireDefault(require("../helpers/libs/runes2")),_pxToNumber=require("../helpers/shared/pxToNumber"),_useDOM=require("../helpers/hooks/useDOM");function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _slicedToArray(e,t){return _arrayWithHoles(e)||_iterableToArrayLimit(e,t)||_unsupportedIterableToArray(e,t)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,t){var r;if(e)return"string"==typeof e?_arrayLikeToArray(e,t):"Map"===(r="Object"===(r=Object.prototype.toString.call(e).slice(8,-1))&&e.constructor?e.constructor.name:r)||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(e,t):void 0}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function _iterableToArrayLimit(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,i,o,a,l=[],s=!0,c=!1;try{if(o=(r=r.call(e)).next,0===t){if(Object(r)!==r)return;s=!1}else for(;!(s=(n=o.call(r)).done)&&(l.push(n.value),l.length!==t);s=!0);}catch(e){c=!0,i=e}finally{try{if(!s&&null!=r.return&&(a=r.return(),Object(a)!==a))return}finally{if(c)throw i}}return l}}function _arrayWithHoles(e){if(Array.isArray(e))return e}function ownKeys(t,e){var r,n=Object.keys(t);return Object.getOwnPropertySymbols&&(r=Object.getOwnPropertySymbols(t),e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)),n}function _objectSpread(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(r),!0).forEach(function(e){_defineProperty(t,e,r[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))})}return t}function _defineProperty(e,t,r){return(t=_toPropertyKey(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function _toPropertyKey(e){e=_toPrimitive(e,"string");return"symbol"==_typeof(e)?e:String(e)}function _toPrimitive(e,t){if("object"!=_typeof(e)||!e)return e;var r=e[Symbol.toPrimitive];if(void 0===r)return("string"===t?String:Number)(e);r=r.call(e,t||"default");if("object"!=_typeof(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}function getSubString(e,t,r){return e.slice(t,r).join("")}(0,_baseComponent.default)({properties:{prefixCls:{type:String,value:"wux-ellipsis"},content:{type:String,value:""},direction:{type:String,value:"end"},defaultExpanded:{type:Boolean,value:!1},expandText:{type:String,value:""},collapseText:{type:String,value:""},rows:{type:Number,value:1}},data:{ellipsised:{leading:"",tailing:""},expanded:!1,exceeded:!1,innerText:"",end:-1,containerStyle:""},observers:_defineProperty({},"prefixCls, content, direction, rows, expandText, collapseText",function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var n=t[0],i=t[1],o=t[2],a=t[3],l=t[4],s=t[5];this.calcEllipsised({prefixCls:n,content:i,direction:o,rows:a,expandText:l,collapseText:s})}),computed:{classes:["prefixCls",function(e){return{wrap:(0,_classNames.default)(e),container:(0,_classNames.default)(e,["".concat(e,"--container")]),expanded:"".concat(e,"__expanded"),collapsed:"".concat(e,"__collapsed")}}]},methods:{onTap:function(){this.triggerEvent("click")},setExpanded:function(e){e=e.target.dataset.expanded;this.setDataPromise({expanded:"1"===e})},calcEllipsised:function(r){function n(e){o.data.exceeded!==e&&o.setDataPromise({exceeded:e})}function i(e){o.data.ellipsised!==e&&o.setDataPromise({ellipsised:e})}var o=this,e=(0,_runes.default)(r.content),a=r.content.length,l=Math.floor((0+a)/2),t={innerText:r.content,chars:e,end:a,middle:l,containerStyle:""};this.getRootRef().then(function(e){return o.setDataPromise(_objectSpread(_objectSpread({},t),{},{containerStyle:(0,_styleToCssString.default)({width:e.width,wordBreak:e.wordBreak}),removeContainer:!1})).then(function(){return Promise.all([Promise.resolve(e),o.getContainerRef()])})}).then(function(e){var e=_slicedToArray(e,2),t=e[0];e[1].clientHeight<=t.maxHeight?n(!1):(n(!0),("middle"===r.direction?o.checkMiddle([0,l],[l,a],o.data):o.check(0,a,o.data)).then(i))})},check:function(r,n,i){var o,a=this,e=i.chars,t=i.content.length,l=i.expanded?i.collapseText:i.expandText;return n-r<=1?"end"===i.direction?Promise.resolve({leading:getSubString(e,0,r)+"..."}):Promise.resolve({tailing:"..."+getSubString(e,n,t)}):(o=Math.round((r+n)/2),l="end"===i.direction?getSubString(e,0,o)+"..."+l:l+"..."+getSubString(e,o,t),this.setDataPromise({innerText:l}).then(function(){return Promise.all([a.getRootRef(),a.getContainerRef()])}).then(function(e){var e=_slicedToArray(e,2),t=e[0];return e[1].clientHeight<=t.maxHeight?"end"===i.direction?a.check(o,n,i):a.check(r,o,i):"end"===i.direction?a.check(r,o,i):a.check(o,n,i)}))},checkMiddle:function(r,n,i){var o,a,l=this,e=i.chars,t=i.content.length,s=i.expanded?i.collapseText:i.expandText;return r[1]-r[0]<=1&&n[1]-n[0]<=1?Promise.resolve({leading:getSubString(e,0,r[0])+"...",tailing:"..."+getSubString(e,n[1],t)}):(o=Math.floor((r[0]+r[1])/2),a=Math.ceil((n[0]+n[1])/2),s=getSubString(e,0,o)+"..."+s+"..."+getSubString(e,a,t),this.setDataPromise({innerText:s}).then(function(){return Promise.all([l.getRootRef(),l.getContainerRef()])}).then(function(e){var e=_slicedToArray(e,2),t=e[0];return e[1].clientHeight<=t.maxHeight?l.checkMiddle([o,r[1]],[n[0],a],i):l.checkMiddle([r[0],o],[a,n[1]],i)}))},setDataPromise:function(t){var r=this;return new Promise(function(e){r.setData(t,e)})},getContainerRef:function(){var e=this.data.prefixCls;return(0,_useDOM.useRef)(".".concat(e,"--container"),this)},getRootRef:function(){var e=this.data,t=e.prefixCls,n=e.rows;return(0,_useDOM.useComputedStyle)(".".concat(t),["width","wordBreak","lineHeight","paddingTop","paddingBottom"],this).then(function(e){var t=(0,_pxToNumber.pxToNumber)(e.width),r=(0,_pxToNumber.pxToNumber)(e.lineHeight),r=Math.floor(r*(n+.5)+(0,_pxToNumber.pxToNumber)(e.paddingTop)+(0,_pxToNumber.pxToNumber)(e.paddingBottom));return{width:t,wordBreak:e.wordBreak,maxHeight:r}})}},attached:function(){var e=this.data,t=e.defaultExpanded;this.setDataPromise({expanded:t}),this.calcEllipsised(_objectSpread(_objectSpread({},e),{},{expanded:t}))}});