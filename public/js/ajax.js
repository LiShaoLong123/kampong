;(function($){
	var waterfall=5;
	var oldwaterfall=0;

	$(function(){

		//personal页面删除按钮
		$(".deleteTalk").on("click",function(e){
			var $this=$(this);
			$("#deleteTalk").on("click",function() {
			var talksId = $this.parents(".personal_content_state").find("p:first-child>a:first-child").attr("name");
			$.post("/personal/remove",{
				talksId:talksId,
			},function(data,textStatus){
				// console.log(data);
				window.location.reload();
			});
			$('#myModal').modal('hide');
			})
		});
		//个人空间关注按钮
		$(".concernBtn").each(function(){
			if($(".concernBtn").val()==1){
				$(".concernBtn").text("取消关注");
				$(".concernBtn").val(1);
				
			}else{
				$(".concernBtn").text("关注他/她");
				$(".concernBtn").val(0);
			}
		})
		$(".concernBtn").on("click",function(){
			var userId=$(".glyphicon-user").attr("userId");
			var beCrnId=$(".name").attr("userId");
			if($(".concernBtn").val()==0){
				$.post("/personal/concern",{
					userId:userId,
					beCrnId:beCrnId
				},function(data,textStatus){
					$(".concernBtn").text("取消关注");
					$(".concernBtn").val(data.val);
				})
			}else{
				$.post("/personal/crnRemove",{
					userId:userId,
					beCrnId:beCrnId
				},function(data,textStatus){
					$(".concernBtn").text("关注他/她");
					$(".concernBtn").val(data.val);
				})
			}
		})



		//搜索页面关注按钮
		$(".searchCrn").each(function(){
			var userId=$(".glyphicon-user").attr("userId");
			var beCrnId=$(this).parents("p").find(".name").attr("userId");
			var $this=$(this);
			$.ajaxSetup({ 
			    async : false 
			});   
			$.post("search/checkCrn",{
				userId:userId,
				beCrnId:beCrnId
			},function(data,textStatus){
				$this.val(data.val);
				if($this.val()==1){
					$this.text("取消关注");
					$this.val(1);
				}else{
					$this.text("关注他/她");
					$this.val(0);
				}
			})
		})


		$(".searchCrn").on("click",function(){
			var userId=$(".glyphicon-user").attr("userId");
			var beCrnId=$(this).parents("p").find(".name").attr("userId");
			var $this=$(this);
			if($this.val()==0){
				$.post("/search/concern",{
					userId:userId,
					beCrnId:beCrnId
				},function(data,textStatus){
					// console.log(data);
					$this.text("取消关注");
					$this.val(data.val);
				})
			}else{
				$.post("/search/crnRemove",{
					userId:userId,
					beCrnId:beCrnId
				},function(data,textStatus){
					// console.log(data);
					$this.text("关注他/她");
					$this.val(data.val);
				})
			}
		})

	//评论、点赞功能的函数
	function comment(){
		
		//home页面评论按钮
		$(".index_content_middle,.personal_content_right").click(function(event){
			if (event.target.className=="btn-xs btn-info commentBtn") {
			var userId=$(".glyphicon-user").attr("userId");
			var rep_id=$(event.target).parents(".home_content_comment").find(".talk").attr("rep_id");
			var comment=$(event.target).parents(".home_content_comment").find(".talk").val();
			var floor=$(event.target).parents(".home_content_comment").find(".talk").attr("floor");
			var talks_id=$(event.target).parents(".home_content_state,.personal_content_state").find("div>p>a").attr("name");
			var $this=$(event.target);
			var html="";
			// console.log(1111111111);
			//评论talks
			if(!floor){
				floor=$(event.target).parents(".home_content_comment").find(".comm").length+1;
			}
				// console.log(floor);
			if (comment) {	
				$.post("/home/comment",{
					talks_id:talks_id,
					userId:userId,
					rep_id:rep_id,
					comment:comment,
					floor:floor
				},function(data,textStatus){
					$this.parents(".home_content_comment").find(".comm").remove();
					for (var i = 0; i < data.length;i++) {
						html+="<div class='comm'>"
						html+="<div rep_id='"+data[i].userIdInfo._id+"'>"
						html+="	   <a href='/personal/"+data[i].userIdInfo._id+"' >"+data[i].userIdInfo.userName+"</a>"
						html+="	   <a class='comment_talks'>："+data[i].comment+"</a>"
						html+="</div>"
						for (var j = i+1; j < data.length; j++) {
							if (data[i].floor==data[j].floor) {
								html+="<div rep_id='"+data[j].userIdInfo._id+"'>"
								html+="		<a href='/personal/"+data[j].userIdInfo._id+"' >"+data[j].userIdInfo.userName+"</a>"
								html+="		<a class='comment_talks'>回复</a>"
								html+="		<a href='/personal/"+data[j].rep_idInfo._id+"'>"+data[j].rep_idInfo.userName+"</a>"
								html+="		<a class='comment_talks'>："+data[j].comment+"</a>"
								html+="</div>"
								i++;
							}

						}
						html+="</div>"
					}


				})
			}
			// } else {
			// 	//回复评论
			// 	$.post("/home/reComm",{
			// 		talks_id:talks_id,
			// 		userId:userId,
			// 		rep_id:rep_id,
			// 		comment:comment,
			// 		floor:floor
			// 	},function(data,textStatus){
			// 		$this.parents(".home_content_comment").find(".comm").remove();
			// 		for (var i = 0; i < data.length;i++) {
			// 			html+="<div class='comm'>"
			// 			html+="<div rep_id='"+data[i].userIdInfo._id+"'>"
			// 			html+="	   <a href='/personal/"+data[i].userIdInfo._id+"' >"+data[i].userIdInfo.userName+"</a>"
			// 			html+="	   <a class='comment_talks'>："+data[i].comment+"</a>"
			// 			html+="</div>"
			// 			for (var j = i+1; j < data.length; j++) {
			// 				if (data[i].floor==data[j].floor) {
			// 					html+="<div rep_id='"+data[j].userIdInfo._id+"'>"
			// 					html+="		<a href='/personal/"+data[j].userIdInfo._id+"' >"+data[j].userIdInfo.userName+"</a>"
			// 					html+="		<a class='comment_talks'>回复</a>"
			// 					html+="		<a href='/personal/"+data[j].rep_idInfo._id+"'>"+data[j].rep_idInfo.userName+"</a>"
			// 					html+="		<a class='comment_talks'>："+data[j].comment+"</a>"
			// 					html+="</div>"
			// 					i++;
			// 				}

			// 			}
			// 			html+="</div>"
			// 		}

			// 	})

			// }
			//评论完之后评论框的状态恢复
			$(".home_content_comment").find(".talk").val("");
			$(".home_content_comment").find(".talk").attr("floor",null);
			$(".home_content_comment").find(".talk").attr("placeholder","评论");
			$this.parents(".home_content_comment").append(html);
			$this.parents(".home_content_comment").find(".faceBox").remove();
			// console.log($(".home_content_comment").find(".talk").attr("rep_id"));
			$('.home_content_comment>div.comm').each(function(){
					$(this).replaceface();
				//点击评论定位到评论框
					$(this).find("div").on("click",function(){
					$(this).parents(".home_content_comment").find(".talk").attr("placeholder","回复 "+$(this).children("a:first-child").text());
					$(this).parents(".home_content_comment").find(".talk").focus();
					$(this).parents(".home_content_comment").find(".talk").val("");
					$(this).parents(".home_content_comment").find(".talk").attr("floor",$(this).parents(".comm").index());
					$(this).parents(".home_content_comment").find(".talk").attr("rep_id",$(this).attr("rep_id"));
				})
			});
			$(".glyphicon-comment").each(function(){
				$(this).text(" "+$(this).parents(".home_content_state,.personal_content_state").find(".comm div").length);
			})
			return false;
			}
			
		})
		//点赞功能
		$(".index_content_middle,.personal_content_right").on("click",function(event){
			if (event.target.className=="glyphicon glyphicon-thumbs-up") {
				var talks_id=$(event.target).parents(".home_content_state,.personal_content_state").find("div>p>a").attr("name");
				var userId=$(".glyphicon-user").attr("userId");
				var like=$(event.target).attr("like");
				var $this=$(event.target);
				// console.log(like);
				if (like==0) {
					$.post("/home/Like",{
						userId:userId,
						talks_id:talks_id
					},function(data,textStatus){

						$this.text(" "+data.message.like.length);
						//已赞，颜色为蓝色
						$this.attr("style","color:rgb(58,158,238);")
						$this.attr("like",1);
					})
				}else{

					$.post("/home/unLike",{
						userId:userId,
						talks_id:talks_id
					},function(data,textStatus){
						$this.text(" "+data.message.like.length);
						//未赞，颜色为灰色
						$this.attr("style","color:rgb(102,102,102);");
						$this.attr("like",0);
					})
				}
			}
		})
	}
		function getComm(){
			//点击获取评论
			$(".index_content_middle,.personal_content_state").on("click",function(){
				if (event.target.className==="glyphicon glyphicon-comment") {
				var talks_id=$(event.target).parents(".home_content_state,.personal_content_state").find("div>p>a").attr("name");
				var $this=$(event.target).parents(".home_content_state,.personal_content_state");
				$this.find(".home_content_comment .comm").remove();
				$.ajaxSetup({
				    async : false 
				}); 
				$.post("/home/comm",{
						talks_id:talks_id
					},function(data,textStatus){
						// console.log(data);
						var html="";
						for (var i = 0; i < data.length;i++) {
							html+="<div class='comm'>"
							html+="<div rep_id='"+data[i].userIdInfo._id+"'>"
							html+="	   <a href='/personal/"+data[i].userIdInfo._id+"' >"+data[i].userIdInfo.userName+"</a>"
							html+="	   <a class='comment_talks'>："+data[i].comment+"</a>"
							html+="</div>"
							for (var j = i+1; j < data.length; j++) {
								if (data[i].floor==data[j].floor) {
									html+="<div rep_id='"+data[j].userIdInfo._id+"'>"
									html+="		<a href='/personal/"+data[j].userIdInfo._id+"' >"+data[j].userIdInfo.userName+"</a>"
									html+="		<a class='comment_talks'>回复</a>"
									html+="		<a href='/personal/"+data[j].rep_idInfo._id+"'>"+data[j].rep_idInfo.userName+"</a>"
									html+="		<a class='comment_talks'>："+data[j].comment+"</a>"
									html+="</div>"
									i++;
								}

							}
							html+="</div>"
						}
						$this.find(".home_content_comment").append(html);
						$('.home_content_comment>div.comm').each(function(){
							$(this).replaceface();
							//点击评论定位到评论框
							$(this).find("div").on("click",function(){
								$(this).parents(".home_content_comment").find(".talk").attr("placeholder","回复 "+$(this).children("a:first-child").text());
								$(this).parents(".home_content_comment").find(".talk").focus();
								$(this).parents(".home_content_comment").find(".talk").val("");
								$(this).parents(".home_content_comment").find(".talk").attr("floor",$(this).parents(".comm").index());
								$(this).parents(".home_content_comment").find(".talk").attr("rep_id",$(this).attr("rep_id"));
							})
						});
					})
				}
			})

			// //评论数
			// $(".glyphicon-comment").each(function(){
			// 	$(this).text(" "+$(this).parents(".home_content_state,.personal_content_state").find(".comm div").length);
			// })
		}
		function checkLike(){
			//点赞按钮
			$(".glyphicon-thumbs-up").each(function(){
				//检查是否点赞
				var talks_id=$(this).parents(".home_content_state,.personal_content_state").find("div>p>a").attr("name");
				var userId=$(".glyphicon-user").attr("userId");
				var $this=$(this);
				$.ajaxSetup({
				    async : false 
				}); 
				$.post("/home/checkLike",{
					userId:userId,
					talks_id:talks_id
				},function(data,textStatus){
					if(data.like==0){
						//未赞，颜色为灰色
						$this.attr("style","color:rgb(102,102,102);")
						$this.attr("like",0);
					}else{
						//已赞，颜色为蓝色
						$this.attr("style","color:rgb(58,158,238);")
						$this.attr("like",1);
					}
				})
			})
		}
		getComm();//获取评论
		checkLike();//检查是否点赞
		comment();//调用评论、点赞的函数

		//置顶按钮
		 $('.home_Stickie,.search_Stickie,.personal_Stickie').click(function(){
		 	$('html,body').animate({scrollTop: '0px'}, 200);
		 });
		$(window).scroll(function(){
			//页面滚动显示置顶按钮
			var homeLef = $(".index_content").outerWidth(true)/2+$(".index_content").innerWidth()/2;
			var searchLef = $(".search_content").outerWidth(true)/2+$(".search_content").innerWidth()/2;

			if($(window).scrollTop()>200){
				$(".home_Stickie").attr("style","display: block;left:"+homeLef+"px;");
				$(".search_Stickie").attr("style","display: block;left:"+searchLef+"px;");
				$(".personal_Stickie").attr("style","display: block;left:"+homeLef+"px;");
			}
			else{
				$(".home_Stickie,.search_Stickie,.personal_Stickie").attr("style","display: none;");
			}

			//瀑布流加载
			if ($(document).height()-$(window).scrollTop()<$(window).height()+150&&oldwaterfall!=waterfall) {
				$.ajaxSetup({ 
				    async : false 
				}); 
				$.get("../home",{loading:1},function(date){
			        var html="";
			        var temp=waterfall;
			        var commLength;
			        var userId=$(".glyphicon-user").attr("userId");
			        //记录瀑布流的高度，用于检验是否到底
			        oldwaterfall=waterfall;
			        if (date.length>waterfall+5) {
			        	waterfall+=5;
			        }else{
			        	waterfall=date.length;
			        }
			        if (waterfall!=temp) {
				        for (var i = temp; i < waterfall; i++) {
			        		var like = 0;
			        		for (var l = 0; l < (date[i].like.length); l++) {
			        			if(date[i].like[l].likeUserId==userId){
			        				like=1;
			        			};
			        		}
						html+="<div class='home_content_state panel'>";
						html+="		<a href='personal/"+ date[i].userInfo._id+"'><img class='img-circle' src='"+date[i].userInfo.userPic +"' /></a>";
						html+="		<div>";
						html+="			<p>";
						html+="				<a href='personal/"+ date[i].userInfo._id+"' name='"+ date[i]._id +"' userId='"+ date[i].userInfo.userId+"'>";
						html+=date[i].userInfo.userName+"</a></p>";
						html+="				<p>"+date[i].talkTime.minute;+"</p>"
						html+="				<p>"+date[i].talk+"</p>"
						html+="		<div>"
									for(var j=0;j < date[i].talkPic.length;j++){ 
										html+="<img src='./uploads/"+date[i].userInfo._id+"/"+date[i].talkPic[j].filename+"'/>"
									}
						html+="		</div>"
						html+="</div>"
						html+="		<ul>"
						// html+="			<li><span class='glyphicon glyphicon-share'>&nbsp"+ date[i].share+"</span></li>"
						html+="			<li><span class='glyphicon glyphicon-comment'>&nbsp"+ date[i].comments.length+"</span></li>"
						html+="			<li><span class='glyphicon glyphicon-thumbs-up' like='"+like+"'>&nbsp"+ date[i].like.length+"</span></li>"
						html+="		</ul>"
						html+="		<div class='home_content_comment'>"
						html+="			<form action='/home/comment' method='post'>"
						html+="				<div>"
						html+="				<input type='text' class='talk' name='comment' rep_id='"+date[i].userInfo._id+"' placeholder='评论'/>"
						html+="				<span class='glyphicon glyphicon-piggy-bank'></span>"
						html+="				<button type='button' class='btn-xs btn-info commentBtn'>评论</button>"
						html+="				</div>"
						html+="			</form>"
						html+="		</div>"
						html+="</div>"

						}
						$(".index_content_middle").append(html);
						$(".glyphicon-thumbs-up").each(function(){
							var like=$(this).attr("like");
							var $this=$(this);
							if(like==0){
								//未赞，颜色为灰色
								$this.attr("style","color:rgb(102,102,102);")
							}else if (like==1){
								//已赞，颜色为蓝色
								$this.attr("style","color:rgb(58,158,238);")
							}
						})
						$('.home_content_state div').each(function(event){
							$(this).replaceface();
						});
						
					}
				

			    })
			}
			

		})

		//发布动态 @ 别人
		$("textarea.talk").on("keydown",function(event){
 			if(event.key=="@"){
				event.stopPropagation();
				var html="<div class='call'>";
					html+="<p>选择想 @ 的人</p>";

				$.post("/home/call",function(data,textStatus){
					for (var i = 0; i < data.length; i++) {
						html+="<p>";
						html+="		<a id='"+data[i]._id+"'>"+data[i].userName+"</a>";
						html+="		<a target='_blank' href='personal/"+data[i]._id+"' class='glyphicon glyphicon-eye-open'></a>";
						html+="	</p>";
					}
					html+="		</p>";
					html+="	</div>";
					$(".index_content_middle").prepend(html);
					$(".call").attr("style","margin:"+(52+$(".txtHeight").height())+"px 0 0 "+(27+$(".txtWidth").width()%548)+"px");
				})
 				$("textarea.talk").on("keyup",function(){
 					$(this).val($(this).val().replace(/[@\/]/g,''));
 				})
 			}
		})
		//消息按钮
		$(".glyphicon-envelope,.message").each(function(){
			$.ajaxSetup({ 
			    async : false 
			}); 
			$.post("/home/message",function(data,textStatus){
				if (data!=0) {
				var sum=0;
				for (var i = 0; i < data.length; i++) {
					if (data[i].read==0) {
						sum++;
					}
				}

				$(".glyphicon-envelope").text(" 新消息"+"("+sum+")");
				var html="";
				var leg;
				if (data.length > 4) {
					leg =4;
				}else{
					leg =data.length;
				}
				console.log(data);
				for (var i = 0; i < leg; i++) {
					html+="<div class='message_single'>";
					html+="		<a href='#'><img class='img-circle' src='"+data[i].userIdInfo.userPic+"'/></a>";
					html+="		<div>";
					html+="			<p><a target='_blank' href='../personal/"+data[i].userIdInfo._id+"'>"+data[i].userIdInfo.userName+"</a>";
					if (data[i].callId) {
						html+=" </p><p><a target='_blank' class='msgRemind' href='../info/"+data[i].talks_id+"' > @ 提到了你</a></p>";
						html+="			<p>"+data[i].callTime.minute+"</p>";
					}else if (data[i].likeUserId) {
						html+=" </p><p><a target='_blank' class='msgRemind' href='../info/"+data[i].talks_id+"' >赞了你的动态</a></p>";
						html+="			<p>"+data[i].likeTime.minute+"</p>";
					}else if (data[i].comment) {
						html+=" 回复你：</p><p><a target='_blank' class='msgRemind'  href='../info/"+data[i].talks_id+"' >"+data[i].comment+"</a></p>";
						html+="			<p>"+data[i].commentTime.minute+"</p>";
					}
					html+="		</div>";
					html+="	</div>";
				}
				//分页
				var ul="<li class='disabled'><a href='#' aria-label='Previous'><span aria-hidden='true'>&laquo;</span></a></li>";
				for (var i = 0; i < Math.ceil(data.length/4); i++) {
					// if (i<2) {
						ul+="<li><a href='#'>"+(i+1)+"</a></li>";
					// }else if(i==2){
					// 	ul+="<li class='omit'><a>...</a></li>";
					// }
				}
				ul+="<li><a href='#' aria-label='Next'><span aria-hidden='true'>&raquo;</span></a></li>";
				$(".message+.paging ul.pagination").append(ul);
				$(".message").append(html);
				}
			})

		})
		$(".paging").each(function(){
			$(this).find("li:nth-child(2)").addClass("active");

		})
		//分页按钮
		$(".paging").on("click",function(){
			if ($(event.target).is("li a")&& !$(event.target).is("li.omit a")&& !$(event.target).is("li:first-child a,li:last-child a")) {
				$(event.target).parents("li").addClass("active").siblings("li").removeClass("active");
				if ($("li:nth-child(2)").hasClass("active")) {
					$("li:first-child").addClass("disabled");
				}else{
					$("li:first-child").removeClass("disabled");
				}
				if ($("li:nth-last-child(2)").hasClass("active")) {
					$("li:last-child").addClass("disabled");
				}else{
					$("li:last-child").removeClass("disabled");
				}
			}
			if ($(event.target).is("li:last-child a,li:last-child a span")&& !$(event.target).is("li.disabled a,li.disabled a span")) {
				$(event.target).parents("li").siblings("li.active").removeClass("active").next().addClass("active");
				if ($("li:nth-child(2)").hasClass("active")) {
					$("li:first-child").addClass("disabled");
				}else{
					$("li:first-child").removeClass("disabled");
				}
				if ($("li:nth-last-child(2)").hasClass("active")) {
					$("li:last-child").addClass("disabled");
				}else{
					$("li:last-child").removeClass("disabled");
				}
			}
			if ($(event.target).is("li:first-child a,li:first-child a span")&& !$(event.target).is("li.disabled a,li.disabled a span")) {
				$(event.target).parents("li").siblings("li.active").removeClass("active").prev().addClass("active");
				if ($("li:nth-child(2)").hasClass("active")) {
					$("li:first-child").addClass("disabled");
				}else{
					$("li:first-child").removeClass("disabled");
				}
				if ($("li:nth-last-child(2)").hasClass("active")) {
					$("li:last-child").addClass("disabled");
				}else{
					$("li:last-child").removeClass("disabled");
				}
			}
			//分页功能
			// console.log($("li.active").text());

			$.post("/home/message",function(data,textStatus){
				var html="";
				var leg;
				var page=$("li.active").text();
				if (data.length > 4*page) {
					leg =4*page;
				}else{
					leg =data.length;
				}
				$(".message").find(".message_single").remove();
				// console.log(data);
				for (var i = (page-1)*4; i < leg; i++) {
					html+="<div class='message_single'>";
					html+="		<a href='#'><img class='img-circle' src='"+data[i].userIdInfo.userPic+"'/></a>";
					html+="		<div>";
					html+="			<p><a target='_blank' href='../personal/"+data[i].userIdInfo._id+"'>"+data[i].userIdInfo.userName+"</a>";
					if (data[i].callId) {
						html+=" </p><p><a target='_blank' class='msgRemind' href='../info/"+data[i].talks_id+"' > @ 提到了你</a></p>";
						html+="			<p>"+data[i].callTime.minute+"</p>";
					}else if (data[i].likeUserId) {
						html+=" </p><p><a target='_blank' class='msgRemind' href='../info/"+data[i].talks_id+"' >赞了你的动态</a></p>";
						html+="			<p>"+data[i].likeTime.minute+"</p>";
					}else if (data[i].comment) {
						html+=" 回复你：</p><p><a target='_blank' class='msgRemind'  href='../info/"+data[i].talks_id+"' >"+data[i].comment+"</a></p>";
						html+="			<p>"+data[i].commentTime.minute+"</p>";
					}
					html+="		</div>";
					html+="	</div>";
				}
				$(".message").append(html);
				//表情解析
				$('.message_single div').each(function(){
					  	$(this).replaceface();
				});
			})
			return false;
		});
		

		//注册页面表单验证
		$("#userId").blur(function(){
			var userId=$(this).val();
			var $this=$(this);
			if ($(this).val()=="") {
				$(this).parent("div").append("<span>帐号不能为空</span>")
				$("#regBtn").on("click",function(){
					return false;
				})
			}else{
				$.post("../register/checkUserId",{
					userId:userId
				},function(data,textStatus){
					if (data=="用户已存在") {
						$this.parent("div").append("<span>"+data+"</span>");
						$("#regBtn").on("click",function(){
							return false;
						})
					}else if(data=="帐号可使用"){
						$this.parent("div").append("<span style='color:green;'>"+data+"</span>");
						$("#regBtn").on("submit",function(){
							return true;
						})
					}

				})
			}
		})
		$("#password").blur(function(){
			if ($(this).val()=="") {
				$(this).parent("div").append("<span>密码不能为空</span>")
			}
		})
		$("#re_password").blur(function(){
			if ($(this).val()==""||$(this).val()!=$("#password").val()) {
				$(this).parent("div").append("<span>密码必须一致</span>")
			}
		})
		$("#userId").focus(function(){
				$(this).parent("div").find("span").remove();
		})
		$("#password").focus(function(){
				$(this).parent("div").find("span").remove();
		})
		$("#re_password").focus(function(){
				$(this).parent("div").find("span").remove();
		})
		// $("#regBtn").on("submit",function(){
		// 	if ($("#password").val()==""||$("#re_password").val()==""||$("#userId").val()=="") {
		// 		return false;
		// 	}else if ($("#userId").parent("div").find("span").text()=="帐号可使用"&& $("#password").parent("div").find("span").text()!="密码不能为空"&&$("#re_password").parent("div").find("span").text()!="密码必须一致") {
		// 		return true;
		// 	}
		// })

	});
})(jQuery);