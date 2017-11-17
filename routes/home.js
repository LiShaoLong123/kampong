var express = require('express');
var router = express.Router();
var check = require('../models/checkLog');
var Talk = require('../models/talk');
var Concern = require('../models/concern');
var User = require('../models/user');
var Comment = require('../models/comment');
var upload = require('../models/multerUtil');
var ObjectID = require('mongodb').ObjectID;

/* GET home page. */
router.get('/', check.checkLogin);
router.get('/', function(req, res, next) {
	// console.log(req.session.user);
	
	//获取当前账号的Talk信息
  	Talk.getOne(req.session.user.userId,function(err,talks){
		if (err) {
			talks = [];
		}
		//获取关注组的_id数组
		Concern.getByUserId(req.session.user.userId, function(err, concern) {
			
			if(concern.length == 0){
				req.flash('error','没有内容，去关注其他用户');
				//没有关注内容,查询自己的talk
				concern.push(req.session.user);
			}
			//获取关注组的user信息
			User.getByBeCrnId(concern,function(err,user){
				if(!user){
					req.flash('error','用户不存在');
					return res.redirect('/login');//用户不存在则跳转到登录页面
				}
					
				//将关注组用户信息存入session
				
				req.session.allConcernUer = user;
				var allConcernUer = user;
				if (user[0].userId!=req.session.user.userId) {
					allConcernUer.push(req.session.user);
				}
				//获取关组组的talksAll表
				Talk.getAll(allConcernUer,function(err,talksAll){
					if (err) {
						talksAll = [];
					}
					for (var i = 0; i < talksAll.length; i++) {
						for (var j = 0; j < allConcernUer.length; j++) {
							if(talksAll[i].userId==allConcernUer[j].userId){
								talksAll[i].userInfo = allConcernUer[j];
							}
						}
					}
					//获取fans列表
					Concern.getFans(req.session.user._id,function(err,fans){
						if(!fans){
							fans=[];
						}
						req.session.fans = fans;
						User.updateFansNum(req.session.user.userId,fans.length,function(err){
							if (err) {
								req.flash('error','存储失败')
								return res.redirect('/login');
							}
							User.updateCrnNum(req.session.user.userId,allConcernUer.length-1,function(err){
								if (err) {
									req.flash('error','存储失败')
								return res.redirect('/login');
								}
								// console.log(talksAll);
								if (req.query.loading) {
									return res.send(talksAll);
								}
								res.render('home', { 
						  			title: 'Weibo主页',
							  		user:req.session.user,
							 		talks:talks,
							  		fans:fans,
							 		crnUserlength:req.session.allConcernUer.length-1,
							 	 	talksAll:talksAll,
								  	success:req.flash('success').toString(),
									error:req.flash('error').toString()
								});
							});
						});
					});
				});
			});
		});
	});
});
//发微博
router.post('/', check.checkLogin);
router.post('/',upload.array('talkPic',9),function(req,res){
	var currentUer = req.session.user;
	var talkPic = req.files;
	if (talkPic.length==0 && req.body.talk.length==0) {
		return res.redirect('home');
	}
	var call = new Array();
	if (typeof(req.body.callId)=="string") {
		call.push({"callId":req.body.callId,"callName":req.body.callName,read:0})
	}else if (typeof(req.body.callId)=="object") {
		for (var i = 0; i < req.body.callId.length; i++) {
			call.push({"callId":req.body.callId[i],"callName":req.body.callName[i],read:0})
		}
	}

	
	var talk = new Talk(currentUer.userId,req.body.talk,talkPic,0,[],[],call); 
	talk.save(function(err){
		if (err) {
			req.flash('error',err);
			return res.redirect('home');
		}
		req.flash('success','发布成功！');
		return res.redirect('home');
	});
	// res.send({id:req.body.callId,name:req.body.callName})
});
//评论功能
router.post('/comment', check.checkLogin);
router.post('/comment',function(req,res){
	var comment =new Comment(req.body.talks_id,req.body.userId,req.body.rep_id,req.body.comment,req.body.floor);
	comment.save(function(err){
		if (err) {
			// console.log(err);
			req.flash('error',err);
			return res.redirect('home');
		}

		req.flash('success','评论成功！');
		Talk.getBy_Id(req.body.talks_id,function(err,talk){
			if (err) {
			req.flash('error',err);
			return res.redirect('home');
			}
			var allCom=[];
			for (var i = 0; i < talk.comments.length; i++) {
				allCom.push(talk.comments[i]);
				// for (var j = 0; j < talk.comment[i].reCom.length; j++) {
				// allCom.push(talk.comment[i].reCom[j]);
				// }
			}
			User.getByUserIdcol(allCom,function(err,user){
				for (var i = 0; i < allCom.length; i++) {
					for (var j = 0; j < user.length; j++) {
						if(allCom[i].userId==user[j].userId){
							allCom[i].userIdInfo=user[j]
						}
					}
				}
				User.getByBeCrnId(allCom,function(err,repuser){
					for (var i = 0; i < allCom.length; i++) {
						for (var j = 0; j < repuser.length; j++) {
							if(allCom[i].rep_id==repuser[j]._id){
								allCom[i].rep_idInfo=repuser[j]
							}
						}
					}
					allCom.sort(function(a,b){
						if (a.floor==b.floor) {
							return a.time-b.time;
						}else{
							return a.floor-b.floor;
						}
					})
					console.log(allCom);
				return res.send(allCom);	
					
				})
			})

		})
		
	});
});
// //评论回复
// router.post('/reComm', check.checkLogin);
// router.post('/reComm',function(req,res){
// 	var comment =new Comment(req.body.talks_id,req.body.userId,req.body.rep_id,req.body.comment,req.body.floor);
// 	comment.reComm(function(err){
// 		if (err) {
// 			req.flash('error',err);
// 			return res.redirect('home');
// 		}
// 		req.flash('success','评论成功！');
// 		Talk.getBy_Id(req.body.talks_id,function(err,talk){
// 			if (err) {
// 			req.flash('error',err);
// 			return res.redirect('home');
// 			}
// 			var allCom=[];
// 			for (var i = 0; i < talk.comment.length; i++) {
// 				allCom.push(talk.comment[i]);
// 				for (var j = 0; j < talk.comment[i].reCom.length; j++) {
// 				allCom.push(talk.comment[i].reCom[j]);
// 				}
// 			}
// 			User.getByUserIdcol(allCom,function(err,user){
// 				for (var i = 0; i < allCom.length; i++) {
// 					for (var j = 0; j < user.length; j++) {
// 						if(allCom[i].userId==user[j].userId){
// 							allCom[i].userIdInfo=user[j]
// 						}
// 					}
// 				}
// 				User.getByBeCrnId(allCom,function(err,repuser){
// 					for (var i = 0; i < allCom.length; i++) {
// 						for (var j = 0; j < repuser.length; j++) {
// 							if(allCom[i].rep_id==repuser[j]._id){
// 								allCom[i].rep_idInfo=repuser[j]
// 							}
// 						}
// 					}
// 				return res.send(allCom);	
					
// 				})
// 			})

// 		})
		
// 	});
// });
//页面加载显示评论
router.post('/comm', check.checkLogin);
router.post('/comm',function(req,res){
		Talk.getBy_Id(req.body.talks_id,function(err,talk){
			if (err) {
			req.flash('error',err);
			return res.redirect('home');
			}
			var allCom=[];
			for (var i = 0; i < talk.comments.length; i++) {
				allCom.push(talk.comments[i]);
				// for (var j = 0; j < talk.comment[i].reCom.length; j++) {
				// allCom.push(talk.comment[i].reCom[j]);
				// }
			}
			User.getByUserIdcol(allCom,function(err,user){
				for (var i = 0; i < allCom.length; i++) {
					for (var j = 0; j < user.length; j++) {
						if(allCom[i].userId==user[j].userId){
							allCom[i].userIdInfo=user[j]
						}
					}
				}

				User.getByBeCrnId(allCom,function(err,repuser){
					for (var i = 0; i < allCom.length; i++) {
						for (var j = 0; j < repuser.length; j++) {
							if(allCom[i].rep_id==repuser[j]._id){
								allCom[i].rep_idInfo=repuser[j];
							}

						}
					}

					allCom.sort(function(a,b){
						if (a.floor==b.floor) {
							return a.time-b.time;
						}else{
							return a.floor-b.floor;
						}
					})
					// console.log(allCom);
				return res.send(allCom);	
					
				})
			})

		})
});
//检查是否点赞
router.post('/checkLike', check.checkLogin);
router.post('/checkLike',function(req,res){
	// console.log(req.body.talks_id);
	// console.log(req.body.userId);
	Talk.getLike(req.body.talks_id,req.body.userId,function(err,message){
		// console.log(message);
		if (err) {
			req.flash('error',err);
			return res.redirect('home');
		}
		if (message) {
			return res.send({like:1});
		}else{
			return res.send({like:0});
		}
	})
})
//点赞
router.post('/Like', check.checkLogin);
router.post('/Like',function(req,res){

	Talk.getLike(req.body.talks_id,req.body.userId,function(err,message){
		// console.log(message);
		if (err) {
			req.flash('error',err);
			return res.redirect('home');
		}
		if (!message) {
			Comment.saveLike(req.body.talks_id,req.body.userId,function(err){
				if (err) {
					req.flash('error',err);
					return res.redirect('home');
				}
				req.flash('success',"点赞成功");
				Talk.getBy_Id(req.body.talks_id,function(err,msg){
					if (err) {
						req.flash('error',err);
						return res.redirect('home');
					}
					return res.send({
						message:msg,
						like:1
					});
				
				})
			})
		}else{
			return res.send({
				message:message,
				like:1
			});
		}
	})
})
//取消点赞
router.post('/unLike', check.checkLogin);
router.post('/unLike',function(req,res){
	Comment.unLike(req.body.talks_id,req.body.userId,function(err){
		if (err) {
			req.flash('error',err);
			return res.redirect('home');
		}
		req.flash('success',"取消成功");
		Talk.getBy_Id(req.body.talks_id,function(err,message){
			if (err) {
				req.flash('error',err);
				return res.redirect('home');
			}
			return res.send({
				message:message,
				like:0
			});
		})
		
	})
})
//动态 @别人
router.post('/call', check.checkLogin);
router.post('/call',function(req,res){
	Concern.getByUserId(req.session.user.userId, function(err, concern) {
		if(err || concern.length == 0) {
				req.flash('error', '没有关注的人立刻去<a href="search">关注</a>');
				concern = [];
			}
			User.getByBeCrnId(concern, function(err, user) {
				if(!user) {
					req.flash('error', '用户不存在');
					console.log("用户不存在")
					user = []; //用户不存在则跳转到登录页面
				}
				var concernUser = user;
				req.flash('success', '关注的人');
				// console.log(user);
				res.send(concernUser);
			});
		});
})
//消息提示页面
router.post('/message', check.checkLogin);
router.post('/message',function(req,res){
	//获取@，点赞，评论的内容
	Talk.getMessage(req.session.user._id,req.session.user.userId,function(err,message){
		var msgLength = 0 ;
		var msg = new Array();
		// console.log(message);
		if (err) {
			req.flash('error',err);
			return res.redirect('home');
		}
		// console.log(message);
		if (message) {
			for (var i = 0; i < message.length; i++) {
				for (var j = 0; j < message[i].comments.length; j++) {
					if ((message[i].comments[j].rep_id==req.session.user._id&&message[i].comments[j].userId!=req.session.user.userId)) {
						message[i].comments[j].talks_id=message[i]._id;
						msg.push(message[i].comments[j]);
					}
					// for (var k = 0; k < message[i].comment[j].reCom.length; k++) {
					// 	if (message[i].comment[j].reCom[k].rep_id==req.session.user._id&&message[i].comment[j].reCom[k].userId!=req.session.user.userId) {
					// 		message[i].comment[j].reCom[k].talks_id=message[i]._id;
					// 		msg.push(message[i].comment[j].reCom[k]);
					// 	}
					// }
				}
				for (var j = 0; j < message[i].call.length; j++) {
					if (message[i].call[j].callId==req.session.user._id&&message[i].userId!=req.session.user.userId) {
						message[i].call[j].callTime=message[i].talkTime;
						message[i].call[j].userId=message[i].userId;
						message[i].call[j].talks_id=message[i]._id;
						msg.push(message[i].call[j]);
					}
					
				}
				for (var j = 0; j < message[i].like.length; j++) {
					if (message[i].like[j].likeUserId!=req.session.user.userId&&message[i].userId==req.session.user.userId) {
						message[i].like[j].talks_id=message[i]._id;
						msg.push(message[i].like[j]);
					}
				}
			}
			
			//排序
	  		// console.log(msg);
			msg.sort(function(a,b){
				if (b.commentTime) {
					b.time = b.commentTime.date;
				}else if (b.callTime) {
					b.time = b.callTime.date;
				}else if (b.likeTime) {
					b.time = b.likeTime.date;
				}

				if (a.commentTime) {
					a.time = a.commentTime.date;
				}else if (a.callTime) {
					a.time = a.callTime.date;
				}else if (a.likeTime) {
					a.time = a.likeTime.date;
				}

				if (a.read==b.read) {
					return b.time-a.time;
				}else{
					return a.read-b.read;
				}
	        });

	  		// console.log(msg);
			User.getByUserIdcol(msg,function(err,user){
				for (var i = 0; i < msg.length; i++) {
					for (var j = 0; j < user.length; j++) {
						if(msg[i].userId==user[j].userId||msg[i].likeUserId==user[j].userId){
							msg[i].userIdInfo=user[j]
						}
					}
				}

				return res.send(msg);
			})
		}else{
			return res.send(0);
		}

	})
})
module.exports = router;
