define(function(require, exports, module) {

   var $ = require("jquery");

   var fuzzySearchForDropList = function(options){
  	   this.init.call(this,options);
   } 

   fuzzySearchForDropList.prototype={

	  "init" : function(){
		  this.options = $.extend({
			  	  datavalue:[],
			  	  element:"",
				  datasource:"",
				  multiple:true,
				  cache:true,
				  listClickCallBack : function(){}
		  },arguments[0]);
		  this.targetEle = $("#"+this.options.element);
		  this.remoteData = false;
		  this.first_expand = false;
		  if(this.targetEle.children(".myui-custom-multiple-search").length>0){
			  $("#myui-custom-multiple-search-expend_"+this.options.element).remove();
	 		  this.targetEle.children(".myui-custom-multiple-search").remove();
			  this.targetEle.off("mousedown","input");
		  }
		  var _this = this;
		  (this.targetEle)[0].innerHTML ='<div class="myui-custom-multiple-search">'+
											'<ul class="clearfix">'+
												(function(){
													 var _strtemp = "";
													 if(_this.options.datavalue.length>0){
														for(var _i = 0;_i<_this.options.datavalue.length;_i++){
															if(_this.options.multiple){
																_strtemp+= '<li key="'+_this.options.datavalue[_i].k+'"><p title="' + _this.options.datavalue[_i].v + '">'+_this.options.datavalue[_i].v+'</p><a>x</a></li>';
															}else{
																_strtemp+= '<li class="sin" key="'+_this.options.datavalue[_i].k+'"><p title="' + _this.options.datavalue[_i].v + '">'+_this.options.datavalue[_i].v+'</p></li>';
															}
														}
													 	return _strtemp; 
													 }else{
													 	return '';
													 }
												})()+
												'<li class="input-wrap"><input type="text" placeholder="'+this.options.placeholder+'"/></li>'+
										   '</ul>'+
										'</div>' ;
		  this.targetEle.on("mousedown","input",function(event){
			 	_this.expand.call(_this);
		  });
		  
		 $(document).click(function(event) {
			var e = event || window.event,
				target = e.target || e.srcElement;
				if(!isParent(target,(_this.targetEle)[0])&&!isParent(target,($("#myui-custom-multiple-search-expend_"+_this.options.element))[0])){
					$("#myui-custom-multiple-search-expend_"+_this.options.element).hide();
				}
				/*if ( e && e.preventDefault ) {
					e.preventDefault(); 
				}else{
					e.returnValue = false; 
				}
				return false;*/
		 });
		 
		 if(this.options.multiple){
		 	this.targetEle.on("click","li a",function(){
			  	  $(this).parent().remove(); 
				  if(_this.first_expand){
					    _this._expand.hide();
			  	 		_this.listfilter.call(_this,$(this).siblings().attr('title'));
						_this.parentfilter.call(_this);
			  	  }
			 });
		 }
	 },

	 "destroy":function(){
	 	var _expand = this._expand;
	 	if( _expand !== undefined && _expand.length > 0){
			this._expand.remove();
	 	}

	 	this.targetEle.off("mousedown","input");
	 	this.targetEle.off("mouseup","input");
	 	$(document).off('click');
	 },

	 "keyboardEventsBind":function(){
		  var _this = this;
	 	  this.targetEle.on("keyup","input",function(e){
			  var  _key = $(this).val(),
			   	   _keyRE = new RegExp(_key),
				   _expand = _this._expand,
				   e = e || widnow.event;
			  
			  if(_key!=""){
				    console.log(e.keyCode);
					_expand.children("ul").children("li:not(.list-disabled)").each(function(indexp,elementp){
							$(elementp).children("ul").children("li").each(function(indexc, elementc) {
								 if($(this).hasClass(".disabled") || $(elementc).text().toString().search(_keyRE)==-1){
									$(elementc).addClass("s-disabled");
								 }else{
								 	$(elementc).removeClass("s-disabled");
								 }
							});					 
				   })
				   _this.parentfilter.call(_this,"select");
			  }else{
			  	  _this.expended_show.call(_this);
			  }
		  })
	 },

	 "keyboardEventsUnBind":function(){
	 	this.targetEle.off("keyup","input",function(){ console.log("unbind keyup event on input...");})
	 },

	 "listfilter":function(str){
	 	  var _expand = this._expand;
		  _expand.children("ul").children("li").each(function(indexp,elementp){
			$(elementp).children("ul").children("li").each(function(indexc, elementc) {
                 if(str == $(elementc).text()){
				 	$(elementc).removeClass("disabled");
				 }
            });
		  })
	 },

	 "expended_show":function(){
	        this._expand.children("ul").children("li").each(function(indexp,elementp){
				$(this).removeClass("s-list-disabled");
				$(elementp).children("ul").children("li").each(function(indexc, elementc){
					  $(this).removeClass("s-disabled");
				});
			})
			$("#myui-custom-multiple-search-expend_"+this.options.element).show();
	 },

	 stringSub : function( str , maxLen){
	 	if( str.length < maxLen ){
	 		return str
	 	}
	 	return str.length <= 8 ? str : ( str.substr( 0 , maxLen-1) + "..." );
	 },

	 "expand":function(){
		 var _this = this , 
		 	 _existArrayString = this.targetEle.children(".myui-custom-multiple-search");
		 if(_this.first_expand){
		 	_this._expand.css({
		 		"top":_existArrayString.offset().top+_existArrayString.height()+"px",
		 		"width":_existArrayString.width()-10,
				"left":_existArrayString.offset().left+"px"
		 	});
			_this.expended_show.call(_this);
		 }else{
			 _this._expand = $("<div class='myui-custom-multiple-search-expend' id='myui-custom-multiple-search-expend_"+this.options.element+"'></div>")
						 .css({
							"width":_existArrayString.width()-10,
							"left":_existArrayString.offset().left+"px",
							"top":_existArrayString.offset().top+_existArrayString.height()+"px"
			 });
			 this.datafilter.call(this,function(data){
				 if(!data){
				 	_this._expand.append("暂时没有相关数据").appendTo(document.body);
				 	_this.first_expand = true;
				    return false;
				 }
				 _this.totalSelects = data.result;
				 var  _existArrayList = [];
				 _existArrayString.find("li:not(:last)").each(function(i,e){
					_existArrayList.push($(this).children('p').attr('title'))
				 })
				 var _ul = $("<ul class='myui-custom-multiple-search-result'></ul>");

				 for(var i = 0; i<data.result.length;i++){
					var _li = $("<li class='search-result-list'></li>").append("<h4>"+data.result[i].category+"</h4>");
					var _cul = $("<ul class='search-result'></ul>");
					for(var j = 0; j<data.result[i].list.length;j++){
						var _temp = false;
						for(var _e = 0; _e < _existArrayList.length; _e++){
							if(_existArrayList[_e]===data.result[i].list[j].v){
								_cul.append("<li class='list disabled' key='"+data.result[i].list[j].k+"'>"+ data.result[i].list[j].v +"</li>");
								_temp = true;
								continue;
							}
						}
						if(!_temp){
							_cul.append("<li class='list' key='"+data.result[i].list[j].k+"'>"+ data.result[i].list[j].v +"</li>");
						}
					}
					_li.append(_cul);
					_ul.append(_li);
				 }
				 
				 _this._expand.on("click","li.list",function(){
				      $(this).addClass("disabled");
					  _this._expand.hide();
					  _this.targetEle.find("input").val('');
					  var _lis = _existArrayString.find("li.input-wrap");
					  if(!_this.options.multiple){
				      	$(this).siblings().removeClass("disabled");
					  	if( _lis.prev().length > 0 ){
					  		_lis.prev().replaceWith("<li class='sin' key='"+$(this).attr("key")+"'><p title='"+ $(this).text() +"'>"+$(this).text()+"</p></li>");
					  	}else{
					  		_lis.before("<li class='sin' key='"+$(this).attr("key")+"'><p title='"+ $(this).text() +"'>"+$(this).text()+"</p></li>");
					  	}
					  }else{
					 		_lis.before("<li  key='"+$(this).attr("key")+"'><p title='"+ $(this).text() +"'>"+_this.stringSub( $(this).text() , 8)+"</p><a>x</a></li>");
					  }
					  _this.parentfilter.call(_this);
					  _this.options.listClickCallBack.call(_this,$(this).attr('key'),$(this).text(),_this.options.element)
				 });
				 
				 _this._expand.append(_ul).appendTo(document.body);
				 _this.first_expand = true;
				 _this.keyboardEventsBind();
			   })
		 }
	},

	"getValues":function(){
		var _values = [];
		this.targetEle.children(".myui-custom-multiple-search").find("li:not(:last)").each(function(){
			_values.push($(this).attr("key"))
		})
		return _values;
	},

	"parentfilter":function(){
		var _expand = this._expand;
		if(arguments[0] == "select"){
			_expand.children("ul").children("li").each(function(indexp,elementp){
				if($(elementp).children("ul").children("li").length == $(elementp).children("ul").children("li.s-disabled").length){
					$(elementp).addClass("s-list-disabled");
				}else{
					$(elementp).removeClass("s-list-disabled");
				}
			})
		}else{
			_expand.children("ul").children("li").each(function(indexp,elementp){
				if($(elementp).children("ul").children("li:not(.disabled)").length === 0){
					$(elementp).addClass("list-disabled");
				}else{
					$(elementp).removeClass("list-disabled");
				}
			})
		}
		
	},

	"datafilter":function(func){
		var _this = this;
	 	this.datafilter_data = _this.remoteData ;
		if(this.datafilter_data){
			func(this.datafilter_data);
		}else{
			$.ajax({
		        url:_this.options.datasource,
				type:"POST",
				beforeSend:function(){},
				error:function(){console.log('error')},
				success:function(data){
					_this.remoteData = data;
				    func(data);
				},
				dataType:"json"
			});
		}
	 }

  }

  function isParent (obj,parentObj){ 
  		// console.log(obj+" "obj.tagName+" : "+obj.tagName.toString().toUpperCase)
		while (   obj != undefined && obj.tagName != undefined && obj.tagName.toString().toUpperCase() != 'BODY'){ 
			if (obj == parentObj){ 
				return true; 
			} 
			obj = obj.parentNode; 
		} 
		return false; 
  }

  module.exports = fuzzySearchForDropList;
})