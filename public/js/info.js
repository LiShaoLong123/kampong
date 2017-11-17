;(function($){
	$(function(){

		var arr = new Array();
		arr[0]={src:"/info/fansConcern?value=concern"};
		arr[1]={src:"/info/fansConcern?value=fans"};
		arr[2]={src:"/info/message?value=message"};
		arr[3]={src:"/info/update?value=userInfo"};
		arr[4]={src:"/info/update?value=changePwd"};
		var iframe=$(".info_content>iframe");
		var concern=$(".info_nav >ul>li:first-child>ul>li:first-child");
		var fans=$(".info_nav >ul>li:first-child>ul>li:nth-child(2)");
		var message=$(".info_nav >ul>li:first-child>ul>li:nth-child(3)");
		var userInfo=$(".info_nav >ul>li:nth-child(2)>ul>li:first-child");
		var changePwd=$(".info_nav >ul>li:nth-child(2)>ul>li:last-child");
		concern.on("click",function(){
			iframe.attr("src",arr[0].src);
			concern.attr("style","background:#e1e8ed;");
			fans.attr("style","background:#FFFFFF;");
			message.attr("style","background:#FFFFFF;");
			userInfo.attr("style","background:#FFFFFF;");
			changePwd.attr("style","background:#FFFFFF;");
			iframe.find("p").attr("value","关注的人");
			return false;
		});
		fans.on("click",function(){
			iframe.attr("src",arr[1].src);
			concern.attr("style","background:#FFFFFF;");
			fans.attr("style","background:#e1e8ed;");
			message.attr("style","background:#FFFFFF;");
			userInfo.attr("style","background:#FFFFFF;");
			changePwd.attr("style","background:#FFFFFF;");
			$(".iframe_body>.fans>p").text();
			console.log($(".iframe_body>.fans>p").value);
			return false;
		});
		message.on("click",function(){
			iframe.attr("src",arr[2].src);
			concern.attr("style","background:#FFFFFF;");
			fans.attr("style","background:#FFFFFF;");
			message.attr("style","background:#e1e8ed;");
			userInfo.attr("style","background:#FFFFFF;");
			changePwd.attr("style","background:#FFFFFF;");
			return false;
		});
		userInfo.on("click",function(){
			iframe.attr("src",arr[3].src);
//			$(".info_content>iframe:first-child").contents().find(".changePwd").attr("style","display: none;");
//			$(".info_content>iframe:first-child").contents().find("body").attr("style","color: red;");
			concern.attr("style","background:#FFFFFF;");
			fans.attr("style","background:#FFFFFF;");
			message.attr("style","background:#FFFFFF;");
			userInfo.attr("style","background:#e1e8ed;");
			changePwd.attr("style","background:#FFFFFF;");
			return false;
		});
		changePwd.on("click",function(){
			iframe.attr("src",arr[4].src);
			concern.attr("style","background:#FFFFFF;");
			fans.attr("style","background:#FFFFFF;");
			message.attr("style","background:#FFFFFF;");
			userInfo.attr("style","background:#FFFFFF;");
			changePwd.attr("style","background:#e1e8ed;");
			return false;
		});
		var val = $.getUrlParam('value');
		if(val=="userInfo"){
			$(".changePwd").attr("style","display: none;");
			$(".userInfo").attr("style","display: block;");
		}
		if(val=="changePwd"){
			$(".changePwd").attr("style","display: block;");
			$(".userInfo").attr("style","display: none;");
		}
		if(val=="updateSuccess"){
			$(".updateSuccess").attr("style","display: block;");
			$(".changePwd").attr("style","display: none;");
			$(".userInfo").attr("style","display: none;");
		}
		if(val=="concern"){
			$(".iframe_body>.fans>p").text("关注的人");
		}
		if(val=="fans"){
			$(".iframe_body>.fans>p").text("我的粉丝");
		}
		if(val=="showConcern"){
			iframe.attr("src",arr[0].src);
		}
		if(val=="showFans"){
			iframe.attr("src",arr[1].src);
		}
		if(val=="showMessage"){
			iframe.attr("src",arr[2].src);
		}
		if(val=="showUserinfo"){
			iframe.attr("src",arr[3].src);
		}
		//info页面，修改头像
		$("#userPic").change(function(){
			$("form:last").submit();
		})
	});
})(jQuery);
