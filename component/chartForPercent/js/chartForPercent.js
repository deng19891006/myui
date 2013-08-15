/*
 *@desc:百分比饼状图
 */
define(function(require,exports,module){
	
	var $ = require("jquery"),
		util = require("util"),
		win = window,
		docu = win.document;
	
	var defaults = {
			elements : "" , 				//触发元素
			value : 0 ,						//百分比值 0 ~ 100
			width : 100 ,					//区域宽度
			outerWidth : 10,				//默认外圈宽度
			outerColor : "#6EA2C8" ,		//默认外圈原色
			innerColor : "#fff" ,       	//内圈颜色
			textColor : "#F14E07" ,     	//文本颜色
			valueColor : "#F14E07" ,		//实际占比条颜色
			direction : true ,          	//百分比所占区域方向,ture:逆时针 || false:顺时针
			fontsize : "12" 	//字体样式
	}

	var chartForPercent = function( options ){

		if( !(this instanceof chartForPercent)){
			return new chartForPercent( options );
		}

		options = $.extend( defaults , options );
		this.__o__ = options;
		cFP.init( options );

	}
	
	var cFP = {

		init : function ( options ){
			$(options.elements).each(function( i , v ){
				var  _self = this,
					_chart = cFP.createChart( options , _self ); 
				$(_self).append(_chart);
				cFP.renderChart( options , _chart );
			});
		},

		createChart : function ( options , e ){
			var _chart ;
			//canvas 
			if(true){
				_chart = document.createElement("canvas");
					_chart.setAttribute("width", options.width)
					_chart.setAttribute("height", options.width)
				var _chart_cxt = _chart.getContext("2d"),
					_arcR = ( options.width - options.outerWidth*2 )/2 + options.outerWidth/2;
				//begin draw outer circle 
				_chart_cxt.beginPath();
				
	            _chart_cxt.lineWidth = options.outerWidth;
				_chart_cxt.strokeStyle = options.outerColor;
				_chart_cxt.arc( options.width/2 , options.width/2 , _arcR , 0 , 2*Math.PI , false);	 
				_chart_cxt.stroke();
				
				// //begin draw percent arc 
				// _chart_cxt.beginPath();
	  	        // _chart_cxt.lineWidth = options.outerWidth;
				// _chart_cxt.strokeStyle = options.valueColor;
				// _chart_cxt.arc( options.width/2 , options.width/2  , _arcR , 1.5*Math.PI , options.direction ? ( 1.5 - options.value/50 )*Math.PI : (options.value/50 - 0.5)*Math.PI , options.direction)	 
				// _chart_cxt.stroke();

				// //begin fill text 
				// _chart_cxt.font = options.fontsize+"px 微软雅黑";
				// var textWidth = _chart_cxt.measureText(options.value + "%").width,
				// textfont = _chart_cxt.font;
				// console.log(textfont);
				// _chart_cxt.fillText(options.value + "%" , (options.width - textWidth)/2 , (options.width+parseInt(options.fontsize-4))/2 , options.width-options.outerWidth*2);
 			    return _chart;
			}
		},

		renderChart : function ( options ,_chart ){
				var _chart_cxt = _chart.getContext("2d"),
					_arcR = ( options.width - options.outerWidth*2 )/2 + options.outerWidth/2,
					_timer , _angleRange , _easing = 1.5 , _preEasying;

				//begin fill text 
				_chart_cxt.font = options.fontsize+"px 微软雅黑";
				var textWidth = _chart_cxt.measureText(options.value + "%").width,
					textfont = _chart_cxt.font;
				_chart_cxt.fillText(options.value + "%" , (options.width - textWidth)/2 , (options.width+parseInt(options.fontsize-4))/2 , options.width-options.outerWidth*2);
	
				//begin draw percent arc 
				_chart_cxt.beginPath();
	   			_chart_cxt.lineWidth = options.outerWidth;
				_chart_cxt.strokeStyle = options.valueColor;
				_chart_cxt.globalCompositeOperation = 'source-atop';
				_chart_cxt.globalAlpha=1;
				_angleRange =  parseInt( options.direction ? 1.5 - options.value/50 : options.value/50 - 0.5 ); 
				_timer = setInterval(function(){
					_easing = parseFloat( ( _easing - 0.1 ).toFixed(1) );
					_preEasying = parseFloat( ( _easing + 0.1 ).toFixed(1) );
					console.log( _easing +" "+ _preEasying);
					if( _easing <= _angleRange ){
						clearInterval(_timer);
					}
					_chart_cxt.arc( options.width/2 , options.width/2  , _arcR , _preEasying*Math.PI , _easing*Math.PI , options.direction);	
					_chart_cxt.stroke();
				} , 25)

		}
	}

	chartForPercent.prototype.reset = function(value){

	}

	exports.chartForPercent = chartForPercent;

});

