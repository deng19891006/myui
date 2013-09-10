/*
 * desc : (selector , event) module;
 * date : 2013-09-09
 * coder : tom 
 */

 ;(function( window , undefined ){

	'use strict';

var document = window.document,

	rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	ori_array = [],
	ori_array_push = ori_array.push,

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
				}

				if(window.querySelectorAll){
					context = context ? context.ownerDocument || context : document ;
					elems = context.querySelector(selector);
					this.length = elems.length;
					this[0] = elems;
				}else{
					//ie6-7
				}

				return T.makeArray( elems , this );
			}
		}

		// 匹配 window , document , document.documentElement
		if( selector.nodeType || typeof selector === 'object' && 'setInterval' in selector ){
			this.length = 1;
			this[0] = selector;
			return this;
		}

	};


	/*
	 * 将source中的对象复制到target对象中
	 * @target { Object } target对象
	 * @source { Object } source对象
	 * @override { Boolean } 是否覆盖 默认为true(覆盖)
	 * @whitelist { Array } 只复制该数组中在源对象中的属性
	 * @return { Object } target对象
	 */
	T.mix = function( target, source, override, whitelist ){
			if( !target || !source ){
			   return ;
			}

			if( override === undefined ){
				override = true;
			}

			var len , i ,
				_mix = function(prop){
					if( override === true || !(prop in target) ){
						target[prop] = source[prop];
					}
				};

			if( whitelist && (len = whitelist.length)){
				for( i = 0; i < len; i++){
					if( whitelist[i] in source ){
						_mix( whitelist[i] );
					}
				}
			}else{
				for(var s in source){
					_mix( s );
				}
			}

			return target;
		},
	}

	T.mix( T , {
		/* 将source对象转化为真实数组 
		 * 常用于将 array-like 对象如 NodeList , arguments 转化为真实数组
		 * @param source 源数组对象
		 * @param target 目标数组
		 * @return target 转化后的真是数组
		 */ 
		makeArray : function( source , target ){
			var target = target || [],
				i=0,
				len = source.length;

			if( source != null ){
				if( T.isArrayLike( source ) ){
					for ( ; i < len; i++) {
						target[ target.length++ ] = source[ i ];
					};
				}else{
					ori_array_push.call( target , source );
				}
			}

			return target;
		}
	})
	
	window.T = T; 

 })(window);