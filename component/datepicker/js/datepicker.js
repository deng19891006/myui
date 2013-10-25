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
		this.__o__ = options ;
		myDatepicker.init( options );

	}

	var myDatepicker = {
		'init' : function ( options ){

		}
	}

	myDatepicker.prototype = {

	}
	
	exports.datepicker = datepicker;

 });

