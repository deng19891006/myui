define(function(require,exports,module){
	var win = window,
		docu = document;
	/*var isIE=!!window.ActiveXObject,
		isIE6=isIE&&!window.XMLHttpRequest,
		isIE8=isIE&&!!document.documentMode,
		isIE7=isIE&&!isIE6&&!isIE8;*/
	var util = {

		'isIE6' : function(){
		 	return !!win.ActiveXObject && !win.XMLHttpRequest;
		},

		'stopPropagation' : function(event){
		 	var e = event || win.event;
		 	if(e.stopPropagation){
		 		e.stopPropagation();
		 	}else if(e.cancelBubble!=='undefined'){
		 		e.cancelBubble = true;
		 	}else{
		 		return false;
		 	}
		},

		'iframeReady' : function(elem,fn){
			if(elem.addEventListener){
				elem.addEventListener('load',function(){
					elem.removeEventListener('load',arguments.callee,false);
					fn();
				},false)
			}else{
				//先为iframe 添加一个 onreadystatechange
				elem.attachEvent("onreadystatechange", function(){
				    //此事件在内容没有被载入时候也会被触发，所以我们要判断状态
				   //有时候会比较怪异 readyState状态会跳过 complete 所以我们loaded状态也要判断
				   if(elem.readyState === "complete" || elem.readyState == "loaded"){
					//代码能执行到这里说明已经载入成功完毕了
					//要清除掉事件
					elem.detachEvent( "onreadystatechange", arguments.callee);
					//这里是回调函数
					fn();
				   }
				});
			}
		},
		
		'getElementStyle' : function(elem,attr){
			return elem.currentStyle ? elem.currentStyle[attr] : window.getComputedStyle(elem,null)[attr];
		},

		/*
			demo:
		    document.getElementById("animate").onclick = function() {
	                util.animate(this, [
	                         [150, 500, 'width', 'px'],
	                         [150, 300, 'height', 'px'],
	                         [150, 300, 'lineHeight', 'px'],
	                         [20, 60, 'top', 'px'],
	                         [20, 350, 'left', 'px'],
	                         [1, 0.1, 'opacity', '']
	                         [12, 36, 'fontSize', 'px']
	                    ], 200, function() {
	                        this.innerHTML = 'test animate'; 
	                });
	         }
		*/
		'animate' : function(elem, styles, duration, callback){
			var ontween = function(pos,last){
				var obj,
					val,
					from,
					to,
					name,
					unit
					csses = styles;

				for (var i = 0; i < csses.length ; i++) {
					obj = csses[i];
					from = obj[0];
					to = obj[1];
					name = obj[2];
					unit = obj[3];

					val = from + (to-from)*pos;

					if( name === "opacity"){
						// val = val.toString();
		    			// val = val.substring(0, val.charAt('.') + 3);
		    			// val = val - 0;
		    			if(last){
		                    val = val.toFixed(1);
		                }
		                if( navigator.userAgent.toLowerCase().indexOf('msie') != -1){
		                    val *= 100;
		                    elem.style.filter = 'alpha(opacity=' + val + ')';
		                }else{
		                    elem.style.opacity = val;
		                }
					}else{
               			elem.style[name] = val + unit;
					}
				}

			}

			var onend = function(pos) {
		        ontween(pos,true);
		        callback.call(elem);
		    }

			var fx = (function(){
				var pos,
		            runTime,
		            startTime = + new Date(),
		            timer = setInterval(function() {
		                runTime = + new Date() - startTime;
		                pos = runTime / duration;
		                // console.log(runTime+" "+_this.duration+" "+pos);
		                if( pos >= 1 ){
		                    clearInterval(timer);
		                    onend(1);
		                }else{
		                    ontween(pos,false);
		                }
		            }, 13)
			})();
		},

		'makeArray' : function(){

		},

		'type' : function(obj){
			return obj === null ? "null" : 
				   obj === undefined ? 'undefined' : 
				   Object.prototype.toString.call(obj).slice(8,-1).toLowerCase();
		},

		/*
		 * 将source中的对象复制到target对象中
		 * @target { Object } target对象
		 * @source { Object } source对象
		 * @override { Boolean } 是否覆盖 默认为true(覆盖)
		 * @whitelist { Array } 只复制该数组中在源对象中的属性
		 * @return { Object } target对象
		 */
		'mix' : function(target, source, override, whitelist){
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

		/*
		 * 判断obj是否为window对象
		 */
		'isWindow' : function( obj ){
			return obj && obj === obj.window;
		},

		/*
	     * 判断obj是否为类数组对象
		*/
		'isArrayLike' : function ( obj ){
			var len = obj.length ,
				type = util.type( obj );

			//if window or no length
			if(util.isWindow(obj) || len === undefined){

				return false;
			}

			//such as select > option
			if( len && obj.nodeType === 1) {
				return true;
			}

			//若obj为数组返回true; 若不为数组但是不是function类型并且拥有length属性,这时候判断是否有obj[i]机制存在
			return type === 'array' || 
				   type !== 'function' && ( length === 0 || typeof len === 'number' && len > 0 && ( len - 1 ) in obj );

		},

		/*
		 * 遍历对象并执行回调
		 * @obj 类数组对象 或 数组
		 * @fn 每次循环执行的回调函数,回调函数内返回false则结束遍历
		 * @context 毁掉函数执行上下文
		 */
		'each' : function(obj , fn , context){
			var isArray = util.isArrayLike(obj),
				i = 0;

			if(isArray){
				for( ; i < obj.length ;i++ ){
					if( fn.call(context , i , obj[i]) === false ){
						break;
					}
				}
			}else{
				for( i in obj){
					if( fn.call(context , i , obj[i]) === false ){
						break;
					}
				}
			}
			
		}
	}

	module.exports = util;
});