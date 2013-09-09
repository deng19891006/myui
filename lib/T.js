/*
 * desc : (selector , event) module;
 * date : 2013-09-09
 * coder : tom 
 */

 ;(function( window , undefined ){

	'use strict';

var document = window.document,

	rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	T =  function( selector , context ){
		return new init( selector , context );
	},

	init = function( selector , context ){
		var match , elem , elems ;
		this.length = 0;

		// 处理 T("") , T(null) , T(undefined) , T(false)
		if(!selector){
			return this;
		}

		// selector 为字符串
		if( typeof selector === 'string'){
			selector = selector.trim();
			// selector 为html字符串 , 需要转化为dom节点
			if( selector.charAt('<') === 0 && selector.charAt( selector.length - 1 ) === '>' && selector.length >= 3){
				context = context ? context.ownerDocument || context : document; 
				// return E.create( selector , context );
				return 'create';
			}else{
				match = selector.match( rquickExpr );
				//id选择器
				if( match && match[2] ){
					context = context ? context.ownerDocument || context : document ;
					elem = context.getElementById(match[2]);
					if( elem ){
						this.length = 1;
						this[0] = elem;
						return this;
					}

					elems = T.query( selector , context )
				}
			}
		}

		// 匹配 window , document , document.documentElement
		if( selector.nodeType || typeof selector === 'object' && 'setInterval' in selector ){
			this.length = 1;
			this[0] = selector ;
			return this;
		}
		
	};

	window.T = T; 

 })(window);