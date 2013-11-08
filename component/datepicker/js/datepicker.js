/*
 *@desc:datepicker 自定义日历控件（类似订票平台日历控件）
 */

 define(function(require,exports,module){

 	'use strict';

 	var $ = require("jquery"),
		util = require("util"),
		win = window,
		docu = win.document;

	var defaults = {
			 startDateElement:'',//开始时间日期触发元素
			 endDateElement:'',//结束日期触发元素
			 monthNum : 2,	 //显示月份数量,建议2||3
			 range : true,   //是否带有日期范围可控功能，默认则为时间段
			 initDate : '',  //初始化date,默认与本地date一致
			 startDate :'',  //设置开始时间 20131010
			 endDate:''		 //设置结束时间 20131111
	}

	var datepicker = function( options ){

		if( !(this instanceof datepicker) ){
			return new datepicker( options );
		}

		options = $.extend( defaults , options );
		options.startDateTrigger = docu.getElementById(options.startDateElement);
		options.endDateTrigger = docu.getElementById(options.endDateElement);

		//封装this对象
		this.firstClick = false;
		this._o_ = options ;
		this.inited = false;

		var _this = this;

		$(options.startDateTrigger).on('click',function(){
			_this.currentTrigger = this;
			_this.dateType = 'start';
			myDatepicker.init.call( _this , options , {'left':this.offsetLeft,'top':this.offsetTop,'height':this.offsetHeight});
		})

		$(options.endDateTrigger).on('click',function(){
			_this.currentTrigger = this;
			_this.dateType = 'end';
			myDatepicker.init.call( _this , options , {'left':this.offsetLeft,'top':this.offsetTop,'height':this.offsetHeight});
			myDatepicker.resetDateWithStartDate.call( _this );
		})
 	 
	}

	var eventBinder = {
		/*
		* 上下个月按钮事件监听
		*/
		'floatMonth' : function ( ele ){
			var obj = this.dateObj,
				_styleName = ele.className;
			if( _styleName.indexOf('disable') >= 0){
				return ;
			}
			if( _styleName.indexOf('next-btn') >= 0 ){
				myDatepicker.changeMonth.call( this , 'next');
			}else{
				myDatepicker.changeMonth.call( this , 'prev');
			}
		},

		/*
		*时间段range监听
		*/
		'rangeDateListener':function(){
			var _this = this,
				_tdlist ;
			$(this.datepickerWrap_datepList).on('click','td',function(){

				var $this = $(this),
					date = $this.attr('date');

				if( !$this.hasClass('disable') && date !== undefined ){
					myDatepicker.close.call( _this );
					$( _this.currentTrigger ).val( date );
					//when trigger is startDte input
					if( _this.dateType = 'start' ){
						myDatepicker.setStartDate.call( _this , $this , date  );
					}else{

					}
				}
					
			}).on('mouseover','td',function(){
				if( _this.dateType === 'start' ){
					return;
				}
				var $this = $(this),
					date = $this.attr('date');
				if( $this.hasClass('disable') || $this.hasClass('startdate') ){
					return; 
				}
				myDatepicker.beforeSetRangeDate.call( _this , date );

			}).on('mouseout','td',function(){
				if( _this.dateType === 'start' ){
					return;
				}
			})			
		},

		/*
		*关闭按钮监听
		*/
		'closeBtnListener':function(){
		}
	}

	var myDatepicker = {
		'init' : function( o , offset){
			if(!this.inited){
				var _this = this,
					cssstr = "position:absolute; top:"+(offset.top+offset.height)+"px; left:"+offset.left+"px; ",
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
				this.datepickerDom = wrapDom;
				this.datepickerWrap = docu.createDocumentFragment();
				this.datepickerWrap.appendChild(wrapDom);
				this.datepickerWrap_datepList = this.datepickerWrap.childNodes[0].childNodes[0].lastChild;
				this.dateObj={
					'currYear' : currYear,
					'currMonth' : currMonth,
					'farLeftYear' : currYear,
					'farLeftMonth' : currMonth, 
					'farRightYear' : currMonth+o.monthNum-1 > 12 ? currYear+1 : currYear, 
					'farRightMonth' : currMonth+o.monthNum-1 > 12 ? o.monthNum - (12 - currMonth + 1)  :  currMonth+o.monthNum-1
				}

				//事件绑定
				this.datepickerWrap_prevBtn = $(wrapDom).find('.prev-btn');
				this.datepickerWrap_nextBtn = $(wrapDom).find('.next-btn');
				this.datepickerWrap_prevBtn.on('click',function(e){
					eventBinder.floatMonth.call( _this , this);
				});
				this.datepickerWrap_nextBtn.on('click',function(){
					eventBinder.floatMonth.call( _this , this);
				});

				eventBinder.rangeDateListener.call( _this );

				for(var i = 0 ; i < this._o_.monthNum; i++){
					if( currMonth+i > 12){
						this.datepickerWrap_datepList.appendChild( myDatepicker.fitOneMonth( currYear+1 , currMonth+i-12 ) );
					}else{
						this.datepickerWrap_datepList.appendChild( myDatepicker.fitOneMonth( currYear , currMonth+i ) );
					}
				}
				docu.body.appendChild(this.datepickerWrap);
				this.inited = true;
			}else{
				myDatepicker.show.call( this , offset );
			}
		},

		/*
		*关闭当前日历
		*/
		'close' : function(){
			$(this.datepickerDom).hide();
		},

		/*
		*显示当前日历
		*/
		'show' : function( offset ){
			$(this.datepickerDom).css({
				'top' : offset.top+offset.height+"px",
				'left' : offset.left+"px"
			})
			$(this.datepickerDom).show();
		},

		/*
		*设置startDate
		*/
		'setStartDate' : function( ele , date ){
			$(this.datepickerWrap_datepList).find('td.startdate').removeClass('startdate');
			ele.addClass('startdate');
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
		*  返回与本地当天的时间比较值
		* #y { Number } 年份
		* #m { Number } 月份
		* #d { Number } 天数
		* @return { Number } 0 当前时间相等，即今天
		* @return { Number } -1 小于当天时间
		* @return { Number } 1 大于当天时间
		*/
		'compareToToday' : function( y , m , d){
			var _today = new Date(),
				_y = _today.getFullYear(),
				_m = _today.getMonth()+1,
				_d = _today.getDate();
		   if( _y === y && _m === m && _d === d ){
		   		return 0;
		   }
		   if( (_y < y) || ( _y = y && _m < m ) || ( (_y = y) && (_m = m) && (_d < d) ) ){
		   		return 1;
		   }else{
		   		return -1;
		   }
		},

		/*
		*重置年份
        *#direy { string } 触发按钮的方向
		*/
		'resetDateObj':function( dire ){
			var dateObj = this.dateObj,
				currYear = dateObj.currYear,
				currMonth = dateObj.currMonth,
				farLeftYear = dateObj.farLeftYear,
				farLeftMonth = dateObj.farLeftMonth,
				farRightYear = dateObj.farRightYear,
				farRightMonth = dateObj.farRightMonth,
				leftbtn = this.datepickerWrap_prevBtn,
				rightbtn = this.datepickerWrap_nextBtn;

			if( dire === 'next'){
				dateObj.farLeftYear = farLeftMonth === 12 ? farLeftYear+1 : farLeftYear;
				dateObj.farLeftMonth = farLeftMonth === 12 ? 1 : farLeftMonth+1;
				dateObj.farRightYear = farRightMonth === 12 ? farRightYear+1 : farRightYear;
				dateObj.farRightMonth = farRightMonth === 12 ? 1 : farRightMonth+1;
			}else{
				dateObj.farLeftYear = farLeftMonth === 1 ? farLeftYear-1 : farLeftYear;
				dateObj.farLeftMonth = farLeftMonth === 1 ? 12 : farLeftMonth-1;
				dateObj.farRightYear = farRightMonth === 1 ? farRightYear-1 : farRightYear;
				dateObj.farRightMonth = farRightMonth === 1 ? 12 : farRightMonth-1;
			}

			if( currYear === dateObj.farLeftYear && currMonth === dateObj.farLeftMonth){
				if( leftbtn[0].className.indexOf('prev-btn-disable') < 0 ){
					leftbtn.addClass('prev-btn-disable');
				}
			}else{
				leftbtn.removeClass('prev-btn-disable');
			} 
		},

		/*
		* reset one datepicker with startdate
		* #startDate { string } 日期
		* 
		*/
		'resetDateWithStartDate' : function( ){
			var _this = this;
			$(_this.datepickerWrap_datepList).find('td').each(function(){
				var _$this = $(this);
				if( _$this.hasClass('startdate') ){
					return false;
				}
				if( !_$this.hasClass('disable') ){
					_$this.addClass('disable');
				}
			});
		},

		/*
		* hover range datepicker
		* 
		*/
		'beforeSetRangeDate' : function( date ){
			var _this = this;
			$(_this.datepickerWrap_datepList).find('td').each(function(){
				var _$this = $(this);
				if( _$this.attr('date') === date ){
					return false;
				}

				if( !_$this.hasClass('disable') && !_$this.hasClass('hover') && !_$this.hasClass('startdate')){
					_$this.addClass('hover');
				}
			});
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
						_trflag += '<td class="disable"></td>'; 
					}else{
						if(	myDatepicker.compareToToday( y , m , _day ) === -1 ){
							_trflag += '<td class="disable" date='+(y+'-'+(m<10?"0"+m:m)+'-'+(_day<10?"0"+_day:_day))+'><a href="javascript:;">'+(_day)+'</a></td>';
						}else if( myDatepicker.compareToToday( y , m , _day ) === 0 ){
							_trflag += '<td class="startdate" date='+(y+'-'+(m<10?"0"+m:m)+'-'+(_day<10?"0"+_day:_day))+'><a href="javascript:;">今天</a></td>';
							_trflag += '<td class="enddate" date='+(y+'-'+(m<10?"0"+m:m)+'-'+(_day<10?"0"+(_day+1):_day+1))+'><a href="javascript:;">'+(_day+1)+'</a></td>';
							j++;
						}else{
							_trflag += '<td date='+(y+'-'+(m<10?"0"+m:m)+'-'+(_day<10?"0"+_day:_day))+'><a href="javascript:;">'+(_day)+'</a></td>'; 
						}
					    _day++; 
					}
				}
				_trflag += '</tr>';
				_thisMonth.push(_trflag);
			}

			_thisMonth.push('</tbody></table>');
			_monthTableDom.innerHTML = _thisMonth.join('');
			return _monthTableDom;
		},

		/*
		* 改变月份
		*/	
		'changeMonth' : function( dire ){
			var dateObj = this.dateObj,
				farLeftYear = dateObj.farLeftYear,
				farLeftMonth = dateObj.farLeftMonth,
				farRightYear = dateObj.farRightYear,
				farRightMonth = dateObj.farRightMonth,
				newMonthDom,
				_o_ = this._o_;
			switch (dire){
				case 'next':
					var _y = farRightMonth === 12 ? farRightYear+1 : farRightYear,
						_m = farRightMonth === 12 ? 1 : farRightMonth+1,
						_oldDate = this.datepickerWrap_datepList.firstChild;
					newMonthDom = myDatepicker.fitOneMonth( _y, _m );
					this.datepickerWrap_datepList.appendChild( newMonthDom );
					this.datepickerWrap_datepList.removeChild(_oldDate);
					myDatepicker.resetDateObj.call( this , dire)
					break;
				case 'prev':
					var _y = farLeftMonth === 1 ? farLeftYear-1 : farLeftYear,
						_m = farLeftMonth === 1 ? 12 : farLeftMonth-1,
						_oldDate = this.datepickerWrap_datepList.lastChild;
					newMonthDom = myDatepicker.fitOneMonth( _y, _m );
					this.datepickerWrap_datepList.insertBefore( newMonthDom , this.datepickerWrap_datepList.firstChild );
					this.datepickerWrap_datepList.removeChild(_oldDate);
					myDatepicker.resetDateObj.call( this , dire);
					break;
			}
		}
	}

	datepicker.prototype = {
		'destroy' : function(){

		}
	}
	
	module.exports = datepicker;

 });
