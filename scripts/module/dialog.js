/*
 *@desc:弹出框
*/

define(function(require,exports,module){
	var $ = require("jquery"),
		util = require("lib/util"),
		win = window,
		docu = win.document;
	var dialog = function (options){
		if(!(this instanceof dialog)){
			return new dialog(options);
		}
		this.options = $.extend({
			element:"",
			width:"",
			height:"",
			contentElement:'',//本页面内容
			contentLink:'',//弹出远程资源
			masked:true
		},options);

		var dialogMask = docu.createElement('div'),
			dialogWraper = docu.createElement("div");
		 
		dialogMask.className = "myui-dialog-mask";
		dialogWraper.className = "myui-dialog-wraper";
		 
		dialogWraper.innerHTML = '<div class="myui-dialog"><div class="myui-dialog-con"><i class="myui-dialog-close myui-dis-ib"></i></div></div>';

		this.dialogMaskClone = dialogMask.cloneNode(true);
		this.dialogWraperClone = dialogWraper.cloneNode(true);

		if(this.options.contentElement !== '' && this.options.contentLink === ''){
			this.staticPopup.call(this);
		}else if(this.options.contentElement === '' && this.options.contentLink !== ''){
			this.remotePopup.call(this);
		}else{
			 
		}
	}

	//弹出本页面内容
	dialog.prototype.staticPopup = function(){
		var _this = this,
			_contentElement = docu.getElementById(this.options.contentElement),
			_contentElementclone = docu.getElementById(this.options.contentElement).cloneNode(true),
			_cE_width = $(_contentElement).width(),
			_cE_height = $(_contentElement).height(),
			_l = ( docu.documentElement.clientWidth - _cE_width - 20)/2,
			_t = ( docu.documentElement.clientHeight - _cE_height - 20 )/2;	
		this._dialogMaskClone = this.dialogMaskClone,
		this._dialogWraperClone = this.dialogWraperClone,
		this._dialogWraperClone.style.left = _l+"px";	
		this._dialogWraperClone.style.top = _t+"px"; 
		this._dialogWraperClone.firstChild.firstChild.appendChild(_contentElementclone);
		this._dialogMaskClone.style.height = docu.body.clientHeight+"px";
		if(_contentElementclone.style.display==''){
			 _contentElementclone.style.display = 'block';
		}
		this.bindEvent.call(this); 	 
	}

	//弹出远程资源
	dialog.prototype.remotePopup = function(){
		var _this = this;
			this._dialogMaskClone = this.dialogMaskClone,
			this._dialogWraperClone = this.dialogWraperClone,
			iframeDom = docu.createElement("iframe");
			iframeDom.setAttribute('src', this.options.contentLink);
			iframeDom.setAttribute('frameborder', '0');
		    iframeDom.setAttribute('marginheight', '0px');
			iframeDom.setAttribute('marginwidth', '0px');
			iframeDom.setAttribute('noresize', 'yes');
			iframeDom.setAttribute('scrolling', 'no');
			iframeDom.style.marginBottom = '-3px';
			iframeDom.style.border = '0';
		this._dialogWraperClone.firstChild.firstChild.appendChild(iframeDom);
		util.iframeReady(iframeDom,function(){
			var iframeDomDocument =  iframeDom.contentDocument || iframeDom.contentWindow.document; // FF:iframe.contentDocument  	IE:iframe.contentWindow.document
			var childBodyWidth = iframeDomDocument.body.scrollWidth ,
				childBodyHeight = iframeDomDocument.body.offsetHeight ,
				_l = ( docu.documentElement.clientWidth - childBodyWidth - 10)/2,
				_t = ( docu.documentElement.clientHeight - childBodyHeight - 10 )/2;
			// console.log( iframeDomDocument.body + childBodyWidth+ ' '+childBodyHeight );
			if(childBodyWidth > 300){
				iframeDom.setAttribute('width',childBodyWidth);
			}else{
			    iframeDom.setAttribute('width',childBodyWidth);
			}
			iframeDom.setAttribute('height',childBodyHeight);
			_this._dialogWraperClone.style.left = _l+"px";	
			_this._dialogWraperClone.style.top = _t+"px"; 
		});
	 	
	 	_this._dialogMaskClone.style.height = docu.body.clientHeight+"px";
		this.bindEvent.call(this); 	
	}

	dialog.prototype.bindEvent = function(){
		var _this = this;
		this._dialogWraperClone.firstChild.firstChild.onclick = function(){
			 _this.closeDialog.call(_this);
		}
		if(this.options.masked){
			this._dialogMaskClone.onclick  = function(){
				 _this.closeDialog.call(_this);
			}
			docu.body.appendChild(this._dialogMaskClone);
		}
		docu.body.appendChild(this._dialogWraperClone);	 
	}

	dialog.prototype.closeDialog = function(){
			docu.body.removeChild(this.dialogWraperClone);
			docu.body.removeChild(this._dialogMaskClone);
	}
	module.exports = dialog;
})

//http://www.jacklmoore.com/colorbox/