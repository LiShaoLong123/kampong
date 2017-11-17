;(function($){
	$(function(){
		
		 //表情解析
 		$.fn.extend({
			replaceface : function(){
			  	var faces=$(this).html();
			  	for(i=0;i<60;i++){
			  		var reg=new RegExp('\\['+(i+1)+']','g');
					faces=faces.replace(reg,'<img src="../img/face/'+(i+1)+'.gif">');
				}
		 		$(this).html(faces);
		   	}
	  	});

		$('.home_content_state div').each(function(event){
			  	$(this).replaceface();
		});
		$('.personal_content_state div').each(function(){
			  	$(this).replaceface();
		});
		$('.search_content_state div').each(function(){
			  	$(this).replaceface();
		});
		$('.message_single div').each(function(){
			  	$(this).replaceface();
		});

		// 光标定位插件
		$.fn.extend({
		"insert":function(value){
			//默认参数
			value=$.extend({
				"text":"123"
			},value);
			var dthis = $(this)[0]; //将jQuery对象转换为DOM元素
			//IE下
			if(document.selection){
				$(dthis).focus();		//输入元素textara获取焦点
				var fus = document.selection.createRange();//获取光标位置
				fus.text = value.text;	//在光标位置插入值
				$(dthis).focus();	///输入元素textara获取焦点
			}
			//火狐下标准	
			else if(dthis.selectionStart || dthis.selectionStart == '0'){
				var start = dthis.selectionStart; 
				var end = dthis.selectionEnd;
				var top = dthis.scrollTop;
				//以下这句，应该是在焦点之前，和焦点之后的位置，中间插入我们传入的值
				dthis.value = dthis.value.substring(0, start) + value.text + dthis.value.substring(end, dthis.value.length);
			}
			//在输入元素textara没有定位光标的情况
			else{
				this.value += value.text;
				this.focus();	
			};
			return $(this);
		}
	});
	
				//创建图片上传预览
		var addPic="<li><input type='file' name='talkPic' class='addPicBtn' accept='.jpg,.jpeg,.png'><span class='PicClose'>×</span><img src='img/addPic.png'/></li>";
		var picLength=0;
		$(".home_content_edit").append("<div id='addPic'><ul>"+addPic+"</ul></div>");
		
		$("#addPic").change(function(event){
			if(event.target.className=="addPicBtn"){
				var filename = event.target.value; 
				var mime = filename.toLowerCase().substr(filename.lastIndexOf(".")); 
				if(mime!=".jpg"&&mime!=".jpeg"&&mime!=".png") 
				{ 
					$('#myModal').modal({
					  keyboard: false
					})
					event.target.outerHTML=event.target.outerHTML; 
				}else{
					$("#addPic").find("p").remove();
					var objUrl = getObjectURL(event.target.files[0]) ;
//					console.log("objUrl = "+objUrl) ;
					if (objUrl) {
						$(event.target).parents("li").find("img").attr("src", objUrl);
//						$(event.target).parents("li").attr("style", "border: 2px #000000 solid");
						$(event.target).attr("style","display: none;");
						if($("#addPic ul li").length<9){
							$("#addPic ul").append(addPic);
						}
						
						if($("#addPic ul li:last-child img").attr("src")=="img/addPic.png"){
							picLength=$("#addPic ul li").length-1;
						}else{
							picLength=$("#addPic ul li").length;
							
						}
						$("#addPic").append("<p>已选"+picLength+"张，最多选择9张图片</p>");
					}
					if($(event.target).parents("li").find("img").attr("src")!="img/addPic.png"){
						$(event.target).parents("li").find("span").attr("style","display: inline;");
					}
				}
			}
		})
		$("#addPic").click(function(event){
			if(event.target.className=="PicClose"){
				$("#addPic").find("p").remove();
				$(event.target).parents("li").remove();
				if($("#addPic ul li:last-child img").attr("src")!="img/addPic.png"){
					$("#addPic ul").append(addPic);
					picLength=$("#addPic ul li").length;
				}else{
					picLength=$("#addPic ul li").length-1;
				}
				$("#addPic").append("<p>已选"+picLength+"张，最多选择9张图片</p>");
			}
		})
//		$(".addPicBtn").change(function(e){
//			var objUrl = getObjectURL(this.files[0]) ;
////			console.log("objUrl = "+objUrl) ;
//			if (objUrl) {
//				$(this).parents("li").find("img").attr("src", objUrl);
//				$(this).attr("style","display: none;");
////				$("#addPic ul").append(addPic);
//			}
//		}) ;


		//建立一個可存取到該file的url
		function getObjectURL(file) {
			var url = null ; 
			if (window.createObjectURL!=undefined) { // basic
				url = window.createObjectURL(file) ;
			} else if (window.URL!=undefined) { // mozilla(firefox)
				url = window.URL.createObjectURL(file) ;
			} else if (window.webkitURL!=undefined) { // webkit or chrome
				url = window.webkitURL.createObjectURL(file) ;
			}
			return url ;
		}
		
		//表情按钮，图片按钮
		$(".glyphicon-picture").on("click",function(){
			$("#addPic").slideToggle(150);
		});
		$(".index_content_middle,.personal_content_right").on("click",function(){
			if (event.target.className=="glyphicon glyphicon-piggy-bank") {
				//创建表情框
				var faceimg = '';
				var $this=$(event.target);
				for(i=0;i<60;i++){
					faceimg+='<li><a href="javascript:void(0)"><img src="../img/face/'+(i+1)+'.gif" title="['+(i+1)+']"/></a></li>';
				};
				$this.parent().prepend("<div class='faceBox'><span class='Corner'></span><div class='Content'>"+
							"<h3><span>全部表情</span><a class='close' title='关闭'>×</a></h3><ul>"+faceimg+"</ul></div></div>");
				//插入表情
				var $facepic = $(".faceBox li img");
				$facepic.on("click",function(){
					 //文本框内光标定位
					 $this.prev(".talk").insert({"text":$(this).attr("title")});
				});	
				$(".faceBox").attr("style","display: block;");
				$(".faceBox a.close").on("click",function(){
					$(this).parents(".faceBox").remove();
				});
			}
			
		});
		//评论按钮
		$(".index_content_middle,.personal_content_right").on("click",function(event){
			if (event.target.className=="glyphicon glyphicon-comment") {
				$(event.target).parents(".home_content_state,.personal_content_state,.search_content_state").find(".home_content_comment").slideToggle(150);
				$(event.target).parents(".home_content_state,.personal_content_state,.search_content_state").find(".talk").attr("placeholder","评论");
				$(event.target).parents(".home_content_state,.personal_content_state,.search_content_state").find(".talk").val("");
				$(event.target).parents(".home_content_state,.personal_content_state,.search_content_state,.search_content_state").find(".talk").attr("floor",null);
				$(event.target).parents(".home_content_state,.personal_content_state,.search_content_state").find(".faceBox").remove();
			}
		})
		
		
		//删除信息按钮
		$(".personal_content_state .caret").on("click",function(event){
			event.stopPropagation();
			$(this).parents(".personal_content_state").find(".deleteTalk").slideToggle(100);
		});

		//弹出模态框居中
		$("[data-toggle='modal']").click(function(){
			var _target = $(this).attr('data-target')
			t=setTimeout(function () {
			var _modal = $(_target).find(".modal-dialog")
			_modal.animate({'margin-top': parseInt(($(window).height() - _modal.height())/2)}, 150 )
			},200)
		})
		//动态字数限制
		$("textarea.talk").on("keydown",function(event){
 			$(this).prev("p").text("剩余字数："+(140-$(this).val().length));
 			
 			if ($(this).val().length>=140&&event.keyCode!=8) {
 				return false;
 			}
 		})
		$("textarea.talk").on("keyup",function(event){
 			$(this).prev("p").text("剩余字数："+(140-$(this).val().length));
 			$(".txtHeight").text("");
 			$(".txtWidth").text("");
 			$(".txtHeight").append($(this).val().replace(/\s/g,'&nbsp;'));
 			$(".txtWidth").append($(this).val().replace(/\s/g,'&nbsp;'));
 			// console.log($(".txtHeight").height());
 			// console.log($(".txtWidth").width());

 		})
		//@ 框
		$(".index_content_middle").on("click",function(event){
			if ($(event.target).is(".call a:last-child")) {
				event.stopPropagation();
			}
			if ($(event.target).is(".call a:first-child")) {
				if (!$("#call")[0]) {
					var html="<div id='call'>";
					html+="<p></p><ul>";
					html+="<li userId='"+$(event.target).attr("userId")+"'><span>"+$(event.target).text()+"</span><span class='glyphicon glyphicon-remove-circle'></span></li>";
					html+="<input type='checkbox' name='callId' value='"+$(event.target).attr("id")+"' checked='checked'/>";
					html+="<input type='checkbox' name='callName' value='"+$(event.target).text()+"' checked='checked'/>";
					html+="</ul></div>";
					$(".sendTalk").after(html);
				}else{
					var	html="<li userId='"+$(event.target).attr("userId")+"'><span>"+$(event.target).text()+"</span><span class='glyphicon glyphicon-remove-circle'></span></li>";
					html+="<input type='checkbox' name='callId' value='"+$(event.target).attr("id")+"' checked='checked'/>";
					html+="<input type='checkbox' name='callName' value='"+$(event.target).text()+"' checked='checked'/>";
					$("#call ul").append(html);
				}
				$("#call p").text("已经 @ "+$("#call ul li").length+"人");
			}
			if ($(event.target).is(".glyphicon-remove-circle")) {
				$(event.target).parents("li").next("input").remove();
				$(event.target).parents("li").remove();
				$("#call p").text("已经 @ "+$("#call ul li").length+"人");
			}
		});
		$(".index_content_middle").on("mouseover",function(event){
			if ($(event.target).is("#call ul li,#call ul li span")) {
				$(event.target).find(".glyphicon-remove-circle").attr("style","color:#666;")
				$(event.target).siblings(".glyphicon-remove-circle").attr("style","color:#666;")
			}
			if ($(event.target).is(".glyphicon-remove-circle")) {
				$(event.target).attr("style","color:#666;")
			}
		})
		$(".index_content_middle").on("mouseout",function(event){
			if ($(event.target).is("#call ul li,#call ul li span")) {
				$(event.target).find(".glyphicon-remove-circle").attr("style","color:#e1e8ed;")
			}
		})

		//点击页面，删除按钮隐藏
		$(document).click(function(){
   			$(".deleteTalk").hide();
   			$(".call").hide();
		});	
		$(document).on("keydown",function(){
   			$(".call").hide();
		});	

	});
})(jQuery);
