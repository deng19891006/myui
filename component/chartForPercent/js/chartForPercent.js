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
			fontsize : "12" 				//字体样式
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
				cFP.renderChart( options , _chart , 1.5 , options.value , options.direction , options.valueColor , _self);
			});
		},

		createChart : function ( options , e ){
			var _chart ;
			//canvas 
			if(true){
				_chart = document.createElement("canvas");
					_chart.setAttribute("width", options.width);
					_chart.setAttribute("height", options.width);
				var _chart_cxt = _chart.getContext("2d"),
					_arcR = ( options.width - options.outerWidth*2 )/2 + options.outerWidth/2;
				//begin draw outer circle 
				_chart_cxt.beginPath();
	            _chart_cxt.lineWidth = options.outerWidth;
				_chart_cxt.strokeStyle = options.outerColor;
				_chart_cxt.arc( options.width/2 , options.width/2 , _arcR , 0 , 2*Math.PI , false);	 
				_chart_cxt.stroke();
 			    return _chart;
			}
		},

		renderChart : function ( options , context , from , value , direction , valueColor , _self){
			var _chart_cxt = context.getContext("2d"),
				_arcR = ( options.width - options.outerWidth*2 )/2 + options.outerWidth/2,
				_currValue = value,
				_timer , 
				_angleRange , 
				_easing = from , 
				_preEasying , 
				_span;
				
			if(value !== options.value){
				value = Math.abs(value - options.value);
			}
			
			//begin fill text 
			// _chart_cxt.font = options.fontsize+"px 微软雅黑";
			// var textWidth = _chart_cxt.measureText(value + "%").width,
			// 	textfont = _chart_cxt.font;
			// 	console.log(_chart_cxt.measureText(value + "%"))
			// _chart_cxt.fillText(value + "%" , (options.width - textWidth)/2 , (options.width+parseInt(options.fontsize-4))/2 , options.width-options.outerWidth*2);
			
			if(_self.lastChild && _self.lastChild.nodeName==="SPAN"){
				_span = _self.lastChild;
				_span.innerHTML = _currValue+"%";
			}else{
			    _span = docu.createElement('span') , _spanStyle = _span.style ;
				_spanStyle.display = "block";
				_spanStyle.position = "absolute";
				_spanStyle.width = options.width+"px";
				_spanStyle.fontSize = options.fontsize+"px";
				_spanStyle.fontFamily = "微软雅黑";
				_spanStyle.textAlign = "center";
				// _spanStyle.backgroundColor = "#ccc";
				_self.appendChild(_span);
				_span.innerHTML = _currValue+"%";
				_spanStyle.top = (options.width-_span.offsetHeight)/2+"px";
			}
			

			//begin draw percent arc 
			_chart_cxt.beginPath();
   			_chart_cxt.lineWidth = options.outerWidth;
			_chart_cxt.strokeStyle = valueColor;
			_chart_cxt.globalCompositeOperation = 'source-atop'; // add Antialias 
			if(value === 100 || value === 0){
				_angleRange = from ;
			}else if(direction === true){
				_angleRange = ((from - value/50) < 0 ? (from - value/50)+2 : (from - value/50)).toFixed(1);
			}else if(direction === false){
				_angleRange = (from + value/50).toFixed(1) >= 2 ? (from + value/50 -2).toFixed(1) : (from + value/50).toFixed(1);
			}

			_self.setAttribute("PI", _angleRange);
			// console.log(from + " " +value+" "+_angleRange)

			_timer = setInterval(function(){

				if(options.value === 0){
					clearInterval(_timer);
				}else{
					if(direction){
						_easing = parseFloat( ( (_easing - 0.1) < 0 ?(_easing - 0.1 + 2) : (_easing - 0.1) ).toFixed(1) );
						_preEasying = parseFloat( ( (_easing + 0.1) < 0.1 ? (_easing + 0.1 +2) : (_easing + 0.1) ).toFixed(1) );
					}else{
						_easing = parseFloat( ((_easing+0.1)>=2 ? 0 : (_easing+0.1) ).toFixed(1) );
						_preEasying = parseFloat( ((_easing+0.1)>=2.1 ? _easing+0.1 : _easing-0.1  ).toFixed(1) );
					}
					if( _easing == _angleRange){
							clearInterval(_timer);
					}
				}

				_chart_cxt.arc( options.width/2 , options.width/2 , _arcR , _preEasying*Math.PI , _easing*Math.PI , direction);	
				_chart_cxt.stroke();
			} , 50)
		},

		clear : function ( options , context , PI){
			if(true){
				var _chart_cxt = context.getContext("2d"),
					_arcR = ( options.width - options.outerWidth*2 )/2 + options.outerWidth/2;
				_chart_cxt.strokeStyle = options.outerColor;
				// _chart_cxt.globalCompositeOperation = 'source-atop'; // add Antialias 
				_chart_cxt.arc( options.width/2 , options.width/2  , _arcR , 1.5*Math.PI , PI*Math.PI , options.direction);	
				_chart_cxt.stroke();
			}
		} 
	}

	chartForPercent.prototype.reset = function(value){
		var _self = this,
			__o__ = _self.__o__ ,
			_color ;
		$(__o__.elements).each(function( i , v ){
			// cFP.clear( __o__ , this.childNodes[0] , v.getAttribute('PI'));
			var _oPI =  parseFloat(v.getAttribute('PI')),
				_oValue = __o__.value;
			if( _oPI < 0 ){
				_oPI = _oPI + 2
			}
			if( value !== _oValue){
				_color =  value > _oValue ? __o__.valueColor : __o__.outerColor ;
				cFP.renderChart( __o__ , this.childNodes[0] , _oPI ,  value , value > _oValue ? __o__.direction : !__o__.direction , _color , v);
			}
		});
	}

	exports.chartForPercent = chartForPercent;

});



