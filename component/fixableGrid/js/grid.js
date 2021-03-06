/*
@desc：响应式表格.
@argument:
	@title 		//表格title
	@fileds		//表头配置
{  
    title:"经营快照",
    fileds:[
    	{label:"#",field:"index"},
		{label:"name",field:"name"},
		{label:"address",field:"address"},
		{label:"gender",field:"gender"},
		{label:"cityId",field:"cityId"},
		{label:"birthDate",field:"birthDate"},
		{label:"education",field:"education"},	
		{label:"about",field:"about"}
	]
}


@数据接口
	@total		//数据总数（根据该配置动态生成pager）
	@data		//当前页数据
{
	total:30,
	data:[
		{index:1,name:"tom",address:"上海",gender:"man",cityId:"021",birthDate:"198910006",education:"College",about:"web-frond-dev"},
		{index:2,name:"tom",address:"上海",gender:"man",cityId:"021",birthDate:"198910006",education:"College",about:"web-frond-dev"},
		{index:3,name:"tom",address:"上海",gender:"man",cityId:"021",birthDate:"198910006",education:"College",about:"web-frond-dev"},
		{index:4,name:"tom",address:"上海",gender:"man",cityId:"021",birthDate:"198910006",education:"College",about:"web-frond-dev"},
		{index:5,name:"tom",address:"上海",gender:"man",cityId:"021",birthDate:"198910006",education:"College",about:"web-frond-dev"},
		{index:6,name:"tom",address:"上海",gender:"man",cityId:"021",birthDate:"198910006",education:"College",about:"web-frond-dev"},
		{index:7,name:"tom",address:"上海",gender:"man",cityId:"021",birthDate:"198910006",education:"College",about:"web-frond-dev"},
		{index:8,name:"tom",address:"上海",gender:"man",cityId:"021",birthDate:"198910006",education:"College",about:"web-frond-dev"}，
		{index:9,name:"tom",address:"上海",gender:"man",cityId:"021",birthDate:"198910006",education:"College",about:"web-frond-dev"},
		{index:10,name:"tom",address:"上海",gender:"man",cityId:"021",birthDate:"198910006",education:"College",about:"web-frond-dev"},
		{index:11,name:"tom",address:"上海",gender:"man",cityId:"021",birthDate:"198910006",education:"College",about:"web-frond-dev"},
		{index:12,name:"tom",address:"上海",gender:"man",cityId:"021",birthDate:"198910006",education:"College",about:"web-frond-dev"},
		{index:13,name:"tom",address:"上海",gender:"man",cityId:"021",birthDate:"198910006",education:"College",about:"web-frond-dev"},
		{index:14,name:"tom",address:"上海",gender:"man",cityId:"021",birthDate:"198910006",education:"College",about:"web-frond-dev"},
		{index:15,name:"tom",address:"上海",gender:"man",cityId:"021",birthDate:"198910006",education:"College",about:"web-frond-dev"},
		{index:16,name:"tom",address:"上海",gender:"man",cityId:"021",birthDate:"198910006",education:"College",about:"web-frond-dev"}
	]	  
}
*/
define(function(require, exports, module) {

  var $ = require("jquery"), 
      util = require("util"),
      win = window,
      docu = win.document;

  var grid = function(options){

     if(!(this instanceof grid)){
        return new grid(options);
     }

  	 this.options = $.extend({
                    	 	element : "",      // 表格容器
                        fileds : "",       // 表格列字段
                    	 	datasource : "",   // 数据源接口
                        pagesize : 1,      // 当前页面
                        colFixNum : 0,     // 固定列标识  2表示固定第一列和第二列 , 默认值0不启动列固定
                        colFixWidth : 600  // 若具有column fixable , 则需要给出表格容器宽度 , 反之自行手动在html上修改即可
  	                  },options);
     this.colfixed = false;
  	 this.init.call(this);
  };

  //初始化入口
  grid.prototype.init = function(func){
    this.element = docu.getElementById(this.options.element);
    this.gridwrap = docu.createElement("div");
    this.gridwrap.className = "myui-grid-wraper";
    this.pagesize = this.options.pagesize;
    this.initBasicTableFramework.call(this);
  };
  
  //init basic table framework
  grid.prototype.initBasicTableFramework = function(){
    var colFixNum = this.options.colFixNum,
        _tableStr = '',
        _columns = [];
    this.fix_columns = [];
    if( colFixNum < 0 ){

      return false;

    } 

    _tableStr = ['<table  class="myui-grid"><tbody><tr>','</tr></tbody></table>'];
    
    if( colFixNum > 0 ){
      this.element.style.width = this.options.colFixWidth+"px";
      for(var i =0; i < this.options.fileds.length; i++){
        i < colFixNum ? _columns.push('<td width='+this.options.fileds[i].width+'>'+this.options.fileds[i].label+"</td>") :
                        this.fix_columns.push('<td>'+this.options.fileds[i].label+"</td>");
      }
      this.colfixed = true;
      _columns.push('<td  rowspan='+(this.options.pagesize+2)+' id="'+this.options.element+'_fixCol" style="padding:0px;vertical-align: top; background:transparent "></td>');
    }else{
      for(var i =0; i < this.options.fileds.length; i++){
         _columns.push('<td>'+this.options.fileds[i].label+"</td>")
      }
    }

    _tableStr.splice(1,0,_columns.join(''));
    this.gridwrap.innerHTML = _tableStr.join('');
    this.tbody = this.gridwrap.firstChild.tBodies[0];
    this.header = this.tbody.firstChild;
    this.c_header = this.header.cloneNode(); 
    this.element.appendChild(this.gridwrap);

    // console.log((this.tbody.lastChild));
    // console.log(util.getElementStyle(this.tbody.lastChild,'width'))
    // console.log($(this.tbody.lastChild).width())

    if( this.colfixed ){
      this.fix_header_td = this.header.lastChild;
    }
    this.loadData.call(this);
    this.pagerEventlistener.call(this);
  }

  //loadData
  grid.prototype.loadData = function(conf){
  	var _this = this,
        _colFixNum = _this.options.colFixNum,
        _fileds = _this.options.fileds,
        _fixbodyStr = [],
        _tableStr = ['<div style="width:'+this.header.lastChild.clientWidth+'px;overflow: auto"><div class="myui-gird-fixtable" style="width:'+( this.options.fileds.length - this.options.colFixNum)*100 +'px; overflow:hidden"><table class="fixtable"><tbody>','</tbody></table></div></div>'];
  	_this._tbodyFlag = document.createDocumentFragment();
  	if(conf===undefined || !conf.currpagenum  ){
  		conf = {'currpagenum':1};
  	}
  	this.getData(conf,function(data){
      _this._tbodyFlag.appendChild(_this.header);
      if( !_this.colfixed){
    		for(var i = 0; i<data.data.length; i++){
            var _tr = document.createElement("tr");
            for(var j in data.data[i]){
              var _td = document.createElement("td"),
                  _text = document.createTextNode(data.data[i][j]);
              _td.appendChild(_text);
              _tr.appendChild(_td);
            }
            _this._tbodyFlag.appendChild(_tr);
        }
      }else{
        for(var i = 0; i<data.data.length; i++){
            var _tr = document.createElement("tr"),
                _tr_fix = '<tr>';
                for( var j = 0; j < _fileds.length ; j++){
                  var _td = document.createElement("td"),
                      _filedsTemp = _fileds[j].field,
                      _text = document.createTextNode(data.data[i][_filedsTemp]);
                      _td.appendChild(_text);
                      j < _colFixNum ? _tr.appendChild(_td) : _tr_fix += '<td>'+data.data[i][_filedsTemp]+'</td>';
                }
            _tr_fix +='</tr>';  
            _this._tbodyFlag.appendChild(_tr);
            _fixbodyStr.push(_tr_fix);
        }
        _tableStr.splice(1 , 0 ,'<tr>'+_this.fix_columns.join('')+'</tr>');
        _tableStr.splice(2 , 0 , _fixbodyStr.join(''));
      }

      _this.tbody.innerHTML = '';
      var _lastchild = _this.gridwrap.lastChild;
      if(_lastchild && _lastchild.className.toString().indexOf("myui-grid-bottompanel")>=0){
        _this.gridwrap.removeChild(_lastchild)
      }  
      _this.tbody.appendChild(_this._tbodyFlag);
      _this.fix_header_td.innerHTML = _tableStr.join('');
      _this._tbodyFlag = null;
      _this.gridwrap.appendChild(_this.pagelistfit.apply(_this, [data.total,data.pagesize,data.currpagenum]));
  	})
  }

  //ajax数据接口
  grid.prototype.getData = function(conf,func){
		var _this = this;
		$.ajax({
		    url:_this.options.datasource,
			type:"GET",
			data:{'currpagenum':conf.currpagenum,'pagesize':_this.pagesize},
			beforeSend:function(){_this.beforeRemote();},
			error:function(error){console.log(error);},
			success:function(data){
        /*_this.afterRemote();
        func(data);*/
        setTimeout(function(){
          _this.afterRemote();
          func(data);
        }, 1000);   
			},
			dataType:"json"
		});
  };

  //beforeSend状态
  grid.prototype.beforeRemote = function(){
    var _this = this;
    if(window.innerWidth < 480){
      _this.gridwrap.clientHeight  = _this.header.clientHeight;
    }else{
      this.tbody.clientHeight < 60 ? this.gridwrap.style.height = '100px':'';
    }
    if(!this.beforeRemoteWraper){
      var _beforeRemoteWraper = document.createElement("div"),
          _loading = document.createElement("div");
          _beforeRemoteWraper.appendChild(_loading);
          _beforeRemoteWraper.className = "myui-grid-befroeSucc";
          _loading.className = 'myui-loading'; 
          this.beforeRemoteWraper = _beforeRemoteWraper;
          this.gridwrap.insertBefore(this.beforeRemoteWraper);
    }else{
      this.beforeRemoteWraper.style.display = "block";
    }
  };  

  //隐藏loading状态
  grid.prototype.afterRemote = function(){
     this.gridwrap.style.height = '';
  	 this.beforeRemoteWraper.style.display = 'none';
  };

  //绑定page分页事件 ps:这里使用jquery中on事件
  grid.prototype.pagerEventlistener = function(){
    var _this = this;
    $("#"+this.options.element).on("click",".myui-grid-pagelist span",function(){
        if(!$(this).hasClass("myui-grid-pagelist-disabled")){
         _this.loadData.call(_this,{"currpagenum":$(this).attr("action")});
       }
    }).on("change",".myui-grid-goto select",function(){
       _this.pagenum  =  $(this).val();
       _this.loadData.call(_this,{"currpagenum":$(this).val()});
    }).on("change",".myui-grid-count select",function(){
       _this.pagesize = $(this).val();
       _this.loadData.call(_this);
    });
  }

  //生成page分页栏
  grid.prototype.pagelistfit = function(total,pagesize,currpagenum){
    var _pagedom = document.createElement("div"),
        _pageliststr = [],
        _pagelisttemp = "",
        _pagelistnum="",
        _rangenum="";
        _pagedom.className = "myui-grid-bottompanel clearfix",
    this.total = total;
    this.pagenum =total%pagesize>0?parseInt(total/pagesize)+1:total/pagesize;
    var _prenum = currpagenum>1?currpagenum-1:1,
        _nextnum = currpagenum<this.pagenum?currpagenum+1:this.pagenum;
    this.pagenum*pagesize > total ? _rangenum = (currpagenum-1)*pagesize+1+" - "+currpagenum*pagesize:_rangenum = (currpagenum-1)*pagesize+1+" - "+currpagenum*pagesize;

    for(var i = 1;i <= this.pagenum; i++){
      var _t = "",_n = "";
      i == currpagenum?_t= "myui-grid-pagelist-curr myui-grid-pagelist-disabled":"";
      i == currpagenum?_n="selected":"";
      _pagelisttemp+='<span class="'+_t+'" action="'+i+'">'+i+'</span>';
      _pagelistnum+="<option "+_n+">"+i+"</option>";
    }
    
    if(this.pagenum<=7){
      _pageliststr=['<div class="myui-grid-bottompanel-left">',
                      '<span class="myui-grid-pagelist">',
                         '<span class="myui-grid-pagelist-disabled" action="1">&laquo;</span>',  
                         '<span class="myui-grid-pagelist-disabled" action="'+_prenum+'">&lsaquo;</span>',
                         _pagelisttemp,
                         '<span class="myui-grid-pagelist-disabled" action="'+_nextnum+'">&rsaquo;</span>', 
                         '<span class="myui-grid-pagelist-disabled" action="'+this.pagenum+'">&raquo;</span>',
                      '</span>',
                      '<span class="myui-grid-goto">',
                          '<span>转到：</span><select class="goto">'+_pagelistnum+'</select>',
                      '</span>',
                      '<span class="myui-grid-count">',
                            '<span>每页：</span><select class="goto">',
                            '<option '+(this.pagesize===10?' selected':'')+'>10</option>',
                            '<option '+(this.pagesize===20?' selected':'')+'>20</option>',
                            '<option '+(this.pagesize===50?' selected':'')+'>50</option></select>',
                      '</span>',
                    '</div>',
                   '<span class="myui-grid-bottompanel-right">',
                    '<span class="myui-grid-rangenum">'+_rangenum+'</span>',
                    '<span class="myui-grid-totalnum">   总数:'+this.total+'</span>',
                  '</span>'].join('');
      _pagedom.innerHTML =  _pageliststr;
      return _pagedom;
    }else if(this.pagenum>7){
      var _predom = '<span class="" action="1">&laquo;</span>'+  
              '<span class="" action="'+_prenum+'">&lsaquo;</span>',
          _behinddom = '<span class="" action="'+_nextnum+'">&rsaquo;</span>'+ 
               '<span class="" action="'+this.pagenum+'">&raquo;</span>';
      if(currpagenum==1){
        _predom = '<span class="myui-grid-pagelist-disabled" action="1">&laquo;</span>'+  
              '<span class="myui-grid-pagelist-disabled" action="'+_prenum+'">&lsaquo;</span>';
      }
      if(currpagenum == this.pagenum){
        _behinddom = '<span class="myui-grid-pagelist-disabled" action="'+_nextnum+'">&rsaquo;</span>'+ 
               '<span class="myui-grid-pagelist-disabled" action="'+this.pagenum+'">&raquo;</span>';
      }
      _pagelisttemp="";
      if(currpagenum<=4){
         var _i = 1;
         for( ; _i <=  currpagenum ; _i++){
          var  _c = '';
          _i==currpagenum?_c = "myui-grid-pagelist-curr myui-grid-pagelist-disabled":"";
          _pagelisttemp +='<span class=" '+_c+'" action="'+_i+'">'+_i+'</span>';
         }
         _pagelisttemp +='<span class="" action="'+_i+'">'+(_i)+'</span>'+
                         '<span class="myui-grid-pagelist-space">...</span>'+
                 '<span class="" action="'+_nextnum+'">'+(this.pagenum-1)+'</span>'+
                 '<span class="" action="'+this.pagenum+'">'+(this.pagenum)+'</span>';
      }else if(currpagenum>=this.pagenum-4){
         _pagelisttemp +='<span class="" action="1">1</span>'+
                 '<span class="" action="2">2</span>'+
                         '<span class="myui-grid-pagelist-space">...</span>';
           var _i =  currpagenum;
         _pagelisttemp +='<span class=" " action="'+(i-1)+'">'+(_i-1)+'</span>';
         for(;_i<=this.pagenum;_i++){
          var  _c = '';
          _i==currpagenum?_c = "myui-grid-pagelist-curr myui-grid-pagelist-disabled":"";
          _pagelisttemp +='<span class="'+_c+'" action="'+_i+'">'+_i+'</span>';
         }
      }else if( currpagenum > 4 && currpagenum < this.pagenum-4){
         _pagelisttemp +='<span class="" action="1">1</span>'+
                 '<span class="" action="2">2</span>'+
                         '<span class="myui-grid-pagelist-space">...</span>'+
                 '<span class="" action="'+(currpagenum-1)+'">'+(currpagenum-1)+'</span>'+
                 '<span class=" myui-grid-pagelist-curr myui-grid-pagelist-disabled" action="'+currpagenum+'">'+(currpagenum)+'</span>'+
                 '<span class="" action="'+(currpagenum+1)+'">'+(currpagenum+1)+'</span>'+
                 '<span class="myui-grid-pagelist-space">...</span>'+
                 '<span class="" action="'+(this.pagenum-1)+'">'+(this.pagenum-1)+'</span>'+
                 '<span class="" action="'+this.pagenum+'">'+(this.pagenum)+'</span>'; 
      }
      _pageliststr=['<div class="myui-grid-bottompanel-left">',
              '<span class="myui-grid-pagelist">',
                 _predom,
                 _pagelisttemp,
                 _behinddom,
               '</span>',
               '<span class="myui-grid-goto">',
                  '<span>转到：</span><select class="goto">',_pagelistnum,'</select>',
               '</span>',
               '<span class="myui-grid-count">',
                  '<span>每页：</span><select class="goto">',
                  '<option '+(this.pagesize===10?' selected':'')+'>10</option>',
                  '<option '+(this.pagesize===20?' selected':'')+'>20</option>',
                  '<option '+(this.pagesize===50?' selected':'')+'>50</option></select>',
               '</span>',
             '</div>',
             '<span class="myui-grid-bottompanel-right">',
              '<span class="myui-grid-rangenum">',_rangenum,'</span>',
              '<span class="myui-grid-totalnum">   总数:',this.total,'</span>',
             '</span>'].join("");
      _pagedom.innerHTML = _pageliststr;
      return _pagedom;
    }   
  }
  //开放grid接口
  exports.grid = grid;
});