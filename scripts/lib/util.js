define(function(require,exports,module){
	var win = window;
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
		 }
	}
});