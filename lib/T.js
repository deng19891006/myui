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

				if(!!document.querySelectorAll){
					context = context ? context.ownerDocument || context : document ;
					elems = context.querySelectorAll(selector);
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

	T.fn = T.prototype ; 
	init.prototype = T.fn;

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
	}

	T.mix( T , {
		/*
		 * 合并objects对象
		 */
		merge : function( /* objects */ ){
			var result = {};
			for (var i = 0; i <= arguments.length; i++) {
				T.mix( result , arguments[i] )
			};
			return result;
		},

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

			if( source !== undefined && source !== null ){
				if( T.isArrayLike( source )){
					for( ; i < len ; i++){
						target[ target.length++ ] = source[ i ];
					}
				}else{
					target[ target.length++ ] = source;
				}
			} 

			return target;
		},

		/*
	     * 判断obj是否为类数组对象
		 */
		isArrayLike : function ( obj ){
			var len = obj.length ,
				type = T.type( obj );

			//if window or no length
			if(T.isWindow(obj) || len === undefined){

				return false;
			}

			//such as select > option
			if( len && obj.nodeType === 1) {
				return true;
			}

			//若obj为数组返回true; 若不为数组也不是function类型并且拥有length属性,这时候判断是否有obj[i]机制存在
			return type === 'array' || 
				   type !== 'function' && ( length === 0 || typeof len === 'number' && len > 0 && ( len - 1 ) in obj );
		},

		/*
		 * 判断obj是否为window对象
		 */
		isWindow : function( obj ){
			return obj && obj === obj.window;
		},

		/* 判断对象类型
		 * null , undefined直接返回 ; 其他通过 [object object] 字符串截取
		 */
		type : function(obj){
			return obj === null ? "null" : 
				   obj === undefined ? 'undefined' : 
				   Object.prototype.toString.call(obj).slice(8,-1).toLowerCase();
		},

		/*
		 * 对象循环函数 
		 * @param { Object/array} 被循环对象
		 * @param { function } 每次循环后执行的回调函数 , 若该次循环返回false , 则终止循环
		 * @param { Object } 循环上下文
		 * @return Object
		 */
		each : function( obj , fn , context){
			var isobj = obj.length === undefined || typeof obj === 'function', 
			   	i;
			
			if( !isobj ){
				for( i in obj ){
					if( fn.call( context , i , obj[ i ] ) === false ){
						break;
					}
				}
			}

			return obj;
		}
	});
	
	window.T = T; 

 })(window);