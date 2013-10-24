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
			 
	}

	var datepicker = function( options ){

		if( !(this instanceof tip) ){
			return new tip( options );
		}

		options = $.extend( defaults , options );
		this.__o__ = options ;
		myuiTip.init( options );
	}

	var myuiTip = {

		init : function( options ){
			 
		},

		 
	exports.datepicker = datepicker;

 });

