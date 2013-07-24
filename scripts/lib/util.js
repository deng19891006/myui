define(function(require,exports,module){
	var win = window,
		docu = document;
	/*var isIE=!!window.ActiveXObject,
		isIE6=isIE&&!window.XMLHttpRequest,
		isIE8=isIE&&!!document.documentMode,
		isIE7=isIE&&!isIE6&&!isIE8;*/
	module.exports = {

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

		'iframeReady':function(elem,fn){
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
		
		'getStyleVlaue':function(elem){
			//借鉴jquery
		} 
	}
});