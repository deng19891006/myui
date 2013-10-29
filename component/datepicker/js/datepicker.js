/*
 *@desc:datepicker 自定义日历控件
 */

 define(function(require,exports,module){

 	'use strict';

 	var $ = require("jquery"),
		util = require("util"),
		win = window,
		docu = win.document;

	var defaults = {
			 element : '',   //触发元素
			 monthNum : 1,	 //显示月份数量
			 range : false,  //是否带有日期范围可控功能，默认无
			 initDate : ''   //初始化date,默认与本地date一致
	}

	var datepicker = function( options ){

		if( !(this instanceof datepicker) ){
			return new datepicker( options );
		}

		options = $.extend( defaults , options );

		var target = docu.getElementById(options.element);

		options.target = target;
		options.left = target.offsetLeft;
		options.top = target.offsetTop;
		options.height = target.offsetHeight;
		options.exist =false;

		this.__o__ = options ;
		myDatepicker.init( options );

	}

	var myDatepicker = {
		'init' : function( o ){
			var cssstr = "positon:absolute; top:"+(o.top+o.height)+"px; left:"+o.left+"px; ",
				wrapStr = ['<div class="myui-datepicker-wraper" style="'+cssstr+'">',
							 '<div class="myui-datepicker">',
							 '<b class="leftBtn"></b>',
							 '<b class="rightBtn"></b>',
							 '<div class="datepicker_list">'];

			console.log(wrapStr)
		}
	}

	datepicker.prototype = {
		'destroy' : function(){

		}
	}
	
	// exports.datepicker = datepicker;
	module.exports = datepicker;

 });

