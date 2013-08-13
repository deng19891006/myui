/*
 *@desc:百分比饼状图
 */
define(function(require,exports,module){
	
	var $ = require("jquery"),
		util = require("util"),
		win = window,
		docu = win.document;
	
	var defaults = {
			elements : "" , 			//触发元素
			value : 0 ,					//百分比值 0 ~ 100
			width : 100 ,				//区域宽度
			outerWidth : 10,			//默认外圈宽度
			outerColor : "#6EA2C8" ,	//默认外圈原色
			innerColor : "#fff" ,       //内圈颜色
			textColor : "#F14E07" ,     //文本颜色
			valueColor : "#F14E07" ,	//实际占比条颜色
			direction : true ,          //百分比所占区域方向,ture:逆时针 || false:逆时针
			fontstyle : "12px 微软雅黑"          //字体样式
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
				var  _self = this;
				$(_self).append(cFP.createChart( options , _self ))
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
				
				//begin draw percent arc 
				_chart_cxt.beginPath();
	   			_chart_cxt.lineWidth = options.outerWidth;
				_chart_cxt.strokeStyle = options.valueColor;
				_chart_cxt.arc( options.width/2 , options.width/2  , _arcR , 1.5*Math.PI , options.direction ? ( 1.5 - options.value/50 )*Math.PI : ( options.value/50 - 0.5)*Math.PI , options.direction);	 
				_chart_cxt.stroke();

				//begin fill text 
				_chart_cxt.font = options.fontstyle;
				var textWidth = _chart_cxt.measureText(options.value + "%").width,
					textfont = _chart_cxt.font;
				console.log(textfont);
				_chart_cxt.fillText(options.value + "%", options.width/2 - textWidth/2, (options.width-options.outerWidth+28)/2 , options.width-options.outerWidth*2);
 			    return _chart;
			}
		}
	}

	chartForPercent.prototype.reset = function(value){

	}

	exports.chartForPercent = chartForPercent;

});
