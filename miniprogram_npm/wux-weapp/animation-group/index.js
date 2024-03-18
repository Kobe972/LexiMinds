"use strict";var _baseComponent=_interopRequireDefault(require("../helpers/baseComponent")),_styleToCssString=_interopRequireDefault(require("../helpers/libs/styleToCssString"));function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var ENTER="enter",ENTERING="entering",ENTERED="entered",EXIT="exit",EXITING="exiting",EXITED="exited",UNMOUNTED="unmounted",TRANSITION="transition",ANIMATION="animation",TIMEOUT=1e3/60,defaultClassNames={enter:"",enterActive:"",enterDone:"",exit:"",exitActive:"",exitDone:""};(0,_baseComponent.default)({properties:{in:{type:Boolean,value:!1,observer:function(t){this.data.isMounting&&this.updated(t)}},classNames:{type:null,value:defaultClassNames},duration:{type:null,value:null},type:{type:String,value:TRANSITION},appear:{type:Boolean,value:!1},enter:{type:Boolean,value:!0},exit:{type:Boolean,value:!0},mountOnEnter:{type:Boolean,value:!0},unmountOnExit:{type:Boolean,value:!0},wrapCls:{type:String,value:""},wrapStyle:{type:[String,Object],value:"",observer:function(t){this.setData({extStyle:(0,_styleToCssString.default)(t)})}},disableScroll:{type:Boolean,value:!1}},data:{animateCss:"",animateStatus:EXITED,isMounting:!1,extStyle:""},methods:{addEventListener:function(){var t=this.data.animateStatus,e=this.getTimeouts(),a=e.enter,e=e.exit;t===ENTERING&&!a&&this.data.enter&&this.performEntered(),t===EXITING&&!e&&this.data.exit&&this.performExited()},onTransitionEnd:function(){this.data.type===TRANSITION&&this.addEventListener()},onAnimationEnd:function(){this.data.type===ANIMATION&&this.addEventListener()},updateStatus:function(t){var e=1<arguments.length&&void 0!==arguments[1]&&arguments[1];null!==t&&(this.cancelNextCallback(),this.isAppearing=e,t===ENTERING?this.performEnter():this.performExit())},performEnter:function(){var t=this,e=this.getClassNames(ENTER),a=e.className,e=e.activeClassName,n=this.getTimeouts().enter,i={animateStatus:ENTER,animateCss:a},s={animateStatus:ENTERING,animateCss:"".concat(a," ").concat(e)};if(!this.isAppearing&&!this.data.enter)return this.performEntered();this.safeSetData(i,function(){t.triggerEvent("change",{animateStatus:ENTER}),t.triggerEvent(ENTER,{isAppearing:t.isAppearing}),t.delayHandler(TIMEOUT,function(){t.safeSetData(s,function(){t.triggerEvent("change",{animateStatus:ENTERING}),t.triggerEvent(ENTERING,{isAppearing:t.isAppearing}),n&&t.delayHandler(n,t.performEntered)})})})},performEntered:function(){var t=this,e=this.getClassNames(ENTER).doneClassName;this.safeSetData({animateStatus:ENTERED,animateCss:e},function(){t.triggerEvent("change",{animateStatus:ENTERED}),t.triggerEvent(ENTERED,{isAppearing:t.isAppearing})})},performExit:function(){var t=this,e=this.getClassNames(EXIT),a=e.className,e=e.activeClassName,n=this.getTimeouts().exit,i={animateStatus:EXIT,animateCss:a},s={animateStatus:EXITING,animateCss:"".concat(a," ").concat(e)};if(!this.data.exit)return this.performExited();this.safeSetData(i,function(){t.triggerEvent("change",{animateStatus:EXIT}),t.triggerEvent(EXIT),t.delayHandler(TIMEOUT,function(){t.safeSetData(s,function(){t.triggerEvent("change",{animateStatus:EXITING}),t.triggerEvent(EXITING),n&&t.delayHandler(n,t.performExited)})})})},performExited:function(){var t=this,e=this.getClassNames(EXIT).doneClassName;this.safeSetData({animateStatus:EXITED,animateCss:e},function(){t.triggerEvent("change",{animateStatus:EXITED}),t.triggerEvent(EXITED),t.data.unmountOnExit&&t.setData({animateStatus:UNMOUNTED},function(){t.triggerEvent("change",{animateStatus:UNMOUNTED})})})},getClassNames:function(t){var e=this.data.classNames;return{className:"string"!=typeof e?e[t]:"".concat(e,"-").concat(t),activeClassName:"string"!=typeof e?e["".concat(t,"Active")]:"".concat(e,"-").concat(t,"-active"),doneClassName:"string"!=typeof e?e["".concat(t,"Done")]:"".concat(e,"-").concat(t,"-done")}},getTimeouts:function(){var t=this.data.duration;return null!==t&&"object"===_typeof(t)?{enter:t.enter,exit:t.exit}:"number"==typeof t?{enter:t,exit:t}:{}},updated:function(t){var e=this,a=(this.pendingData||this.data).animateStatus,n=null;t?(a===UNMOUNTED&&this.setData({animateStatus:a=EXITED},function(){e.triggerEvent("change",{animateStatus:EXITED})}),a!==ENTER&&a!==ENTERING&&a!==ENTERED&&(n=ENTERING)):a!==ENTER&&a!==ENTERING&&a!==ENTERED||(n=EXITING),this.updateStatus(n)},delayHandler:function(t,e){t&&(this.setNextCallback(e),setTimeout(this.nextCallback,t))},onTap:function(){this.triggerEvent("click")},noop:function(){}},attached:function(){var t=this,e=null,a=null;this.data.in?this.data.appear?(e=EXITED,a=ENTERING):e=ENTERED:e=this.data.unmountOnExit||this.data.mountOnEnter?UNMOUNTED:EXITED,this.safeSetData({animateStatus:e,isMounting:!0},function(){t.triggerEvent("change",{animateStatus:e}),t.updateStatus(a,!0)})}});