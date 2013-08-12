/*
 *@desc:简单应用的tip提示框
 */

 define(function(require,exports,module){

 	'use strict';

 	var $ = require("jquery"),
		util = require("util"),
		win = window,
		docu = win.document;

	var defaults = {
			element : '',					//触发元素
			content : null,					//提示内容，若为空则取title值，若title不存在则返回
			trigger	: 'mouseover',			//触发方式mouseover,click
			direction : 'bottom'		//箭头方向，默认朝下(PS:这里是箭头方向，并不是tip相对于触发元素的方向;)
	}

	var tip = function( options ){

		if( !(this instanceof tip) ){
			return new tip( options );
		}

		options = $.extend( defaults , options );
		this.__o__ = options ;
		myuiTip.init( options );
	}

	var myuiTip = {

		init : function( options ){
			$( options.element ).each( function( i , e ){
				var _self = this , timer ;
				$(_self).on( options.trigger , null, null, function(){
					timer = setTimeout(function(){
						myuiTip.open( options , _self);
					}, 50) 
				}).on(options.trigger === "mouseover" ? "mouseout" : "click" , null, null, function(){
					 clearTimeout(timer);
					 myuiTip.close( options , _self);
				})
			})
		},

		createTip : function( text ,direction){

		 	var newTip = docu.createElement('span');
			
			newTip.innerHTML = [text,'<span class="pointyTipShadow"></span>','<span class="pointyTip"></span>'].join(' ');
			newTip.className = 'myui-tip-wraper myui-tip-'+direction;
			
			return newTip;
		},

		open : function( options , e ){

			 var content = options.content || e.getAttribute('title'),
			 	 newTip = myuiTip.createTip(content,options.direction).cloneNode(true),
			 	 newTipOff = {};
			 if( content === null ){
			 	return;
			 }
			 docu.body.appendChild(newTip);
			 newTipOff.width = newTip.offsetWidth;
			 newTipOff.height = newTip.offsetHeight;
			 newTipOff = myuiTip.initPosition(options , e , newTipOff)
			 newTip.style.top = newTipOff.top + "px";
			 newTip.style.left = newTipOff.left + "px";
			 $(e).data( "relatedTip" , newTip);
		},

		close : function (options , e){
			var relatedTip = $(e).data( "relatedTip" );
			docu.body.removeChild(relatedTip)
		},

		initPosition : function(options , e , newTipOff){
			var eWidth = e.offsetWidth ,
				eHeight = e.offsetHeight ,
				eOffsetLeft = e.offsetLeft ,
				eOffsetTop = e.offsetTop ,
				nPosition = {} ;

			switch( options.direction ) {
				case "top" : 
					nPosition.left = eOffsetLeft - ( (Math.abs(eWidth - newTipOff.width)) / 2 );
					nPosition.top = eOffsetTop - newTipOff.height - 7 ;
					break;
				case "bottom" :
					nPosition.left = eOffsetLeft - ( Math.abs(eWidth - newTipOff.width) / 2 );
					nPosition.top = eOffsetTop + eHeight + 7 ;
					break;
				case "left" :
					nPosition.left = eOffsetLeft - newTipOff.width - 7;
					nPosition.top = eOffsetTop + (eHeight - newTipOff.height) / 2;
					break;
				case "right" :
					nPosition.left = eOffsetLeft + eWidth + 7;
					nPosition.top = eOffsetTop + (eHeight - newTipOff.height) / 2;
					break;
				default :
					return ;
			}

			return nPosition;
		}
	}	

	tip.prototype = {
		
		destory : function(){
			if( !this.__o__ ){
				return ;
			}
			var __o__ = this.__o__;
			$(__o__.element).off( __o__.trigger === 'mouseover' ? 'mouseover , mouseout' : 'click' );
		}
	}

	exports.tip = tip;

 });

