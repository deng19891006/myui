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
		myDatepicker.init.call( this , options );

	}

	var myDatepicker = {
		'init' : function( o ){
			var cssstr = "position:absolute; top:"+(o.top+o.height)+"px; left:"+o.left+"px; ",
				wrapStr = ['<div class="myui-datepicker">',
								'<b class="leftBtn"></b>',
								'<b class="rightBtn"></b>',
								'<div class="datepicker_list">',
								'</div>',
						 	'</div>'];
			var wrapDom = docu.createElement('div');
				wrapDom.className = 'myui-datepicker-wraper';
				wrapDom.setAttribute('style', cssstr);
				wrapDom.innerHTML = wrapStr.join('');
			this.datepickerWrap = docu.createDocumentFragment();
			this.datepickerWrap.appendChild(wrapDom);
			this.datepickerWrap_datepList = this.datepickerWrap.childNodes[0].childNodes[0].lastChild;
			// this.datepickerWrap_datepList.appendChild( myDatepicker.loadDateWrap() );
			//docu.body.appendChild(this.datepickerWrap);
			console.log(myDatepicker.getDaysNumForMonth(2013,2));
		},

		/*
		* 得到当前年份
		* @return { Number } 年份
		*/
		'getCurrnetYear' : function(){
			return new Date().getFullYear();
		},

		/*
		* 得到当前月份
		* @return { Number } 月份 1-12
		*/
		'getCurrnetMonth' : function(){
			return new Date().getMonth()+1;
		},

		/*
		* 得到当前月份
		* @return { Number } 天数 1-31
		*/
		'getCurrnetDay' : function(){
			return new Date().getDate();
		},

		/*
		* 得到每个月1号的day(礼拜数)
		* @y { Number } 年份
		* @m { Number } 月份
		* @return { Number } 1-7
		*/
		'getFirstDayForEverymonth' : function( y , m ){
			var myDate=new Date();
			myDate.setFullYear(y);
			myDate.setMonth(m-1);
			myDate.setDate(1);
			return myDate.getDay();
		},

		/*
		* 得到每个月的天数
		* @y { Number } 年份
		* @m { Number } 月份
		* @return { Number } 28||29||30||31
		*/
		'getDaysNumForMonth' : function( y , m ){
			var isLeapYear = y%4 === 0 ? true : false;
			if( m===2 ){
				return isLeapYear ? 29 : 28;
			}else if( m <=7 ){
				return m%2 === 0 ? 30 : 31;
			}else{
				return m%2 === 0 ? 31 : 30;
			}
		}
	}

	datepicker.prototype = {
		'destroy' : function(){

		}
	}
	
	// exports.datepicker = datepicker;
	module.exports = datepicker;

 });

