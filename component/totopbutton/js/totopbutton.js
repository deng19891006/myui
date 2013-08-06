/*
 *@desc:页面的totop按钮
 */
define(function(require,exports,module){
	
	var $ = require("jquery"),
		util = require("util"),
		win = window,
		docu = win.document;
	var totopbutton = function(options){
		var	_topbtnwrap = docu.createElement("a");
			_topbtnwrap.className = "myui-totop";
			_topbtnwrap.setAttribute("id", "myui-totop");
			_topbtnwrap.appendChild(docu.createTextNode("top"));
			_isIE6scroll = false;
		var myuitotop = '';
			
		if(!docu.getElementById("myui-totop")){
			docu.body.appendChild(_topbtnwrap);
			myuitotop = docu.getElementById("myui-totop");
		}
		
		if(util.isIE6()){
			var _documentElement = docu.documentElement ;
		    _topbtnwrap.style.position = "absolute";
		    _topbtnwrap.style.top = _documentElement.clientHeight-50 + 'px';
		    win.onscroll = function(){
				var _scrolltop = docu.body.scrollTop + docu.documentElement.scrollTop;
					_clientHeight =  _documentElement.clientHeight; 
		    	_topbtnwrap.style.top = _clientHeight +_scrolltop-50+"px";
		    	if(_scrolltop>1){
					_topbtnwrap.style.visibility = "visible";	
				}else{
					_topbtnwrap.style.visibility = "hidden";
				}
			}
			window.onresize = function(){
				var _scrolltop = docu.body.scrollTop + docu.documentElement.scrollTop;
					_clientHeight =  _documentElement.clientHeight;
				_topbtnwrap.style.top = _clientHeight +_scrolltop-50+"px";
			}
		}else{
			_topbtnwrap.style.position = "fixed"; 
			_topbtnwrap.style.bottom = "50px";
			win.onscroll = function(){
				var _scrolltop = docu.body.scrollTop + docu.documentElement.scrollTop;
				if(_scrolltop>10){
					_topbtnwrap.style.visibility = "visible";	
				}else{
					_topbtnwrap.style.visibility = "hidden";
				}
			}
		}

		myuitotop.onclick = function(event){
					 var t= setInterval(function(){
							var _st = docu.body.scrollTop + docu.documentElement.scrollTop;
							win.scrollTo(0, _st-100);
							if(_st<=0){
								clearInterval(t);
							}
						},5);
					 util.stopPropagation(event);
			}
	};
	module.exports = totopbutton;
});
