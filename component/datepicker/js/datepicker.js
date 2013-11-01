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
			 monthNum : 2,	 //显示月份数量,建议2||3
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

	var eventBinder = {
		/*
		* 上下个月按钮事件监听
		*/
		'floatMonth' : function ( e ){
			var obj = this.dateObj,
				_styleName = e.className;
			if( _styleName.indexOf('disable') >= 0){
				return ;
			}
			
			// console.log(_styleName);
		}
	}

	var myDatepicker = {
		'init' : function( o ){
			var cssstr = "position:absolute; top:"+(o.top+o.height)+"px; left:"+o.left+"px; ",
				wrapStr = ['<div class="myui-datepicker">',
								'<b class="prev-btn prev-btn-disable"></b>',
								'<b class="next-btn"></b>',
								'<div class="datepicker_list">',
								'</div>',
						 	'</div>'],
				currYear = myDatepicker.getCurrnetYear(),
				currMonth = myDatepicker.getCurrnetMonth();
			var wrapDom = docu.createElement('div');
				wrapDom.className = 'myui-datepicker-wraper';
				wrapDom.setAttribute('style', cssstr);
				wrapDom.innerHTML = wrapStr.join('');
			this.datepickerWrap = docu.createDocumentFragment();
			this.datepickerWrap.appendChild(wrapDom);
			this.datepickerWrap_datepList = this.datepickerWrap.childNodes[0].childNodes[0].lastChild;
			this.dateObj={
				'currYear' : currYear,
				'currMonth' : currMonth 
			}

			//事件绑定
			this.datepickerWrap_prevBtn = $(wrapDom).find('.prev-btn');
			this.datepickerWrap_nextBtn = $(wrapDom).find('.next-btn');
			this.datepickerWrap_prevBtn.on('click',function(){
				eventBinder.floatMonth(this);
			});
			this.datepickerWrap_nextBtn.on('click',function(){
				eventBinder.floatMonth(this);
			});

			for(var i = 0 ; i < this.__o__.monthNum; i++){
				if( currMonth > 12){
					this.datepickerWrap_datepList.appendChild( myDatepicker.fitOneMonth( currYear+1 , currMonth+i-12 ) );
				}else{
					this.datepickerWrap_datepList.appendChild( myDatepicker.fitOneMonth( currYear , currMonth+i ) );
				}
			}
			docu.body.appendChild(this.datepickerWrap);


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
		* #y { Number } 年份
		* #m { Number } 月份
		* @return { Number } 1-7
		*/
		'getFirstDayForEverymonth' : function( y , m ){
			return new Date( y , m - 1 , 1).getDay();
		},

		/*
		* 得到每个月的天数
		* #y { Number } 年份
		* #m { Number } 月份
		* @return { Number } 28||29||30||31
		*/
		'getDaysNumForMonth' : function( y , m ){
			var isLeapYear = y%4 === 0 ? true : false;
			if( m === 2 ){
				return isLeapYear ? 29 : 28;
			}else if( m <= 7 ){
				return m%2 === 0 ? 30 : 31;
			}else{
				return m%2 === 0 ? 31 : 30;
			}
		},

		/*
		* 得到每个月的天数
		* #y { Number } 年份
		* #m { Number } 月份
		* @return { Number } 28||29||30||31
		*/
		'isToday' : function( y , m , d){
			var _today = new Date();
			return _today.getFullYear() === y && _today.getMonth()+1 === m && _today.getDate() === d;
		},

		/*
		* 拼装一个月的日历结构
		* #y { Number } 年份
		* #m { Number } 月份
		* #d { Number } 选中的日期
		* @return  { Object DOMElement } 本月份的DOM结构
		*/
		'fitOneMonth' : function( y , m , d){
			var result = {} , _days , _firstDay , _thisMonth , _monthTableDom , _trNums , _trflag , _tdflag , i , j , _day = 1;
			_days = myDatepicker.getDaysNumForMonth( y , m );
			_firstDay = myDatepicker.getFirstDayForEverymonth( y , m );
		    _trNums = Math.ceil( ( _days - 7 + _firstDay ) / 7 ) + 1;
			_thisMonth = ['<h4>'+y+'年'+m+'月</h4><table><thead><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></thead><tbody>'];
			_monthTableDom = docu.createElement('div');
			_monthTableDom.className = 'list';

			for( i = 1 ; i <= _trNums ; i++){
				_trflag = '<tr>'
				for( j = 1 ; j <= 7 ; j++ ){
					if( i === 1 && j <= _firstDay || i === _trNums && _day > _days){
						_trflag += '<td></td>'; 
					}else{
						if(	myDatepicker.isToday( y , m , _day )){
							_trflag += '<td class="today" date='+(y+'-'+(m<10?"0"+m:m)+'-'+(_day<10?"0"+_day:_day))+'><a href="javascript:;">'+(_day++)+'</a></td>'; 
						}else{
							_trflag += '<td date='+(y+'-'+(m<10?"0"+m:m)+'-'+(_day<10?"0"+_day:_day))+'><a href="javascript:;">'+(_day++)+'</a></td>'; 
						}
					}
				}
				_trflag += '</tr>';
				_thisMonth.push(_trflag);
			}

			_thisMonth.push('</tbody></table>');
			_monthTableDom.innerHTML = _thisMonth.join('');
			return _monthTableDom;
		}	
	}

	datepicker.prototype = {
		'destroy' : function(){

		}
	}
	
	module.exports = datepicker;

 });

